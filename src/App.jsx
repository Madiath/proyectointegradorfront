import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './Components/ProtectedRoute'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        
        <Routes>

          {/* Rutas públicas */}
          {/* <Route path="/" element={<Login />} /> */}
          {/* <Route path="/registro" element={<Registro />} /> */}

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Aqui iria el resto de rutas una ves pasado el login Ejemplo: */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Route>

        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App