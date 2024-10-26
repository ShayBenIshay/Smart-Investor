"use client";

import { useState } from "react";
import "./transactions.scss";
import DataTable from "../../dataTable/DataTable";
import Add from "../../add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { addTransaction, deleteTransaction } from "@/lib/action";
import { transactionFormInput } from "@/data/forms";
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
    type: "string",
    width: 90,
  },
  {
    field: "operation",
    headerName: "Operation",
    width: 90,
    type: "boolean",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

type TickerPriceResponse = number | null;

const Transactions = ({ transactions }) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = async (
    symbol: string,
    date: string
  ): Promise<TickerPriceResponse> => {
    const cachedPrice: number | null = await getCachedPrice(symbol, date);
    if (cachedPrice) {
      return cachedPrice;
    }

    try {
      const response = await fetch(
        `/api/fetchPolygonClosePrice?symbol=${symbol}&date=${date}&user=true`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch close price");
      }
      const data = await response.json();
      const fetchedPrice = data.close;
      return fetchedPrice;
    } catch (error) {
      console.error("Error fetching price:", error);
      return null; // Handle errors appropriately in your application
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
