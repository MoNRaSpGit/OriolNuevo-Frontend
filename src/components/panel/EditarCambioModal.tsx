import { useState, type FormEvent } from 'react'
import '../../styles/scanner/modal.scss'

interface Props {
  valorActual: number
  onCancelar: () => void
  onGuardar: (valor: number) => Promise<void>
}

const EditarCambioModal = ({ valorActual, onCancelar, onGuardar }: Props) => {
  const [valor, setValor] = useState(String(valorActual))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const num = parseFloat(valor)
    if (Number.isNaN(num) || num < 0) {
      setError('Ingresá un valor válido.')
      return
    }
    setError('')
    setGuardando(true)
    try {
      await onGuardar(num)
    } catch {
      setError('No se pudo guardar. Probá de nuevo.')
      setGuardando(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4>Caja inicial</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Plata con la que arranca la caja</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              autoFocus
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <div className="modal-acciones">
            <button type="button" className="btn modal-btn-cancelar" onClick={onCancelar} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" className="btn modal-btn-confirmar" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarCambioModal
