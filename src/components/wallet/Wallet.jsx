"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const Wallet = () => {
  const { data: session } = useSession();
  const [liquid, setLiquid] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (session?.user?.wallet) {
      setLiquid(session.user.wallet);
    }
  }, [session]);

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

  if (!session) return <p>Loading...</p>;

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
