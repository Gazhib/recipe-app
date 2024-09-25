import { Form, useActionData, useNavigation } from "react-router-dom";
import styles from "./NewRecipeForm.module.css";
import { useState } from "react";
export default function NewRecipeForm() {
  const [ingredients, setIngredients] = useState(["", "", ""]);
  const [errorText, setErrorText] = useState("");
  const navigation = useNavigation();
  const error = useActionData();
  const isSubmitting = navigation.state === "submitting";

  function changeIngredients(cur_index, cur_value) {
    setIngredients((prevIngredients) => {
      return prevIngredients.map((value, index) => {
        if (index === cur_index) {
          return cur_value;
        }
        return value;
      });
    });
  }

  function removeIngredient(cur_index) {
    if (ingredients.length === 1) {
      setErrorText("Have at least 1 ingredient");
      return;
    }
    setIngredients((prevIngredients) => {
      return prevIngredients.filter((value, index) => index !== cur_index);
    });
  }

  function addIngredient() {
    setIngredients((prevIngredients) => {
      return [...prevIngredients, ""];
    });
    setErrorText("");
  }

  return (
    <div className={styles.NewRecipeForm}>
      <Form method="post">
        <label>Name of the Recipe</label>
        <input className={styles.name} type="text" required name="name"></input>
        <label>Description of the recipe</label>
        <textarea
          className={styles.description}
          type="text"
          required
          name="description"
        ></textarea>
        <label>Instructions</label>
        <textarea
          className={styles.instructions}
          type="text"
          required
          name="instructions"
        ></textarea>
        <label>Ingredients</label>
        {errorText && <p>{errorText}</p>}
        {ingredients.map((ingredient, index) => {
          return (
            <div key={index} className={styles.ingredientsContainer}>
              <input
                value={ingredient}
                className={styles.ingredients}
                type="text"
                required
                name="ingredients"
                onChange={(e) => changeIngredients(index, e.target.value)}
              ></input>
              <button type="button" onClick={() => removeIngredient(index)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          );
        })}
        <button
          className={styles.addButton}
          type="button"
          onClick={addIngredient}
        >
          Add Ingredient
        </button>
        <label>Ready in (in minutes)</label>
        <input
          className={styles.readyIn}
          type="number"
          required
          name="readyIn"
          min={0}
        ></input>
        <label>Servings</label>
        <input
          className={styles.servings}
          type="number"
          required
          name="servings"
          min={1}
        ></input>
        <button disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
}
