import { useState, type ReactNode } from 'react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  PAIRS,
  SPEED,
  T_MAX,
  VOLCANO_AT,
  boundary,
  challengeMet,
  hasVolcanoes,
  pairFor,
  shiftKm,
  type Motion,
  type Pair,
} from './plate-motion.model'

/** "Vyzkoušej si" for z3-1: how two plates move and which crust meets → ridge, rift, trench and volcanoes, fold mountains or a fault. */

const RAD = Math.PI / 180
const SEA = 62
const OCEAN = 'color-mix(in srgb, var(--blue) 34%, var(--surface))'
const OCEAN_NEW = 'color-mix(in srgb, var(--blue) 18%, var(--surface))'
const LAND = 'color-mix(in srgb, var(--accent) 30%, var(--surface))'
const LAND2 = 'color-mix(in srgb, var(--accent) 20%, var(--surface))'
const WATER = 'color-mix(in srgb, var(--blue) 14%, var(--surface))'
const MANTLE = 'color-mix(in srgb, color-mix(in srgb, var(--bad) 45%, var(--yellow)) 24%, var(--surface))'
const MAGMA = 'color-mix(in srgb, var(--bad) 72%, var(--yellow))'

type P = [number, number]
const poly = (pts: P[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}Z`
const line = (pts: P[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`
const bell = (dx: number, w: number) => Math.exp(-((dx / w) ** 2))

function Star({ x, y }: { x: number; y: number }) {
  const pts: P[] = []
  for (let k = 0; k < 10; k++) {
    const r = k % 2 ? 2.2 : 5.2
    const a = (k * 36 - 90) * RAD
    pts.push([x + r * Math.cos(a), y + r * Math.sin(a)])
  }
  return <path d={poly(pts)} fill="var(--yellow)" stroke="var(--edge)" strokeWidth={0.9} />
}

function Volcano({ x, base, h }: { x: number; base: number; h: number }) {
  return (
    <path
      d={`M${x - h * 0.9} ${base} L${x - 3} ${base - h} L${x + 3} ${base - h} L${x + h * 0.9} ${base}Z`}
      fill="color-mix(in srgb, var(--accent) 45%, var(--surface))"
      stroke="var(--edge)"
      strokeWidth={1.2}
    />
  )
}

function Arrow({ x, y, dx, dy = 0 }: { x: number; y: number; dx: number; dy?: number }) {
  const { id } = usePlate()
  return <path d={`M${x} ${y} l${dx} ${dy}`} className="ph-o ph-bold" markerEnd={url(id, 'ah-ink')} />
}

function Lbl({ x, y, text, anchor = 'middle', strong }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end'; strong?: boolean }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={strong ? 'ph-lbl ph-halo' : 'ph-unit ph-halo'} style={strong ? undefined : { fill: 'var(--ink)' }}>
      {text}
    </text>
  )
}

/** Background of every cross-section: sea water and the plastic asthenosphere. */
function Section({ children, sea = true }: { children: ReactNode; sea?: boolean }) {
  return (
    <g>
      {sea && <rect x={0} y={SEA} width={360} height={90} fill={WATER} />}
      {sea && <path d={`M0 ${SEA} H360`} stroke="var(--blue)" strokeWidth={1.4} />}
      <rect x={0} y={sea ? 122 : 100} width={360} height={sea ? 104 : 126} fill={MANTLE} />
      {children}
      <Lbl x={8} y={218} text="astenosféra" anchor="start" />
    </g>
  )
}

// ------------------------------------------------------------------ apart

