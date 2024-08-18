import FoodCard from "./FoodCard";
import { Link } from "react-router-dom";
export default function FoodList({ foodList }) {
  return foodList.map((food) => {
    return (
      <Link key={food.id} to={`${food.id}`}>
        <FoodCard food={food} />
      </Link>
    );
  });
}
