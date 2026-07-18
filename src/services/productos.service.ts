import { API_BASE_URL } from '../config/api'
import type { Producto } from '../types/producto'

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_BASE_URL}/api/productos`)
  if (!res.ok) throw new Error('No se pudo obtener la lista de productos')
  return res.json()
}

export async function getProductoPorCodigoBarra(codigoBarra: string): Promise<Producto | null> {
  const res = await fetch(`${API_BASE_URL}/api/productos/codigo/${encodeURIComponent(codigoBarra)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('No se pudo buscar el producto')
  return res.json()
}
