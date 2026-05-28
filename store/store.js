import { configureStore } from "@reduxjs/toolkit";
import pacientesReducer from "../features/pacientesSlice";
import usuariosReducer from "../features/usuariosSlice";
import medicosReducer from "../features/medicosSlice";
import historialClinicoReducer from "../features/historialClinicoSlice";
import evolucionReducer from "../features/evolucionSlice";
import insumosReducer from "../features/insumosSlice";
import agendaReducer from "../features/agendaSlice";
import dashboardReducer from "../features/dashboardSlice";

export const store = configureStore({
    reducer: {
        pacientes: pacientesReducer,
        usuarios: usuariosReducer,
        medicos: medicosReducer,
        historialClinico: historialClinicoReducer,
        evolucion: evolucionReducer,
        insumos: insumosReducer,
        agenda: agendaReducer,
        dashboard: dashboardReducer,
    }
})