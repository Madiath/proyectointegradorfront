import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { crearInsumo, fetchInsumos } from '../../../features/insumosSlice'
import { toast } from 'react-toastify'

const FormularioInsumo = ({ onCerrar }) => {
    const dispatch = useDispatch()
    const { tamano } = useSelector(state => state.insumos)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

    const onSubmit = async (data) => {
        const payload = {
            nombre: data.nombre,
            descripcion: data.descripcion || '',
            categoria: data.categoria,
            unidadMedida: data.unidadMedida,
            stockInicial: Number(data.stockInicial) || 0,
            stockMinimo: Number(data.stockMinimo) || 0,
        }

        const res = await dispatch(crearInsumo(payload))
        if (crearInsumo.fulfilled.match(res)) {
            toast.success('Insumo registrado correctamente')
            dispatch(fetchInsumos({ pagina: 1, tamano }))
            onCerrar()
        } else {
            toast.error(res.payload || 'Error al registrar insumo')
        }
    }

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Insumo</h5>
                        <button type="button" className="btn-close" onClick={onCerrar} />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nombre *</label>
                                <input
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                    {...register('nombre', { required: 'El nombre es obligatorio' })}
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <input className="form-control" {...register('descripcion')} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Categoría *</label>
                                <input
                                    className={`form-control ${errors.categoria ? 'is-invalid' : ''}`}
                                    placeholder="Ej: Pastillas, Jeringas, Cremas..."
                                    {...register('categoria', { required: 'La categoría es obligatoria' })}
                                />
                                {errors.categoria && <div className="invalid-feedback">{errors.categoria.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Unidad de medida *</label>
                                <input
                                    className={`form-control ${errors.unidadMedida ? 'is-invalid' : ''}`}
                                    placeholder="Ej: Unidades, ml, mg, Cajas..."
                                    {...register('unidadMedida', { required: 'La unidad de medida es obligatoria' })}
                                />
                                {errors.unidadMedida && <div className="invalid-feedback">{errors.unidadMedida.message}</div>}
                            </div>

                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Stock inicial</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`form-control ${errors.stockInicial ? 'is-invalid' : ''}`}
                                        defaultValue={0}
                                        {...register('stockInicial', { min: { value: 0, message: 'No puede ser negativo' } })}
                                    />
                                    {errors.stockInicial && <div className="invalid-feedback">{errors.stockInicial.message}</div>}
                                </div>

                                <div className="col-6 mb-3">
                                    <label className="form-label">Stock mínimo</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`form-control ${errors.stockMinimo ? 'is-invalid' : ''}`}
                                        defaultValue={0}
                                        {...register('stockMinimo', { min: { value: 0, message: 'No puede ser negativo' } })}
                                    />
                                    {errors.stockMinimo && <div className="invalid-feedback">{errors.stockMinimo.message}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
                            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioInsumo
