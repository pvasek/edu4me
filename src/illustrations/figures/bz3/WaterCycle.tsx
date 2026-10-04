import { DrawArrow, Fade, Figure, Liquid, Pop, f1, pat, useFig, useLive } from "./kit";

const LABEL =
  "Koloběh vody v krajině. Slunce ohřívá moře a voda se vypařuje, rostliny vydávají vodní páru listy (transpirace). Pára stoupá, ve výšce se ochladí a zkondenzuje v kapky, které tvoří mraky. Vítr žene mraky nad pevninu, kde z nich padají srážky – déšť a sníh na horách. Část vody stéká po povrchu do řek a zpět do moře (povrchový odtok), část se vsakuje do půdy a doplňuje podzemní vodu, která pomalu teče také k moři.";

const W = 420;
const H = 370;
const SEA = "#5d93d6";
const GROUND = 252; // land surface level near the coast

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-34 10 C-46 10 -46 -6 -32 -6 C-32 -20 -12 -24 -6 -12 C0 -26 24 -24 24 -8 C38 -10 42 10 30 10Z"
      className="bz3-cloud"
    />
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 V-18" className="bz3-trunk" />
      <path d="M0 -14 C-16 -14 -18 -30 -8 -34 C-8 -46 8 -46 9 -34 C18 -30 16 -14 0 -14Z" className="bz3-crown" />
      <path d="M0 -14 C-16 -14 -18 -30 -8 -34 C-8 -46 8 -46 9 -34 C18 -30 16 -14 0 -14Z" fill={pat(id, "d")} opacity={0.5} />
    </g>
  );
}

function T({ x, y, children, a = "middle" }: { x: number; y: number; children: string; a?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={a} className="bz3-lbl bz3-sm bz3-b bz3-halo bz3-blue-t">
      {children}
    </text>
  );
}

function Wavy({ x, y0, y1 }: { x: number; y0: number; y1: number }) {
  let d = `M${x} ${y0}`;
  for (let y = y0 - 6, k = 0; y >= y1; y -= 6, k++) d += ` Q${x + (k % 2 ? -5 : 5)} ${y + 3} ${x} ${y}`;
  return <DrawArrow d={d} tone="blue" delay={0.6} className="bz3-thin-arr" />;
}

function Plate() {
  const { id } = useFig();
  const live = useLive();
  const land = `M4 ${GROUND - 120} L40 ${GROUND - 150} L70 ${GROUND - 120} L96 ${GROUND - 168} L132 ${GROUND - 100} L170 ${GROUND - 40} C200 ${GROUND - 14} 250 ${GROUND - 4} 290 ${GROUND} L300 ${GROUND + 8} L300 ${H - 4} L4 ${H - 4}Z`;
  const river = `M96 ${GROUND - 160} C100 ${GROUND - 120} 120 ${GROUND - 104} 136 ${GROUND - 88} C160 ${GROUND - 60} 200 ${GROUND - 30} 250 ${GROUND - 10} C270 ${GROUND - 4} 284 ${GROUND} 300 ${GROUND + 4}`;
  return (
    <>
      {/* sea */}
      <Liquid d={`M290 ${GROUND + 4} H${W - 4} V${H - 4} H290Z`} color={SEA} opacity={0.35} />
      <path d={`M290 ${GROUND + 4} H${W - 4}`} className="bz3-o" />
      {/* land with cross-section */}
      <path d={land} className="bz3-land" />
      <path d={land} fill={pat(id, "dots")} />
      <path d={`M4 ${H - 50} C100 ${H - 54} 200 ${H - 50} 300 ${H - 56} L300 ${H - 4} L4 ${H - 4}Z`} className="bz3-gw" />
      <path d={`M4 ${H - 50} C100 ${H - 54} 200 ${H - 50} 300 ${H - 56} L300 ${H - 4} L4 ${H - 4}Z`} fill={pat(id, "h")} />
      <path d={land} className="bz3-o" fill="none" />
      {/* snow caps */}
      <path d={`M30 ${GROUND - 142} L40 ${GROUND - 150} L50 ${GROUND - 142} L44 ${GROUND - 138} L38 ${GROUND - 142}Z M86 ${GROUND - 154} L96 ${GROUND - 168} L106 ${GROUND - 152} L98 ${GROUND - 148} L92 ${GROUND - 152}Z`} className="bz3-snow" />
      {/* river */}
      <path d={river} className="bz3-river" />
      <path d={river} className={`bz3-river-flow ${live ? "bz3-live" : ""}`} />
      {/* trees */}
      {[178, 198, 218, 236].map((x, i) => (
        <Tree key={x} x={x} y={GROUND - 36 + i * 9 + (i > 1 ? -2 : 0)} s={0.9} />
      ))}
      {/* sun */}
      <Pop>
        <g>
          <circle cx={W - 40} cy={42} r={18} className="bz3-sun" />
          <path d={Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return `M${f1(W - 40 + Math.cos(a) * 23)} ${f1(42 + Math.sin(a) * 23)} L${f1(W - 40 + Math.cos(a) * 30)} ${f1(42 + Math.sin(a) * 30)}`;
          }).join(" ")} className="bz3-sunray" />
        </g>
      </Pop>
      {/* clouds */}
      <Pop delay={0.3}>
        <g>
          <Cloud x={300} y={70} s={1} />
          <Cloud x={92} y={56} s={1.2} />
        </g>
      </Pop>
      {/* evaporation, transpiration */}
      {[330, 356, 382].map((x) => (
        <Wavy key={x} x={x} y0={GROUND - 4} y1={GROUND - 140} />
      ))}
      <Wavy x={200} y0={GROUND - 76} y1={GROUND - 146} />
      <Wavy x={224} y0={GROUND - 66} y1={GROUND - 140} />
      {/* wind carries clouds */}
      <DrawArrow d="M250 52 C210 40 170 40 140 46" tone="ink" delay={0.9} className="bz3-thin-arr" />
      {/* rain */}
      <g className={`bz3-raining ${live ? "bz3-live" : ""}`}>
        {[62, 78, 94, 110, 126].map((x, i) => (
          <path key={x} d={`M${x} ${74 + (i % 2) * 6} l-5 ${40 + (i % 3) * 8}`} className="bz3-rain" />
        ))}
      </g>
      {/* infiltration */}
      <DrawArrow d={`M150 ${GROUND - 66} V${H - 62}`} tone="blue" delay={1.2} />
      <DrawArrow d={`M118 ${GROUND - 116} V${H - 62}`} tone="blue" delay={1.25} />
      {/* groundwater flow */}
      <DrawArrow d={`M150 ${H - 22} H${W - 70}`} tone="blue" delay={1.4} />
      <Fade delay={1}>
        <T x={356} y={GROUND - 148}>výpar</T>
        <T x={216} y={GROUND - 160}>transpirace</T>
        <T x={300} y={38}>kondenzace</T>
        <text x={196} y={34} textAnchor="middle" className="bz3-lbl bz3-sm bz3-halo">
          vítr
        </text>
        <T x={20} y={130} a="start">srážky</T>
        <T x={244} y={GROUND - 26} a="end">povrchový odtok</T>
        <T x={110} y={GROUND + 30} a="end">vsakování</T>
        <T x={14} y={H - 16} a="start">podzemní voda</T>
        <T x={W - 12} y={GROUND + 36} a="end">moře</T>
      </Fade>
    </>
  );
}

export default function WaterCycle() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={580} replay>
      <Plate />
    </Figure>
  );
}
