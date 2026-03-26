import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchPacientes, fetchBuscarPacientes, setPagina, setOrden } from '../../../features/pacientesSlice'
import FormularioPaciente from './FormularioPaciente'

const Pacientes = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { lista, totalBackend, cargando, error, pagina, tamano, orden } = useSelector(state => state.pacientes)

    const [busNombre, setBusNombre] = useState('')
    const [busDocumento, setBusDocumento] = useState('')
    const [buscando, setBuscando] = useState(false)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    useEffect(() => {
        if (!buscando) {
            dispatch(fetchPacientes({ pagina, tamano, orden }))
        }
    }, [pagina, orden, buscando])

    const handleBuscar = (e) => {
        e.preventDefault()
        if (!busNombre && !busDocumento) {
            setBuscando(false)
            dispatch(fetchPacientes({ pagina: 1, tamano, orden }))
            return
        }
        setBuscando(true)
        dispatch(fetchBuscarPacientes({ nombre: busNombre, documento: busDocumento }))
    }

    const handleLimpiar = () => {
        setBusNombre('')
        setBusDocumento('')
        setBuscando(false)
        dispatch(setPagina(1))
        dispatch(fetchPacientes({ pagina: 1, tamano, orden }))
    }

    const handleOrden = (nuevoOrden) => {
        dispatch(setOrden(nuevoOrden))
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
                <FormularioPaciente onCerrar={() => setMostrarFormulario(false)} />
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Pacientes</h2>
                <button className="btn btn-success" onClick={() => setMostrarFormulario(true)}>
                    + Agregar paciente
                </button>
            </div>

            {/* Buscador */}
            <form className="row g-2 mb-3" onSubmit={handleBuscar}>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        value={busNombre}
                        onChange={e => setBusNombre(e.target.value)}
                    />
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Documento"
                        value={busDocumento}
                        onChange={e => setBusDocumento(e.target.value)}
                    />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary">Buscar</button>
                </div>
                {buscando && (
                    <div className="col-auto">
                        <button type="button" className="btn btn-secondary" onClick={handleLimpiar}>
                            Limpiar
                        </button>
                    </div>
                )}
            </form>

            {/* Ordenamiento */}
            {!buscando && (
                <div className="mb-3">
                    <span className="me-2 text-muted">Ordenar por:</span>
                    {['nombre', 'edad', 'registro'].map(op => (
                        <button
                            key={op}
                            className={`btn btn-sm me-1 ${orden === op ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => handleOrden(op)}
                        >
                            {op.charAt(0).toUpperCase() + op.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Errores */}
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {/* Tabla */}
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
                                <th>Nombre completo</th>
                                <th>N° Documento</th>
                                <th>Edad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-4">
                                        No se encontraron pacientes.
                                    </td>
                                </tr>
                            ) : (
                                lista.map(p => (
                                    <tr
                                        key={p.id}
                                        onClick={() => navigate(`/pacientes/${p.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{p.id}</td>
                                        <td>{p.nombreCompleto}</td>
                                        <td>{p.numeroDocumento}</td>
                                        <td>{p.edad}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    {!buscando && (
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
                    )}
                </>
            )}
        </div>
    )
}

export default Pacientes
