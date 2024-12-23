"use client";

import { useState, useEffect } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import Image from "next/image";
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

const links = [
  { type: "Public", title: "Homepage", path: "/" },
  { type: "Public", title: "About", path: "/about" },
  { type: "Private", title: "Portfolio", path: "/portfolio" },
  { type: "Private", title: "Transactions", path: "/transactions" },
  { type: "Private", title: "Agent", path: "/agent" },
  { type: "Private", title: "My Page", path: "/user" },
  { type: "Logout", title: "Logout", path: "/logout" },
  { type: "Login", title: "Login", path: "/login" },
];

const Links = () => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const { user: currentUser } = await app.authenticate();
      if (currentUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      await app.logout();
      console.log("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const linksHTML = links.map((link) => {
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
      <div className={styles.links}>{linksHTML}</div>

      <Image
        className={styles.menuButton}
        src="/menu.png"
        alt="menu"
        width={30}
        height={30}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && <div className={styles.mobileLinks}>{linksHTML}</div>}
    </div>
  );
};

export default Links;