function ApartOcean({ p }: { p: number }) {
  const top = (x: number) => 92 - 20 * bell(x - 180, 64) + 7 * bell(x - 180, 5)
  const bot = (x: number) => 124 - 34 * bell(x - 180, 46)
  const xs: number[] = []
  for (let x = -2; x <= 362; x += 2) xs.push(x)
  const g = 6 + 40 * p
  const plate = (x0: number, x1: number) => {
    const s = xs.filter((x) => x >= x0 && x <= x1)
    return poly([...s.map((x): P => [x, top(x)]), ...s.reverse().map((x): P => [x, bot(x)])])
  }
  return (
    <Section>
      <path d={poly([[-2, 226], ...xs.map((x): P => [x, bot(x)]), [362, 226]])} fill={MANTLE} />
      <path d={poly([[150, 226], [176, bot(180) + 4], [180, top(180) + 4], [184, bot(180) + 4], [210, 226]])} fill={MAGMA} />
      <path d={plate(-2, 178)} fill={OCEAN} stroke="var(--edge)" strokeWidth={1.2} />
      <path d={plate(182, 362)} fill={OCEAN} stroke="var(--edge)" strokeWidth={1.2} />
      <path d={plate(180 - g, 178)} fill={OCEAN_NEW} stroke="var(--edge)" strokeWidth={1.2} />
      <path d={plate(182, 180 + g)} fill={OCEAN_NEW} stroke="var(--edge)" strokeWidth={1.2} />
      <Star x={172} y={top(172) + 9} />
      <Star x={190} y={top(190) + 12} />
      <path d={`M180 ${top(180) - 2} V44`} className="ph-o ph-thin" />
      <Lbl x={180} y={38} text="středooceánský hřbet" strong />
      <path d={`M${180 + g / 2} ${bot(180 + g / 2) - 4} L${206 + g / 2} 150`} className="ph-o ph-thin" />
      <Lbl x={210 + g / 2} y={164} text="nová kůra" anchor="start" />
      <Lbl x={180} y={190} text="magma" />
      <Lbl x={8} y={112} text="oceánská deska" anchor="start" />
      <Arrow x={80} y={4} dx={-40} />
      <Arrow x={280} y={4} dx={40} />
    </Section>
  )
}

function ApartLand({ p }: { p: number }) {
  const g = 10 + 26 * p
  const floor = 62 + 18 * p
  const top = (x: number) => {
    const d = Math.abs(x - 180)
    return d < g ? floor : d < g + 12 ? floor + ((50 - floor) * (d - g)) / 12 : 50
  }
  const bot = (x: number) => 146 - (36 + 30 * p) * bell(x - 180, 44 + 20 * p)
  const xs: number[] = []
  for (let x = -2; x <= 362; x += 2) xs.push(x)
  const hv = 8 + 14 * p
  return (
    <Section sea={false}>
      <path d={poly([[-2, 226], ...xs.map((x): P => [x, bot(x)]), [362, 226]])} fill={MANTLE} />
      <path d={poly([[154, 226], [176, bot(180) + 4], [180, floor - hv + 4], [184, bot(180) + 4], [206, 226]])} fill={MAGMA} />
      <path d={poly([...xs.map((x): P => [x, top(x)]), ...[...xs].reverse().map((x): P => [x, bot(x)])])} fill={LAND} stroke="var(--edge)" strokeWidth={1.2} />
      {[-1, 1].map((s) => (
        <path key={s} d={`M${180 + s * (g + 12)} 50 L${180 + s * (g - 8)} 112`} className="ph-o ph-dash" />
      ))}
      <Volcano x={180} base={floor} h={hv} />
      <Star x={180 - g - 2} y={78} />
      <Star x={180 + g + 4} y={90} />
      <Lbl x={180} y={30} text="příkopová propadlina" strong />
      <Lbl x={180} y={196} text="magma" />
      <Lbl x={8} y={76} text="pevninská deska" anchor="start" />
      <Arrow x={80} y={4} dx={-40} />
      <Arrow x={280} y={4} dx={40} />
    </Section>
  )
}

// ------------------------------------------------------------------ together

const XT = 132

/** The top line of a sinking (subducting) plate from the trench, and its lower side 26 below. */
function slab(len: number): { top: P[]; bot: P[] } {
  const top: P[] = [[XT, 112]]
  const bot: P[] = []
  let [x, y] = [XT, 112]
  for (let s = 0; s <= len; s += 2) {
    const a = (10 + 30 * Math.min(1, s / 70)) * RAD
    if (s > 0) {
      x += 2 * Math.cos(a)
      y += 2 * Math.sin(a)
      top.push([x, y])
    }
    bot.push([x - 26 * Math.sin(a), y + 26 * Math.cos(a)])
  }
  return { top, bot }
}

