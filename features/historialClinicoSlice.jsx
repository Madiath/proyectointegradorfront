import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHistorialClinico,
  altaHistorialClinico,
  editarHistorialClinico
} from "../src/Services/historialClinicoService";

// Obtener historial
export const fetchHistorialClinico = createAsyncThunk(
  "historialClinico/fetch",
  async (pacienteId, { rejectWithValue }) => {
    try {
      return await getHistorialClinico(pacienteId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Crear historial
export const addHistorialClinico = createAsyncThunk(
  "historialClinico/add",
  async ({ data }, { rejectWithValue }) => {
    try {
      return await altaHistorialClinico(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Editar historial
export const updateHistorialClinico = createAsyncThunk(
  "historialClinico/update",
  async ({ pacienteId, data }, { rejectWithValue }) => {
    try {
      return await editarHistorialClinico(pacienteId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const historialClinicoSlice = createSlice({
  name: "historialClinico",
  initialState: {
    historial: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHistorial: (state) => {
      state.historial = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistorialClinico.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistorialClinico.fulfilled, (state, action) => {
        state.loading = false;
        state.historial = action.payload;
      })
      .addCase(fetchHistorialClinico.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addHistorialClinico.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHistorialClinico.fulfilled, (state, action) => {
        state.loading = false;
        state.historial = action.payload;
      })
      .addCase(addHistorialClinico.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateHistorialClinico.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHistorialClinico.fulfilled, (state, action) => {
        state.loading = false;
        state.historial = action.payload;
      })
      .addCase(updateHistorialClinico.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHistorial } = historialClinicoSlice.actions;

export default historialClinicoSlice.reducer;