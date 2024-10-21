"use server";

import { revalidatePath } from "next/cache";
import { Transaction, User, Portfolio } from "./models";
import { connectToDb } from "./utils";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { getWallet } from "./data";
import { fetchLastClosingPrice, fetchPriceFromPolygon } from "./polygonApi";
import { v4 as uuidv4 } from "uuid";

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
    console.log("deleted from db");
    revalidatePath("/admin/users");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const addTransaction = async (prevState, formData) => {
  const session = await auth();
  const { ticker, price, executedAt, buy, papers } =
    Object.fromEntries(formData);

  try {
    connectToDb();
    const liquid = await getWallet(session?.user?.id);
    const assetValue = buy ? price * papers : -price * papers;
    const newLiquid = liquid + assetValue;
    if (newLiquid < 0) {
      return {
        error: "Insufficient funds. You cannot proceed with the transaction.",
      };
    }
    const updatedUser = await User.findByIdAndUpdate(
      session?.user?.id,
      { $set: { wallet: newLiquid } },
      { new: true }
    );

    const newTransaction = new Transaction({
      userId: session?.user?.id,
      ticker,
      price,
      executedAt,
      buy,
      papers,
    });
    await newTransaction.save();
    console.log("newTransaction", newTransaction);
    const portfolio = await Portfolio.findOne({ userId: session?.user?.id });
    //if !portfolio create new one?
    portfolio.transactions.push(newTransaction._id);
    portfolio.totalValue += buy ? price * papers : -(price * papers);

    await portfolio.save();
    console.log("Updated Portfolio:", portfolio);

    revalidatePath("/admin/transactions");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const deleteTransaction = async (id) => {
  console.log("deleting", id);

  try {
    connectToDb();
    await Transaction.findByIdAndDelete(id);
    console.log("deleted from db");
    revalidatePath("/admin/transactions");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const aggregateTransactions = (transactions) => {
  const stockAggregation = {};

  transactions.forEach((transaction) => {
    const { ticker, price, papers, buy } = transaction;
    if (!stockAggregation[ticker]) {
      stockAggregation[ticker] = {
        id: uuidv4(),
        ticker,
        totalShares: 0,
        totalInvestment: 0,
        averagePrice: 0,
      };
    }

    if (buy) {
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
  for (const stock of Object.values(stockAggregation)) {
    try {
      stock.currentPrice = await fetchLastClosingPrice(stock.ticker);
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
