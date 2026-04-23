import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/paciente`

export const listarPacientes = (pagina = 1, tamano = 10, orden = 'nombre') => {
    return axiosInstance.get(BASE_URL, {
        params: { pagina, tamano, orden }
    })
}

export const buscarPacientes = (nombre, documento) => {
    return axiosInstance.get(`${BASE_URL}/buscar`, {
        params: { nombre, documento }
    })
}

export const altaPaciente = (datos) => {
    return axiosInstance.post(BASE_URL, datos)
}

export const editarPaciente = (id, datos) => {
    return axiosInstance.put(`${BASE_URL}/${id}`, datos)
}

export const getPaciente = (id) => {
    return axiosInstance.get(`${BASE_URL}/${id}`)
}
