import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHorariosAgenda, fetchTurnos } from '../../../features/agendaSlice'
import FormularioTurno from './FormularioTurno'
import './Agenda.css'






const DIAS = [
    { num: 1, label: 'Lunes' },
    { num: 2, label: 'Martes' },
    { num: 3, label: 'Miércoles' },
    { num: 4, label: 'Jueves' },
    { num: 5, label: 'Viernes' },
    { num: 6, label: 'Sábado' },
    { num: 7, label: 'Domingo' },
]

// Franja horaria visible: 07:00 – 21:00 (cada 1 hora)
const HORAS = Array.from({ length: 15 }, (_, i) => i + 7)

const COLORES = [
    '#0d6efd', '#198754', '#dc3545', '#fd7e14',
    '#6610f2', '#20c997', '#6f42c1', '#d63384',
]

const horaToMin = (str) => {
    const [h, m] = str.split(':').map(Number)
    return h * 60 + (m || 0)
}

// Obtiene el lunes de la semana que contiene la fecha dada
const getMonday = (date) => {
    const d = new Date(date)
    const day = d.getDay() // 0=Dom, 1=Lun...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Formatea fecha a yyyy-MM-dd para la API
const toDateStr = (date) => date.toISOString().split('T')[0]

// Construye el DateTime de la celda: weekStart + (diaNum-1) días + hora
const buildCellDate = (weekStart, diaNum, hora) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + (diaNum - 1))
    d.setHours(hora, 0, 0, 0)
    return d
}

// Formato corto de semana para el título
const formatSemana = (weekStart) => {
    const fin = new Date(weekStart)
    fin.setDate(fin.getDate() + 6)
    const opts = { day: 'numeric', month: 'short' }
    return `${weekStart.toLocaleDateString('es-AR', opts)} – ${fin.toLocaleDateString('es-AR', opts)}`
}

