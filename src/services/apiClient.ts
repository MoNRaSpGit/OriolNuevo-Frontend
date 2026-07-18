import { API_BASE_URL } from '../config/api'

const API_KEY = import.meta.env.VITE_API_KEY || ''

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)
  if (API_KEY) headers.set('x-api-key', API_KEY)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers })
}
