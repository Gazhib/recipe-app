/* eslint-disable react/prop-types */
import styles from "./ErrorPage.module.css";
export default function ErrorPage({
  error = "We're sorry, but an error occurred while processing your request.",
}) {
  return (
    <div className={styles.ErrorPage}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error}</p>
    </div>
  );
}
