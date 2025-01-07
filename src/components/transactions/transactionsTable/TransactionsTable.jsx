import { memo } from "react";
import DataTable from "@/components/dataTable/DataTable";
import Image from "next/image";

const deleteTransaction = (id) => {
  return;
};

const columns = [
  {
    field: "ticker",
    type: "string",
    headerName: "Ticker",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "executedAt",
    type: "string",
    headerName: "Executed at",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "price",
    type: "number",
    headerName: "Price",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "papers",
    headerName: "Papers",
    type: "number",
    width: 90,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "operation",
    headerName: "Operation",
    width: 90,
    type: "string",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <div
          className="action"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Image src="/view.svg" alt="" width={20} height={20} />
          <div
            className="delete"
            onClick={() => deleteTransaction(params.row.id)}
          >
            <Image src="/delete.svg" alt="" width={20} height={20} />
          </div>
        </div>
      );
    },
  },
];

const TransactionsTable = memo(({ transactions = [] }) => {
  const rows = transactions?.map((row) => {
    const createdAt = row.createdAt.split("T")[0];

    const newRow = {
      ...row,
      executedAt: createdAt,
      createdAt,
    };
    Object.keys(newRow).forEach((key) => {
      const value = newRow[key];
      if (typeof value === "number") {
        newRow[key] = Number.isInteger(value) ? value : value.toFixed(2);
      }
    });
    return newRow;
  });

  return <DataTable columns={columns} rows={rows} />;
});

TransactionsTable.displayName = "TransactionsTable";

export default TransactionsTable;
