import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
    descargarArchivoExamen,
    editarExamenPaciente,
    eliminarExamenPaciente,
    listarExamenesPaciente,
    subirExamenPaciente
} from '../../Services/examenPacienteService'

const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']
const tamanioMaximoBytes = 20 * 1024 * 1024
const examenesPorPagina = 5

const obtenerExtension = (nombreArchivo = '') =>
    nombreArchivo.includes('.') ? nombreArchivo.split('.').pop().toLowerCase() : ''

const ExamenesPaciente = () => {
    const { id } = useParams()
    const rol = localStorage.getItem('rol')
    const puedeGestionar = rol === 'Admin' || rol === 'Medico'

    const [examenes, setExamenes] = useState([])
    const [nombre, setNombre] = useState('')
    const [archivo, setArchivo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subiendo, setSubiendo] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [filtroExtension, setFiltroExtension] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [examenAEliminar, setExamenAEliminar] = useState(null)
    const [motivoEliminacion, setMotivoEliminacion] = useState('')
    const [errorMotivo, setErrorMotivo] = useState('')
    const [eliminando, setEliminando] = useState(false)
    const [examenAEditar, setExamenAEditar] = useState(null)
    const [nombreEdicion, setNombreEdicion] = useState('')
    const [archivoEdicion, setArchivoEdicion] = useState(null)
    const [errorEdicion, setErrorEdicion] = useState('')
    const [editando, setEditando] = useState(false)

    const cargarExamenes = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await listarExamenesPaciente(id)
            setExamenes(data)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudieron cargar los examenes.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarExamenes()
    }, [id])

    useEffect(() => {
        setPaginaActual(1)
    }, [busqueda, filtroExtension])

    const validarArchivo = (file, obligatorio = true) => {
        if (!file) return obligatorio ? 'Debe seleccionar un archivo.' : ''

        if (file.size > tamanioMaximoBytes) {
            return 'El archivo no puede superar los 20 MB.'
        }

        const extension = obtenerExtension(file.name)
        if (!extensionesPermitidas.includes(extension)) {
            return 'Formato no permitido. Use PDF, JPG, JPEG, PNG, DOC, DOCX, XLS o XLSX.'
        }

        return ''
    }

    const extensionesDisponibles = useMemo(() => {
        const extensiones = examenes
            .map((examen) => obtenerExtension(examen.nombreArchivoOriginal))
            .filter(Boolean)

        return [...new Set(extensiones)].sort()
    }, [examenes])

    const examenesFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase()

        return examenes.filter((examen) => {
            const coincideNombre = !texto || examen.nombre.toLowerCase().includes(texto)
            const extension = obtenerExtension(examen.nombreArchivoOriginal)
            const coincideExtension = !filtroExtension || extension === filtroExtension

            return coincideNombre && coincideExtension
        })
    }, [examenes, busqueda, filtroExtension])

    const totalPaginas = Math.max(1, Math.ceil(examenesFiltrados.length / examenesPorPagina))
    const paginaSegura = Math.min(paginaActual, totalPaginas)
    const inicioPagina = (paginaSegura - 1) * examenesPorPagina
    const examenesPagina = examenesFiltrados.slice(inicioPagina, inicioPagina + examenesPorPagina)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMensaje('')
        setError('')

        if (!nombre.trim()) {
            setError('Ingrese un nombre para el examen.')
            return
        }

        const errorArchivo = validarArchivo(archivo)
        if (errorArchivo) {
            setError(errorArchivo)
            return
        }

        setSubiendo(true)
        try {
            await subirExamenPaciente(id, nombre.trim(), archivo)
            setNombre('')
            setArchivo(null)
            event.target.reset()
            setMensaje('Examen guardado correctamente.')
            await cargarExamenes()
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo guardar el examen.')
        } finally {
            setSubiendo(false)
        }
    }

    const abrirArchivo = async (examen, descargar = false) => {
        setError('')
        try {
            const blob = await descargarArchivoExamen(examen.id)
            const url = window.URL.createObjectURL(blob)

            if (descargar) {
                const link = document.createElement('a')
                link.href = url
                link.download = examen.nombreArchivoOriginal
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)
                return
            }

            window.open(url, '_blank', 'noopener,noreferrer')
            setTimeout(() => window.URL.revokeObjectURL(url), 60000)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo abrir el archivo.')
        }
    }

    const abrirModalEliminar = (examen) => {
        setExamenAEliminar(examen)
        setMotivoEliminacion('')
        setErrorMotivo('')
        setMensaje('')
        setError('')
    }

    const confirmarEliminar = async () => {
        if (!motivoEliminacion.trim()) {
            setErrorMotivo('Ingrese un motivo de eliminacion.')
            return
        }

        setEliminando(true)
        setErrorMotivo('')
        try {
            await eliminarExamenPaciente(examenAEliminar.id, motivoEliminacion.trim())
            setExamenAEliminar(null)
            setMotivoEliminacion('')
            setMensaje('Examen eliminado correctamente.')
            await cargarExamenes()
        } catch (err) {
            setErrorMotivo(err.response?.data?.mensaje || 'No se pudo eliminar el examen.')
        } finally {
            setEliminando(false)
        }
    }

    const abrirModalEditar = (examen) => {
        setExamenAEditar(examen)
        setNombreEdicion(examen.nombre)
        setArchivoEdicion(null)
        setErrorEdicion('')
        setMensaje('')
        setError('')
    }

    const confirmarEdicion = async (event) => {
        event.preventDefault()

        if (!nombreEdicion.trim()) {
            setErrorEdicion('Ingrese un nombre para el examen.')
            return
        }

        const errorArchivo = validarArchivo(archivoEdicion, false)
        if (errorArchivo) {
            setErrorEdicion(errorArchivo)
            return
        }

        setEditando(true)
        setErrorEdicion('')
        try {
            await editarExamenPaciente(examenAEditar.id, nombreEdicion.trim(), archivoEdicion)
            setExamenAEditar(null)
            setArchivoEdicion(null)
            setMensaje('Examen actualizado correctamente.')
            await cargarExamenes()
        } catch (err) {
            setErrorEdicion(err.response?.data?.mensaje || 'No se pudo actualizar el examen.')
        } finally {
            setEditando(false)
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
                    <h2 className="mb-1">Examenes del paciente</h2>
                    <p className="text-muted mb-0">Estudios y documentos asociados al paciente.</p>
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
                        Nuevo examen
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label">Nombre del examen</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    disabled={subiendo}
                                />
                            </div>
                            <div className="col-md-5">
                                <label className="form-label">Archivo</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                                    disabled={subiendo}
                                />
                                <div className="form-text">Maximo 20 MB. Formatos: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX.</div>
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100" disabled={subiendo}>
                                    {subiendo ? 'Guardando...' : 'Guardar examen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header fw-semibold" style={{ backgroundColor: '#f0f0f0' }}>
                    Examenes cargados
                </div>
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div className="col-md-8">
                            <label className="form-label">Buscar por nombre</label>
                            <input
                                type="search"
                                className="form-control"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Nombre del examen o documento"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Tipo de archivo</label>
                            <select
                                className="form-select"
                                value={filtroExtension}
                                onChange={(e) => setFiltroExtension(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {extensionesDisponibles.map((extension) => (
                                    <option key={extension} value={extension}>
                                        {extension.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-success" role="status" />
                        </div>
                    ) : examenes.length === 0 ? (
                        <div className="alert alert-info mb-0">Este paciente aun no tiene examenes cargados.</div>
                    ) : examenesFiltrados.length === 0 ? (
                        <div className="alert alert-info mb-0">No se encontraron examenes con esos filtros.</div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Fecha de carga</th>
                                            <th>Archivo original</th>
                                            <th>Tipo</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examenesPagina.map((examen) => (
                                            <tr key={examen.id}>
                                                <td className="fw-medium">{examen.nombre}</td>
                                                <td>{formatearFecha(examen.fechaCarga)}</td>
                                                <td>{examen.nombreArchivoOriginal}</td>
                                                <td>{obtenerExtension(examen.nombreArchivoOriginal).toUpperCase() || '-'}</td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-end flex-wrap">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => abrirArchivo(examen)}
                                                        >
                                                            Ver archivo
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => abrirArchivo(examen, true)}
                                                        >
                                                            Descargar
                                                        </button>
                                                        {puedeGestionar && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-warning"
                                                                    onClick={() => abrirModalEditar(examen)}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => abrirModalEliminar(examen)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between align-items-center gap-2 mt-3 flex-wrap">
                                <span className="text-muted small">
                                    Mostrando {inicioPagina + 1}-{Math.min(inicioPagina + examenesPorPagina, examenesFiltrados.length)} de {examenesFiltrados.length}
                                </span>
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={paginaSegura === 1}
                                        onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                                    >
                                        Anterior
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
                                        {paginaSegura} / {totalPaginas}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={paginaSegura === totalPaginas}
                                        onClick={() => setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {examenAEliminar && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar examen</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setExamenAEliminar(null)}
                                    disabled={eliminando}
                                />
                            </div>
                            <div className="modal-body">
                                <p className="mb-2">
                                    Confirme la eliminacion logica de <strong>{examenAEliminar.nombre}</strong>.
                                </p>
                                <label className="form-label">Motivo de eliminacion *</label>
                                <textarea
                                    className={`form-control ${errorMotivo ? 'is-invalid' : ''}`}
                                    rows="3"
                                    value={motivoEliminacion}
                                    onChange={(e) => setMotivoEliminacion(e.target.value)}
                                    disabled={eliminando}
                                />
                                {errorMotivo && <div className="invalid-feedback d-block">{errorMotivo}</div>}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setExamenAEliminar(null)}
                                    disabled={eliminando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmarEliminar}
                                    disabled={eliminando}
                                >
                                    {eliminando ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {examenAEditar && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={confirmarEdicion}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar examen</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setExamenAEditar(null)}
                                        disabled={editando}
                                    />
                                </div>
                                <div className="modal-body">
                                    {errorEdicion && <div className="alert alert-danger">{errorEdicion}</div>}
                                    <div className="mb-3">
                                        <label className="form-label">Nombre del examen</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombreEdicion}
                                            onChange={(e) => setNombreEdicion(e.target.value)}
                                            disabled={editando}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Reemplazar archivo</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                            onChange={(e) => setArchivoEdicion(e.target.files?.[0] || null)}
                                            disabled={editando}
                                        />
                                        <div className="form-text">
                                            Archivo actual: {examenAEditar.nombreArchivoOriginal}. Si no selecciona uno nuevo, se conserva el existente.
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setExamenAEditar(null)}
                                        disabled={editando}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={editando}>
                                        {editando ? 'Guardando...' : 'Guardar cambios'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExamenesPaciente
