/* eslint-disable react/prop-types */
import styles from "./FoodCard.module.css";
export default function FoodCard({ food }) {
  return (
    <div className={styles.FoodCard}>
      <img src={food.image} />
      <div className={styles.cardContent}>
        <div className={styles.cardTime}>
          <span>
            {food.readyInMinutes
              ? `⏱️ ${food.readyInMinutes} min`
              : "Depends on you"}
          </span>
        </div>
        <h2 className={styles.cardTitle}>{food.title}</h2>
        <p className={styles.cardCategory}>
          {food.dishTypes.map((dishType, index) => {
            if (index === food.dishTypes.length - 1) {
              return dishType;
            } else if (index >= 3) {
              return null;
            } else {
              return dishType + ", ";
            }
          })}
        </p>
        <div className={styles.cardTags}>
          {food.diets.map((dishType, index) => {
            if (index > 3) {
              return null;
            }
            return (
              <span key={index} className={styles.tag}>
                {dishType}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
