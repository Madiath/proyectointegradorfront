import { NavLink } from 'react-router'
import { Users, UserCog, Package, CalendarDays, LayoutDashboard } from 'lucide-react'
import './BottomNav.css'

const BottomNav = () => {
  const rol = localStorage.getItem('rol')

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/pacientes"
        className={({ isActive }) => 'bottom-nav-link' + (isActive ? ' bottom-nav-link--active' : '')}
      >
        <Users size={22} />
        <span>Pacientes</span>
      </NavLink>

      {rol === 'Admin' && (
        <NavLink
          to="/usuarios"
          className={({ isActive }) => 'bottom-nav-link' + (isActive ? ' bottom-nav-link--active' : '')}
        >
          <UserCog size={22} />
          <span>Usuarios</span>
        </NavLink>
      )}

      {rol === 'Admin' && (
        <NavLink
          to="/insumos"
          className={({ isActive }) => 'bottom-nav-link' + (isActive ? ' bottom-nav-link--active' : '')}
        >
          <Package size={22} />
          <span>Insumos</span>
        </NavLink>
      )}

      {rol === 'Admin' && (
        <NavLink
          to="/agenda"
          className={({ isActive }) => 'bottom-nav-link' + (isActive ? ' bottom-nav-link--active' : '')}
        >
          <CalendarDays size={22} />
          <span>Agenda</span>
        </NavLink>
      )}

      {rol === 'Admin' && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) => 'bottom-nav-link' + (isActive ? ' bottom-nav-link--active' : '')}
        >
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>
      )}
    </nav>
  )
}

export default BottomNav
