import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getHorariosAgenda, getTurnosSemana, crearTurno as crearTurnoService } from '../src/Services/agendaService'

export const fetchHorariosAgenda = createAsyncThunk(
    'agenda/fetchHorariosAgenda',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getHorariosAgenda()
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar la agenda')
        }
    }
)

export const fetchTurnos = createAsyncThunk(
    'agenda/fetchTurnos',
    async (weekStart, { rejectWithValue }) => {
        try {
            const res = await getTurnosSemana(weekStart)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar turnos')
        }
    }
)

export const crearTurno = createAsyncThunk(
    'agenda/crearTurno',
    async (datos, { rejectWithValue }) => {
        try {
            const res = await crearTurnoService(datos)
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al crear el turno')
        }
    }
)

const agendaSlice = createSlice({
    name: 'agenda',
    initialState: {
        medicos: [],   // [{ id, nombre, especialidad, horarios: [{ diaSemana, horaDesde, horaHasta }] }]
        turnos: [],    // [{ id, medicoId, medicoNombre, pacienteId, pacienteNombre, fechaHora }]
        cargando: false,
        cargandoTurnos: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHorariosAgenda.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchHorariosAgenda.fulfilled, (state, action) => {
                state.cargando = false
                state.medicos = action.payload
            })
            .addCase(fetchHorariosAgenda.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
            .addCase(fetchTurnos.pending, (state) => {
                state.cargandoTurnos = true
            })
            .addCase(fetchTurnos.fulfilled, (state, action) => {
                state.cargandoTurnos = false
                state.turnos = action.payload
            })
            .addCase(fetchTurnos.rejected, (state, action) => {
                state.cargandoTurnos = false
                state.error = action.payload
            })
            .addCase(crearTurno.fulfilled, (state, action) => {
                state.turnos.push(action.payload)
            })
    },
})

export default agendaSlice.reducer
