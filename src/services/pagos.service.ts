import { API_BASE_URL } from '../config/api'
import type { Pago } from '../types/pago'

export async function getPagos(): Promise<Pago[]> {
  const res = await fetch(`${API_BASE_URL}/api/pagos`)
  if (!res.ok) throw new Error('No se pudo obtener la lista de pagos')
  return res.json()
}

export async function crearPago(valor: number, detalle: string): Promise<Pago> {
  const res = await fetch(`${API_BASE_URL}/api/pagos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor, detalle }),
  })
  if (!res.ok) throw new Error('No se pudo crear el pago')
  return res.json()
}
