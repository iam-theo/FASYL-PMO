import React from "react";
import { Navigate } from "react-router-dom";

function RequireRole({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

export default RequireRole;