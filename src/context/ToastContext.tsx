import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import '../styles/layout/toast.scss'

type TipoToast = 'success' | 'error'

interface Toast {
  id: number
  mensaje: string
  tipo: TipoToast
}

interface ToastContextValue {
  mostrarToast: (mensaje: string, tipo?: TipoToast) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const mostrarToast = useCallback((mensaje: string, tipo: TipoToast = 'success') => {
    const id = idRef.current++
    setToasts((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-item--${t.tipo}`}>
            {t.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}
