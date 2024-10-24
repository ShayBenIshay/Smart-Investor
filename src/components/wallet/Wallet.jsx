"use client";

import { useState } from "react";
import { changeWallet } from "../../lib/walletService";

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
    setAmount();
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
    setAmount();
  };

  return (
    <div>
      <h1>Your Wallet</h1>
      <p>{`Liquid: $${liquid.toFixed(2)}`}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleDeposit}>Deposit</button>
      <button onClick={handleWithdrawal}>Withdraw</button>
    </div>
  );
};

export default Wallet;
