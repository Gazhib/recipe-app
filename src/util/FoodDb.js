export default async function getFood() {
  try {
    const response = await fetch("http://localhost:3000/get-community-recipes");
    const responseData = await response.json();
    return { recipes: responseData };
  } catch (e) {
    console.log(e);
    throw new Error();
  }
}

export async function getCommunityRecipe(foodId) {
  try {
    const response = await fetch("http://localhost:3000/get-community-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ food: foodId }),
    });
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (e) {
    console.log(e);
  }
}
