import styles from "./about.module.css";
import Image from "next/image";

export const metadata = {
  title: "About Smart Investor | Portfolio Management Tool",
  description:
    "Smart Investor helps you track investments, manage your portfolio, and stay updated with the stock market through an intuitive dashboard.",
  keywords:
    "portfolio management, stock tracking, investment tools, financial dashboard, stock market analysis",
  openGraph: {
    title: "About Smart Investor | Portfolio Management Tool",
    description: "Track investments and manage your portfolio with ease",
    images: [{ url: "/about.png" }],
  },
};

const AboutPage = () => {
  return (
    <main className={styles.container}>
      <section
        className={styles.textContainer}
        aria-label="About Smart Investor"
      >
        <h2 className={styles.subtitle}>About Smart Investor</h2>
        <h1 className={styles.title}>
          This App will help you track your transactions & manage your portfolio
          with ease and grace.
        </h1>
        <p className={styles.desc}>
          We create a digital space for you to see what&apos;s new in the stock
          market. Detailed portfolio dashboard with everything you need and
          more. We will help you to collect the information you need to know
          about the stock market compared to your Portfolio & Watch List.
        </p>
        <section className={styles.boxes} aria-label="Key Features">
          <div className={`${styles.box} ${styles.boxHover}`}>
            <h2>Private</h2>
            <p>Safe and Secure</p>
            {/* <div className={styles.boxOverlay}>
              <p>Your data is encrypted and protected</p>
            </div> */}
          </div>
          <div className={`${styles.box} ${styles.boxHover}`}>
            <h2>Comfort</h2>
            <p>Comfortable UI Design</p>
            {/* <div className={styles.boxOverlay}>
              <p>Intuitive interface for seamless navigation</p>
            </div> */}
          </div>
          <div className={`${styles.box} ${styles.boxHover}`}>
            <h2>Modern</h2>
            <p>Enhanced User Experience</p>
            {/* <div className={styles.boxOverlay}>
              <p>Built with the latest technology stack</p>
            </div> */}
          </div>
        </section>
      </section>
      <section
        className={styles.imgContainer}
        aria-label="Visual Representation"
      >
        <Image
          src="/about.png"
          alt="Smart Investor dashboard showing portfolio analysis and stock tracking features"
          fill
          className={styles.img}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </section>
    </main>
  );
};

export default AboutPage;
