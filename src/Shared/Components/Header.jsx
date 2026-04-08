import { NavLink, useNavigate } from 'react-router'

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
    <nav className="navbar navbar-expand-lg px-4" style={{ backgroundColor: '#5EBA5A' }}>
      <span className="navbar-brand text-white fw-bold">Mi App</span>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav gap-2 me-auto">
          <li className="nav-item">
            <NavLink
              to="/pacientes"
              className={({ isActive }) =>
                'nav-link text-white' + (isActive ? ' fw-bold text-decoration-underline' : '')
              }
            >
              Pacientes
            </NavLink>
          </li>
          {rol === 'Admin' && (
            <li className="nav-item">
              <NavLink
                to="/usuarios"
                className={({ isActive }) =>
                  'nav-link text-white' + (isActive ? ' fw-bold text-decoration-underline' : '')
                }
              >
                Usuarios
              </NavLink>
            </li>
          )}
        </ul>

        <div className="d-flex align-items-center gap-3">
          <span className="text-white opacity-75" style={{ fontSize: '0.85rem' }}>
            {usuario} — {rol}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Header
