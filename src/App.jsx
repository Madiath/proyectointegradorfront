import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './Shared/Components/ProtectedRoute'
import Layout from './Shared/Components/Layout'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'
import Pacientes from './Pages/Pacientes/Pacientes'
import DetallePaciente from './Pages/Pacientes/DetallePaciente'
import Login from './Pages/Usuarios/Login'
import FormularioHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/FormularioHistorialClinico";
import FormularioEditarHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/FormularioEditarHistorialClinico";
import DetalleHistorialClinico from "./Pages/Pacientes/HistorialesClinicos/DetalleHistorialClinico";
import ListarEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/ListarEvolucion";
import FormularioEvolucion from "./Pages/Pacientes/HistorialesClinicos/Evoluciones/FormularioEvolucion";



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
            <Route path="/pacientes/:id/historial" element={<DetalleHistorialClinico />} />
            <Route path="/pacientes/:id/historial/nuevo" element={<FormularioHistorialClinico />} />
            <Route path="/pacientes/:id/historial/editar" element={<FormularioEditarHistorialClinico />} />
            <Route path="/pacientes/:id/evoluciones" element={<ListarEvolucion />} />
            <Route path="/pacientes/:id/evoluciones/nueva" element={<FormularioEvolucion />} />
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Layout SOLO para usuarios logueados */}
            <Route element={<Layout />}>
            <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/pacientes/:id" element={<DetallePaciente />} />
              
            </Route>

            

          </Route>

        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App