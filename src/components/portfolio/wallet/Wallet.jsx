"use client";

import { useState } from "react";
import styles from "./wallet.module.css";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

const Wallet = ({ liquid: initialLiquid }) => {
  const [liquid, setLiquid] = useState(initialLiquid);
  const [amount, setAmount] = useState();

  const handleDeposit = async () => {
    const deposit = Number(amount);
    setAmount(0);

    const { user } = await app.reAuthenticate();
    const queryResponse = await app.service("portfolio").find({
      query: {
        userId: user._id,
      },
    });
    const portfolio = queryResponse.data[0];
    try {
      const updatedWallet = portfolio.cash + deposit;
      await app
        .service("portfolio")
        .patch(portfolio._id, { cash: updatedWallet });
      setLiquid(updatedWallet);
    } catch (error) {
      alert("Deposit failed");
    }
  };

  const handleWithdrawal = async () => {
    const withdrawal = Number(amount);
    setAmount(0);

    const { user } = await app.reAuthenticate();
    const queryResponse = await app.service("portfolio").find({
      query: {
        userId: user._id,
      },
    });
    const portfolio = queryResponse.data[0];

    if (amount > portfolio.cash) {
      alert("Insufficient funds!");
    }

    try {
      const updatedWallet = portfolio.cash - withdrawal;
      await app
        .service("portfolio")
        .patch(portfolio._id, { cash: updatedWallet });

      setLiquid(updatedWallet);
    } catch (error) {
      alert("Withdrawal failed");
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
