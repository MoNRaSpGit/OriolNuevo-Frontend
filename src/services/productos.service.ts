import { apiFetch } from './apiClient'
import type { Producto } from '../types/producto'

export async function getProductos(): Promise<Producto[]> {
  const res = await apiFetch('/api/productos')
  if (!res.ok) throw new Error('No se pudo obtener la lista de productos')
  return res.json()
}

export async function getProductoPorCodigoBarra(codigoBarra: string): Promise<Producto | null> {
  const res = await apiFetch(`/api/productos/codigo/${encodeURIComponent(codigoBarra)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('No se pudo buscar el producto')
  return res.json()
}

export interface NuevoProducto {
  name: string
  price: number
  currency: 'UYU' | 'USD'
  codigo_barra: string
  stock: number
}

export async function crearProducto(producto: NuevoProducto): Promise<Producto> {
  const res = await apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify({ ...producto, image: '', description: '' }),
  })
  if (!res.ok) throw new Error('No se pudo crear el producto')
  return res.json()
}
