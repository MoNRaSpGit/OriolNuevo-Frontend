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
      <h2 className="mb-4">Panel de Control</h2>
      <p className="text-muted">Totales del día de hoy</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel-seccion">
        <h4 className="panel-seccion-titulo">Tipo de pago</h4>
        <div className="panel-tarjetas">
          <div className="panel-tarjeta">
            <div className="panel-tarjeta-titulo">Efectivo</div>
            <div className="panel-tarjeta-valor">{formatearMoneda(panel.totalEfectivo)}</div>
          </div>
          <div className="panel-tarjeta">
            <div className="panel-tarjeta-titulo">Tarjeta</div>
            <div className="panel-tarjeta-valor">{formatearMoneda(panel.totalTarjeta)}</div>
          </div>
          <div className="panel-tarjeta">
            <div className="panel-tarjeta-titulo">Crédito</div>
            <div className="panel-tarjeta-valor">{formatearMoneda(panel.totalCredito)}</div>
          </div>
        </div>
      </section>

      <section className="panel-seccion">
        <h4 className="panel-seccion-titulo">Caja diaria</h4>
        <div className="panel-caja">
          <div className="panel-caja-cambio">
            <label className="form-label">Plata inicial</label>
            <div className="panel-cambio-row">
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={cambioInput}
                onChange={(e) => setCambioInput(e.target.value)}
              />
              <button className="btn btn-outline-primary btn-lg" onClick={handleGuardarCambio} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>

          <div className="panel-caja-total">
            <div className="panel-caja-total-label">Ganancias</div>
            <div className="panel-caja-total-valor">$ {panel.ganancias.toFixed(2)}</div>
            <div className="panel-caja-formula">
              (ventas del día − pagos) con un 30% descontado
            </div>
          </div>

          <div className="panel-caja-total">
            <div className="panel-caja-total-label">Caja (efectivo disponible)</div>
            <div className="panel-caja-total-valor">$ {panel.caja.toFixed(2)}</div>
            <div className="panel-caja-formula">
              {panel.cambio.toFixed(2)} (plata inicial) + {panel.totalEfectivo.pesos.toFixed(2)} (efectivo) −{' '}
              {panel.totalPagos.toFixed(2)} (pagos)
            </div>
          </div>

          <div className="panel-tarjeta panel-caja-pagos">
            <div className="panel-tarjeta-titulo">Pagos a proveedores</div>
            <div className="panel-tarjeta-valor panel-negativo">- $ {panel.totalPagos.toFixed(2)}</div>
          </div>
        </div>
      </section>

      <section className="panel-seccion">
        <h4 className="panel-seccion-titulo">Movimientos</h4>
        {panel.movimientos.length === 0 ? (
          <p className="text-muted">Todavía no hay movimientos hoy.</p>
        ) : (
          <ul className="panel-movimientos">
            {panel.movimientos.map((m, i) => (
              <li key={i} className={`panel-movimiento panel-movimiento--${m.tipo}`}>
                <span className="panel-movimiento-tipo">{m.tipo === 'venta' ? 'Venta' : 'Pago'}</span>
                <span className="panel-movimiento-descripcion">
                  {m.descripcion}
                  {m.cantidad ? ` x${m.cantidad}` : ''}
                </span>
                <span className="panel-movimiento-monto">
                  {m.tipo === 'pago' ? '- ' : ''}
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
