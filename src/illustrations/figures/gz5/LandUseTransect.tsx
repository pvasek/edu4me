import type { ReactNode } from "react";
import { DrawArrow, Fade, Figure, Pop, Rise, f1, pat, useFig } from "./kit";

const LABEL =
  "Transekt z centra města na venkov, jak ho zaznamenáme při terénním výzkumu: podél jedné přímky zapisujeme každých 100 metrů, jak je plocha využita. Z centra s obchody a službami, kostelem a náměstím přecházíme přes bytové domy na sídlišti, čtvrť rodinných domů se zahradami a průmyslovou zónu se sklady u obchvatu až k polím a lesu asi 4 km od centra. Pod obrázkem je pruh využití ploch s délkovým měřítkem. Směrem od centra klesá výška a hustota zástavby a přibývá zeleně.";

const W = 440;
const H = 362;
const X0 = 20;
const KX = 100; // px per km
const X = (km: number) => X0 + km * KX;
const GROUND = 150;
const SY = 170; // strip top
const SH = 18;

type Zone = { from: number; to: number; cls: string; name: [string, string?] };
const ZONES: Zone[] = [
  { from: 0, to: 0.8, cls: "gz5-shop", name: ["obchody", "a služby"] },
  { from: 0.8, to: 1.5, cls: "gz5-flat", name: ["bytové", "domy"] },
  { from: 1.5, to: 2.2, cls: "gz5-house", name: ["rodinné", "domy"] },
  { from: 2.2, to: 2.8, cls: "gz5-ind", name: ["průmysl", "a sklady"] },
  { from: 2.8, to: 3.4, cls: "gz5-field", name: ["pole"] },
  { from: 3.4, to: 4, cls: "gz5-forest", name: ["les"] },
];

function Windows({ x, y, cols, rows, dx = 7, dy = 9, w = 3.4, h = 4.6 }: { x: number; y: number; cols: number; rows: number; dx?: number; dy?: number; w?: number; h?: number }) {
  const out: ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push(<rect key={`${r}-${c}`} x={f1(x + c * dx)} y={f1(y + r * dy)} width={w} height={h} className="gz5-win" />);
  return <g>{out}</g>;
}

/** gabled town house with a shop on the ground floor */
function TownHouse({ x, w, h }: { x: number; w: number; h: number }) {
  const top = GROUND - h;
  return (
    <g>
      <path d={`M${x} ${GROUND} V${top} L${x + w / 2} ${top - 12} L${x + w} ${top} V${GROUND} Z`} className="gz5-shop gz5-o gz5-thin" />
      <Windows x={x + 4} y={top + 5} cols={Math.floor((w - 4) / 7)} rows={Math.floor((h - 22) / 9)} />
      <path d={`M${x + 2} ${GROUND - 13} H${x + w - 2}`} className="gz5-o gz5-thin" />
      <path d={`M${x + 2} ${GROUND - 13} l3 4 l3 -4 l3 4 l3 -4 l3 4 l3 -4`} className="gz5-awning" />
      <rect x={x + 3} y={GROUND - 8} width={w - 6} height={8} className="gz5-wall gz5-o gz5-thin" />
    </g>
  );
}
function Church({ x }: { x: number }) {
  const top = GROUND - 92;
  return (
    <g>
      <path d={`M${x} ${GROUND} V${top + 26} L${x + 9} ${top} L${x + 18} ${top + 26} V${GROUND} Z`} className="gz5-wall gz5-o gz5-thin" />
      <path d={`M${x + 9} ${top} V${top - 8} M${x + 6} ${top - 5} H${x + 12}`} className="gz5-o gz5-thin" />
      <circle cx={x + 9} cy={top + 36} r={3.4} className="gz5-o gz5-thin" />
      <path d={`M${x + 6} ${GROUND} V${GROUND - 14} Q${x + 9} ${GROUND - 19} ${x + 12} ${GROUND - 14} V${GROUND}`} className="gz5-o gz5-thin" />
    </g>
  );
}
function Block({ x, w, h }: { x: number; w: number; h: number }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={x} y={GROUND - h} width={w} height={h} className="gz5-flat gz5-o gz5-thin" />
      <rect x={x} y={GROUND - h} width={w} height={h} fill={pat(id, "v")} opacity={0.35} />
      <Windows x={x + 3} y={GROUND - h + 5} cols={Math.floor((w - 3) / 6)} rows={Math.floor((h - 8) / 8)} dx={6} dy={8} w={3} h={4} />
    </g>
  );
}
function House({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={GROUND - 15} width={18} height={15} className="gz5-house gz5-o gz5-thin" />
      <path d={`M${x - 3} ${GROUND - 15} L${x + 9} ${GROUND - 27} L${x + 21} ${GROUND - 15} Z`} className="gz5-roof gz5-o gz5-thin" />
      <rect x={x + 4} y={GROUND - 11} width={4} height={4.5} className="gz5-win" />
      <rect x={x + 11} y={GROUND - 9} width={4} height={9} className="gz5-win" />
    </g>
  );
}
function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${GROUND}) scale(${s})`}>
      <path d="M0 0 V-9" className="gz5-o gz5-thin" />
      <circle cx={0} cy={-15} r={8} className="gz5-forest gz5-o gz5-thin" />
    </g>
  );
}
function Conifer({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${GROUND}) scale(${s})`}>
      <path d="M0 -34 L8 -18 H4 L11 -4 H-11 L-4 -18 H-8 Z" className="gz5-forest gz5-o gz5-thin" />
      <path d="M0 -4 V0" className="gz5-o gz5-thin" />
    </g>
  );
}
function Factory({ x }: { x: number }) {
  return (
    <g>
      <rect x={x + 30} y={GROUND - 62} width={7} height={62} className="gz5-ind gz5-o gz5-thin" />
      <path d={`M${x} ${GROUND} V${GROUND - 26} l10 -10 V${GROUND - 26} l10 -10 V${GROUND - 26} l10 -10 V${GROUND - 26} H${x + 30} V${GROUND} Z`} className="gz5-ind gz5-o gz5-thin" />
      <rect x={x + 38} y={GROUND - 22} width={18} height={22} className="gz5-ind gz5-o gz5-thin" />
      <path d={`M${x + 41} ${GROUND} V${GROUND - 12} H${x + 49} V${GROUND}`} className="gz5-o gz5-thin" />
      <path d={`M${x + 33} ${GROUND - 66} q-5 -6 2 -11 q7 -5 2 -11`} className="gz5-smoke" />
    </g>
  );
}

