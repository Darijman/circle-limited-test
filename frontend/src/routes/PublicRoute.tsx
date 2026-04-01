import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}
