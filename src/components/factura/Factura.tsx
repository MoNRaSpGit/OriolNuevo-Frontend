import { useEffect, useState } from 'react'
import { useCarrito } from '../../context/CarritoContext'
import { getTasaDolar } from '../../services/config.service'
import CabeceraFactura, { type DatosFactura } from './CabeceraFactura'
import TablaProductoFactura from './TablaProductoFactura'
import PieFactura from './PieFactura'
import EditarDatosFacturaModal from './EditarDatosFacturaModal'
import '../../styles/factura/factura.scss'
import '../../styles/factura/logo.scss'
import '../../styles/factura/dueno.scss'
import '../../styles/factura/rectangulo.scss'
import '../../styles/factura/pie.scss'

// Valor de respaldo si falla la conexión al cargar la cotización real
// desde el backend (única fuente de verdad: config/constants.ts).
const TASA_DOLAR_RESPALDO = 40

const obtenerFechaActual = () =>
  new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })

const Factura = () => {
  const { productosSeleccionados, removeProduct } = useCarrito()
  const [finalEnDolares, setFinalEnDolares] = useState(false)
  const [tasaDolar, setTasaDolar] = useState(TASA_DOLAR_RESPALDO)

  useEffect(() => {
    getTasaDolar()
      .then(setTasaDolar)
      .catch(() => setTasaDolar(TASA_DOLAR_RESPALDO))
  }, [])

  const [modalAbierto, setModalAbierto] = useState(false)

  const [datosFactura, setDatosFactura] = useState<DatosFactura>({
    rutEmisor: '',
    eFacture: 'e-Factura',
    serie: 'A',
    fecha: obtenerFechaActual(),
    pago: 'Contado',
    moneda: 'UYU',
    rutReceptor: '',
    nombreCliente: 'Cliente final',
    direccionCliente: '',
    ubicacionCliente: 'MONTEVIDEO, URUGUAY',
  })

  if (!productosSeleccionados.length) {
    return (
      <div className="factura-container">
        <h2 className="text-center mt-4">Factura</h2>
        <p className="text-center">No hay productos agregados a la factura.</p>
      </div>
    )
  }

  let totalPesos = 0
  let totalDolares = 0

  productosSeleccionados.forEach((producto) => {
    const subtotal = producto.precio * producto.cantidad
    if (producto.currency === 'USD') {
      totalDolares += subtotal
    } else {
      totalPesos += subtotal
    }
  })

  return (
    <div className="factura-container">
      <CabeceraFactura
        datosFactura={datosFactura}
        finalEnDolares={finalEnDolares}
        onEditar={() => setModalAbierto(true)}
      />

      <div className="linea-divisoria"></div>

      <TablaProductoFactura
        productosSeleccionados={productosSeleccionados}
        handleEliminarDeFactura={removeProduct}
      />

      <div className="linea-divisoria"></div>

      <PieFactura
        totalPesos={totalPesos}
        totalDolares={totalDolares}
        finalEnDolares={finalEnDolares}
        setFinalEnDolares={setFinalEnDolares}
        tasaDolar={tasaDolar}
      />

      {modalAbierto && (
        <EditarDatosFacturaModal
          datosFactura={datosFactura}
          setDatosFactura={setDatosFactura}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  )
}

export default Factura
