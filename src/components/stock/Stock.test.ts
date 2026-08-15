import { describe, expect, it } from 'vitest'
import { nivelDeStock } from './Stock'

describe('nivelDeStock', () => {
  it('marca rojo cuando el stock es 3 o menos', () => {
    expect(nivelDeStock(0)).toBe('rojo')
    expect(nivelDeStock(3)).toBe('rojo')
  })

  it('marca amarillo entre 4 y 6', () => {
    expect(nivelDeStock(4)).toBe('amarillo')
    expect(nivelDeStock(6)).toBe('amarillo')
  })

  it('no marca nada (null) por encima de 6', () => {
    expect(nivelDeStock(7)).toBeNull()
    expect(nivelDeStock(100)).toBeNull()
  })
})

describe('nivelDeStock con stock_minimo personalizado', () => {
  it('no marca nada mientras el stock se mantenga en el mínimo marcado o por encima', () => {
    expect(nivelDeStock(3, 3)).toBeNull()
    expect(nivelDeStock(5, 3)).toBeNull()
  })

  it('vuelve a marcar rojo si el stock cae por debajo del mínimo marcado', () => {
    expect(nivelDeStock(2, 3)).toBe('rojo')
  })

  it('ignora los umbrales genéricos cuando hay un mínimo personalizado', () => {
    // Sin mínimo personalizado, stock 1 sería rojo por la regla genérica,
    // pero acá el mínimo marcado es 0, así que 1 ya no debería alertar.
    expect(nivelDeStock(1, 0)).toBeNull()
    expect(nivelDeStock(0, 0)).toBeNull()
  })
})
