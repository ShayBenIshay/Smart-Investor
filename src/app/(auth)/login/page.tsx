// import LocalLogin from "@/components/auth/LocalLogin/localLogin.jsx";
import LocalLogin from "@/components/auth/localLogin/localLogin";
import styles from "./login.module.css";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <LocalLogin />
      </div>
    </div>
  );
};

export default LoginPage;
