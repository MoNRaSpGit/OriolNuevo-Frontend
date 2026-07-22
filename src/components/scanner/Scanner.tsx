import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useCarrito } from '../../context/CarritoContext'
import { getProductoPorCodigoBarra, buscarProductosPorNombre } from '../../services/productos.service'
import ProductoNoEncontradoModal from './ProductoNoEncontradoModal'
import CheckoutModal from './CheckoutModal'
import { mensajeDeError } from '../../utils/errores'
import type { Producto } from '../../types/producto'
import '../../styles/scanner/scanner.scss'

const esSoloDigitos = (texto: string) => /^\d+$/.test(texto.trim())

const Scanner = () => {
  const { productosSeleccionados, addOrUpdateProduct, removeProduct, vaciarCarrito } = useCarrito()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [codigoNoEncontrado, setCodigoNoEncontrado] = useState<string | null>(null)
  const [mostrarCheckout, setMostrarCheckout] = useState(false)
  const [ventaConfirmada, setVentaConfirmada] = useState(false)
  const [resultadosNombre, setResultadosNombre] = useState<Producto[]>([])
  const [buscandoNombre, setBuscandoNombre] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const modoNombre = query.trim().length > 0 && !esSoloDigitos(query)

  // Mientras se tipea un nombre (contiene letras), busca en vivo con debounce.
  // Si es solo dígitos (código de barra, sea escaneado o tipeado), no hace
  // falta buscar por cada tecla: se espera al Enter/submit para un match exacto.
  useEffect(() => {
    if (!modoNombre || query.trim().length < 2) {
      setResultadosNombre([])
      return
    }
    setBuscandoNombre(true)
    const timeoutId = setTimeout(() => {
      buscarProductosPorNombre(query.trim())
        .then(setResultadosNombre)
        .catch(() => setResultadosNombre([]))
        .finally(() => setBuscandoNombre(false))
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query, modoNombre])

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

  const buscarPorCodigoBarra = async (codigoBarra: string) => {
    setError('')
    try {
      const producto = await getProductoPorCodigoBarra(codigoBarra.trim())
      if (!producto) {
        setCodigoNoEncontrado(codigoBarra.trim())
        return
      }
      agregarAlCarrito(producto)
      setQuery('')
      inputRef.current?.focus()
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo conectar con el backend.'))
      setQuery('')
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const texto = query.trim()
    if (!texto) return
    // Enter solo dispara el match exacto por código de barra.
    // La búsqueda por nombre se resuelve haciendo click en un resultado.
    if (esSoloDigitos(texto)) {
      buscarPorCodigoBarra(texto)
    }
  }

  const handleProductoGuardado = (producto: Producto) => {
    agregarAlCarrito(producto)
    setCodigoNoEncontrado(null)
    setQuery('')
    inputRef.current?.focus()
  }

  const handleCancelarModal = () => {
    setCodigoNoEncontrado(null)
    setQuery('')
    inputRef.current?.focus()
  }

  const handleSeleccionarResultado = (producto: Producto) => {
    agregarAlCarrito(producto)
    setQuery('')
    setResultadosNombre([])
    inputRef.current?.focus()
  }

  const handleVentaConfirmada = () => {
    vaciarCarrito()
    setMostrarCheckout(false)
    setVentaConfirmada(true)
    setQuery('')
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
        <div className="scanner-busqueda">
          <input
            ref={inputRef}
            type="text"
            autoFocus
            className="form-control scanner-input"
            placeholder="Escaneá el código de barra o escribí el nombre del producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {buscandoNombre && <p className="text-muted mb-0 mt-1">Buscando...</p>}
          {resultadosNombre.length > 0 && (
            <ul className="scanner-resultados-nombre">
              {resultadosNombre.map((producto) => (
                <li key={producto.id} onClick={() => handleSeleccionarResultado(producto)}>
                  <span className="scanner-resultado-nombre">{producto.name}</span>
                  <span className="scanner-resultado-precio">
                    {producto.currency === 'USD' ? 'U$' : '$'}
                    {producto.price}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {modoNombre && !buscandoNombre && query.trim().length >= 2 && resultadosNombre.length === 0 && (
            <p className="text-muted mb-0 mt-1">Sin resultados.</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary btn-lg">
          Buscar
        </button>
      </form>

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
              <button
                type="button"
                className="scanner-item-quitar"
                onClick={() => removeProduct(p.codigo)}
                aria-label={`Quitar ${p.name}`}
              >
                ×
              </button>
            </div>
          ))}

          <div className="scanner-total">
            {totalPesos > 0 && <div>Total $: {totalPesos.toFixed(2)}</div>}
            {totalDolares > 0 && <div>Total U$: {totalDolares.toFixed(2)}</div>}
          </div>

          <button className="btn btn-success btn-lg mt-3 w-100" onClick={() => setMostrarCheckout(true)}>
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
