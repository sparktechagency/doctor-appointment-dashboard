/* eslint-disable react/prop-types */
// AdminRoutes.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoutes = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === "admin";
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // If admin, render the requested admin route component
  return <>{children}</>;
};

export default AdminRoutes;
