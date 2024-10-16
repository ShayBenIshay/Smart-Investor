import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Smart Investor</div>
      <div className={styles.text}>
        Smart Investor App © All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
