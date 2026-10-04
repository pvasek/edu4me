import type { ReactNode } from "react";
import { Draw, Figure, Pop, Rise, pat, useFig } from "./kit";

const LABEL =
  "Kategorie chráněných území v Česku. Velkoplošná: národní park (NP) – velké území s přírodou málo změněnou člověkem, kde má příroda přednost; v Česku jsou 4. Chráněná krajinná oblast (CHKO) – velká krajina, ve které lidé žijí a hospodaří, ale šetrně; v roce 2025 jich bylo 27. Maloplošná: národní přírodní rezervace (NPR) – menší území mimořádné přírody, například prales; přírodní památka (PP) – jednotlivý útvar, třeba skála, jeskyně nebo pramen. Časová osa ukazuje vznik čtyř národních parků: Krkonošský národní park 1963, Národní park Šumava a Národní park Podyjí 1991, Národní park České Švýcarsko 2000.";

const W = 420;
const H = 530;
const ROW = 66;
const IX = 40; // icon box left
const TX = 116; // text left

// ------------------------------------------------------------ small vignettes
function Conifer({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -16 L6 -6 H3 L8 2 H-8 L-3 -6 H-6 Z" className="gz5-forest gz5-o gz5-thin" />
      <path d="M0 2 V5" className="gz5-o gz5-thin" />
    </g>
  );
}
function Leafy({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 V-6" className="gz5-o gz5-thin" />
      <circle cx={0} cy={-11} r={7} className="gz5-forest gz5-o gz5-thin" />
    </g>
  );
}

function IconBox({ y, children }: { y: number; children: ReactNode }) {
  const { id } = useFig();
  return (
    <g>
      <clipPath id={`${id}-ib${y}`}>
        <rect x={IX} y={y} width={64} height={50} rx={6} />
      </clipPath>
      <rect x={IX} y={y} width={64} height={50} rx={6} className="gz5-fill" />
      <g clipPath={`url(#${id}-ib${y})`}>{children}</g>
      <rect x={IX} y={y} width={64} height={50} rx={6} className="gz5-o gz5-thin" />
    </g>
  );
}

