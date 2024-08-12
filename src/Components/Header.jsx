import { Link } from "react-router-dom";
import styles from "./Header.module.css";
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.siteName}>
        <h1>
          I&apos;m <span>the</span> cook
        </h1>
      </div>
      <div className={styles.search}>
        <h1>
          <input placeholder="Search for recipes..." type="text" />
        </h1>
      </div>
      <div className={styles.router}>
        <Link className={styles.routerButton} to="/">
          Home
        </Link>
        <Link className={styles.routerButton} to="/recipes">
          Recipes
        </Link>
      </div>
    </header>
  );
}
