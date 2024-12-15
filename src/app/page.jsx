"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./home.module.css";
import { useRouter } from "next/navigation";

import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { user: currentUser } = await app.authenticate();
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };

    getUser();
  }, []);

  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Smart Investor</h1>
        <h2 className={styles.subtitle}>Welcome {user?.email}</h2>
        <p className={styles.desc}>How can Smart Investor help you today?</p>
        <div className={styles.buttons}>
          <a href="/transactions">
            <button className={styles.transactionsButton}>
              Create Transaction
            </button>
          </a>
          <a href="/portfolio">
            <button
              className={styles.portfolioButton}
              onClick={() => router.push("/portfolio")}
            >
              View Portfolio
            </button>
          </a>
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