/** NP: high mountains with snow, forest below */
function IconNP({ y }: { y: number }) {
  const { id } = useFig();
  const x = IX;
  return (
    <IconBox y={y}>
      <path d={`M${x} ${y + 40} L${x + 20} ${y + 12} L${x + 30} ${y + 24} L${x + 42} ${y + 8} L${x + 64} ${y + 40} Z`} className="gz5-mount" />
      <path d={`M${x} ${y + 40} L${x + 20} ${y + 12} L${x + 30} ${y + 24} L${x + 42} ${y + 8} L${x + 64} ${y + 40} Z`} fill={pat(id, "d")} />
      <path d={`M${x + 36} ${y + 16} L${x + 42} ${y + 8} L${x + 48} ${y + 16} L${x + 44} ${y + 14} L${x + 41} ${y + 17} Z`} className="gz5-snow" />
      <path d={`M${x} ${y + 40} L${x + 20} ${y + 12} L${x + 30} ${y + 24} L${x + 42} ${y + 8} L${x + 64} ${y + 40}`} className="gz5-o gz5-thin" />
      {[8, 17, 26, 46, 55].map((dx, i) => (
        <Conifer key={dx} x={x + dx} y={y + 47 - (i % 2) * 2} s={0.75} />
      ))}
    </IconBox>
  );
}
/** CHKO: cultural landscape – fields, a village with a church, woods */
function IconCHKO({ y }: { y: number }) {
  const x = IX;
  return (
    <IconBox y={y}>
      <path d={`M${x} ${y + 30} Q${x + 18} ${y + 18} ${x + 34} ${y + 26} T${x + 64} ${y + 22} V${y + 50} H${x} Z`} className="gz5-meadow" />
      <path d={`M${x} ${y + 38} Q${x + 30} ${y + 30} ${x + 64} ${y + 36} V${y + 50} H${x} Z`} className="gz5-field" />
      <path d={`M${x + 4} ${y + 42} Q${x + 30} ${y + 36} ${x + 60} ${y + 41} M${x + 4} ${y + 46} Q${x + 30} ${y + 41} ${x + 60} ${y + 46}`} className="gz5-o gz5-thin" style={{ opacity: 0.5 }} />
      <path d={`M${x} ${y + 30} Q${x + 18} ${y + 18} ${x + 34} ${y + 26} T${x + 64} ${y + 22}`} className="gz5-o gz5-thin" />
      {/* church and houses */}
      <path d={`M${x + 26} ${y + 33} V${y + 22} H${x + 31} V${y + 33} Z M${x + 26} ${y + 22} L${x + 28.5} ${y + 13} L${x + 31} ${y + 22}`} className="gz5-wall gz5-o gz5-thin" />
      <path d={`M${x + 33} ${y + 33} V${y + 27} H${x + 41} V${y + 33} Z`} className="gz5-wall gz5-o gz5-thin" />
      <path d={`M${x + 32} ${y + 27} L${x + 37} ${y + 22} L${x + 42} ${y + 27} Z`} className="gz5-roof gz5-o gz5-thin" />
      <path d={`M${x + 17} ${y + 34} V${y + 29} H${x + 24} V${y + 34} Z`} className="gz5-wall gz5-o gz5-thin" />
      <path d={`M${x + 16} ${y + 29} L${x + 20.5} ${y + 25} L${x + 25} ${y + 29} Z`} className="gz5-roof gz5-o gz5-thin" />
      <Leafy x={x + 52} y={y + 27} s={0.8} />
      <Leafy x={x + 9} y={y + 29} s={0.7} />
    </IconBox>
  );
}
/** NPR: virgin forest with a fallen trunk */
function IconNPR({ y }: { y: number }) {
  const x = IX;
  return (
    <IconBox y={y}>
      <rect x={x} y={y + 40} width={64} height={10} className="gz5-meadow" />
      {[7, 19, 31, 43, 56].map((dx, i) => (
        <Conifer key={dx} x={x + dx} y={y + 40 - (i % 2) * 3} s={1.35 - (i % 2) * 0.2} />
      ))}
      <path d={`M${x + 14} ${y + 45} L${x + 44} ${y + 41}`} className="gz5-o" style={{ strokeWidth: 3.2, stroke: "var(--ink-soft)" }} />
      <circle cx={x + 45} cy={y + 41} r={2} className="gz5-wall gz5-o gz5-thin" />
    </IconBox>
  );
}
/** PP: a sandstone rock tower and a spring */
function IconPP({ y }: { y: number }) {
  const { id } = useFig();
  const x = IX;
  const rock = `M${x + 19} ${y + 50} L${x + 23} ${y + 39} L${x + 21} ${y + 31} L${x + 25} ${y + 21} L${x + 24} ${y + 15} L${x + 29} ${y + 9} L${x + 34} ${y + 11} L${x + 36} ${y + 17} L${x + 35} ${y + 25} L${x + 39} ${y + 32} L${x + 37} ${y + 40} L${x + 42} ${y + 50} Z`;
  return (
    <IconBox y={y}>
      <rect x={x} y={y + 42} width={64} height={8} className="gz5-meadow" />
      <path d={rock} className="gz5-hill" />
      <path d={rock} fill={pat(id, "h")} />
      <path d={rock} className="gz5-o gz5-thin" />
      <path d={`M${x + 46} ${y + 44} q4 -3 8 0 t8 0`} className="gz5-river" style={{ strokeWidth: 1.6 }} />
      <circle cx={x + 48} cy={y + 40} r={1.8} className="gz5-water-dot" />
      <Conifer x={x + 10} y={y + 44} s={0.8} />
    </IconBox>
  );
}

type Cat = { y: number; icon: (p: { y: number }) => ReactNode; name: string; abbr: string; count?: string; desc: string };
const G1 = 26;
const G2 = G1 + 2 * ROW + 16;
const CATS: Cat[] = [
  { y: G1, icon: IconNP, name: "národní park", abbr: "NP", count: "4", desc: "velké území s málo změněnou přírodou" },
  { y: G1 + ROW, icon: IconCHKO, name: "chráněná krajinná oblast", abbr: "CHKO", count: "27 (2025)", desc: "krajina, kde lidé žijí a hospodaří" },
  { y: G2, icon: IconNPR, name: "národní přírodní rezervace", abbr: "NPR", desc: "menší území vzácné přírody (prales)" },
  { y: G2 + ROW, icon: IconPP, name: "přírodní památka", abbr: "PP", desc: "jeden útvar: skála, jeskyně, pramen" },
];

