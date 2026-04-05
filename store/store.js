import { configureStore } from "@reduxjs/toolkit";
import pacientesReducer from "../features/pacientesSlice";
import historialClinicoReducer from "../features/historialClinicoSlice";
import evolucionReducer from "../features/evolucionSlice";

export const store = configureStore({
    reducer: {
        pacientes: pacientesReducer,
        historialClinico: historialClinicoReducer,
        evolucion: evolucionReducer,
    }
})