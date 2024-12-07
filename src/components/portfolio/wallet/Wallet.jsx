"use client";

import { useState } from "react";
import { changeWallet } from "../../../lib/walletService";
import styles from "./wallet.module.css";

const Wallet = ({ liquid: initialLiquid }) => {
  const [liquid, setLiquid] = useState(initialLiquid);
  const [amount, setAmount] = useState();

  const handleDeposit = async () => {
    try {
      const updatedWallet = await changeWallet(amount, "deposit");
      setLiquid(updatedWallet);
    } catch (error) {
      alert("Deposit failed");
    }
    setAmount(0);
  };

  const handleWithdrawal = async () => {
    if (amount > liquid) {
      alert("Insufficient funds!");
    }
    try {
      const updatedWallet = await changeWallet(amount, "withdraw");
      setLiquid(updatedWallet);
    } catch (error) {
      alert("Withdrawal failed");
    }
    setAmount(0);
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
      />
      <div className={styles.buttonContiner}>
        <button className={styles.deposit} onClick={handleDeposit}>
          Deposit
        </button>
        <button className={styles.withdraw} onClick={handleWithdrawal}>
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Wallet;
