import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEvolucionesPorPaciente,
  altaEvolucion,
  editarEvolucion,
  getEvolucionesPorFecha
} from "../src/Services/evolucionService";

export const fetchEvolucionesPorPaciente = createAsyncThunk(
  "evolucion/fetchEvolucionesPorPaciente",
  async (idPaciente, thunkAPI) => {
    try {
      return await getEvolucionesPorPaciente(idPaciente);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al obtener evoluciones"
      );
    }
  }
);

export const crearEvolucion = createAsyncThunk(
  "evolucion/crearEvolucion",
  async (evolucionDto, thunkAPI) => {
    try {
      return await altaEvolucion(evolucionDto);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al registrar evolución"
      );
    }
  }
);

export const actualizarEvolucion = createAsyncThunk(
  "evolucion/actualizarEvolucion",
  async ({ id, evolucionDto }, thunkAPI) => {
    try {
      return await editarEvolucion(id, evolucionDto);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al editar evolución"
      );
    }
  }
);


//Filtro por fecha
export const fetchEvolucionesPorFecha = createAsyncThunk(
  "evolucion/fetchEvolucionesPorFecha",
  async ({ pacienteId, fechaDesde, fechaHasta }, thunkAPI) => {
    try {
      return await getEvolucionesPorFecha(pacienteId, fechaDesde, fechaHasta);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al obtener evoluciones"
      );
    }
  }
);



const evolucionSlice = createSlice({
  name: "evolucion",
  initialState: {
    evoluciones: [],
    loading: false,
    error: null,
    mensaje: ""
  },
  reducers: {
    limpiarMensajeEvolucion: (state) => {
      state.mensaje = "";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvolucionesPorPaciente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvolucionesPorPaciente.fulfilled, (state, action) => {
        state.loading = false;
        state.evoluciones = action.payload.listaEvoluciones || [];
      })
      .addCase(fetchEvolucionesPorPaciente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(crearEvolucion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mensaje = "";
      })
      .addCase(crearEvolucion.fulfilled, (state, action) => {
        state.loading = false;
        state.mensaje =
          action.payload?.mensaje || "Evolución registrada correctamente.";
      })
      .addCase(crearEvolucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(actualizarEvolucion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mensaje = "";
      })
      .addCase(actualizarEvolucion.fulfilled, (state, action) => {
        state.loading = false;
        state.mensaje =
          action.payload?.mensaje || "Evolución actualizada correctamente.";
      })
      .addCase(actualizarEvolucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEvolucionesPorFecha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvolucionesPorFecha.fulfilled, (state, action) => {
        state.loading = false;
        state.evoluciones = action.payload.listaEvoluciones || [];
      })
      .addCase(fetchEvolucionesPorFecha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { limpiarMensajeEvolucion } = evolucionSlice.actions;
export default evolucionSlice.reducer;