import { DrawArrow, Fade, Figure, Pop, pat, useFig, useLive } from "./kit";
import { T, waves } from "./land";

const LABEL =
  "Řetěz sopečných ostrovů nad horkou skvrnou na příkladu Havaje. Horká skvrna je sloupec horkého materiálu, který stoupá z hlubin pláště a stojí na místě. Pacifická deska nad ní klouže k severozápadu rychlostí asi 7 až 10 cm za rok. Nad skvrnou vzniká sopka – dnes je to ostrov Havaj s činnými sopkami. Deska sopku odveze, sopka vyhasne a vedle ní vyroste nová. Proto jsou ostrovy tím starší a nižší, čím dál jsou od skvrny: Maui asi 1 milion let, Oahu asi 3, Kauai asi 5 milionů let, atol Midway asi 28 milionů let.";

const W = 480;
const H = 336;
const SL = 96; // sea level
const SF = 176; // sea floor
const PB = 214; // base of the plate
const PX = 392; // the hot spot

const ISLANDS = [
  { x: 392, half: 74, top: 50, name: "Havaj", age: "dnes", tag: 32 },
  { x: 300, half: 54, top: 68, name: "Maui", age: "≈ 1", tag: 56 },
  { x: 222, half: 44, top: 78, name: "Oahu", age: "≈ 3", tag: 66 },
  { x: 152, half: 37, top: 84, name: "Kauai", age: "≈ 5", tag: 72 },
];

const island = (x: number, half: number, top: number) =>
  `M${x - half} ${SF} C${x - half * 0.55} ${top + 6} ${x - half * 0.3} ${top} ${x} ${top} C${x + half * 0.3} ${top} ${x + half * 0.55} ${top + 6} ${x + half} ${SF}Z`;

function Plume() {
  const live = useLive();
  const d = `M${PX - 16} ${H - 6} C${PX - 18} 280 ${PX - 20} 250 ${PX - 50} ${PB + 14} C${PX - 50} ${PB} ${PX + 50} ${PB} ${PX + 50} ${PB + 14} C${PX + 20} 250 ${PX + 18} 280 ${PX + 16} ${H - 6}Z`;
  return (
    <g>
      <path d={d} className="gz2-magma" style={{ opacity: 0.75 }} />
      <path d={d} className="gz2-o gz2-thin" />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M${PX - 8 + k * 8} ${H - 10} V${PB + 18}`}
          className={`gz2-arr gz2-arr-red ${live ? "gz2-flow" : ""}`}
          style={{ strokeWidth: 1.6, opacity: 0.8 }}
        />
      ))}
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* mantle */}
      <rect x={6} y={PB} width={W - 12} height={H - 6 - PB} className="gz2-mantle" />
      <rect x={6} y={PB} width={W - 12} height={H - 6 - PB} fill={pat(id, "dots")} />
      <Plume />
      {/* oceanic plate */}
      <rect x={6} y={SF} width={W - 12} height={PB - SF} className="gz2-ocrust" />
      <rect x={6} y={SF} width={W - 12} height={PB - SF} fill={pat(id, "d")} opacity={0.5} />
      <path d={`M6 ${SF} H${W - 6} M6 ${PB} H${W - 6}`} className="gz2-o" />
      {/* the vent through the plate */}
      <path d={`M${PX - 4} ${PB + 4} L${PX - 3} 48 L${PX + 3} 48 L${PX + 4} ${PB + 4}Z`} className="gz2-magma gz2-o gz2-thin" />
      {/* ocean */}
      <rect x={6} y={SL} width={W - 12} height={SF - SL} className="gz2-sea" />
      <rect x={6} y={SL} width={W - 12} height={SF - SL} fill={pat(id, "h")} opacity={0.4} />
      {/* islands, oldest on the left */}
      {[...ISLANDS].reverse().map((s, i) => (
        <Pop key={s.name} delay={0.15 + i * 0.18}>
          <path d={island(s.x, s.half, s.top)} className={s.age === "dnes" ? "gz2-basalt" : "gz2-rock2"} />
          <path d={island(s.x, s.half, s.top)} fill={pat(id, "b")} opacity={0.35} />
          <path d={island(s.x, s.half, s.top)} className="gz2-o" />
        </Pop>
      ))}
      {/* Midway: a drowned volcano capped by a coral atoll */}
      <Pop delay={0.05}>
        <path d={`M24 ${SF} Q40 ${SL + 30} 52 ${SL + 6} H96 Q108 ${SL + 30} 124 ${SF}Z`} className="gz2-rock" />
        <path d={`M24 ${SF} Q40 ${SL + 30} 52 ${SL + 6} H96 Q108 ${SL + 30} 124 ${SF}Z`} className="gz2-o" />
        <path d={`M50 ${SL + 7} q3 -12 8 -9 q2 4 0 9Z M90 ${SL + 7} q2 -12 7 -9 q2 4 0 9Z`} className="gz2-coral gz2-o gz2-thin" />
      </Pop>
      {/* lava on the active island */}
      <path d={`M${PX + 4} 52 C${PX + 26} 54 ${PX + 36} 62 ${PX + 44} 80`} className="gz2-lava" style={{ strokeWidth: 3.5 }} />
      <path d={waves(6, W - 6, SL, 2, 18)} className="gz2-o gz2-thin" />

      <Fade delay={0.9}>
        {ISLANDS.map((s) => (
          <T key={s.name} x={s.x} y={s.tag} cls={`gz2-b ${s.age === "dnes" ? "gz2-red-t" : ""}`}>
            {s.name}
          </T>
        ))}
        <T x={70} y={60} cls="gz2-b">Midway</T>
        <T x={70} y={78} cls="gz2-sm">(atol)</T>
        {/* ages */}
        {[...ISLANDS, { x: 74, age: "≈ 28", name: "Midway" }].map((s) => (
          <T key={s.name} x={s.x} y={PB + 20} cls="gz2-sm gz2-b">
            {s.age}
          </T>
        ))}
        <T x={10} y={PB + 40} a="start" cls="gz2-sm">stáří (mil. let)</T>
        <T x={PX - 56} y={282} a="end" cls="gz2-red-t gz2-b">horká skvrna</T>
        <T x={PX - 56} y={300} a="end" cls="gz2-sm">stojí na místě</T>
        <T x={W - 14} y={SL + 24} a="end" cls="gz2-sm gz2-sec">oceán</T>
      </Fade>
      <DrawArrow d={`M300 ${SF + 23} H128`} tone="lvl" delay={0.6} className="gz2-vec" />
      <T x={312} y={SF + 27} a="start" cls="gz2-sm gz2-b gz2-lvl-t">deska</T>
      <Fade delay={1.2}>
        <T x={10} y={H - 16} a="start" cls="gz2-sm gz2-lvl-t">Pacifická deska: ≈ 7–10 cm za rok k SZ</T>
      </Fade>
    </>
  );
}

export default function HotspotChain() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={640} replay>
      <Plate />
    </Figure>
  );
}
