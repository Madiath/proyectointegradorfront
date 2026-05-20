import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { crearUsuario } from '../../../features/usuariosSlice'
import { toast } from 'react-toastify'

const FormularioUsuario = ({ onCerrar, onCreado }) => {
    const dispatch = useDispatch()
    const { cargando } = useSelector(state => state.usuarios)
    const [errorServidor, setErrorServidor] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        setErrorServidor(null)
        const resultado = await dispatch(crearUsuario(data))
        if (crearUsuario.fulfilled.match(resultado)) {
            toast.success('Administrador registrado correctamente')
            onCreado()
        } else {
            setErrorServidor(resultado.payload || 'Error al registrar administrador')
        }
    }

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar administrador</h5>
                        <button type="button" className="btn-close" onClick={onCerrar} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {errorServidor && (
                                <div className="alert alert-danger">{errorServidor}</div>
                            )}
                            <div className="row g-3">

                                <div className="col-12">
                                    <label className="form-label">Nombre *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                                </div>

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
                                    <label className="form-label">Contraseña *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        {...register('password', {
                                            required: 'La contraseña es obligatoria',
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

export default FormularioUsuario
