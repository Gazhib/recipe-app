import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store";
import { useEffect, useState } from "react";
import styles from "./AccountInfo.module.css";
export default function AccountInfo() {
  const data = useLoaderData();
  const PERSONAL_RECIPES = data.recipes || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  const info = useSelector((state) => state.user);
  useEffect(() => {
    if (!info.username) {
      navigate("/");
      return;
    }
  }, [info, navigate]);
  async function handleLogout() {
    setIsPressed(true);
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
      setIsPressed(false);
      navigate("/");
    }
  }
  return (
    <>
      {" "}
      <section className={styles.personalInfo}>
        <img className={styles.profileImage} />
        <h2>Personal Information</h2>
        <p>
          <strong>Username:</strong> {data.username}
        </p>
      </section>
      <section className={styles.personalRecipes}>
        <h2>My Personal Recipes:</h2>
        {PERSONAL_RECIPES.length === 0 ? (
          "No personal recipes yet, but you can add one"
        ) : (
          <ul>
            {PERSONAL_RECIPES.map((recipe, index) => (
              <li key={index}>
                <Link to={`/community-recipes/${recipe.newId}`}>
                  <p>{recipe.title}</p>
                  <img src={recipe.url} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          to={"/community-recipes/new-recipe"}
          className={styles.addRecipeButton}
        >
          Add My Personal Recipe
        </Link>
      </section>
      <div className={styles.logout}>
        <button onClick={handleLogout} to="/logout">
          {isPressed ? "Logging Out..." : "Logout"}
        </button>
      </div>
    </>
  );
}
