import styles from "./transactions.module.css";
import { getUserTransactions } from "@/lib/data";
import Transactions from "@/components/entities/transactions/Transactions";
import { auth } from "@/auth";

export const metadata = {
  title: "Transactions",
  description: "Create New Transaction | Check Transactions History",
};

const TransactionsPage = async () => {
  //get user email from session/token
  const session = await auth();
  console.log(session);

  // const transactions = await getUserTransactions(session?.user?.email);
  const transactions = await getUserTransactions(session?.user?.id);

  return <Transactions transactions={transactions} />;
};

export default TransactionsPage;
