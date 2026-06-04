import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './Shared/Components/ProtectedRoute'
import RutaProtegidaPorRol from './Shared/Components/RutaProtegidaPorRol'
import Layout from './Shared/Components/Layout'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'

// Páginas
import Dashboard from './Pages/Dashboard/Dashboard'
import Agenda from './Pages/Agenda/Agenda'
import Insumos from './Pages/Insumos/Insumos'
import Pacientes from './Pages/Pacientes/Pacientes'
import DetallePaciente from './Pages/Pacientes/DetallePaciente'
import ExamenesPaciente from './Pages/Pacientes/ExamenesPaciente'
import Usuarios from './Pages/Usuarios/Usuarios'
import DetalleUsuario from './Pages/Usuarios/DetalleUsuario'
import DetalleMedico from './Pages/Usuarios/Medicos/DetalleMedico'
import Login from './Pages/Usuarios/Login'

// 🔐 MFA
import Mfa from './Pages/Usuarios/Mfa'

// 🔑 Password reset
import RecuperarPass from './Pages/Usuarios/RecuperarPass'
import RestablecerPass from './Pages/Usuarios/RestablecerPass'

// 📊 Historial clínico
import FormularioHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/FormularioHistorialClinico"
import FormularioEditarHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/FormularioEditarHistorialClinico"
import DetalleHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/DetalleHistorialClinico"

// 📈 Evoluciones
import ListarEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/ListarEvolucion"
import FormularioEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/FormularioEvolucion"
import FormularioEditarEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/FormularioEditarEvolucion"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />

        <Routes>

          {/* Ruta inicial */}
          <Route path="/" element={<Login />} />

          {/* Públicas */}
          <Route path="/login" element={<Login />} />

          {/* 🔐 MFA */}
          <Route path="/authsecure" element={<Mfa />} />

          {/* 🔑 Recuperar password */}
          <Route path="/rec-pass" element={<RecuperarPass />} />
          <Route path="/restbl-pass" element={<RestablecerPass />} />


          {/* 🔒 Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>


              {/* 📊 Historial clínico (públicas o mover luego si querés) */}
              <Route path="/pacientes/:id/historial" element={<DetalleHistorialClinico />} />
              <Route path="/pacientes/:id/historial/nuevo" element={<FormularioHistorialClinico />} />
              <Route path="/pacientes/:id/historial/editar" element={<FormularioEditarHistorialClinico />} />

              {/* 📈 Evoluciones */}
              <Route path="/pacientes/:id/evoluciones" element={<ListarEvolucion />} />
              <Route path="/pacientes/:id/evoluciones/nueva" element={<FormularioEvolucion />} />
              <Route path="/pacientes/:idPaciente/evoluciones/:idEvolucion/editar" element={<FormularioEditarEvolucion />} />



              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/pacientes/:id" element={<DetallePaciente />} />
              <Route path="/pacientes/:id/examenes" element={<ExamenesPaciente />} />

              <Route element={<RutaProtegidaPorRol rolesPermitidos={['Admin']} />}>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/usuarios/:id" element={<DetalleUsuario />} />
                <Route path="/medicos/:id" element={<DetalleMedico />} />
                <Route path="/insumos" element={<Insumos />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

            </Route>
          </Route>

        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App
