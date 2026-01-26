import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (roleRequired && role !== roleRequired) {
    // Logged in but wrong role
    return <Navigate to="/" />;
  }

  return children; // allowed
};

export default ProtectedRoute;
