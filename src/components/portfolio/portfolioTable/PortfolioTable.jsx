"use client";
import DataTable from "../../dataTable/DataTable";
import { Typography } from "@mui/material";

const columns = [
  {
    field: "ticker",
    type: "string",
    headerName: "Ticker",
    width: 90,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "avgBuy",
    type: "string",
    headerName: "Average Buy",
    width: 120,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => `$${value}`,
  },
  {
    field: "totalSpent",
    type: "string",
    headerName: "Total Spent",
    width: 120,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => `$${value}`,
  },
  {
    field: "position",
    headerName: "Position",
    type: "string",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "currentPrice",
    headerName: "Market Price",
    type: "string",
    width: 120,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => `$${value}`,
  },
  {
    field: "unrealizedPL",
    headerName: "Unrealized PL",
    type: "string",
    width: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          style={{
            color: Number(params.value) >= 0 ? "#4CAF50" : "#FF5252",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          {`$${params.value}`}
        </Typography>
      </div>
    ),
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    type: "string",
    width: 120,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => `$${value}`,
  },
  {
    field: "percentage",
    headerName: "Percentage",
    type: "string",
    width: 120,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => `${value}%`,
  },
  {
    field: "change",
    headerName: "Change",
    type: "string",
    width: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          style={{
            color: Number(params.value) >= 0 ? "#4CAF50" : "#FF5252",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          {`${params.value}%`}
        </Typography>
      </div>
    ),
  },
];

const PortfolioTable = ({ rows }) => {
  const processedRows =
    rows?.map((row) => ({
      ...row,
      _id: row.ticker,
    })) || [];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataTable columns={columns} rows={processedRows} pageSize={10} />
    </div>
  );
};

export default PortfolioTable;
