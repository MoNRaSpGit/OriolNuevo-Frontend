import { useEffect, useState } from 'react'
import { getTasaDolar } from '../services/config.service'

// Valor de respaldo si falla la conexión al cargar la cotización real
// desde el backend (única fuente de verdad: config/constants.ts).
const TASA_DOLAR_RESPALDO = 40

export function useTasaDolar() {
  const [tasaDolar, setTasaDolar] = useState(TASA_DOLAR_RESPALDO)

  useEffect(() => {
    getTasaDolar()
      .then(setTasaDolar)
      .catch(() => setTasaDolar(TASA_DOLAR_RESPALDO))
  }, [])

  return tasaDolar
}
