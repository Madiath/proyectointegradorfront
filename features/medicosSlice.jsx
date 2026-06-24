import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listarMedicos, getMedico, altaMedico, editarMedico, eliminarMedico } from '../src/Services/medicoService'

export const fetchMedicos = createAsyncThunk(
    'medicos/fetchMedicos',
    async ({ pagina, tamano, busqueda = '' }, { rejectWithValue }) => {
        try {
            const res = await listarMedicos(pagina, tamano, busqueda)
            return { datos: res.data, buscando: Boolean(busqueda?.trim()) }
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar médicos')
        }
    }
)

export const fetchDetalleMedico = createAsyncThunk(
    'medicos/fetchDetalleMedico',
    async (id, { rejectWithValue }) => {
        try {
            const res = await getMedico(id)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar el médico')
        }
    }
)

export const crearMedico = createAsyncThunk(
    'medicos/crearMedico',
    async (datos, { rejectWithValue }) => {
        try {
            const res = await altaMedico(datos)
            return res.data
        } catch (err) {

            const data = err.response?.data

            if (data?.errors) {
                const errores = Object.values(data.errors).flat()
                return rejectWithValue(errores)
            }

            return rejectWithValue(
                data?.mensaje || 'Error al registrar médico'
            )
        }
    }
)

export const actualizarMedico = createAsyncThunk(
    'medicos/actualizarMedico',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            const res = await editarMedico(id, datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al actualizar médico')
        }
    }
)

export const deshabilitarMedico = createAsyncThunk(
    'medicos/deshabilitarMedico',
    async (id, { rejectWithValue }) => {
        try {
            await eliminarMedico(id)
            return id
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al eliminar médico')
        }
    }
)

const medicosSlice = createSlice({
    name: 'medicos',
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
        setPaginaMedicos(state, action) {
            state.pagina = action.payload
        },
        limpiarDetalleMedico(state) {
            state.detalle = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicos.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchMedicos.fulfilled, (state, action) => {
                state.cargando = false
                const { datos, buscando } = action.payload
                state.hayMas = !buscando && datos.length > state.tamano
                state.lista = buscando ? datos : datos.slice(0, state.tamano)
            })
            .addCase(fetchMedicos.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(fetchDetalleMedico.pending, (state) => {
                state.cargandoDetalle = true
                state.error = null
                state.detalle = null
            })
            .addCase(fetchDetalleMedico.fulfilled, (state, action) => {
                state.cargandoDetalle = false
                state.detalle = action.payload
            })
            .addCase(fetchDetalleMedico.rejected, (state, action) => {
                state.cargandoDetalle = false
                state.error = action.payload
            })
            .addCase(crearMedico.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(crearMedico.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(crearMedico.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(actualizarMedico.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(actualizarMedico.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(actualizarMedico.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(deshabilitarMedico.fulfilled, (state, action) => {
                state.lista = state.lista.filter(m => m.id !== action.payload)
            })
    },
})

export const { setPaginaMedicos, limpiarDetalleMedico } = medicosSlice.actions
export default medicosSlice.reducer
