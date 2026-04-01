import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { actualizarUsuario } from '../../../features/usuariosSlice'
import { toast } from 'react-toastify'

const FormularioEditarUsuario = ({ usuario, onCerrar }) => {
    const dispatch = useDispatch()
    const { cargando } = useSelector(state => state.usuarios)
    const [errorServidor, setErrorServidor] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: usuario.email,
            password: '',
        }
    })

    const onSubmit = async (data) => {
        setErrorServidor(null)
        const payload = { email: data.email }
        if (data.password) payload.password = data.password

        const resultado = await dispatch(actualizarUsuario({ id: usuario.id, datos: payload }))
        if (actualizarUsuario.fulfilled.match(resultado)) {
            toast.success('Usuario actualizado correctamente')
            onCerrar()
        } else {
            setErrorServidor(resultado.payload || 'Error al actualizar usuario')
        }
    }

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar usuario</h5>
                        <button type="button" className="btn-close" onClick={onCerrar} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {errorServidor && (
                                <div className="alert alert-danger">{errorServidor}</div>
                            )}
                            <div className="row g-3">

                                <div className="col-12">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email', {
                                            required: 'El email es obligatorio',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de email inválido' },
                                        })}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Nueva contraseña <span className="text-muted">(dejar vacío para no cambiar)</span></label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        {...register('password', {
                                            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                                        })}
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
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

export default FormularioEditarUsuario
