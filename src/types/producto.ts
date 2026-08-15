export interface Producto {
  id: number
  name: string
  price: string
  description: string
  currency: 'UYU' | 'USD'
  codigo_barra: string | null
  stock: number
  stock_minimo: number | null
}
