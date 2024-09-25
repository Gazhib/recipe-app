import NewRecipeForm from "../Components/NewRecipeForm";
import { store, userActions } from "../../store";
import { redirect } from "react-router";
export default function NewRecipePage() {
  return <NewRecipeForm />;
}

export async function action({ request }) {
  const fd = await request.formData();

  const ingredients = fd.getAll("ingredients");
  const name = fd.get("name");
  const description = fd.get("description");
  const instructions = fd.get("instructions");
  const readyIn = fd.get("readyIn");
  const servings = fd.get("servings");
  const state = store.getState();
  const accessToken = state.user.accessToken;
  const author = state.user.username;
  const data = {
    author,
    name,
    ingredients,
    description,
    instructions,
    readyIn,
    servings,
  };

  try {
    const response = await fetch("http://localhost:3000/add-recipe", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const responseData = await response.json();
    if (responseData === "Token is invalid") {
      store.dispatch(userActions.clearInfo());
    }
    if (response.status === 400) {
      return responseData;
    }
  } catch (e) {
    return new Error(e);
  }

  return redirect("/recipes");
}
