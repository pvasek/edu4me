import type { ReactNode } from "react";
import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Body, Figure, Frame, ell, f1, pat, useFig } from "./kit";

const LABEL =
  "Zjednodušený životní cyklus mechu a kapradiny: výtrusy, gametofyt, pohlavní buňky a sporofyt se pravidelně střídají (rodozměna). Mech: z výtrusu vyroste zelená lodyžka mechu, gametofyt, který převládá; na ní vzniknou vajíčka a spermie, spermie doplave za vajíčkem v kapce vody; z oplozeného vajíčka vyroste na lodyžce štět s tobolkou, sporofyt, a v tobolce vzniknou nové výtrusy. Kapradina: z výtrusu vyroste jen malý srdčitý prokel, gametofyt; po oplození ve vodě z něj vyroste velká kapradina, sporofyt, který převládá a na rubu listů nese výtrusnice s výtrusy.";

const W = 320;
const H = 330;
const C = [
  [80, 70],
  [240, 70],
  [240, 220],
  [80, 220],
] as const;

function Corner({ k, title, sub, big = false, children }: { k: number; title: string; sub: string; big?: boolean; children: ReactNode }) {
  const [x, y] = C[k];
  return (
    <g>
      {big && <rect x={x - 60} y={y - 58} width={120} height={150} rx={12} className="bz1-lvlsoft-f" />}
      {big && <rect x={x - 60} y={y - 58} width={120} height={150} rx={12} className="bz1-o bz1-thin bz1-lvl-s bz1-dash" />}
      {children}
      <text x={x} y={y + 58} textAnchor="middle" className={`bz1-lbl bz1-b ${big ? "bz1-lvl-t" : ""}`}>
        {title}
      </text>
      <text x={x} y={y + 76} textAnchor="middle" className="bz1-lbl bz1-sm">
        {sub}
      </text>
    </g>
  );
}

function Arrows() {
  return (
    <g>
      <Arrow d="M142 40 H178" tone="lvl" />
      <Arrow d="M313 110 V184" tone="lvl" />
      <Arrow d="M178 196 H142" tone="lvl" />
      <Arrow d="M7 184 V110" tone="lvl" />
    </g>
  );
}

/** Spores spreading from (x, y). */
function Spores({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {(
        [
          [10, 6],
          [20, 16],
          [6, 22],
          [28, 4],
          [34, 22],
          [16, 32],
          [40, 12],
          [26, 38],
        ] as const
      ).map(([dx, dy], i) => (
        <circle key={i} cx={x + dx} cy={y + dy} r={2.6} className="bz1-o bz1-thin bz1-pollen" />
      ))}
    </g>
  );
}

function MossShoot({ x, y, h = 44, s = 1 }: { x: number; y: number; h?: number; s?: number }) {
  const leaves: string[] = [];
  for (let k = 4; k < h; k += 5) {
    const w = (5 + (1 - k / h) * 3) * s;
    leaves.push(`M${x} ${y - k} q${f1(-w * 0.6)} -1 ${f1(-w)} -5 M${x} ${y - k - 2} q${f1(w * 0.6)} -1 ${f1(w)} -5`);
  }
  return (
    <g>
      <path d={`M${x} ${y} V${y - h}`} className="bz1-o" style={{ strokeWidth: 1.4 }} />
      <path d={leaves.join(" ")} className="bz1-o" style={{ stroke: "color-mix(in srgb, var(--green) 80%, var(--ink))", strokeWidth: 1.6 }} />
    </g>
  );
}

function Ground({ x, y, w = 110 }: { x: number; y: number; w?: number }) {
  return <path d={`M${x - w / 2} ${y} H${x + w / 2}`} className="bz1-o" />;
}

function Capsule({ x, y, rot = 0, open = false }: { x: number; y: number; rot?: number; open?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Body d={ell(0, 0, 6, 10)} fill="bz1-cap" />
      {open ? <path d="M-5 -9 L0 -14 L5 -9" className="bz1-o bz1-thin" /> : <path d="M-5 -8 Q0 -16 5 -8" className="bz1-o bz1-thin bz1-fill3" />}
    </g>
  );
}

