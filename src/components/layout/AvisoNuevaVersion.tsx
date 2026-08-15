import { useServiceWorkerUpdate } from '../../hooks/useServiceWorkerUpdate'
import '../../styles/layout/aviso-version.scss'

const AvisoNuevaVersion = () => {
  const { needRefresh, actualizar } = useServiceWorkerUpdate()

  if (!needRefresh) return null

  return (
    <div className="aviso-version">
      <span>Hay una nueva versión disponible.</span>
      <button type="button" className="btn btn-light btn-sm" onClick={actualizar}>
        Actualizar
      </button>
    </div>
  )
}

export default AvisoNuevaVersion
