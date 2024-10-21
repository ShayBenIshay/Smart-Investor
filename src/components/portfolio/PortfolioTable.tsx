"use client";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../dataTable/DataTable";

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
  },
  {
    field: "change",
    headerName: "Change",
    type: "string",
    width: 100,
  },
];
const PortfolioTable = ({ stocks }) => {
  console.log("stockAggregation stockAggregation", stocks);
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

// const PortfolioTable = ({ portfolio }) => {
//   if (!portfolio) {
//     return <div>No portfolio found.</div>;
//   }
//   return (
//     <div>
//       <h1>{portfolio.portfolioName}</h1>
//       <h2>Total Value: ${portfolio.totalValue.toFixed(2)}</h2>
//       <h3>Transactions:</h3>
//       <ul>
//         {portfolio.transactions.map((transaction) => (
//           <li key={transaction._id}>
//             {transaction.ticker} - {transaction.papers} shares at $
//             {transaction.price.toFixed(2)} on{" "}
//             {new Date(transaction.executedAt).toLocaleDateString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PortfolioTable;
