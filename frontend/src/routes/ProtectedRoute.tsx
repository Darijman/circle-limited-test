import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
}
