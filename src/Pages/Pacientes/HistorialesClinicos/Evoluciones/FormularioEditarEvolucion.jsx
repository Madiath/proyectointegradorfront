import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  actualizarEvolucion,
  limpiarMensajeEvolucion,
} from "../../../../../features/evolucionSlice";
import {
  construirUrlImagenEvolucion,
  subirImagenesEvolucion,
} from "../../../../Services/evolucionService";

const FormularioEditarEvolucion = () => {
  const { idPaciente, idEvolucion } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { evoluciones, loading, error, mensaje } = useSelector(
    (state) => state.evolucion
  );

  const [descripcionEvolucion, setDescripcionEvolucion] = useState(null);
  const [errorLocal, setErrorLocal] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);

  const evolucion = evoluciones.find(
    (ev) => Number(ev.id) === Number(idEvolucion)
  );
  const descripcionActual = descripcionEvolucion ?? evolucion?.descripcionEvolucion ?? "";

  useEffect(() => {
    return () => {
      dispatch(limpiarMensajeEvolucion());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal("");

    if (!descripcionActual.trim()) {
      setErrorLocal("La descripción de la evolución es obligatoria.");
      return;
    }

    try {
      await dispatch(
        actualizarEvolucion({
          id: Number(idEvolucion),
          evolucionDto: {
            descripcionEvolucion: descripcionActual,
          },
        })
      ).unwrap();

      if (imagenes.length > 0) {
        setSubiendoImagenes(true);
        await subirImagenesEvolucion(Number(idEvolucion), imagenes);
      }

      navigate(`/pacientes/${idPaciente}/evoluciones`);
    } catch (err) {
      setErrorLocal(err?.response?.data?.mensaje || err || "No se pudo guardar la evolucion con imagenes.");
    } finally {
      setSubiendoImagenes(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Evolución</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {errorLocal && <div className="alert alert-danger">{errorLocal}</div>}

      <div className="card p-4">
        <h3 className="mb-4">Modificar evolución</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Descripción de la evolución</strong>
            </label>
            <textarea
              className="form-control"
              rows="5"
              value={descripcionActual}
              onChange={(e) => setDescripcionEvolucion(e.target.value)}
              placeholder="Ingrese la nueva descripción"
            />
          </div>

          {evolucion?.imagenes?.length > 0 && (
            <div className="mb-3">
              <label className="form-label">
                <strong>Imagenes actuales</strong>
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {evolucion.imagenes.map((imagen) => {
                  const urlImagen = construirUrlImagenEvolucion(imagen.url);

                  return (
                    <a
                      key={imagen.id}
                      href={urlImagen}
                      target="_blank"
                      rel="noreferrer"
                      className="border rounded overflow-hidden d-inline-flex"
                      style={{ width: "96px", height: "96px" }}
                    >
                      <img
                        src={urlImagen}
                        alt={imagen.nombreArchivo || "Imagen de evolucion"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">
              <strong>Agregar imagenes</strong>
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
              {loading || subiendoImagenes ? "Guardando..." : "Guardar cambios"}
            </button>

            <Link
              to={`/pacientes/${idPaciente}/evoluciones`}
              className="btn btn-secondary"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarEvolucion;
