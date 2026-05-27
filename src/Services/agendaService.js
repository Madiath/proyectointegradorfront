import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/agenda`

export const getHorariosAgenda = () => axiosInstance.get(`${BASE_URL}/horarios`)

export const getTurnosSemana = (weekStart) =>
    axiosInstance.get(`${BASE_URL}/turnos`, { params: { weekStart } })

export const crearTurno = (datos) => axiosInstance.post(`${BASE_URL}/turnos`, datos)
