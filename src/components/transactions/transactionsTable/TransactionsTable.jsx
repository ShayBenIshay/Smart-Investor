import DataTable from "@/components/dataTable/DataTable";
import { create } from "domain";
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
  },
  {
    field: "executedAt",
    type: "string",
    headerName: "Executed at",
    width: 150,
  },
  {
    field: "price",
    type: "number",
    headerName: "Price",
    width: 100,
  },
  {
    field: "papers",
    headerName: "Papers",
    type: "number",
    width: 90,
  },
  {
    field: "operation",
    headerName: "Operation",
    width: 90,
    type: "string",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
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

const dateToStr = (dateNumber) => {
  const formatString = new Date(parseInt(dateNumber.$date.$numberLong, 10))
    .toISOString()
    .split("T")[0];
  return formatString;
};

const TransactionsTable = ({ transactions }) => {
  const rows = transactions?.map((row) => {
    const createdAt = dateToStr(row.createdAt);

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
};

export default TransactionsTable;
