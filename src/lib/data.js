"use server";

import { Portfolio, Transaction, User } from "./models";
import { connectToDb, isTradingDay } from "./utils";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { aggregateTransactions, addCurrentPrices } from "@/lib/action";
import { addToQueue } from "./PolygonCallsQueue";
import { subDays } from "date-fns";
import { getCachedPrice, savePriceToCache } from "./cache";

export const getUser = async (id) => {
  noStore();
  try {
    connectToDb();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const getUsers = async () => {
  try {
    connectToDb();
    const users = await User.find();
    const transformedUsers = users.map((user) => {
      const userObj = user.toObject();
      return {
        ...userObj,
        _id: userObj._id.toString(),
        id: userObj._id.toString(),
        createdAt: userObj.createdAt.toISOString(),
        updatedAt: userObj.updatedAt.toISOString(),
      };
    });

    return transformedUsers;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const getTransactions = async () => {
  try {
    connectToDb();
    const transactions = await Transaction.find();
    const transformedTransactions = transactions.map((transaction) => {
      const transactionObj = transaction.toObject();
      return {
        ...transactionObj,
        _id: transactionObj._id.toString(),
        id: transactionObj._id.toString(),
        createdAt: transactionObj.createdAt.toISOString(),
        updatedAt: transactionObj.updatedAt.toISOString(),
      };
    });

    return transformedTransactions;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch transactions!");
  }
};

export const getUserTransactions = async () => {
  try {
    const session = await auth();
    connectToDb();
    const transactions = await Transaction.find({ userId: session?.user?.id });
    const transformedTransactions = transactions.map((transaction) => {
      const transactionObj = transaction.toObject();
      return {
        ...transactionObj,
        _id: transactionObj._id.toString(),
        id: transactionObj._id.toString(),
        userId: transactionObj.userId.toString(),
        createdAt: transactionObj.createdAt.toISOString(),
        updatedAt: transactionObj.updatedAt.toISOString(),
      };
    });

    return transformedTransactions;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch transactions!");
  }
};

export const buildPortfolio = async (session) => {
  try {
    connectToDb();
    const portfolio = await Portfolio.findOne({ userId: session?.user?.id })
      .populate("transactions")
      .exec();
    const transactions = portfolio?.transactions;
    const stockAggregation = await aggregateTransactions(transactions);
    const filteredStocks = Object.fromEntries(
      Object.entries(stockAggregation).filter(
        ([key, stock]) => stock.totalShares > 0
      )
    );
    const stocks = await addCurrentPrices(filteredStocks, "high");
    return Object.values(stocks);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Portfolio transactions!");
  }
};

export const getWallet = async () => {
  try {
    const session = await auth();
    connectToDb();
    const user = await User.findById(session?.user?.id);
    return user.wallet;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Wallet!");
  }
};

export const updateWallet = async (diff) => {
  try {
    const session = await auth();
    connectToDb();

    return await User.findByIdAndUpdate(
      session?.user?.id,
      { $inc: { wallet: diff } },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Wallet!");
  }
};

export async function fetchHistoricalPrices(ticker) {
  let tradingDaysProcessed = 0;
  let daysChecked = 0;

  while (tradingDaysProcessed < 7) {
    const date = subDays(new Date(), daysChecked + 1);
    if (isTradingDay(date)) {
      const dateOnly = date.toISOString().split("T")[0];

      const cachedPrice = await getCachedPrice(ticker, dateOnly);
      if (!cachedPrice) {
        createClosePriceApiCall(ticker, dateOnly).then((closePrice) => {
          savePriceToCache(ticker, closePrice, dateOnly);
        });
      }

      tradingDaysProcessed += 1;
    }
    daysChecked += 1;
  }
}

export const createClosePriceApiCall = async (ticker, dateOnly) => {
  const apiCall = async () => {
    const response = await fetch(
      `https://api.polygon.io/v1/open-close/${ticker}/${dateOnly}?apiKey=${process.env.POLYGON_API_KEY}`
    );
    const data = await response.json();
    return data?.close;
  };
  const closePrice = await addToQueue(apiCall, "low");
  return closePrice;
};
