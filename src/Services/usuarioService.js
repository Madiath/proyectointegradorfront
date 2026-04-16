import axiosInstance from './axiosInstance'
import axios from 'axios'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/usuario`

<<<<<<< HEAD
export const listarUsuarios = (pagina = 1, tamano = 10) => axiosInstance.get(BASE_URL, { params: { pagina, tamano } })
export const getUsuario = (id) => axiosInstance.get(`${BASE_URL}/${id}`)
export const altaUsuario = (datos) => axiosInstance.post(BASE_URL, datos)
export const editarUsuario = (id, datos) => axiosInstance.put(`${BASE_URL}/${id}`, datos)
export const eliminarUsuario = (id) => axiosInstance.delete(`${BASE_URL}/${id}`)

export const registrarUsuario = async (usuario) => {
  const response = await fetch("http://localhost:7128/api/Usuario/Registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al registrar usuario");
  }

  return response.json();
};

=======
export const listarUsuarios = (pagina = 1, tamano = 10) => axios.get(BASE_URL, { params: { pagina, tamano } })
export const getUsuario = (id) => axios.get(`${BASE_URL}/${id}`)
export const altaUsuario = (datos) => axios.post(BASE_URL, datos)
export const editarUsuario = (id, datos) => axios.put(`${BASE_URL}/${id}`, datos)
export const eliminarUsuario = (id) => axios.delete(`${BASE_URL}/${id}`)
>>>>>>> e6f707cc6e68fcdcdb610294759292e1a600c608

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
