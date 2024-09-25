import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store";
export default function Header() {
  const searchRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleSearch(event) {
    event.preventDefault();
    const searched = searchRef.current.value;
    navigate(`/recipes?search=${searched}`);
  }

  async function handleLogout() {
    const response = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      body: JSON.stringify({
        token: info.refreshToken,
      }),
      headers: {
        authorization: `Bearer ${info.accessToken}`,
      },
    });
    if (response.status === 200) {
      dispatch(userActions.clearInfo());
    }
  }

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
        {!info.username ? (
          <Link className={styles.routerButton} to="/auth?mode=login">
            Auth
          </Link>
        ) : (
          <Link onClick={handleLogout} className={styles.routerButton}>
            Log out
          </Link>
        )}
        {info.username && (
          <Link to = {`/account/${info.username}`} className={styles.routerButton}>My account</Link>
        )}
      </div>
    </header>
  );
}
