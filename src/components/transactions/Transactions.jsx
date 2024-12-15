"use client";

import { useState, useEffect } from "react";
import "./transactions.scss";
import Add from "../add/Add";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import TransactionsTable from "@/components/transactions/transactionsTable/TransactionsTable";

const socket = io("http://localhost:3030");
const app = feathers();
app.configure(socketio(socket));
app.configure(authentication());

const cacheSocket = io("http://localhost:3031");
const cacheApp = feathers();
cacheApp.configure(socketio(cacheSocket));

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
        setTransactions(queryResponse.data);
      } else {
        setTransactions(null);
      }
    };

    getTransactions();
  }, []);
  const [open, setOpen] = useState(false);

  const handleDateChange = async (ticker, date) => {
    const queryResponse = await cacheApp.service("cache").find({
      query: {
        ticker,
        date,
      },
    });
    const cachedPrice = queryResponse.closePrice || null;
    if (cachedPrice) {
      return { close: cachedPrice };
    }

    try {
      const response = await fetch("/api/polygonApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker, date }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      await cacheApp.service("cache").create({
        ticker,
        date,
        closePrice: result.close,
      });

      return result;
    } catch (error) {
      console.error("Failed to add API call to queue:", error);
      throw Error("Failed to add API call to queue:", error);
    }
  };
  if (transactions)
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
};

export default Transactions;
