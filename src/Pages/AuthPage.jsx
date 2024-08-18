import {
  useSearchParams,
  Link,
  useActionData,
  redirect,
} from "react-router-dom";
import styles from "./AuthPage.module.css";
import AuthForm from "../Components/AuthForm";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userActions } from "../../store";
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const data = useActionData();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data && data.success) {
      dispatch(userActions.getInfo(data.userData));

      return redirect("/");
    }
  }, [data, dispatch]);
  return (
    <div className={styles.AuthPage}>
      <div className={styles.authContainer}>
        <div className={styles.auth}>
          <header className={styles.header}>
            <h1>Enter your info to Log In</h1>
            <h2>
              {isLogin
                ? "You still got no bitches?"
                : "You already got bitches?"}{" "}
              <Link to={isLogin ? "/auth?mode=signup" : "/auth?mode=login"}>
                {isLogin ? "Sign Up" : "Log In"}
              </Link>
            </h2>
          </header>
          <AuthForm isLogin={isLogin} />
          {data && !data.success && (
            <div className={styles.problems}>
              <h1>{data.message}</h1>
            </div>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <h2>We do cooking</h2>
        <h2>Find any recipe</h2>
        <h2>Add you own recipes</h2>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const fd = await request.formData();
  let data;
  const isLogin = searchParams.get("mode") === "login";
  if (isLogin) {
    data = {
      email: fd.get("email"),
      password: fd.get("password"),
    };
  } else {
    data = {
      email: fd.get("email"),
      password: fd.get("password"),
      username: fd.get("username"),
      confirmPassword: fd.get("confirmPassword"),
    };
  }

  let url = "http://localhost:3000/api/";

  const response = await fetch(`${url}${isLogin ? "login" : "registration"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 400) {
    return {
      success: false,
      message: await response.json(),
    };
  }
  if (response.status === 401) {
    return {
      success: false,
      message: await response.json(),
    };
  }
  if (response.status === 404) {
    return {
      success: false,
      message: await response.json(),
    };
  }
  if (response.status === 409) {
    return { success: false, message: await response.json() };
  }

  const userData = await response.json();
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expiration", expiration.toISOString());

  return { success: true, userData };
}
