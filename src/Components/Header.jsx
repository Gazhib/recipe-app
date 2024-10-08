import { Link, useMatch, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
export default function Header() {
  const searchRef = useRef();
  const navigate = useNavigate();
  const isCommunityRecipes = useMatch("/community-recipes") !== null;
  function handleSearch(event) {
    event.preventDefault();
    const searched = searchRef.current.value;

    navigate(
      `/${
        isCommunityRecipes ? "community-recipes" : "recipes"
      }?search=${searched}`
    );
  }
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search"));
  const info = useSelector((state) => state.user);

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
              onChange={(e) => setSearch(e.target.value)}
              ref={searchRef}
              placeholder="Search for recipes..."
              value={search}
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
        {!info.username && (
          <Link className={styles.routerButton} to="/auth?mode=login">
            Auth
          </Link>
        )}
        {info.username && (
          <Link
            to={`/account/${info.username}`}
            className={styles.routerButton}
          >
            My account
          </Link>
        )}
      </div>
    </header>
  );
}
