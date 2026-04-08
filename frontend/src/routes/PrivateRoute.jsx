import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (
    currentUser &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (currentUser?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  }

  if (
    currentUser &&
    currentUser?.role === "admin" &&
    location.pathname.includes("user")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }
  if (
    currentUser &&
    currentUser?.role === "user" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/user/dashboard" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
