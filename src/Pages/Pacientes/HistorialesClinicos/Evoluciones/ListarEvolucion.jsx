import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvolucionesPorPaciente,
  limpiarMensajeEvolucion,
} from "../../../../../features/evolucionSlice";

const ListaEvoluciones = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { evoluciones, loading, error } = useSelector((state) => state.evolucion);

  useEffect(() => {
    dispatch(fetchEvolucionesPorPaciente(id));

    return () => {
      dispatch(limpiarMensajeEvolucion());
    };
  }, [dispatch, id]);

  if (loading) return <p>Cargando evoluciones...</p>;

  return (
    <div className="container mt-4">
      <h2>Evoluciones del Paciente</h2>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="mb-3 d-flex gap-2">
        <Link
          to={`/pacientes/${id}/evoluciones/nueva`}
          className="btn btn-primary"
        >
          Agregar evolución
        </Link>

        <Link
          to={`/pacientes/${id}/historial`}
          className="btn btn-secondary"
        >
          Volver al historial
        </Link>
      </div>

      {!evoluciones || evoluciones.length === 0 ? (
        <div className="card p-4">
          <p className="mb-0">Este paciente no tiene evoluciones registradas.</p>
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="mb-4">Lista de evoluciones</h3>

          {evoluciones.map((evolucion, index) => (
            <div key={index} className="mb-4 border-bottom pb-3">
              <div className="mb-2">
                <strong>Fecha:</strong>
                <p className="mb-1">
                  {new Date(evolucion.fecha).toLocaleString()}
                </p>
              </div>

              <div className="mb-2">
                <strong>Descripción de la evolución:</strong>
                <p className="mb-1">{evolucion.descripcionEvolucion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaEvoluciones;