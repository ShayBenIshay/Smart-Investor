"use server";

import { Portfolio, Transaction, User } from "./models";
import { connectToDb } from "./utils";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { aggregateTransactions, addCurrentPrices } from "@/lib/action";

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
