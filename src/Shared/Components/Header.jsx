import { NavLink, useNavigate } from 'react-router'
import './Header.css'

const Header = () => {
  const rol = localStorage.getItem('rol')
  const usuario = localStorage.getItem('usuario')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('rol')
    navigate('/login')
  }

  return (
    <nav className="header-nav">
      <span className="header-brand">Mi App</span>

      <div className="header-links">
        <NavLink
          to="/pacientes"
          className={({ isActive }) => 'header-link' + (isActive ? ' header-link--active' : '')}
        >
          Pacientes
        </NavLink>
        {rol === 'Admin' && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) => 'header-link' + (isActive ? ' header-link--active' : '')}
          >
            Usuarios
          </NavLink>
        )}
      </div>

      <div className="header-user">
        <span className="header-user-info">{usuario} — {rol}</span>
        <button className="header-logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Header