function Subduction({ p, over }: { p: number; over: 'ocean' | 'land' }) {
  const len = 90 + 110 * p
  const { top, bot } = slab(len)
  const down: P[] = [[-2, 92], [XT - 36, 92], [XT - 14, 100], ...top, ...[...bot].reverse(), [XT - 40, 124], [-2, 124]]
  // the overriding plate rests on the sinking one
  const base = over === 'land' ? 146 : 124
  const under = top.filter(([, y]) => y < base)
  const xb = top.find(([, y]) => y >= base)?.[0] ?? 362
  const upper: P[] =
    over === 'land'
      ? [[XT + 8, 106], [XT + 36, 50], [362, 50], [362, base], [xb, base], ...[...under].reverse()]
      : [[XT + 8, 106], [XT + 22, 92], [362, 92], [362, base], [xb, base], ...[...under].reverse()]
  // volcanoes above the point where the sinking plate is deep enough
  const vs = Math.round((90 + 110 * VOLCANO_AT) / 2)
  const vOn = p >= VOLCANO_AT && top[vs]
  const [mx, my] = top[Math.min(vs, top.length - 1)]
  const grow = Math.max(0, (p - VOLCANO_AT) / (1 - VOLCANO_AT))
  const surface = over === 'land' ? 50 : 92
  const hv = over === 'land' ? 10 + 24 * grow : 16 + 44 * grow
  const vx = mx + 6
  const island = over === 'ocean' && surface - hv < SEA
  const stars = [16, 56, 100, 150, 196].filter((s) => s < len).map((s) => top[Math.round(s / 2)])
  return (
    <Section>
      <path d={poly(down)} fill={OCEAN} stroke="var(--edge)" strokeWidth={1.2} />
      <path d={poly(upper)} fill={over === 'land' ? LAND : OCEAN_NEW} stroke="var(--edge)" strokeWidth={1.2} />
      {vOn && (
        <>
          <path d={line([[mx, my], [mx + 2, (my + surface) / 2 + 10], [vx, surface - hv + 6]])} stroke={MAGMA} strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={mx} cy={my - 4} r={6} fill={MAGMA} />
          <Volcano x={vx} base={surface} h={hv} />
          <Lbl x={vx + 12} y={surface - hv - 8} text={over === 'land' ? 'sopky' : island ? 'ostrovní oblouk' : 'podmořská sopka'} strong anchor="start" />
        </>
      )}
      {stars.map(([x, y], i) => (
        <Star key={i} x={x + 3} y={y + 6} />
      ))}
      <path d={`M${XT + 2} 110 V40`} className="ph-o ph-thin" />
      <Lbl x={XT + 2} y={34} text="příkop" strong />
      <Lbl x={8} y={112} text="oceánská deska" anchor="start" />
      <Lbl x={352} y={over === 'land' ? 76 : 112} text={over === 'land' ? 'pevninská deska' : 'oceánská deska'} anchor="end" />
      <Lbl x={XT - 34} y={206} text="deska se noří" anchor="start" />
      <Arrow x={30} y={4} dx={40} />
      <Arrow x={330} y={4} dx={-24} />
    </Section>
  )
}

function Collision({ p }: { p: number }) {
  const H = 8 + 30 * p
  const w = 46 + 40 * p
  const root = 6 + 34 * p
  const shape = (dx: number) => (Math.abs(dx) < w ? Math.cos((Math.PI * dx) / (2 * w)) ** 2 : 0)
  const xs: number[] = []
  for (let x = -2; x <= 362; x += 2) xs.push(x)
  const top = (x: number) => 50 - H * shape(x - 180)
  const bot = (x: number) => 146 + root * shape(x - 180)
  const half = (x0: number, x1: number) => {
    const s = xs.filter((x) => x >= x0 && x <= x1)
    return poly([...s.map((x): P => [x, top(x)]), ...[...s].reverse().map((x): P => [x, bot(x)])])
  }
  // folded layers inside the mountains
  const folds = [1, 2, 3].map((k) => {
    const pts: P[] = []
    for (let x = 180 - w; x <= 180 + w; x += 2) {
      const dx = x - 180
      pts.push([x, 50 + 14 * k - H * (1 - 0.12 * k) * shape(dx) + 5 * p * Math.sin(dx / 7) * shape(dx)])
    }
    return line(pts)
  })
  return (
    <Section sea={false}>
      <path d={half(-2, 180)} fill={LAND} stroke="var(--edge)" strokeWidth={1.2} />
      <path d={half(180, 362)} fill={LAND2} stroke="var(--edge)" strokeWidth={1.2} />
      {folds.map((d, i) => (
        <path key={i} d={d} className="ph-o ph-thin" />
      ))}
      <Star x={168} y={96} />
      <Star x={196} y={118} />
      <Lbl x={180} y={Math.min(50 - H - 10, 30)} text="vrásové pohoří" strong />
      <Lbl x={8} y={76} text="pevninská deska" anchor="start" />
      <Lbl x={352} y={76} text="pevninská deska" anchor="end" />
      <Lbl x={180} y={146 + root + 18} text="kořen pohoří" />
      <Arrow x={30} y={4} dx={40} />
      <Arrow x={330} y={4} dx={-40} />
    </Section>
  )
}

// ------------------------------------------------------------------ sideways (map view)

