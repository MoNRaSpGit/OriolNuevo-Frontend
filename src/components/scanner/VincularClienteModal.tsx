import { useState, type FormEvent } from 'react'
import type { Cliente } from '../../types/cliente'
import '../../styles/scanner/modal.scss'

export interface ClienteVinculado {
  tipo: 'existente' | 'nuevo'
  clienteId?: number
  nombre: string
  telefono?: string
  cedula?: string
}

interface Props {
  clientes: Cliente[]
  onCancelar: () => void
  onConfirmar: (cliente: ClienteVinculado) => void
}

const VincularClienteModal = ({ clientes, onCancelar, onConfirmar }: Props) => {
  const [clienteId, setClienteId] = useState<number | ''>('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cedula, setCedula] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (clienteId) {
      const existente = clientes.find((c) => c.id === clienteId)
      if (!existente) return
      onConfirmar({ tipo: 'existente', clienteId: existente.id, nombre: existente.nombre })
      return
    }
    if (!nombre.trim()) {
      setError('Ingresá el nombre del cliente.')
      return
    }
    onConfirmar({
      tipo: 'nuevo',
      nombre: nombre.trim(),
      telefono: telefono.trim() || undefined,
      cedula: cedula.trim() || undefined,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4>Guardar boleta a nombre de un cliente</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Cliente existente</label>
            <select
              className="form-select"
              value={clienteId}
              disabled={!!nombre.trim()}
              onChange={(e) => setClienteId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Seleccioná un cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <hr />

          <p className="form-label">O cliente nuevo</p>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={!!clienteId}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              disabled={!!clienteId}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cédula (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              disabled={!!clienteId}
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <div className="modal-acciones">
            <button type="button" className="btn modal-btn-cancelar" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn modal-btn-confirmar">
              Guardar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VincularClienteModal
