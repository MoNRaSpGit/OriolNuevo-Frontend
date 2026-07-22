import type { ProductoBoleta, ProductoParaCarrito } from './CarritoContext'

export function addOrUpdateProductoEnLista(
  prev: ProductoBoleta[],
  producto: ProductoParaCarrito
): ProductoBoleta[] {
  const existente = prev.find((p) => p.codigo === producto.id)
  if (existente) {
    return prev.map((p) =>
      p.codigo === producto.id
        ? {
            ...p,
            name: producto.name,
            descripcion: producto.description,
            precio: producto.price,
            currency: producto.currency || 'UYU',
            image: producto.image,
            cantidad: p.cantidad + 1,
            total: (p.cantidad + 1) * producto.price,
          }
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
      image: producto.image,
      cantidad: 1,
      total: producto.price,
    },
  ]
}

export function updateCantidadEnLista(prev: ProductoBoleta[], codigo: number, cantidad: number): ProductoBoleta[] {
  return prev.map((p) => (p.codigo === codigo ? { ...p, cantidad, total: cantidad * p.precio } : p))
}

export function removeProductoDeLista(prev: ProductoBoleta[], codigo: number): ProductoBoleta[] {
  return prev.filter((p) => p.codigo !== codigo)
}

export function actualizarDatosEnLista(
  prev: ProductoBoleta[],
  codigo: number,
  datos: { name: string; precio: number; currency: 'UYU' | 'USD' }
): ProductoBoleta[] {
  return prev.map((p) =>
    p.codigo === codigo
      ? { ...p, name: datos.name, precio: datos.precio, currency: datos.currency, total: p.cantidad * datos.precio }
      : p
  )
}
