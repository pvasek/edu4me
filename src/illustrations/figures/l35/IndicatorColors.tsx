import { PH_COLORS } from '../../../diagrams/PhScale'
import { Fade, Figure, T, TestTube, pat, usePid } from './kit'

interface Row {
  name: string
  range: string
  colors: [string, string, string]
}

const CLEAR = 'var(--info-soft)'
const ROWS: Row[] = [
  { name: 'lakmus', range: 'přechod 4,5–8,3', colors: ['#d03a33', '#8a5aa8', '#3558b8'] },
  { name: 'fenolftalein', range: 'přechod 8,2–10,0', colors: [CLEAR, CLEAR, '#d6399b'] },
  { name: 'methyloranž', range: 'přechod 3,1–4,4', colors: ['#d8342c', '#f0b52e', '#f0c93a'] },
  { name: 'univerzální indikátor', range: 'celá stupnice', colors: [PH_COLORS[2], PH_COLORS[7], PH_COLORS[12]] },
]
const COLS = [
  { x: 186, head: 'kyselé', ph: 'pH 2' },
  { x: 262, head: 'neutrální', ph: 'pH 7' },
  { x: 338, head: 'zásadité', ph: 'pH 12' },
]

/** Red cabbage (anthocyanin) colours pH 1 … 13. */
const CABBAGE = ['#c3243a', '#cc2f58', '#cf4a86', '#b24f9c', '#8e52a6', '#7456ac', '#6559b0', '#4a6cc2', '#3f7fc4', '#2f9a9c', '#46a86a', '#7db648', '#cfc43a']

function Cabbage({ x, y, w }: { x: number; y: number; w: number }) {
  const p = usePid()
  const cw = w / CABBAGE.length
  const at = (ph: number) => x + (ph - 0.5) * cw
  return (
    <g>
      <text x={x} y={y - 12} className="f35-title" style={{ fontSize: 17 }}>
        indikátor z červeného zelí
      </text>
      {CABBAGE.map((c, i) => (
        <rect key={i} x={x + i * cw} y={y} width={cw + 0.5} height={26} fill={c} />
      ))}
      <rect x={x} y={y} width={w} height={26} fill={pat(p, 'sw')} opacity={0.6} />
      <rect x={x} y={y} width={w} height={26} rx={2} className="f35-line" />
      {CABBAGE.map((_, i) => (
        <text key={i} x={x + (i + 0.5) * cw} y={y + 17} textAnchor="middle" className="f35-mono" style={{ fontSize: 10, fill: '#fffaf0' }}>
          {i + 1}
        </text>
      ))}
      {[
        { ph: 3, t: 'ocet' },
        { ph: 7, t: 'voda' },
        { ph: 8.5, t: 'jedlá soda' },
      ].map((m) => (
        <g key={m.t}>
          <line x1={at(m.ph)} x2={at(m.ph)} y1={y + 26} y2={y + 36} className="f35-leader" />
          <text x={at(m.ph)} y={y + 50} textAnchor="middle" className="f35-note" style={{ fontSize: 15 }}>
            {m.t}
          </text>
        </g>
      ))}
    </g>
  )
}

export default function IndicatorColors() {
  const top = 70
  const rowH = 88
  return (
    <Figure
      level={5}
      label="Barvy indikátorů v kyselém, neutrálním a zásaditém roztoku: lakmus červený, fialový, modrý; fenolftalein bezbarvý, bezbarvý, fialově růžový; methyloranž červená, žlutá, žlutá; univerzální indikátor oranžově červený, zelený, modrofialový. Výluh z červeného zelí je v octu červený, ve vodě fialový a v roztoku jedlé sody modrý až zelený."
      layouts={[
        {
          w: 400,
          h: 520,
          max: 560,
          draw: () => (
            <>
              {COLS.map((c) => (
                <g key={c.head}>
                  <T x={c.x} y={26} className="f35-note f35-lvt" style={{ fontWeight: 700 }}>
                    {c.head}
                  </T>
                  <T x={c.x} y={44} className="f35-mono f35-muted" size={11.5}>
                    {c.ph}
                  </T>
                </g>
              ))}
              <line x1={10} x2={390} y1={56} y2={56} className="f35-line" style={{ strokeWidth: 1 }} />
              <line x1={10} x2={390} y1={59} y2={59} className="f35-rule" />
              {ROWS.map((r, i) => {
                const y = top + i * rowH
                return (
                  <g key={r.name}>
                    {i > 0 && <line x1={10} x2={390} y1={y - 6} y2={y - 6} className="f35-rule" />}
                    <text x={12} y={y + 36} className="f35-note" style={{ fontSize: 17, fill: 'var(--ink)' }}>
                      {r.name === 'univerzální indikátor' ? 'univerzální' : r.name}
                    </text>
                    {r.name === 'univerzální indikátor' && (
                      <text x={12} y={y + 53} className="f35-note" style={{ fontSize: 17, fill: 'var(--ink)' }}>
                        indikátor
                      </text>
                    )}
                    <text x={12} y={y + (r.name === 'univerzální indikátor' ? 70 : 55)} className="f35-t f35-muted" style={{ fontSize: 11 }}>
                      {r.range}
                    </text>
                    {r.colors.map((c, k) => (
                      <TestTube
                        key={k}
                        cx={COLS[k].x}
                        y={y + 2}
                        w={22}
                        h={74}
                        level={46}
                        color={c}
                        opacity={c === CLEAR ? 0.9 : 0.85}
                        rise
                        delay={0.2 + i * 0.25 + k * 0.1}
                      />
                    ))}
                  </g>
                )
              })}
              <Fade d={1.6}>
                <Cabbage x={16} y={440} w={368} />
              </Fade>
            </>
          ),
        },
      ]}
    />
  )
}
