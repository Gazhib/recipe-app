import styles from "./Home.module.css";
export default function HomePage() {
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
