export interface Cliente {
  id: number
  nombre: string
  telefono: string | null
  deuda: string
  created_at: string
}

export interface ItemVenta {
  name: string
  cantidad: number
  precio: number
  currency: 'UYU' | 'USD'
}

export interface VentaCredito {
  id: number
  cliente_id: number
  fecha: string
  total_pesos: string
  total_dolares: string
  detalle: string
}
