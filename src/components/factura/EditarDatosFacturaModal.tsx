import type { DatosFactura } from './CabeceraFactura'
import '../../styles/scanner/modal.scss'

interface Props {
  datosFactura: DatosFactura
  setDatosFactura: (datos: DatosFactura) => void
  onCerrar: () => void
}

const EditarDatosFacturaModal = ({ datosFactura, setDatosFactura, onCerrar }: Props) => {
  const handleChange = (campo: keyof DatosFactura) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatosFactura({ ...datosFactura, [campo]: e.target.value })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4>Datos de la factura</h4>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onCerrar()
          }}
        >
          <div className="mb-3">
            <label className="form-label">RUT emisor</label>
            <input
              type="text"
              className="form-control"
              value={datosFactura.rutEmisor}
              onChange={handleChange('rutEmisor')}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="text"
              className="form-control"
              value={datosFactura.fecha}
              onChange={handleChange('fecha')}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Forma de pago</label>
            <select className="form-select" value={datosFactura.pago} onChange={handleChange('pago')}>
              <option value="Contado">Contado</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">RUT receptor</label>
            <input
              type="text"
              className="form-control"
              value={datosFactura.rutReceptor}
              onChange={handleChange('rutReceptor')}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre del cliente</label>
            <input
              type="text"
              className="form-control"
              value={datosFactura.nombreCliente}
              onChange={handleChange('nombreCliente')}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Dirección del cliente</label>
            <input
              type="text"
              className="form-control"
              value={datosFactura.direccionCliente}
              onChange={handleChange('direccionCliente')}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación del cliente</label>
            <input
              type="text"
              className="form-control"
              value={datosFactura.ubicacionCliente}
              onChange={handleChange('ubicacionCliente')}
            />
          </div>

          <div className="modal-acciones">
            <button type="submit" className="btn btn-primary">
              Listo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarDatosFacturaModal
