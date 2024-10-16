import { Transaction, User } from "./models";
import { connectToDb } from "./utils";
import { unstable_noStore as noStore } from "next/cache";

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
