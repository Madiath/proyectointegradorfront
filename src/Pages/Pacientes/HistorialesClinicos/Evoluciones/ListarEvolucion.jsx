import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvolucionesPorPaciente,
  limpiarMensajeEvolucion,
  fetchEvolucionesPorFecha
} from "../../../../../features/evolucionSlice";
import '../../../../Shared/CSS/style.css'

const ListaEvoluciones = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { evoluciones, loading, error } = useSelector((state) => state.evolucion);

  //Fechas de filtro
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Paginación
  const TAMANO = 10;
  const [pagina, setPagina] = useState(1);


  useEffect(() => {
    dispatch(fetchEvolucionesPorPaciente(id));

    return () => {
      dispatch(limpiarMensajeEvolucion());
    };
  }, [dispatch, id]);

  if (loading) return <p>Cargando evoluciones...</p>;

  //Filtro
  const handleFiltrar = () => {
    setPagina(1);
    dispatch(fetchEvolucionesPorFecha({
      pacienteId: id,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    }));
  };

  //Limpiar filtro
  const handleLimpiarFiltro = () => {
    setFechaDesde("");
    setFechaHasta("");
    setPagina(1);
    dispatch(fetchEvolucionesPorPaciente(id));
  };

  return (
    <div className="container mt-4">
      <div className="sticky-header">

        <div className="d-flex justify-content-between align-items-center mb-2">

          <Link
            to={`/pacientes/${id}/historial`}
            className="btn btn-outline-secondary btn-sm"
          >
            Volver
          </Link>

          <h3 className="mb-0">Evoluciones del Paciente</h3>

          <Link
            to={`/pacientes/${id}/evoluciones/nueva`}
            className="btn btn-primary btn-sm"
          >
            Agregar
          </Link>

        </div>

        {error && (
          <div className="alert alert-warning py-2 mb-2">
            {error}
          </div>
        )}

        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">

          <small>Desde</small>

          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: "150px" }}
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />

          <small>Hasta</small>

          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: "150px" }}
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />

          <button
            className="btn btn-primary btn-sm"
            onClick={handleFiltrar}
          >
            Filtrar
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleLimpiarFiltro}
          >
            Limpiar
          </button>

        </div>

      </div>

      {!evoluciones || evoluciones.length === 0 ? (
        <div className="card p-4">
          <p className="mb-0">
            Este paciente no tiene evoluciones registradas.
          </p>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <h3 className="mb-4">Lista de evoluciones</h3>

            {evoluciones.slice((pagina - 1) * TAMANO, pagina * TAMANO).map((evolucion, index) => (
              <div
                key={evolucion.id || index}
                className="mb-4 border-bottom pb-3"
              >
                <div className="mb-2">
                  <strong>Fecha:</strong>
                  <p className="mb-1">
                    {evolucion.fecha
                      ? new Date(evolucion.fecha).toLocaleString()
                      : "Sin fecha"}
                  </p>
                </div>

                <div className="mb-2">
                  <strong>Descripción de la evolución:</strong>
                  <p className="mb-1">
                    {evolucion.descripcionEvolucion}
                  </p>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <Link
                    to={`/pacientes/${id}/evoluciones/${evolucion.id}/editar`}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {evoluciones.length > TAMANO && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted small">
                Página {pagina} — {evoluciones.length} evoluciones en total
              </span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPagina(p => p - 1)}
                  disabled={pagina === 1}
                >
                  Anterior
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPagina(p => p + 1)}
                  disabled={pagina * TAMANO >= evoluciones.length}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaEvoluciones;