import { useRef, useState, type FormEvent } from 'react'
import { useCarrito } from '../../context/CarritoContext'
import { getProductoPorCodigoBarra } from '../../services/productos.service'
import '../../styles/scanner/scanner.scss'

const Scanner = () => {
  const { productosSeleccionados, addOrUpdateProduct } = useCarrito()
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'no-encontrado'; texto: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const buscarProducto = async (codigoBarra: string) => {
    if (!codigoBarra.trim()) return
    setMensaje(null)
    try {
      const producto = await getProductoPorCodigoBarra(codigoBarra.trim())
      if (!producto) {
        setMensaje({ tipo: 'no-encontrado', texto: `No se encontró ningún producto con el código ${codigoBarra}.` })
        return
      }
      addOrUpdateProduct({
        id: producto.id,
        name: producto.name,
        description: producto.description,
        price: parseFloat(producto.price),
        currency: producto.currency,
        image: producto.image,
      })
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el backend.' })
    } finally {
      setCodigo('')
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    buscarProducto(codigo)
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

      {mensaje && (
        <div className={`alert ${mensaje.tipo === 'error' ? 'alert-danger' : 'alert-warning'}`}>
          {mensaje.texto}
        </div>
      )}

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
        </div>
      )}
    </div>
  )
}

export default Scanner
