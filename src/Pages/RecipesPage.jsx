import styles from "./RecipesPage.module.css";
import { searchRecipes } from "../../API";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import FoodList from "../Components/FoodList";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function RecipesPage() {
  const [foodList, setFoodList] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const { isFetching, refetch } = useQuery({
    queryFn: () => searchRecipes(search),
    queryKey: ["searchRecipe", search],
    onSuccess: (recipes) => {
      if (!search) {
        setFoodList(recipes.recipes);
      } else {
        setFoodList(recipes.results);
      }
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!search) {
      refetch();
    }
  }, [search, refetch]);

  let content;

  if (isFetching) {
    content = <LoadingSpinner />;
  }

  if (!isFetching) {
    content = <FoodList foodList={foodList} />;
  }

  if (!isFetching && foodList.length === 0 && search) {
    content = <p>No results found for &quot;{search}&quot;</p>;
  }

  return (
    <div>
      <div className={styles.FoodCardList}>{content}</div>
    </div>
  );
}
