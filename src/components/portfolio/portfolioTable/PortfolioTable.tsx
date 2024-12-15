"use client";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../dataTable/DataTable";
import { Typography } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "ticker",
    type: "string",
    headerName: "Ticker",
    width: 90,
  },
  {
    field: "avgBuy",
    type: "number",
    headerName: "Average Buy",
    width: 120,
  },
  {
    field: "totalSpent",
    type: "number",
    headerName: "Total Spent",
    width: 120,
  },
  {
    field: "position",
    headerName: "Position",
    type: "string",
    width: 120,
  },
  {
    field: "currentPrice",
    headerName: "Market Price",
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
    field: "currentValue",
    headerName: "Current Value",
    type: "string",
    width: 120,
  },
  {
    field: "percentage",
    headerName: "Percentage",
    type: "string",
    width: 120,
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
const PortfolioTable = ({ rows }) => {
  return (
    <div>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default PortfolioTable;
