import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { listarMedicos } from '../../Services/medicoService'
import {
    crearRecipe,
    exportarRecipePdf,
    listarInsumosRecipeDisponibles,
    listarRecipesPaciente
} from '../../Services/recipeMedicoService'

const recipesPorPagina = 5

const RecipesPaciente = () => {
    const { id } = useParams()
    const rol = localStorage.getItem('rol')
    const puedeGestionar = rol === 'Admin' || rol === 'Medico'

    const [recipes, setRecipes] = useState([])
    const [medicos, setMedicos] = useState([])
    const [insumos, setInsumos] = useState([])
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [descargandoId, setDescargandoId] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [filtros, setFiltros] = useState({
        fechaDesde: '',
        fechaHasta: '',
        medicoId: '',
        insumoId: ''
    })
    const [formulario, setFormulario] = useState({
        medicoId: '',
        insumoId: '',
        indicaciones: ''
    })

    const cargarCatalogos = useCallback(async () => {
        if (!puedeGestionar) return

        const [medicosResp, insumosResp] = await Promise.all([
            listarMedicos(1, 100),
            listarInsumosRecipeDisponibles()
        ])

        setMedicos(medicosResp.data || [])
        setInsumos(insumosResp || [])
    }, [puedeGestionar])

    const cargarRecipes = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const data = await listarRecipesPaciente(id, {
                pagina: paginaActual,
                tamano: recipesPorPagina,
                fechaDesde: filtros.fechaDesde || undefined,
                fechaHasta: filtros.fechaHasta || undefined,
                medicoId: filtros.medicoId || undefined,
                insumoId: filtros.insumoId || undefined
            })

            setRecipes(data)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudieron cargar los récipes.')
        } finally {
            setLoading(false)
        }
    }, [id, paginaActual, filtros])

    useEffect(() => {
        cargarCatalogos().catch(() => {
            setError('No se pudieron cargar médicos o insumos disponibles.')
        })
    }, [cargarCatalogos])

    useEffect(() => {
        cargarRecipes()
    }, [cargarRecipes])

    const recipesPagina = useMemo(() => recipes.slice(0, recipesPorPagina), [recipes])
    const hayMas = recipes.length > recipesPorPagina

    const cambiarFiltro = (campo, valor) => {
        setFiltros((actual) => ({ ...actual, [campo]: valor }))
        setPaginaActual(1)
    }

    const limpiarFiltros = () => {
        setFiltros({ fechaDesde: '', fechaHasta: '', medicoId: '', insumoId: '' })
        setPaginaActual(1)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMensaje('')
        setError('')

        if (!formulario.medicoId) {
            setError('Seleccione un médico.')
            return
        }

        if (!formulario.insumoId) {
            setError('Seleccione un insumo disponible.')
            return
        }

        if (!formulario.indicaciones.trim()) {
            setError('Ingrese las indicaciones del récipe.')
            return
        }

        setGuardando(true)
        try {
            await crearRecipe({
                pacienteId: Number(id),
                medicoId: Number(formulario.medicoId),
                insumoId: Number(formulario.insumoId),
                indicaciones: formulario.indicaciones.trim()
            })

            setFormulario({ medicoId: '', insumoId: '', indicaciones: '' })
            setMensaje('Récipe generado correctamente.')
            setPaginaActual(1)
            await cargarRecipes()
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo generar el récipe.')
        } finally {
            setGuardando(false)
        }
    }

    const descargarPdf = async (recipe) => {
        setError('')
        setDescargandoId(recipe.id)
        try {
            const blob = await exportarRecipePdf(recipe.id)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            const fecha = (recipe.fechaEmision || '').split('T')[0]?.replaceAll('-', '') || recipe.id

            link.href = url
            link.download = `RecipeMedico_${recipe.pacienteNombre || id}_${fecha}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo exportar el PDF.')
        } finally {
            setDescargandoId(null)
        }
    }

    const formatearFecha = (fecha) =>
        new Date(fecha).toLocaleString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
                <div>
                    <h2 className="mb-1">Récipes del paciente</h2>
                    <p className="text-muted mb-0">Indicaciones emitidas y exportación para firma manual.</p>
                </div>
                <Link to={`/pacientes/${id}`} className="btn btn-outline-secondary">
                    Volver al paciente
                </Link>
            </div>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {puedeGestionar && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                        Nuevo récipe
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Médico</label>
                                <select
                                    className="form-select"
                                    value={formulario.medicoId}
                                    onChange={(e) => setFormulario((actual) => ({ ...actual, medicoId: e.target.value }))}
                                    disabled={guardando}
                                >
                                    <option value="">Seleccione...</option>
                                    {medicos.map((medico) => (
                                        <option key={medico.id} value={medico.id}>
                                            {medico.nombre} - {medico.especialidad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Insumo disponible</label>
                                <select
                                    className="form-select"
                                    value={formulario.insumoId}
                                    onChange={(e) => setFormulario((actual) => ({ ...actual, insumoId: e.target.value }))}
                                    disabled={guardando}
                                >
                                    <option value="">Seleccione...</option>
                                    {insumos.map((insumo) => (
                                        <option key={insumo.id} value={insumo.id}>
                                            {insumo.nombre} ({insumo.stockActual} {insumo.unidadMedida})
                                        </option>
                                    ))}
                                </select>
                                <div className="form-text">Solo se muestran insumos activos con stock.</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Indicaciones</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formulario.indicaciones}
                                    onChange={(e) => setFormulario((actual) => ({ ...actual, indicaciones: e.target.value }))}
                                    disabled={guardando}
                                />
                            </div>
                            <div className="col-12 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary" disabled={guardando}>
                                    {guardando ? 'Generando...' : 'Generar récipe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                    Récipes generados
                </div>
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div className="col-md-3">
                            <label className="form-label">Desde</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filtros.fechaDesde}
                                onChange={(e) => cambiarFiltro('fechaDesde', e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Hasta</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filtros.fechaHasta}
                                onChange={(e) => cambiarFiltro('fechaHasta', e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Médico</label>
                            <select
                                className="form-select"
                                value={filtros.medicoId}
                                onChange={(e) => cambiarFiltro('medicoId', e.target.value)}
                            >
                                <option value="">Todos</option>
                                {medicos.map((medico) => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Insumo</label>
                            <select
                                className="form-select"
                                value={filtros.insumoId}
                                onChange={(e) => cambiarFiltro('insumoId', e.target.value)}
                            >
                                <option value="">Todos</option>
                                {insumos.map((insumo) => (
                                    <option key={insumo.id} value={insumo.id}>
                                        {insumo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={limpiarFiltros}>
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-success" role="status" />
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="alert alert-info mb-0">Este paciente aun no tiene récipes con esos filtros.</div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Médico</th>
                                            <th>Especialidad</th>
                                            <th>Insumo</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recipesPagina.map((recipe) => (
                                            <tr key={recipe.id}>
                                                <td>{formatearFecha(recipe.fechaEmision)}</td>
                                                <td className="fw-medium">{recipe.medicoNombre}</td>
                                                <td>{recipe.especialidadMedico}</td>
                                                <td>{recipe.insumoNombre}</td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-end flex-wrap">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => descargarPdf(recipe)}
                                                            disabled={descargandoId === recipe.id}
                                                        >
                                                            {descargandoId === recipe.id ? 'Exportando...' : 'Exportar PDF'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between align-items-center gap-2 mt-3 flex-wrap">
                                <span className="text-muted small">Página {paginaActual}</span>
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={paginaActual === 1}
                                        onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={!hayMas}
                                        onClick={() => setPaginaActual((pagina) => pagina + 1)}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecipesPaciente
