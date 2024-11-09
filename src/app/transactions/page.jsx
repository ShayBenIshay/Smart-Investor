import { getUserTransactions } from "@/lib/data";
import Transactions from "@/components/entities/transactions/Transactions";

export const metadata = {
  title: "Transactions",
  description: "Create New Transaction | Check Transactions History",
};

export const dynamic = "force-dynamic";

const TransactionsPage = async () => {
  const transactions = await getUserTransactions();

  const processedTransactions = transactions.map((transaction) => {
    const formattedDate = transaction.createdAt
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/");
    transaction.createdAt = formattedDate;
    return transaction;
  });

  return <Transactions transactions={transactions} />;
};

export default TransactionsPage;
