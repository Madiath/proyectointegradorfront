import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { fetchUsuarios, fetchBuscarUsuarios, setPagina } from '../../../features/usuariosSlice'
import { fetchMedicos, fetchBuscarMedicos, setPaginaMedicos, deshabilitarMedico } from '../../../features/medicosSlice'
import FormularioUsuario from './FormularioUsuario'
import FormularioMedico from './Medicos/FormularioMedico'
import { toast } from 'react-toastify'

const Usuarios = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [tabActivo, setTabActivo] = useState(location.state?.tab ?? 'medicos')
    const [mostrarFormularioAdmin, setMostrarFormularioAdmin] = useState(false)
    const [mostrarFormularioMedico, setMostrarFormularioMedico] = useState(false)
    const [medicoADeshabilitar, setMedicoADeshabilitar] = useState(null)
    const [deshabilitando, setDeshabilitando] = useState(false)
    const [busquedaMedicos, setBusquedaMedicos] = useState({ nombre: '', email: '', especialidad: '' })
    const [busquedaAdmins, setBusquedaAdmins] = useState({ nombre: '', email: '' })
    const [buscandoMedicos, setBuscandoMedicos] = useState(false)
    const [buscandoAdmins, setBuscandoAdmins] = useState(false)

    const { lista: listaAdmins, hayMas: hayMasAdmins, cargando: cargandoAdmins, error: errorAdmins, pagina: paginaAdmins } = useSelector(state => state.usuarios)
    const { lista: listaMedicos, hayMas: hayMasMedicos, cargando: cargandoMedicos, error: errorMedicos, pagina: paginaMedicos } = useSelector(state => state.medicos)

    useEffect(() => {
        if (!buscandoAdmins) {
            dispatch(fetchUsuarios({ pagina: paginaAdmins, tamano: 10 }))
        }
    }, [dispatch, paginaAdmins, buscandoAdmins])

    useEffect(() => {
        if (!buscandoMedicos) {
            dispatch(fetchMedicos({ pagina: paginaMedicos, tamano: 10 }))
        }
    }, [dispatch, paginaMedicos, buscandoMedicos])

    const handleAdminCreado = () => {
        setMostrarFormularioAdmin(false)
        dispatch(fetchUsuarios({ pagina: paginaAdmins, tamano: 10 }))
    }

    const handleMedicoCreado = () => {
        setMostrarFormularioMedico(false)
        dispatch(fetchMedicos({ pagina: paginaMedicos, tamano: 10 }))
    }

    const handleBuscarMedicos = (e) => {
        e.preventDefault()
        const { nombre, email, especialidad } = busquedaMedicos
        if (!nombre && !email && !especialidad) {
            handleLimpiarMedicos()
            return
        }
        setBuscandoMedicos(true)
        dispatch(fetchBuscarMedicos(busquedaMedicos))
    }

    const handleLimpiarMedicos = () => {
        setBusquedaMedicos({ nombre: '', email: '', especialidad: '' })
        setBuscandoMedicos(false)
        dispatch(setPaginaMedicos(1))
        dispatch(fetchMedicos({ pagina: 1, tamano: 10 }))
    }

    const handleBuscarAdmins = (e) => {
        e.preventDefault()
        const { nombre, email } = busquedaAdmins
        if (!nombre && !email) {
            handleLimpiarAdmins()
            return
        }
        setBuscandoAdmins(true)
        dispatch(fetchBuscarUsuarios(busquedaAdmins))
    }

    const handleLimpiarAdmins = () => {
        setBusquedaAdmins({ nombre: '', email: '' })
        setBuscandoAdmins(false)
        dispatch(setPagina(1))
        dispatch(fetchUsuarios({ pagina: 1, tamano: 10 }))
    }

    const handleConfirmarDeshabilitar = async () => {
        if (!medicoADeshabilitar) return
        setDeshabilitando(true)
        const res = await dispatch(deshabilitarMedico(medicoADeshabilitar.id))
        setDeshabilitando(false)
        setMedicoADeshabilitar(null)
        if (deshabilitarMedico.fulfilled.match(res)) {
            toast.success('Médico deshabilitado')
            dispatch(setPaginaMedicos(1))
            dispatch(fetchMedicos({ pagina: 1, tamano: 10 }))
        } else {
            toast.error(res.payload || 'Error al deshabilitar')
        }
    }

    return (
        <div>
            {mostrarFormularioAdmin && (
                <FormularioUsuario onCerrar={() => setMostrarFormularioAdmin(false)} onCreado={handleAdminCreado} />
            )}
            {mostrarFormularioMedico && (
                <FormularioMedico onCerrar={() => setMostrarFormularioMedico(false)} onCreado={handleMedicoCreado} />
            )}

            {/* Modal confirmación deshabilitar médico */}
            {medicoADeshabilitar && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center py-4">
                                <p className="mb-1 fs-5 fw-semibold">¿Deshabilitar médico?</p>
                                <p className="text-muted mb-0">
                                    Se deshabilitará a <strong>{medicoADeshabilitar.nombre}</strong>.
                                    Esta acción se puede revertir.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pt-0">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setMedicoADeshabilitar(null)}
                                    disabled={deshabilitando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleConfirmarDeshabilitar}
                                    disabled={deshabilitando}
                                >
                                    {deshabilitando ? 'Deshabilitando…' : 'Deshabilitar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="mb-3">Usuarios</h2>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${tabActivo === 'medicos' ? 'active' : ''}`}
                        onClick={() => setTabActivo('medicos')}
                    >
                        Médicos
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${tabActivo === 'admins' ? 'active' : ''}`}
                        onClick={() => setTabActivo('admins')}
                    >
                        Administradores
                    </button>
                </li>
            </ul>

            {/* ── TAB MÉDICOS ── */}
            {tabActivo === 'medicos' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Médicos</h5>
                        <button className="btn btn-success btn-sm" onClick={() => setMostrarFormularioMedico(true)}>
                            + Agregar
                        </button>
                    </div>

                    <form className="row g-2 mb-3" onSubmit={handleBuscarMedicos}>
                        <div className="col-12 col-md">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                value={busquedaMedicos.nombre}
                                onChange={e => setBusquedaMedicos({ ...busquedaMedicos, nombre: e.target.value })}
                            />
                        </div>
                        <div className="col-12 col-md">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={busquedaMedicos.email}
                                onChange={e => setBusquedaMedicos({ ...busquedaMedicos, email: e.target.value })}
                            />
                        </div>
                        <div className="col-12 col-md">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Especialidad"
                                value={busquedaMedicos.especialidad}
                                onChange={e => setBusquedaMedicos({ ...busquedaMedicos, especialidad: e.target.value })}
                            />
                        </div>
                        <div className="col-6 col-md-auto">
                            <button type="submit" className="btn btn-primary w-100">Buscar</button>
                        </div>
                        {buscandoMedicos && (
                            <div className="col-6 col-md-auto">
                                <button type="button" className="btn btn-secondary w-100" onClick={handleLimpiarMedicos}>
                                    Limpiar
                                </button>
                            </div>
                        )}
                    </form>

                    {errorMedicos && <div className="alert alert-danger">{errorMedicos}</div>}

                    {cargandoMedicos ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status" />
                        </div>
                    ) : listaMedicos.length === 0 ? (
                        <p className="text-center text-muted py-4">No se encontraron médicos.</p>
                    ) : (
                        <>
                            {/* Tabla — solo desktop */}
                            <div className="d-none d-sm-block table-responsive">
                                <table className="table table-hover table-bordered align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Especialidad</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaMedicos.map(m => (
                                            <tr
                                                key={m.id}
                                                onClick={() => navigate(`/medicos/${m.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{m.nombre}</td>
                                                <td>{m.email}</td>
                                                <td>{m.especialidad}</td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setMedicoADeshabilitar(m)
                                                        }}
                                                    >
                                                        Deshabilitar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Tarjetas — solo mobile */}
                            <div className="d-sm-none">
                                {listaMedicos.map(m => (
                                    <div key={m.id} className="card mb-2">
                                        <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
                                            <div
                                                onClick={() => navigate(`/medicos/${m.id}`)}
                                                style={{ cursor: 'pointer', flex: 1 }}
                                            >
                                                <div className="fw-semibold">{m.nombre}</div>
                                                <div className="text-muted small">{m.especialidad}</div>
                                            </div>
                                            <button
                                                className="btn btn-outline-danger btn-sm ms-2"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setMedicoADeshabilitar(m)
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {!buscandoMedicos && <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="text-muted small">Página {paginaMedicos}</span>
                                <div>
                                    <button
                                        className="btn btn-outline-secondary btn-sm me-2"
                                        onClick={() => dispatch(setPaginaMedicos(paginaMedicos - 1))}
                                        disabled={paginaMedicos === 1}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => dispatch(setPaginaMedicos(paginaMedicos + 1))}
                                        disabled={!hayMasMedicos}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>}
                        </>
                    )}
                </div>
            )}

            {/* ── TAB ADMINS ── */}
            {tabActivo === 'admins' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Administradores</h5>
                        <button className="btn btn-success btn-sm" onClick={() => setMostrarFormularioAdmin(true)}>
                            + Agregar
                        </button>
                    </div>

                    <form className="row g-2 mb-3" onSubmit={handleBuscarAdmins}>
                        <div className="col-12 col-sm-auto">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                value={busquedaAdmins.nombre}
                                onChange={e => setBusquedaAdmins({ ...busquedaAdmins, nombre: e.target.value })}
                            />
                        </div>
                        <div className="col-12 col-sm-auto">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={busquedaAdmins.email}
                                onChange={e => setBusquedaAdmins({ ...busquedaAdmins, email: e.target.value })}
                            />
                        </div>
                        <div className="col-6 col-sm-auto">
                            <button type="submit" className="btn btn-primary w-100">Buscar</button>
                        </div>
                        {buscandoAdmins && (
                            <div className="col-6 col-sm-auto">
                                <button type="button" className="btn btn-secondary w-100" onClick={handleLimpiarAdmins}>
                                    Limpiar
                                </button>
                            </div>
                        )}
                    </form>

                    {errorAdmins && <div className="alert alert-danger">{errorAdmins}</div>}

                    {cargandoAdmins ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status" />
                        </div>
                    ) : listaAdmins.length === 0 ? (
                        <p className="text-center text-muted py-4">No se encontraron administradores.</p>
                    ) : (
                        <>
                            {/* Tabla — solo desktop */}
                            <div className="d-none d-sm-block table-responsive">
                                <table className="table table-hover table-bordered align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaAdmins.map(u => (
                                            <tr
                                                key={u.id}
                                                onClick={() => navigate(`/usuarios/${u.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{u.nombre}</td>
                                                <td>{u.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Tarjetas — solo mobile */}
                            <div className="d-sm-none">
                                {listaAdmins.map(u => (
                                    <div
                                        key={u.id}
                                        className="card mb-2"
                                        onClick={() => navigate(`/usuarios/${u.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="card-body py-2 px-3">
                                            <div className="fw-semibold">{u.nombre}</div>
                                            <div className="text-muted small">{u.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {!buscandoAdmins && <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="text-muted small">Página {paginaAdmins}</span>
                                <div>
                                    <button
                                        className="btn btn-outline-secondary btn-sm me-2"
                                        onClick={() => dispatch(setPagina(paginaAdmins - 1))}
                                        disabled={paginaAdmins === 1}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => dispatch(setPagina(paginaAdmins + 1))}
                                        disabled={!hayMasAdmins}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Usuarios
