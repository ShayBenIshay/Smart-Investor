"use client";
import styles from "./navbar.module.css";
import Link from "next/link";
import Links from "./links/Links";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        Smart Investor
      </Link>
      <div>
        <Links session={session} />
      </div>
    </div>
  );
};

export default Navbar;
