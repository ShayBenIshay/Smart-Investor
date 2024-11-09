import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Smart Investor</div>
      <div className={styles.text}>
        <a
          href="https://shaytechsolutions.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed by Shay Tech Solutions
        </a>
      </div>
      <div className={styles.text}>
        Smart Investor App © All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
