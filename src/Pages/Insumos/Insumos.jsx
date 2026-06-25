import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsumos, deshabilitarInsumo, setPaginaInsumos } from '../../../features/insumosSlice'
import FormularioInsumo from './FormularioInsumo'
import FormularioEditarInsumo from './FormularioEditarInsumo'
import FormularioMovimiento from './FormularioMovimiento'
import { toast } from 'react-toastify'

const estadoConfig = {
    OK: { clase: '', badge: null },
    MINIMO: { clase: 'table-warning', badge: <span className="badge bg-warning text-dark">Mínimo</span> },
    BAJO: { clase: 'table-danger', badge: <span className="badge bg-danger">Bajo</span> },
}

const Insumos = () => {
    const dispatch = useDispatch()
    const { lista, hayMas, cargando, error, pagina, tamano } = useSelector(state => state.insumos)

    const [mostrarFormInsumo, setMostrarFormInsumo] = useState(false)
    const [insumoEditar, setInsumoEditar] = useState(null)
    const [insumoADeshabilitar, setInsumoADeshabilitar] = useState(null) // insumo a confirmar o null
    const [deshabilitando, setDeshabilitando] = useState(false)
    const [modalMovimiento, setModalMovimiento] = useState(null) // null | 'ENTRADA' | 'SALIDA'
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('')

    useEffect(() => {
        dispatch(fetchInsumos({ pagina, tamano }))
    }, [dispatch, pagina, tamano])

    const handleConfirmarDeshabilitar = async () => {
        setDeshabilitando(true)
        const res = await dispatch(deshabilitarInsumo(insumoADeshabilitar.id))
        setDeshabilitando(false)
        if (deshabilitarInsumo.fulfilled.match(res)) {
            toast.success('Insumo deshabilitado')
            setInsumoADeshabilitar(null)
            dispatch(setPaginaInsumos(1))
            dispatch(fetchInsumos({ pagina: 1, tamano }))
        } else {
            toast.error(res.payload || 'Error al deshabilitar')
        }
    }

    const insumosFiltrados = lista.filter(i => {
        const coincideTexto =
            i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            i.categoria.toLowerCase().includes(busqueda.toLowerCase())
        const coincideEstado = filtroEstado === '' || i.estadoStock === filtroEstado
        return coincideTexto && coincideEstado
    })

    return (
        <div>
            {mostrarFormInsumo && (
                <FormularioInsumo onCerrar={() => setMostrarFormInsumo(false)} />
            )}
            {insumoEditar && (
                <FormularioEditarInsumo insumo={insumoEditar} onCerrar={() => setInsumoEditar(null)} />
            )}
            {insumoADeshabilitar && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title">Deshabilitar insumo</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setInsumoADeshabilitar(null)}
                                    disabled={deshabilitando}
                                />
                            </div>
                            <div className="modal-body text-center py-3">
                                <p className="mb-1">
                                    ¿Querés deshabilitar <strong>{insumoADeshabilitar.nombre}</strong>?
                                </p>
                                <p className="text-muted small mb-0">
                                    El insumo dejará de aparecer en el listado.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pt-0">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setInsumoADeshabilitar(null)}
                                    disabled={deshabilitando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleConfirmarDeshabilitar}
                                    disabled={deshabilitando}
                                >
                                    {deshabilitando ? 'Deshabilitando...' : 'Deshabilitar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

            <div className="d-flex gap-2 mb-3">
                <input
                    className="form-control"
                    style={{ maxWidth: '220px' }}
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={e => {
                        setBusqueda(e.target.value)
                        dispatch(setPaginaInsumos(1))
                    }}
                />
                <select
                    className="form-select w-auto"
                    value={filtroEstado}
                    onChange={e => {
                        setFiltroEstado(e.target.value)
                        dispatch(setPaginaInsumos(1))
                    }}
                >
                    <option value="">Todos</option>
                    <option value="OK">OK</option>
                    <option value="MINIMO">Mínimo</option>
                    <option value="BAJO">Bajo</option>
                </select>
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
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Unidad</th>
                                    <th className="text-center">Stock actual</th>
                                    <th className="text-center">Stock mínimo</th>
                                    <th className="text-center">Estado</th>
                                    <th>Acciones</th></tr>
                            </thead>
                            <tbody>
                                {insumosFiltrados.map(i => {
                                    const config = estadoConfig[i.estadoStock] ?? estadoConfig.OK
                                    const codigo = `INS-${String(i.id).padStart(4, '0')}`
                                    return (
                                        <tr key={i.id} className={config.clase}>
                                            <td className="text-center fw-bold">
                                                {codigo}
                                            </td>

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
                                            <td onClick={e => e.stopPropagation()}>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => setInsumoEditar(i)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => setInsumoADeshabilitar(i)}
                                                    >
                                                        Deshabilitar
                                                    </button>
                                                </div>
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
                            const codigo = `INS-${String(i.id).padStart(4, '0')}`
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
                                                <div
                                                    className="text-muted"
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    Código: {codigo}
                                                </div>
                                                <div className="text-muted small">{i.categoria} · {i.unidadMedida}</div>
                                            </div>
                                            <div className="text-end">
                                                {config.badge ?? <span className="badge bg-success">OK</span>}
                                                <div className="fw-bold mt-1">{i.stockActual} / {i.stockMinimo}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>actual / mínimo</div>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                className="btn btn-outline-primary btn-sm flex-grow-1"
                                                onClick={() => setInsumoEditar(i)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm flex-grow-1"
                                                onClick={() => setInsumoADeshabilitar(i)}
                                            >
                                                Deshabilitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Paginación */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="text-muted small">Página {pagina}</span>
                        <div>
                            <button
                                className="btn btn-outline-secondary btn-sm me-2"
                                onClick={() => dispatch(setPaginaInsumos(pagina - 1))}
                                disabled={pagina === 1}
                            >
                                Anterior
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => dispatch(setPaginaInsumos(pagina + 1))}
                                disabled={!hayMas}
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

export default Insumos
