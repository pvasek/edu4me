import { DrawArrow, Draw, Fade, Figure, Pop, Qty, cz, f1 } from './kit'

const LABEL =
  'Energetické hladiny atomu vodíku podle vztahu E_n = −13,6 eV / n², svislá osa energie je v měřítku. Základní stav n = 1 má −13,6 eV, n = 2 −3,40 eV, n = 3 −1,51 eV, n = 4 −0,85 eV; s rostoucím n leží hladiny stále hustěji a blíží se nule, hladina n = ∞ (0 eV) znamená volný elektron. Šipky jsou přechody s vyzářením fotonu o energii h · f rovné rozdílu hladin. Přechody na n = 1 tvoří Lymanovu sérii v ultrafialové oblasti, přechody na n = 2 Balmerovu sérii ve viditelném světle: z n = 3 červená čára 656 nm, z n = 4 modrozelená 486 nm, z n = 5 modrofialová 434 nm a z n = 6 fialová 410 nm. Dole tyto čáry v emisním spektru vodíku.'

const Y0 = 66 // E = 0
const K = 31.5 // px per eV
const X0 = 64
const X1 = 384
const yE = (n: number) => Y0 + (13.6 / (n * n)) * K
const BALMER: [number, number, string][] = [
  [3, 656, '#e0352b'],
  [4, 486, '#2f9fd6'],
  [5, 434, '#4a55d8'],
  [6, 410, '#7d3fc0'],
]
const SX = (nm: number) => 70 + (nm - 400) // spectrum strip: 1 px per nm
const SY = 556

/** A filled arrow head in a literal spectral colour. */
function Head({ x, y, deg, s = 1, fill }: { x: number; y: number; deg: number; s?: number; fill: string }) {
  return <path d="M-5 -4.2 L5 0 L-5 4.2 L-2.6 0Z" fill={fill} transform={`translate(${f1(x)} ${f1(y)}) rotate(${deg}) scale(${s})`} />
}

export default function EnergyLevels() {
  const levels = [1, 2, 3, 4, 5, 6, 7, 8]
  return (
    <Figure level={12} w={460} h={612} max={560} label={LABEL}>
      {/* levels */}
      {levels.map((n, i) => (
        <Draw key={n} d={`M${X0} ${yE(n).toFixed(1)} H${X1}`} className={n <= 4 ? 'fz4-level' : 'fz4-level fz4-level-thin'} delay={i * 0.05} />
      ))}
      <Draw d={`M${X0} ${Y0} H${X1}`} className="fz4-level fz4-level-inf" delay={0.4} />
      <Fade delay={0.5}>
        {[1, 2, 3, 4].map((n) => (
          <g key={n}>
            <text x={X0 - 8} y={yE(n) + 5} textAnchor="end" className="fz4-eq">
              n = {n}
            </text>
            <text x={X1 + 6} y={yE(n) + 5} className="fz4-eq fz4-eq-sm">
              −{cz(13.6 / (n * n), n === 1 ? 1 : 2)} eV
            </text>
          </g>
        ))}
        <text x={X0 - 8} y={Y0 + 5} textAnchor="end" className="fz4-eq">
          n = ∞
        </text>
        <text x={X1 + 6} y={Y0 + 5} className="fz4-eq fz4-eq-sm">
          0 eV
        </text>
        <text x={(X0 + X1) / 2} y={Y0 - 12} textAnchor="middle" className="fz4-lbl fz4-sm fz4-muted-t">
          volný elektron (ionizace)
        </text>
        <text x={X0} y={yE(1) + 24} className="fz4-lbl fz4-sm fz4-muted-t">
          základní stav
        </text>
      </Fade>
      {/* Lyman series (UV) */}
      {[2, 3, 4, 5].map((n, i) => (
        <DrawArrow key={n} d={`M${92 + i * 20} ${yE(n).toFixed(1)} V${(yE(1) - 2).toFixed(1)}`} tone="muted" delay={0.7 + i * 0.1} className="fz4-trans" />
      ))}
      {/* Balmer series (visible) */}
      {BALMER.map(([n, , c], i) => (
        <g key={n}>
          <Draw d={`M${230 + i * 26} ${yE(n).toFixed(1)} V${(yE(2) - 9).toFixed(1)}`} className="fz4-trans" style={{ stroke: c }} delay={1 + i * 0.1} />
          <Fade delay={1.5}>
            <Head x={230 + i * 26} y={yE(2) - 5} deg={90} s={1.1} fill={c} />
          </Fade>
        </g>
      ))}
      <Fade delay={1.3}>
        <text x={176} y={300} className="fz4-lbl fz4-b">
          Lymanova série
        </text>
        <text x={176} y={318} className="fz4-lbl fz4-sm">
          ultrafialové záření
        </text>
        <text x={230} y={yE(2) + 26} className="fz4-lbl fz4-b">
          Balmerova série
        </text>
        <text x={230} y={yE(2) + 44} className="fz4-lbl fz4-sm">
          viditelné světlo
        </text>
      </Fade>
      <Pop delay={1.5}>
        <rect x={176} y={350} width={230} height={62} rx={6} className="fz4-tag-lvl" />
        <Qty x={291} y={374} s="h f = E_{m} − E_{n}" anchor="middle" />
        <text x={291} y={400} textAnchor="middle" className="fz4-eq fz4-eq-sm">
          3 → 2: 1,89 eV, tedy 656 nm
        </text>
      </Pop>
      {/* visible emission spectrum */}
      <text x={220} y={SY - 14} textAnchor="middle" className="fz4-lbl fz4-sm fz4-b">
        viditelné čáry ve spektru vodíku
      </text>
      <rect x={SX(400)} y={SY} width={300} height={28} rx={3} className="fz4-spectrum-bg" />
      <Fade delay={1.6}>
        {BALMER.map(([n, nm, c]) => (
          <rect key={n} x={SX(nm) - 1.5} y={SY + 2} width={3} height={24} fill={c} className="fz4-sline" />
        ))}
        {BALMER.map(([n, nm]) => (
          <text key={n} x={SX(nm) + (nm === 410 ? 2 : nm === 434 ? 6 : 0)} y={SY + 46} textAnchor={nm === 410 ? 'end' : nm === 434 ? 'start' : 'middle'} className="fz4-eq fz4-eq-sm">
            {nm}
          </text>
        ))}
        <text x={SX(700) + 8} y={SY + 46} className="fz4-eq fz4-eq-sm">
          nm
        </text>
      </Fade>
    </Figure>
  )
}
