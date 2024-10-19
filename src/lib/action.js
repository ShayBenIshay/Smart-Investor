"use server";

import { revalidatePath } from "next/cache";
import { Transaction, User, Portfolio } from "./models";
import { connectToDb } from "./utils";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { getWallet } from "./data";

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
  const { ticker, price, executedAt, operation, papers } =
    Object.fromEntries(formData);

  try {
    connectToDb();
    const liquid = await getWallet(session?.user?.id);
    const diff = operation === "buy" ? price * papers : -price * papers;
    const newLiquid = liquid - diff;
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
    console.log("updatedUser updatedUser updatedUser updatedUser updatedUser ");
    console.log(updatedUser);

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
    console.log(session);
    const portfolio = await Portfolio.findOne({ userId: session?.user?.id });
    console.log("portfolio portfolio portfolio portfolio portfolio ");
    console.log(newTransaction._id);
    portfolio.transactions.push(newTransaction._id);
    portfolio.totalValue +=
      operation === "buy" ? price * papers : -(price * papers);

    console.log(portfolio);
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
