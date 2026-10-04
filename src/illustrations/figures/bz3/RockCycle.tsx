import type { ReactNode } from "react";
import { DrawArrow, Figure, Fade, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Koloběh hornin. Magma vystoupí k povrchu nebo ztuhne v hloubce a chladnutím z něj vzniknou vyvřelé horniny, například žula a čedič. Zvětrávání a eroze je rozruší na úlomky – písek, štěrk a jíl –, které se usazují a zpevňují v usazené horniny, jako je pískovec a vápenec. Vysoký tlak a teplota v hloubce mění horniny v přeměněné, například rulu a mramor; tlak a teplota mohou přeměnit i vyvřelou horninu přímo. Když se hornina roztaví, vznikne opět magma a koloběh se uzavírá.";

const W = 440;
const H = 408;
const CX = 220;
const CY = 214;
const RAD = 140;
const NR = 34; // node radius

const at = (deg: number): [number, number] => [
  CX + Math.cos((deg * Math.PI) / 180) * RAD,
  CY + Math.sin((deg * Math.PI) / 180) * RAD,
];

function Specimen({ x, y, children, cls }: { x: number; y: number; children: ReactNode; cls: string }) {
  const { id } = useFig();
  return (
    <g>
      <clipPath id={`${id}-${cls}`}>
        <circle cx={x} cy={y} r={NR} />
      </clipPath>
      <circle cx={x} cy={y} r={NR} className={cls} />
      <g clipPath={`url(#${id}-${cls})`}>{children}</g>
      <circle cx={x} cy={y} r={NR} className="bz3-o" />
    </g>
  );
}

function Granite({ x, y }: { x: number; y: number }) {
  const r = rng(3);
  const grains = Array.from({ length: 34 }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * NR;
    return [x + Math.cos(a) * d, y + Math.sin(a) * d, r()] as const;
  });
  return (
    <Specimen x={x} y={y} cls="bz3-granite">
      {grains.map(([gx, gy, k], i) => (
        <path
          key={i}
          d={`M${f1(gx)} ${f1(gy)} l${f1(3 + k * 3)} ${f1(-1 - k * 2)} l${f1(1 + k)} ${f1(3 + k * 2)} l${f1(-3 - k * 2)} ${f1(1 + k)}Z`}
          className={k < 0.35 ? "bz3-grain-dark" : k < 0.7 ? "bz3-grain-pink" : "bz3-grain-light"}
        />
      ))}
    </Specimen>
  );
}

function Grains({ x, y }: { x: number; y: number }) {
  const r = rng(11);
  const g = Array.from({ length: 46 }, () => [x - NR + r() * NR * 2, y - NR * 0.2 + r() * NR * 1.3, 2 + r() * 3.5] as const);
  return (
    <Specimen x={x} y={y} cls="bz3-sky">
      <path d={`M${x - NR} ${y - 2} Q${x} ${y - 14} ${x + NR} ${y - 2} V${y + NR} H${x - NR}Z`} className="bz3-sand" />
      {g.map(([gx, gy, gr], i) => (
        <circle key={i} cx={gx} cy={gy} r={gr} className={i % 3 ? "bz3-pebble" : "bz3-pebble bz3-pebble-2"} />
      ))}
    </Specimen>
  );
}

