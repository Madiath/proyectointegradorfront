import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  actualizarEvolucion,
  limpiarMensajeEvolucion,
} from "../../../../../features/evolucionSlice";

const FormularioEditarEvolucion = () => {
  const { idPaciente, idEvolucion } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { evoluciones, loading, error, mensaje } = useSelector(
    (state) => state.evolucion
  );

  const [descripcionEvolucion, setDescripcionEvolucion] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorLocal("");

    if (!descripcionEvolucion.trim()) {
      setErrorLocal("La descripción de la evolución es obligatoria.");
      return;
    }

    dispatch(
      actualizarEvolucion({
        id: Number(idEvolucion),
        evolucionDto: {
          descripcionEvolucion: descripcionEvolucion,
        },
      })
    );
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
              value={descripcionEvolucion}
              onChange={(e) => setDescripcionEvolucion(e.target.value)}
              placeholder="Ingrese la nueva descripción"
            />
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