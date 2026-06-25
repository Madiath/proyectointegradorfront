import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../../../features/dashboardSlice'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const INTERVALO_MS = 30_000 // refresco automático cada 30 segundos

const Dashboard = () => {
    const dispatch = useDispatch()
    const { datos, cargando, error } = useSelector(state => state.dashboard)

    useEffect(() => {
        dispatch(fetchDashboard())
        const intervalo = setInterval(() => dispatch(fetchDashboard()), INTERVALO_MS)
        return () => clearInterval(intervalo)
    }, [dispatch])

    const chartData = {
        labels: datos?.pacientesPorMes?.map(p => p.mes) ?? [],
        datasets: [
            {
                label: 'Pacientes registrados',
                data: datos?.pacientesPorMes?.map(p => p.cantidad) ?? [],
                fill: true,
                tension: 0.4,
                borderColor: '#198754',
                backgroundColor: 'rgba(25,135,84,0.12)',
                pointBackgroundColor: '#198754',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.parsed.y} paciente${ctx.parsed.y !== 1 ? 's' : ''}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: {
                grid: { display: false },
            },
        },
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Dashboard</h2>
                {cargando && (
                    <span className="text-muted small d-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm text-success" />
                        Actualizando…
                    </span>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Cards resumen */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center py-4">
                            <div className="mb-1" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0d6efd' }}>
                                {datos ? datos.totalMedicos : '—'}
                            </div>
                            <div className="text-muted small fw-semibold text-uppercase">Médicos activos</div>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center py-4">
                            <div className="mb-1" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#198754' }}>
                                {datos ? datos.totalInsumos : '—'}
                            </div>
                            <div className="text-muted small fw-semibold text-uppercase">Insumos activos</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfica de pacientes por mes */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">Evolución de pacientes registrados por mes</h6>
                </div>
                <div className="card-body" style={{ height: 300 }}>
                    {!datos || datos.pacientesPorMes.length === 0 ? (
                        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                            Sin datos de pacientes para mostrar
                        </div>
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
