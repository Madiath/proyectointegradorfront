import { NavLink } from 'react-router'

const Header = () => {
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
        <ul className="navbar-nav gap-2">
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
        </ul>
      </div>
    </nav>
  )
}

export default Header