const Agenda = () => {
    const rol = localStorage.getItem("rol")
    const dispatch = useDispatch()
    const { medicos, turnos, cargando, error } = useSelector(state => state.agenda)

    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
    const [turnoModal, setTurnoModal] = useState(null) // { medico, fechaHora }

    const [medicoSeleccionado, setMedicoSeleccionado] = useState('')

    const [mesSeleccionado, setMesSeleccionado] = useState(
        new Date().getMonth()
    )



    // Carga horarios una sola vez
    useEffect(() => {
        dispatch(fetchHorariosAgenda())
    }, [])

    // Carga turnos al cambiar la semana
    useEffect(() => {
        dispatch(fetchTurnos(toDateStr(weekStart)))
    }, [weekStart])

    // Filtrado de médicos (si se implementa el select)
    const medicosFiltrados = medicoSeleccionado
        ? medicos.filter(m => m.id === Number(medicoSeleccionado))
        : medicos
    // Mapa de color por médico (estable por índice)
    const colorPorMedico = Object.fromEntries(
        medicosFiltrados.map((m, i) => [m.id, COLORES[i % COLORES.length]])
    )

    // Médicos que atienden en un slot concreto (diaNum, horaNum)
    const medicosEnSlot = (diaNum, horaNum) => {
        const slotDesde = horaNum * 60
        const slotHasta = slotDesde + 60
        return medicosFiltrados.filter(m =>
            m.horarios.some(h =>
                h.diaSemana === diaNum &&
                horaToMin(h.horaDesde) < slotHasta &&
                horaToMin(h.horaHasta) > slotDesde
            )
        )
    }



    // Turno de un médico en un slot concreto.
    // Parseamos el string directamente para evitar conversiones de zona horaria del browser.
    // Formato esperado del backend: "yyyy-MM-ddTHH:mm:ss"
    const turnoEnSlot = (diaNum, horaNum, medicoId) => {
        return turnos.find(t => {
            const [fechaParte, horaParte] = t.fechaHora.split('T')
            const tHora = parseInt(horaParte.split(':')[0], 10)
            const [y, m, d] = fechaParte.split('-').map(Number)
            // new Date(y, m-1, d) usa hora local → .getDay() es correcto sin desfase
            const diaSemana = new Date(y, m - 1, d).getDay()
            const tDia = diaSemana === 0 ? 7 : diaSemana
            return tDia === diaNum && tHora === horaNum && t.medicoId === medicoId
        })
    }

    const irSemanaAnterior = () => {
        const prev = new Date(weekStart)
        prev.setDate(prev.getDate() - 7)
        setWeekStart(prev)
    }

    const irSemanaSiguiente = () => {
        const next = new Date(weekStart)
        next.setDate(next.getDate() + 7)
        setWeekStart(next)
    }

    const cambiarMes = (mes) => {
        setMesSeleccionado(Number(mes))

        const nuevaFecha = new Date(weekStart)

        nuevaFecha.setMonth(Number(mes))
        nuevaFecha.setDate(1)

        setWeekStart(getMonday(nuevaFecha))
    }



    const handleBadgeClick = (m, diaNum, hora) => {
        const fechaHora = buildCellDate(weekStart, diaNum, hora)
        const turnoExistente = turnoEnSlot(diaNum, hora, m.id) ?? null
        setTurnoModal({ medico: m, fechaHora, turnoExistente })
    }

    if (cargando) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
            </div>
        )
    }

    return (
        <div>
            {/* Encabezado con navegación de semana */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 className="mb-0">
                    {rol === 'Medico' ? 'Mi Agenda' : 'Agenda'}
                </h2>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={irSemanaAnterior}>
                        ‹ Anterior
                    </button>
                    <span className="fw-semibold" style={{ minWidth: 180, textAlign: 'center' }}>
                        {formatSemana(weekStart)}
                    </span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={irSemanaSiguiente}>
                        Siguiente ›
                    </button>
                </div>
            </div>


            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-3">

                        {rol === 'Admin' && (
                            <div className="col-md-4">
                                <label className="form-label">
                                    Médico
                                </label>

                                <select
                                    className="form-select"
                                    value={medicoSeleccionado}
                                    onChange={(e) => setMedicoSeleccionado(e.target.value)}
                                >
                                    <option value="">
                                        Todos los médicos
                                    </option>

                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className={rol === 'Admin' ? 'col-md-4' : 'col-md-6'}>
                            <label className="form-label">
                                Mes
                            </label>

                            <select
                                className="form-select"
                                value={mesSeleccionado}
                                onChange={(e) => cambiarMes(e.target.value)}
                            >
                                <option value={0}>Enero</option>
                                <option value={1}>Febrero</option>
                                <option value={2}>Marzo</option>
                                <option value={3}>Abril</option>
                                <option value={4}>Mayo</option>
                                <option value={5}>Junio</option>
                                <option value={6}>Julio</option>
                                <option value={7}>Agosto</option>
                                <option value={8}>Septiembre</option>
                                <option value={9}>Octubre</option>
                                <option value={10}>Noviembre</option>
                                <option value={11}>Diciembre</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setMedicoSeleccionado('')
                                    setMesSeleccionado(new Date().getMonth())
                                    setWeekStart(getMonday(new Date()))
                                }}
                            >
                                Limpiar
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {medicos.length === 0 && !error && (
                <p className="text-center text-muted py-4">
                    No hay médicos con horarios registrados.
                </p>
            )}

            {medicos.length > 0 && (
                <>
                    {/* Leyenda de médicos */}
                    {rol === 'Administrador' && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {medicos.map(m => (
                                <span
                                    key={m.id}
                                    className="badge"
                                    style={{
                                        backgroundColor: colorPorMedico[m.id],
                                        fontSize: '0.8rem',
                                        padding: '5px 10px'
                                    }}
                                >
                                    {m.nombre}
                                    {m.especialidad && (
                                        <span style={{ fontWeight: 'normal', opacity: 0.85 }}>
                                            {' '}— {m.especialidad}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Grilla */}
                    <div className="agenda-wrapper">
                        <table className="agenda-table table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ position: 'sticky', left: 0, zIndex: 3, background: '#212529', minWidth: 58 }}>
                                        Hora
                                    </th>
                                    {DIAS.map(d => (
                                        <th key={d.num}>{d.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HORAS.map(hora => (
                                    <tr key={hora}>
                                        <td className="col-hora">
                                            {String(hora).padStart(2, '0')}:00
                                        </td>
                                        {DIAS.map(d => {
                                            const presentes = medicosEnSlot(d.num, hora)
                                            return (
                                                <td key={d.num} className="slot">
                                                    {presentes.length > 0
                                                        ? presentes.map(m => {
                                                            const turno = turnoEnSlot(d.num, hora, m.id)
                                                            return (
                                                                <span
                                                                    key={m.id}
                                                                    className="agenda-badge"
                                                                    style={{
                                                                        backgroundColor: colorPorMedico[m.id],
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    title={turno
                                                                        ? `${m.nombre} — ${turno.pacienteNombre ?? 'Sin paciente'}`
                                                                        : `${m.nombre}${m.especialidad ? ` — ${m.especialidad}` : ''} (click para agregar turno)`
                                                                    }
                                                                    onClick={() => handleBadgeClick(m, d.num, hora)}
                                                                >
                                                                    {m.nombre}
                                                                    {turno && (
                                                                        <span className="agenda-badge-paciente">
                                                                            {' — '}{turno.pacienteNombre ?? 'Sin paciente'}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            )
                                                        })
                                                        : <span className="slot-vacio">·</span>
                                                    }
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Modal de nuevo turno */}
            {turnoModal && (
                <FormularioTurno
                    medico={turnoModal.medico}
                    fechaHora={turnoModal.fechaHora}
                    weekStartStr={toDateStr(weekStart)}
                    turnoExistente={turnoModal.turnoExistente}
                    onClose={() => setTurnoModal(null)}
                />
            )}
        </div>
    )
}

export default Agenda
