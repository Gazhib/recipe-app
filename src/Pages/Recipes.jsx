import styles from "./Recipes.module.css";
import { searchRecipes } from "../../API";
import { NavLink, useMatch, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import FoodList from "../Components/FoodList";
import LoadingSpinner from "../Components/LoadingSpinner";
import getFood from "../util/FoodDb";

export default function RecipesPage() {
  const [foodList, setFoodList] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const isRecipes = useMatch("/recipes") !== null;
  const { isFetching, refetch } = useQuery({
    queryFn: !isRecipes ? () => getFood() : () => searchRecipes(search),
    queryKey: [isRecipes, search],
    onSuccess: (data) => {
      if (isRecipes) {
        if (!search) {
          setFoodList(data.recipes);
        } else {
          setFoodList(data.results);
        }
      } else {
        setFoodList(data.recipes);
      }
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (search || !isRecipes || !search) {
      refetch();
    }
  }, [search, refetch, isRecipes]);

  let content;

  if (isFetching) {
    content = <LoadingSpinner />;
  }

  if (!isFetching) {
    content = <FoodList foodList={foodList} />;
  }

  if (isRecipes && !isFetching && foodList.length === 0 && search) {
    content = <p>No results found for &quot;{search}&quot;</p>;
  }

  return (
    <div className={styles.RecipesPage}>
      <header>
        <NavLink to="/recipes">Website Recipes</NavLink>
        <NavLink to="/community-recipes">Community Recipes</NavLink>
      </header>
      <div>
        <div className={styles.FoodCardList}>{content}</div>
      </div>
    </div>
  );
}
