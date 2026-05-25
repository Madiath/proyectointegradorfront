import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchUsuarios, setPagina } from '../../../features/usuariosSlice'
import { fetchMedicos, setPaginaMedicos, deshabilitarMedico } from '../../../features/medicosSlice'
import FormularioUsuario from './FormularioUsuario'
import FormularioMedico from './Medicos/FormularioMedico'
import { toast } from 'react-toastify'

const Usuarios = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [tabActivo, setTabActivo] = useState('medicos')
    const [mostrarFormularioAdmin, setMostrarFormularioAdmin] = useState(false)
    const [mostrarFormularioMedico, setMostrarFormularioMedico] = useState(false)

    const { lista: listaAdmins, totalBackend: totalAdmins, cargando: cargandoAdmins, error: errorAdmins, pagina: paginaAdmins, tamano: tamanoAdmins } = useSelector(state => state.usuarios)
    const { lista: listaMedicos, totalBackend: totalMedicos, cargando: cargandoMedicos, error: errorMedicos, pagina: paginaMedicos, tamano: tamanoMedicos } = useSelector(state => state.medicos)

    useEffect(() => {
        dispatch(fetchUsuarios({ pagina: paginaAdmins, tamano: tamanoAdmins }))
    }, [paginaAdmins])

    useEffect(() => {
        dispatch(fetchMedicos({ pagina: paginaMedicos, tamano: tamanoMedicos }))
    }, [paginaMedicos])

    const handleAdminCreado = () => {
        setMostrarFormularioAdmin(false)
        dispatch(fetchUsuarios({ pagina: paginaAdmins, tamano: tamanoAdmins }))
    }

    const handleMedicoCreado = () => {
        setMostrarFormularioMedico(false)
        dispatch(fetchMedicos({ pagina: paginaMedicos, tamano: tamanoMedicos }))
    }

    const handleEliminarMedico = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm('¿Deshabilitar este médico?')) return
        const res = await dispatch(deshabilitarMedico(id))
        if (deshabilitarMedico.fulfilled.match(res)) {
            toast.success('Médico deshabilitado')
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
                                                        onClick={(e) => handleEliminarMedico(e, m.id)}
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
                                                onClick={(e) => handleEliminarMedico(e, m.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            <div className="d-flex justify-content-between align-items-center mt-2">
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
                                        disabled={totalMedicos < tamanoMedicos}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
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
                            <div className="d-flex justify-content-between align-items-center mt-2">
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
                                        disabled={totalAdmins < tamanoAdmins}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Usuarios
