import { ChemText, DrawArrow, Fade, Figure, Pop, Travel } from './kit'
import { Banner, Cloud, Factory, Rabbit, Soil, Tag } from './scenery'

const G = 252 // ground line

function Legume({ x }: { x: number }) {
  const leaf = (cx: number, cy: number) =>
    [0, 120, 240].map((a) => {
      const r = (a * Math.PI) / 180
      return <ellipse key={a} cx={cx + Math.cos(r - Math.PI / 2) * 8} cy={cy + Math.sin(r - Math.PI / 2) * 8} rx={7} ry={8} transform={`rotate(${a} ${cx + Math.cos(r - Math.PI / 2) * 8} ${cy + Math.sin(r - Math.PI / 2) * 8})`} fill="#6f9f55" className="f67-o f67-thin" />
    })
  return (
    <g>
      <path d={`M${x} ${G} Q${x - 4} ${G - 40} ${x - 8} ${G - 78} M${x} ${G - 30} Q${x + 12} ${G - 46} ${x + 20} ${G - 56}`} className="f67-o" style={{ stroke: '#4f7f3a' }} />
      {leaf(x - 8, G - 84)}
      {leaf(x + 22, G - 62)}
      {/* roots with nodules */}
      <path d={`M${x} ${G} V${G + 60} M${x} ${G + 16} L${x - 18} ${G + 44} M${x} ${G + 24} L${x + 20} ${G + 50} M${x} ${G + 40} L${x - 12} ${G + 66}`} className="f67-o f67-thin" />
      {[
        [x - 12, G + 36],
        [x - 17, G + 43],
        [x + 13, G + 40],
        [x + 19, G + 48],
        [x + 3, G + 52],
        [x - 9, G + 62],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3.6} fill="#e3a0a8" className="f67-o f67-thin" />
      ))}
    </g>
  )
}

function Wheat({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} ${G} Q${x + 2} ${G - 60} ${x - 2} ${G - 100} M${x} ${G - 30} Q${x - 18} ${G - 44} ${x - 24} ${G - 66} M${x + 1} ${G - 50} Q${x + 16} ${G - 60} ${x + 20} ${G - 80}`} className="f67-o" style={{ stroke: '#8a8a3a' }} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <ellipse cx={x - 5} cy={G - 104 - i * 7} rx={3} ry={5} transform={`rotate(-25 ${x - 5} ${G - 104 - i * 7})`} fill="#d9b44a" className="f67-o f67-thin" />
          <ellipse cx={x + 2} cy={G - 106 - i * 7} rx={3} ry={5} transform={`rotate(25 ${x + 2} ${G - 106 - i * 7})`} fill="#d9b44a" className="f67-o f67-thin" />
        </g>
      ))}
      <path d={`M${x} ${G} V${G + 44} M${x} ${G + 12} L${x - 14} ${G + 36} M${x} ${G + 18} L${x + 14} ${G + 40}`} className="f67-o f67-thin" />
    </g>
  )
}

function Bolt({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} l-12 34 h10 l-10 36 l26 -46 h-11 l9 -24Z`} fill="#f0c53a" className="f67-o f67-thin f67-flash" />
}

const P = {
  haber: 'M62 58 V124',
  fert: 'M128 262 Q140 320 156 364',
  fix: 'M214 56 Q170 120 186 214',
  nod: 'M196 322 Q196 348 184 364',
  nitr1: 'M208 388 Q236 414 256 414',
  nitr2: 'M316 414 Q350 412 380 390',
  rain: 'M300 250 Q320 330 380 372',
  asim: 'M410 362 V300',
  food: 'M424 176 Q446 176 454 196',
  amon: 'M478 262 Q496 456 320 452 Q190 450 172 398',
  denit: 'M430 370 Q520 320 506 60',
}

