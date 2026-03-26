import axios from 'axios'

const BASE_URL = 'http://localhost:5237/api/paciente'

export const listarPacientes = (pagina = 1, tamano = 10, orden = 'nombre') => {
    return axios.get(BASE_URL, {
        params: { pagina, tamano, orden }
    })
}

export const buscarPacientes = (nombre, documento) => {
    return axios.get(`${BASE_URL}/buscar`, {
        params: { nombre, documento }
    })
}

export const altaPaciente = (datos) => {
    return axios.post(BASE_URL, datos)
}

export const editarPaciente = (id, datos) => {
    return axios.put(`${BASE_URL}/${id}`, datos)
}

export const getPaciente = (id) => {
    return axios.get(`${BASE_URL}/${id}`)
}
