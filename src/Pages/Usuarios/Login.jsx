import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import { loginUsuario } from '../../Services/usuarioService'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import LoadingScreen from '../../Shared/Components/LoadingScreen'

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
  },
  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  forgotLink: {
    color: '#7ecfdc',
    cursor: 'pointer',
    textDecoration: 'none'
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
}

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await loginUsuario(form)

      localStorage.setItem("usuario", data.email)
      localStorage.setItem("rol", data.rol)

      

      navigate("/pacientes")

    } catch (error) {

      const code = error.message

      if (code === "campos_vacios") {
        toast.error("Por favor, completa todos los campos.")
      }
      else if (code === "informacion_incorrecta") {
        toast.error("Email o contraseña incorrectos.")
      }
      else {
        toast.error("Ocurrió un error. Intentá nuevamente.")
      }

    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.avatar}>
          <User size={48} />
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><User size={16} /></span>
            <input
              style={s.input}
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><Lock size={16} /></span>
            <input
              style={s.input}
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div style={s.row}>
            <a href="/rec-pass" style={s.forgotLink}>
              ¿Olvidaste la contraseña?
            </a>
          </div>

          <button type="submit" style={s.button} disabled={loading}>
            Iniciar sesión
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login