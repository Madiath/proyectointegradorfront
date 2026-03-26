import { configureStore } from "@reduxjs/toolkit";
import pacientesReducer from "../features/pacientesSlice";

export const store = configureStore({
    reducer: {
        pacientes: pacientesReducer,
    }
})