import { StepStrip } from "../../sequence/StepFigure";
import { Body, Chloro, Figure, Frame, f1, pat, useFig } from "./kit";

const LABEL =
  "Úrovně organizace živého těla ve dvou řadách, nahoře člověk, dole rostlina. 1 buňka: svalová buňka srdce a buňka listu s chloroplasty. 2 tkáň a pletivo: mnoho podobných buněk se stejnou prací, svalová tkáň srdce a asimilační pletivo listu. 3 orgán: srdce a list. 4 orgánová soustava: oběhová soustava ze srdce a cév, u rostliny prýt ze stonku a listů. 5 organismus: celý člověk a celá rostlina s kořenem a květem.";

const W = 170;
const H = 262;
const CX = W / 2;

/** Standing human, local origin at the waist; about 44 × 100. */
const HUMAN =
  "M-3 -31 L3 -31 L3 -28 C10 -28 16 -26 17 -21 L21 4 Q22 8 18 8 L15 7 L12 -14 L11 6 L11 46 Q11 49 8 49 L3 49 L1 12 L-1 12 L-3 49 L-8 49 Q-11 49 -11 46 L-11 6 L-12 -14 L-15 7 L-18 8 Q-22 8 -21 4 L-17 -21 C-16 -26 -10 -28 -3 -28 Z";

function Human({ x, y, fill = "bz1-skin", ghost = false }: { x: number; y: number; fill?: string; ghost?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className={ghost ? "bz1-faint" : undefined}>
      <Body d={HUMAN} fill={fill} />
      <circle cx={0} cy={-39} r={8} className={`bz1-o ${fill}`} />
    </g>
  );
}

/** Striated muscle fibre (multinucleate cell) as a horizontal cylinder. */
function Fibre({ x, y, w, h = 12, nuclei = 3 }: { x: number; y: number; w: number; h?: number; nuclei?: number }) {
  const lines = [];
  for (let s = x + 6; s < x + w - 4; s += 4) lines.push(`M${s} ${y + 1.5} V${y + h - 1.5}`);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} className="bz1-o bz1-flesh" />
      <path d={lines.join(" ")} className="bz1-o bz1-thin" style={{ opacity: 0.45 }} />
      {Array.from({ length: nuclei }, (_, i) => (
        <ellipse key={i} cx={x + ((i + 0.6) * w) / (nuclei + 0.4)} cy={y + h * 0.3} rx={4} ry={2.2} className="bz1-o bz1-thin bz1-nuc" />
      ))}
    </g>
  );
}

/** Palisade leaf cell (tall, full of chloroplasts). */
function LeafCell({ x, y, w = 22, h = 64 }: { x: number; y: number; w?: number; h?: number }) {
  const n = Math.floor((h - 10) / 12);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className="bz1-o bz1-wall" style={{ strokeWidth: 2.2 }} />
      <rect x={x + 2.5} y={y + 2.5} width={w - 5} height={h - 5} rx={4} className="bz1-cyto" />
      {Array.from({ length: n }, (_, i) => (
        <Chloro key={i} x={x + (i % 2 ? w * 0.68 : w * 0.32)} y={y + 9 + i * 12} rx={5.5} ry={3.6} rot={i % 2 ? 20 : -20} />
      ))}
    </g>
  );
}

const LEAF = "M0 0 C-14 -10 -18 -32 0 -52 C18 -32 14 -10 0 0 Z";
function Leaf({ x, y, s = 1, rot = 0, veins = true }: { x: number; y: number; s?: number; rot?: number; veins?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <Body d={LEAF} fill="bz1-leaf" hatch={veins ? undefined : "d"} hatchOpacity={0.5} />
      {veins && (
        <path
          d="M0 -2 V-48 M0 -12 L-9 -20 M0 -12 L9 -20 M0 -24 L-10 -32 M0 -24 L10 -32 M0 -36 L-6 -42 M0 -36 L6 -42"
          className="bz1-o bz1-thin"
        />
      )}
    </g>
  );
}

/** A small herb: roots under the soil line `gy`, stem, leaves, a flower. */
function Plant({ x, gy, roots = true, flower = true }: { x: number; gy: number; roots?: boolean; flower?: boolean }) {
  return (
    <g>
      <path d={`M${x - 46} ${gy} H${x + 46}`} className="bz1-o bz1-thin" />
      {roots && (
        <path
          d={`M${x} ${gy} V${gy + 26} M${x} ${gy + 6} Q${x - 10} ${gy + 12} ${x - 16} ${gy + 22} M${x} ${gy + 10} Q${x + 10} ${gy + 14} ${x + 15} ${gy + 24} M${x} ${gy + 18} L${x - 7} ${gy + 26} M${x} ${gy + 20} L${x + 6} ${gy + 28}`}
          className="bz1-o"
          style={{ strokeWidth: 1.3 }}
        />
      )}
      <path d={`M${x} ${gy} V${gy - 48}`} className="bz1-o" style={{ strokeWidth: 2.4 }} />
      <Leaf x={x} y={gy - 12} s={0.5} rot={-58} />
      <Leaf x={x} y={gy - 25} s={0.45} rot={60} />
      <Leaf x={x} y={gy - 37} s={0.36} rot={-50} />
      {flower && (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={f1(x + Math.cos((a * Math.PI) / 180) * 6)}
              cy={f1(gy - 53 + Math.sin((a * Math.PI) / 180) * 6)}
              rx={5}
              ry={3.4}
              transform={`rotate(${a} ${f1(x + Math.cos((a * Math.PI) / 180) * 6)} ${f1(gy - 53 + Math.sin((a * Math.PI) / 180) * 6)})`}
              className="bz1-o bz1-thin bz1-petal"
            />
          ))}
          <circle cx={x} cy={gy - 53} r={3} className="bz1-o bz1-thin bz1-pollen" />
        </g>
      )}
    </g>
  );
}

