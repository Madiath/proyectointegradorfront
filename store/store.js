import { configureStore } from "@reduxjs/toolkit";
import pacientesReducer from "../features/pacientesSlice";
import usuariosReducer from "../features/usuariosSlice";
import historialClinicoReducer from "../features/historialClinicoSlice";
import evolucionReducer from "../features/evolucionSlice";

export const store = configureStore({
    reducer: {
        pacientes: pacientesReducer,
        usuarios: usuariosReducer,
        historialClinico: historialClinicoReducer,
        evolucion: evolucionReducer,
    }
})