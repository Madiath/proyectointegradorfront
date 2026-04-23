import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/usuario`

export const listarUsuarios = (pagina = 1, tamano = 10) => axiosInstance.get(BASE_URL, { params: { pagina, tamano } })
export const getUsuario = (id) => axiosInstance.get(`${BASE_URL}/${id}`)
export const altaUsuario = (datos) => axiosInstance.post(BASE_URL, datos)
export const editarUsuario = (id, datos) => axiosInstance.put(`${BASE_URL}/${id}`, datos)
export const eliminarUsuario = (id) => axiosInstance.delete(`${BASE_URL}/${id}`)

<<<<<<< HEAD
export const loginUsuario = async (data) => {
  const response = await fetch("http://localhost:5237/api/Usuario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
=======
export const loginUsuario = async (usuario) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
>>>>>>> b39fbba087525cacf692b21b4e752dd29333f72b

    if (!response.ok) {
        const text = await response.text()

<<<<<<< HEAD
  return response.json();
};


//Genera el codigo de verificacion y lo envia al email del usuario
export const primerPasoMfa = async (data) => {
  const response = await fetch("http://localhost:5237/api/Usuario/authsecure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje);
  }

  return response.json();
};


//Verifica el codigo de verificacion ingresado por el usuario
export const segundoPasoMfa = async (data) => {
  const response = await fetch("http://localhost:5237/api/Usuario/authsecure/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw { response: { data: result } }; // 👈 simula axios
  }

  return result;
};
=======
        let mensaje = "Error en el servidor"

        try {
            const json = JSON.parse(text)
            mensaje = json.mensaje || mensaje
        } catch {
            mensaje = text
        }

        throw new Error(mensaje)
    }

    return response.json()
}
export const recuperarContraseña = async (email) => {
    const response = await fetch(`${BASE_URL}/rec-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.mensaje)
    }

    return response.json()
}

export const restablecerPassword = async ({ token, nuevaPassword }) => {
    const response = await fetch(`${BASE_URL}/restablecer-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaPassword })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.mensaje)
    }

    return response.json()
}
>>>>>>> b39fbba087525cacf692b21b4e752dd29333f72b
