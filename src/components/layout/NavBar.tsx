import { useEffect, useRef, useState } from 'react'
import {
  FaBoxOpen,
  FaFileInvoice,
  FaBarcode,
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaUserCircle,
} from 'react-icons/fa'
import { useCarrito } from '../../context/CarritoContext'
import { getHealth } from '../../services/health.service'
import '../../styles/layout/navbar.scss'

export type Vista = 'productos' | 'factura' | 'scanner' | 'clientes' | 'pagos' | 'panel'

interface Props {
  vista: Vista
  setVista: (v: Vista) => void
}

interface Tab {
  vista: Vista
  etiqueta: string
  icono: React.ReactNode
}

const TABS_VISIBLES: Tab[] = [
  { vista: 'scanner', etiqueta: 'Scanner', icono: <FaBarcode /> },
  { vista: 'factura', etiqueta: 'Factura', icono: <FaFileInvoice /> },
]

const TABS_MENU: Tab[] = [
  { vista: 'productos', etiqueta: 'Productos', icono: <FaBoxOpen /> },
  { vista: 'clientes', etiqueta: 'Clientes', icono: <FaUsers /> },
  { vista: 'pagos', etiqueta: 'Pagos', icono: <FaMoneyBillWave /> },
  { vista: 'panel', etiqueta: 'Panel', icono: <FaChartBar /> },
]

const NavBar = ({ vista, setVista }: Props) => {
  const { productosSeleccionados } = useCarrito()
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getHealth()
      .then((ok) => setApiStatus(ok ? 'ok' : 'error'))
      .catch(() => setApiStatus('error'))
  }, [])

  useEffect(() => {
    if (!menuAbierto) return
    const cerrarSiEsAfuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', cerrarSiEsAfuera)
    return () => document.removeEventListener('mousedown', cerrarSiEsAfuera)
  }, [menuAbierto])

  const irA = (v: Vista) => {
    setVista(v)
    setMenuAbierto(false)
  }

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
        {TABS_VISIBLES.map((tab) => (
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

        <div className="app-navbar-menu" ref={menuRef}>
          <button
            className={TABS_MENU.some((t) => t.vista === vista) ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Más opciones"
          >
            <span className="nav-link-icono">
              <FaUserCircle />
            </span>
          </button>

          {menuAbierto && (
            <div className="app-navbar-dropdown">
              {TABS_MENU.map((tab) => (
                <button
                  key={tab.vista}
                  className={vista === tab.vista ? 'dropdown-item active' : 'dropdown-item'}
                  onClick={() => irA(tab.vista)}
                >
                  <span className="nav-link-icono">{tab.icono}</span>
                  <span>{tab.etiqueta}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
