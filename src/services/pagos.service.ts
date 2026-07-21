import { apiFetch, errorDeRespuesta } from './apiClient'
import type { Pago } from '../types/pago'

export async function getPagos(): Promise<Pago[]> {
  const res = await apiFetch('/api/pagos')
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo obtener la lista de pagos'))
  return res.json()
}

export async function crearPago(valor: number, detalle: string): Promise<Pago> {
  const res = await apiFetch('/api/pagos', {
    method: 'POST',
    body: JSON.stringify({ valor, detalle }),
  })
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo crear el pago'))
  return res.json()
}
