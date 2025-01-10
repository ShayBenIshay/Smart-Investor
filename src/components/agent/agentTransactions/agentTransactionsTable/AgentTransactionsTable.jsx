import { memo, useMemo } from "react";
import DataTable from "@/components/dataTable/DataTable";
import Image from "next/image";
import { TRANSACTION_TABLE_COLUMNS } from "@/config/constants";

const AgentTransactionsTable = memo(({ transactions = [] }) => {
  const rows = useMemo(() => {
    if (!transactions?.length) return [];

    return transactions.map((transaction) => {
      const createdAt = new Date(transaction.createdAt).toLocaleDateString();

      return {
        ...transaction,
        _id: transaction._id || transaction.id,
        executedAt: createdAt,
        createdAt,
        price:
          typeof transaction.price === "number"
            ? transaction.price.toFixed(2)
            : transaction.price,
      };
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

AgentTransactionsTable.displayName = "AgentTransactionsTable";

export default AgentTransactionsTable;
