import { useSelector } from "react-redux";
import styles from "./HomePage.module.css";
export default function HomePage() {
  const userData = useSelector((state) => state.user);
  console.log(userData);
  return (
    <div className={styles.HomePage}>
      <p>
        <span>Welcome to the</span> I&apos;M <span>THE</span> COOK
      </p>
      <h1>
        Find any recipe, see facts about nutritions and instructions on how to
        cook.
      </h1>
    </div>
  );
}
