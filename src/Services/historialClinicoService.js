import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/HistorialClinico`

export const getHistorialClinico = async (idPaciente) => {
    const response = await axiosInstance.get(`${BASE_URL}/paciente/${idPaciente}`)
    return response.data
}

export const altaHistorialClinico = async (historial) => {
    const response = await axiosInstance.post(BASE_URL, historial)
    return response.data
}

export const editarHistorialClinico = async (idPaciente, historial) => {
    const response = await axiosInstance.put(`${BASE_URL}/paciente/${idPaciente}`, historial)
    return response.data
}

export const generarPdfHistorialClinico = async (idPaciente) => {
    const response = await axiosInstance.get(`${BASE_URL}/paciente/${idPaciente}/pdf`, {
        responseType: 'blob',
    })
    return response
}