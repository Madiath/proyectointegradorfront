import axios from 'axios'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/HistorialClinico`

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


export const generarPdfHistorialClinico = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};