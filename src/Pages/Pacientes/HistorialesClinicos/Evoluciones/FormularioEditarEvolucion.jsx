import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  actualizarEvolucion,
  limpiarMensajeEvolucion,
  subirImagenesAEvolucion,
} from "../../../../../features/evolucionSlice";

const FormularioEditarEvolucion = () => {
  const { idPaciente, idEvolucion } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { evoluciones, loading, error, mensaje } = useSelector(
    (state) => state.evolucion
  );

  const [descripcionEvolucion, setDescripcionEvolucion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [errorLocal, setErrorLocal] = useState("");

  useEffect(() => {
    const evolucion = evoluciones.find(
      (ev) => Number(ev.id) === Number(idEvolucion)
    );

    if (evolucion) {
      setDescripcionEvolucion(evolucion.descripcionEvolucion || "");
    }
  }, [evoluciones, idEvolucion]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        navigate(`/pacientes/${idPaciente}/evoluciones`);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [mensaje, navigate, idPaciente]);

  useEffect(() => {
    return () => {
      dispatch(limpiarMensajeEvolucion());
    };
  }, [dispatch]);

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
      setErrorLocal("Solo se permiten imagenes jpg, jpeg, png o webp de hasta 5 MB.");
      return;
    }

    setErrorLocal("");
    setImagenes(archivos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal("");

    if (!descripcionEvolucion.trim()) {
      setErrorLocal("La descripcion de la evolucion es obligatoria.");
      return;
    }

    const resultado = await dispatch(
      actualizarEvolucion({
        id: Number(idEvolucion),
        evolucionDto: {
          descripcionEvolucion: descripcionEvolucion,
        },
      })
    );

    if (actualizarEvolucion.fulfilled.match(resultado) && imagenes.length > 0) {
      dispatch(
        subirImagenesAEvolucion({
          idEvolucion: Number(idEvolucion),
          imagenes,
        })
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Evolucion</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {errorLocal && <div className="alert alert-danger">{errorLocal}</div>}

      <div className="card p-4">
        <h3 className="mb-4">Modificar evolucion</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Descripcion de la evolucion</strong>
            </label>
            <textarea
              className="form-control"
              rows="5"
              value={descripcionEvolucion}
              onChange={(e) => setDescripcionEvolucion(e.target.value)}
              placeholder="Ingrese la nueva descripcion"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Agregar imagenes</strong>
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
              {loading ? "Guardando..." : "Guardar cambios"}
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
