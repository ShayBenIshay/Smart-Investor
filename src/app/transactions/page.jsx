import styles from "./transactions.module.css";
import { getTransactions } from "@/lib/data";
import Transactions from "@/components/entities/transactions/Transactions";

export const metadata = {
  title: "Transactions",
  description: "Create New Transaction | Check Transactions History",
};

const TransactionsPage = async () => {
  const transactions = await getTransactions();

  return <Transactions transactions={transactions} />;
};

export default TransactionsPage;
