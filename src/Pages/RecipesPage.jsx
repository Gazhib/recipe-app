import styles from "./RecipesPage.module.css";
import FoodCard from "../Components/FoodCard";
import { getHits } from "../../API";
import { Link, useLoaderData } from "react-router-dom";
export default function RecipesPage() {
  const foodHits = useLoaderData();
  return (
    <div>
      <div className={styles.FoodCardList}>
        {foodHits.map((food) => {
          return (
            <Link key={food.id} to={`${food.id}`}>
              <FoodCard food={food} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function loader() {
  const result = await getHits();
  return result;
}
