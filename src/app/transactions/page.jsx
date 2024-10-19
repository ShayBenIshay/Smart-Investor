import styles from "./transactions.module.css";
import { getUserTransactions } from "@/lib/data";
import Transactions from "@/components/entities/transactions/Transactions";
import { auth } from "@/auth";

export const metadata = {
  title: "Transactions",
  description: "Create New Transaction | Check Transactions History",
};

const TransactionsPage = async () => {
  const session = await auth();

  const transactions = await getUserTransactions(session?.user?.id);

  return <Transactions transactions={transactions} />;
};

export default TransactionsPage;
