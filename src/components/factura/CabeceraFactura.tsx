import '../../css/Cabezera.css'

export interface DatosFactura {
  rutEmisor: string
  eFacture: string
  serie: string
  fecha: string
  pago: string
  moneda: string
  rutReceptor: string
  nombreCliente: string
  direccionCliente: string
  ubicacionCliente: string
}

interface Props {
  datosFactura: DatosFactura
  finalEnDolares: boolean
}

const CabeceraFactura = ({ datosFactura, finalEnDolares }: Props) => {
  const monedaAMostrar = finalEnDolares ? 'USD' : datosFactura.moneda

  return (
    <div className="factura-header">
      <div className="logo-dueno-container">
        <div className="factura-logo-container">
          {/* Coloca tu logo en src/assets/logo.png */}
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>LOGO</div>
        </div>
        <div className="dueno">
          <div className="dueno-nombre"></div>
          <div className="dueno-nombre">NOMBRE DE LA EMPRESA</div>
          <div className="dueno-telefono">00000000 - 000000000</div>
        </div>
      </div>

      <div className="header-box">
        <div className="header-row header-rut">RUT EMISOR: {datosFactura.rutEmisor}</div>
        <div className="header-row header-efacture">{datosFactura.eFacture}</div>
        <div className="header-multi">
          <div className="header-titles-values">
            <div className="header-col header-title">SERIE</div>
            <div className="header-col header-title">FECHA</div>
            <div className="header-col header-title">PAGO</div>
            <div className="header-col header-title">MONEDA</div>
          </div>
          <div className="header-titles-values">
            <div className="header-col header-value">{datosFactura.serie}</div>
            <div className="header-col header-value">{datosFactura.fecha}</div>
            <div className="header-col header-value">{datosFactura.pago}</div>
            <div className="header-col header-value">{monedaAMostrar}</div>
          </div>
        </div>
        <div className="header-row header-receptor">RUT RECEPTOR: {datosFactura.rutReceptor}</div>
        <div className="header-row header-cliente">
          <div className="nombre-cliente">{datosFactura.nombreCliente}</div>
          <div>{datosFactura.direccionCliente}</div>
          <div>{datosFactura.ubicacionCliente}</div>
        </div>
      </div>
    </div>
  )
}

export default CabeceraFactura
