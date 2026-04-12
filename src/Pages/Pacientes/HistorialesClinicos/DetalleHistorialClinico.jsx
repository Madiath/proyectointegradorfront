import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  getHistorialClinico,
  generarPdfHistorialClinico,
} from "../../../Services/historialClinicoService";

const DetalleHistorialClinico = () => {
  const { id } = useParams();

  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await getHistorialClinico(id);
        setHistorial(data);
      } catch (err) {
        setError(err.message || "No se pudo cargar el historial clínico");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [id]);

  const handleExportarPdf = async () => {
    try {
      const pdfBlob = await generarPdfHistorialClinico(id);

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `HistorialClinico_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "No se pudo exportar el PDF");
    }
  };

  if (loading) return <p>Cargando historial clínico...</p>;

  return (
    <div className="container mt-4">
      <h2>Detalle del Historial Clínico</h2>

      {error && <div className="alert alert-warning">{error}</div>}

      {!historial ? (
        <div>
          <p>El paciente no tiene historial clínico registrado.</p>
          <Link
            to={`/pacientes/${id}/historial/nuevo`}
            className="btn btn-primary"
          >
            Agregar historial
          </Link>
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="mb-4">Historia clínica</h3>

          <div className="mb-3">
            <strong>Motivo de Consulta:</strong>
            <p>{historial.motivoDeConsulta}</p>
          </div>

          <div className="mb-3">
            <strong>Enfermedad Actual:</strong>
            <p>{historial.enfermedadActual}</p>
          </div>

          <div className="mb-3">
            <strong>Antecedentes:</strong>
            <p>{historial.antecedentes}</p>
          </div>

          <div className="mb-3">
            <strong>Hábitos PSB:</strong>
            <p>{historial.habitosPSB}</p>
          </div>

          <div className="mb-3">
            <strong>Examen Físico:</strong>
            <p>{historial.examenFisico}</p>
          </div>

          <div className="mb-3">
            <strong>Diagnóstico:</strong>
            <p>{historial.diagnostico}</p>
          </div>

          <div className="mb-3">
            <strong>Examen de Laboratorio:</strong>
            <p>{historial.examenLaboratorio}</p>
          </div>

          <div className="mb-3">
            <strong>Tratamiento:</strong>
            <p>{historial.tratamiento}</p>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Link
              to={`/pacientes/${id}/evoluciones`}
              className="btn btn-primary"
            >
              Evoluciones
            </Link>

            <button onClick={handleExportarPdf} className="btn btn-danger">
              Exportar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleHistorialClinico;