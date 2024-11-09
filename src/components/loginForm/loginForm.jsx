"use client";

import styles from "./loginForm.module.css";
import { doSocialLogin } from "@/app/actions/index";

const LoginForm = () => {
  return (
    <form className={styles.form} action={doSocialLogin}>
      <button
        className={styles.google}
        type="submit"
        name="action"
        value="google"
      >
        Sign in with Google
      </button>
      <button
        className={styles.github}
        type="submit"
        name="action"
        value="github"
      >
        Sign in with Github
      </button>
    </form>
  );
};

export default LoginForm;
