import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {

    const autenticado = localStorage.getItem("usuario") !== null;

    console.log(autenticado);
    

    if(!autenticado) return <Navigate to="/" replace />

    return <Outlet />
}

export default ProtectedRoute