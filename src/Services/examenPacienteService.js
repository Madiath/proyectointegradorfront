import axiosInstance from './axiosInstance'

const BASE_URL = '/api/examenes-paciente'

export const listarExamenesPaciente = async (pacienteId) => {
    const response = await axiosInstance.get(`${BASE_URL}/paciente/${pacienteId}`)
    return response.data
}

export const subirExamenPaciente = async (pacienteId, nombre, archivo) => {
    const formData = new FormData()
    formData.append('nombre', nombre)
    formData.append('archivo', archivo)

    const response = await axiosInstance.post(`${BASE_URL}/${pacienteId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
}

export const descargarArchivoExamen = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}/archivo`, {
        responseType: 'blob'
    })

    return response.data
}

export const eliminarExamenPaciente = async (id) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`)
    return response.data
}
