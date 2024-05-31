import React from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenFromCookies, verifyToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const token = getTokenFromCookies();
  const user = verifyToken(token);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
