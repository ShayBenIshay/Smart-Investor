import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    previousLogin: {
      type: Date,
    },
    wallet: {
      type: Number,
      default: 10000,
    },
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ticker: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    executedAt: {
      type: String,
      required: true,
    },
    operation: {
      type: String,
      required: true,
      default: "buy",
    },
    papers: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    portfolioName: {
      type: String,
      required: true,
      trim: true,
    },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    totalValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const priceCacheSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  lastClosePrice: { type: Number, required: true },
  fetchedAt: { type: String, required: true },
});

export const PriceCache =
  mongoose.models?.PriceCache || mongoose.model("PriceCache", priceCacheSchema);
export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const Transaction =
  mongoose.models?.Transaction ||
  mongoose.model("Transaction", transactionSchema);
export const Portfolio =
  mongoose.models?.Portfolio || mongoose.model("Portfolio", portfolioSchema);
