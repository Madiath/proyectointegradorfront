import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {

    const autenticado = localStorage.getItem("token") !== null;
    
    if(!autenticado) return <Navigate to="/login" replace />

    return <Outlet />
}

export default ProtectedRoute