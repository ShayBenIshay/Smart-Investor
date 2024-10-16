import styles from "./admin.module.css";

export const metadata = {
  title: "Admin",
  description: "Admin dashboard",
};

const AdminPage = () => {
  return (
    <div className={styles.container}>
      <h1>This is The Admin Page</h1>
      <p>here you can edit/add/delete users & transactions.</p>
      <hr />
      <p>
        this page is in development. later it will present info about the app,
        like how many users, and how many transactions they recorded in the
        system and so.
      </p>
    </div>
  );
};

export default AdminPage;
