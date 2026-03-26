import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './Shared/Components/ProtectedRoute'
import Header from './Shared/Components/Header'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'
import Pacientes from './Pages/Pacientes/Pacientes'
import DetallePaciente from './Pages/Pacientes/DetallePaciente'


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Header />

        <main className="container-fluid p-4">
          <Routes>

            {/* Rutas públicas */}
            {/* <Route path="/" element={<Login />} /> */}
            {/* <Route path="/registro" element={<Registro />} /> */}
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/:id" element={<DetallePaciente />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/usuarios" element={<Usuarios />} /> */}
            </Route>

          </Routes>
        </main>

      </BrowserRouter>
    </Provider>
  )
}

export default App
