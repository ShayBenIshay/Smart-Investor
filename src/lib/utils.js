import mongoose from "mongoose";

const connection = {};

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      return;
    }
    const db = await mongoose.connect(process.env.MONGO);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getLastTradingDate = () => {
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (yesterday.getDay() === 0) {
    yesterday.setDate(yesterday.getDate() - 2);
  } else if (yesterday.getDay() === 6) {
    yesterday.setDate(yesterday.getDate() - 1);
  }

  return yesterday;
};
