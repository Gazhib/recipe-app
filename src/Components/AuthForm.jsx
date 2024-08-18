/* eslint-disable react/prop-types */
import { Form } from "react-router-dom";
import styles from "./AuthForm.module.css";
export default function AuthForm({ isLogin }) {
  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const fd = new FormData(event.target);
  //   const data = Object.fromEntries(fd.entries())
  //   console.log(data)
  // }

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
      <button>{isLogin ? "Log In" : "Sign Up"}</button>
    </Form>
  );
}


