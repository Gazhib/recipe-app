import { store } from "../../store";
import AccountInfo from "../Components/AccountInfo";
import styles from "./Account.module.css";
import { userActions } from "../../store";
import { redirect } from "react-router";
export default function AccountPage() {
  return (
    <div className={styles.AccountPage}>
      <AccountInfo />
    </div>
  );
}

export async function loader() {
  const state = store.getState();
  const username = state.user.username;
  const response = await fetch("http://localhost:3000/get-user-information", {
    method: "POST",
    body: JSON.stringify({ username: username }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  if (responseData === "Token is invalid") {
    store.dispatch(userActions.clearInfo());
  }
  return responseData;
}

export async function action({ request }) {
  const fd = await request.formData();
  console.log(fd);
  const state = store.getState();
  const username = state.user.username;
  fd.append("username", username);
  const response = await fetch("http://localhost:3000/upload-photo", {
    method: "POST",
    body: fd,
  });
  const responseData = await response.json();
  console.log(responseData);
  window.location.reload();
  return redirect(`/account/${username}`);
}
