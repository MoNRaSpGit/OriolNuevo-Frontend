import { apiFetch, errorDeRespuesta } from './apiClient'

export async function getTasaDolar(): Promise<number> {
  const res = await apiFetch('/config')
  if (!res.ok) throw new Error(await errorDeRespuesta(res, 'No se pudo obtener la configuración'))
  const data = (await res.json()) as { tasaDolar: number }
  return data.tasaDolar
}
