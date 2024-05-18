import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token"); 

  if (!token) {
    return <Navigate to="/loginform" />;
  }

  return children;
};

export default PrivateRoute;
