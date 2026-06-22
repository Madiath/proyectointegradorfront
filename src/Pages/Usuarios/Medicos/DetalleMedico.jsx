const DIAS = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' }

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router'
import { fetchDetalleMedico, deshabilitarMedico, limpiarDetalleMedico } from '../../../../features/medicosSlice'
import { toast } from 'react-toastify'
import FormularioEditarMedico from './FormularioEditarMedico'

const DetalleMedico = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { detalle, cargandoDetalle, error } = useSelector(state => state.medicos)
    const [mostrarEditar, setMostrarEditar] = useState(false)

    useEffect(() => {
        dispatch(fetchDetalleMedico(id))
        return () => dispatch(limpiarDetalleMedico())
    }, [id])

    const handleEliminar = async () => {
        if (!window.confirm('¿Está seguro que desea deshabilitar este médico?')) return
        const res = await dispatch(deshabilitarMedico(Number(id)))
        if (deshabilitarMedico.fulfilled.match(res)) {
            toast.success('Médico deshabilitado correctamente')
            navigate('/usuarios')
        } else {
            toast.error(res.payload || 'Error al deshabilitar médico')
        }
    }

    const handleEditado = () => {
        setMostrarEditar(false)
        dispatch(fetchDetalleMedico(id))
        toast.success('Médico actualizado correctamente')
    }

    if (cargandoDetalle) return (
        <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" />
        </div>
    )

    if (error) return <div className="alert alert-danger">{error}</div>
    if (!detalle) return null

    return (
        <div>
            {mostrarEditar && (
                <FormularioEditarMedico
                    medico={detalle}
                    onCerrar={() => setMostrarEditar(false)}
                    onEditado={handleEditado}
                />
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/usuarios')}>
                    ← Volver
                </button>
                <div>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => setMostrarEditar(true)}>
                        Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleEliminar}>
                        Deshabilitar
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">{detalle.nombre}</h5>
                </div>
                <div className="card-body">
                    <p><strong>Email:</strong> {detalle.email}</p>
                    <p><strong>Especialidad:</strong> {detalle.especialidad}</p>

                    <h6 className="mt-3">Horarios</h6>
                    {detalle.horarios && detalle.horarios.length > 0 ? (
                        <table className="table table-bordered table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th>Día</th>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalle.horarios.map(h => (
                                    <tr key={h.id}>
                                        <td>{DIAS[h.diaSemana] ?? h.diaSemana}</td>
                                        <td>{h.horaDesde}</td>
                                        <td>{h.horaHasta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted">Sin horarios asignados.</p>
                    )}
                    <h6 className="mt-4">Licencias</h6>

                    {detalle.licencias && detalle.licencias.length > 0 ? (
                        <table className="table table-bordered table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalle.licencias.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.fechaDesde}</td>
                                        <td>{l.fechaHasta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted">Sin licencias registradas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DetalleMedico
