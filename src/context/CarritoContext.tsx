import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  actualizarDatosEnLista,
  addOrUpdateProductoEnLista,
  removeProductoDeLista,
  updateCantidadEnLista,
} from './carritoLogica'

export interface ProductoParaCarrito {
  id: number
  name: string
  description: string
  price: number
  currency: 'UYU' | 'USD'
  image: string
}

export interface ProductoBoleta {
  codigo: number
  name: string
  descripcion: string
  precio: number
  currency: 'UYU' | 'USD'
  image: string
  cantidad: number
  total: number
}

interface CarritoContextValue {
  productosSeleccionados: ProductoBoleta[]
  addOrUpdateProduct: (producto: ProductoParaCarrito) => void
  updateProductQuantity: (codigo: number, cantidad: number) => void
  removeProduct: (codigo: number) => void
  actualizarDatosProducto: (codigo: number, datos: { name: string; precio: number; currency: 'UYU' | 'USD' }) => void
  vaciarCarrito: () => void
}

const CarritoContext = createContext<CarritoContextValue | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoBoleta[]>([])

  const addOrUpdateProduct = (producto: ProductoParaCarrito) => {
    setProductosSeleccionados((prev) => addOrUpdateProductoEnLista(prev, producto))
  }

  const updateProductQuantity = (codigo: number, cantidad: number) => {
    setProductosSeleccionados((prev) => updateCantidadEnLista(prev, codigo, cantidad))
  }

  const removeProduct = (codigo: number) => {
    setProductosSeleccionados((prev) => removeProductoDeLista(prev, codigo))
  }

  const actualizarDatosProducto = (
    codigo: number,
    datos: { name: string; precio: number; currency: 'UYU' | 'USD' }
  ) => {
    setProductosSeleccionados((prev) => actualizarDatosEnLista(prev, codigo, datos))
  }

  const vaciarCarrito = () => {
    setProductosSeleccionados([])
  }

  return (
    <CarritoContext.Provider
      value={{
        productosSeleccionados,
        addOrUpdateProduct,
        updateProductQuantity,
        removeProduct,
        actualizarDatosProducto,
        vaciarCarrito,
      }}
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
