import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { restablecerPassword } from '../../Services/usuarioService'
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

const RestablecerPass = () => {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token")

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    password: '',
    repetirPassword: ''
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

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

  if (loading) return <LoadingScreen />

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Avatar */}
        <div style={s.avatar}>
          <Lock size={48} />
        </div>

        <p style={s.text}>
          Ingresá tu nueva contraseña 🔐
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >

          {/* Nueva contraseña */}
          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><Lock size={16} /></span>
            <input
              style={s.input}
              type="password"
              name="password"
              placeholder="Nueva contraseña"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Repetir contraseña */}
          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><Lock size={16} /></span>
            <input
              style={s.input}
              type="password"
              name="repetirPassword"
              placeholder="Repetir contraseña"
              value={form.repetirPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={s.button}>
            Cambiar contraseña
          </button>

          <a style={s.link} onClick={() => navigate("/login")}>
            Volver al login
          </a>

        </form>

      </div>
    </div>
  )
}

export default RestablecerPass