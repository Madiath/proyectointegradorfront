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