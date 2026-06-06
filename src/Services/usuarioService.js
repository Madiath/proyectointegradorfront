import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/usuario`

export const listarUsuarios = (pagina = 1, tamano = 10) =>
  axiosInstance.get(BASE_URL, { params: { pagina, tamano } })

export const getUsuario = (id) =>
  axiosInstance.get(`${BASE_URL}/${id}`)

export const altaUsuario = (datos) =>
  axiosInstance.post(BASE_URL, datos)

export const editarUsuario = (id, datos) =>
  axiosInstance.put(`${BASE_URL}/${id}`, datos)

export const eliminarUsuario = (id) =>
  axiosInstance.delete(`${BASE_URL}/${id}`)


// =========================
// LOGIN 
// =========================
export const loginUsuario = async (usuario) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  })

  if (!response.ok) {
  const text = await response.text()

  let mensaje = "Error en el servidor"

  try {
    const json = JSON.parse(text)

    if (json.errors) {
      const primerCampo = Object.keys(json.errors)[0]
      mensaje = json.errors[primerCampo][0]
    } else {
      mensaje = json.mensaje || mensaje
    }
  } catch {
    mensaje = text
  }

  throw new Error(mensaje)
}
  return response.json()
}

// =========================
// MFA
// =========================

// Paso 1: enviar código
export const primerPasoMfa = async (data) => {
  const response = await fetch(`${BASE_URL}/authsecure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const text = await response.text()

    let mensaje = "Error enviando código"

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


// Paso 2: verificar código
export const segundoPasoMfa = async (data) => {
  const response = await fetch(`${BASE_URL}/authsecure/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const text = await response.text()

  let result

  try {
    result = JSON.parse(text)
  } catch {
    result = { mensaje: text }
  }

  if (!response.ok) {
    throw new Error(result.mensaje || "Error verificando código")
  }

  return result
}


// =========================
// PASSWORD RESET 
// =========================
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