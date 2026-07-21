import { apiFetch, errorDeRespuesta } from './apiClient'
import type { PanelHoy } from '../types/panel'

export async function getPanelHoy(): Promise<PanelHoy> {
  const res = await apiFetch('/api/panel/hoy')
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo obtener el panel'))
  return res.json()
}

export async function actualizarCambio(cambio: number): Promise<void> {
  const res = await apiFetch('/api/panel/cambio', {
    method: 'PUT',
    body: JSON.stringify({ cambio }),
  })
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo actualizar el cambio'))
}
