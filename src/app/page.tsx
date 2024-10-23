"use client";

import Image from "next/image";
import styles from "./home.module.css";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        {/* <p>{`Last Login: ${session?.user?.}`}</p> */}
        <h1 className={styles.title}>Smart Investor</h1>
        <h2 className={styles.subtitle}>Welcome {session?.user?.name}</h2>
        <p className={styles.desc}>How can Smart Investor help you today?</p>
        <div className={styles.buttons}>
          <a href="/transactions">
            <button className={styles.button}>Create Transaction</button>
          </a>
          <button
            className={styles.button}
            onClick={() => router.push("/portfolio")}
          >
            View Portfolio
          </button>
        </div>
      </div>
      <div className={styles.imgContainer}>
        <Image
          src="/hero.gif"
          alt=""
          fill
          className={styles.heroImg}
          unoptimized={true}
        />
      </div>
    </div>
  );
}
