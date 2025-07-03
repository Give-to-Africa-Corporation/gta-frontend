import { useAppContext } from "@/context/AppContext";
import { ProtectedRouteProps } from "@/lib/types";
import { isAuthenticated } from "@/service/apiService";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, refreshUserData, isLoading } = useAppContext();
  const navigate = useNavigate();
  // Try to refresh user data if we have a token but no user data
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated() && !user && !isLoading) {
        const userData = await refreshUserData();

        if (!userData) {
          // If refresh user data fails, navigate to login after a short delay
          setTimeout(() => {
            navigate(role === "admin" ? "/admin/login" : "/login", {
              replace: true,
            });
          }, 100);
        }
      }
    };

    loadUserData();
  }, [user, isLoading, role, navigate, refreshUserData]);

  // Check for authentication token first
  const hasToken = isAuthenticated();
  if (!hasToken) {
    return (
      <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />
    );
  }

  // If we're still loading data, show a loading indicator or the children
  if (isLoading) {
    return <>{children}</>; // We could add a loading spinner here
  }

  // If no user data is loaded yet (but token exists and we're not loading),
  // wait for the useEffect to handle it
  if (!user && hasToken && !isLoading) {
    return <>{children}</>;
  }

  // We have user data, check the status
  if (user) {
    // For NGO role, check approval status
    if (role === "ngo") {
      if (user.status === "pending" && !user.profileComplete) {
        return <Navigate to="/registration" replace />;
      } else if (user.status === "pending") {
        return <Navigate to="/verification-pending" replace />;
      } else if (user.status === "rejected") {
        return <Navigate to="/verification-rejected" replace />;
      }

      // User is approved and profile is complete
    }

    // For admin role (future implementation)
    if (role === "admin") {
      // TODO: Implement admin role check
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
