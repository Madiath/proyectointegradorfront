import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { recuperarContraseña } from '../../Services/usuarioService'

const RecuperarPass = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const [form, setForm] = useState({
    email: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email) {
      toast.error("Ingresá un email")
      return
    }

    setLoading(true)

    try {
      await recuperarContraseña(form.email)
    } catch (error) {
      console.error(error)
    } finally {
      setEnviado(true)
      setLoading(false)
    }
  }

  return (
    <section>
      <div className='tituloMfa'>Recuperar Contraseña</div>

      {enviado ? (
        <p>
          Si el correo existe, recibirás instrucciones para recuperar tu contraseña.
        </p>
      ) : (
        <article className='form-container'>
          <form onSubmit={handleSubmit}>
            <div className='input-container'>
              <label>Ingresa tu email</label>
              <input
                type="email"
                name="email"
                placeholder='tu@email.com'
                value={form.email}
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
                {loading ? "Enviando..." : "Enviar email de recuperación"}
              </button>
            </div>
          </form>
        </article>
      )}
    </section>
  )
}

export default RecuperarPass