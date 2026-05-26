import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { actualizarInsumo, fetchInsumos } from '../../../features/insumosSlice'
import { toast } from 'react-toastify'

const FormularioEditarInsumo = ({ insumo, onCerrar }) => {
    const dispatch = useDispatch()
    const { pagina, tamano } = useSelector(state => state.insumos)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            nombre: insumo.nombre,
            categoria: insumo.categoria,
            unidadMedida: insumo.unidadMedida,
            stockMinimo: insumo.stockMinimo,
        }
    })

    const onSubmit = async (data) => {
        const payload = {
            nombre: data.nombre,
            categoria: data.categoria,
            unidadMedida: data.unidadMedida,
            stockMinimo: Number(data.stockMinimo),
        }

        const res = await dispatch(actualizarInsumo({ id: insumo.id, datos: payload }))
        if (actualizarInsumo.fulfilled.match(res)) {
            toast.success('Insumo actualizado correctamente')
            dispatch(fetchInsumos({ pagina, tamano }))
            onCerrar()
        } else {
            toast.error(res.payload || 'Error al actualizar insumo')
        }
    }

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Insumo</h5>
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
                                <label className="form-label">Categoría *</label>
                                <input
                                    className={`form-control ${errors.categoria ? 'is-invalid' : ''}`}
                                    {...register('categoria', { required: 'La categoría es obligatoria' })}
                                />
                                {errors.categoria && <div className="invalid-feedback">{errors.categoria.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Unidad de medida *</label>
                                <input
                                    className={`form-control ${errors.unidadMedida ? 'is-invalid' : ''}`}
                                    {...register('unidadMedida', { required: 'La unidad de medida es obligatoria' })}
                                />
                                {errors.unidadMedida && <div className="invalid-feedback">{errors.unidadMedida.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Stock mínimo</label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`form-control ${errors.stockMinimo ? 'is-invalid' : ''}`}
                                    {...register('stockMinimo', { min: { value: 0, message: 'No puede ser negativo' } })}
                                />
                                {errors.stockMinimo && <div className="invalid-feedback">{errors.stockMinimo.message}</div>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioEditarInsumo
