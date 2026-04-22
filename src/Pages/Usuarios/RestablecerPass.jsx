import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { restablecerPassword } from '../../Services/usuarioService'

const RestablecerPass = () => {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token")

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    password: '',
    repetirPassword: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()


    if (!form.password || !form.repetirPassword) {
      toast.error("Completá todos los campos")
      return
    }

    if (form.password !== form.repetirPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (!token) {
      toast.error("Token inválido o faltante")
      return
    }

    setLoading(true)

    try {
      await restablecerPassword({
        token,
        nuevaPassword: form.password
      })

      toast.success("Contraseña actualizada correctamente")

      // redirigir al login
      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (error) {

      const code = error.message
      if (code === "token_expirado") {
        toast.error("El enlace expiró")
      }
      else if (code === "token_invalido") {
        toast.error("El enlace no es válido")
      }
      else if (code === "token_ya_usado") {
        toast.error("Este enlace ya fue utilizado")
      }
      else {
        toast.error("Error al cambiar la contraseña")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-login">

      <div className="logo-container">
        <h1>Restablecer Contraseña</h1>
      </div>

      <article className="form-container">
        <form onSubmit={handleSubmit}>

          <div className="input-container">
            <label>Nueva contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Nueva contraseña"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-container">
            <label>Repetir contraseña</label>
            <input
              type="password"
              name="repetirPassword"
              placeholder="Repetir contraseña"
              value={form.repetirPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="btn-container">
            <button
              type="submit"
              className="login-btn primary-button"
              disabled={loading}
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </div>

        </form>
      </article>

    </section>
  )
}

export default RestablecerPass