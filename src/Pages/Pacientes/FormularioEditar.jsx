import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { actualizarPaciente } from '../../../features/pacientesSlice'
import { toast } from 'react-toastify'

const FormularioEditar = ({ paciente, onCerrar }) => {
    const dispatch = useDispatch()
    const { cargando } = useSelector(state => state.pacientes)

    const fechaDefault = paciente.fechaNacimiento
        ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0]
        : ''

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombreCompleto: paciente.nombreCompleto,
            numeroDocumento: paciente.numeroDocumento,
            usuarioEmail: paciente.usuarioEmail || '',
            fechaNacimiento: fechaDefault,
            telefono: paciente.telefono || '',
            direccion: paciente.direccion || '',
            patologia: paciente.patologia || '',
        }
    })

    const onSubmit = async (data) => {
        const resultado = await dispatch(actualizarPaciente({ id: paciente.id, datos: data }))
        if (actualizarPaciente.fulfilled.match(resultado)) {
            toast.success('Paciente actualizado correctamente')
            onCerrar()
        } else {
            toast.error(resultado.payload || 'Error al actualizar paciente')
        }
    }

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar paciente</h5>
                        <button type="button" className="btn-close" onClick={onCerrar} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label">Nombre completo *</label>
                                    <input
                                        className={`form-control ${errors.nombreCompleto ? 'is-invalid' : ''}`}
                                        {...register('nombreCompleto', {
                                            required: 'El nombre completo es obligatorio',
                                            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                                            maxLength: { value: 150, message: 'Máximo 150 caracteres' },
                                        })}
                                    />
                                    {errors.nombreCompleto && (
                                        <div className="invalid-feedback">{errors.nombreCompleto.message}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">N° de documento *</label>
                                    <input
                                        className={`form-control ${errors.numeroDocumento ? 'is-invalid' : ''}`}
                                        {...register('numeroDocumento', {
                                            required: 'El número de documento es obligatorio',
                                            pattern: { value: /^\d+$/, message: 'Solo se permiten números' },
                                            minLength: { value: 6, message: 'Mínimo 6 dígitos' },
                                            maxLength: { value: 15, message: 'Máximo 15 dígitos' },
                                        })}
                                    />
                                    {errors.numeroDocumento && (
                                        <div className="invalid-feedback">{errors.numeroDocumento.message}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.usuarioEmail ? 'is-invalid' : ''}`}
                                        {...register('usuarioEmail', {
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de email inválido' },
                                        })}
                                    />
                                    {errors.usuarioEmail && (
                                        <div className="invalid-feedback">{errors.usuarioEmail.message}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Fecha de nacimiento *</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                                        {...register('fechaNacimiento', {
                                            required: 'La fecha de nacimiento es obligatoria',
                                        })}
                                    />
                                    {errors.fechaNacimiento && (
                                        <div className="invalid-feedback">{errors.fechaNacimiento.message}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Teléfono *</label>
                                    <input
                                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                                        {...register('telefono', {
                                            required: 'El teléfono es obligatorio',
                                        })}
                                    />
                                    {errors.telefono && (
                                        <div className="invalid-feedback">{errors.telefono.message}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Dirección</label>
                                    <input
                                        className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                                        {...register('direccion', {
                                            maxLength: { value: 250, message: 'Máximo 250 caracteres' },
                                        })}
                                    />
                                    {errors.direccion && (
                                        <div className="invalid-feedback">{errors.direccion.message}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Patología</label>
                                    <textarea
                                        rows={3}
                                        className={`form-control ${errors.patologia ? 'is-invalid' : ''}`}
                                        {...register('patologia', {
                                            maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                                        })}
                                    />
                                    {errors.patologia && (
                                        <div className="invalid-feedback">{errors.patologia.message}</div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={cargando}>
                                {cargando ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default FormularioEditar
