export interface ProductoDemo {
  id: number
  name: string
  description: string
  price: number
  currency: 'UYU' | 'USD'
  image: string
}

export const productosDemo: ProductoDemo[] = [
  {
    id: 1,
    name: 'Producto A',
    description: 'Descripción de prueba A',
    price: 250,
    currency: 'UYU',
    image: '',
  },
  {
    id: 2,
    name: 'Producto B',
    description: 'Descripción de prueba B',
    price: 15,
    currency: 'USD',
    image: '',
  },
  {
    id: 3,
    name: 'Producto C',
    description: 'Descripción de prueba C',
    price: 480,
    currency: 'UYU',
    image: '',
  },
  {
    id: 4,
    name: 'Producto D',
    description: 'Descripción de prueba D',
    price: 32,
    currency: 'USD',
    image: '',
  },
]
