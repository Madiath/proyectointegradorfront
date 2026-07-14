import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
    crearRecipe,
    exportarRecipePdf,
    listarInsumosRecipeDisponibles,
    listarRecipesPaciente
} from '../../Services/recipeMedicoService'

const recipesPorPagina = 5
const crearItemVacio = () => ({
    insumoId: '',
    nombreInsumoManual: '',
    descripcion: '',
    indicaciones: ''
})

const RecipesPaciente = () => {
    const { id } = useParams()
    const rol = localStorage.getItem('rol')
    const usuario = localStorage.getItem('usuario')
    const puedeGestionar = rol === 'Admin' || rol === 'Medico'
    const puedeCrear = rol === 'Medico'

    const [recipes, setRecipes] = useState([])
    const [insumos, setInsumos] = useState([])
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [descargandoId, setDescargandoId] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [errorInsumos, setErrorInsumos] = useState('')
    const [errorMedico, setErrorMedico] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [filtros, setFiltros] = useState({
        fechaDesde: '',
        fechaHasta: '',
        insumoId: ''
    })
    const [itemsFormulario, setItemsFormulario] = useState([crearItemVacio()])

    const cargarInsumos = useCallback(async () => {
        if (!puedeGestionar) return

        setErrorInsumos('')
        try {
            const insumosResp = await listarInsumosRecipeDisponibles()
            setInsumos(Array.isArray(insumosResp) ? insumosResp : insumosResp?.data || [])
        } catch {
            setInsumos([])
            setErrorInsumos('No se pudieron cargar los insumos.')
        }
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
                insumoId: filtros.insumoId || undefined
            })

            setRecipes(data)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudieron cargar los recipes.')
        } finally {
            setLoading(false)
        }
    }, [id, paginaActual, filtros])

    useEffect(() => {
        cargarInsumos()
    }, [cargarInsumos])

    useEffect(() => {
        if (puedeCrear && !usuario) {
            setErrorMedico('No se pudo obtener el medico logueado.')
            return
        }

        setErrorMedico('')
    }, [puedeCrear, usuario])

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
        setFiltros({ fechaDesde: '', fechaHasta: '', insumoId: '' })
        setPaginaActual(1)
    }

    const actualizarItem = (index, campo, valor) => {
        setItemsFormulario((actual) => actual.map((item, i) => (
            i === index ? { ...item, [campo]: valor } : item
        )))
    }

    const seleccionarInsumo = (index, insumoId) => {
        const insumo = insumos.find((actual) => actual.id === Number(insumoId))
        setItemsFormulario((actual) => actual.map((item, i) => {
            if (i !== index) return item

            return {
                ...item,
                insumoId,
                nombreInsumoManual: insumoId ? '' : item.nombreInsumoManual,
                descripcion: insumo?.descripcion || item.descripcion
            }
        }))
    }

    const agregarItem = () => {
        setItemsFormulario((actual) => [...actual, crearItemVacio()])
    }

    const eliminarItem = (index) => {
        setItemsFormulario((actual) => actual.length === 1
            ? [crearItemVacio()]
            : actual.filter((_, i) => i !== index))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMensaje('')
        setError('')

        if (!puedeCrear) {
            setError('Solo un medico autenticado puede generar recipes.')
            return
        }

        if (itemsFormulario.length === 0) {
            setError('Agregue al menos un medicamento.')
            return
        }

        const items = itemsFormulario.map((item) => ({
            insumoId: item.insumoId ? Number(item.insumoId) : null,
            nombreInsumoManual: item.nombreInsumoManual.trim(),
            descripcion: item.descripcion.trim(),
            indicaciones: item.indicaciones.trim()
        }))

        if (items.some((item) => !item.insumoId && !item.nombreInsumoManual)) {
            setError('Cada medicamento debe tener un insumo seleccionado o un nombre manual.')
            return
        }

        if (items.some((item) => !item.indicaciones)) {
            setError('Ingrese las indicaciones de uso para cada medicamento.')
            return
        }

        setGuardando(true)
        try {
            await crearRecipe({
                pacienteId: Number(id),
                items
            })

            setItemsFormulario([crearItemVacio()])
            setMensaje('Recipe generado correctamente.')
            setPaginaActual(1)
            await cargarRecipes()
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo generar el recipe.')
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
                    <h2 className="mb-1">Recipes del paciente</h2>
                    <p className="text-muted mb-0">Indicaciones emitidas y exportacion para firma manual.</p>
                </div>
                <Link to={`/pacientes/${id}`} className="btn btn-outline-secondary">
                    Volver al paciente
                </Link>
            </div>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {errorInsumos && <div className="alert alert-warning">{errorInsumos}</div>}
            {errorMedico && <div className="alert alert-warning">{errorMedico}</div>}

            {puedeCrear && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                        Nuevo recipe
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label">Medico responsable</label>
                                <div className="form-control bg-light">{usuario || 'Medico logueado'}</div>
                            </div>
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                                    <h5 className="mb-0">Medicamentos indicados</h5>
                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={agregarItem} disabled={guardando}>
                                        Agregar medicamento
                                    </button>
                                </div>
                                <div className="d-flex flex-column gap-3">
                                    {itemsFormulario.map((item, index) => (
                                        <div className="border rounded p-3" key={index}>
                                            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                                                <span className="fw-semibold">Medicamento {index + 1}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarItem(index)}
                                                    disabled={guardando}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Insumo existente</label>
                                                    <select
                                                        className="form-select"
                                                        value={item.insumoId}
                                                        onChange={(e) => seleccionarInsumo(index, e.target.value)}
                                                        disabled={guardando}
                                                    >
                                                        <option value="">Sin seleccionar</option>
                                                        {insumos.map((insumo) => (
                                                            <option key={insumo.id} value={insumo.id}>
                                                                {insumo.nombre} ({insumo.stockActual} {insumo.unidadMedida})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="form-text">Si no esta en la lista, escriba el nombre manualmente.</div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Nombre manual</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.nombreInsumoManual}
                                                        onChange={(e) => actualizarItem(index, 'nombreInsumoManual', e.target.value)}
                                                        disabled={guardando || Boolean(item.insumoId)}
                                                        placeholder="Ej: Medicamento escrito manualmente"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Descripcion</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={item.descripcion}
                                                        onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                                                        disabled={guardando}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Indicaciones de uso</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={item.indicaciones}
                                                        onChange={(e) => actualizarItem(index, 'indicaciones', e.target.value)}
                                                        disabled={guardando}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary" disabled={guardando}>
                                    {guardando ? 'Generando...' : 'Generar recipe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                    Recipes generados
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
                        <div className="alert alert-info mb-0">Este paciente aun no tiene recipes con esos filtros.</div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Medico</th>
                                            <th>Especialidad</th>
                                            <th>Medicamentos</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recipesPagina.map((recipe) => (
                                            <tr key={recipe.id}>
                                                <td>{formatearFecha(recipe.fechaEmision)}</td>
                                                <td className="fw-medium">{recipe.medicoNombre}</td>
                                                <td>{recipe.especialidadMedico}</td>
                                                <td>{recipe.insumosResumen || recipe.insumoNombre}</td>
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
                                <span className="text-muted small">Pagina {paginaActual}</span>
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
