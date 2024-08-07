import React from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Navigate, Outlet } from 'react-router-dom';

const RoleProtectedRoute = ({ roles }) => {
    const auth = useAuthUser();
    const user = auth();
    const userRoles = user ? user.roles : [];

    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!user) {
        return <Navigate to="/loginform" />;
    } else if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" />;
    } else {
        return <Outlet />;
    }
};

export default RoleProtectedRoute;
