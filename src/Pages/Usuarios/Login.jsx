import React, { useState } from 'react'
import { loginUsuario, primerPasoMfa } from "../../Services/usuarioService";
import '../../Shared/CSS/style.css' // tu css
import { data, useNavigate } from 'react-router';
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
    console.log(form)

    try {
      const dataLogin = await loginUsuario(form)

      console.log("Login correcto:", dataLogin)

      //Guardar nombre
      localStorage.setItem("usuario", dataLogin.email)

      const dataMfa = await primerPasoMfa({ email: dataLogin.email });

      console.log("MFA paso 1 correcto:", dataMfa)

      //Redirigir
      navigate("/authsecure")

    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || error.message;
      toast.error(errorMsg);
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
        </form>
      </article>

    </section>
  )
}

export default Login