"use client";

import styles from "./navLink.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ item }) => {
  const pathName = usePathname();
  let activeFlag = pathName.includes(item.path);
  if (activeFlag && pathName !== "/" && item.path === "/") activeFlag = false;
  return (
    <Link
      href={item.path}
      className={`${styles.container} ${activeFlag && styles.active}`}
    >
      {item.title}
    </Link>
  );
};

export default NavLink;
