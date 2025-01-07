"use client";

import { useState, useEffect, useCallback } from "react";
import "./transactions.scss";
import Add from "../add/Add";
import { useFeathers } from "@/services/feathers";
import TransactionsTable from "./transactionsTable/TransactionsTable";
import { transactionFormInput } from "@/config/transactionForm";
import { useRouter } from "next/navigation";

const Transactions = () => {
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const router = useRouter();

  const app = useFeathers();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { user } = await app.authenticate();
      if (!user) {
        setTransactions(null);
        return;
      }

      const queryResponse = await app.service("/transactions").find({
        query: {},
      });
      setTransactions(queryResponse.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [app]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDateChange = useCallback(
    async (ticker, date) => {
      try {
        const cachedData = await app.service("cache").find({
          query: {
            ticker,
            date,
          },
        });

        // Check if we got a "not in cache" message
        if (cachedData.message && cachedData.message.includes("not in cache")) {
          // If not in cache, proceed to fetch from API
          try {
            const queryResponse = await app.service("throttle").find({
              query: {
                name: "open-close",
                ticker,
                date,
              },
            });

            if (!queryResponse?.length) {
              throw new Error("No price data available");
            }

            const { close: closePrice } = queryResponse[0];

            const cacheData = {
              ticker,
              date,
              closePrice,
            };
            console.log(cacheData);
            // Cache the result
            await app.service("cache").create(cacheData);

            return { close: closePrice };
          } catch (apiError) {
            console.error(
              `Failed to fetch price for ${ticker} on ${date}:`,
              apiError
            );
            throw new Error(`Unable to fetch price for ${ticker} on ${date}`);
          }
        }

        // If we have cache data, return it
        return { close: cachedData.closePrice };
      } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error during price lookup:", error);
        throw new Error("An unexpected error occurred");
      }
    },
    [app]
  );

  const handleAddTransaction = useCallback(
    async (formData) => {
      try {
        const { user } = await app.authenticate();
        if (!user) {
          throw new Error("User not authenticated");
        }
        const transactionData = {
          ...formData,
          executedAt: new Date(formData.executedAt).toISOString(),
          price: parseFloat(formData.price),
          papers: parseInt(formData.papers, 10),
        };
        const newTransaction = await app
          .service("transactions")
          .create(transactionData);
        setTransactions((prev) => [...prev, newTransaction]);
        setOpen(false);
        setInsufficientFunds(false);
      } catch (error) {
        console.error("Failed to add transaction:", error);
        if (error.message.includes("Insufficient cash")) {
          setInsufficientFunds(true);
        } else {
          setError(error.message);
        }
      }
    },
    [app]
  );

  const handleNavigateToPortfolio = () => {
    router.push("/portfolio");
  };

  if (loading) {
    return (
      <div className="transactions loading">
        <div className="loading-spinner" />
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error || insufficientFunds) {
    return (
      <div className="transactions error">
        <h1>Transactions</h1>
        {insufficientFunds ? (
          <>
            <p className="error-message">
              Insufficient funds! Go to portfolio to deposit funds
            </p>
            <button
              onClick={handleNavigateToPortfolio}
              className="portfolio-button"
            >
              Portfolio
            </button>
          </>
        ) : (
          <>
            <p className="error-message">Error: {error}</p>
            <button onClick={fetchTransactions} className="retry-button">
              Retry
            </button>
          </>
        )}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="transactions empty">
        <h1>Transactions</h1>
        <p>No transactions found</p>
        <button onClick={() => setOpen(true)} className="add-button">
          Add New Transaction
        </button>
        {open && (
          <Add
            slug="transactions"
            formInput={transactionFormInput}
            setOpen={setOpen}
            onDateChange={handleDateChange}
            onSubmit={handleAddTransaction}
            initialValues={{
              operation: "buy",
              executedAt: new Date().toISOString().split("T")[0],
              price: "",
              papers: "",
              ticker: "",
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="transactions">
      <div className="info">
        <h1>Transactions</h1>
        <button onClick={() => setOpen(true)} className="add-button">
          Add New Transaction
        </button>
      </div>
      <div className="table-container">
        <TransactionsTable
          transactions={transactions}
          onRefresh={fetchTransactions}
        />
      </div>
      {open && (
        <Add
          slug="transactions"
          formInput={transactionFormInput}
          setOpen={setOpen}
          onDateChange={handleDateChange}
          onSubmit={handleAddTransaction}
          initialValues={{
            operation: "buy",
            executedAt: new Date().toISOString().split("T")[0],
            price: "",
            papers: "",
            ticker: "",
          }}
        />
      )}
    </div>
  );
};

export default Transactions;
