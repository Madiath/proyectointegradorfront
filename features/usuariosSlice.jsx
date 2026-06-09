import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listarUsuarios, getUsuario, altaUsuario, editarUsuario, eliminarUsuario } from '../src/Services/usuarioService'

export const fetchUsuarios = createAsyncThunk(
    'usuarios/fetchUsuarios',
    async ({ pagina, tamano }, { rejectWithValue }) => {
        try {
            const res = await listarUsuarios(pagina, tamano)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar usuarios')
        }
    }
)

export const fetchDetalleUsuario = createAsyncThunk(
    'usuarios/fetchDetalleUsuario',
    async (id, { rejectWithValue }) => {
        try {
            const res = await getUsuario(id)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar el usuario')
        }
    }
)
export const crearUsuario = createAsyncThunk(
    'usuarios/crearUsuario',
    async (datos, { rejectWithValue }) => {
        try {
            const res = await altaUsuario(datos)
            return res.data
        } catch (err) {

            const data = err.response?.data

            if (data?.errors) {
                const errores = Object.values(data.errors).flat()
                return rejectWithValue(errores)
            }

            return rejectWithValue(
                data?.mensaje || 'Error al registrar administrador'
            )
        }
    }
)

export const actualizarUsuario = createAsyncThunk(
    'usuarios/actualizarUsuario',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            const res = await editarUsuario(id, datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al actualizar usuario')
        }
    }
)

export const deshabilitarUsuario = createAsyncThunk(
    'usuarios/deshabilitarUsuario',
    async (id, { rejectWithValue }) => {
        try {
            const res = await eliminarUsuario(id)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al eliminar usuario')
        }
    }
)

const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState: {
        lista: [],
        hayMas: false,
        detalle: null,
        cargando: false,
        cargandoDetalle: false,
        error: null,
        pagina: 1,
        tamano: 10,
    },
    reducers: {
        setPagina(state, action) {
            state.pagina = action.payload
        },
        limpiarDetalle(state) {
            state.detalle = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.cargando = false
                state.hayMas = action.payload.length > state.tamano
                state.lista = action.payload.slice(0, state.tamano)
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(fetchDetalleUsuario.pending, (state) => {
                state.cargandoDetalle = true
                state.error = null
                state.detalle = null
            })
            .addCase(fetchDetalleUsuario.fulfilled, (state, action) => {
                state.cargandoDetalle = false
                state.detalle = action.payload
            })
            .addCase(fetchDetalleUsuario.rejected, (state, action) => {
                state.cargandoDetalle = false
                state.error = action.payload
            })
            .addCase(crearUsuario.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(crearUsuario.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(crearUsuario.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(actualizarUsuario.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(actualizarUsuario.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(actualizarUsuario.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
    },
})

export const { setPagina, limpiarDetalle } = usuariosSlice.actions
export default usuariosSlice.reducer
