import { useState } from 'react'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { recuperarContraseña } from '../../Services/usuarioService'
import LoadingScreen from '../../Shared/Components/LoadingScreen'

// 👇 reutilizamos el mismo estilo del login
const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(42,122,138,0.85) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(180,230,240,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 80%, rgba(42,122,138,0.5) 0%, transparent 55%),
      linear-gradient(135deg, #0a0a0a 0%, #0e1e22 50%, #0a0a0a 100%)
    `,
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(42,122,138,0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(232,245,233,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#888',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    borderRadius: '4px',
    border: 'none',
    background: '#f0f0f0',
    color: '#222'
  },
  text: {
    color: '#ccc',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    background: '#2a7a8a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  link: {
    color: '#7ecfdc',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.85rem'
  }
}

const RecuperarPass = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const [form, setForm] = useState({
    email: ''
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!form.email) {
    toast.error("Ingresá un email")
    return
  }

  setLoading(true)

  try {
    await recuperarContraseña(form.email)

    setEnviado(true)
  }
  catch (error) {

    const mensaje = error.message

    if (mensaje === "minMax_mail") {
      toast.error("El email debe tener entre 2 y 30 caracteres")
      return
    }
    if(mensaje === "null_usuario"){
      setEnviado(true) // Para no revelar si el email existe o no, mostramos el mensaje de éxito igual
      return
    }

    toast.error("Ocurrió un error al procesar la solicitud")
  }
  finally {
    setLoading(false)
  }
}

  if (loading) return <LoadingScreen />

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Avatar */}
        <div style={s.avatar}>
          <User size={48} />
        </div>

        {enviado ? (
          <>
            <p style={s.text}>
              Si el correo existe, recibirás instrucciones para recuperar tu contraseña.
            </p>

            <a style={s.link} onClick={() => navigate("/login")}>
              Volver al login
            </a>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >

            {/* Email */}
            <div style={s.inputWrapper}>
              <span style={s.inputIcon}><User size={16} /></span>
              <input
                style={s.input}
                type="email"
                name="email"
                placeholder="Ingresá tu email"
                value={form.email}
                onChange={handleChange}
                maxLength={30}
              />
            </div>

            <button type="submit" style={s.button}>
              Enviar
            </button>

            <a style={s.link} onClick={() => navigate("/login")}>
              Volver al login
            </a>

          </form>
        )}

      </div>
    </div>
  )
}

export default RecuperarPass