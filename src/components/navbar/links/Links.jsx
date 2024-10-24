"use client";

import { useState } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import Image from "next/image";
import { doLogout } from "@/app/actions";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { title: "Homepage", path: "/" },
  { title: "About", path: "/about" },
];

const Links = ({ session }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const result = await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink item={link} key={link.title} />
        ))}
        {session?.user ? (
          <>
            {session.user?.isAdmin && (
              <NavLink item={{ title: "Admin", path: "/admin" }} />
            )}
            <NavLink item={{ title: "Portfolio", path: "/portfolio" }} />
            <NavLink item={{ title: "Transactions", path: "/transactions" }} />
            <NavLink item={{ title: "My Page", path: "/user" }} />
            <button onClick={handleLogout} className={styles.logout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink item={{ title: "Login", path: "/login" }} />
        )}
      </div>
      <Image
        className={styles.menuButton}
        src="/menu.png"
        alt="menu"
        width={30}
        height={30}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className={styles.mobileLinks}>
          {links.map((link) => (
            <NavLink item={link} key={link.title} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Links;
