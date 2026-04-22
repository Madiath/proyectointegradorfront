import { Navigate, Outlet } from 'react-router'

const RutaProtegidaPorRol = ({ rolesPermitidos }) => {
    const rol = localStorage.getItem('rol')

    if (!rolesPermitidos.includes(rol)) {
        return <Navigate to="/pacientes" replace />
    }

    return <Outlet />
}

export default RutaProtegidaPorRol
