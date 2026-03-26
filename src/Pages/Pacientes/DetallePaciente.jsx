import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetallePaciente, limpiarDetalle, eliminarPacienteLocal } from '../../../features/pacientesSlice'
import FormularioEditar from './FormularioEditar'

const DetallePaciente = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { detalle, cargandoDetalle, error } = useSelector(state => state.pacientes)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] = useState(false)

    useEffect(() => {
        dispatch(fetchDetallePaciente(id))
        return () => dispatch(limpiarDetalle())
    }, [id])

    const handleEditarCerrado = () => {
        setMostrarEditar(false)
        dispatch(fetchDetallePaciente(id))
    }

    const handleEliminar = () => {
        dispatch(eliminarPacienteLocal(detalle.id))
        navigate('/pacientes')
    }

    if (cargandoDetalle) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
            </div>
        )
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>
    }

    if (!detalle) return null

    const fechaNac = new Date(detalle.fechaNacimiento).toLocaleDateString('es-UY', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })

    return (
        <>
            {mostrarEditar && (
                <FormularioEditar paciente={detalle} onCerrar={handleEditarCerrado} />
            )}

            {/* Modal confirmación eliminar */}
            {mostrarConfirmarEliminar && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center py-4">
                                <p className="fs-5 fw-semibold mb-1">¿Seguro que quiere eliminar?</p>
                                <p className="text-muted mb-0">{detalle.nombreCompleto}</p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pt-0">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setMostrarConfirmarEliminar(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleEliminar}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/pacientes')}>
                    ← Volver a pacientes
                </button>
            </div>

            {/* Encabezado perfil */}
            <div className="card shadow-sm mb-4">
                <div className="card-body d-flex align-items-center gap-4 py-4">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-2"
                        style={{ width: 80, height: 80, backgroundColor: '#5EBA5A', flexShrink: 0 }}
                    >
                        {detalle.nombreCompleto.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                        <h3 className="mb-1">{detalle.nombreCompleto}</h3>
                        <span className="text-muted">Doc: {detalle.numeroDocumento}</span>
                        <span className="ms-3 badge bg-success">{detalle.edad} años</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setMostrarEditar(true)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => setMostrarConfirmarEliminar(true)}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* Datos personales */}
            <div className="card shadow-sm mb-4">
                <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                    Datos personales
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Fecha de nacimiento</p>
                            <p className="mb-0 fw-medium">{fechaNac}</p>
                        </div>
                        <div className="col-md-4">
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Email</p>
                            <p className="mb-0 fw-medium">{detalle.usuarioEmail || '—'}</p>
                        </div>
                        <div className="col-md-4">
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Teléfono</p>
                            <p className="mb-0 fw-medium">{detalle.telefono || '—'}</p>
                        </div>
                        <div className="col-md-8">
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Dirección</p>
                            <p className="mb-0 fw-medium">{detalle.direccion || '—'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historia clínica */}
            <div className="card shadow-sm">
                <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                    Historia clínica
                </div>
                <div className="card-body">
                    <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Patología</p>
                    <p className="mb-0">{detalle.patologia || 'Sin patología registrada'}</p>
                </div>
            </div>
        </>
    )
}

export default DetallePaciente
