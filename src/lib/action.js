"use server";

import { revalidatePath } from "next/cache";
import { Transaction, User, Portfolio } from "./models";
import { connectToDb, getLastTradingDate } from "./utils";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { getWallet, updateWallet } from "./data";
import { fetchLastClosingPrice, fetchPriceFromPolygon } from "./polygonApi";
import { v4 as uuidv4 } from "uuid";
import { getCachedPrice, savePriceToCache } from "./cache";
import { changeWallet } from "./walletService";

export const addUser = async (prevState, formData) => {
  const { firstName, lastName, email, password, img, isAdmin } =
    Object.fromEntries(formData);
  try {
    connectToDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      img,
      isAdmin,
    });
    await newUser.save();
    console.log("newUser", newUser);
    revalidatePath("/admin/users");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const deleteUser = async (id) => {
  console.log("deleting", id);

  try {
    connectToDb();
    await User.findByIdAndDelete(id);
    console.log("deleted user from db");
    revalidatePath("/admin/users");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const addTransaction = async (prevState, formData) => {
  const session = await auth();
  const { ticker, price, executedAt, operation, papers } =
    Object.fromEntries(formData);
  try {
    connectToDb();
    const liquid = await getWallet();
    const assetValue = operation === "buy" ? price * papers : -price * papers;
    const newLiquid = liquid - assetValue;
    if (newLiquid < 0) {
      return {
        error: "Insufficient funds. You cannot proceed with the transaction.",
      };
    }
    const updatedUser = updateWallet(newLiquid);

    const newTransaction = new Transaction({
      userId: session?.user?.id,
      ticker,
      price,
      executedAt,
      operation,
      papers,
    });
    await newTransaction.save();
    console.log("newTransaction", newTransaction);
    const portfolio = await Portfolio.findOne({ userId: session?.user?.id });
    //if !portfolio create new one?
    portfolio.transactions.push(newTransaction._id);
    portfolio.totalValue +=
      operation === "buy" ? price * papers : -(price * papers);

    await portfolio.save();
    console.log("Updated Portfolio:", portfolio);

    revalidatePath("/admin/transactions");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const deleteTransaction = async (id) => {
  try {
    connectToDb();
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return { error: "Transaction not found" };
    }
    const { price, papers } = transaction;
    console.log("price", price);
    console.log("papers", papers);

    const assetValue = (price * papers).toString();
    const operation = transaction.operation === "buy" ? "deposit" : "withdraw";
    await Transaction.findByIdAndDelete(id);
    // console.log("deleted from db", transaction);
    console.log(await changeWallet(assetValue, operation));
    revalidatePath("/admin/transactions");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const aggregateTransactions = (transactions) => {
  const stockAggregation = {};

  transactions.forEach((transaction) => {
    const { ticker, price, papers, operation } = transaction;
    if (!stockAggregation[ticker]) {
      stockAggregation[ticker] = {
        id: uuidv4(),
        ticker,
        totalShares: 0,
        totalInvestment: 0,
        averagePrice: 0,
      };
    }

    if (operation === "buy") {
      stockAggregation[ticker].totalShares += papers;
      stockAggregation[ticker].totalInvestment += price * papers;
    } else {
      stockAggregation[ticker].totalShares -= papers;
      stockAggregation[ticker].totalInvestment -= price * papers;
    }

    if (stockAggregation[ticker].totalShares > 0) {
      stockAggregation[ticker].averagePrice =
        stockAggregation[ticker].totalInvestment /
        stockAggregation[ticker].totalShares;
    }
  });

  return stockAggregation;
};

export const addCurrentPrices = async (stockAggregation) => {
  const date = getLastTradingDate();
  const dateOnly = date.toISOString().split("T")[0];
  for (const stock of Object.values(stockAggregation)) {
    try {
      const cachedPrice = await getCachedPrice(stock.ticker, dateOnly);
      if (cachedPrice !== null) {
        stock.currentPrice = cachedPrice;
      } else {
        const price = await fetchLastClosingPrice(stock.ticker);
        stock.currentPrice = price;
        await savePriceToCache(stock.ticker, price, dateOnly);
      }
      stock.change = stock.currentPrice - stock.averagePrice;
      stock.unrealizedPL =
        (stock.currentPrice - stock.averagePrice) * stock.totalShares;
    } catch (error) {
      console.error(`Failed to fetch price for ${stock.ticker}:`, error);
      stock.currentPrice = null;
    }
  }

  return stockAggregation;
};
