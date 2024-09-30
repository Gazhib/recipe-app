import { Form, useActionData, useNavigation } from "react-router-dom";
import styles from "./NewRecipeForm.module.css";
import { useState } from "react";
import ImagePicker from "./ImagePicker";
export default function NewRecipeForm() {
  const [ingredients, setIngredients] = useState(["", "", ""]);
  const [instructions, setInstructions] = useState(["", "", ""]);
  const [ingredientErrorText, setIngredientErrorText] = useState("");
  const [instructionErrorText, setInstructionErrorText] = useState("");
  const navigation = useNavigation();
  const error = useActionData();
  const isSubmitting = navigation.state === "submitting";

  function changeSomething(cur_index, cur_value, type = "ingredient") {
    if (type === "ingredient") {
      setIngredients((prevIngredients) => {
        return prevIngredients.map((value, index) => {
          if (index === cur_index) {
            return cur_value;
          }
          return value;
        });
      });
    } else {
      setInstructions((prevInstructions) => {
        return prevInstructions.map((value, index) => {
          if (index === cur_index) {
            return cur_value;
          }
          return value;
        });
      });
    }
  }

  function removeSomething(cur_index, type = "ingredient") {
    if (type === "ingredient") {
      if (ingredients.length === 1) {
        setIngredientErrorText("Have at least 1 ingredient");
        return;
      }
      setIngredients((prevIngredients) => {
        return prevIngredients.filter((value, index) => index !== cur_index);
      });
    } else {
      if (instructions.length === 1) {
        setInstructionErrorText("Have at least 1 instruction");
        return;
      }
      setInstructions((prevInstructions) => {
        return prevInstructions.filter((value, index) => index !== cur_index);
      });
    }
  }

  function addSomething(type = "ingredient") {
    if (type === "ingredient") {
      setIngredients((prevIngredients) => [...prevIngredients, ""]);
      setIngredientErrorText("");
    } else {
      setInstructions((prevInstructions) => [...prevInstructions, ""]);
      setInstructionErrorText("");
    }
  }

  return (
    <div className={styles.NewRecipeForm}>
      <Form method="post" encType="multipart/form-data">
        <label>Name of the Recipe</label>
        <input className={styles.name} type="text" name="title" />
        <label>Description of the recipe</label>
        <textarea
          className={styles.description}
          type="text"
          name="description"
        ></textarea>
        <label>Instructions</label>
        {instructionErrorText && <p>{instructionErrorText}</p>}
        {instructions.map((instructions, index) => {
          return (
            <div key={index} className={styles.ingredientsContainer}>
              <input
                value={instructions}
                className={styles.ingredients}
                type="text"
                name="analyzedInstructions"
                onChange={(e) =>
                  changeSomething(index, e.target.value, "instruction")
                }
              />
              <button
                type="button"
                onClick={() => removeSomething(index, "instruction")}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          );
        })}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addSomething("instruction")}
        >
          Add Instruction
        </button>
        <label>Ingredients</label>
        {ingredientErrorText && <p>{ingredientErrorText}</p>}
        {ingredients.map((ingredient, index) => {
          return (
            <div key={index} className={styles.ingredientsContainer}>
              <input
                value={ingredient}
                className={styles.ingredients}
                type="text"
                name="extendedIngredients"
                onChange={(e) => changeSomething(index, e.target.value)}
              />
              <button type="button" onClick={() => removeSomething(index)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          );
        })}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addSomething()}
        >
          Add Ingredient
        </button>
        <label>Ready in (in minutes)</label>
        <input
          className={styles.readyIn}
          type="number"
          name="readyInMinutes"
          min={0}
        />
        <label>Servings</label>
        <input
          className={styles.servings}
          type="number"
          name="servings"
          min={1}
        />
        <ImagePicker />
        <button disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
}
