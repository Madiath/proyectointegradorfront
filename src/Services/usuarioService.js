import axios from 'axios'

const BASE_URL = 'http://localhost:5237/api/usuario'

export const listarUsuarios = (pagina = 1, tamano = 10) => axios.get(BASE_URL, { params: { pagina, tamano } })
export const getUsuario = (id) => axios.get(`${BASE_URL}/${id}`)
export const altaUsuario = (datos) => axios.post(BASE_URL, datos)
export const editarUsuario = (id, datos) => axios.put(`${BASE_URL}/${id}`, datos)

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


export const loginUsuario = async (usuario) => {
  const response = await fetch("http://localhost:5237/api/Usuario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje);
  }

  return response.json();
};