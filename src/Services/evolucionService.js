import axios from "axios";

const API_URL = "https://localhost:7128/api/Evolucion";

export const getEvolucionesPorPaciente = async (idPaciente) => {
  const response = await axios.get(`${API_URL}/paciente/${idPaciente}`);
  return response.data;
};

export const altaEvolucion = async (evolucion) => {
  const response = await axios.post(API_URL, evolucion);
  return response.data;
};

export const editarEvolucion = async (id, evolucion) => {
  const response = await axios.put(`${API_URL}/${id}`, evolucion);
  return response.data;
};