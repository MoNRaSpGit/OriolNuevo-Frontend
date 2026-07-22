import { useEffect, useState } from 'react'
import { getPanelHoy, actualizarCambio } from '../../services/panel.service'
import { mensajeDeError } from '../../utils/errores'
import EditarCambioModal from './EditarCambioModal'
import type { PanelHoy, TotalPorMoneda } from '../../types/panel'
import '../../styles/panel/panel.scss'

const CANTIDAD_MOVIMIENTOS_VISIBLES = 3

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
  const [error, setError] = useState('')
  const [editandoCambio, setEditandoCambio] = useState(false)
  const [verTodosMovimientos, setVerTodosMovimientos] = useState(false)
  const [detalleAbierto, setDetalleAbierto] = useState<number | null>(null)

  const cargarPanel = () => {
    getPanelHoy()
      .then((data) => {
        setPanel(data)
        setError('')
      })
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el panel.')))
  }

  useEffect(() => {
    cargarPanel()
  }, [])

  const handleGuardarCambio = async (valor: number) => {
    await actualizarCambio(valor)
    setEditandoCambio(false)
    cargarPanel()
  }

  if (!panel) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Panel de Control</h2>
        {error ? <div className="alert alert-danger">{error}</div> : <p className="text-muted">Cargando...</p>}
      </div>
    )
  }

  const movimientosVisibles = verTodosMovimientos
    ? panel.movimientos
    : panel.movimientos.slice(0, CANTIDAD_MOVIMIENTOS_VISIBLES)

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
          <div
            className="panel-metric panel-metric--editable"
            onDoubleClick={() => setEditandoCambio(true)}
            title="Doble click para editar"
          >
            <div className="panel-metric-titulo">Caja inicial</div>
            <div className="panel-metric-valor">$ {panel.cambio.toFixed(2)}</div>
          </div>

          <div className="panel-metric panel-metric--highlight">
            <div className="panel-metric-titulo">Ventas del día</div>
            <div className="panel-metric-valor">$ {panel.ventasDelDia.toFixed(2)}</div>
            <div className="panel-metric-nota">Solo efectivo (plata real en caja), en pesos equivalentes</div>
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

      {/* 3. Movimientos: solo tipo + monto por fila; "Detalle" despliega
          una mini tarjeta con fecha/hora arriba y producto debajo. */}
      <section className="panel-section">
        <h4 className="panel-section-title">Movimientos</h4>
        {panel.movimientos.length === 0 ? (
          <p className="text-muted">Todavía no hay movimientos hoy.</p>
        ) : (
          <>
            <ul className="panel-movimientos">
              {movimientosVisibles.map((m, i) => {
                const abierto = detalleAbierto === i
                return (
                  <li key={i} className="panel-movimiento">
                    <div className="panel-movimiento-fila">
                      <span className={`panel-movimiento-tipo panel-movimiento-tipo--${m.tipo}`}>
                        {m.tipo === 'venta' ? 'Venta' : 'Pago'}
                      </span>
                      <span className={m.tipo === 'pago' ? 'panel-movimiento-monto panel-monto-menos' : 'panel-movimiento-monto panel-monto-mas'}>
                        {m.tipo === 'pago' ? '− ' : '+ '}
                        {m.currency === 'USD' ? 'U$' : '$'} {m.monto.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className="panel-movimiento-detalle-btn"
                        onClick={() => setDetalleAbierto(abierto ? null : i)}
                      >
                        {abierto ? 'Ocultar detalle' : 'Detalle'}
                      </button>
                    </div>

                    {abierto && (
                      <div className="panel-movimiento-detalle">
                        <div className="panel-movimiento-detalle-info">
                          <span className="panel-movimiento-detalle-fecha">{formatearFechaHora(m.fecha)}</span>
                          <span className="panel-movimiento-detalle-producto">
                            {m.descripcion}
                            {m.cantidad ? ` x${m.cantidad}` : ''}
                          </span>
                        </div>
                        <span className={m.tipo === 'pago' ? 'panel-movimiento-detalle-valor panel-monto-menos' : 'panel-movimiento-detalle-valor panel-monto-mas'}>
                          {m.tipo === 'pago' ? '− ' : '+ '}
                          {m.currency === 'USD' ? 'U$' : '$'} {m.monto.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>

            {panel.movimientos.length > CANTIDAD_MOVIMIENTOS_VISIBLES && (
              <button
                type="button"
                className="btn btn-outline-secondary panel-movimientos-vermas"
                onClick={() => setVerTodosMovimientos((v) => !v)}
              >
                {verTodosMovimientos ? 'Ver menos' : `Ver más (${panel.movimientos.length - CANTIDAD_MOVIMIENTOS_VISIBLES})`}
              </button>
            )}
          </>
        )}
      </section>

      {editandoCambio && (
        <EditarCambioModal
          valorActual={panel.cambio}
          onCancelar={() => setEditandoCambio(false)}
          onGuardar={handleGuardarCambio}
        />
      )}
    </div>
  )
}

export default PanelControl