/** Water drop with an egg in a flask (archegonium) and a swimming sperm. */
function Fertilisation({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  return (
    <g>
      <ellipse cx={x} cy={y + 8} rx={56} ry={30} className="bz1-water" />
      <ellipse cx={x} cy={y + 8} rx={56} ry={30} fill={pat(id, "h")} opacity={0.6} />
      <path d={`M${x + 8} ${y + 34} C${x + 4} ${y + 12} ${x + 16} ${y + 4} ${x + 18} ${y - 18} H${x + 26} C${x + 28} ${y + 4} ${x + 40} ${y + 12} ${x + 36} ${y + 34} Z`} className="bz1-o bz1-leaf2" />
      <circle cx={x + 22} cy={y + 22} r={8} className="bz1-o bz1-petal" />
      <g transform={`translate(${x - 26} ${y + 6})`}>
        <ellipse cx={0} cy={0} rx={4} ry={3} className="bz1-o bz1-thin bz1-vac" />
        <path d="M-4 -1 q-6 -6 -12 -2 M-4 1 q-6 6 -12 2" className="bz1-o bz1-thin" />
      </g>
      <Arrow d={`M${x - 16} ${y + 6} H${x + 4}`} tone="ink" />
    </g>
  );
}

function Moss() {
  return (
    <Frame w={W} h={H}>
      <Corner k={0} title="výtrusy" sub="z tobolky">
        <MossShoot x={60} y={96} h={20} />
        <path d="M60 76 Q58 50 64 34" className="bz1-o" style={{ stroke: "var(--accent)", strokeWidth: 1.6 }} />
        <Capsule x={68} y={28} rot={40} open />
        <Spores x={76} y={22} />
      </Corner>
      <Corner k={1} title="gametofyt" sub="zelená lodyžka" big>
        <Ground x={240} y={100} />
        <MossShoot x={214} y={100} h={50} />
        <MossShoot x={240} y={100} h={60} />
        <MossShoot x={266} y={100} h={46} />
      </Corner>
      <Corner k={2} title="oplození" sub="spermie plave ve vodě">
        <Fertilisation x={240} y={200} />
      </Corner>
      <Corner k={3} title="sporofyt" sub="štět s tobolkou">
        <Ground x={80} y={250} />
        <MossShoot x={80} y={250} h={40} />
        <path d="M80 210 Q78 190 84 172" className="bz1-o" style={{ stroke: "var(--accent)", strokeWidth: 1.8 }} />
        <Capsule x={88} y={164} rot={30} />
      </Corner>
      <Arrows />
    </Frame>
  );
}

const PINNA = "M0 0 C6 -4 8 -12 2 -18 C-2 -12 -4 -6 0 0 Z";

function Frond({ x, y, len, rot, s = 1 }: { x: number; y: number; len: number; rot: number; s?: number }) {
  const n = Math.floor(len / 11);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 Q4 ${-len * 0.5} 0 ${-len}`} className="bz1-o" style={{ strokeWidth: 1.4 }} />
      {Array.from({ length: n }, (_, i) => {
        const yy = -14 - i * 10;
        const sc = (1 - i / (n + 1)) * s;
        return (
          <g key={i}>
            <path d={PINNA} transform={`translate(1 ${yy}) rotate(70) scale(${f1(sc)})`} className="bz1-o bz1-thin bz1-leaf" />
            <path d={PINNA} transform={`translate(1 ${yy}) rotate(-70) scale(${f1(-sc)} ${f1(sc)})`} className="bz1-o bz1-thin bz1-leaf" />
          </g>
        );
      })}
    </g>
  );
}

function Prothallus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 6 L-3 14 M4 7 L5 15 M-4 4 L-9 11" className="bz1-o bz1-thin" />
      <Body d="M0 6 C-20 0 -24 -22 -10 -26 C-4 -28 -1 -24 0 -20 C1 -24 4 -28 10 -26 C24 -22 20 0 0 6 Z" fill="bz1-leaf" hatch="d" hatchOpacity={0.4} />
    </g>
  );
}

function Fern() {
  return (
    <Frame w={W} h={H}>
      <Corner k={0} title="výtrusy" sub="z výtrusnic">
        <g transform="translate(46 26)">
          <path d="M0 0 C20 -6 40 -4 58 6 C40 20 18 22 0 0 Z" className="bz1-o bz1-leaf" />
          {[12, 24, 36].map((dx) => (
            <circle key={dx} cx={dx} cy={9} r={3.4} className="bz1-o bz1-thin bz1-cap" />
          ))}
        </g>
        <Spores x={56} y={48} />
      </Corner>
      <Corner k={1} title="prokel (gametofyt)" sub="malý, asi 1 cm">
        <Ground x={240} y={96} w={80} />
        <Prothallus x={240} y={88} s={1.2} />
      </Corner>
      <Corner k={2} title="oplození" sub="spermie plave ve vodě">
        <Fertilisation x={240} y={200} />
      </Corner>
      <Corner k={3} title="sporofyt" sub="kapradina" big>
        <Ground x={80} y={252} />
        <path d="M60 255 Q80 259 100 253" className="bz1-o" style={{ strokeWidth: 3 }} />
        <Frond x={80} y={252} len={78} rot={-34} s={0.85} />
        <Frond x={80} y={252} len={88} rot={2} />
        <Frond x={80} y={252} len={72} rot={36} s={0.85} />
      </Corner>
      <Arrows />
    </Frame>
  );
}

export default function MossFernCycle() {
  return (
    <Figure level={3} label={LABEL} max={760} interactive>
      <div className="bz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={280}
          steps={[
            { title: "Mech", art: <Moss />, caption: "Převládá zelený gametofyt, sporofyt (štět s tobolkou) roste na něm." },
            { title: "Kapradina", art: <Fern />, caption: "Převládá velký sporofyt, gametofyt je jen malý prokel." },
          ]}
        />
        <p className="bz1-strip-note">výtrusy → gametofyt → pohlavní buňky → sporofyt → výtrusy</p>
      </div>
    </Figure>
  );
}
