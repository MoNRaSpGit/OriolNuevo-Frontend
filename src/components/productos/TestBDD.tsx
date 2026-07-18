import { useState } from 'react'
import { API_BASE_URL } from '../../config/api'

interface ProductoBDD {
  id: number
  name: string
  price: string
  image: string
  description: string
  currency: string
}

const TestBDD = () => {
  const [productos, setProductos] = useState<ProductoBDD[] | null>(null)
  const [error, setError] = useState('')

  const probarConexion = async () => {
    setError('')
    setProductos(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/productos`)
      if (!res.ok) throw new Error('Respuesta no OK del backend')
      const data = await res.json()
      setProductos(data)
    } catch {
      setError('No se pudo conectar con la base de datos')
    }
  }

  return (
    <div className="container mt-3 mb-4">
      <div className="border rounded p-3 bg-light">
        <h5>Test de conexión Front → Back → BDD</h5>
        <button className="btn btn-primary btn-sm" onClick={probarConexion}>
          Traer productos de la BDD (tabla oriolnuevo_prodcutos)
        </button>

        {error && <p className="text-danger mt-2 mb-0">{error}</p>}

        {productos && (
          <ul className="mt-3 mb-0">
            {productos.length === 0 && <li>La tabla está vacía.</li>}
            {productos.map((p) => (
              <li key={p.id}>
                #{p.id} — {p.name} — {p.currency} {p.price} — {p.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TestBDD
