import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useContext(AuthContext);

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
