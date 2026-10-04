import { useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { ATOLL, COAST, H_MAX, SINCE_1900, challengeMet, floodedShare, heightAt, people, when, type When } from './sea-level-rise.model'
import './geo-b.css'

/** "Vyzkoušej si" for z7-7 and z10-7: raise the sea – a low coast and an atoll go under; how many people live that low. */

const M = 24 // px per metre (strongly exaggerated vertically)
const XL = 4

const WHEN: Record<When, string> = {
  dnes: 'dnes',
  '2050': 'kolem roku 2050',
  '2100': 'do roku 2100',
  pozdeji: 'po roce 2100',
}
const WHEN_SAY: Record<When, string> = {
  dnes: 'Od roku 1900 už stoupla asi o 0,2 m.',
  '2050': 'Takový vzestup se čeká kolem roku 2050.',
  '2100': 'To je v rozpětí, které IPCC čeká do roku 2100: 0,3 až 1 m podle toho, kolik skleníkových plynů vypustíme.',
  pozdeji: 'Tolik se čeká až po roce 2100; do roku 2100 to nelze vyloučit, kdyby se rychle rozpadaly ledové štíty.',
}

const m = (h: number) => `${czNum(h, 2)} m`

function label(h: number): string {
  const c = Math.round(floodedShare(COAST, h) * 100)
  const a = Math.round(floodedShare(ATOLL, h) * 100)
  return (
    `Dva schematické řezy pobřežím, výšky silně zvětšené: nahoře nízké pobřeží s deltou, poli, vesnicí a městem, dole korálový atol s lagunou. ` +
    (h > 0 ? `Hladina moře je o ${m(h)} výš než dnes. ` : 'Hladina moře je dnešní. ') +
    `${WHEN_SAY[when(h)]} ` +
    (h > 0 ? `Moře zaplaví asi ${c} % souše nakresleného pobřeží a ${a} % souše atolu. ` : '') +
    `Na světě žije asi 230 milionů lidí méně než 1 m nad hranicí přílivu a asi 267 milionů méně než 2 m nad mořem.`
  )
}

function House({ x, base, y0 }: { x: number; base: number; y0: number }) {
  const y = y0 - heightAt(base === 0 ? COAST : ATOLL, x) * M
  return (
    <g>
      <rect x={x - 5} y={y - 8} width={10} height={8} className="xp-sl-house" />
      <path d={`M${x - 7} ${y - 7.5} L${x} ${y - 14} L${x + 7} ${y - 7.5}Z`} className="xp-sl-roof" />
    </g>
  )
}

function Palm({ x, y0 }: { x: number; y0: number }) {
  const y = y0 - heightAt(ATOLL, x) * M
  return (
    <path
      d={`M${x} ${y} q1 -9 3 -18 M${x + 3} ${y - 18} q-7 -1 -10 4 M${x + 3} ${y - 18} q7 -2 10 3 M${x + 3} ${y - 18} q-2 -6 -8 -6 M${x + 3} ${y - 18} q4 -6 9 -5`}
      className="xp-sl-palm"
    />
  )
}

/** one profile: ground, things on it, the water up to level h */
function Profile({ profile, y0, h, bottom, kind }: { profile: [number, number][]; y0: number; h: number; bottom: number; kind: 'coast' | 'atoll' }) {
  // the sea floor is cut off at the bottom of the panel
  const zMin = -(bottom - y0) / M
  const yOf = (z: number) => (y0 - Math.max(z, zMin) * M).toFixed(1)
  const pts = profile.map(([x, z]) => `${XL + x} ${yOf(z)}`)
  const ground = `M${XL} ${bottom} L${pts.join(' L')} L${XL + 352} ${bottom}Z`
  // water: everywhere the ground is below the level (the lagoon is open to the sea)
  const yl = y0 - h * M
  const water: string[] = []
  let run: string[] = []
  for (let x = 0; x <= 352; x += 1) {
    const z = heightAt(profile, x)
    if (z < h) run.push(`${XL + x} ${yOf(z)}`)
    if ((z >= h || x === 352) && run.length) {
      const xs = run.map((p) => Number(p.split(' ')[0]))
      water.push(`M${Math.min(...xs)} ${yl} L${Math.max(...xs)} ${yl} L${[...run].reverse().join(' L')}Z`)
      run = []
    }
  }
  // green above the today's sea
  const green: string[] = []
  for (let i = 1; i < profile.length; i++) if (profile[i - 1][1] > 0.05 && profile[i][1] > 0.05) green.push(`M${pts[i - 1]} L${pts[i]}`)
  return (
    <g>
      <path d={ground} className="xp-sl-ground" />
      <path d={green.join(' ')} className="xp-sl-green" />
      {kind === 'coast' ? (
        <>
          {[126, 146, 214, 236, 252, 268, 300].map((x) => (
            <House key={x} x={XL + x} base={0} y0={y0} />
          ))}
        </>
      ) : (
        <>
          <Palm x={XL + 96} y0={y0} />
          <Palm x={XL + 128} y0={y0} />
          <Palm x={XL + 274} y0={y0} />
          {[110, 262].map((x) => (
            <House key={x} x={XL + x} base={1} y0={y0} />
          ))}
        </>
      )}
      {water.map((d, i) => (
        <path key={i} d={d} className="xp-sl-water" />
      ))}
      {/* today's level and the new one */}
      <line x1={XL} x2={XL + 352} y1={y0} y2={y0} className="xp-sl-today" />
      {h > 0 && <line x1={XL} x2={XL + 352} y1={yl} y2={yl} className="xp-sl-level" />}
    </g>
  )
}

function Picture({ h }: { h: number }) {
  const CY = 128
  const AY = 272
  const levelLabel = (y0: number) =>
    h > 0 && (
      <text x={XL + 352} y={y0 - h * M - 5} textAnchor="end" className="ph-unit ph-halo">
        +{m(h)}
      </text>
    )
  return (
    <>
      <text x={XL} y={14} className="ph-lbl ph-lbl-sm">
        nízké pobřeží
      </text>
      <Profile profile={COAST} y0={CY} h={h} bottom={CY + 44} kind="coast" />
      {/* the sea in 1900 */}
      <line x1={XL} x2={XL + 50} y1={CY + SINCE_1900 * M} y2={CY + SINCE_1900 * M} className="xp-sl-today" style={{ strokeDasharray: '1.5 3' }} />
      <text x={XL + 54} y={CY + SINCE_1900 * M + 4} className="ph-num ph-halo">
        1900
      </text>
      <text x={XL + 2} y={CY - 5} className="ph-num ph-halo">
        dnes
      </text>
      <text x={XL + 8} y={CY + 36} className="ph-unit">
        moře
      </text>
      <text x={XL + 150} y={CY - 0.5 * M - 24} textAnchor="middle" className="ph-unit ph-halo">
        delta, pole
      </text>
      <text x={XL + 256} y={CY - 1.6 * M - 26} textAnchor="middle" className="ph-unit ph-halo">
        město
      </text>
      {levelLabel(CY)}
      <text x={XL} y={AY - 66} className="ph-lbl ph-lbl-sm">
        atol
      </text>
      <Profile profile={ATOLL} y0={AY} h={h} bottom={AY + 48} kind="atoll" />
      <text x={XL + 204} y={AY + 26} textAnchor="middle" className="ph-unit ph-halo">
        laguna
      </text>
      <text x={XL + 8} y={AY + 26} className="ph-unit">
        oceán
      </text>
      {levelLabel(AY)}
    </>
  )
}

export default function SeaLevelRise() {
  const [h, setH] = useState(0)
  const nar = useNarrow()
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[0, 0, 360, 322]}
          max={480}
          label={label(h)}
          className="xp-sl"
          footer={
            <p className="xp-src">
              Výšky jsou silně zvětšené. Zdroje: IPCC AR6 (2021); lidé pod 1 m nad přílivem: Kulp a Strauss 2019; pod 2 m n. m.: Hooijer a Vernimmen 2021.
            </p>
          }
        >
          <Picture h={h} />
        </Plate>
      }
      controls={<Control label="vzestup hladiny moře" value={h} min={0} max={H_MAX} step={0.05} format={m} onChange={setH} />}
      readouts={
        <>
          <Readout label="kdy to čekat" value={WHEN[when(h)]} />
          <Readout label="kolik lidí žije níž" value={people(h)} tone={h >= 1 ? 'bad' : undefined} />
          <Readout label="zaplavená souš atolu" value={floodedShare(ATOLL, h) * 100} digits={0} unit="%" />
        </>
      }
      challenge="Nastav nejvyšší vzestup, se kterým IPCC počítá do roku 2100 jako s pravděpodobným."
      done={challengeMet(h)}
    />
  )
}
