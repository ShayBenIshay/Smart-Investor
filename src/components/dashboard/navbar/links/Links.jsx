"use client";

import { useState, useEffect } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFeathers } from "@/services/feathers";

const LINKS = [
  { type: "Public", title: "Homepage", path: "/" },
  { type: "Public", title: "About", path: "/about" },
  { type: "Private", title: "Portfolio", path: "/portfolio" },
  { type: "Private", title: "Transactions", path: "/transactions" },
  { type: "Public", title: "Agent", path: "/agent" },
  { type: "Logout", title: "Logout", path: "/logout" },
  { type: "Login", title: "Login", path: "/login" },
];

const Links = ({ mobileMenu, setMobileMenu }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const app = useFeathers();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { user: currentUser } = await app.authenticate();
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [app]);

  const handleLogout = async () => {
    try {
      await app.logout();
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderLinks = () =>
    LINKS.map((link) => {
      if (link.type === "Public") {
        return <NavLink item={link} key={link.title} />;
      }
      if (link.type === "Private" && isAuthenticated) {
        return <NavLink item={link} key={link.title} />;
      }
      if (link.type === "Login" && !isAuthenticated) {
        return <NavLink item={link} key={link.title} />;
      }
      if (link.type === "Logout" && isAuthenticated) {
        return (
          <button
            onClick={handleLogout}
            className={styles.logout}
            key={link.title}
          >
            {link.title}
          </button>
        );
      }
      return null;
    });

  return (
    <div className={styles.container}>
      <div className={styles.links}>{renderLinks()}</div>
      <button
        className={styles.menuButton}
        onClick={() => setMobileMenu(!mobileMenu)}
        aria-label="Toggle menu"
      >
        <Image src="/menu.png" alt="" width={30} height={30} priority />
      </button>
      {mobileMenu && <div className={styles.mobileLinks}>{renderLinks()}</div>}
    </div>
  );
};

export default Links;
