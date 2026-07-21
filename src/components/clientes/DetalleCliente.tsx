import { useEffect, useState } from 'react'
import { getHistorialCliente } from '../../services/clientes.service'
import { mensajeDeError } from '../../utils/errores'
import type { Cliente } from '../../types/cliente'
import type { ItemVenta, Venta } from '../../types/venta'

const formatearFecha = (fechaIso: string) => {
  const fecha = new Date(fechaIso)
  const diaTexto = fecha.toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const horaTexto = fecha.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })
  return `${diaTexto} hora ${horaTexto}`
}

const formatearItems = (detalleJson: string) => {
  try {
    const items = JSON.parse(detalleJson) as ItemVenta[]
    return items.map((i) => `${i.cantidad} ${i.name}`).join(', ')
  } catch {
    return 'detalle no disponible'
  }
}

const DetalleCliente = ({ cliente }: { cliente: Cliente }) => {
  const [historial, setHistorial] = useState<Venta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    getHistorialCliente(cliente.id)
      .then((data) => {
        setHistorial(data)
        setError('')
      })
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el historial.')))
      .finally(() => setCargando(false))
  }, [cliente.id])

  return (
    <div>
      <h4>{cliente.nombre}</h4>
      {cliente.telefono && <p className="text-muted mb-1">Tel: {cliente.telefono}</p>}
      <p className="cliente-deuda-total">Deuda actual: $ {Number(cliente.deuda).toFixed(2)}</p>

      <h6 className="mt-4">Historial de compras</h6>
      {error && <div className="alert alert-danger">{error}</div>}
      {cargando ? (
        <p className="text-muted">Cargando...</p>
      ) : historial.length === 0 ? (
        <p className="text-muted">Sin compras a crédito registradas.</p>
      ) : (
        <ul className="historial-lista">
          {historial.map((v) => (
            <li key={v.id} className="historial-item">
              <div className="historial-fecha">{formatearFecha(v.fecha)}</div>
              <div className="historial-detalle">llevó {formatearItems(v.detalle)}</div>
              <div className="historial-total">
                {Number(v.total_pesos) > 0 && `$ ${Number(v.total_pesos).toFixed(2)} `}
                {Number(v.total_dolares) > 0 && `U$ ${Number(v.total_dolares).toFixed(2)}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DetalleCliente