function Row({ top, bottom, children }: { top: string; bottom: string; children: React.ReactNode }) {
  return (
    <Frame w={W} h={H}>
      {children}
      <text x={CX} y={128} textAnchor="middle" className="bz1-lbl bz1-sm bz1-b">
        {top}
      </text>
      <path d={`M14 140 H${W - 14}`} className="bz1-o bz1-thin bz1-dash" style={{ opacity: 0.5 }} />
      <text x={CX} y={H - 8} textAnchor="middle" className="bz1-lbl bz1-sm bz1-b">
        {bottom}
      </text>
    </Frame>
  );
}

function Cell() {
  return (
    <Row top="svalová buňka" bottom="buňka listu">
      <Fibre x={30} y={52} w={110} h={20} nuclei={1} />
      <LeafCell x={CX - 16} y={160} w={32} h={74} />
    </Row>
  );
}

function Tissue() {
  return (
    <Row top="svalová tkáň" bottom="asimilační pletivo">
      {[0, 1, 2, 3, 4].map((i) => (
        <Fibre key={i} x={20 + (i % 2) * 6} y={30 + i * 15} w={124} h={13} nuclei={2} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <LeafCell key={i} x={28 + i * 23} y={160} w={22} h={72} />
      ))}
    </Row>
  );
}

const HEART =
  "M-22 -14 C-34 -4 -30 22 -8 38 C2 46 10 44 14 38 C30 18 34 -6 22 -18 C14 -26 0 -24 -6 -18 C-12 -22 -18 -20 -22 -14 Z";

function Heart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 -20 C-2 -38 20 -42 24 -28" className="bz1-o" style={{ strokeWidth: 9, stroke: "var(--edge)" }} />
      <path d="M-2 -20 C-2 -38 20 -42 24 -28" style={{ strokeWidth: 6.5, stroke: "color-mix(in srgb, var(--bad) 45%, var(--surface))", fill: "none" }} />
      <path d="M-12 -16 C-16 -30 -26 -32 -32 -26" className="bz1-o" style={{ strokeWidth: 8, stroke: "var(--edge)" }} />
      <path d="M-12 -16 C-16 -30 -26 -32 -32 -26" style={{ strokeWidth: 5.5, stroke: "color-mix(in srgb, var(--blue) 40%, var(--surface))", fill: "none" }} />
      <path d={HEART} className="bz1-blood" />
      <path d={HEART} fill={pat(id, "d")} opacity={0.6} />
      <path d={HEART} className="bz1-o" />
      <path d="M4 -16 C8 0 4 20 -2 36 M4 4 C12 8 18 12 22 18" className="bz1-o bz1-thin" />
    </g>
  );
}

function Organ() {
  return (
    <Row top="srdce" bottom="list">
      <Heart x={CX + 2} y={62} s={1.05} />
      <path d={`M${CX} 236 V220`} className="bz1-o" style={{ strokeWidth: 2 }} />
      <Leaf x={CX} y={220} s={1.3} />
    </Row>
  );
}

function OrganSystem() {
  const art = "M-3 -20 V-34 M-3 -26 L-14 -20 L-19 6 M-3 -26 L8 -20 L16 6 M-4 -10 V8 L-7 46 M-4 8 L5 46";
  const vein = "M1 -20 V-34 M1 -24 L12 -18 L20 6 M1 -24 L-12 -18 L-21 4 M0 -10 V8 L7 46 M0 8 L-9 46";
  return (
    <Row top="oběhová soustava" bottom="prýt: stonek a listy">
      <g transform={`translate(${CX} 60)`}>
        <Body d={HUMAN} fill="bz1-fill" />
        <circle cx={0} cy={-39} r={8} className="bz1-o bz1-fill" />
        <path d={vein} className="bz1-o" style={{ stroke: "var(--blue)", strokeWidth: 1.3 }} />
        <path d={art} className="bz1-o" style={{ stroke: "var(--bad)", strokeWidth: 1.3 }} />
        <path d="M-1 -36 V-44" className="bz1-o" style={{ stroke: "var(--bad)", strokeWidth: 1.3 }} />
        <Heart x={-2} y={-16} s={0.22} />
      </g>
      <Plant x={CX} gy={232} roots={false} flower={false} />
    </Row>
  );
}

function Organism() {
  return (
    <Row top="člověk" bottom="rostlina">
      <Human x={CX} y={54} />
      <Plant x={CX} gy={212} />
    </Row>
  );
}

export default function LevelsOfOrganisation() {
  return (
    <Figure level={1} label={LABEL} max={900} interactive>
      <div className="bz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={150}
          phoneColumns={2}
          steps={[
            { title: "Buňka", art: <Cell />, caption: "Základní jednotka života." },
            { title: "Tkáň, pletivo", art: <Tissue />, caption: "Mnoho stejných buněk se stejnou prací." },
            { title: "Orgán", art: <Organ />, caption: "Několik tkání tvoří část těla s úkolem." },
            { title: "Orgánová soustava", art: <OrganSystem />, caption: "Orgány, které spolupracují." },
            { title: "Organismus", art: <Organism />, caption: "Celý živý jedinec." },
          ]}
        />
      </div>
    </Figure>
  );
}
