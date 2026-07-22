import { useEffect, useState } from 'react'
import { getProductos } from '../../services/productos.service'
import type { Producto } from '../../types/producto'
import TarjetaProducto from './TarjetaProducto'

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError('No se pudo cargar la lista de productos.'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Productos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {cargando ? (
        <p className="text-muted">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="text-muted">Todavía no hay productos cargados.</p>
      ) : (
        <div className="row">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Productos
