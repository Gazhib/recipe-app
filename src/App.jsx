import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import "./index.css";
import RecipesPage from "./Pages/RecipesPage";
import RootLayout from "./RootLayout";
import FoodPage from "./Pages/FoodPage";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorPage from "./Pages/ErrorPage";
import AuthPage, { action } from "./Pages/AuthPage";
import { Provider } from "react-redux";
import store from "../store";
export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
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
          path: "recipes",
          element: <RecipesPage />,
        },
        {
          path: "/recipes/:foodId",
          element: <FoodPage />,
        },
        {
          path: "/auth",
          element: <AuthPage />,
          action: action,
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}
