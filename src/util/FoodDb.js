const api_base_url = import.meta.env.VITE_APP_API_BASE_URL;
export default async function getFood() {
  try {
    const response = await fetch(`${api_base_url}/get-community-recipes`);
    const responseData = await response.json();
    return { recipes: responseData };
  } catch (e) {
    throw new Error();
  }
}

export async function getCommunityRecipe(foodId) {
  try {
    const response = await fetch(`${api_base_url}/get-community-recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ food: foodId }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (e) {
    throw new Error();
  }
}
