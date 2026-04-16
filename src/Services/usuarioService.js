import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/usuario`

export const listarUsuarios = (pagina = 1, tamano = 10) => axiosInstance.get(BASE_URL, { params: { pagina, tamano } })
export const getUsuario = (id) => axiosInstance.get(`${BASE_URL}/${id}`)
export const altaUsuario = (datos) => axiosInstance.post(BASE_URL, datos)
export const editarUsuario = (id, datos) => axiosInstance.put(`${BASE_URL}/${id}`, datos)
export const eliminarUsuario = (id) => axiosInstance.delete(`${BASE_URL}/${id}`)

export const loginUsuario = async (usuario) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.mensaje)
    }

    return response.json()
}
