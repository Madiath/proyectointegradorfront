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

export const editarExamenPaciente = async (id, nombre, archivo) => {
    const formData = new FormData()
    formData.append('nombre', nombre)

    if (archivo) {
        formData.append('archivo', archivo)
    }

    const response = await axiosInstance.put(`${BASE_URL}/${id}`, formData, {
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

export const eliminarExamenPaciente = async (id, comentario) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`, {
        data: { comentario }
    })
    return response.data
}
