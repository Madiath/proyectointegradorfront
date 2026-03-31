import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getHistorialClinico,
  editarHistorialClinico
} from "../../../Services/historialClinicoService";

const FormularioEditarHistorialClinico = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // en tu caso, si usas idPaciente para traer/editar

  const [formData, setFormData] = useState({
    motivoDeConsulta: "",
    enfermedadActual: "",
    antecedentes: "",
    habitosPSB: "",
    examenFisico: "",
    diagnostico: "",
    examenLaboratorio: "",
    tratamiento: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await getHistorialClinico(id);

        setFormData({
          motivoDeConsulta: data.motivoDeConsulta || "",
          enfermedadActual: data.enfermedadActual || "",
          antecedentes: data.antecedentes || "",
          habitosPSB: data.habitosPSB || "",
          examenFisico: data.examenFisico || "",
          diagnostico: data.diagnostico || "",
          examenLaboratorio: data.examenLaboratorio || "",
          tratamiento: data.tratamiento || ""
        });
      } catch (err) {
        setError(err.message || "Error al cargar historial clínico");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      await editarHistorialClinico(id, formData);
      setMensaje("Historial clínico actualizado correctamente");

      setTimeout(() => {
        navigate(`/pacientes/${id}`);
      }, 1000);
    } catch (err) {
      setError(err.message || "Error al editar historial clínico");
    }
  };

  if (loading) return <p>Cargando historial clínico...</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Historial Clínico</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Motivo de Consulta</label>
          <input
            type="text"
            className="form-control"
            name="motivoDeConsulta"
            value={formData.motivoDeConsulta}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Enfermedad Actual</label>
          <textarea
            className="form-control"
            name="enfermedadActual"
            value={formData.enfermedadActual}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Antecedentes</label>
          <textarea
            className="form-control"
            name="antecedentes"
            value={formData.antecedentes}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hábitos PSB</label>
          <textarea
            className="form-control"
            name="habitosPSB"
            value={formData.habitosPSB}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Examen Físico</label>
          <textarea
            className="form-control"
            name="examenFisico"
            value={formData.examenFisico}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Diagnóstico</label>
          <textarea
            className="form-control"
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Examen de Laboratorio</label>
          <textarea
            className="form-control"
            name="examenLaboratorio"
            value={formData.examenLaboratorio}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tratamiento</label>
          <textarea
            className="form-control"
            name="tratamiento"
            value={formData.tratamiento}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default FormularioEditarHistorialClinico;