export default async function getFood() {
  try {
    const response = await fetch("http://localhost:3000/get-community-recipes");
    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
}
