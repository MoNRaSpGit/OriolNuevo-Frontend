import { useEffect, useState } from 'react'
import { getPanelHoy, actualizarCambio } from '../../services/panel.service'
import { mensajeDeError } from '../../utils/errores'
import type { PanelHoy, TotalPorMoneda } from '../../types/panel'
import '../../styles/panel/panel.scss'

const formatearMoneda = (total: TotalPorMoneda) => {
  const partes: string[] = []
  if (total.pesos > 0) partes.push(`$ ${total.pesos.toFixed(2)}`)
  if (total.dolares > 0) partes.push(`U$ ${total.dolares.toFixed(2)}`)
  return partes.length > 0 ? partes.join(' + ') : '$ 0.00'
}

const formatearFechaHora = (fechaIso: string) =>
  new Date(fechaIso).toLocaleString('es-UY', {
    timeZone: 'America/Montevideo',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatearFechaHoy = () =>
  new Date().toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

const PanelControl = () => {
  const [panel, setPanel] = useState<PanelHoy | null>(null)
  const [cambioInput, setCambioInput] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cargarPanel = () => {
    getPanelHoy()
      .then((data) => {
        setPanel(data)
        setCambioInput(String(data.cambio))
        setError('')
      })
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el panel.')))
  }

  useEffect(() => {
    cargarPanel()
  }, [])

  const handleGuardarCambio = async () => {
    const valor = parseFloat(cambioInput)
    if (Number.isNaN(valor) || valor < 0) {
      setError('Ingresá un valor de cambio válido.')
      return
    }
    setError('')
    setGuardando(true)
    try {
      await actualizarCambio(valor)
      cargarPanel()
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo actualizar el cambio.'))
    } finally {
      setGuardando(false)
    }
  }

  if (!panel) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Panel de Control</h2>
        {error ? <div className="alert alert-danger">{error}</div> : <p className="text-muted">Cargando...</p>}
      </div>
    )
  }

  return (
    <div className="container mt-4 panel-container">
      <div className="panel-hero">
        <div>
          <div className="panel-hero-kicker">Caja de hoy</div>
          <h2 className="panel-hero-titulo">Panel de Control</h2>
          <div className="panel-hero-subtitulo">{formatearFechaHoy()}</div>
        </div>
        <div className="panel-hero-estado">Abierta</div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* 1. Caja diaria: mismo orden de tarjetas que "Caja diaria" en LaClaudia
          (Caja inicial → Ventas del día destacada → Ganancia estimada →
          Monto actual → Pagos realizados). No incluye la tarjeta de
          "Comparación" de LaClaudia porque requiere datos históricos
          (día anterior) que hoy no se calculan. */}
      <section className="panel-section">
        <h4 className="panel-section-title">Caja diaria</h4>
        <div className="panel-tarjetas">
          <div className="panel-metric panel-metric--form">
            <label className="panel-metric-titulo" htmlFor="panel-plata-inicial">
              Caja inicial
            </label>
            <div className="panel-cambio-row">
              <input
                id="panel-plata-inicial"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={cambioInput}
                onChange={(e) => setCambioInput(e.target.value)}
              />
              <button className="btn btn-outline-primary" onClick={handleGuardarCambio} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>

          <div className="panel-metric panel-metric--highlight">
            <div className="panel-metric-titulo">Ventas del día</div>
            <div className="panel-metric-valor">$ {panel.ventasDelDia.toFixed(2)}</div>
            <div className="panel-metric-nota">Efectivo + Tarjeta + Crédito, en pesos equivalentes</div>
          </div>

          <div className="panel-metric">
            <div className="panel-metric-titulo">Ganancia estimada</div>
            <div className="panel-metric-valor">$ {panel.ganancias.toFixed(2)}</div>
            <div className="panel-metric-nota">(ventas del día − pagos) con un 30% descontado</div>
          </div>

          <div className="panel-metric">
            <div className="panel-metric-titulo">Monto actual</div>
            <div className="panel-metric-valor">$ {panel.caja.toFixed(2)}</div>
            <div className="panel-metric-nota">
              {panel.cambio.toFixed(2)} (inicial) + {panel.totalEfectivo.pesos.toFixed(2)} (efectivo) −{' '}
              {panel.totalPagos.toFixed(2)} (pagos)
            </div>
          </div>

          <div className="panel-metric">
            <div className="panel-metric-titulo">Pagos realizados</div>
            <div className="panel-metric-valor panel-metric-valor--negativo">- $ {panel.totalPagos.toFixed(2)}</div>
          </div>
        </div>
      </section>

      {/* 2. Medios de cobro (equivalente a "Medios de cobro" en LaClaudia) */}
      <section className="panel-section">
        <h4 className="panel-section-title">Medios de cobro</h4>
        <div className="panel-tarjetas">
          <div className="panel-metric">
            <div className="panel-metric-titulo">Efectivo</div>
            <div className="panel-metric-valor">{formatearMoneda(panel.totalEfectivo)}</div>
          </div>
          <div className="panel-metric">
            <div className="panel-metric-titulo">Tarjeta</div>
            <div className="panel-metric-valor">{formatearMoneda(panel.totalTarjeta)}</div>
          </div>
          <div className="panel-metric">
            <div className="panel-metric-titulo">Crédito</div>
            <div className="panel-metric-valor">{formatearMoneda(panel.totalCredito)}</div>
          </div>
        </div>
      </section>

      {/* 3. Movimientos */}
      <section className="panel-section">
        <h4 className="panel-section-title">Movimientos</h4>
        {panel.movimientos.length === 0 ? (
          <p className="text-muted">Todavía no hay movimientos hoy.</p>
        ) : (
          <ul className="panel-movimientos">
            {panel.movimientos.map((m, i) => (
              <li key={i} className="panel-movimiento">
                <span className={`panel-movimiento-tipo panel-movimiento-tipo--${m.tipo}`}>
                  {m.tipo === 'venta' ? 'Venta' : 'Pago'}
                </span>
                <span className="panel-movimiento-descripcion">
                  {m.descripcion}
                  {m.cantidad ? ` x${m.cantidad}` : ''}
                </span>
                <span className={m.tipo === 'pago' ? 'panel-movimiento-monto panel-monto-menos' : 'panel-movimiento-monto panel-monto-mas'}>
                  {m.tipo === 'pago' ? '− ' : '+ '}
                  {m.currency === 'USD' ? 'U$' : '$'} {m.monto.toFixed(2)}
                </span>
                <span className="panel-movimiento-fecha">{formatearFechaHora(m.fecha)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default PanelControl
