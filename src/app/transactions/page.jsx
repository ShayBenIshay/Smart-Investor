import Transactions from "@/components/transactions/Transactions";

export const metadata = {
  title: "Transactions",
  description: "Create New Transaction | Check Transactions History",
};

export const dynamic = "force-dynamic";

const TransactionsPage = () => {
  // const transactions = await getUserTransactions();

  // const processedTransactions = transactions.map((transaction) => {
  //   const formattedDate = transaction.createdAt
  //     .split("T")[0]
  //     .split("-")
  //     .reverse()
  //     .join("/");
  //   transaction.createdAt = formattedDate;
  //   return transaction;
  // });

  // return <Transactions transactions={transactions} />;
  return <Transactions />;
};

export default TransactionsPage;
