import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import "./index.css";
import RecipesPage, { loader as recipesLoader } from "./Pages/RecipesPage";
import RootLayout from "./RootLayout";
import FoodPage from "./Pages/FoodPage";
import { QueryClient, QueryClientProvider } from "react-query";
export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: 1,
          element: <HomePage />,
        },
        {
          path: "recipes",
          loader: recipesLoader,
          element: <RecipesPage />,
        },
        {
          path: "/recipes/:foodId",
          element: <FoodPage />,
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
