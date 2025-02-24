import { memo, useMemo } from "react";
import DataTable from "@/components/dataTable/DataTable";
import { TRANSACTION_TABLE_COLUMNS } from "@/config/constants";

const TransactionsTable = memo(({ transactions = [] }) => {
  const rows = useMemo(() => {
    if (!transactions?.length) return [];

    return transactions.map((row) => {
      const createdAt = row.createdAt?.split("T")[0];

      const newRow = {
        ...row,
        executedAt: createdAt,
        createdAt,
        _id: row._id || row.id,
      };

      Object.keys(newRow).forEach((key) => {
        const value = newRow[key];
        if (typeof value === "number") {
          newRow[key] = Number.isInteger(value) ? value : value.toFixed(2);
        }
      });
      return newRow;
    });
  }, [transactions]);

  if (!transactions?.length) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: "var(--textSoft)",
        }}
      >
        No transactions available
      </div>
    );
  }

  return <DataTable columns={TRANSACTION_TABLE_COLUMNS} rows={rows} />;
});

TransactionsTable.displayName = "TransactionsTable";

export default TransactionsTable;
