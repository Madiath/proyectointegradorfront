import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { crearMovimiento, fetchInsumos } from '../../../features/insumosSlice'
import { toast } from 'react-toastify'

const FormularioMovimiento = ({ tipo, insumos, insumoIdInicial, onCerrar }) => {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { insumoId: insumoIdInicial ?? '' }
    })

    const esEntrada = tipo === 'ENTRADA'
    const titulo = esEntrada ? 'Registrar Entrada' : 'Registrar Salida'
    const colorBtn = esEntrada ? 'btn-success' : 'btn-danger'

    const onSubmit = async (data) => {
        const payload = {
            insumoId: Number(data.insumoId),
            tipo,
            cantidad: Number(data.cantidad),
            motivo: data.motivo || '',
        }

        const res = await dispatch(crearMovimiento(payload))
        if (crearMovimiento.fulfilled.match(res)) {
            toast.success(`${tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada correctamente`)
            dispatch(fetchInsumos())
            onCerrar()
        } else {
            toast.error(res.payload || 'Error al registrar movimiento')
        }
    }

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{titulo}</h5>
                        <button type="button" className="btn-close" onClick={onCerrar} />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Insumo *</label>
                                <select
                                    className={`form-select ${errors.insumoId ? 'is-invalid' : ''}`}
                                    {...register('insumoId', { required: 'Seleccioná un insumo' })}
                                >
                                    <option value="">— Seleccionar —</option>
                                    {insumos.map(i => (
                                        <option key={i.id} value={i.id}>
                                            {i.nombre} (stock: {i.stockActual} {i.unidadMedida})
                                        </option>
                                    ))}
                                </select>
                                {errors.insumoId && <div className="invalid-feedback">{errors.insumoId.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Cantidad *</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                                    {...register('cantidad', {
                                        required: 'La cantidad es obligatoria',
                                        min: { value: 1, message: 'Debe ser mayor a cero' }
                                    })}
                                />
                                {errors.cantidad && <div className="invalid-feedback">{errors.cantidad.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Motivo</label>
                                <input
                                    className="form-control"
                                    placeholder="Opcional"
                                    {...register('motivo')}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
                            <button type="submit" className={`btn ${colorBtn}`} disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Confirmar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioMovimiento
