import { Draw, DrawArrow, Fade, Figure, Sym, f1 } from './kit'

const LABEL =
  'Elektromagnetická vlna ve trojrozměrném pohledu. Vlna se šíří podél osy x rychlostí světla c. Vektor intenzity elektrického pole E kmitá ve svislé rovině, vektor magnetické indukce B ve vodorovné rovině, kolmo na E. Oba kmitají ve fázi, oba jsou kolmé na směr šíření – vlna je příčná. Vzdálenost dvou sousedních hřebenů je vlnová délka λ. Vlna nepotřebuje žádné prostředí a ve vakuu se šíří rychlostí c = 3 · 10⁸ m/s.'

const O = [64, 150] as const
const LEN = 400
const LAM = 200
const A = 78
const KZ: [number, number] = [-0.24, 0.5] // screen offset per unit of z (towards the viewer)

const e = (x: number) => A * Math.sin((2 * Math.PI * x) / LAM)
const pe = (x: number): [number, number] => [O[0] + x, O[1] - e(x)]
const pb = (x: number): [number, number] => [O[0] + x + KZ[0] * e(x), O[1] + KZ[1] * e(x)]
const curve = (p: (x: number) => [number, number]) => {
  const pts: string[] = []
  for (let x = 0; x <= LEN; x += 4) pts.push(`${f1(p(x)[0])} ${f1(p(x)[1])}`)
  return 'M' + pts.join(' L')
}

export default function EmWave() {
  const stems = Array.from({ length: LEN / 10 + 1 }, (_, i) => i * 10)
  const crest = LAM / 4
  return (
    <Figure level={11} w={520} h={300} max={680} label={LABEL}>
      {/* stems: the field vectors along the axis */}
      <Fade delay={0.7}>
        <path d={stems.map((x) => `M${f1(O[0] + x)} ${O[1]} L${f1(pe(x)[0])} ${f1(pe(x)[1])}`).join(' ')} className="fz4-stem fz4-stem-e" />
        <path d={stems.map((x) => `M${f1(O[0] + x)} ${O[1]} L${f1(pb(x)[0])} ${f1(pb(x)[1])}`).join(' ')} className="fz4-stem fz4-stem-b" />
      </Fade>
      {/* axes */}
      <DrawArrow d={`M${O[0] - 20} ${O[1]} H${O[0] + LEN + 40}`} tone="ink" className="fz4-axis" />
      <DrawArrow d={`M${O[0]} ${O[1] + 4} V${O[1] - A - 30}`} tone="ink" className="fz4-axis" delay={0.1} />
      <DrawArrow d={`M${O[0]} ${O[1]} L${f1(O[0] + KZ[0] * 120)} ${f1(O[1] + KZ[1] * 120)}`} tone="ink" className="fz4-axis" delay={0.2} />
      <Draw d={curve(pe)} className="fz4-wave-e" delay={0.2} />
      <Draw d={curve(pb)} className="fz4-wave-b" delay={0.35} />
      <Fade delay={1}>
        <Sym x={O[0] + LEN + 40} y={O[1] + 22} t="x" anchor="end" />
        <Sym x={O[0] + 12} y={O[1] - A - 22} t="E" tone="red" anchor="start" />
        <Sym x={O[0] + KZ[0] * 120 - 10} y={O[1] + KZ[1] * 120 + 6} t="B" tone="blue" anchor="end" />
      </Fade>
      {/* wavelength */}
      <Fade delay={1.2}>
        <path
          d={`M${O[0] + crest} ${O[1] - A - 8} V${O[1] - A - 26} M${O[0] + crest + LAM} ${O[1] - A - 8} V${O[1] - A - 26} M${O[0] + crest + 2} ${O[1] - A - 17} H${O[0] + crest + LAM - 2}`}
          className="fz4-o fz4-thin"
        />
        <Sym x={O[0] + crest + LAM / 2} y={O[1] - A - 24} t="λ" />
      </Fade>
      {/* propagation */}
      <DrawArrow d={`M${O[0] + 330} 44 H${O[0] + 410}`} tone="lvl" className="fz4-vec" delay={1.1} />
      <Fade delay={1.3}>
        <Sym x={O[0] + 418} y={50} t="c" tone="lvl" anchor="start" />
        <text x={O[0] + 370} y={68} textAnchor="middle" className="fz4-lbl fz4-sm">
          směr šíření
        </text>
        <rect x={O[0] + 34} y={O[1] + 104} width={300} height={34} rx={6} className="fz4-tag-lvl" />
        <text x={O[0] + 184} y={O[1] + 126} textAnchor="middle" className="fz4-lbl fz4-b">
          <tspan className="fz4-it">E</tspan> ⊥ <tspan className="fz4-it">B</tspan>, oba kolmé na směr šíření
        </text>
      </Fade>
    </Figure>
  )
}
