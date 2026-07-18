import { useState } from 'react'
import { useCarrito } from '../../context/CarritoContext'
import CabeceraFactura, { type DatosFactura } from './CabeceraFactura'
import TablaProductoFactura from './TablaProductoFactura'
import PieFactura from './PieFactura'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/factura/factura.scss'
import '../../styles/factura/logo.scss'
import '../../styles/factura/dueno.scss'
import '../../styles/factura/rectangulo.scss'
import '../../styles/factura/pie.scss'

const TASA_DOLAR = 40

const obtenerFechaActual = () =>
  new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })

const Factura = () => {
  const { productosSeleccionados, removeProduct } = useCarrito()
  const [finalEnDolares, setFinalEnDolares] = useState(false)

  const [datosFactura] = useState<DatosFactura>({
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
      <CabeceraFactura datosFactura={datosFactura} finalEnDolares={finalEnDolares} />

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
        tasaDolar={TASA_DOLAR}
      />
    </div>
  )
}

export default Factura
