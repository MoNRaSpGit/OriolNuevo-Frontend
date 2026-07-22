import { describe, expect, it } from 'vitest'
import {
  actualizarDatosEnLista,
  addOrUpdateProductoEnLista,
  removeProductoDeLista,
  updateCantidadEnLista,
} from './carritoLogica'
import type { ProductoBoleta, ProductoParaCarrito } from './CarritoContext'

const producto: ProductoParaCarrito = {
  id: 1,
  name: 'Leche Entera 1L',
  description: '',
  price: 52,
  currency: 'UYU',
  image: '',
}

describe('addOrUpdateProductoEnLista', () => {
  it('agrega un producto nuevo con cantidad 1', () => {
    const resultado = addOrUpdateProductoEnLista([], producto)
    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toMatchObject({ codigo: 1, cantidad: 1, precio: 52, total: 52 })
  })

  it('si ya existe, suma 1 a la cantidad y recalcula el total', () => {
    const carritoInicial = addOrUpdateProductoEnLista([], producto)
    const resultado = addOrUpdateProductoEnLista(carritoInicial, producto)
    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toMatchObject({ cantidad: 2, total: 104 })
  })

  it('regresión: si el precio cambió (por edición), sincroniza precio/total y no queda desactualizado', () => {
    // Bug encontrado en la auditoría de ruido: al re-escanear un producto
    // cuyo precio se había editado, el total se recalculaba con el precio
    // nuevo pero el campo `precio` del ítem quedaba con el valor viejo.
    const carritoInicial = addOrUpdateProductoEnLista([], producto)
    const productoConPrecioEditado: ProductoParaCarrito = { ...producto, price: 999 }
    const resultado = addOrUpdateProductoEnLista(carritoInicial, productoConPrecioEditado)
    expect(resultado[0].precio).toBe(999)
    expect(resultado[0].cantidad).toBe(2)
    expect(resultado[0].total).toBe(1998) // 999 * 2, consistente con el precio unitario
  })
})

describe('updateCantidadEnLista', () => {
  it('actualiza la cantidad y recalcula el total en base al precio unitario', () => {
    const carrito = addOrUpdateProductoEnLista([], producto)
    const resultado = updateCantidadEnLista(carrito, 1, 5)
    expect(resultado[0]).toMatchObject({ cantidad: 5, total: 260 })
  })

  it('no afecta a otros productos del carrito', () => {
    const otro: ProductoBoleta = {
      codigo: 2,
      name: 'Coca Cola 1.5L',
      descripcion: '',
      precio: 85,
      currency: 'UYU',
      image: '',
      cantidad: 1,
      total: 85,
    }
    const carrito = [...addOrUpdateProductoEnLista([], producto), otro]
    const resultado = updateCantidadEnLista(carrito, 1, 3)
    expect(resultado.find((p) => p.codigo === 2)).toMatchObject({ cantidad: 1, total: 85 })
  })
})

describe('removeProductoDeLista', () => {
  it('saca el producto por código y deja el resto intacto', () => {
    const carrito = addOrUpdateProductoEnLista([], producto)
    const resultado = removeProductoDeLista(carrito, 1)
    expect(resultado).toHaveLength(0)
  })
})

describe('actualizarDatosEnLista', () => {
  it('actualiza nombre/precio/moneda y recalcula el total con la cantidad actual', () => {
    const carrito = updateCantidadEnLista(addOrUpdateProductoEnLista([], producto), 1, 3)
    const resultado = actualizarDatosEnLista(carrito, 1, { name: 'Leche Descremada 1L', precio: 60, currency: 'UYU' })
    expect(resultado[0]).toMatchObject({
      name: 'Leche Descremada 1L',
      precio: 60,
      cantidad: 3,
      total: 180,
    })
  })
})
