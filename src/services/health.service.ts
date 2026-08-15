import { API_BASE_URL } from '../config/api'

// El keepalive-ping (contra el cold-start del free tier) apunta al health
// check compartido de la plataforma (fuera del prefijo /oriol, que es
// especifico de este modulo), asi que no pasa por apiFetch.
export async function getHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`)
    if (!res.ok) return false
    const data = await res.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}
