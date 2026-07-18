import { apiFetch } from './apiClient'

export async function getHealth(): Promise<boolean> {
  const res = await apiFetch('/api/health')
  if (!res.ok) return false
  const data = await res.json()
  return data.status === 'ok'
}
