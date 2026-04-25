import { Navigate, Outlet } from "react-router";

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const now = Date.now() / 1000; // en segundos

    return payload.exp > now;
  } catch {
    return false;
  }
};

const ProtectedRoute = () => {

  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;