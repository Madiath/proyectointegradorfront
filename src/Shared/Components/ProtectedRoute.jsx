import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
//
    const autenticado = localStorage.getItem("token") !== null;

    console.log(autenticado);
    

    if(!autenticado) return <Navigate to="/login" replace />

    return <Outlet />
}

export default ProtectedRoute