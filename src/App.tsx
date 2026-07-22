import { useState } from 'react'
import { CarritoProvider } from './context/CarritoContext'
import NavBar, { type Vista } from './components/layout/NavBar'
import Productos from './components/productos/Productos'
import Factura from './components/factura/Factura'
import Scanner from './components/scanner/Scanner'
import Clientes from './components/clientes/Clientes'
import Pagos from './components/pagos/Pagos'
import PanelControl from './components/panel/PanelControl'

function App() {
  const [vista, setVista] = useState<Vista>('scanner')

  return (
    <CarritoProvider>
      <NavBar vista={vista} setVista={setVista} />
      {vista === 'productos' && <Productos />}
      {vista === 'factura' && <Factura />}
      {vista === 'scanner' && <Scanner />}
      {vista === 'clientes' && <Clientes />}
      {vista === 'pagos' && <Pagos />}
      {vista === 'panel' && <PanelControl />}
    </CarritoProvider>
  )
}

export default App
