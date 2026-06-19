import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  contarNotificacionesNoLeidas,
  listarNotificaciones,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
} from '../src/Services/notificacionService'

export const fetchNotificaciones = createAsyncThunk(
  'notificaciones/fetchNotificaciones',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listarNotificaciones()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar notificaciones')
    }
  }
)

export const fetchNotificacionesNoLeidas = createAsyncThunk(
  'notificaciones/fetchNotificacionesNoLeidas',
  async (_, { rejectWithValue }) => {
    try {
      const res = await contarNotificacionesNoLeidas()
      return res.data.cantidad
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensaje || 'Error al cargar contador')
    }
  }
)

export const marcarLeida = createAsyncThunk(
  'notificaciones/marcarLeida',
  async (id, { rejectWithValue }) => {
    try {
      await marcarNotificacionLeida(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensaje || 'Error al marcar notificacion')
    }
  }
)

export const marcarTodasLeidas = createAsyncThunk(
  'notificaciones/marcarTodasLeidas',
  async (_, { rejectWithValue }) => {
    try {
      await marcarTodasNotificacionesLeidas()
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensaje || 'Error al marcar notificaciones')
    }
  }
)

const ordenarPorFecha = (notificaciones) =>
  [...notificaciones].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))

const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState: {
    lista: [],
    noLeidas: 0,
    cargando: false,
    error: null,
  },
  reducers: {
    recibirNotificacion(state, action) {
      const notificacion = action.payload.notificacion
      state.lista = ordenarPorFecha([
        notificacion,
        ...state.lista.filter((n) => n.id !== notificacion.id),
      ])
      state.noLeidas = action.payload.noLeidas
    },
    actualizarNoLeidas(state, action) {
      state.noLeidas = action.payload
    },
    limpiarNotificaciones(state) {
      state.lista = []
      state.noLeidas = 0
      state.cargando = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificaciones.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.cargando = false
        state.lista = ordenarPorFecha(action.payload)
      })
      .addCase(fetchNotificaciones.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
      .addCase(fetchNotificacionesNoLeidas.fulfilled, (state, action) => {
        state.noLeidas = action.payload
      })
      .addCase(fetchNotificacionesNoLeidas.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(marcarLeida.fulfilled, (state, action) => {
        const notificacion = state.lista.find((n) => n.id === action.payload)
        if (notificacion && !notificacion.leida) {
          notificacion.leida = true
          notificacion.fechaLectura = new Date().toISOString()
          state.noLeidas = Math.max(0, state.noLeidas - 1)
        }
      })
      .addCase(marcarLeida.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(marcarTodasLeidas.fulfilled, (state) => {
        const ahora = new Date().toISOString()
        state.lista = state.lista.map((n) => ({ ...n, leida: true, fechaLectura: n.fechaLectura || ahora }))
        state.noLeidas = 0
      })
      .addCase(marcarTodasLeidas.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const {
  recibirNotificacion,
  actualizarNoLeidas,
  limpiarNotificaciones,
} = notificacionesSlice.actions

export default notificacionesSlice.reducer
