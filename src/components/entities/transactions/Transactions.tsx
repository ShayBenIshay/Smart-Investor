"use client";

import { useState } from "react";
import "./transactions.scss";
import DataTable from "../../dataTable/DataTable";
import Add from "../../add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { addTransaction, deleteTransaction } from "@/lib/action";
import { transactionFormInput } from "@/data/forms";
import { fetchPriceFromPolygon } from "@/lib/polygonApi";

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
    field: "buy",
    headerName: "buy",
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

const Transactions = ({ transactions }) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = async (date: Date, symbol: string) => {
    const fetchedPrice = await fetchPriceFromPolygon(date, symbol);
    return fetchedPrice;
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
