import { apiFetch } from './apiClient'
import type { Cliente } from '../types/cliente'
import type { Venta } from '../types/venta'

export async function getClientes(): Promise<Cliente[]> {
  const res = await apiFetch('/api/clientes')
  if (!res.ok) throw new Error('No se pudo obtener la lista de clientes')
  return res.json()
}

export async function crearCliente(nombre: string, telefono?: string): Promise<Cliente> {
  const res = await apiFetch('/api/clientes', {
    method: 'POST',
    body: JSON.stringify({ nombre, telefono }),
  })
  if (!res.ok) throw new Error('No se pudo crear el cliente')
  return res.json()
}

export async function getHistorialCliente(clienteId: number): Promise<Venta[]> {
  const res = await apiFetch(`/api/clientes/${clienteId}/historial`)
  if (!res.ok) throw new Error('No se pudo obtener el historial')
  return res.json()
}
