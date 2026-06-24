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
  const [imagenes, setImagenes] = useState([]);
  const [errorImagenes, setErrorImagenes] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await getHistorialClinico(id);
        setHistorial(data);
      } catch (err) {
        setErrorHistorial(
          err.message || "No se pudo cargar el historial clinico."
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

  const seleccionarImagenes = (e) => {
    const archivos = Array.from(e.target.files || []);
    const extensionesPermitidas = ["jpg", "jpeg", "png", "webp"];
    const maxBytes = 5 * 1024 * 1024;

    const archivoInvalido = archivos.find((archivo) => {
      const extension = archivo.name.split(".").pop()?.toLowerCase();
      return !extensionesPermitidas.includes(extension) || archivo.size > maxBytes;
    });

    if (archivoInvalido) {
      setImagenes([]);
      e.target.value = "";
      setErrorImagenes("Solo se permiten imagenes jpg, jpeg, png o webp de hasta 5 MB.");
      return;
    }

    setErrorImagenes("");
    setImagenes(archivos);
  };

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

    dispatch(crearEvolucion({ evolucionDto, imagenes }));
  };

  if (cargandoHistorial) return <p>Cargando informacion...</p>;

  return (
    <div className="container mt-4">
      <h2>Registrar Evolucion</h2>

      {errorHistorial && <div className="alert alert-warning">{errorHistorial}</div>}
      {error && <div className="alert alert-warning">{error}</div>}
      {errorImagenes && <div className="alert alert-warning">{errorImagenes}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {!historial ? (
        <div>
          <p>El paciente no tiene historial clinico registrado.</p>
          <Link
            to={`/pacientes/${id}/historial/nuevo`}
            className="btn btn-primary"
          >
            Agregar historial clinico
          </Link>
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="mb-4">Nueva evolucion</h3>

          <form onSubmit={guardarEvolucion}>
            <div className="mb-3">
              <label className="form-label">
                <strong>Descripcion de la evolucion</strong>
              </label>
              <textarea
                className="form-control"
                rows="5"
                value={descripcionEvolucion}
                onChange={(e) => setDescripcionEvolucion(e.target.value)}
                placeholder="Ingrese la evolucion del paciente"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <strong>Imagenes de la evolucion</strong>
              </label>
              <input
                type="file"
                className="form-control"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={seleccionarImagenes}
              />
              {imagenes.length > 0 && (
                <small className="text-muted">
                  {imagenes.length} imagen(es) seleccionada(s)
                </small>
              )}
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar evolucion"}
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