function Bracket({ y0, y1, text }: { y0: number; y1: number; text: string }) {
  const m = (y0 + y1) / 2;
  return (
    <g>
      <path d={`M${IX - 10} ${y0 + 2} H${IX - 16} V${y1 - 2} H${IX - 10}`} className="gz5-o gz5-thin" />
      <text x={IX - 22} y={m} textAnchor="middle" transform={`rotate(-90 ${IX - 22} ${m})`} className="gz5-lbl gz5-sm gz5-lvl-t">
        {text}
      </text>
    </g>
  );
}

// ------------------------------------------------------------ national parks timeline
const AY = 420; // axis
const TX0 = 30;
const TX1 = 334;
const yr = (y: number) => TX0 + ((TX1 - TX0) * (y - 1960)) / 40;

type Park = { year: number; name: string; side: -1 | 1; x: number; anchor: "start" | "middle" | "end"; lane: number };
const PARKS: Park[] = [
  { year: 1963, name: "Krkonošský NP", side: -1, x: yr(1963) - 6, anchor: "start", lane: 0 },
  { year: 1991, name: "NP Šumava", side: -1, x: yr(1991) + 6, anchor: "end", lane: 0 },
  { year: 1991, name: "NP Podyjí", side: 1, x: yr(1991) + 6, anchor: "end", lane: 0 },
  { year: 2000, name: "NP České Švýcarsko", side: 1, x: W - 8, anchor: "end", lane: 1 },
];

function Timeline() {
  return (
    <g>
      <Rise delay={0.7}>
        <text x={W / 2} y={AY - 82} textAnchor="middle" className="gz5-title">
          Národní parky Česka
        </text>
      </Rise>
      <Draw d={`M${TX0 - 6} ${AY} H${W - 14}`} className="gz5-o" delay={0.75} arrow="ink" />
      {[1960, 1970, 1980, 1990, 2000].map((y) => (
        <g key={y}>
          <path d={`M${yr(y)} ${AY - 4} V${AY + 4}`} className="gz5-o gz5-thin" />
          {y !== 1990 && y !== 2000 && (
            <text x={yr(y)} y={AY + 18} textAnchor="middle" className="gz5-num gz5-muted-t">
              {y}
            </text>
          )}
        </g>
      ))}
      {PARKS.map((p, i) => {
        const x = yr(p.year);
        const ty = p.side < 0 ? AY - 34 : AY + 34 + p.lane * 40;
        return (
          <Pop key={p.name} delay={1 + i * 0.18}>
            <path d={`M${x} ${AY} V${p.side < 0 ? ty + 8 : ty - 15}`} className="gz5-lead" />
            <circle cx={x} cy={AY} r={5.5} className="gz5-peak-dot" />
            <text x={p.x} y={ty} textAnchor={p.anchor} className="gz5-lbl gz5-b">
              {p.name}
            </text>
            <text x={p.x} y={ty + (p.side < 0 ? -18 : 18)} textAnchor={p.anchor} className="gz5-eq gz5-lvl-t">
              {p.year}
            </text>
          </Pop>
        );
      })}
    </g>
  );
}

function Plate() {
  return (
    <>
      <Bracket y0={G1} y1={G1 + ROW + 50} text="velkoplošná" />
      <Bracket y0={G2} y1={G2 + ROW + 50} text="maloplošná" />
      {CATS.map((c, i) => {
        const Icon = c.icon;
        return (
          <Rise key={c.abbr} delay={0.1 + i * 0.14}>
            <Icon y={c.y} />
            <text x={TX} y={c.y + 18} className="gz5-lbl gz5-b">
              {c.name}
              <tspan className="gz5-lvl-t"> ({c.abbr})</tspan>
            </text>
            <text x={TX} y={c.y + 38} className="gz5-lbl gz5-sm">
              {c.desc}
            </text>
            {c.count && (
              <text x={W - 8} y={c.y + 56} textAnchor="end" className="gz5-eq gz5-eq-sm gz5-muted-t">
                v Česku: {c.count}
              </text>
            )}
          </Rise>
        );
      })}
      <Timeline />
    </>
  );
}

export default function CzechProtected() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={560} replay>
      <Plate />
    </Figure>
  );
}
