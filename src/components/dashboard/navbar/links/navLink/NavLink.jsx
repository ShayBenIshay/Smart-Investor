"use client";

import styles from "./navLink.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ item }) => {
  const pathName = usePathname();

  // Improved active state logic
  const isActive = () => {
    if (pathName === "/" && item.path === "/") return true;
    if (pathName !== "/" && item.path !== "/") {
      return pathName.startsWith(item.path);
    }
    return false;
  };

  return (
    <Link
      href={item.path}
      className={`${styles.container} ${isActive() ? styles.active : ""}`}
      aria-current={isActive() ? "page" : undefined}
    >
      {item.title}
    </Link>
  );
};

export default NavLink;
