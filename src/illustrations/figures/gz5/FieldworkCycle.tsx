import type { ReactNode } from "react";
import { DrawArrow, Fade, Figure, Num, Pop } from "./kit";

const LABEL =
  "Cyklus terénního výzkumu na příkladu dopravy u školy. 1. otázka: kdy jezdí kolem školy nejvíc aut? 2. hypotéza: ráno projede víc aut než odpoledne. 3. plán a sběr dat: sčítání aut v 7:30 a ve 14:00. 4. zpracování: mapa a graf z naměřených dat. 5. závěr: platí hypotéza, nebo ne, a proč? 6. prezentace: plakát nebo výstava ve škole. Výsledky vedou k nové otázce a cyklus začíná znovu.";

const W = 440;
const H = 372;
const LX = 36;
const RX = W - 36;
const ROWS = [86, 192, 298];
const NR = 22;

type Step = { n: number; x: number; y: number; title: string; ex: [string, string]; icon: ReactNode };

/** small engraved glyphs inside the step circles, centred on 0 0 */
const ICONS: Record<number, ReactNode> = {
  1: (
    <text x={0} y={8} textAnchor="middle" className="gz5-glyph">
      ?
    </text>
  ),
  2: (
    <g>
      <path d="M-6 3 Q-11 -3 -8 -9 Q-4 -15 0 -15 Q4 -15 8 -9 Q11 -3 6 3 Z" className="gz5-bulb gz5-o gz5-thin" />
      <path d="M-5 5 H5 M-4 8.5 H4 M-2 12 H2" className="gz5-o gz5-thin" />
      <path d="M-3 -2 L0 -7 L3 -2" className="gz5-o gz5-thin" />
    </g>
  ),
  3: (
    <g>
      <rect x={-9} y={-12} width={18} height={24} rx={2} className="gz5-wall gz5-o gz5-thin" />
      <rect x={-4} y={-14} width={8} height={4} rx={1} className="gz5-ind gz5-o gz5-thin" />
      <path d="M-5 -4 H5 M-5 1 H5 M-5 6 H2" className="gz5-o gz5-thin" />
      <path d="M-5 -4 l1 0 M-5 1 l1 0" className="gz5-o" />
    </g>
  ),
  4: (
    <g>
      <path d="M-11 11 H11 M-11 11 V-12" className="gz5-o gz5-thin" />
      <rect x={-8} y={0} width={5} height={11} className="gz5-lvl-f gz5-o gz5-thin" />
      <rect x={-1} y={-9} width={5} height={20} className="gz5-lvl-f gz5-o gz5-thin" />
      <rect x={6} y={-4} width={5} height={15} className="gz5-lvl-f gz5-o gz5-thin" />
    </g>
  ),
  5: <path d="M-9 0 L-3 7 L10 -9" className="gz5-check" />,
  6: (
    <g>
      <rect x={-11} y={-12} width={22} height={15} rx={1.5} className="gz5-wall gz5-o gz5-thin" />
      <path d="M-7 0 L-3 -5 L1 -2 L7 -9" className="gz5-o gz5-thin gz5-lvl-s" />
      <path d="M-6 3 L-9 13 M6 3 L9 13 M0 3 V9" className="gz5-o gz5-thin" />
    </g>
  ),
};

const STEPS: Step[] = [
  { n: 1, x: LX, y: ROWS[0], title: "otázka", ex: ["Kdy jezdí kolem", "školy nejvíc aut?"], icon: ICONS[1] },
  { n: 2, x: LX, y: ROWS[1], title: "hypotéza", ex: ["Ráno projede víc", "aut než odpoledne."], icon: ICONS[2] },
  { n: 3, x: LX, y: ROWS[2], title: "plán a sběr dat", ex: ["sčítání aut", "v 7:30 a ve 14:00"], icon: ICONS[3] },
  { n: 4, x: RX, y: ROWS[2], title: "zpracování", ex: ["mapa a graf", "z naměřených dat"], icon: ICONS[4] },
  { n: 5, x: RX, y: ROWS[1], title: "závěr", ex: ["Platí hypotéza?", "Proč ano, proč ne?"], icon: ICONS[5] },
  { n: 6, x: RX, y: ROWS[0], title: "prezentace", ex: ["plakát, mapa,", "výstava ve škole"], icon: ICONS[6] },
];

function Node({ s }: { s: Step }) {
  const left = s.x < W / 2;
  const tx = left ? s.x + NR + 10 : s.x - NR - 10;
  const anchor = left ? "start" : "end";
  return (
    <g>
      <circle cx={s.x} cy={s.y} r={NR} className="gz5-box-lvl" />
      <g transform={`translate(${s.x} ${s.y})`}>{s.icon}</g>
      <Num x={s.x + (left ? -NR + 3 : NR - 3)} y={s.y - NR + 3} n={s.n} r={8.5} />
      <text x={tx} y={s.y - 8} textAnchor={anchor} className="gz5-lbl gz5-b">
        {s.title}
      </text>
      <text x={tx} y={s.y + 11} textAnchor={anchor} className="gz5-lbl gz5-sm">
        {s.ex[0]}
      </text>
      <text x={tx} y={s.y + 28} textAnchor={anchor} className="gz5-lbl gz5-sm">
        {s.ex[1]}
      </text>
    </g>
  );
}

function Plate() {
  const gap = NR + 6;
  const down = (y0: number, y1: number) => `M${LX} ${y0 + gap} V${y1 - gap}`;
  const up = (y0: number, y1: number) => `M${RX} ${y0 - gap} V${y1 + gap}`;
  const bottom = ROWS[2] + gap;
  const top = ROWS[0] - gap;
  return (
    <>
      {STEPS.map((s, i) => (
        <Pop key={s.n} delay={0.1 + i * 0.22}>
          <Node s={s} />
        </Pop>
      ))}
      <DrawArrow d={down(ROWS[0], ROWS[1])} tone="lvl" delay={0.25} />
      <DrawArrow d={down(ROWS[1], ROWS[2])} tone="lvl" delay={0.45} />
      <DrawArrow
        d={`M${LX} ${bottom} V${bottom + 14} Q${LX} ${H - 22} ${LX + 22} ${H - 22} H${RX - 22} Q${RX} ${H - 22} ${RX} ${bottom + 14} V${bottom + 2}`}
        tone="lvl"
        delay={0.6}
      />
      <DrawArrow d={up(ROWS[2], ROWS[1])} tone="lvl" delay={0.85} />
      <DrawArrow d={up(ROWS[1], ROWS[0])} tone="lvl" delay={1.05} />
      <DrawArrow
        d={`M${RX} ${top} V${top - 8} Q${RX} 22 ${RX - 22} 22 H${LX + 22} Q${LX} 22 ${LX} ${top - 8} V${top - 2}`}
        tone="acc"
        delay={1.25}
      />
      <Fade delay={1.6}>
        <text x={W / 2} y={28} textAnchor="middle" className="gz5-lbl gz5-b gz5-acc-t gz5-halo">
          nová otázka
        </text>
        <text x={W / 2} y={H - 16} textAnchor="middle" className="gz5-lbl gz5-sm gz5-muted-t gz5-halo">
          terénní výzkum
        </text>
      </Fade>
    </>
  );
}

export default function FieldworkCycle() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={560} replay>
      <Plate />
    </Figure>
  );
}
