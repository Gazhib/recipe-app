import { NavLink } from "react-router-dom";
import styles from "./CommunityRecipes.module.css";
import { useQuery } from "react-query";
import getFood from "../util/FoodDb";
import LoadingSpinner from "../Components/LoadingSpinner";
import FoodList from "../Components/FoodList";
export default function CommunityRecipesPage() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["FoodDataBase"],
    queryFn: getFood,
  });
  let content;
  if (isError) {
    return new Error();
  }

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  if (!isLoading) {
    content = <FoodList foodList={data} />;
  }

  return (
    <>
      <header>
        <NavLink to="/recipes">Website Recipes</NavLink>
        <NavLink to="/community-recipes">Community Recipes</NavLink>
      </header>
      <div>
        <div className={styles.FoodCardList}>{content}</div>
      </div>
    </>
  );
}
