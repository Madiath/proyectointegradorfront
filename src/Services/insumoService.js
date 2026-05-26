import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/insumo`

export const listarInsumos = (pagina = 1, tamano = 10) =>
    axiosInstance.get(BASE_URL, { params: { pagina, tamano } })

export const eliminarInsumo = (id) => axiosInstance.delete(`${BASE_URL}/${id}`)

export const altaInsumo = (datos) => axiosInstance.post(BASE_URL, datos)

export const editarInsumo = (id, datos) => axiosInstance.put(`${BASE_URL}/${id}`, datos)

export const registrarMovimiento = (datos) => axiosInstance.post(`${BASE_URL}/movimiento`, datos)
