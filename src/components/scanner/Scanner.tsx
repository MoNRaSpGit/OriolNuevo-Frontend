import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useCarrito } from '../../context/CarritoContext'
import { getProductoPorCodigoBarra, buscarProductosPorNombre } from '../../services/productos.service'
import ProductoNoEncontradoModal from './ProductoNoEncontradoModal'
import CheckoutModal from './CheckoutModal'
import type { Producto } from '../../types/producto'
import '../../styles/scanner/scanner.scss'

const Scanner = () => {
  const { productosSeleccionados, addOrUpdateProduct, vaciarCarrito } = useCarrito()
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [codigoNoEncontrado, setCodigoNoEncontrado] = useState<string | null>(null)
  const [mostrarCheckout, setMostrarCheckout] = useState(false)
  const [ventaConfirmada, setVentaConfirmada] = useState(false)
  const [nombreQuery, setNombreQuery] = useState('')
  const [resultadosNombre, setResultadosNombre] = useState<Producto[]>([])
  const [buscandoNombre, setBuscandoNombre] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (nombreQuery.trim().length < 2) {
      setResultadosNombre([])
      return
    }
    setBuscandoNombre(true)
    const timeoutId = setTimeout(() => {
      buscarProductosPorNombre(nombreQuery.trim())
        .then(setResultadosNombre)
        .catch(() => setResultadosNombre([]))
        .finally(() => setBuscandoNombre(false))
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [nombreQuery])

  const agregarAlCarrito = (producto: Producto) => {
    addOrUpdateProduct({
      id: producto.id,
      name: producto.name,
      description: producto.description,
      price: parseFloat(producto.price),
      currency: producto.currency,
      image: producto.image,
    })
  }

  const buscarProducto = async (codigoBarra: string) => {
    if (!codigoBarra.trim()) return
    setError('')
    try {
      const producto = await getProductoPorCodigoBarra(codigoBarra.trim())
      if (!producto) {
        setCodigoNoEncontrado(codigoBarra.trim())
        return
      }
      agregarAlCarrito(producto)
      setCodigo('')
      inputRef.current?.focus()
    } catch {
      setError('No se pudo conectar con el backend.')
      setCodigo('')
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    buscarProducto(codigo)
  }

  const handleProductoGuardado = (producto: Producto) => {
    agregarAlCarrito(producto)
    setCodigoNoEncontrado(null)
    setCodigo('')
    inputRef.current?.focus()
  }

  const handleCancelarModal = () => {
    setCodigoNoEncontrado(null)
    setCodigo('')
    inputRef.current?.focus()
  }

  const handleSeleccionarPorNombre = (producto: Producto) => {
    agregarAlCarrito(producto)
    setNombreQuery('')
    setResultadosNombre([])
  }

  const handleVentaConfirmada = () => {
    vaciarCarrito()
    setMostrarCheckout(false)
    setVentaConfirmada(true)
    setCodigo('')
    inputRef.current?.focus()
    setTimeout(() => setVentaConfirmada(false), 4000)
  }

  let totalPesos = 0
  let totalDolares = 0
  productosSeleccionados.forEach((p) => {
    if (p.currency === 'USD') totalDolares += p.total
    else totalPesos += p.total
  })

  return (
    <div className="container mt-4 scanner-container">
      <h2 className="mb-4">Scanner</h2>

      <form onSubmit={handleSubmit} className="scanner-form">
        <input
          ref={inputRef}
          type="text"
          autoFocus
          className="form-control scanner-input"
          placeholder="Escaneá o escribí el código de barra..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="scanner-busqueda-nombre">
        <input
          type="text"
          className="form-control"
          placeholder="...o buscá por nombre del producto"
          value={nombreQuery}
          onChange={(e) => setNombreQuery(e.target.value)}
        />
        {buscandoNombre && <p className="text-muted mb-0 mt-1">Buscando...</p>}
        {resultadosNombre.length > 0 && (
          <ul className="scanner-resultados-nombre">
            {resultadosNombre.map((producto) => (
              <li key={producto.id} onClick={() => handleSeleccionarPorNombre(producto)}>
                <span className="scanner-resultado-nombre">{producto.name}</span>
                <span className="scanner-resultado-precio">
                  {producto.currency === 'USD' ? 'U$' : '$'}
                  {producto.price}
                </span>
              </li>
            ))}
          </ul>
        )}
        {!buscandoNombre && nombreQuery.trim().length >= 2 && resultadosNombre.length === 0 && (
          <p className="text-muted mb-0 mt-1">Sin resultados.</p>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {ventaConfirmada && <div className="alert alert-success">Venta confirmada correctamente.</div>}

      {productosSeleccionados.length === 0 ? (
        <p className="text-muted">Esperando lectura de código de barra...</p>
      ) : (
        <div className="scanner-lista">
          {productosSeleccionados.map((p) => (
            <div className="scanner-item" key={p.codigo}>
              <div className="scanner-item-img">
                {p.image ? <img src={p.image} alt={p.name} /> : <span>Sin imagen</span>}
              </div>
              <div className="scanner-item-info">
                <div className="scanner-item-nombre">{p.name}</div>
                <div className="scanner-item-precio">
                  {p.currency === 'USD' ? 'U$' : '$'}
                  {p.precio.toFixed(2)} c/u
                </div>
              </div>
              <div className="scanner-item-cantidad">x{p.cantidad}</div>
              <div className="scanner-item-total">
                {p.currency === 'USD' ? 'U$' : '$'}
                {p.total.toFixed(2)}
              </div>
            </div>
          ))}

          <div className="scanner-total">
            {totalPesos > 0 && <div>Total $: {totalPesos.toFixed(2)}</div>}
            {totalDolares > 0 && <div>Total U$: {totalDolares.toFixed(2)}</div>}
          </div>

          <button className="btn btn-success mt-3" onClick={() => setMostrarCheckout(true)}>
            Confirmar compra
          </button>
        </div>
      )}

      {codigoNoEncontrado && (
        <ProductoNoEncontradoModal
          codigoBarra={codigoNoEncontrado}
          onCancelar={handleCancelarModal}
          onGuardado={handleProductoGuardado}
        />
      )}

      {mostrarCheckout && (
        <CheckoutModal
          productos={productosSeleccionados}
          totalPesos={totalPesos}
          totalDolares={totalDolares}
          onCancelar={() => setMostrarCheckout(false)}
          onConfirmado={handleVentaConfirmada}
        />
      )}
    </div>
  )
}

export default Scanner
