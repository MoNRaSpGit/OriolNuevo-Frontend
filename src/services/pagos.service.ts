import { apiFetch, errorDeRespuesta } from './apiClient'
import type { Pago } from '../types/pago'

interface PagoApi {
  id: number
  valor: number
  detalle: string
  fecha: string
}

function aPago(item: PagoApi): Pago {
  return { id: item.id, valor: String(item.valor), detalle: item.detalle, fecha: item.fecha }
}

export async function getPagos(): Promise<Pago[]> {
  const res = await apiFetch('/pagos')
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo obtener la lista de pagos'))
  const data = (await res.json()) as { items: PagoApi[] }
  return data.items.map(aPago)
}

export async function crearPago(valor: number, detalle: string): Promise<Pago> {
  const res = await apiFetch('/pagos', {
    method: 'POST',
    body: JSON.stringify({ valor, detalle }),
  })
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo crear el pago'))
  const data = (await res.json()) as { item: PagoApi }
  return aPago(data.item)
}
