import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listarPacientes, buscarPacientes, altaPaciente, editarPaciente, getPaciente } from '../src/Services/pacienteService'

export const fetchPacientes = createAsyncThunk(
    'pacientes/fetchPacientes',
    async ({ pagina, tamano, orden }, { rejectWithValue }) => {
        try {
            const res = await listarPacientes(pagina, tamano, orden)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar pacientes')
        }
    }
)

export const fetchBuscarPacientes = createAsyncThunk(
    'pacientes/fetchBuscarPacientes',
    async ({ nombre, documento }, { rejectWithValue }) => {
        try {
            const res = await buscarPacientes(nombre, documento)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error en la búsqueda')
        }
    }
)

export const crearPaciente = createAsyncThunk(
    'pacientes/crearPaciente',
    async (datos, { rejectWithValue }) => {
        try {
            const res = await altaPaciente(datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al registrar paciente')
        }
    }
)

export const fetchDetallePaciente = createAsyncThunk(
    'pacientes/fetchDetallePaciente',
    async (id, { rejectWithValue }) => {
        try {
            const res = await getPaciente(id)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar el paciente')
        }
    }
)

export const actualizarPaciente = createAsyncThunk(
    'pacientes/actualizarPaciente',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            const res = await editarPaciente(id, datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al actualizar paciente')
        }
    }
)

const pacientesSlice = createSlice({
    name: 'pacientes',
    initialState: {
        lista: [],
        totalBackend: 0,
        eliminados: JSON.parse(localStorage.getItem('pacientes_eliminados') || '[]'),
        detalle: null,
        cargando: false,
        cargandoDetalle: false,
        error: null,
        pagina: 1,
        tamano: 10,
        orden: 'nombre',
    },
    reducers: {
        setPagina(state, action) {
            state.pagina = action.payload
        },
        setOrden(state, action) {
            state.orden = action.payload
            state.pagina = 1
        },
        limpiarError(state) {
            state.error = null
        },
        limpiarDetalle(state) {
            state.detalle = null
        },
        eliminarPacienteLocal(state, action) {
            state.eliminados.push(action.payload)
            localStorage.setItem('pacientes_eliminados', JSON.stringify(state.eliminados))
            state.lista = state.lista.filter(p => p.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPacientes.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchPacientes.fulfilled, (state, action) => {
                state.cargando = false
                state.totalBackend = action.payload.length
                state.lista = action.payload.filter(p => !state.eliminados.includes(p.id))
            })
            .addCase(fetchPacientes.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(fetchBuscarPacientes.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchBuscarPacientes.fulfilled, (state, action) => {
                state.cargando = false
                state.lista = action.payload.filter(p => !state.eliminados.includes(p.id))
            })
            .addCase(fetchBuscarPacientes.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(crearPaciente.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(crearPaciente.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(crearPaciente.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(fetchDetallePaciente.pending, (state) => {
                state.cargandoDetalle = true
                state.error = null
                state.detalle = null
            })
            .addCase(fetchDetallePaciente.fulfilled, (state, action) => {
                state.cargandoDetalle = false
                state.detalle = action.payload
            })
            .addCase(fetchDetallePaciente.rejected, (state, action) => {
                state.cargandoDetalle = false
                state.error = action.payload
            })
            .addCase(actualizarPaciente.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(actualizarPaciente.fulfilled, (state) => {
                state.cargando = false
            })
            .addCase(actualizarPaciente.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
    },
})

export const { setPagina, setOrden, limpiarError, limpiarDetalle, eliminarPacienteLocal } = pacientesSlice.actions
export default pacientesSlice.reducer
