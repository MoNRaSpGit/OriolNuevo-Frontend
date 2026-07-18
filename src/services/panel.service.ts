import { API_BASE_URL } from '../config/api'
import type { PanelHoy } from '../types/panel'

export async function getPanelHoy(): Promise<PanelHoy> {
  const res = await fetch(`${API_BASE_URL}/api/panel/hoy`)
  if (!res.ok) throw new Error('No se pudo obtener el panel')
  return res.json()
}

export async function actualizarCambio(cambio: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/panel/cambio`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cambio }),
  })
  if (!res.ok) throw new Error('No se pudo actualizar el cambio')
}
