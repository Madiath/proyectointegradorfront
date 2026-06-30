import axiosInstance from './axiosInstance'

const BASE_URL = '/api/recipes'

export const crearRecipe = async (datos) => {
    const response = await axiosInstance.post(BASE_URL, datos)
    return response.data
}

export const listarRecipesPaciente = async (pacienteId, filtros = {}) => {
    const response = await axiosInstance.get(`${BASE_URL}/paciente/${pacienteId}`, {
        params: filtros
    })
    return response.data
}

export const exportarRecipePdf = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}/pdf`, {
        responseType: 'blob'
    })
    return response.data
}

export const listarInsumosRecipeDisponibles = async () => {
    const response = await axiosInstance.get(`${BASE_URL}/insumos-disponibles`)
    return response.data
}
