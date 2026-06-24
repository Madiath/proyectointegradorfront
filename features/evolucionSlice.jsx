import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEvolucionesPorPaciente,
  altaEvolucion,
  editarEvolucion,
  getEvolucionesPorFecha,
  subirImagenesEvolucion,
  eliminarImagenEvolucion
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
  async ({ evolucionDto, imagenes = [] }, thunkAPI) => {
    try {
      const evolucionCreada = await altaEvolucion(evolucionDto);

      if (imagenes.length > 0 && evolucionCreada?.id) {
        await subirImagenesEvolucion(evolucionCreada.id, imagenes);
      }

      return evolucionCreada;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al registrar evolucion"
      );
    }
  }
);

export const subirImagenesAEvolucion = createAsyncThunk(
  "evolucion/subirImagenesAEvolucion",
  async ({ idEvolucion, imagenes }, thunkAPI) => {
    try {
      return {
        idEvolucion,
        resultado: await subirImagenesEvolucion(idEvolucion, imagenes)
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al subir imagenes"
      );
    }
  }
);

export const eliminarImagenDeEvolucion = createAsyncThunk(
  "evolucion/eliminarImagenDeEvolucion",
  async ({ idEvolucion, idImagen }, thunkAPI) => {
    try {
      await eliminarImagenEvolucion(idImagen);
      return { idEvolucion, idImagen };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensaje || "Error al eliminar la imagen"
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
        error.response?.data?.mensaje || "Error al editar evolucion"
      );
    }
  }
);

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
        state.mensaje = action.payload?.mensaje || "Evolucion registrada correctamente.";
      })
      .addCase(crearEvolucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(subirImagenesAEvolucion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mensaje = "";
      })
      .addCase(subirImagenesAEvolucion.fulfilled, (state, action) => {
        state.loading = false;
        const evolucion = state.evoluciones.find(
          (ev) => Number(ev.id) === Number(action.payload.idEvolucion)
        );

        if (evolucion) {
          evolucion.imagenes = [
            ...(evolucion.imagenes || []),
            ...(action.payload.resultado?.imagenes || [])
          ];
        }

        state.mensaje = action.payload.resultado?.mensaje || "Imagenes subidas correctamente.";
      })
      .addCase(subirImagenesAEvolucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(eliminarImagenDeEvolucion.fulfilled, (state, action) => {
        const evolucion = state.evoluciones.find(
          (ev) => Number(ev.id) === Number(action.payload.idEvolucion)
        );

        if (evolucion) {
          evolucion.imagenes = (evolucion.imagenes || []).filter(
            (imagen) => Number(imagen.id) !== Number(action.payload.idImagen)
          );
        }
      })
      .addCase(eliminarImagenDeEvolucion.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(actualizarEvolucion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mensaje = "";
      })
      .addCase(actualizarEvolucion.fulfilled, (state, action) => {
        state.loading = false;
        state.mensaje = action.payload?.mensaje || "Evolucion actualizada correctamente.";
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
      });
  }
});

export const { limpiarMensajeEvolucion } = evolucionSlice.actions;
export default evolucionSlice.reducer;
