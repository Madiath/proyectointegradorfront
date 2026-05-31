import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getHistorialClinico,
  editarHistorialClinico
} from "../../../Services/historialClinicoService";

const FormularioEditarHistorialClinico = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    pacienteId: Number(id),
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
  const [erroresCampos, setErroresCampos] = useState({});

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await getHistorialClinico(id);

        setFormData({
          pacienteId: Number(id),
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

    setErroresCampos((prev) => ({
      ...prev,
      [name]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setErroresCampos({});

    try {
      await editarHistorialClinico(id, formData);
      setMensaje("Historial clínico actualizado correctamente");

      setTimeout(() => {
        navigate(`/pacientes/${id}`);
      }, 1000);
    } catch (err) {
      const errores = err.response?.data?.errors;

      if (errores) {
        setErroresCampos(errores);
      } else {
        setError(
          err.response?.data?.mensaje ||
          err.message ||
          "Error al editar historial clínico"
        );
      }
    }
  };

  if (loading) return <p>Cargando historial clínico...</p>;

  return (
    <div className="container mt-4">
      <button
  type="button"
  className="btn btn-outline-secondary btn-sm"
  onClick={() => navigate(`/pacientes/${id}`)}
>
  Volver al paciente
</button>
      <h2>Editar Historial Clínico</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Motivo de Consulta</label>
          <input
            type="text"
            className={`form-control ${erroresCampos.MotivoDeConsulta ? "is-invalid" : ""}`}
            name="motivoDeConsulta"
            value={formData.motivoDeConsulta}
            onChange={handleChange}
          />
          {erroresCampos.MotivoDeConsulta && (
            <div className="text-danger mt-1">
              {erroresCampos.MotivoDeConsulta[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Enfermedad Actual</label>
          <textarea
            className={`form-control ${erroresCampos.EnfermedadActual ? "is-invalid" : ""}`}
            name="enfermedadActual"
            value={formData.enfermedadActual}
            onChange={handleChange}
          />
          {erroresCampos.EnfermedadActual && (
            <div className="text-danger mt-1">
              {erroresCampos.EnfermedadActual[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Antecedentes</label>
          <textarea
            className={`form-control ${erroresCampos.Antecedentes ? "is-invalid" : ""}`}
            name="antecedentes"
            value={formData.antecedentes}
            onChange={handleChange}
          />
          {erroresCampos.Antecedentes && (
            <div className="text-danger mt-1">
              {erroresCampos.Antecedentes[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Hábitos PSB</label>
          <textarea
            className={`form-control ${erroresCampos.HabitosPSB ? "is-invalid" : ""}`}
            name="habitosPSB"
            value={formData.habitosPSB}
            onChange={handleChange}
          />
          {erroresCampos.HabitosPSB && (
            <div className="text-danger mt-1">
              {erroresCampos.HabitosPSB[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Examen Físico</label>
          <textarea
            className={`form-control ${erroresCampos.ExamenFisico ? "is-invalid" : ""}`}
            name="examenFisico"
            value={formData.examenFisico}
            onChange={handleChange}
          />
          {erroresCampos.ExamenFisico && (
            <div className="text-danger mt-1">
              {erroresCampos.ExamenFisico[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Diagnóstico</label>
          <textarea
            className={`form-control ${erroresCampos.Diagnostico ? "is-invalid" : ""}`}
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
          />
          {erroresCampos.Diagnostico && (
            <div className="text-danger mt-1">
              {erroresCampos.Diagnostico[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Examen de Laboratorio</label>
          <textarea
            className={`form-control ${erroresCampos.ExamenLaboratorio ? "is-invalid" : ""}`}
            name="examenLaboratorio"
            value={formData.examenLaboratorio}
            onChange={handleChange}
          />
          {erroresCampos.ExamenLaboratorio && (
            <div className="text-danger mt-1">
              {erroresCampos.ExamenLaboratorio[0]}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Tratamiento</label>
          <textarea
            className={`form-control ${erroresCampos.Tratamiento ? "is-invalid" : ""}`}
            name="tratamiento"
            value={formData.tratamiento}
            onChange={handleChange}
          />
          {erroresCampos.Tratamiento && (
            <div className="text-danger mt-1">
              {erroresCampos.Tratamiento[0]}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default FormularioEditarHistorialClinico;
