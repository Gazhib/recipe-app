import { Outlet } from "react-router";
import Header from "./Components/Header";
export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
