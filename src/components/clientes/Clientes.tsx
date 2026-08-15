import { useEffect, useState } from 'react'
import { getClientes } from '../../services/clientes.service'
import { mensajeDeError } from '../../utils/errores'
import type { Cliente } from '../../types/cliente'
import type { Venta } from '../../types/venta'
import AltaCliente from './AltaCliente'
import ListaClientes from './ListaClientes'
import DetalleCliente from './DetalleCliente'
import BoletaReimpresa from './BoletaReimpresa'
import '../../styles/clientes/clientes.scss'

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [boletaAReimprimir, setBoletaAReimprimir] = useState<Venta | null>(null)

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar la lista de clientes.')))
      .finally(() => setCargando(false))
  }, [])

  const handleClienteCreado = (nuevo: Cliente) => {
    setClientes((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)))
  }

  if (boletaAReimprimir && clienteSeleccionado) {
    return (
      <BoletaReimpresa
        venta={boletaAReimprimir}
        cliente={clienteSeleccionado}
        onVolver={() => setBoletaAReimprimir(null)}
      />
    )
  }

  return (
    <div className="container-fluid mt-4 clientes-container">
      <h2 className="mb-4">Clientes</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="clientes-columnas">
        <div className="clientes-col">
          <h5>Alta de cliente</h5>
          <AltaCliente onCreado={handleClienteCreado} />
        </div>

        <div className="clientes-col">
          <h5>Clientes</h5>
          <ListaClientes
            clientes={clientes}
            cargando={cargando}
            clienteSeleccionadoId={clienteSeleccionado?.id ?? null}
            onSeleccionar={setClienteSeleccionado}
          />
        </div>

        <div className="clientes-col">
          <h5>Detalle</h5>
          {clienteSeleccionado ? (
            <DetalleCliente cliente={clienteSeleccionado} onReimprimir={setBoletaAReimprimir} />
          ) : (
            <p className="text-muted">Seleccioná un cliente para ver su detalle.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clientes
