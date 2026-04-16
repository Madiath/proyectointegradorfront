import axios from 'axios'
import API_BASE_URL from './config'

<<<<<<< HEAD
const API_URL = "http://localhost:5237/api/Evolucion";
=======
const BASE_URL = `${API_BASE_URL}/api/Evolucion`
>>>>>>> e6f707cc6e68fcdcdb610294759292e1a600c608

export const getEvolucionesPorPaciente = async (idPaciente) => {
    const response = await axios.get(`${BASE_URL}/paciente/${idPaciente}`)
    return response.data
}

export const altaEvolucion = async (evolucion) => {
    const response = await axios.post(BASE_URL, evolucion)
    return response.data
}

export const editarEvolucion = async (id, evolucion) => {
    const response = await axios.put(`${BASE_URL}/${id}`, evolucion)
    return response.data
}
