import React from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenFromCookies, verifyToken } from '../utils/auth';

const UnprotectedRoute = ({ children }) => {
    const token = getTokenFromCookies();
    if (!token) return children;
    const user = verifyToken(token);

    if (!user) {
        return children;
    }
    return <Navigate to="/auth/login" replace />;
};

export default UnprotectedRoute;
