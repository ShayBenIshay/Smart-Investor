"use client";

import { useState } from "react";
import "./transactions.scss";
import DataTable from "../../../components/portfolio/dataTable/DataTable";
import Add from "../../add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { addTransaction, deleteTransaction } from "@/lib/action";
import { transactionFormInput } from "@/lib/forms";
import { getCachedPrice } from "@/lib/cache";

const columns: GridColDef[] = [
  {
    field: "ticker",
    type: "string",
    headerName: "Ticker",
    width: 100,
  },
  {
    field: "executedAt",
    type: "string",
    headerName: "Executed at",
    width: 150,
  },
  {
    field: "price",
    type: "number",
    headerName: "Price",
    width: 100,
  },
  {
    field: "papers",
    headerName: "Papers",
    type: "number",
    width: 90,
  },
  {
    field: "operation",
    headerName: "Operation",
    width: 90,
    type: "string",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

interface TickerPriceResponse {
  close: number;
}
const Transactions = ({ transactions }) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = async (
    symbol: string,
    date: string
  ): Promise<TickerPriceResponse | null> => {
    const cachedPrice: number | null = await getCachedPrice(symbol, date);
    if (cachedPrice) {
      return { close: cachedPrice };
    }

    try {
      const response = await fetch("/api/polygonApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol, date }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      console.log("API call added to queue:", result);
      return result;
    } catch (error) {
      console.error("Failed to add API call to queue:", error);
      throw Error("Failed to add API call to queue:", error);
    }
  };

  return (
    <div className="transactions">
      <div className="info">
        <h1>Transactions</h1>
        <button onClick={() => setOpen(true)}>Add New Transactions</button>
      </div>
      <DataTable
        slug="transactions"
        columns={columns}
        rows={transactions}
        mutation={deleteTransaction}
      />
      {open && (
        <Add
          slug="transaction"
          formInput={transactionFormInput}
          setOpen={setOpen}
          mutation={addTransaction}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  );
};

export default Transactions;
