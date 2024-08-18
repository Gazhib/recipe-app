import { json, Outlet } from "react-router";
import Header from "./Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTokenDuration } from "./util/auth";
import { userActions } from "../store";
export default function RootLayout() {
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    async function refresh() {
      const response = await fetch("http://localhost:3000/api/refresh", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
        method: "POST",
      });
      if (!response.ok) {
        throw json({ message: "Could not fetch" }, { status: 500 });
      }

      const newData = await response.json();
      console.log(newData)
      dispatch(
        userActions.getInfo({
          accessToken: newData.accessToken,
          refreshToken: newData.refreshToken,
        })
      );
    }
    
    const duration = getTokenDuration();
    let timer;
    console.log(duration);
    refresh();

    timer = setTimeout(() => {
      refresh();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [accessToken, dispatch, refreshToken]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
