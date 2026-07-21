import { API_BASE_URL } from '../config/api'

const API_KEY = import.meta.env.VITE_API_KEY || ''

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)
  if (API_KEY) headers.set('x-api-key', API_KEY)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    // fetch solo tira acá por fallas de red o bloqueos de CORS — el browser
    // no expone mas detalle que esto por seguridad.
    throw new Error('No se pudo conectar con el servidor (red o CORS).')
  }
}

// Arma un mensaje de error legible a partir de una respuesta no-ok:
// incluye el código HTTP y, si el backend mandó { error: "..." }, ese texto.
export async function errorDeRespuesta(res: Response, mensajePorDefecto: string): Promise<string> {
  const data = await res.json().catch(() => null)
  const detalle = data?.error || mensajePorDefecto
  return `(${res.status}) ${detalle}`
}