function Layered({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  const cols = ["#d9c9a3", "#c7ae84", "#e2d4b0", "#b99b6e", "#d1bc92", "#ab8c62"];
  return (
    <Specimen x={x} y={y} cls="bz3-sand">
      {cols.map((c, i) => (
        <rect key={i} x={x - NR} y={y - NR + i * 12} width={NR * 2} height={12} fill={c} className="bz3-o bz3-thin" />
      ))}
      <rect x={x - NR} y={y - NR} width={NR * 2} height={NR * 2} fill={pat(id, "dots")} />
    </Specimen>
  );
}

function Gneiss({ x, y }: { x: number; y: number }) {
  const bands: string[] = [];
  for (let i = -5; i <= 5; i++) {
    let d = `M${x - NR} ${y + i * 7}`;
    for (let k = 0; k <= 8; k++) {
      const px = x - NR + k * ((NR * 2) / 8);
      d += ` L${f1(px)} ${f1(y + i * 7 + Math.sin(k * 1.1 + i * 0.6) * 4)}`;
    }
    bands.push(d);
  }
  return (
    <Specimen x={x} y={y} cls="bz3-gneiss">
      {bands.map((d, i) => (
        <path key={i} d={d} className={i % 2 ? "bz3-foli bz3-foli-dark" : "bz3-foli"} />
      ))}
    </Specimen>
  );
}

function Magma({ x, y }: { x: number; y: number }) {
  return (
    <Specimen x={x} y={y} cls="bz3-magma-f">
      <path d={`M${x - 26} ${y + 10} C${x - 16} ${y - 4} ${x - 6} ${y + 18} ${x + 6} ${y + 2} C${x + 14} ${y - 8} ${x + 22} ${y + 8} ${x + 30} ${y - 2}`} className="bz3-magma-glow" />
      <path d={`M${x - 30} ${y - 12} C${x - 18} ${y - 22} ${x - 2} ${y - 6} ${x + 10} ${y - 18} C${x + 18} ${y - 24} ${x + 26} ${y - 16} ${x + 32} ${y - 20}`} className="bz3-magma-glow" />
    </Specimen>
  );
}

const N = {
  igneous: at(-162),
  sediment: at(-90),
  sedrock: at(-18),
  meta: at(54),
  magma: at(126),
};

const NODES: { p: [number, number]; art: ReactNode; name: string; ex: string; dy?: number }[] = [
  { p: N.igneous, art: <Granite x={N.igneous[0]} y={N.igneous[1]} />, name: "vyvřelé horniny", ex: "žula, čedič" },
  { p: N.sediment, art: <Grains x={N.sediment[0]} y={N.sediment[1]} />, name: "úlomky (sedimenty)", ex: "písek, štěrk, jíl" },
  { p: N.sedrock, art: <Layered x={N.sedrock[0]} y={N.sedrock[1]} />, name: "usazené horniny", ex: "pískovec, vápenec" },
  { p: N.meta, art: <Gneiss x={N.meta[0]} y={N.meta[1]} />, name: "přeměněné horniny", ex: "rula, mramor" },
  { p: N.magma, art: <Magma x={N.magma[0]} y={N.magma[1]} />, name: "magma", ex: "roztavená hornina" },
];

/** Arrow from node a to node b along a slight outward bow, with a two-line label. */
function Edge({
  a,
  b,
  text,
  delay,
  dashed = false,
  out = 26,
  bow = 18,
}: {
  a: [number, number];
  b: [number, number];
  text: string[];
  delay: number;
  dashed?: boolean;
  out?: number;
  bow?: number;
}) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s: [number, number] = [a[0] + ux * (NR + 6), a[1] + uy * (NR + 6)];
  const e: [number, number] = [b[0] - ux * (NR + 8), b[1] - uy * (NR + 8)];
  const m: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  // outward normal (away from the centre)
  let nx = -uy;
  let ny = ux;
  if ((m[0] - CX) * nx + (m[1] - CY) * ny < 0) {
    nx = -nx;
    ny = -ny;
  }
  if (dashed) {
    nx = 0;
    ny = 0;
  }
  const c: [number, number] = [m[0] + nx * bow, m[1] + ny * bow];
  const lx = m[0] + nx * (bow + out);
  const ly = m[1] + ny * (bow + out);
  const anchor = Math.abs(nx) < 0.35 ? "middle" : nx > 0 ? "start" : "end";
  return (
    <g>
      <DrawArrow
        d={`M${f1(s[0])} ${f1(s[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(e[0])} ${f1(e[1])}`}
        tone={dashed ? "muted" : "lvl"}
        delay={delay}
        className={dashed ? "bz3-dash bz3-arr-w" : "bz3-arr-w"}
      />
      <Fade delay={delay + 0.4}>
        {text.map((t, i) => (
          <text
            key={i}
            x={f1(lx)}
            y={f1(ly + (i - (text.length - 1) / 2) * 17 + 5)}
            textAnchor={anchor}
            className={`bz3-lbl bz3-sm bz3-halo ${dashed ? "bz3-muted-t" : "bz3-lvl-t bz3-b"}`}
          >
            {t}
          </text>
        ))}
      </Fade>
    </g>
  );
}

export default function RockCycle() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={580} replay>
      <Edge a={N.igneous} b={N.sediment} text={["zvětrávání", "a eroze"]} delay={0.5} />
      <Edge a={N.sediment} b={N.sedrock} text={["usazení", "a zpevnění"]} delay={0.75} />
      <Edge a={N.sedrock} b={N.meta} text={["tlak", "a teplota"]} delay={1} />
      <Edge a={N.meta} b={N.magma} text={["tavení"]} delay={1.25} out={16} />
      <Edge a={N.magma} b={N.igneous} text={["chladnutí", "a tuhnutí"]} delay={1.5} />
      <Edge a={N.igneous} b={N.meta} text={["tlak a teplota"]} delay={1.75} dashed out={0} />
      {NODES.map((n, i) => (
        <Pop key={n.name} delay={0.1 + i * 0.08}>
          {n.art}
          <text x={n.p[0]} y={n.p[1] + NR + 19} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm bz3-halo">
            {n.name}
          </text>
          <text x={n.p[0]} y={n.p[1] + NR + 36} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t bz3-halo">
            {n.ex}
          </text>
        </Pop>
      ))}
    </Figure>
  );
}
