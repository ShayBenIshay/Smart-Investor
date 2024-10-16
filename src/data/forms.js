const transactionFormInput = [
  {
    label: "Stock Ticker",
    element: "input",
    name: "ticker",
    placeholder: "Ticker",
    type: "string",
  },
  {
    label: "Stock Price",
    element: "input",
    name: "price",
    placeholder: "Price",
    type: "number",
  },
  {
    label: "Transaction Date",
    element: "datePicker",
    name: "executedAt",
    placeholder: "Date",
    type: "string",
  },
  {
    label: "Operation(Buy/Sell)",
    element: "select",
    name: "operation",
    placeholder: "Buy/Sell",
    type: "string",
  },
  {
    label: "Papers",
    element: "input",
    name: "papers",
    placeholder: "papers",
    type: "number",
  },
];

export default transactionFormInput;
