import 'bootstrap/dist/css/bootstrap.min.css'
import { productosDemo } from '../../data/productosDemo'
import TarjetaProducto from './TarjetaProducto'
import TestBDD from './TestBDD'

const Productos = () => {
  return (
    <div className="container mt-4">
      <TestBDD />
      <h2 className="mb-4">Productos</h2>
      <div className="row">
        {productosDemo.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}

export default Productos
