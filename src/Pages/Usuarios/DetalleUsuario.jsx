import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetalleUsuario, limpiarDetalle, eliminarUsuarioLocal } from '../../../features/usuariosSlice'
import FormularioEditarUsuario from './FormularioEditarUsuario'

const DetalleUsuario = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { detalle, cargandoDetalle, error } = useSelector(state => state.usuarios)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] = useState(false)

    useEffect(() => {
        dispatch(fetchDetalleUsuario(id))
        return () => dispatch(limpiarDetalle())
    }, [id])

    const handleEditarCerrado = () => {
        setMostrarEditar(false)
        dispatch(fetchDetalleUsuario(id))
    }
//
    const handleEliminar = () => {
        dispatch(eliminarUsuarioLocal(detalle.id))
        navigate('/usuarios')
    }

    if (cargandoDetalle) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
            </div>
        )
    }

    if (error) return <div className="alert alert-danger">{error}</div>
    if (!detalle) return null

    return (
        <>
            {mostrarEditar && (
                <FormularioEditarUsuario usuario={detalle} onCerrar={handleEditarCerrado} />
            )}

            {mostrarConfirmarEliminar && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center py-4">
                                <p className="fs-5 fw-semibold mb-1">¿Seguro que quiere eliminar?</p>
                                <p className="text-muted mb-0">{detalle.email}</p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pt-0">
                                <button className="btn btn-secondary" onClick={() => setMostrarConfirmarEliminar(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-danger" onClick={handleEliminar}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/usuarios')}>
                    ← Volver a usuarios
                </button>
            </div>

            {/* Encabezado perfil */}
            <div className="card shadow-sm mb-4">
                <div className="card-body d-flex align-items-center gap-4 py-4">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-2"
                        style={{ width: 80, height: 80, backgroundColor: '#5EBA5A', flexShrink: 0 }}
                    >
                        {detalle.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                        <h4 className="mb-0">{detalle.email}</h4>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary" onClick={() => setMostrarEditar(true)}>
                            Editar
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => setMostrarConfirmarEliminar(true)}>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* Datos */}
            <div className="card shadow-sm">
                <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                    Datos del usuario
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>ID</p>
                            <p className="mb-0 fw-medium">{detalle.id}</p>
                        </div>
                        <div className="col-md-6">
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Email</p>
                            <p className="mb-0 fw-medium">{detalle.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetalleUsuario
