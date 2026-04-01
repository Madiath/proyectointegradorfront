import { configureStore } from "@reduxjs/toolkit";
import pacientesReducer from "../features/pacientesSlice";
import usuariosReducer from "../features/usuariosSlice";

export const store = configureStore({
    reducer: {
        pacientes: pacientesReducer,
        usuarios: usuariosReducer,
    }
})