import { useEffect, useRef, useState } from 'react'
import { Workbox } from 'workbox-window'

// Chequea cada 3 minutos si hay una versión nueva del service worker —
// pensado para la tablet que queda con la app abierta todo el día.
const INTERVALO_CHEQUEO_MS = 3 * 60 * 1000

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const wbRef = useRef<Workbox | null>(null)

  useEffect(() => {
    // El service worker solo se genera en el build de producción (no en
    // "npm run dev"), así que acá no hay nada que registrar.
    if (!('serviceWorker' in navigator) || import.meta.env.DEV) return

    const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
      // Clave: sin esto, GitHub Pages (Cache-Control: max-age=600 en
      // sw.js) puede hacer que el navegador siga viendo la versión
      // vieja del service worker durante ese rato, aunque el chequeo
      // periódico de más abajo se dispare igual.
      updateViaCache: 'none',
    })
    wbRef.current = wb

    wb.addEventListener('waiting', () => setNeedRefresh(true))

    // Se registra acá (al montar) y no dentro de actualizar(), porque el
    // service worker nuevo queda compartido por todas las pestañas/PWA
    // abiertas en el mismo origen. Si el usuario actualiza desde OTRA
    // pestaña, esta también recibe "controlling" — y si el listener
    // solo se agregaba al hacer clic en "Actualizar", esta pestaña se
    // perdía el evento (ya había pasado) y el botón quedaba pegado
    // pidiendo un F5 manual para arreglarse.
    wb.addEventListener('controlling', () => window.location.reload())

    let intervalId: ReturnType<typeof setInterval> | undefined
    wb.register().then((registration) => {
      if (!registration) return
      intervalId = setInterval(() => {
        registration.update()
      }, INTERVALO_CHEQUEO_MS)
    })

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  const actualizar = () => {
    wbRef.current?.messageSkipWaiting()
  }

  return { needRefresh, actualizar }
}
