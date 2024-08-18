import { json } from "react-router";

const url = "https://api.spoonacular.com/recipes";
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

export async function getHits() {
  const response = await fetch(`${url}/random?apiKey=${API_KEY}&number=15`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw json(
      {
        message: "Could not fetch events",
      },
      {
        status: 500,
      }
    );
  }
  const responseData = await response.json();
  return responseData.recipes;
}

export async function getRecipe({ signal, id }) {
  const response = await fetch(`${url}/${id}/information?apiKey=${API_KEY}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: signal,
  });

  if (!response.ok) {
    throw json(
      {
        message: "Could not fetch events",
      },
      {
        status: 500,
      }
    );
  }
  const responseData = await response.json();
  return responseData;
}

export async function searchRecipes(searched) {
  let query = `/complexSearch?apiKey=${API_KEY}&query=${searched}`;
  if (!searched) {
    query = `/random?apiKey=${API_KEY}&number=15`;
  }
  const response = await fetch(`${url}/${query}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw json(
      {
        message: "Could not fetch events",
      },
      {
        status: 500,
      }
    );
  }
  const responseData = await response.json();
  return responseData;
}
