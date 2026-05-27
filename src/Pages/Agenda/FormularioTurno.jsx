import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { crearTurno, fetchTurnos } from '../../../features/agendaSlice'
import { fetchPacientes } from '../../../features/pacientesSlice'

// Formatea la fecha como ISO local (sin conversión UTC) para evitar desfase de zona horaria
const toLocalISO = (date) => {
    const pad = n => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00:00`
}

const FormularioTurno = ({ medico, fechaHora, weekStartStr, onClose }) => {
    const dispatch = useDispatch()
    const pacientes = useSelector(state => state.pacientes.lista)
    const [pacienteId, setPacienteId] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Cargar todos los pacientes si no están cargados
        dispatch(fetchPacientes({ pagina: 1, tamano: 1000, orden: 'nombre' }))
    }, [])

    const formatFechaHora = (date) => {
        return date.toLocaleString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setEnviando(true)
        setError(null)
        try {
            await dispatch(crearTurno({
                medicoId: medico.id,
                pacienteId: pacienteId ? parseInt(pacienteId) : null,
                fechaHora: toLocalISO(fechaHora),
            })).unwrap()
            dispatch(fetchTurnos(weekStartStr))
            onClose()
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Error al crear el turno')
            setEnviando(false)
        }
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nuevo Turno</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger py-2">{error}</div>
                            )}
                            <div className="mb-3">
                                <span className="fw-bold">Médico: </span>
                                <span>{medico.nombre}{medico.especialidad ? ` — ${medico.especialidad}` : ''}</span>
                            </div>
                            <div className="mb-3">
                                <span className="fw-bold">Fecha y hora: </span>
                                <span className="text-capitalize">{formatFechaHora(fechaHora)}</span>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Paciente</label>
                                <select
                                    className="form-select"
                                    value={pacienteId}
                                    onChange={e => setPacienteId(e.target.value)}
                                >
                                    <option value="">Sin paciente asignado</option>
                                    {pacientes.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombreCompleto}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={enviando}
                            >
                                {enviando ? 'Guardando…' : 'Crear turno'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioTurno
