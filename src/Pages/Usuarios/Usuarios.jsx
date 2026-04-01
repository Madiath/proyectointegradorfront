import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchUsuarios, setPagina } from '../../../features/usuariosSlice'
import FormularioUsuario from './FormularioUsuario'

const Usuarios = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { lista, totalBackend, cargando, error, pagina, tamano } = useSelector(state => state.usuarios)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    useEffect(() => {
        dispatch(fetchUsuarios({ pagina, tamano }))
    }, [pagina])

    const handleCreado = () => {
        setMostrarFormulario(false)
        dispatch(fetchUsuarios({ pagina, tamano }))
    }

    const handlePaginaAnterior = () => {
        if (pagina > 1) dispatch(setPagina(pagina - 1))
    }

    const handlePaginaSiguiente = () => {
        if (totalBackend === tamano) dispatch(setPagina(pagina + 1))
    }

    return (
        <div>
            {mostrarFormulario && (
                <FormularioUsuario onCerrar={() => setMostrarFormulario(false)} onCreado={handleCreado} />
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Usuarios</h2>
                <button className="btn btn-success" onClick={() => setMostrarFormulario(true)}>
                    + Agregar usuario
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {cargando ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                </div>
            ) : (
                <>
                    <table className="table table-hover table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="text-center text-muted py-4">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                lista.map(u => (
                                    <tr
                                        key={u.id}
                                        onClick={() => navigate(`/usuarios/${u.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{u.id}</td>
                                        <td>{u.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Página {pagina}</span>
                        <div>
                            <button
                                className="btn btn-outline-secondary btn-sm me-2"
                                onClick={handlePaginaAnterior}
                                disabled={pagina === 1}
                            >
                                Anterior
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handlePaginaSiguiente}
                                disabled={totalBackend < tamano}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Usuarios
