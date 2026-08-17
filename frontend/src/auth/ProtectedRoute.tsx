import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "ADMIN" | "EMPLOYEE";
}

function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}

export default ProtectedRoute;