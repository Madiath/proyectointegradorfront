import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listarInsumos, altaInsumo, editarInsumo, eliminarInsumo, registrarMovimiento } from '../src/Services/insumoService'

export const fetchInsumos = createAsyncThunk(
    'insumos/fetchInsumos',
    async ({ pagina, tamano }, { rejectWithValue }) => {
        try {
            const res = await listarInsumos(pagina, tamano)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar insumos')
        }
    }
)

export const crearInsumo = createAsyncThunk(
    'insumos/crearInsumo',
    async (datos, { rejectWithValue }) => {
        try {
            const res = await altaInsumo(datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al registrar insumo')
        }
    }
)

export const actualizarInsumo = createAsyncThunk(
    'insumos/actualizarInsumo',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            const res = await editarInsumo(id, datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al actualizar insumo')
        }
    }
)

export const deshabilitarInsumo = createAsyncThunk(
    'insumos/deshabilitarInsumo',
    async (id, { rejectWithValue }) => {
        try {
            await eliminarInsumo(id)
            return id
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al deshabilitar insumo')
        }
    }
)

export const crearMovimiento = createAsyncThunk(
    'insumos/crearMovimiento',
    async (datos, { rejectWithValue }) => {
        try {
            const res = await registrarMovimiento(datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al registrar movimiento')
        }
    }
)

const insumosSlice = createSlice({
    name: 'insumos',
    initialState: {
        lista: [],
        hayMas: false,
        cargando: false,
        error: null,
        pagina: 1,
        tamano: 10,
    },
    reducers: {
        setPaginaInsumos(state, action) {
            state.pagina = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInsumos.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchInsumos.fulfilled, (state, action) => {
                state.cargando = false
                state.hayMas = action.payload.length > state.tamano
                state.lista = action.payload.slice(0, state.tamano)
            })
            .addCase(fetchInsumos.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(crearInsumo.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(crearInsumo.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(crearInsumo.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(actualizarInsumo.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(actualizarInsumo.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(actualizarInsumo.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(deshabilitarInsumo.fulfilled, (state, action) => {
                state.lista = state.lista.filter(i => i.id !== action.payload)
            })
            .addCase(crearMovimiento.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(crearMovimiento.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(crearMovimiento.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
    },
})

export const { setPaginaInsumos } = insumosSlice.actions
export default insumosSlice.reducer
