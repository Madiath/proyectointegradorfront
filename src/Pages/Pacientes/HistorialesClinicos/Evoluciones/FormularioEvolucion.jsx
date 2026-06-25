import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getHistorialClinico } from "../../../../Services/historialClinicoService";
import {
  crearEvolucion,
  limpiarMensajeEvolucion,
} from "../../../../../features/evolucionSlice";
import { subirImagenesEvolucion } from "../../../../Services/evolucionService";

const FormularioEvolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, mensaje } = useSelector((state) => state.evolucion);

  const [historial, setHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState("");
  const [descripcionEvolucion, setDescripcionEvolucion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const [errorImagenes, setErrorImagenes] = useState("");

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

  const guardarEvolucion = async (e) => {
    e.preventDefault();
    setErrorImagenes("");

    if (!descripcionEvolucion.trim()) {
      return;
    }

    const evolucionDto = {
      idPaciente: Number(id),
      descripcionEvolucion: descripcionEvolucion,
    };

    try {
      const evolucionCreada = await dispatch(crearEvolucion(evolucionDto)).unwrap();

      if (imagenes.length > 0) {
        setSubiendoImagenes(true);
        await subirImagenesEvolucion(evolucionCreada.id, imagenes);
      }

      navigate(`/pacientes/${id}/evoluciones`);
    } catch (err) {
      setErrorImagenes(err?.response?.data?.mensaje || err || "No se pudo guardar la evolucion con imagenes.");
    } finally {
      setSubiendoImagenes(false);
    }
  };

  if (cargandoHistorial) return <p>Cargando información...</p>;

  return (
    <div className="container mt-4">
      <h2>Registrar Evolución</h2>

      {errorHistorial && <div className="alert alert-warning">{errorHistorial}</div>}
      {error && <div className="alert alert-warning">{error}</div>}
      {errorImagenes && <div className="alert alert-warning">{errorImagenes}</div>}
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

            <div className="mb-3">
              <label className="form-label">
                <strong>Imagenes de la evolucion</strong>
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => setImagenes(Array.from(e.target.files || []))}
              />
              {imagenes.length > 0 && (
                <small className="text-muted">
                  {imagenes.length} imagen{imagenes.length === 1 ? "" : "es"} seleccionada{imagenes.length === 1 ? "" : "s"}.
                </small>
              )}
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading || subiendoImagenes}>
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
