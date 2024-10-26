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

export const isTradingDay = (date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
