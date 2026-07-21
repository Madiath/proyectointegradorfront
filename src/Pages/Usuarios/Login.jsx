import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import { loginUsuario, primerPasoMfa } from '../../Services/usuarioService'
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
    color: '#222',
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
  const [errorEmail, setErrorEmail] = useState("")
  const [errorPassword, setErrorPassword] = useState("")
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
      //Comentar el token una vez integrado el MFA
      //localStorage.setItem("token", data.token)

      await  primerPasoMfa({ email: data.email })

      //MFA DESHABILITADO PARA TESTEO
      navigate("/authsecure")      

      //navigate("/pacientes")

    } catch (error) {

      if (
        error.message === "Failed to fetch" ||
        error.code === "ERR_NETWORK"
      ) {
        toast.error("No se pudo conectar con el servidor");
        return;
      }

      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false)
    }
  }

  const validarEmail = () => {
    if (!form.email.trim()) {
      setErrorEmail("El email es obligatorio")
      return
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!regex.test(form.email)) {
      setErrorEmail("El formato del email no es válido")
      return
    }

    setErrorEmail("")
  }

  const validarPassword = () => {
    if (!form.password.trim()) {
      setErrorPassword("La contraseña es obligatoria")
      return
    }

    if (form.password.length < 2 || form.password.length > 200) {
      setErrorPassword("La contraseña debe tener almenos 2 caracteres y máximo 200")
      return
    }

    setErrorPassword("")
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
            <div style={{ width: '100%' }}>
              <div style={s.inputWrapper}>
                <span style={s.inputIcon}>
                  <User size={16} />
                </span>

                <input
                  style={s.input}
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={validarEmail}
                  maxLength={320}
                />
              </div>

              {errorEmail && (
                <div
                  style={{
                    color: '#fff',
                    fontSize: '0.8rem',
                    marginTop: '4px',
                    paddingLeft: '4px'
                  }}
                >
                  {errorEmail}
                </div>
              )}
            </div>
          </div>

          <div style={s.inputWrapper}>
            <span style={s.inputIcon}><Lock size={16} /></span>
            <div style={{ width: '100%' }}>
              <div style={s.inputWrapper}>
                <span style={s.inputIcon}>
                  <Lock size={16} />
                </span>

                <input
                  style={s.input}
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={validarPassword}
                  maxLength={200}
                />
              </div>

              {errorPassword && (
                <div
                  style={{
                    color: '#fff',
                    fontSize: '0.8rem',
                    marginTop: '4px',
                    paddingLeft: '4px'
                  }}
                >
                  {errorPassword}
                </div>
              )}
            </div>
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
