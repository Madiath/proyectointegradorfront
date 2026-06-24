import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/Evolucion`

export const getEvolucionesPorPaciente = async (idPaciente) => {
    const response = await axiosInstance.get(`${BASE_URL}/paciente/${idPaciente}`)
    return response.data
}

export const altaEvolucion = async (evolucion) => {
    const response = await axiosInstance.post(BASE_URL, evolucion)
    return response.data
}

export const subirImagenesEvolucion = async (idEvolucion, imagenes) => {
    const formData = new FormData()
    imagenes.forEach((imagen) => formData.append('imagenes', imagen))

    const response = await axiosInstance.post(`${BASE_URL}/${idEvolucion}/imagenes`, formData)
    return response.data
}

export const eliminarImagenEvolucion = async (idImagen) => {
    const response = await axiosInstance.delete(`${BASE_URL}/imagenes/${idImagen}`)
    return response.data
}

export const editarEvolucion = async (id, evolucion) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, evolucion)
    return response.data
}

export const getEvolucionesPorFecha = async (idPaciente, fechaDesde, fechaHasta) => {
    const response = await axiosInstance.get(`${BASE_URL}/filtrEvol/${idPaciente}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`)
    return response.data
}

