import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/medico`

export const listarMedicos = (pagina = 1, tamano = 10, busqueda = '') => {
    const params = { pagina, tamano }
    if (busqueda?.trim()) params.busqueda = busqueda.trim()
    return axiosInstance.get(BASE_URL, { params })
}

export const getMedico = (id) => axiosInstance.get(`${BASE_URL}/${id}`)

export const altaMedico = (datos) => axiosInstance.post(BASE_URL, datos)

export const editarMedico = (id, datos) => axiosInstance.put(`${BASE_URL}/${id}`, datos)

export const eliminarMedico = (id) => axiosInstance.delete(`${BASE_URL}/${id}`)
