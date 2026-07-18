export type MetodoPago = 'efectivo' | 'tarjeta' | 'credito'

export interface ItemVenta {
  id: number
  name: string
  cantidad: number
  precio: number
  currency: 'UYU' | 'USD'
}

export interface Venta {
  id: number
  cliente_id: number | null
  metodo_pago: MetodoPago
  fecha: string
  total_pesos: string
  total_dolares: string
  detalle: string
}
