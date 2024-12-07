"use client";

import { useState } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const links = [
  { type: "Public", title: "Homepage", path: "/" },
  { type: "Public", title: "About", path: "/about" },
  { type: "Private", title: "Portfolio", path: "/portfolio" },
  { type: "Private", title: "Transactions", path: "/transactions" },
  { type: "Private", title: "My Page", path: "/user" },
  { type: "Logout", title: "Logout", path: "/logout" },
  { type: "Login", title: "Login", path: "/login" },
];

const Links = () => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const result = await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const linksHTML = links.map((link) => {
    if (link.type === "Public") {
      return <NavLink item={link} key={link.title} />;
    }
    if (link.type === "Private" && session?.user) {
      return <NavLink item={link} key={link.title} />;
    }
    if (link.type === "Login" && !session) {
      return <NavLink item={link} key={link.title} />;
    }
    if (link.type === "Logout" && session) {
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
