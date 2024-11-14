import styles from "./about.module.css";
import Image from "next/image";

export const metadata = {
  title: "About",
  description: "About description",
};

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.subtitle}>About Smart Investor</h2>
        <h1 className={styles.title}>
          This App will help you track your tranasctions & manage your portfolio
          with ease and grace.
        </h1>
        <p className={styles.desc}>
          We create a digital space for you to see what&apos;s new in the stock
          market. Detailed portfolio dashboard with everything you need and
          more. We will help you to collect the information you need to know
          about the stock market compared to your Porfolio & Watch List
        </p>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <h1>Private</h1>
            <p>Safe and Secure</p>
          </div>
          <div className={styles.box}>
            <h1>Comfort</h1>
            <p>Comftorable UI Design</p>
          </div>
          <div className={styles.box}>
            <h1>Modern</h1>
            <p>User experience</p>
          </div>
        </div>
      </div>
      <div className={styles.imgContainer}>
        <Image
          src="/about.png"
          alt="About Image"
          fill
          className={styles.img}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
};

export default AboutPage;
