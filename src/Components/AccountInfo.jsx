import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store";
import { useEffect, useState } from "react";
import styles from "./AccountInfo.module.css";
import ImagePicker from "./ImagePicker";
export default function AccountInfo() {
  const data = useLoaderData();
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (data.username !== params.username) {
      navigate(`/account/${data.username}`);
      return;
    }
  }, [data.username, params.username, navigate]);
  const PERSONAL_RECIPES = data.recipes || [];
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isPressed, setIsPressed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const info = useSelector((state) => state.user);
  const api_base_url = import.meta.env.VITE_APP_API_BASE_URL;

  let content;

  async function deleteRecipe(id, username) {
    setIsDeleting(true);
    setDeletingId(id);
    const response = await fetch(`${api_base_url}/delete-recipe`, {
      method: "POST",
      body: JSON.stringify({ id, username }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      window.location.reload();
    } else {
      setErrorText("Something went wrong... Could not delete.");
    }
  }

  if (isEdit) {
    content = (
      <>
        {PERSONAL_RECIPES.length === 0 ? (
          "No personal recipes yet, but you can add one"
        ) : (
          <ul>
            {PERSONAL_RECIPES.map((recipe) => (
              <li key={recipe.newId}>
                <Link to={`/community-recipes/${recipe.newId}`}>
                  <p>{recipe.title}</p>
                  <img src={recipe.url} />
                </Link>
                <button
                  onClick={() => deleteRecipe(recipe.newId, data.username)}
                >
                  {isDeleting && deletingId === recipe.newId
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  } else {
    content = (
      <>
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
      </>
    );
  }

  useEffect(() => {
    if (!info.username) {
      navigate("/");
      return;
    }
  }, [info, navigate]);

  async function handleLogout() {
    setIsPressed(true);
    const response = await fetch(`${api_base_url}/api/logout`, {
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
      <section className={styles.personalInfo}>
        <h2>Personal Information</h2>
        <img className={styles.profileImage} src={data.image} />
        <Form
          method="post"
          encType="multipart/form-data"
          className={styles.photoContainer}
        >
          <strong>Username:</strong> {data.username}
          <ImagePicker />
          <button disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </Form>
      </section>
      <section className={styles.personalRecipes}>
        <button
          className={styles.editButton}
          onClick={() =>
            setIsEdit((prevIsEdit) => {
              return !prevIsEdit;
            })
          }
        >
          {isEdit ? "Stop editing" : "Edit"}
        </button>
        <h2>My Personal Recipes:</h2>
        <h3 className={styles.errorText}>{errorText}</h3>
        {PERSONAL_RECIPES.length === 0 ? (
          "No personal recipes yet, but you can add one"
        ) : (
          <ul>{content}</ul>
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
