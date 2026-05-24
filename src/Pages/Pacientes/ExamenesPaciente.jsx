import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
    descargarArchivoExamen,
    eliminarExamenPaciente,
    listarExamenesPaciente,
    subirExamenPaciente
} from '../../Services/examenPacienteService'

const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']

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

    const cargarExamenes = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await listarExamenesPaciente(id)
            setExamenes(data)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudieron cargar los exámenes.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarExamenes()
    }, [id])

    const validarArchivo = (file) => {
        if (!file) return 'Debe seleccionar un archivo.'

        const extension = file.name.split('.').pop()?.toLowerCase()
        if (!extensionesPermitidas.includes(extension)) {
            return 'Formato no permitido. Use PDF, JPG, JPEG, PNG, DOC, DOCX, XLS o XLSX.'
        }

        return ''
    }

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

    const handleEliminar = async (examenId) => {
        const confirmado = window.confirm('¿Seguro que quiere eliminar este examen?')
        if (!confirmado) return

        setError('')
        setMensaje('')
        try {
            await eliminarExamenPaciente(examenId)
            setMensaje('Examen eliminado correctamente.')
            await cargarExamenes()
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo eliminar el examen.')
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
                    <h2 className="mb-1">Exámenes del paciente</h2>
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
                    Exámenes cargados
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-success" role="status" />
                        </div>
                    ) : examenes.length === 0 ? (
                        <div className="alert alert-info mb-0">Este paciente aún no tiene exámenes cargados.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Fecha de carga</th>
                                        <th>Archivo original</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examenes.map((examen) => (
                                        <tr key={examen.id}>
                                            <td className="fw-medium">{examen.nombre}</td>
                                            <td>{formatearFecha(examen.fechaCarga)}</td>
                                            <td>{examen.nombreArchivoOriginal}</td>
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
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleEliminar(examen.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ExamenesPaciente
