import { store } from "../../store";
import AccountInfo from "../Components/AccountInfo";
import styles from "./Account.module.css";
import { userActions } from "../../store";
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
