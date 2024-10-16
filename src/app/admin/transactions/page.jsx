import Transactions from "@/components/entities/transactions/Transactions";
import { getTransactions } from "@/lib/data";

const TransactionsPage = async () => {
  const transactions = await getTransactions();

  return <Transactions transactions={transactions} />;
};

export default TransactionsPage;
