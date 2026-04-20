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
      radial-gradient(ellipse at 20% 50%, rgba(26,58,42,0.85) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(232,245,233,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 80%, rgba(26,58,42,0.5) 0%, transparent 55%),
      linear-gradient(135deg, #0a0a0a 0%, #111a14 50%, #0a0a0a 100%)
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
    background: 'rgba(26,58,42,0.6)',
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
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    borderRadius: '4px',
    border: 'none',
    background: '#f0f0f0',
    fontSize: '0.95rem',
    color: '#222',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#ccc',
    cursor: 'pointer',
  },
  forgotLink: {
    color: '#a8c8a8',
    fontStyle: 'italic',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    background: '#1a3a2a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    marginTop: '0.4rem',
    transition: 'background 0.2s',
  },
}

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginUsuario(form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', data.email)
      localStorage.setItem('rol', data.rol)
      navigate('/pacientes')
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Avatar */}
        <div style={s.avatar}>
          <User size={48} color="rgba(232,245,233,0.7)" strokeWidth={1.5} />
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Email */}
          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><User size={16} /></span>
            <input
              style={s.input}
              type="text"
              name="email"
              placeholder="Username"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><Lock size={16} /></span>
            <input
              style={s.input}
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {/* Remember me + Forgot password */}
          <div style={s.row}>
            <span style={s.forgotLink}>¿Olvidaste la contraseña?</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={s.button}
            disabled={loading}
            onMouseEnter={e => e.target.style.background = '#2a5a3a'}
            onMouseLeave={e => e.target.style.background = '#1a3a2a'}
          >
            Login
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login
