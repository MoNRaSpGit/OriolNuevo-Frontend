import { API_BASE_URL } from '../config/api'

export async function getHealth(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/health`)
  if (!res.ok) return false
  const data = await res.json()
  return data.status === 'ok'
}
