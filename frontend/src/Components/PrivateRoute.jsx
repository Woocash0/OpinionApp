import { Navigate } from "react-router-dom";

// Strażnik autoryzacji
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token"); // Sprawdź, czy token jest obecny

  if (!token) {
    // Jeśli nie ma tokenu, przekieruj do strony logowania
    return <Navigate to="/loginform" />;
  }

  // Jeśli token jest obecny, pozwól na dostęp do trasy
  return children;
};

export default PrivateRoute;
