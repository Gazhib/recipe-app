import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useRef } from "react";
export default function Header() {
  const searchRef = useRef();
  const navigate = useNavigate();
  function handleSearch(event) {
    event.preventDefault();
    const searched = searchRef.current.value;
    navigate(`/recipes?search=${searched}`);
  }

  return (
    <header className={styles.header}>
      <div className={styles.siteName}>
        <Link to="/">
          <h1>
            I&apos;m <span>the</span> cook
          </h1>
        </Link>
      </div>
      <div className={styles.search}>
        <h1>
          <form onSubmit={handleSearch}>
            <input
              ref={searchRef}
              placeholder="Search for recipes..."
              type="text"
            />
          </form>
        </h1>
      </div>
      <div className={styles.router}>
        <Link className={styles.routerButton} to="/">
          Home
        </Link>
        <Link className={styles.routerButton} to="/recipes">
          Recipes
        </Link>
        <Link className={styles.routerButton} to="/auth?mode=login">
          Auth
        </Link>
      </div>
    </header>
  );
}
