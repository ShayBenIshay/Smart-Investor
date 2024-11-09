"use client";
import styles from "./navbar.module.css";
import Link from "next/link";
import Links from "./links/Links";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleClickOutside = (event) => {
    if (navbar.current && !navbar.current.contains(event.target)) {
      setMobileMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navbar = useRef();

  return (
    <div id="navbar" ref={navbar} className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Smart Investor
      </Link>
      <div className={styles.linksContainer}>
        <Links />
      </div>
    </div>
  );
};

export default Navbar;
