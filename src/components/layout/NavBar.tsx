import { useEffect, useState } from 'react'
import {
  FaBoxOpen,
  FaFileInvoice,
  FaBarcode,
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaPrint,
} from 'react-icons/fa'
import { useCarrito } from '../../context/CarritoContext'
import { getHealth } from '../../services/health.service'
import '../../styles/layout/navbar.scss'

export type Vista = 'productos' | 'factura' | 'scanner' | 'clientes' | 'pagos' | 'panel'

interface Props {
  vista: Vista
  setVista: (v: Vista) => void
}

const TABS: { vista: Vista; etiqueta: string; icono: React.ReactNode }[] = [
  { vista: 'productos', etiqueta: 'Productos', icono: <FaBoxOpen /> },
  { vista: 'factura', etiqueta: 'Factura', icono: <FaFileInvoice /> },
  { vista: 'scanner', etiqueta: 'Scanner', icono: <FaBarcode /> },
  { vista: 'clientes', etiqueta: 'Clientes', icono: <FaUsers /> },
  { vista: 'pagos', etiqueta: 'Pagos', icono: <FaMoneyBillWave /> },
  { vista: 'panel', etiqueta: 'Panel', icono: <FaChartBar /> },
]

const NavBar = ({ vista, setVista }: Props) => {
  const { productosSeleccionados } = useCarrito()
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking')

  useEffect(() => {
    getHealth()
      .then((ok) => setApiStatus(ok ? 'ok' : 'error'))
      .catch(() => setApiStatus('error'))
  }, [])

  return (
    <nav className="app-navbar">
      <div className="app-navbar-top">
        <div className="app-navbar-brand">Oriol</div>
        <div className={`app-navbar-status app-navbar-status--${apiStatus}`}>
          <span className="app-navbar-status-dot" />
          {apiStatus === 'checking' && 'Conectando...'}
          {apiStatus === 'ok' && 'Conectado'}
          {apiStatus === 'error' && 'Sin conexión'}
        </div>
      </div>

      <div className="app-navbar-links">
        {TABS.map((tab) => (
          <button
            key={tab.vista}
            className={vista === tab.vista ? 'nav-link active' : 'nav-link'}
            onClick={() => setVista(tab.vista)}
          >
            <span className="nav-link-icono">{tab.icono}</span>
            <span className="nav-link-texto">{tab.etiqueta}</span>
            {tab.vista === 'factura' && productosSeleccionados.length > 0 && (
              <span className="badge">{productosSeleccionados.length}</span>
            )}
          </button>
        ))}

        {vista === 'factura' && (
          <button className="nav-link nav-link-imprimir" onClick={() => window.print()}>
            <span className="nav-link-icono">
              <FaPrint />
            </span>
            <span className="nav-link-texto">Imprimir</span>
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar
