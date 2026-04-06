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


export const loginUsuario = async (data) => {
  const response = await fetch("http://localhost:5237/api/Usuario/login", {
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