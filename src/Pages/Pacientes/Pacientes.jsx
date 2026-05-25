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

            {/* Título + botón */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Pacientes</h2>
                <button className="btn btn-success btn-sm" onClick={() => setMostrarFormulario(true)}>
                    + Agregar
                </button>
            </div>

            {/* Buscador — apila en mobile, inline en desktop */}
            <form className="row g-2 mb-3" onSubmit={handleBuscar}>
                <div className="col-12 col-sm-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        value={busNombre}
                        onChange={e => setBusNombre(e.target.value)}
                    />
                </div>
                <div className="col-12 col-sm-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Documento"
                        value={busDocumento}
                        onChange={e => setBusDocumento(e.target.value)}
                    />
                </div>
                <div className="col-6 col-sm-auto">
                    <button type="submit" className="btn btn-primary w-100">Buscar</button>
                </div>
                {buscando && (
                    <div className="col-6 col-sm-auto">
                        <button type="button" className="btn btn-secondary w-100" onClick={handleLimpiar}>
                            Limpiar
                        </button>
                    </div>
                )}
            </form>

            {/* Ordenamiento */}
            {!buscando && (
                <div className="mb-3 d-flex flex-wrap gap-1 align-items-center">
                    <span className="text-muted me-1">Ordenar:</span>
                    {['nombre', 'edad', 'registro'].map(op => (
                        <button
                            key={op}
                            className={`btn btn-sm ${orden === op ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => handleOrden(op)}
                        >
                            {op.charAt(0).toUpperCase() + op.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {cargando ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                </div>
            ) : lista.length === 0 ? (
                <p className="text-center text-muted py-4">No se encontraron pacientes.</p>
            ) : (
                <>
                    {/* Tabla — solo desktop */}
                    <div className="d-none d-sm-block table-responsive">
                        <table className="table table-hover table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre completo</th>
                                    <th>N° Documento</th>
                                    <th>Edad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map(p => (
                                    <tr
                                        key={p.id}
                                        onClick={() => navigate(`/pacientes/${p.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{p.nombreCompleto}</td>
                                        <td>{p.numeroDocumento}</td>
                                        <td>{p.edad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tarjetas — solo mobile */}
                    <div className="d-sm-none">
                        {lista.map(p => (
                            <div
                                key={p.id}
                                className="card mb-2"
                                onClick={() => navigate(`/pacientes/${p.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-body py-2 px-3">
                                    <div className="fw-semibold">{p.nombreCompleto}</div>
                                    <div className="text-muted small">
                                        Doc: {p.numeroDocumento} &nbsp;·&nbsp; {p.edad} años
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    {!buscando && (
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <span className="text-muted small">Página {pagina}</span>
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
