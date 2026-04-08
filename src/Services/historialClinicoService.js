import axios from "axios";

const API_URL = "http://localhost:5237/api/HistorialClinico";

export const getHistorialClinico = async (idPaciente) => {
  const response = await axios.get(`${API_URL}/${idPaciente}`);
  return response.data;
};

export const altaHistorialClinico = async (historial) => {
  const response = await axios.post(API_URL, historial);
  return response.data;
};

export const editarHistorialClinico = async (idPaciente, historial) => {
  const response = await axios.put(`${API_URL}/${idPaciente}`, historial);
  return response.data;
};