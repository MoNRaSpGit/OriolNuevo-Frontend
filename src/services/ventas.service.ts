import { API_BASE_URL } from '../config/api'
import type { ItemVenta } from '../types/venta'

export interface NuevaVentaCredito {
  cliente_id: number
  total_pesos: number
  total_dolares: number
  items: ItemVenta[]
}

export interface NuevaVentaContado {
  metodo_pago: 'efectivo' | 'tarjeta'
  total_pesos: number
  total_dolares: number
  items: ItemVenta[]
}

export async function registrarVentaCredito(venta: NuevaVentaCredito): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/ventas/credito`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta),
  })
  if (!res.ok) throw new Error('No se pudo registrar la venta')
}

export async function registrarVentaContado(venta: NuevaVentaContado): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/ventas/contado`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta),
  })
  if (!res.ok) throw new Error('No se pudo registrar la venta')
}
