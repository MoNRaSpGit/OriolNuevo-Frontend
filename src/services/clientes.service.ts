import { API_BASE_URL } from '../config/api'
import type { Cliente, VentaCredito } from '../types/cliente'

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(`${API_BASE_URL}/api/clientes`)
  if (!res.ok) throw new Error('No se pudo obtener la lista de clientes')
  return res.json()
}

export async function crearCliente(nombre: string, telefono?: string): Promise<Cliente> {
  const res = await fetch(`${API_BASE_URL}/api/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, telefono }),
  })
  if (!res.ok) throw new Error('No se pudo crear el cliente')
  return res.json()
}

export async function getHistorialCliente(clienteId: number): Promise<VentaCredito[]> {
  const res = await fetch(`${API_BASE_URL}/api/clientes/${clienteId}/historial`)
  if (!res.ok) throw new Error('No se pudo obtener el historial')
  return res.json()
}
