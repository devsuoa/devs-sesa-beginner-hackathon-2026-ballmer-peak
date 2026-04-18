import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrap}>
        <span className={styles.logoIcon} aria-hidden="true" />
        <span className={styles.logoText}>Logo</span>
      </div>

      <div className={styles.profilePill} aria-hidden="true" />
    </header>
  );
}

export default Header;
