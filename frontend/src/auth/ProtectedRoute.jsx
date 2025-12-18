import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin can access EVERYTHING
  if (user.role.toLowerCase() === "admin") {
    return children;
  }

  // Role-based access for others
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
