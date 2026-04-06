import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { segundoPasoMfa } from '../../Services/usuarioService'

const Mfa = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    codigo: '',
    email: localStorage.getItem("usuario") || ''
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

    console.log(form) // debug

    try {
      const dataMfa = await segundoPasoMfa(form)

      localStorage.setItem("token", dataMfa.token)
      navigate("/pacientes")

    } catch (error) {
      console.error(error)

      const code = error.response?.data?.mensaje

      if (code === "1") {
        toast.error("Código incorrecto. Intenta nuevamente.")
      } 
      else if (code === "2") {
        toast.error("Código expirado.")
        navigate("/login")
      } 
      else if (code === "3") {
        toast.error("Número máximo de intentos alcanzado.")
        navigate("/login")
      } 
      else {
        toast.error("Error inesperado.")
        toast.error(error.response?.data?.mensaje || error.message)
        navigate("/login")
      }


      setForm({
        codigo: '',
        email: form.email
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className='tituloMfa'>Te hemos enviado un correo de verificación</div>

      <article className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='input-container'>
            <label>Ingresa el código de verificación</label>
            <input
              type="text"
              name="codigo" // 👈 coincide con state
              placeholder='123456'
              value={form.codigo}
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
              {loading ? "Cargando..." : "Verificar"}
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}

export default Mfa