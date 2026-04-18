import React from 'react';
import styles from "./Header.module.css";

export default function Header() {
    return (
              <section className={styles.topBar}>
        <div className={styles.logo}>
          <div className={styles.logoDot} />
          <span>Logo</span>
        </div>
        
        <a href="/" className={styles.outlineButton}>
          Get Started
        </a>
      </section>
    );
    }