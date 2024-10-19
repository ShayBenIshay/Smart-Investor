"use server";

import { revalidatePath } from "next/cache";
import { Transaction, User } from "./models";
import { connectToDb } from "./utils";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

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
  console.log(session);

  const { ticker, price, executedAt, buy, papers } =
    Object.fromEntries(formData);

  try {
    connectToDb();

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
