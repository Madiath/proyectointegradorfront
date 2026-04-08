import React, { useState } from 'react'
import { loginUsuario } from "../../Services/usuarioService";
import '../../Shared/CSS/style.css' // tu css
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)


  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await loginUsuario(form)

      //Guardar token y nombre
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", data.email)
      localStorage.setItem("rol", data.rol)
      //Redirigir
      navigate("/pacientes")

    } catch (error) {
      console.error("Error:", error.message)
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-login">

      <div className="logo-container">
        <div className="logo"></div>
        <h1>Iniciar Sesión</h1>
      </div>

      <article className="form-container">
        <form onSubmit={handleSubmit}>

          <div className="input-container">
            <label>Nombre de usuario</label>
            <input
              type="text"
              name="email"
              placeholder="Escribe tu nombre de usuario"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-container">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Escribe tu contraseña"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="btn-container">
            <button
              type="submit"
              className="login-btn primary-button"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </div>

          <div className="link-registrarse">
            <a href="/registro">¿No tienes cuenta? Crea una</a>
          </div>

        </form>
      </article>

    </section>
  )
}

export default Login