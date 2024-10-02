/* eslint-disable react/prop-types */
import { Form, useNavigation } from "react-router-dom";
import styles from "./AuthForm.module.css";
export default function AuthForm({ isLogin }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form method="post" className={styles.form}>
      <label>Email</label>
      <input required type="email" name="email" />
      {!isLogin && (
        <>
          <label>Username</label>
          <input required type="username" name="username" />
        </>
      )}
      <label>Password</label>
      <input required type="password" name="password" />
      {!isLogin && (
        <>
          <label>Confirm password</label>
          <input required type="password" name="confirmPassword" />
        </>
      )}
      <button>
        {isLogin
          ? !isSubmitting
            ? "Log In"
            : "Logging In..."
          : !isSubmitting
          ? "Sign Up"
          : "Signing In..."}
      </button>
    </Form>
  );
}
