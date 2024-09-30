import { useMatch, useParams } from "react-router-dom";
import { getRecipe } from "../../API";
import { useQuery } from "react-query";
import styles from "./Food.module.css";
import LoadingSpinner from "../Components/LoadingSpinner";
import ErrorPage from "./Error";
import { getCommunityRecipe } from "../util/FoodDb";

export default function FoodPage() {
  const { foodId } = useParams();
  const isCommunityRecipes = useMatch("/community-recipes/:foodId");

  const queryKey = isCommunityRecipes
    ? ["communityRecipe", foodId]
    : ["recipe", foodId];

  const queryFn = !isCommunityRecipes
    ? ({ signal }) => getRecipe({ signal, id: foodId })
    : () => getCommunityRecipe({ id: foodId });

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!isLoading) {
    console.log(data.analyzedInstructions);
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className={styles.FoodPage}>
      <img src={data.image} alt={data.title} />
      <div className={styles.foodContent}>
        <h1>{data.title}</h1>
        {!isCommunityRecipes && (
          <p dangerouslySetInnerHTML={{ __html: data.summary }} />
        )}
        <p>Ready in: {data.readyInMinutes} minutes</p>
        <p>Servings: {data.servings}</p>
        {!isCommunityRecipes && <p>Health Score: {data.healthScore}</p>}
        {!isCommunityRecipes && (
          <>
            <p>Price per Serving: {data.pricePerServing} cents</p>
            <p>Gluten Free: {data.glutenFree ? "Yes" : "No"}</p>
            <p>Dairy Free: {data.dairyFree ? "Yes" : "No"}</p>
          </>
        )}
        {!isCommunityRecipes && data.dishTypes.length > 0 && (
          <p>Dish Types: {data.dishTypes.join(", ")}</p>
        )}
        {!isCommunityRecipes && data.cuisines.length > 0 && (
          <p>Cuisines: {data.cuisines.join(", ")}</p>
        )}

        <div>
          <div className={styles.analyzedInstructions}>
            <h2>Instructions:</h2>
            <ul>
              {data.analyzedInstructions.map((outer, index) => (
                <li key={index}>
                  <h3>{outer.name || outer}</h3>
                  <ul>
                    {!isCommunityRecipes &&
                      outer.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step.step}</li>
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
                <li key={ingredient.id || ingredient}>
                  <h3>{ingredient.original || ingredient}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
