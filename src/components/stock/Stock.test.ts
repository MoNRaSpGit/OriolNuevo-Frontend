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
