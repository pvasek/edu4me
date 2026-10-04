import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, Lbl, StripBox, pat, useFig } from "./kit";

const LABEL =
  "Chrup tří savců podle potravy, lebky z boku. Býložravec (kráva) nemá horní řezáky ani špičáky, jen tvrdou destičku, mezi řezáky a stoličkami má mezeru a široké stoličky s hřebínky trou trávu. Masožravec (vlk) má dlouhé špičáky na zabíjení kořisti a ostré trháky, které stříhají maso jako nůžky. Všežravec (člověk) má všechny čtyři druhy zubů zhruba stejně velké: řezáky, špičáky, třenové zuby a stoličky, v každé polovině čelisti 2, 1, 2 a 3.";

type T = "i" | "c" | "p" | "m" | "k";
const W = 260;
const H = 214;
/** the lower jaw is drawn open by this much */
const OPEN = 18;
/** tooth height factor */
const TH = 1.7;

/** One tooth: upper (hangs down from y) or lower (rises up from y). */
function Tooth({
  x,
  y,
  w,
  h,
  t,
  up = false,
  shape = "block",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  t: T;
  up?: boolean;
  shape?: "block" | "cone" | "chisel" | "blade" | "ridge";
}) {
  const s = up ? -1 : 1; // direction the crown points
  const tip = y + s * h;
  let d: string;
  if (shape === "cone") d = `M${x} ${y} L${x + w / 2} ${tip} L${x + w} ${y}Z`;
  else if (shape === "chisel") d = `M${x} ${y} L${x + w * 0.15} ${tip} L${x + w * 0.85} ${tip} L${x + w} ${y}Z`;
  else if (shape === "blade")
    d = `M${x} ${y} L${x + w * 0.3} ${tip - s * h * 0.35} L${x + w * 0.55} ${tip} L${x + w * 0.75} ${tip - s * h * 0.45} L${x + w} ${y}Z`;
  else if (shape === "ridge")
    d = `M${x} ${y} L${x} ${tip} L${x + w * 0.25} ${tip - s * 3} L${x + w * 0.5} ${tip} L${x + w * 0.75} ${tip - s * 3} L${x + w} ${tip} L${x + w} ${y}Z`;
  else
    d = `M${x} ${y} L${x + w * 0.05} ${tip - s * 2} Q${x + w * 0.25} ${tip + s * 2} ${x + w / 2} ${tip - s * 1} Q${x + w * 0.75} ${tip + s * 2} ${x + w * 0.95} ${tip - s * 2} L${x + w} ${y}Z`;
  return <path d={d} className={`bz2-o bz2-thin bz2-t-${t}`} />;
}

function Skull({ upper, lower, orbit }: { upper: string; lower: string; orbit: [number, number, number] }) {
  const { id } = useFig();
  return (
    <g>
      <path d={upper} className="bz2-o bz2-bone" />
      <path d={upper} fill={pat(id, "d")} opacity={0.6} />
      <g transform={`translate(0 ${OPEN})`}>
        <path d={lower} className="bz2-o bz2-bone" />
        <path d={lower} fill={pat(id, "d")} opacity={0.6} />
      </g>
      <circle cx={orbit[0]} cy={orbit[1]} r={orbit[2]} className="bz2-o bz2-fill2" />
    </g>
  );
}

function Cow() {
  return (
    <Frame w={W} h={H} className="bz2-small">
      <Skull
        upper="M14 96 Q12 80 30 74 L120 56 Q180 34 230 44 Q252 60 248 90 L240 108 L36 108 Q16 106 14 96Z"
        lower="M22 116 L240 116 L242 148 Q236 168 210 164 L120 140 Q60 134 30 128 Q20 124 22 116Z"
        orbit={[200, 66, 12]}
      />
      {/* dental pad, no upper incisors */}
      <rect x={20} y={104} width={36} height={6} rx={3} className="bz2-o bz2-thin bz2-pad" />
      {/* lower incisors, leaning forward */}
      {[0, 1, 2].map((k) => (
        <Tooth key={k} x={22 + k * 9} y={118 + OPEN} w={8} h={12 * TH} t="i" up shape="chisel" />
      ))}
      {/* upper + lower premolars and molars with ridges */}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <g key={k}>
          <Tooth x={124 + k * 19} y={108} w={18} h={10 * TH} t={k < 3 ? "p" : "m"} shape="ridge" />
          <Tooth x={124 + k * 19} y={118 + OPEN} w={18} h={9 * TH} t={k < 3 ? "p" : "m"} up shape="ridge" />
        </g>
      ))}
      <path d="M62 112 H118" className="bz2-o bz2-thin bz2-dash" />
      <Lbl x={90} y={100} anchor="middle" className="bz2-sm">mezera</Lbl>
      <Lbl x={4} y={204} tx={30} ty={108} lx={30} ly={186} className="bz2-sm" sec>bez horních řezáků</Lbl>
      <Lbl x={256} y={208} tx={210} ty={128} anchor="end" lx={226} ly={190} className="bz2-sm bz2-b">ploché stoličky</Lbl>
    </Frame>
  );
}

