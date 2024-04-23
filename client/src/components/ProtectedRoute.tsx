import React from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = Cookies.get("token");

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  return children ? children : <Outlet />;
}