function Skyline() {
  const { id } = useFig();
  const field = `M${X(2.82)} ${GROUND} V${GROUND - 5} H${X(3.38)} V${GROUND} Z`;
  return (
    <g>
      {/* centre */}
      <Rise delay={0.05}>
        <TownHouse x={X(0) + 2} w={24} h={52} />
        <Church x={X(0.28)} />
        <TownHouse x={X(0.48)} w={24} h={58} />
      </Rise>
      {/* housing estate */}
      <Rise delay={0.25}>
        <Block x={X(0.83)} w={28} h={92} />
        <Block x={X(0.83) + 33} w={34} h={62} />
      </Rise>
      {/* family houses with gardens */}
      <Rise delay={0.45}>
        <House x={X(1.52)} />
        <Tree x={X(1.77)} s={0.75} />
        <House x={X(1.85)} />
        <Tree x={X(2.11)} s={0.9} />
        <path d={`M${X(1.51)} ${GROUND - 3} H${X(2.19)}`} className="gz5-fence" />
      </Rise>
      {/* industry along the bypass */}
      <Rise delay={0.65}>
        <Factory x={X(2.22)} />
      </Rise>
      {/* fields and forest */}
      <Rise delay={0.85}>
        <path d={field} className="gz5-field gz5-o gz5-thin" />
        <path d={field} fill={pat(id, "v")} />
        {[3.5, 3.63, 3.76, 3.89].map((k, i) => (i % 2 ? <Tree key={k} x={X(k)} s={1.2} /> : <Conifer key={k} x={X(k)} s={1.05} />))}
      </Rise>
      <path d={`M${X(0) - 6} ${GROUND} H${X(4) + 6}`} className="gz5-o" />
    </g>
  );
}

function Strip() {
  const dots: number[] = [];
  for (let i = 0; i <= 40; i++) dots.push(i / 10);
  return (
    <g>
      <Fade delay={0.9}>
        {dots.map((k) => (
          <circle key={k} cx={X(k)} cy={GROUND + 9} r={k % 1 === 0 ? 2.4 : 1.3} className="gz5-dot" />
        ))}
      </Fade>
      {ZONES.map((z, i) => (
        <Pop key={z.cls} delay={1 + i * 0.1}>
          <rect x={X(z.from)} y={SY} width={(z.to - z.from) * KX} height={SH} className={`${z.cls} gz5-o gz5-thin`} />
          <text x={X((z.from + z.to) / 2)} y={SY + SH + 17} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
            {z.name[0]}
          </text>
          {z.name[1] && (
            <text x={X((z.from + z.to) / 2)} y={SY + SH + 33} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
              {z.name[1]}
            </text>
          )}
        </Pop>
      ))}
      {/* distance axis */}
      <path d={`M${X(0)} ${SY + 76} H${X(4)}`} className="gz5-o gz5-thin" />
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={`t${k}`}>
          <path d={`M${X(k)} ${SY + 72} V${SY + 80}`} className="gz5-o gz5-thin" />
          <text x={X(k)} y={SY + 96} textAnchor={k === 4 ? "end" : k === 0 ? "start" : "middle"} className="gz5-num">
            {k === 4 ? "4 km" : k}
          </text>
        </g>
      ))}
    </g>
  );
}

function Trends() {
  const y1 = SY + 116;
  const y2 = SY + 150;
  return (
    <Fade delay={1.5}>
      <path d={`M${X(0)} ${y1 - 13} L${X(4)} ${y1 - 1} L${X(0)} ${y1 + 11} Z`} className="gz5-wedge-built" />
      <text x={X(0) + 6} y={y1 + 4} className="gz5-lbl gz5-sm gz5-b">
        výška a hustota zástavby
      </text>
      <path d={`M${X(4)} ${y2 - 13} L${X(0)} ${y2 - 1} L${X(4)} ${y2 + 11} Z`} className="gz5-wedge-green" />
      <text x={X(4) - 6} y={y2 + 4} textAnchor="end" className="gz5-lbl gz5-sm gz5-b">
        zeleň a volná plocha
      </text>
      <circle cx={X(0) + 3} cy={H - 10} r={2.4} className="gz5-dot" />
      <text x={X(0) + 12} y={H - 5} className="gz5-lbl gz5-sm gz5-muted-t">
        bod záznamu: každých 100 m zapiš využití plochy
      </text>
    </Fade>
  );
}

function Plate() {
  return (
    <>
      <Fade delay={0}>
        <text x={X(0)} y={22} className="gz5-lbl gz5-b gz5-lvl-t">
          centrum
        </text>
        <text x={X(4)} y={22} textAnchor="end" className="gz5-lbl gz5-b gz5-lvl-t">
          venkov
        </text>
      </Fade>
      <DrawArrow d={`M${X(0) + 72} 17 H${X(4) - 66}`} tone="lvl" delay={0.1} />
      <Skyline />
      <Strip />
      <Trends />
    </>
  );
}

export default function LandUseTransect() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