function Wolf() {
  return (
    <Frame w={W} h={H} className="bz2-small">
      <Skull
        upper="M16 94 Q14 82 30 78 L90 66 Q150 30 214 40 Q246 52 246 84 L236 108 L30 108 Q16 104 16 94Z"
        lower="M24 116 L232 116 L236 140 Q226 160 200 156 L110 134 Q50 130 28 126 Q20 122 24 116Z"
        orbit={[172, 66, 12]}
      />
      {/* incisors */}
      {[0, 1].map((k) => (
        <g key={k}>
          <Tooth x={20 + k * 8} y={108} w={7} h={9 * TH} t="i" shape="chisel" />
          <Tooth x={26 + k * 8} y={118 + OPEN} w={7} h={8 * TH} t="i" up shape="chisel" />
        </g>
      ))}
      {/* canines */}
      <Tooth x={40} y={108} w={12} h={32} t="c" shape="cone" />
      <Tooth x={56} y={118 + OPEN} w={11} h={28} t="c" up shape="cone" />
      {/* premolars: pointed */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <Tooth x={74 + k * 22} y={108} w={18} h={11 * TH} t="p" shape="cone" />
          <Tooth x={80 + k * 22} y={118 + OPEN} w={18} h={11 * TH} t="p" up shape="cone" />
        </g>
      ))}
      {/* carnassials (upper P4, lower M1) */}
      <Tooth x={142} y={108} w={30} h={13 * TH} t="k" shape="blade" />
      <Tooth x={150} y={118 + OPEN} w={30} h={12 * TH} t="k" up shape="blade" />
      {/* molars */}
      <Tooth x={176} y={108} w={18} h={8 * TH} t="m" />
      <Tooth x={184} y={118 + OPEN} w={16} h={8 * TH} t="m" up />
      <Lbl x={4} y={204} tx={46} ty={134} lx={40} ly={186} className="bz2-sm bz2-b">špičák</Lbl>
      <Lbl x={256} y={208} tx={160} ty={126} anchor="end" lx={210} ly={192} className="bz2-sm bz2-b bz2-lvl-t">trháky</Lbl>
    </Frame>
  );
}

function Human() {
  // half of each jaw: 2 incisors, 1 canine, 2 premolars, 3 molars
  const row: { t: T; w: number; shape: "chisel" | "cone" | "block" }[] = [
    { t: "i", w: 10, shape: "chisel" },
    { t: "i", w: 10, shape: "chisel" },
    { t: "c", w: 12, shape: "cone" },
    { t: "p", w: 14, shape: "block" },
    { t: "p", w: 14, shape: "block" },
    { t: "m", w: 18, shape: "block" },
    { t: "m", w: 18, shape: "block" },
    { t: "m", w: 17, shape: "block" },
  ];
  let x = 74;
  const xs = row.map((r) => {
    const v = x;
    x += r.w + 1;
    return v;
  });
  return (
    <Frame w={W} h={H} className="bz2-small">
      <Skull
        upper="M70 64 Q76 8 150 8 Q222 10 230 70 Q232 100 212 112 L208 116 L82 116 Q70 112 70 102 L62 94 Q70 82 70 64Z"
        lower="M78 124 L208 124 L212 150 Q206 172 176 168 L104 160 Q84 152 78 124Z"
        orbit={[100, 62, 14]}
      />
      {row.map((r, k) => (
        <g key={k}>
          <Tooth x={xs[k]} y={116} w={r.w} h={(r.t === "c" ? 11 : 9) * TH} t={r.t} shape={r.shape} />
          <Tooth x={xs[k] + 2} y={124 + OPEN} w={r.w} h={(r.t === "c" ? 10 : 8) * TH} t={r.t} up shape={r.shape} />
        </g>
      ))}
      <Lbl x={140} y={208} anchor="middle" className="bz2-sm bz2-b">2 · 1 · 2 · 3</Lbl>
    </Frame>
  );
}

const KEY: [T, string][] = [
  ["i", "řezáky"],
  ["c", "špičáky"],
  ["p", "třenové zuby"],
  ["m", "stoličky"],
  ["k", "trháky"],
];

function Legend() {
  const { narrow } = useFig();
  const pos = (i: number) => (narrow ? [6 + (i % 3) * 112, 6 + Math.floor(i / 3) * 28] : [14 + i * 124, 8]);
  return (
    <Frame w={narrow ? 340 : 620} h={narrow ? 62 : 34}>
      {KEY.map(([t, name], i) => (
        <g key={t} transform={`translate(${pos(i)[0]} ${pos(i)[1]})`}>
          <rect x={0} y={0} width={18} height={18} rx={3} className={`bz2-o bz2-thin bz2-t-${t}`} />
          <text x={26} y={15} className="bz2-lbl bz2-b">
            {name}
          </text>
        </g>
      ))}
    </Frame>
  );
}

export default function MammalTeeth() {
  return (
    <Figure level={5} label={LABEL} max={860} interactive boost={false}>
      <StripBox label={LABEL}>
        <StepStrip
          min={190}
          steps={[
            { title: "Býložravec – kráva", art: <Cow />, caption: "Bez horních řezáků a špičáků; široké stoličky trou trávu." },
            { title: "Masožravec – vlk", art: <Wolf />, caption: "Dlouhé špičáky drží kořist, ostré trháky stříhají maso." },
            { title: "Všežravec – člověk", art: <Human />, caption: "Všechny druhy zubů, žádný přehnaně velký; vzorec 2-1-2-3." },
          ]}
        />
        <Legend />
      </StripBox>
    </Figure>
  );
}
