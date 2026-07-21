import { useState, type FormEvent } from 'react'
import { crearProducto } from '../../services/productos.service'
import type { Producto } from '../../types/producto'
import '../../styles/scanner/modal.scss'

interface Props {
  codigoBarra: string
  onCancelar: () => void
  onGuardado: (producto: Producto) => void
}

const ProductoNoEncontradoModal = ({ codigoBarra, onCancelar, onGuardado }: Props) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [currency, setCurrency] = useState<'UYU' | 'USD'>('UYU')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const precioNum = parseFloat(price)
    const stockNum = parseInt(stock, 10)
    if (!name.trim()) {
      setError('Ingresá el nombre del producto.')
      return
    }
    if (!precioNum || precioNum <= 0) {
      setError('Ingresá un precio válido.')
      return
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setError('Ingresá un stock válido.')
      return
    }

    setError('')
    setGuardando(true)
    try {
      const producto = await crearProducto({
        name: name.trim(),
        price: precioNum,
        currency,
        codigo_barra: codigoBarra,
        stock: stockNum,
      })
      onGuardado(producto)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el producto. Probá de nuevo.')
      setGuardando(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4>Producto no encontrado</h4>
        <p className="text-muted">
          Código escaneado: <strong>{codigoBarra}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Precio</label>
            <div className="modal-precio-row">
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="modal-moneda-toggle">
                <button
                  type="button"
                  className={currency === 'UYU' ? 'btn btn-primary' : 'btn btn-outline-secondary'}
                  onClick={() => setCurrency('UYU')}
                >
                  $ Pesos
                </button>
                <button
                  type="button"
                  className={currency === 'USD' ? 'btn btn-primary' : 'btn btn-outline-secondary'}
                  onClick={() => setCurrency('USD')}
                >
                  U$ Dólares
                </button>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              step="1"
              min="0"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <div className="modal-acciones">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar y agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductoNoEncontradoModal
