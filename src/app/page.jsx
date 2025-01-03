"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./home.module.css";
import { useRouter } from "next/navigation";
import { useFeathers } from "@/services/feathers";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const app = useFeathers();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Try to reauthenticate with stored token
        const { user: currentUser } = await app.reAuthenticate();
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [app]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Smart Investor Platform.</h1>
        <h2 className={styles.subtitle}>
          {user ? `Welcome ${user.email}` : "Welcome Guest"}
        </h2>
        <p className={styles.desc}>How can Smart Investor help you today?</p>
        <div className={styles.buttons}>
          <button
            className={styles.transactionsButton}
            onClick={() => router.push("/transactions")}
          >
            Create Transaction
          </button>
          <button
            className={styles.portfolioButton}
            onClick={() => router.push("/portfolio")}
          >
            View Portfolio
          </button>
        </div>
      </div>
      <div className={styles.imgContainer}>
        <Image
          src="/hero.gif"
          alt="Hero gif"
          fill
          className={styles.heroImg}
          unoptimized={true}
        />
      </div>
    </div>
  );
}
