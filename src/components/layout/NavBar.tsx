import { useEffect, useState } from 'react'
import { useCarrito } from '../../context/CarritoContext'
import { getHealth } from '../../services/health.service'
import '../../styles/layout/navbar.scss'

export type Vista = 'productos' | 'factura' | 'scanner' | 'clientes'

interface Props {
  vista: Vista
  setVista: (v: Vista) => void
}

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
      <div className="app-navbar-brand">Oriol</div>
      <div className="app-navbar-links">
        <button
          className={vista === 'productos' ? 'nav-link active' : 'nav-link'}
          onClick={() => setVista('productos')}
        >
          Productos
        </button>
        <button
          className={vista === 'factura' ? 'nav-link active' : 'nav-link'}
          onClick={() => setVista('factura')}
        >
          Factura
          {productosSeleccionados.length > 0 && (
            <span className="badge">{productosSeleccionados.length}</span>
          )}
        </button>
        <button
          className={vista === 'scanner' ? 'nav-link active' : 'nav-link'}
          onClick={() => setVista('scanner')}
        >
          Scanner
        </button>
        <button
          className={vista === 'clientes' ? 'nav-link active' : 'nav-link'}
          onClick={() => setVista('clientes')}
        >
          Clientes
        </button>
        {vista === 'factura' && (
          <button className="nav-link" onClick={() => window.print()}>
            Imprimir
          </button>
        )}
      </div>
      <div className="app-navbar-status">
        Backend: {apiStatus === 'checking' && '...'}
        {apiStatus === 'ok' && '✅'}
        {apiStatus === 'error' && '❌'}
      </div>
    </nav>
  )
}

export default NavBar
