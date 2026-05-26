import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listarInsumos, altaInsumo, registrarMovimiento } from '../src/Services/insumoService'

export const fetchInsumos = createAsyncThunk(
    'insumos/fetchInsumos',
    async (_, { rejectWithValue }) => {
        try {
            const res = await listarInsumos()
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
        cargando: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInsumos.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchInsumos.fulfilled, (state, action) => {
                state.cargando = false
                state.lista = action.payload
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

export default insumosSlice.reducer