export default function NitrogenCycle() {
  return (
    <Figure
      level={7}
      w={520}
      h={470}
      max={680}
      label="Koloběh dusíku. Vzduch obsahuje 78 % dusíku N2. Fixace: hlízkové bakterie na kořenech bobovitých rostlin a blesky převádějí N2 na sloučeniny, v půdě vznikají amonné ionty NH4+. Nitrifikace: půdní bakterie je oxidují přes dusitany NO2− na dusičnany NO3−. Asimilace: rostliny přijímají dusičnany a tvoří bílkoviny, živočichové je získají potravou. Amonizace: rozkladači mění odumřelá těla a výkaly zpět na NH4+. Denitrifikace: bakterie redukují dusičnany zpět na N2. Průmysl přidává dusík Haberovou–Boschovou syntézou amoniaku a hnojivy."
    >
      <Soil x={0} y={G} w={520} h={218} />
      <Pop>
        <Banner x={260} y={30} w={210}>
          <ChemText text="N_{2} ve vzduchu (78 %)" />
        </Banner>
      </Pop>

      {/* scenery */}
      <Pop delay={0.15}>
        <Factory x={20} y={G} />
        <path d="M110 250 Q108 222 118 216 H146 Q156 222 154 250Z" className="f67-o f67-fill" />
        <path d="M116 216 L112 208 H152 L148 216" className="f67-o f67-fill3" />
      </Pop>
      <Pop delay={0.25}>
        <Legume x={196} />
      </Pop>
      <Pop delay={0.35}>
        <Cloud x={296} y={100} />
        <Bolt x={306} y={112} />
        <path d="M306 186 l-10 30 l10 -4 l-6 34" className="f67-o f67-thin" style={{ stroke: '#c9962c' }} />
      </Pop>
      <Pop delay={0.45}>
        <Wheat x={410} />
      </Pop>
      <Pop delay={0.55}>
        <Rabbit x={470} y={G} />
      </Pop>

      {/* soil chemistry */}
      <Pop delay={0.7}>
        <Tag x={172} y={384} t="NH_{4}^{+}" />
        <Tag x={286} y={416} t="NO_{2}^{-}" />
        <Tag x={410} y={380} t="NO_{3}^{-}" />
      </Pop>

      {/* processes */}
      {Object.entries(P).map(([k, d], i) => (
        <DrawArrow key={k} d={d} tone={k === 'denit' || k === 'fix' ? 'lvl' : k === 'haber' || k === 'fert' ? 'acc' : 'ink'} delay={0.8 + i * 0.12} />
      ))}
      <Travel path={P.amon} dur={6} rest={[400, 450]}>
        <circle r={4} className="f67-lvl-f f67-o f67-thin" />
      </Travel>
      <Travel path={P.denit} dur={5} rest={[513, 200]}>
        <circle r={4} className="f67-lvl-f f67-o f67-thin" />
      </Travel>

      <Fade delay={1.6}>
        <text x={14} y={116} className="f67-lbl f67-sm f67-b f67-acc-t f67-halo">
          Haber–Bosch
        </text>
        <text x={132} y={202} textAnchor="middle" className="f67-lbl f67-sm f67-halo">
          hnojivo
        </text>
        <text x={166} y={112} textAnchor="end" className="f67-lbl f67-b f67-lvl-t f67-halo">
          fixace
        </text>
        <text x={226} y={306} className="f67-lbl f67-sm f67-halo">
          hlízkové
        </text>
        <text x={226} y={322} className="f67-lbl f67-sm f67-halo">
          bakterie
        </text>
        <text x={340} y={150} className="f67-lbl f67-sm f67-b f67-halo">
          blesk
        </text>
        <text x={340} y={166} className="f67-lbl f67-sm f67-sec f67-halo">
          <ChemText text="N_{2} + O_{2} → NO" />
        </text>
        <text x={286} y={390} textAnchor="middle" className="f67-lbl f67-b f67-halo">
          nitrifikace
        </text>
        <text x={420} y={336} className="f67-lbl f67-b f67-halo">
          asimilace
        </text>
        <text x={432} y={168} className="f67-lbl f67-sm f67-sec f67-halo">
          potrava
        </text>
        <text x={330} y={442} textAnchor="middle" className="f67-lbl f67-b f67-halo">
          amonizace (rozkladači)
        </text>
        <text x={500} y={120} textAnchor="end" className="f67-lbl f67-b f67-lvl-t f67-halo">
          denitrifikace
        </text>
      </Fade>
    </Figure>
  )
}
