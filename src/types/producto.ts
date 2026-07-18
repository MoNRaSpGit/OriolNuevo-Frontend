export interface Producto {
  id: number
  name: string
  price: string
  image: string
  description: string
  currency: 'UYU' | 'USD'
  codigo_barra: string | null
  stock: number
}
