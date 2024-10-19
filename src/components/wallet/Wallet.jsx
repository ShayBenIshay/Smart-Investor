"use client";

import { useState } from "react";

const Wallet = ({ liquid: initialLiquid }) => {
  const [liquid, setLiquid] = useState(initialLiquid);
  const [amount, setAmount] = useState(0);

  const handleTransaction = async (operation) => {
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, operation }),
      });

      if (!res.ok) {
        throw new Error("Failed to update wallet");
      }

      const data = await res.json();
      setLiquid(data.wallet);
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    }
  };

  const handleDeposit = () => {
    handleTransaction("deposit");
  };

  const handleWithdrawal = () => {
    if (amount > liquid) {
      alert("Insufficient funds!");
    } else {
      handleTransaction("withdraw");
    }
  };

  return (
    <div>
      <h1>Your Wallet</h1>
      <p>{`Liquid: $${liquid}`}</p>
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
