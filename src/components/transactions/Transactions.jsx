"use client";

import { useState, useEffect } from "react";
import "./transactions.scss";
import Add from "../add/Add";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import TransactionsTable from "@/components/transactions/transactionsTable/TransactionsTable";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

export const transactionFormInput = [
  {
    label: "Stock Ticker",
    element: "input",
    name: "ticker",
    placeholder: "Ticker",
    type: "string",
  },
  {
    label: "Transaction Date",
    element: "datePicker",
    name: "executedAt",
    placeholder: "Date",
    type: "string",
  },
  {
    label: "Stock Price",
    element: "input",
    name: "price",
    placeholder: "Price",
    type: "number",
  },
  {
    label: "Operation(Buy/Sell)",
    element: "select",
    name: "operation",
    placeholder: "Buy/Sell",
    type: "string",
  },
  {
    label: "Papers",
    element: "input",
    name: "papers",
    placeholder: "papers",
    type: "number",
  },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const getTransactions = async () => {
      const { user } = await app.authenticate();
      if (user) {
        const queryResponse = await app.service("transactions").find({
          query: {
            userId: user._id,
          },
        });
        const userTransactions = queryResponse.data.filter(
          (transaction) => Object.keys(transaction.agentId).length === 0
        );
        setTransactions(userTransactions);
      } else {
        setTransactions(null);
      }
    };

    getTransactions();
  }, []);
  const [open, setOpen] = useState(false);

  const handleDateChange = async (ticker, date) => {
    let cachedPrice;
    try {
      const queryResponse = await app.service("cache").find({
        query: {
          ticker,
          date,
        },
      });
      cachedPrice = queryResponse.closePrice || null;
    } catch (error) {
      cachedPrice = null;
    }
    if (cachedPrice) {
      return { close: cachedPrice };
    }

    try {
      const queryResponse = await app.service("polygon-api").find({
        query: {
          ticker,
          date,
        },
      });
      if (!queryResponse) console.log(`query response was undefineddd`);
      const { close: closePrice } = queryResponse[0];

      app.service("cache").create({
        ticker,
        date,
        closePrice,
      });
      return closePrice;
    } catch (error) {
      console.log(
        `Exceeded api threshold, can't fetch price for ${ticker}_${date}`
      );
      // throw Error(
      //   `Exceeded api threshold, can't fetch price for ${ticker}_${date}`
      // );
    }
  };
  if (transactions) {
    return (
      <div className="transactions">
        <div className="info">
          <h1>Transactions</h1>
          <button onClick={() => setOpen(true)}>Add New Transactions</button>
        </div>
        <TransactionsTable transactions={transactions} />
        {open && (
          <Add
            slug="transaction"
            formInput={transactionFormInput}
            setOpen={setOpen}
            onDateChange={handleDateChange}
          />
        )}
      </div>
    );
  }
};

export default Transactions;
