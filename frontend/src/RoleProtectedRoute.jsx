import React from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Navigate, Outlet } from 'react-router-dom';

const RoleProtectedRoute = ({ roles }) => {
    const auth = useAuthUser();
    const user = auth();
    const userRoles = user ? user.roles : [];

    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    console.log(hasRequiredRole);

    if (!user) {
        // Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
        return <Navigate to="/loginform" />;
    } else if (!hasRequiredRole) {
        // Jeśli użytkownik nie ma odpowiedniej roli, przekieruj na stronę "unauthorized"
        return <Navigate to="/unauthorized" />;
    } else {
        // Jeśli użytkownik jest zalogowany i ma odpowiednią rolę, renderuj zawartość chronioną
        return <Outlet />;
    }
};

export default RoleProtectedRoute;
