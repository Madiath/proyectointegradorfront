import { useState } from "react";
import { registrarUsuario } from "../../Services/usuarioService";

const Registro = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registrarUsuario({
        email,
        password,
        confPassword
      });

      alert("Usuario registrado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Registro Usuario</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfPassword(e.target.value)}
        />

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Registro;