function Transform({ p }: { p: number }) {
  const s = 4 + 34 * p
  const fault: P[] = []
  for (let k = 0; k <= 19; k++) fault.push([180 + (k % 2 ? 3 : -3), -14 + k * 13])
  const road = (x0: number, x1: number, y: number) => (
    <g>
      <path d={`M${x0} ${y} H${x1}`} stroke="var(--edge)" strokeWidth={9} />
      <path d={`M${x0} ${y} H${x1}`} stroke="var(--surface)" strokeWidth={6.4} />
      <path d={`M${x0} ${y} H${x1}`} stroke="var(--muted)" strokeWidth={1} strokeDasharray="5 4" />
    </g>
  )
  return (
    <g>
      <rect x={0} y={-14} width={180} height={240} fill={LAND} />
      <rect x={180} y={-14} width={180} height={240} fill={LAND2} />
      {road(0, 178, 118 - s)}
      {road(182, 360, 118 + s)}
      <path d={line(fault)} stroke="var(--bad)" strokeWidth={2.4} fill="none" />
      {[40, 100, 170].map((y) => (
        <Star key={y} x={180} y={y} />
      ))}
      <Lbl x={192} y={22} text="zlom" strong anchor="start" />
      <Lbl x={8} y={22} text="pohled shora" anchor="start" />
      <Lbl x={8} y={118 - s - 12} text="silnice" anchor="start" />
      <Arrow x={90} y={200} dx={0} dy={-50} />
      <Arrow x={270} y={150} dx={0} dy={50} />
    </g>
  )
}

// ------------------------------------------------------------------ experiment

/** Clips a scene to the rounded frame. */
function Frame({ children }: { children: ReactNode }) {
  const clip = `${usePlate().id}-pm-clip`
  return (
    <>
      <clipPath id={clip}>
        <rect x={0} y={-14} width={360} height={240} rx={8} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>{children}</g>
    </>
  )
}

const MOTIONS: { value: Motion; label: string }[] = [
  { value: 'od-sebe', label: 'od sebe' },
  { value: 'k-sobe', label: 'k sobě' },
  { value: 'podel', label: 'podél sebe' },
]

function plateLabel(motion: Motion, pair: Pair, t: number): string {
  const b = boundary(motion, pair)
  const view = motion === 'podel' ? 'Pohled shora na dvě desky.' : 'Řez dvěma litosférickými deskami, pod nimi astenosféra.'
  return (
    `${view} Desky se pohybují ${MOTIONS.find((m) => m.value === motion)!.label} (hranice ${b.kind}) rychlostí asi ${SPEED} cm za rok; ` +
    `za ${czNum(t)} mil. let se posunuly o ${czNum(shiftKm(t))} km. Vzniká: ${b.forms}; ${b.crust}. ` +
    (hasVolcanoes(motion, pair, t) ? 'Jsou tu sopky a zemětřesení. ' : 'Jsou tu zemětřesení, sopky ne. ') +
    `Příklad: ${b.example}.`
  )
}

export default function PlateMotion() {
  const [motion, setMotion] = useState<Motion>('k-sobe')
  const [pair, setPair] = useState<Pair>('pp')
  const [t, setT] = useState(6)
  const nar = useNarrow()
  const pr = pairFor(motion, pair)
  const p = t / T_MAX
  const b = boundary(motion, pr)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, -14, 360, 240]} max={480} label={plateLabel(motion, pr, t)} className="xp-pm">
          <Frame key={`${motion}-${pr}`}>
            {motion === 'podel' ? (
              <Transform p={p} />
            ) : motion === 'od-sebe' ? (
              pr === 'oo' ? (
                <ApartOcean p={p} />
              ) : (
                <ApartLand p={p} />
              )
            ) : pr === 'pp' ? (
              <Collision p={p} />
            ) : (
              <Subduction p={p} over={pr === 'op' ? 'land' : 'ocean'} />
            )}
          </Frame>
          <rect x={0} y={-14} width={360} height={240} rx={8} className="ph-o" />
        </Plate>
      }
      controls={
        <>
          <Choice label="desky se pohybují" value={motion} options={MOTIONS} onChange={setMotion} />
          <Choice label="kde" value={pr} options={PAIRS[motion]} onChange={setPair} />
          <Control
            label="čas"
            value={t}
            min={0}
            max={T_MAX}
            step={0.5}
            format={(v) => `${czNum(v)} mil. let (${czNum(shiftKm(v))} km)`}
            onChange={setT}
          />
        </>
      }
      readouts={
        <>
          <Readout label="hranice desek" value={b.kind} />
          <Readout label="vzniká" value={b.forms} />
          <Readout label="příklad" value={b.example} />
        </>
      }
      challenge="Nastav desky tak, aby vznikl hlubokomořský příkop i sopky na pevnině, jako u Jižní Ameriky."
      done={challengeMet(motion, pr, t)}
    />
  )
}
