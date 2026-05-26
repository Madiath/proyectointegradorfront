import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsumos } from '../../../features/insumosSlice'
import FormularioInsumo from './FormularioInsumo'
import FormularioMovimiento from './FormularioMovimiento'

const estadoConfig = {
    OK: { clase: '', badge: null },
    MINIMO: { clase: 'table-warning', badge: <span className="badge bg-warning text-dark">Mínimo</span> },
    BAJO: { clase: 'table-danger', badge: <span className="badge bg-danger">Bajo</span> },
}

const Insumos = () => {
    const dispatch = useDispatch()
    const { lista, cargando, error } = useSelector(state => state.insumos)

    const [mostrarFormInsumo, setMostrarFormInsumo] = useState(false)
    const [modalMovimiento, setModalMovimiento] = useState(null) // null | 'ENTRADA' | 'SALIDA'
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        dispatch(fetchInsumos())
    }, [])

    const insumosFiltrados = lista.filter(i =>
        i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        i.categoria.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div>
            {mostrarFormInsumo && (
                <FormularioInsumo onCerrar={() => setMostrarFormInsumo(false)} />
            )}
            {modalMovimiento && (
                <FormularioMovimiento
                    tipo={modalMovimiento}
                    insumos={lista}
                    onCerrar={() => setModalMovimiento(null)}
                />
            )}

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h2 className="mb-0">Insumos</h2>
                <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => setMostrarFormInsumo(true)}>
                        + Agregar Insumo
                    </button>
                    <button className="btn btn-outline-success btn-sm" onClick={() => setModalMovimiento('ENTRADA')}>
                        ↑ Entrada
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => setModalMovimiento('SALIDA')}>
                        ↓ Salida
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Buscar por nombre o categoría..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {cargando ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                </div>
            ) : insumosFiltrados.length === 0 ? (
                <p className="text-center text-muted py-4">
                    {busqueda ? 'No hay insumos que coincidan con la búsqueda.' : 'No hay insumos registrados.'}
                </p>
            ) : (
                <>
                    {/* Tabla — desktop */}
                    <div className="d-none d-sm-block table-responsive">
                        <table className="table table-hover table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Unidad</th>
                                    <th className="text-center">Stock actual</th>
                                    <th className="text-center">Stock mínimo</th>
                                    <th className="text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insumosFiltrados.map(i => {
                                    const config = estadoConfig[i.estadoStock] ?? estadoConfig.OK
                                    return (
                                        <tr key={i.id} className={config.clase}>
                                            <td>
                                                <div className="fw-semibold">{i.nombre}</div>
                                                {i.descripcion && <div className="text-muted small">{i.descripcion}</div>}
                                            </td>
                                            <td>{i.categoria}</td>
                                            <td>{i.unidadMedida}</td>
                                            <td className="text-center fw-bold">{i.stockActual}</td>
                                            <td className="text-center">{i.stockMinimo}</td>
                                            <td className="text-center">
                                                {config.badge ?? <span className="badge bg-success">OK</span>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Tarjetas — mobile */}
                    <div className="d-sm-none">
                        {insumosFiltrados.map(i => {
                            const config = estadoConfig[i.estadoStock] ?? estadoConfig.OK
                            const estiloFondo = i.estadoStock === 'BAJO'
                                ? { borderLeft: '4px solid var(--bs-danger)' }
                                : i.estadoStock === 'MINIMO'
                                    ? { borderLeft: '4px solid var(--bs-warning)' }
                                    : {}
                            return (
                                <div key={i.id} className="card mb-2" style={estiloFondo}>
                                    <div className="card-body py-2 px-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <div className="fw-semibold">{i.nombre}</div>
                                                <div className="text-muted small">{i.categoria} · {i.unidadMedida}</div>
                                            </div>
                                            <div className="text-end">
                                                {config.badge ?? <span className="badge bg-success">OK</span>}
                                                <div className="fw-bold mt-1">{i.stockActual} / {i.stockMinimo}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>actual / mínimo</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

export default Insumos
