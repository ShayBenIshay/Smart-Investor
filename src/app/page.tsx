"use client";

import Image from "next/image";
import styles from "./home.module.css";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "ticker",
    type: "string",
    headerName: "Ticker",
    width: 250,
  },
  {
    field: "price",
    type: "number",
    headerName: "Price",
    width: 200,
  },
  {
    field: "executedAt",
    type: "string",
    headerName: "Executed Date",
    width: 150,
  },
  {
    field: "papers",
    headerName: "Papers",
    type: "string",
    width: 200,
  },
  {
    field: "buy",
    headerName: "buy",
    width: 150,
    type: "boolean",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("session session session session session session session ");
  console.log(session);
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
