import { useState } from 'react'
import { Shield } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { segundoPasoMfa } from '../../Services/usuarioService'
import LoadingScreen from '../../Shared/Components/LoadingScreen'
import { color } from 'chart.js/helpers'

// mismos estilos base
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
    textAlign: 'center',
    fontSize: '1.1rem',
    letterSpacing: '4px',
    color: '#222',
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

const Mfa = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    codigo: '',
    email: localStorage.getItem("usuario") || ''
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.codigo) {
      toast.error("Ingresá el código")
      return
    }

    setLoading(true)

    try {
      const dataMfa = await segundoPasoMfa(form)

      localStorage.setItem("token", dataMfa.token)

      navigate("/pacientes")

    } catch (error) {

      const code = error.message

      if (code === "codigo_incorrecto") {
        toast.error("Código incorrecto. Intentá nuevamente.")
      } 
      else if (code === "codigo_expirado") {
        toast.error("El código expiró.")
        navigate("/login")
      } 
      else if (code === "max_intentos") {
        toast.error("Máximo de intentos alcanzado.")
        navigate("/login")
      } 
      else {
        toast.error("Ocurrió un error inesperado.")
        navigate("/login")
      }

      setForm({ ...form, codigo: '' })

    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Avatar */}
        <div style={s.avatar}>
          <Shield size={48} />
        </div>

        {/* Texto */}
        <p style={s.text}>
          🔒 Ingresá el código de verificación que enviamos a tu correo.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >

          {/* Código */}
          <div style={s.inputWrapper}>
            <span style={s.inputIcon}>#</span>
            <input
              style={s.input}
              type="text"
              name="codigo"
              placeholder="123456"
              value={form.codigo}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={s.button}>
            Verificar
          </button>

          <a style={s.link} onClick={() => navigate("/login")}>
            Volver al login
          </a>

        </form>
      </div>
    </div>
  )
}

export default Mfa