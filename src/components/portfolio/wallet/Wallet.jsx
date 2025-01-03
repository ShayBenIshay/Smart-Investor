"use client";

import { useState } from "react";
import styles from "./wallet.module.css";
import { useFeathers } from "@/services/feathers";

const Wallet = ({ liquid: initialLiquid }) => {
  const [liquid, setLiquid] = useState(initialLiquid);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const app = useFeathers();

  const handleDeposit = async () => {
    if (!amount || isLoading) return;
    setIsLoading(true);

    try {
      const deposit = Number(amount);
      const { user } = await app.reAuthenticate();
      const queryResponse = await app.service("portfolio").find({
        query: {
          name: "find",
          userId: user._id,
        },
      });
      const portfolio = queryResponse.data[0];

      const updatedWallet = portfolio.cash + deposit;
      await app
        .service("portfolio")
        .patch(portfolio._id, { cash: updatedWallet });
      setLiquid(updatedWallet);
      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Deposit failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || isLoading) return;
    setIsLoading(true);

    try {
      const withdrawal = Number(amount);
      const { user } = await app.reAuthenticate();
      const queryResponse = await app.service("portfolio").find({
        query: {
          name: "find",
          userId: user._id,
        },
      });
      const portfolio = queryResponse.data[0];

      if (Number(withdrawal) > Number(portfolio.cash)) {
        alert("Insufficient funds!");
        setIsLoading(false);
        return;
      }

      const updatedWallet = portfolio.cash - withdrawal;
      await app
        .service("portfolio")
        .patch(portfolio._id, { cash: updatedWallet });
      setLiquid(updatedWallet);
      setAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.walletContainer}>
      <h2>Your Wallet</h2>
      <p>{`Liquid: $${
        Number.isInteger(liquid) ? liquid : liquid.toFixed(2)
      }`}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        disabled={isLoading}
      />
      <div className={styles.buttonContiner}>
        <button
          className={styles.deposit}
          onClick={handleDeposit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Deposit"}
        </button>
        <button
          className={styles.withdraw}
          onClick={handleWithdrawal}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
};

export default Wallet;
