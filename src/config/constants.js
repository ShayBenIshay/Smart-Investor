import Image from "next/image";
export const CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CF5",
  "#FF6666",
  "#FF5C93",
  "#00B8D9",
  "#FFC400",
  "#36B37E",
  "#AAB2BD",
  "#FCF876",
  "#B07D62",
  "#8E8CD8",
  "#FF9A76",
];

export const TRANSACTION_TABLE_COLUMNS = [
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
          <div className="delete">
            <Image src="/delete.svg" alt="" width={20} height={20} />
          </div>
        </div>
      );
    },
  },
];
