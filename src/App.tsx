import { useState } from 'react'
import { CarritoProvider } from './context/CarritoContext'
import NavBar, { type Vista } from './components/layout/NavBar'
import Productos from './components/productos/Productos'
import Factura from './components/factura/Factura'
import Scanner from './components/scanner/Scanner'
import Clientes from './components/clientes/Clientes'

function App() {
  const [vista, setVista] = useState<Vista>('productos')

  return (
    <CarritoProvider>
      <NavBar vista={vista} setVista={setVista} />
      {vista === 'productos' && <Productos />}
      {vista === 'factura' && <Factura />}
      {vista === 'scanner' && <Scanner />}
      {vista === 'clientes' && <Clientes />}
    </CarritoProvider>
  )
}

export default App
