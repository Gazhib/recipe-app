import { useParams } from "react-router-dom";
import { getRecipe } from "../../API";
import { useQuery } from "react-query";
import styles from "./Food.module.css";
import LoadingSpinner from "../Components/LoadingSpinner";
import ErrorPage from "./Error";
export default function FoodPage() {
  const { foodId } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recipe", foodId],
    queryFn: ({ signal }) => getRecipe({ signal, id: foodId }),
  });

  console.log(data);

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className={styles.FoodPage}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <>
          <img src={data.image} alt={data.title} />
          <div className={styles.foodContent}>
            <h1>{data.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: data.summary }} />
            <p>Ready in: {data.readyInMinutes} minutes</p>
            <p>Servings: {data.servings}</p>
            <p>Health Score: {data.healthScore}</p>
            <p>Price per Serving: {data.pricePerServing} cents</p>
            <p>Gluten Free: {data.glutenFree ? "Yes" : "No"}</p>
            <p>Dairy Free: {data.dairyFree ? "Yes" : "No"}</p>
            {data.dishTypes.length > 0 && (
              <p>Dish Types: {data.dishTypes.join(", ")}</p>
            )}
            {data.cuisines.length > 0 && (
              <p>Cuisines: {data.cuisines.join(", ")}</p>
            )}

            <div>
              <div className={styles.analyzedInstructions}>
                <h2>Instructions:</h2>
                <ul>
                  {data.analyzedInstructions.map((outer, index) => (
                    <li key={index}>
                      <h3>{outer.name}</h3>
                      <ul>
                        {outer.steps.map((step, index) => (
                          <li key={index}>{step.step}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.ingredients}>
                <h2>Ingredients:</h2>
                <ul>
                  {data.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      <h3>{ingredient.original}</h3>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
