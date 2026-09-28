import { Atom, Draw, Fade, Figure, Plate, Pop, headAt, useHatch } from './kit'

const LABEL =
  'Ozonová vrstva a freony. Ve stratosféře ve výšce asi 15–35 km pohlcuje ozon O3 většinu nebezpečného UV záření ze Slunce, k zemi projde jen malá část. Freony, například CCl2F2, se ve stratosféře působením UV záření rozkládají a uvolní radikál chloru. Ten ozon rozkládá v katalytickém cyklu: Cl + O3 → ClO + O2 a ClO + O → Cl + O2. Chlor se obnovuje, takže jeden atom zničí až 100 000 molekul ozonu. Montrealský protokol z roku 1987 freony zakázal a ozonová vrstva se obnovuje.'

const KM = (km: number) => 400 - km * 7.2
const UV = '#8a4fc0'

function O3({ x, y, r = 5.5 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <line className="f89-bond" x1={x - 9} y1={y + 5} x2={x} y2={y} />
      <line className="f89-bond" x1={x + 9} y1={y + 5} x2={x} y2={y} />
      <Atom x={x - 9} y={y + 5} el="O" r={r} label={false} />
      <Atom x={x + 9} y={y + 5} el="O" r={r} label={false} />
      <Atom x={x} y={y} el="O" r={r} label={false} />
    </g>
  )
}

function Rad({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5} className="f89-pulse" fill="var(--lv)" opacity={0.3} />
      <circle cx={x} cy={y} r={2.4} fill="var(--lv)" />
    </g>
  )
}

export default function OzoneLayer() {
  return (
    <Figure name="ozone-layer" level={9} label={LABEL} max={620} replay>
      <Plate w={480} h={450}>
        <Scene />
      </Plate>
    </Figure>
  )
}

