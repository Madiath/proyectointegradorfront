import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './Shared/Components/ProtectedRoute'
import RutaProtegidaPorRol from './Shared/Components/RutaProtegidaPorRol'
import Layout from './Shared/Components/Layout'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'
import Pacientes from './Pages/Pacientes/Pacientes'
import DetallePaciente from './Pages/Pacientes/DetallePaciente'
import Usuarios from './Pages/Usuarios/Usuarios'
import DetalleUsuario from './Pages/Usuarios/DetalleUsuario'
import Login from './Pages/Usuarios/Login'
import FormularioHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/FormularioHistorialClinico";
import FormularioEditarHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/FormularioEditarHistorialClinico";
import DetalleHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/DetalleHistorialClinico";
import ListarEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/ListarEvolucion";
import FormularioEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/FormularioEvolucion";
import FormularioEditarEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/FormularioEditarEvolucion";
import RecuperarPass from './Pages/Usuarios/RecuperarPass'
import RestablecerPass from './Pages/Usuarios/RestablecerPass'


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />

        <Routes>

          {/* Ruta inicial */}
          <Route path="/" element={<Login/>} />
          
          {/* Ruta públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/rec-pass" element={<RecuperarPass />} />
          <Route path="/restbl-pass" element={<RestablecerPass />} />

            <Route path="/pacientes/:id/historial" element={<DetalleHistorialClinico />} />
            <Route path="/pacientes/:id/historial/nuevo" element={<FormularioHistorialClinico />} />
            <Route path="/pacientes/:id/historial/editar" element={<FormularioEditarHistorialClinico />} />

            <Route path="/pacientes/:id/evoluciones" element={<ListarEvolucion />} />
            <Route path="/pacientes/:id/evoluciones/nueva" element={<FormularioEvolucion />} />
            <Route path="/pacientes/:idPaciente/evoluciones/:idEvolucion/editar"element={<FormularioEditarEvolucion />} />
            <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/pacientes/:id" element={<DetallePaciente />} />
            
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Layout SOLO para usuarios logueados */}
            <Route element={<Layout />}>
              
              <Route element={<RutaProtegidaPorRol rolesPermitidos={['Admin']} />}>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/usuarios/:id" element={<DetalleUsuario />} />
              </Route>
            </Route>

            
            

            

          </Route>
        

        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App