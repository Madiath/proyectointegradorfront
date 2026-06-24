import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { crearTurno, editarTurno } from '../../../features/agendaSlice'
import { fetchPacientes } from '../../../features/pacientesSlice'
import { toast } from 'react-toastify'

// Formatea la fecha como ISO local (sin conversión UTC) para evitar desfase de zona horaria
const toLocalISO = (date) => {
    const pad = n => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00:00`
}

/**
 * turnoExistente: objeto { id, pacienteId, pacienteNombre, ... } si hay un turno en ese slot.
 *                null si es un slot vacío (crear nuevo turno).
 */



const FormularioTurno = ({ medico, fechaHora, weekStartStr, turnoExistente, onClose }) => {
    //Nos traemos el rol para saber si es medico o admin, ya que el medico no puede crear los turnos o editarlos. 
    const rol = localStorage.getItem('rol')
    const esMedico = rol === 'Medico'

    const dispatch = useDispatch()
    const pacientes = useSelector(state => state.pacientes.lista)

    const modoEdicion = turnoExistente !== null

    const [pacienteId, setPacienteId] = useState(
        turnoExistente?.pacienteId ? String(turnoExistente.pacienteId) : ''
    )
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!esMedico) {
            dispatch(fetchPacientes({
                pagina: 1,
                tamano: 1000,
                orden: 'nombre'
            }))
        }
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
            if (modoEdicion) {
                // Editar: pacienteId null → backend elimina el turno
                await dispatch(editarTurno({
                    id: turnoExistente.id,
                    pacienteId: pacienteId ? parseInt(pacienteId) : null,
                })).unwrap()
                toast.success('Turno actualizado correctamente')
            } else {
                // Crear nuevo turno
                await dispatch(crearTurno({
                    medicoId: medico.id,
                    pacienteId: pacienteId ? parseInt(pacienteId) : null,
                    fechaHora: toLocalISO(fechaHora),
                })).unwrap()
                toast.success('Turno creado correctamente')
            }
            onClose()
        } catch (err) {
            console.error(err)
            setError(
                typeof err === 'string'
                    ? err
                    : err?.message || 'Error al guardar el turno'
            )
            setError(typeof err === 'string' ? err : 'Error al guardar el turno')
            setEnviando(false)
        }
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {modoEdicion ? 'Editar Turno' : 'Nuevo Turno'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger py-2">{error}</div>
                            )}

                            <div className="mb-3">
                                <span className="fw-bold">Médico: </span>
                                <span>
                                    {medico.nombre}
                                    {medico.especialidad ? ` — ${medico.especialidad}` : ''}
                                </span>
                            </div>

                            <div className="mb-3">
                                <span className="fw-bold">Fecha y hora: </span>
                                <span className="text-capitalize">{formatFechaHora(fechaHora)}</span>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Paciente</label>

                                {esMedico ? (
                                    turnoExistente?.pacienteNombre ? (
                                        <div className="form-control bg-light">
                                            {turnoExistente.pacienteNombre}
                                        </div>
                                    ) : (
                                        <div className="alert alert-secondary mb-0">
                                            No tiene ningún paciente agendado.
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <select
                                            className="form-select"
                                            value={pacienteId}
                                            onChange={e => setPacienteId(e.target.value)}
                                        >
                                            <option value="">
                                                {modoEdicion
                                                    ? 'Sin paciente asignado (elimina el turno)'
                                                    : 'Sin paciente asignado'}
                                            </option>

                                            {pacientes.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombreCompleto}
                                                </option>
                                            ))}
                                        </select>

                                        {modoEdicion && pacienteId === '' && (
                                            <div className="form-text text-danger">
                                                Al guardar sin paciente, el turno será eliminado.
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={enviando}
                            >
                                {esMedico ? 'Cerrar' : 'Cancelar'}
                            </button>

                            {!esMedico && (
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={enviando}
                                >
                                    {enviando
                                        ? 'Guardando...'
                                        : modoEdicion
                                            ? 'Guardar cambios'
                                            : 'Crear turno'}
                                </button>
                            )}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioTurno
