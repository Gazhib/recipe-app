import NewRecipeForm from "../Components/NewRecipeForm";
import { store, userActions } from "../../store";
import { redirect } from "react-router";
export default function NewRecipePage() {
  return <NewRecipeForm />;
}

export async function action({ request }) {
  const fd = await request.formData();
  const state = store.getState();
  const accessToken = state.user.accessToken;
  try {
    const response = await fetch("http://localhost:3000/add-recipe", {
      method: "POST",
      body: fd,
      headers: {
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
