import { useEffect, useState, type FormEvent } from 'react'
import { actualizarProducto, getProductoPorId } from '../../services/productos.service'
import { mensajeDeError } from '../../utils/errores'
import type { Producto } from '../../types/producto'
import '../../styles/scanner/modal.scss'

interface Props {
  codigo: number
  onCancelar: () => void
  onGuardado: (producto: Producto) => void
}

const EditarProductoModal = ({ codigo, onCancelar, onGuardado }: Props) => {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductoPorId(codigo)
      .then((p) => {
        if (!p) {
          setError('No se encontró el producto.')
          return
        }
        setProducto(p)
        setName(p.name)
        setPrice(p.price)
      })
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el producto.')))
      .finally(() => setCargando(false))
  }, [codigo])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!producto) return
    const precioNum = parseFloat(price)
    if (!name.trim()) {
      setError('Ingresá el nombre del producto.')
      return
    }
    if (!precioNum || precioNum <= 0) {
      setError('Ingresá un precio válido.')
      return
    }

    setError('')
    setGuardando(true)
    try {
      const actualizado = await actualizarProducto(producto.id, {
        name: name.trim(),
        price: precioNum,
        currency: producto.currency,
        image: producto.image,
        description: producto.description,
        codigo_barra: producto.codigo_barra,
        stock: producto.stock,
      })
      onGuardado(actualizado)
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo guardar el producto. Probá de nuevo.'))
      setGuardando(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4>Editar producto</h4>

        {cargando ? (
          <p className="text-muted">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="modal-acciones">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelar} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}

        {!cargando && !producto && (
          <div className="modal-acciones">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditarProductoModal
