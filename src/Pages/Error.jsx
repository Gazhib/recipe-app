/* eslint-disable react/prop-types */
import styles from "./Error.module.css";
export default function ErrorPage({
  error = "We're sorry, but an error occurred while processing your request.",
}) {
  console.log("something")
  return (
    <div className={styles.ErrorPage}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error}</p>
    </div>
  );
}
