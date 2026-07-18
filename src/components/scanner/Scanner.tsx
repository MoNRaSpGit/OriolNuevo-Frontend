import { useRef, useState, type FormEvent } from 'react'
import '../../css/Scanner.css'

interface ProductoEncontrado {
  id: number
  name: string
  price: string
  image: string
  description: string
  currency: string
  codigo_barra: string
}

const Scanner = () => {
  const [codigo, setCodigo] = useState('')
  const [producto, setProducto] = useState<ProductoEncontrado | null>(null)
  const [estado, setEstado] = useState<'idle' | 'buscando' | 'encontrado' | 'no-encontrado' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  const buscarProducto = async (codigoBarra: string) => {
    if (!codigoBarra.trim()) return
    setEstado('buscando')
    setProducto(null)
    try {
      const res = await fetch(`/api/productos/codigo/${encodeURIComponent(codigoBarra.trim())}`)
      if (res.status === 404) {
        setEstado('no-encontrado')
        return
      }
      if (!res.ok) throw new Error('Error de backend')
      const data = await res.json()
      setProducto(data)
      setEstado('encontrado')
    } catch {
      setEstado('error')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    buscarProducto(codigo)
  }

  const handleNuevaLectura = () => {
    setCodigo('')
    setProducto(null)
    setEstado('idle')
    inputRef.current?.focus()
  }

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

      <div className="scanner-resultado">
        {estado === 'idle' && <p className="text-muted">Esperando lectura de código de barra...</p>}
        {estado === 'buscando' && <p>Buscando...</p>}
        {estado === 'error' && <p className="text-danger">No se pudo conectar con el backend.</p>}
        {estado === 'no-encontrado' && (
          <div className="alert alert-warning mb-0">
            No se encontró ningún producto con el código <strong>{codigo}</strong>.
          </div>
        )}
        {estado === 'encontrado' && producto && (
          <div className="card scanner-card">
            <div className="card-body">
              <h4 className="card-title">{producto.name}</h4>
              <p className="card-text">{producto.description}</p>
              <p className="card-text fw-bold">
                {producto.currency === 'USD' ? 'U$' : '$'}
                {producto.price}
              </p>
              <p className="card-text text-muted">Código de barra: {producto.codigo_barra}</p>
              <button className="btn btn-outline-secondary btn-sm" onClick={handleNuevaLectura}>
                Nueva lectura
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Scanner
