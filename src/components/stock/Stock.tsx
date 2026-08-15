import { useEffect, useState } from 'react'
import { getProductos } from '../../services/productos.service'
import { mensajeDeError } from '../../utils/errores'
import type { Producto } from '../../types/producto'
import AjustarStockModal from './AjustarStockModal'
import '../../styles/stock/stock.scss'

export const STOCK_LIMITE_ROJO = 3
export const STOCK_LIMITE_AMARILLO = 6

export const nivelDeStock = (stock: number, stockMinimo: number | null = null) => {
  if (stockMinimo !== null) {
    return stock < stockMinimo ? 'rojo' : null
  }
  if (stock <= STOCK_LIMITE_ROJO) return 'rojo'
  if (stock <= STOCK_LIMITE_AMARILLO) return 'amarillo'
  return null
}

const Stock = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el stock.')))
      .finally(() => setCargando(false))
  }, [])

  const handleActualizado = (actualizado: Producto) => {
    setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)))
    setProductoSeleccionado(null)
  }

  const productosBajoStock = productos
    .filter((p) => nivelDeStock(p.stock, p.stock_minimo) !== null)
    .sort((a, b) => a.stock - b.stock)

  return (
    <div className="container mt-4 stock-container">
      <h2 className="mb-4">Stock bajo</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {cargando ? (
        <p className="text-muted">Cargando...</p>
      ) : productosBajoStock.length === 0 ? (
        <p className="text-muted">No hay productos con stock bajo.</p>
      ) : (
        <div className="stock-lista">
          {productosBajoStock.map((p) => (
            <div
              key={p.id}
              className={`stock-item stock-item--${nivelDeStock(p.stock, p.stock_minimo)}`}
              onClick={() => setProductoSeleccionado(p)}
              role="button"
            >
              <div className="stock-item-info">
                <div className="stock-item-nombre">{p.name}</div>
                <div className="stock-item-precio">
                  {p.currency === 'USD' ? 'U$' : '$'}
                  {p.price}
                </div>
              </div>
              <div className="stock-item-cantidad">
                <span className="stock-item-badge">{p.stock}</span>
                <span className="stock-item-label">{p.stock === 1 ? 'unidad' : 'unidades'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <AjustarStockModal
          producto={productoSeleccionado}
          onCancelar={() => setProductoSeleccionado(null)}
          onActualizado={handleActualizado}
        />
      )}
    </div>
  )
}

export default Stock
