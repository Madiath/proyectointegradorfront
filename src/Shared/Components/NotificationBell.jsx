import { useEffect, useRef, useState } from 'react'
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  actualizarNoLeidas,
  fetchNotificaciones,
  fetchNotificacionesNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
  recibirNotificacion,
} from '../../../features/notificacionesSlice'
import { crearConexionNotificaciones } from '../../Services/notificacionService'

const formatearFecha = (fecha) =>
  new Intl.DateTimeFormat('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha))

const NotificationBell = () => {
  const dispatch = useDispatch()
  const { lista, noLeidas, cargando, error } = useSelector((state) => state.notificaciones)
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)

  useEffect(() => {
    let pollingId = null
    let desmontado = false

    const refrescarNotificaciones = () => {
      dispatch(fetchNotificaciones())
      dispatch(fetchNotificacionesNoLeidas())
    }

    const iniciarPolling = () => {
      if (pollingId) return
      pollingId = window.setInterval(refrescarNotificaciones, 30000)
    }

    const detenerPolling = () => {
      if (!pollingId) return
      window.clearInterval(pollingId)
      pollingId = null
    }

    refrescarNotificaciones()
    const conexion = crearConexionNotificaciones()

    conexion.on('NotificacionRecibida', ({ notificacion, noLeidas }) => {
      dispatch(recibirNotificacion({ notificacion, noLeidas }))
      dispatch(fetchNotificaciones())
    })

    conexion.on('NotificacionesNoLeidasActualizadas', ({ noLeidas }) => {
      dispatch(actualizarNoLeidas(noLeidas))
      dispatch(fetchNotificaciones())
    })

    conexion.onreconnected(() => {
      detenerPolling()
      refrescarNotificaciones()
    })

    conexion.onreconnecting(() => {
      iniciarPolling()
    })

    conexion.onclose(() => {
      if (!desmontado) {
        iniciarPolling()
      }
    })

    let conectado = false
    conexion.start()
      .then(() => { conectado = true })
      .catch(() => {
        if (!desmontado) {
          refrescarNotificaciones()
          iniciarPolling()
        }
      })

    return () => {
      desmontado = true
      detenerPolling()
      if (conectado) {
        conexion.stop()
      }
    }
  }, [dispatch])

  useEffect(() => {
    const cerrarAlClickAfuera = (event) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
        setAbierto(false)
      }
    }

    document.addEventListener('mousedown', cerrarAlClickAfuera)
    return () => document.removeEventListener('mousedown', cerrarAlClickAfuera)
  }, [])

  const handleToggle = () => {
    const proximoEstado = !abierto
    setAbierto(proximoEstado)
    if (proximoEstado) {
      dispatch(fetchNotificaciones())
      dispatch(fetchNotificacionesNoLeidas())
    }
  }

  const handleMarcarLeida = (id) => {
    dispatch(marcarLeida(id))
  }

  const handleMarcarTodas = () => {
    dispatch(marcarTodasLeidas())
  }

  return (
    <div className="notification" ref={contenedorRef}>
      <button
        className="notification-trigger"
        type="button"
        onClick={handleToggle}
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <Bell size={20} aria-hidden="true" />
        {noLeidas > 0 && (
          <span className="notification-badge">
            {noLeidas > 99 ? '99+' : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <span>Notificaciones</span>
            <button
              className="notification-mark-all"
              type="button"
              onClick={handleMarcarTodas}
              disabled={noLeidas === 0}
              title="Marcar todas como leidas"
            >
              <CheckCheck size={16} aria-hidden="true" />
            </button>
          </div>

          {cargando && (
            <div className="notification-state">
              <Loader2 size={18} className="notification-spinner" aria-hidden="true" />
              Cargando
            </div>
          )}

          {!cargando && error && (
            <div className="notification-state notification-state--error">
              {error}
            </div>
          )}

          {!cargando && !error && lista.length === 0 && (
            <div className="notification-state">
              No hay notificaciones
            </div>
          )}

          {!cargando && !error && lista.length > 0 && (
            <div className="notification-list">
              {lista.map((notificacion) => (
                <div
                  className={`notification-item${notificacion.leida ? '' : ' notification-item--unread'}`}
                  key={notificacion.id}
                >
                  <div className="notification-item-content">
                    <div className="notification-item-title">{notificacion.titulo}</div>
                    <div className="notification-item-message">{notificacion.mensaje}</div>
                    <div className="notification-item-date">
                      {formatearFecha(notificacion.fechaCreacion)}
                    </div>
                  </div>
                  {!notificacion.leida && (
                    <button
                      className="notification-read-btn"
                      type="button"
                      onClick={() => handleMarcarLeida(notificacion.id)}
                      title="Marcar como leida"
                    >
                      <Check size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
