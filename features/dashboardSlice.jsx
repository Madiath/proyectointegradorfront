import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDashboard } from '../src/Services/dashboardService'

export const fetchDashboard = createAsyncThunk(
    'dashboard/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getDashboard()
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar el dashboard')
        }
    }
)

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        datos: null,   // { totalInsumos, totalMedicos, pacientesPorMes }
        cargando: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.cargando = false
                state.datos = action.payload
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
    },
})

export default dashboardSlice.reducer
