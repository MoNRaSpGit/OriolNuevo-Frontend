import { useEffect, useState } from 'react'
import { CarritoProvider, useCarrito } from './context/CarritoContext'
import Productos from './components/productos/Productos'
import Factura from './components/factura/Factura'
import Scanner from './components/scanner/Scanner'
import { API_BASE_URL } from './config/api'
import './App.css'

type Vista = 'productos' | 'factura' | 'scanner'

function NavBar({ vista, setVista }: { vista: Vista; setVista: (v: Vista) => void }) {
  const { productosSeleccionados } = useCarrito()
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status === 'ok' ? 'ok' : 'error'))
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

function App() {
  const [vista, setVista] = useState<Vista>('productos')

  return (
    <CarritoProvider>
      <NavBar vista={vista} setVista={setVista} />
      {vista === 'productos' && <Productos />}
      {vista === 'factura' && <Factura />}
      {vista === 'scanner' && <Scanner />}
    </CarritoProvider>
  )
}

export default App
