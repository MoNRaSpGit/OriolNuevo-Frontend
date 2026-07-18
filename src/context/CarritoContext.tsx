import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ProductoDemo } from '../data/productosDemo'

export interface ProductoBoleta {
  codigo: number
  name: string
  descripcion: string
  precio: number
  currency: 'UYU' | 'USD'
  cantidad: number
  total: number
}

interface CarritoContextValue {
  productosSeleccionados: ProductoBoleta[]
  addOrUpdateProduct: (producto: ProductoDemo) => void
  updateProductQuantity: (codigo: number, cantidad: number) => void
  removeProduct: (codigo: number) => void
}

const CarritoContext = createContext<CarritoContextValue | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoBoleta[]>([])

  const addOrUpdateProduct = (producto: ProductoDemo) => {
    setProductosSeleccionados((prev) => {
      const existente = prev.find((p) => p.codigo === producto.id)
      if (existente) {
        return prev.map((p) =>
          p.codigo === producto.id
            ? { ...p, cantidad: p.cantidad + 1, total: (p.cantidad + 1) * producto.price }
            : p
        )
      }
      return [
        ...prev,
        {
          codigo: producto.id,
          name: producto.name,
          descripcion: producto.description,
          precio: producto.price,
          currency: producto.currency || 'UYU',
          cantidad: 1,
          total: producto.price,
        },
      ]
    })
  }

  const updateProductQuantity = (codigo: number, cantidad: number) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) => (p.codigo === codigo ? { ...p, cantidad, total: cantidad * p.precio } : p))
    )
  }

  const removeProduct = (codigo: number) => {
    setProductosSeleccionados((prev) => prev.filter((p) => p.codigo !== codigo))
  }

  return (
    <CarritoContext.Provider
      value={{ productosSeleccionados, addOrUpdateProduct, updateProductQuantity, removeProduct }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const ctx = useContext(CarritoContext)
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  return ctx
}
