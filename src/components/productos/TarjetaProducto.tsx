import { useState } from 'react'
import { FaFileInvoice, FaPlus, FaMinus } from 'react-icons/fa'
import { useCarrito } from '../../context/CarritoContext'
import type { ProductoDemo } from '../../data/productosDemo'
import '../../css/TarjetasProducto.css'

const LIMITE_PRODUCTOS = 8

const TarjetaProducto = ({ producto }: { producto: ProductoDemo }) => {
  const { productosSeleccionados, addOrUpdateProduct, updateProductQuantity, removeProduct } = useCarrito()
  const enBoleta = productosSeleccionados.find((p) => p.codigo === producto.id)
  const cantidad = enBoleta?.cantidad ?? 0

  const [aviso, setAviso] = useState('')

  const handleAgregar = () => {
    if (productosSeleccionados.length >= LIMITE_PRODUCTOS && !enBoleta) {
      setAviso(`Has alcanzado el límite de ${LIMITE_PRODUCTOS} productos.`)
      return
    }
    addOrUpdateProduct(producto)
  }

  const incrementarCantidad = () => {
    updateProductQuantity(producto.id, cantidad + 1)
  }

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      updateProductQuantity(producto.id, cantidad - 1)
    } else {
      removeProduct(producto.id)
    }
  }

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm">
        <div className="product-image d-flex align-items-center justify-content-center">
          {producto.image ? (
            <img src={producto.image} alt={producto.name} className="img-fluid" />
          ) : (
            <span style={{ color: '#aaa' }}>Sin imagen</span>
          )}
        </div>

        <div className="card-body text-center">
          <div className="card-content">
            <h5 className="card-title">{producto.name}</h5>
            <p className="card-text">{producto.description}</p>
            <p className="card-text fw-bold">
              {producto.currency === 'USD' ? 'U$' : '$'}
              {producto.price}
            </p>
          </div>

          <div className="divisor-botones"></div>

          {cantidad > 0 ? (
            <div className="cantidad-container">
              <button className="btn btn-outline-secondary btn-cantidad" onClick={incrementarCantidad}>
                <FaPlus />
              </button>
              <span className="cantidad-numero">{cantidad}</span>
              <button className="btn btn-outline-secondary btn-cantidad" onClick={decrementarCantidad}>
                <FaMinus />
              </button>
            </div>
          ) : (
            <div className="botones-container">
              <button className="btn mi-boton-agregar" onClick={handleAgregar}>
                <FaFileInvoice className="me-1" /> Agregar
              </button>
            </div>
          )}
          {aviso && <p className="text-danger mt-2 mb-0" style={{ fontSize: '0.85rem' }}>{aviso}</p>}
        </div>
      </div>
    </div>
  )
}

export default TarjetaProducto
