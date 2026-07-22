import { useEffect, useState } from 'react'
import { getProductos } from '../../services/productos.service'
import { mensajeDeError } from '../../utils/errores'
import type { Producto } from '../../types/producto'
import '../../styles/stock/stock.scss'

const STOCK_LIMITE_ROJO = 3
const STOCK_LIMITE_AMARILLO = 6

const nivelDeStock = (stock: number) => {
  if (stock <= STOCK_LIMITE_ROJO) return 'rojo'
  if (stock <= STOCK_LIMITE_AMARILLO) return 'amarillo'
  return null
}

const Stock = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el stock.')))
      .finally(() => setCargando(false))
  }, [])

  const productosBajoStock = productos
    .filter((p) => nivelDeStock(p.stock) !== null)
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
            <div key={p.id} className={`stock-item stock-item--${nivelDeStock(p.stock)}`}>
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
    </div>
  )
}

export default Stock
