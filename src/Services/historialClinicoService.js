import axios from 'axios'
import API_BASE_URL from './config'

<<<<<<< HEAD
const API_URL = "http://localhost:5237/api/HistorialClinico";
=======
const BASE_URL = `${API_BASE_URL}/api/HistorialClinico`
>>>>>>> e6f707cc6e68fcdcdb610294759292e1a600c608

export const getHistorialClinico = async (idPaciente) => {
    const response = await axios.get(`${BASE_URL}/${idPaciente}`)
    return response.data
}

export const altaHistorialClinico = async (historial) => {
    const response = await axios.post(BASE_URL, historial)
    return response.data
}

export const editarHistorialClinico = async (idPaciente, historial) => {
    const response = await axios.put(`${BASE_URL}/${idPaciente}`, historial)
    return response.data
}
