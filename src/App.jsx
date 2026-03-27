import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './Shared/Components/ProtectedRoute'
import Header from './Shared/Components/Header'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'
import Registro from "./Pages/Usuarios/Registro";


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Header />

        <main className="container-fluid p-4">
          <Routes>
            <Route path="/registro" element={<Registro />} />

            {/* Rutas públicas */}
            {/* <Route path="/" element={<Login />} /> */}
            {/* <Route path="/registro" element={<Registro />} /> */}

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
            
              {/* Aqui irian tus componentes: */}
              {/* <Route path="/pacientes" element={<Pacientes />} /> */}
              {/* <Route path="/usuarios" element={<Usuarios />} /> */}
            </Route>

          </Routes>
        </main>

      </BrowserRouter>
    </Provider>
  )
}

export default App
