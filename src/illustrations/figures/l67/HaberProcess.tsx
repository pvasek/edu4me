import { ChemText, Eq, Fade, Figure, Lbl, Liquid, Pipe, Pop } from './kit'
import { Bed, Compressor, Cooler, Vessel } from './flow'

const N2 = '#3d6fd1'
const H2 = '#c9c2ae'
const MIX = '#8a86c9'
const NH3 = '#3f9e94'

export default function HaberProcess() {
  return (
    <Figure
      level={7}
      w={480}
      h={500}
      max={620}
      label="Haberova–Boschova syntéza amoniaku jako výrobní schéma. Dusík ze vzduchu a vodík ze zemního plynu se smísí, kompresor je stlačí na asi 20 MPa a vedou se do reaktoru se železným katalyzátorem při asi 450 °C, kde vzniká amoniak: N2 + 3H2 ⇌ 2NH3, ΔH = −92 kJ/mol. Směs se v chladiči ochladí, amoniak zkapalní a odteče. Nezreagovaný dusík a vodík (při jednom průchodu zreaguje jen asi 15 %) se vrací zpět do reaktoru."
    >
      {/* feed */}
      <Pipe d="M20 64 H92 Q110 64 110 82" gas={N2} delay={0} />
      <Pipe d="M20 136 H92 Q110 136 110 118" gas={H2} delay={0.1} />
      <Pipe d="M110 100 H164" gas={MIX} delay={0.3} />
      <Pipe d="M216 100 H244 Q262 100 262 82 V64 Q262 52 274 52 H300" gas={MIX} delay={0.5} />
      {/* reactor → cooler → separator */}
      <Pipe d="M335 256 V300 H292" gas={NH3} delay={0.9} />
      <Pipe d="M200 328 H172" gas={NH3} delay={1.1} />
      <Pipe d="M140 382 V416 H24" gas={NH3} delay={1.3} />
      {/* recycle loop */}
      <Pipe d="M140 270 V106" gas={MIX} delay={1.3} reverse={false} />
      <circle cx={110} cy={100} r={8} className="f67-o f67-fill3" />
      <circle cx={140} cy={100} r={5} className="f67-o f67-fill3" />

      <Pop delay={0.4}>
        <Compressor x={190} y={100} />
      </Pop>
      <Pop delay={0.6}>
        <Vessel x={300} y={36} w={70} h={220}>
          <Bed x={300} y={76} w={70} color="#b86a3c" />
          <Bed x={300} y={132} w={70} color="#b86a3c" />
          <Bed x={300} y={188} w={70} color="#b86a3c" />
        </Vessel>
      </Pop>
      <Pop delay={0.9}>
        <Cooler x={200} y={286} w={92} h={62} />
      </Pop>
      <Pop delay={1.1}>
        <Vessel x={110} y={270} w={60} h={112}>
          <Liquid d="M110 334 H170 V382 H110Z" color={NH3} opacity={0.5} />
        </Vessel>
      </Pop>

      {/* labels */}
      <Fade delay={0.8}>
        <text x={18} y={52} className="f67-lbl f67-b">
          <ChemText text="N_{2}" />
          <tspan className="f67-sec" dx={6} style={{ fontWeight: 600 }}>
            ze vzduchu
          </tspan>
        </text>
        <text x={18} y={160} className="f67-lbl f67-b">
          <ChemText text="H_{2}" />
          <tspan className="f67-sec" dx={6} style={{ fontWeight: 600 }}>
            ze zemního plynu
          </tspan>
        </text>
        <text x={190} y={148} textAnchor="middle" className="f67-lbl">
          kompresor
        </text>
        <rect x={158} y={156} width={64} height={22} rx={4} className="f67-tag-lvl" />
        <text x={190} y={172} textAnchor="middle" className="f67-num f67-num-b">
          20 MPa
        </text>
        <text x={335} y={26} textAnchor="middle" className="f67-lbl f67-b">
          reaktor
        </text>
        <Lbl x={382} y={96} tx={362} ty={84} className="f67-sm">
          Fe katalyzátor
        </Lbl>
        <rect x={382} y={128} width={66} height={22} rx={4} className="f67-tag-lvl" />
        <text x={415} y={144} textAnchor="middle" className="f67-num f67-num-b">
          450 °C
        </text>
        <Lbl x={382} y={236} tx={346} ty={272} className="f67-sm" sec>
          asi 15 % zreaguje
        </Lbl>
        <text x={246} y={370} textAnchor="middle" className="f67-lbl">
          chladič
        </text>
        <text x={246} y={388} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          <ChemText text="NH_{3} zkapalní" />
        </text>
        <text x={24} y={408} className="f67-lbl f67-b" style={{ fill: NH3 }}>
          <ChemText text="kapalný NH_{3}" />
        </text>
        <text x={130} y={214} textAnchor="end" className="f67-lbl f67-b">
          recyklace
        </text>
        <text x={130} y={232} textAnchor="end" className="f67-lbl f67-sm">
          <ChemText text="N_{2} + H_{2} zpět" />
        </text>
      </Fade>

      <Pop delay={1.6}>
        <rect x={20} y={436} width={440} height={56} rx={6} className="f67-tag-lvl" />
        <Eq x={240} y={458} t="N_{2} + 3H_{2} ⇌ 2NH_{3}    ΔH = −92 kJ/mol" anchor="middle" className="f67-eq-lg" />
        <text x={240} y={480} textAnchor="middle" className="f67-lbl f67-sm">
          vysoký tlak zvyšuje výtěžek, 450 °C je kompromis s rychlostí
        </text>
      </Pop>
    </Figure>
  )
}
