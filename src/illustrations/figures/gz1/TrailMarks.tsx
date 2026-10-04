import { Fade, Figure, Pop, useFig } from "./kit";

const LABEL =
  "Turistické značky Klubu českých turistů (KČT). Pásová značka má tři vodorovné pruhy, prostřední barevný: červená značí dálkové a hřebenové trasy, modrá významné trasy, zelená místní trasy a žlutá krátké spojovací trasy. Na rozcestí stojí rozcestník s tabulkou názvu místa a nadmořské výšky a se směrovkami, které ukazují cíle a vzdálenosti v kilometrech. Místní značka je čtverec rozdělený úhlopříčně s barevným trojúhelníkem vpravo nahoře; změnu směru ukazuje značka ve tvaru šipky.";

const W = 560;
const H = 470;

const COLS = {
  red: "#c8312b",
  blue: "#2f5fb3",
  green: "#2f8a45",
  yellow: "#e2b51c",
} as const;
type Col = keyof typeof COLS;

/** the stripe mark: white – colour – white, a 10 × 10 cm square */
function Stripe({ x, y, s = 54, c }: { x: number; y: number; s?: number; c: Col }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} className="gz1-mark-w" />
      <rect x={x} y={y + s / 3} width={s} height={s / 3} fill={COLS[c]} />
      <rect x={x} y={y} width={s} height={s} className="gz1-o gz1-thin" />
    </g>
  );
}

function Local({ x, y, s = 54, c }: { x: number; y: number; s?: number; c: Col }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} className="gz1-mark-w" />
      <path d={`M${x} ${y} H${x + s} V${y + s}Z`} fill={COLS[c]} />
      <rect x={x} y={y} width={s} height={s} className="gz1-o gz1-thin" />
    </g>
  );
}

function Turn({ x, y, s = 54, c }: { x: number; y: number; s?: number; c: Col }) {
  const { id } = useFig();
  const d = `M${x} ${y} H${x + s * 0.7} L${x + s * 1.15} ${y + s / 2} L${x + s * 0.7} ${y + s} H${x}Z`;
  return (
    <g>
      <clipPath id={`${id}-turn`}>
        <path d={d} />
      </clipPath>
      <path d={d} className="gz1-mark-w" />
      <rect x={x} y={y + s / 3} width={s * 1.2} height={s / 3} fill={COLS[c]} clipPath={`url(#${id}-turn)`} />
      <path d={d} className="gz1-o gz1-thin" />
    </g>
  );
}

/** a direction board of a signpost, pointing right, with the stripe mark at its tip */
function Board({ x, y, text, km, c }: { x: number; y: number; text: string; km: string; c: Col }) {
  const w = 214;
  const h = 34;
  return (
    <g>
      <path d={`M${x} ${y} H${x + w - 16} L${x + w} ${y + h / 2} L${x + w - 16} ${y + h} H${x}Z`} className="gz1-mark-w gz1-o gz1-thin" />
      <Stripe x={x + w - 46} y={y + 5} s={24} c={c} />
      <text x={x + 10} y={y + 23} className="gz1-sign-t">
        {text}
      </text>
      <text x={x + w - 54} y={y + 23} textAnchor="end" className="gz1-sign-t">
        {km}
      </text>
    </g>
  );
}

const STRIPES: [Col, string, string][] = [
  ["red", "červená", "dálková trasa"],
  ["blue", "modrá", "významná trasa"],
  ["green", "zelená", "místní trasa"],
  ["yellow", "žlutá", "krátká spojka"],
];

export default function TrailMarks() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={620}>
      {/* row 1: the four stripe marks */}
      <text x={20} y={26} className="gz1-lbl gz1-b gz1-lvl-t">
        pásové značky
      </text>
      {STRIPES.map(([c, name, use], i) => {
        const x = 20 + i * 136;
        return (
          <Pop key={c} delay={0.1 + i * 0.1}>
            <rect x={x - 6} y={38} width={66} height={66} rx={4} className="gz1-bark-bg" />
            <Stripe x={x} y={44} c={c} />
            <text x={x + 27} y={128} textAnchor="middle" className="gz1-lbl gz1-b">
              {name}
            </text>
            <text x={x + 27} y={146} textAnchor="middle" className="gz1-lbl gz1-sm">
              {use}
            </text>
          </Pop>
        );
      })}

      {/* row 2: a signpost */}
      <Fade delay={0.6}>
        <text x={20} y={190} className="gz1-lbl gz1-b gz1-lvl-t">
          rozcestník
        </text>
        <rect x={56} y={204} width={12} height={258} className="gz1-post gz1-o gz1-thin" />
        <rect x={10} y={208} width={104} height={46} rx={3} className="gz1-mark-w gz1-o gz1-thin" />
        <text x={62} y={227} textAnchor="middle" className="gz1-sign-t">
          U Kapličky
        </text>
        <text x={62} y={245} textAnchor="middle" className="gz1-sign-t">
          512 m
        </text>
        <Board x={68} y={268} text="Vyhlídka" km="1,5 km" c="red" />
        <Board x={68} y={308} text="Hrad" km="4 km" c="blue" />
        <Board x={68} y={348} text="Nádraží" km="6,5 km" c="green" />
        <text x={130} y={410} className="gz1-lbl gz1-sm">
          název místa a výška
        </text>
        <text x={130} y={428} className="gz1-lbl gz1-sm">
          směrovky: cíl a vzdálenost
        </text>
      </Fade>

      {/* row 2 right: local mark and turn mark */}
      <Fade delay={0.9}>
        <Local x={340} y={214} c="green" />
        <text x={408} y={236} className="gz1-lbl gz1-b">
          místní
        </text>
        <text x={408} y={254} className="gz1-lbl gz1-b">
          značka
        </text>
        <Turn x={340} y={310} c="red" />
        <text x={408} y={332} className="gz1-lbl gz1-b">
          odbočení
        </text>
        <text x={408} y={350} className="gz1-lbl gz1-sm">
          trasa zahýbá
        </text>
        <text x={340} y={410} className="gz1-lbl gz1-sm gz1-muted-t">
          značky jsou namalované
        </text>
        <text x={340} y={428} className="gz1-lbl gz1-sm gz1-muted-t">
          na stromech a sloupech
        </text>
      </Fade>
    </Figure>
  );
}
