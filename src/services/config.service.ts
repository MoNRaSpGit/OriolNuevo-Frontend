import { apiFetch } from './apiClient'

export async function getTasaDolar(): Promise<number> {
  const res = await apiFetch('/api/config')
  if (!res.ok) throw new Error('No se pudo obtener la configuración')
  const data = await res.json()
  return data.tasa_dolar
}
