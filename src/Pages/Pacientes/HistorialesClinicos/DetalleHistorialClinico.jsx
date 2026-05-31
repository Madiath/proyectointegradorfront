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
      const response = await generarPdfHistorialClinico(id);

      const pdfBlob = response.data;

      const contentDisposition =
        response.headers["content-disposition"];

      let nombreArchivo = "HistoriaClinica.pdf";




      if (contentDisposition) {
        const match = contentDisposition.match(/filename=([^;]+)/);
        if (match?.[1]) {
          nombreArchivo = match[1].replaceAll('"', '').trim();
        }
      }

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = nombreArchivo;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "No se pudo exportar el PDF");
    }
  };

  if (loading) return <p>Cargando historial clínico...</p>;

  return (
    <div className="container mt-4">
      <div className="sticky-header">
        <div className="titulo-centrado">
          <h2>Detalle del Historial Clínico</h2>
        </div>

        <div className="btn-volver">
          <div className="d-flex gap-2 mb-3">
            <Link to={`/pacientes/${id}`} className="btn btn-secondary">
              Volver al paciente
            </Link>
          </div>
        </div>

      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {!historial ? (
        <div>
          <p>El paciente no tiene historial clínico registrado.</p>
          <div className="d-flex gap-2">
            <Link
              to={`/pacientes/${id}`}
              className="btn btn-secondary"
            >
              Volver al paciente
            </Link>

            <Link
              to={`/pacientes/${id}/historial/nuevo`}
              className="btn btn-primary"
            >
              Agregar historial
            </Link>
          </div>
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