function Scene() {
  const hatch = useHatch()
  return (
    <>
      {/* altitude column */}
      <rect x={40} y={KM(50)} width={150} height={KM(0) - KM(50)} fill="color-mix(in srgb, #5b9bd5 10%, var(--surface))" />
      <rect x={40} y={KM(12)} width={150} height={KM(0) - KM(12)} fill="color-mix(in srgb, #5b9bd5 20%, var(--surface))" />
      <rect x={40} y={KM(35)} width={150} height={KM(15) - KM(35)} fill="var(--lv)" opacity={0.18} />
      <rect x={40} y={KM(35)} width={150} height={KM(15) - KM(35)} fill={hatch('lv')} className="f89-hatch" />
      <line className="f89-ln" x1={40} y1={KM(50)} x2={40} y2={KM(0)} />
      {[0, 10, 20, 30, 40, 50].map((k) => (
        <g key={k}>
          <line className="f89-thin" x1={34} y1={KM(k)} x2={40} y2={KM(k)} />
          <text className="f89-f f89-sm" x={30} y={KM(k) + 4} textAnchor="end">
            {k}
          </text>
        </g>
      ))}
      <text className="f89-f f89-sm f89-muted" x={30} y={KM(50) - 14} textAnchor="end">
        km
      </text>
      <line className="f89-guide" x1={40} y1={KM(12)} x2={190} y2={KM(12)} />
      <text className="f89-lb f89-sm" x={186} y={KM(6)} textAnchor="end">
        troposféra
      </text>
      <text className="f89-lb f89-sm" x={186} y={KM(44)} textAnchor="end">
        stratosféra
      </text>
      <text className="f89-lb f89-b f89-lv" x={186} y={KM(17)} textAnchor="end">
        ozonová vrstva
      </text>
      <Pop delay={0.18}>
        <O3 x={132} y={KM(30)} />
        <O3 x={166} y={KM(25)} />
        <O3 x={140} y={KM(21)} />
      </Pop>
      {/* ground */}
      <rect x={40} y={KM(0)} width={150} height={10} fill="#9bb56a" stroke="var(--edge)" strokeWidth={1} />

      {/* UV rays: most absorbed in the ozone layer, a little reaches the ground */}
      {[
        { x: 80, end: KM(30), label: 'UV-C' },
        { x: 110, end: KM(24), label: 'UV-B' },
        { x: 50, end: KM(0) - 2, label: 'UV-A' },
      ].map((r, i) => (
        <g key={r.label}>
          <Draw d={`M${r.x} ${KM(50) + 6} L${r.x} ${r.end}`} className="f89-ln" delay={0.27 + i * 0.09} dur={0.48} style={{ stroke: UV, strokeWidth: 2.4 }} />
          <Fade delay={0.59 + i * 0.09}>
            <text className="f89-f f89-sm" x={r.x} y={KM(50) - 2} textAnchor="middle" style={{ fill: UV }}>
              {r.label}
            </text>
            {i < 2 ? (
              <path d={`M${r.x - 7} ${r.end - 7} L${r.x + 7} ${r.end + 7} M${r.x + 7} ${r.end - 7} L${r.x - 7} ${r.end + 7}`} stroke={UV} strokeWidth={2.2} />
            ) : (
              <polygon points={headAt(r.x, r.end, r.x, r.end - 20, 10)} fill={UV} />
            )}
          </Fade>
        </g>
      ))}
      <Fade delay={0.85}>
        <text className="f89-lb f89-sm" x={115} y={434} textAnchor="middle">
          k zemi projde jen málo UV
        </text>
      </Fade>

      {/* catalytic cycle */}
      <Pop delay={0.72}>
        <g>
          {[
            [-16, 0, 'Cl'],
            [16, 0, 'Cl'],
            [0, -16, 'F'],
            [0, 16, 'F'],
          ].map(([dx, dy]) => (
            <line key={`${dx}${dy}`} className="f89-bond" x1={300} y1={62} x2={300 + (dx as number)} y2={62 + (dy as number)} />
          ))}
          {[
            [-16, 0, 'Cl'],
            [16, 0, 'Cl'],
            [0, -16, 'F'],
            [0, 16, 'F'],
          ].map(([dx, dy, el]) => (
            <Atom key={`a${dx}${dy}`} x={300 + (dx as number)} y={62 + (dy as number)} el={el as string} r={el === 'Cl' ? 8 : 6.5} label={false} />
          ))}
          <Atom x={300} y={62} el="C" r={7.5} label={false} />
        </g>
        <text className="f89-lb f89-b" x={330} y={52}>
          freon
        </text>
        <text className="f89-f f89-sm" x={330} y={68}>
          CCl₂F₂
        </text>
      </Pop>
      <Draw d="M258 36 l8 6 l-6 5 l9 6 l-6 5 l10 6" className="f89-ln" delay={0.9} dur={0.3} style={{ stroke: UV, strokeWidth: 2 }} />
      <Fade delay={0.95}>
        <text className="f89-f f89-sm" x={250} y={30} textAnchor="end" style={{ fill: UV }}>
          UV
        </text>
      </Fade>
      <Draw d="M300 84 V130" className="f89-ln" delay={1.03} dur={0.24} />
      <Fade delay={1.17}>
        <polygon points={headAt(300, 132, 300, 110, 9)} fill="var(--edge)" />
      </Fade>

      {/* cycle: Cl· (top) → ClO· (bottom) → Cl· */}
      <Pop delay={1.26}>
        <Atom x={300} y={152} el="Cl" r={11} />
        <Rad x={316} y={142} />
        <text className="f89-lb f89-b" x={274} y={150} textAnchor="end">
          Cl·
        </text>
      </Pop>
      <Pop delay={1.48}>
        <line className="f89-bond" x1={292} y1={296} x2={312} y2={296} />
        <Atom x={290} y={296} el="Cl" r={11} />
        <Atom x={314} y={296} el="O" r={8} />
        <Rad x={328} y={286} />
        <text className="f89-lb f89-b" x={266} y={300} textAnchor="end">
          ClO·
        </text>
      </Pop>
      <Draw d="M318 162 C380 180 380 270 330 286" className="f89-lvstroke" delay={1.35} dur={0.42} style={{ strokeWidth: 2.4 }} />
      <Draw d="M280 286 C226 262 226 180 284 162" className="f89-lvstroke" delay={1.62} dur={0.42} style={{ strokeWidth: 2.4 }} />
      <Fade delay={1.67}>
        <polygon points={headAt(330, 286, 380, 270, 11)} className="f89-lvfill" />
        <text className="f89-f f89-b" x={372} y={214}>
          + O₃
        </text>
        <O3 x={440} y={206} r={5} />
        <text className="f89-f f89-sm" x={372} y={236}>
          → + O₂
        </text>
      </Fade>
      <Fade delay={1.94}>
        <polygon points={headAt(284, 162, 226, 180, 11)} className="f89-lvfill" />
        <text className="f89-f f89-b" x={236} y={214} textAnchor="end">
          + O
        </text>
        <text className="f89-f f89-sm" x={236} y={236} textAnchor="end">
          → + O₂
        </text>
        <text className="f89-lb f89-lv f89-sm" x={300} y={226} textAnchor="middle">
          cyklus
        </text>
        <text className="f89-lb f89-sm" x={330} y={332} textAnchor="middle">
          1 atom Cl zničí až 100 000 molekul O₃
        </text>
      </Fade>

      {/* Montreal protocol */}
      <Fade delay={2.1} dur={0.35}>
        <rect x={196} y={350} width={276} height={78} rx={6} className="f89-soft" style={{ strokeWidth: 1.2 }} />
        <text className="f89-lb f89-b" x={210} y={372}>
          Montrealský protokol (1987)
        </text>
        <text className="f89-lb f89-sm" x={210} y={392}>
          zakázal freony – ozonová vrstva
        </text>
        <text className="f89-lb f89-sm" x={210} y={410}>
          se obnovuje (Antarktida kolem r. 2066)
        </text>
      </Fade>
    </>
  )
}
