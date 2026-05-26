import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/insumo`

export const listarInsumos = () => axiosInstance.get(BASE_URL)

export const altaInsumo = (datos) => axiosInstance.post(BASE_URL, datos)

export const registrarMovimiento = (datos) => axiosInstance.post(`${BASE_URL}/movimiento`, datos)
