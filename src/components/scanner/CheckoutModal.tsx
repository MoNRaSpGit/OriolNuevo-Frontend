import { useEffect, useState } from 'react'
import { getClientes } from '../../services/clientes.service'
import { registrarVentaCredito } from '../../services/ventas.service'
import type { ProductoBoleta } from '../../context/CarritoContext'
import type { Cliente } from '../../types/cliente'
import '../../styles/scanner/modal.scss'

type MetodoPago = 'efectivo' | 'tarjeta' | 'credito'

interface Props {
  productos: ProductoBoleta[]
  totalPesos: number
  totalDolares: number
  onCancelar: () => void
  onConfirmado: () => void
}

const CheckoutModal = ({ productos, totalPesos, totalDolares, onCancelar, onConfirmado }: Props) => {
  const [metodo, setMetodo] = useState<MetodoPago | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteId, setClienteId] = useState<number | ''>('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (metodo === 'credito') {
      getClientes()
        .then(setClientes)
        .catch(() => setError('No se pudo cargar la lista de clientes.'))
    }
  }, [metodo])

  const handleConfirmar = async () => {
    if (metodo === 'credito') {
      if (!clienteId) {
        setError('Seleccioná un cliente.')
        return
      }
      setError('')
      setGuardando(true)
      try {
        await registrarVentaCredito({
          cliente_id: Number(clienteId),
          total_pesos: totalPesos,
          total_dolares: totalDolares,
          items: productos.map((p) => ({
            name: p.name,
            cantidad: p.cantidad,
            precio: p.precio,
            currency: p.currency,
          })),
        })
        onConfirmado()
      } catch {
        setError('No se pudo registrar la venta. Probá de nuevo.')
        setGuardando(false)
      }
      return
    }

    // Efectivo o tarjeta: no queda registrado a nombre de ningún cliente.
    onConfirmado()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4>Confirmar compra</h4>
        <p className="text-muted">
          Total: {totalPesos > 0 && <strong>$ {totalPesos.toFixed(2)} </strong>}
          {totalDolares > 0 && <strong>U$ {totalDolares.toFixed(2)}</strong>}
        </p>

        <div className="mb-3">
          <label className="form-label">Método de pago</label>
          <div className="modal-metodo-pago">
            <button
              type="button"
              className={metodo === 'efectivo' ? 'btn btn-primary' : 'btn btn-outline-secondary'}
              onClick={() => setMetodo('efectivo')}
            >
              Efectivo
            </button>
            <button
              type="button"
              className={metodo === 'tarjeta' ? 'btn btn-primary' : 'btn btn-outline-secondary'}
              onClick={() => setMetodo('tarjeta')}
            >
              Tarjeta
            </button>
            <button
              type="button"
              className={metodo === 'credito' ? 'btn btn-primary' : 'btn btn-outline-secondary'}
              onClick={() => setMetodo('credito')}
            >
              Crédito
            </button>
          </div>
        </div>

        {metodo === 'credito' && (
          <div className="mb-3">
            <label className="form-label">Cliente</label>
            <select
              className="form-select"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Seleccioná un cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-danger">{error}</p>}

        <div className="modal-acciones">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirmar}
            disabled={!metodo || guardando}
          >
            {guardando ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal
