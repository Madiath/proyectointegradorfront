import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getHistorialClinico } from "../../../../Services/historialClinicoService";
import {
  crearEvolucion,
  limpiarMensajeEvolucion,
} from "../../../../../features/evolucionSlice";

const FormularioEvolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, mensaje } = useSelector((state) => state.evolucion);

  const [historial, setHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState("");
  const [descripcionEvolucion, setDescripcionEvolucion] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await getHistorialClinico(id);
        setHistorial(data);
      } catch (err) {
        setErrorHistorial(
          err.message || "No se pudo cargar el historial clínico."
        );
      } finally {
        setCargandoHistorial(false);
      }
    };

    cargarHistorial();

    return () => {
      dispatch(limpiarMensajeEvolucion());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        navigate(`/pacientes/${id}/evoluciones`);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [mensaje, navigate, id]);

  const guardarEvolucion = async (e) => {
    e.preventDefault();

    if (!descripcionEvolucion.trim()) {
      return;
    }

    const evolucionDto = {
      idPaciente: Number(id),
      descripcionEvolucion: descripcionEvolucion,
    };

    dispatch(crearEvolucion(evolucionDto));
  };

  if (cargandoHistorial) return <p>Cargando información...</p>;

  return (
    <div className="container mt-4">
      <h2>Registrar Evolución</h2>

      {errorHistorial && <div className="alert alert-warning">{errorHistorial}</div>}
      {error && <div className="alert alert-warning">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {!historial ? (
        <div>
          <p>El paciente no tiene historial clínico registrado.</p>
          <Link
            to={`/pacientes/${id}/historial/nuevo`}
            className="btn btn-primary"
          >
            Agregar historial clínico
          </Link>
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="mb-4">Nueva evolución</h3>

          <form onSubmit={guardarEvolucion}>
            <div className="mb-3">
              <label className="form-label">
                <strong>Descripción de la evolución</strong>
              </label>
              <textarea
                className="form-control"
                rows="5"
                value={descripcionEvolucion}
                onChange={(e) => setDescripcionEvolucion(e.target.value)}
                placeholder="Ingrese la evolución del paciente"
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar evolución"}
              </button>

              <Link
                to={`/pacientes/${id}/evoluciones`}
                className="btn btn-secondary"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FormularioEvolucion;