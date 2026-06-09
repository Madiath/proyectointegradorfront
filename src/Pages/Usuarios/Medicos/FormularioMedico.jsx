import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { crearMedico } from '../../../../features/medicosSlice'
import { toast } from 'react-toastify'

const DIAS = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' },
]

const FormularioMedico = ({ onCerrar, onCreado }) => {
    const dispatch = useDispatch()
    const { cargando } = useSelector(state => state.medicos)
    const [errorServidor, setErrorServidor] = useState(null)

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: { horarios: [] }
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'horarios' })

    const onSubmit = async (data) => {
        setErrorServidor(null)
        const payload = {
            ...data,
            horarios: data.horarios.map(h => ({
                diaSemana: Number(h.diaSemana),
                horaDesde: h.horaDesde,
                horaHasta: h.horaHasta,
            }))
        }
        const resultado = await dispatch(crearMedico(payload))

        console.log(resultado.payload)

        if (crearMedico.fulfilled.match(resultado)) {
            toast.success('Médico registrado correctamente')
            onCreado()
        } else {
            setErrorServidor(resultado.payload)
        }
    }

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar médico</h5>
                        <button type="button" className="btn-close" onClick={onCerrar} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {errorServidor && (
                                <div className="alert alert-danger">
                                    {Array.isArray(errorServidor)
                                        ? errorServidor.map((e, i) => (
                                            <div key={i}>{e}</div>
                                        ))
                                        : errorServidor}
                                </div>
                            )} <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label">Nombre *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                                        maxLength={30}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Especialidad *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.especialidad ? 'is-invalid' : ''}`}
                                        placeholder="Ej: Cardiología, Pediatría..."
                                        {...register('especialidad', { required: 'La especialidad es obligatoria' })}
                                        maxLength={30}
                                    />
                                    {errors.especialidad && <div className="invalid-feedback">{errors.especialidad.message}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email', {
                                            required: 'El email es obligatorio',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de email inválido' },
                                        })}
                                        maxLength={30}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Contraseña *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        {...register('password', {
                                            required: 'La contraseña es obligatoria',
                                            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                                        })}
                                        maxLength={200}
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label mb-0">Horarios</label>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => append({ diaSemana: '1', horaDesde: '', horaHasta: '' })}
                                        >
                                            + Agregar horario
                                        </button>
                                    </div>

                                    {fields.length === 0 && (
                                        <p className="text-muted small">Sin horarios asignados.</p>
                                    )}

                                    {fields.map((field, index) => (
                                        <div key={field.id} className="border rounded p-2 mb-2">
                                            <div className="row g-2 align-items-end">
                                                <div className="col-md-4">
                                                    <label className="form-label small">Día *</label>
                                                    <select
                                                        className={`form-select form-select-sm ${errors.horarios?.[index]?.diaSemana ? 'is-invalid' : ''}`}
                                                        {...register(`horarios.${index}.diaSemana`, { required: 'Requerido' })}
                                                    >
                                                        {DIAS.map(d => (
                                                            <option key={d.value} value={d.value}>{d.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small">Desde *</label>
                                                    <input
                                                        type="time"
                                                        className={`form-control form-control-sm ${errors.horarios?.[index]?.horaDesde ? 'is-invalid' : ''}`}
                                                        {...register(`horarios.${index}.horaDesde`, { required: 'Requerido' })}
                                                    />
                                                    {errors.horarios?.[index]?.horaDesde && (
                                                        <div className="invalid-feedback">{errors.horarios[index].horaDesde.message}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small">Hasta *</label>
                                                    <input
                                                        type="time"
                                                        className={`form-control form-control-sm ${errors.horarios?.[index]?.horaHasta ? 'is-invalid' : ''}`}
                                                        {...register(`horarios.${index}.horaHasta`, { required: 'Requerido' })}
                                                    />
                                                    {errors.horarios?.[index]?.horaHasta && (
                                                        <div className="invalid-feedback">{errors.horarios[index].horaHasta.message}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => remove(index)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success" disabled={cargando}>
                                {cargando ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioMedico
