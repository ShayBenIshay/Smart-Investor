"use client";

import { useState, useMemo } from "react";
import styles from "./wallet.module.css";
import { useFeathers } from "@/services/feathers";

const WalletButtons = ({ onDeposit, onWithdraw, amount, isLoading }) => {
  return (
    <div className={styles.buttonContiner}>
      <button
        className={styles.deposit}
        onClick={onDeposit}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Deposit"}
      </button>
      <button
        className={styles.withdraw}
        onClick={onWithdraw}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
};

const LiquidDisplay = ({ value }) => {
  const formattedValue = useMemo(() => {
    return Number.isInteger(value) ? value : value.toFixed(2);
  }, [value]);

  return <p>{`Liquid: $${formattedValue}`}</p>;
};

const Wallet = ({ liquid: initialLiquid, onWalletUpdate }) => {
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
      const queryResponse = await app.service("portfolio").find({});
      const portfolio = queryResponse.data[0];

      const updatedWallet = portfolio.cash + deposit;
      await app
        .service("portfolio")
        .patch(portfolio._id, { cash: updatedWallet });
      setLiquid(updatedWallet);
      setAmount("");
      onWalletUpdate(updatedWallet);
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
      const queryResponse = await app.service("portfolio").find({});
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
      onWalletUpdate(updatedWallet);
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
      <LiquidDisplay value={liquid} />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        disabled={isLoading}
      />
      <WalletButtons
        onDeposit={handleDeposit}
        onWithdraw={handleWithdrawal}
        amount={amount}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Wallet;
