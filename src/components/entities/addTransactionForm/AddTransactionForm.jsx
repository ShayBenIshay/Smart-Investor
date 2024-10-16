import styles from "./adminTrasactionForm.module.css";

const AddTransactionForm = () => {
  return (
    <form className={styles.container}>
      <h1>Add New Transaction</h1>
      <input type="text" name="date" placeholder="Date" />
      <input type="text" name="ticker" placeholder="Ticker" />
      <input type="number" name="price" placeholder="Price" />
      <input type="number" name="papers" placeholder="Papers" />
      <select name="Operation ">
        <option value="true">Buy</option>
        <option value="false">Sell</option>
      </select>
      <button>Add</button>
    </form>
  );
};

export default AddTransactionForm;
