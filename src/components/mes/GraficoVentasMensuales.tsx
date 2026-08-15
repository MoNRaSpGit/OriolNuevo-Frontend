import type { TotalMes } from '../../types/panel'

const NOMBRES_MES_CORTO = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

const ANCHO = 640
const ALTO = 220
const PADDING_X = 24
const PADDING_SUPERIOR = 34
const PADDING_INFERIOR = 34

function armarPathSuave(puntos: { x: number; y: number }[]): string {
  if (puntos.length === 1) return `M ${puntos[0].x} ${puntos[0].y}`

  let path = `M ${puntos[0].x} ${puntos[0].y}`
  for (let i = 0; i < puntos.length - 1; i++) {
    const actual = puntos[i]
    const siguiente = puntos[i + 1]
    const mitadX = (actual.x + siguiente.x) / 2
    path += ` C ${mitadX} ${actual.y}, ${mitadX} ${siguiente.y}, ${siguiente.x} ${siguiente.y}`
  }
  return path
}

const formatearPesos = (valor: number) =>
  valor.toLocaleString('es-UY', { style: 'currency', currency: 'UYU', minimumFractionDigits: 0 })

interface Props {
  meses: TotalMes[]
}

const GraficoVentasMensuales = ({ meses }: Props) => {
  const maximo = Math.max(...meses.map((m) => m.totalPesos), 1)
  const anchoUtil = ANCHO - PADDING_X * 2
  const altoUtil = ALTO - PADDING_SUPERIOR - PADDING_INFERIOR

  const puntos = meses.map((m, i) => {
    const x =
      meses.length === 1
        ? PADDING_X + anchoUtil / 2
        : PADDING_X + (i / (meses.length - 1)) * anchoUtil
    const y = PADDING_SUPERIOR + altoUtil - (m.totalPesos / maximo) * altoUtil
    return { x, y, ...m }
  })

  const pathLinea = armarPathSuave(puntos)
  const pathArea = `${pathLinea} L ${puntos[puntos.length - 1].x} ${PADDING_SUPERIOR + altoUtil} L ${puntos[0].x} ${PADDING_SUPERIOR + altoUtil} Z`

  const lineasGrilla = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="grafico-ventas-mensuales">
      <h5 className="mb-3">Ventas por mes</h5>
      <div className="grafico-mes-card">
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          className="grafico-mes-svg"
          preserveAspectRatio="none"
          role="img"
          aria-label="Ventas en pesos por mes"
        >
          <defs>
            <linearGradient id="grafico-mes-relleno" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d5fae" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1d5fae" stopOpacity="0" />
            </linearGradient>
          </defs>

          {lineasGrilla.map((fraccion) => {
            const y = PADDING_SUPERIOR + altoUtil * fraccion
            return <line key={fraccion} x1={PADDING_X} y1={y} x2={ANCHO - PADDING_X} y2={y} className="grafico-mes-grilla" />
          })}

          <path d={pathArea} fill="url(#grafico-mes-relleno)" stroke="none" />
          <path d={pathLinea} fill="none" stroke="#1d5fae" strokeWidth="2.5" strokeLinecap="round" />

          {puntos.map((p) => (
            <g key={`${p.anio}-${p.mes}`}>
              {p.totalPesos > 0 && (
                <text x={p.x} y={p.y - 12} textAnchor="middle" className="grafico-mes-valor">
                  {formatearPesos(p.totalPesos)}
                </text>
              )}
              <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#1d5fae" strokeWidth="2.5" />
              <title>
                {NOMBRES_MES_CORTO[p.mes - 1]} {p.anio}: {formatearPesos(p.totalPesos)}
              </title>
              <text x={p.x} y={ALTO - 10} textAnchor="middle" className="grafico-mes-etiqueta">
                {NOMBRES_MES_CORTO[p.mes - 1]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default GraficoVentasMensuales
