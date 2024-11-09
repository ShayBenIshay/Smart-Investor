"use client";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../dataTable/DataTable";
import { Typography } from "@mui/material";

import { deleteTransaction } from "@/lib/action";

const columns: GridColDef[] = [
  {
    field: "ticker",
    type: "string",
    headerName: "Ticker",
    width: 90,
  },
  {
    field: "averagePrice",
    type: "number",
    headerName: "Average Price",
    width: 120,
  },
  {
    field: "totalInvestment",
    type: "number",
    headerName: "Total Investment",
    width: 120,
  },
  {
    field: "totalShares",
    headerName: "Total Shares",
    type: "string",
    width: 120,
  },
  {
    field: "currentPrice",
    headerName: "Current Price",
    type: "string",
    width: 120,
  },
  {
    field: "unrealizedPL",
    headerName: "Unrealized PL",
    type: "string",
    width: 120,
    renderCell: (params) => (
      <Typography
        style={{
          color: params.value >= 0 ? "green" : "red",
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          height: "100%",
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: "change",
    headerName: "Change",
    type: "string",
    width: 100,
    renderCell: (params) => (
      <Typography
        style={{
          color: params.value >= 0 ? "green" : "red",
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          height: "100%",
        }}
      >
        {params.value}
      </Typography>
    ),
  },
];
const PortfolioTable = ({ stocks }) => {
  return (
    <div>
      <DataTable
        slug="portfolio"
        columns={columns}
        rows={stocks}
        mutation={deleteTransaction}
      />
    </div>
  );
};

export default PortfolioTable;
