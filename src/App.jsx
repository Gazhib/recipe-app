import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/Home";
import "./index.css";
import RecipesPage from "./Pages/Recipes";
import RootLayout from "./RootLayout";
import FoodPage from "./Pages/Food";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorPage from "./Pages/Error";
import AuthPage, { action } from "./Pages/Auth";
import { Provider } from "react-redux";
import { store, persistor } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import NewRecipePage, { action as newRecipeAction } from "./Pages/NewRecipe";
import AccountPage, {
  loader as infoLoader,
  action as infoAction,
} from "./Pages/Account";
export default function App() {
  const queryClient = new QueryClient();

  const router = createHashRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "/recipes",
          element: <RecipesPage />,
        },

        {
          path: "/recipes/:foodId",
          element: <FoodPage />,
        },
        {
          path: "/community-recipes",
          element: <RecipesPage />,
        },
        {
          path: "/community-recipes/new-recipe",
          element: <NewRecipePage />,
          action: newRecipeAction,
        },
        {
          path: "/community-recipes/:foodId",
          element: <FoodPage />,
        },
        {
          path: "/auth",
          element: <AuthPage />,
          action: action,
        },
        {
          path: "/account/:username",
          element: <AccountPage />,
          loader: infoLoader,
          action: infoAction,
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
