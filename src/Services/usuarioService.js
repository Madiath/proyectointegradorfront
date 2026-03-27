export const registrarUsuario = async (usuario) => {
  const response = await fetch("https://localhost:7128/api/Usuario/Registro", {
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