import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipe } from "../../API";
import { useQuery } from "react-query";
import styles from "./FoodPage.module.css";
export default function FoodPage() {
  const { foodId } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recipe", foodId],
    queryFn: ({ signal }) => getRecipe({ signal, id: foodId }),
  });
  console.log(data);
  return (
    <div className={styles.FoodPage}>
      <img src={data.image} />
      <div className={styles.foodContent}>
        <p>{data.title}</p>
        <div>
          <div className={styles.analyzedInstructions}>
            <p>Instructions:</p>
            <ul>
              {data.analyzedInstructions.map((outer, index) => {
                return (
                  <li key={index}>
                    <h3>{outer.name}</h3>
                    <ul>
                      {outer.steps.map((step, index) => {
                        return <li key={index}>{step.step}</li>;
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.ingredients}>
            <ul>
              <p>Ingredients:</p>
              {data.extendedIngredients.map((ingredient) => {
                return (
                  <li key={ingredient.id}>
                    <h3>{ingredient.original}</h3>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
