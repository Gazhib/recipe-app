import NewRecipeForm from "../Components/NewRecipeForm";
import { store, userActions } from "../../store";
import { redirect, useNavigate } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function NewRecipePage() {
  const info = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!info.username) {
      navigate("/");
      return;
    }
  });
  return <NewRecipeForm />;
}

export async function action({ request }) {
  const fd = await request.formData();

  const state = store.getState();
  const author = state.user.username;
  fd.append("author", author);
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

  return redirect("/community-recipes");
}
