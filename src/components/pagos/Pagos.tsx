import { useEffect, useState, type FormEvent } from 'react'
import { getPagos, crearPago } from '../../services/pagos.service'
import { mensajeDeError } from '../../utils/errores'
import type { Pago } from '../../types/pago'
import '../../styles/pagos/pagos.scss'

const formatearFecha = (fechaIso: string) => {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleString('es-UY', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const Pagos = () => {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [valor, setValor] = useState('')
  const [detalle, setDetalle] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargarPagos = () => {
    setCargando(true)
    getPagos()
      .then(setPagos)
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar la lista de pagos.')))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarPagos()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const valorNum = parseFloat(valor)
    if (!valorNum || valorNum <= 0) {
      setError('Ingresá un valor válido.')
      return
    }
    if (!detalle.trim()) {
      setError('Ingresá un detalle (ej: proveedor).')
      return
    }

    setError('')
    setGuardando(true)
    try {
      const nuevo = await crearPago(valorNum, detalle.trim())
      setPagos((prev) => [nuevo as Pago, ...prev])
      setValor('')
      setDetalle('')
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo guardar el pago.'))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="container mt-4 pagos-container">
      <h2 className="mb-4">Pagos</h2>

      <form onSubmit={handleSubmit} className="pagos-form">
        <div className="mb-3">
          <label className="form-label">Valor</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Detalle</label>
          <input
            type="text"
            className="form-control"
            placeholder='Ej: Proveedor La Coca Cola'
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Registrar pago'}
        </button>
      </form>

      <h5 className="mt-4">Historial de pagos</h5>
      {cargando ? (
        <p className="text-muted">Cargando...</p>
      ) : pagos.length === 0 ? (
        <p className="text-muted">Todavía no hay pagos registrados.</p>
      ) : (
        <ul className="pagos-lista">
          {pagos.map((p) => (
            <li key={p.id} className="pagos-item">
              <div className="pagos-item-detalle">{p.detalle}</div>
              <div className="pagos-item-fecha">{formatearFecha(p.fecha)}</div>
              <div className="pagos-item-valor">$ {Number(p.valor).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Pagos
