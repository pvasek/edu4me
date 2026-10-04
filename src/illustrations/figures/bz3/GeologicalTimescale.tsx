import { motion } from "motion/react";
import { Figure, Fade, Num, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Dějiny Země stlačené do jednoho dne: 24 hodin odpovídá 4,6 miliardy let, jedna hodina asi 190 milionům let. Země vznikla o půlnoci, první buňky se objevily kolem 4:10, kyslík se v ovzduší hromadí od 11:29 díky fotosyntéze sinic. Kambrická exploze živočichů přichází až ve 21:11, život vystupuje na souš ve 21:33, dinosauři se objevují ve 22:48 a vymírají ve 23:39, kdy se rozšíří savci. Člověk rozumný je tu jen posledních asi 6 sekund před půlnocí.";

const W = 400;
const CX = 200;
const CY = 190;
const R1 = 96;
const R2 = 118;
const H = 560;

const toT = (ageGa: number) => ((4.6 - ageGa) / 4.6) * 24;
const pt = (h: number, r: number): [number, number] => {
  const a = ((h / 24) * 360 - 90) * (Math.PI / 180);
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
};
const arc = (h1: number, h2: number, r: number) => {
  const [x1, y1] = pt(h1, r);
  const [x2, y2] = pt(h2, r);
  const large = h2 - h1 > 12 ? 1 : 0;
  return `M${f1(x1)} ${f1(y1)} A${r} ${r} 0 ${large} 1 ${f1(x2)} ${f1(y2)}`;
};
const band = (h1: number, h2: number) => {
  const [a, b] = pt(h2, R1);
  const inner = arc(h2, h1, R1)
    .replace(/^M\S+ \S+ /, "")
    .replace(/A(\S+) (\S+) 0 (\d) 1/, "A$1 $2 0 $3 0");
  return `${arc(h1, h2, R2)} L${f1(a)} ${f1(b)} ${inner}Z`;
};

const EONS = [
  { name: "hadaikum", from: 4.6, to: 4.0, cls: "bz3-eon1" },
  { name: "archaikum", from: 4.0, to: 2.5, cls: "bz3-eon2" },
  { name: "proterozoikum", from: 2.5, to: 0.539, cls: "bz3-eon3" },
  { name: "fanerozoikum", from: 0.539, to: 0, cls: "bz3-eon4" },
];

const EVENTS = [
  { age: 4.6, time: "0:00", what: "vznik Země", when: "4,6 mld. let", bh: 0.55, br: 140 },
  { age: 3.8, time: "4:10", what: "první buňky", when: "3,8 mld. let", br: 140 },
  { age: 2.4, time: "11:29", what: "kyslík v ovzduší (sinice)", when: "2,4 mld. let", br: 140 },
  { age: 0.539, time: "21:11", what: "kambrická exploze", when: "539 mil. let", bh: 20.8, br: 140 },
  { age: 0.47, time: "21:33", what: "život na souši", when: "470 mil. let", bh: 21.75, br: 140 },
  { age: 0.23, time: "22:48", what: "první dinosauři", when: "230 mil. let", bh: 22.7, br: 140 },
  { age: 0.066, time: "23:39", what: "konec dinosaurů, rozvoj savců", when: "66 mil. let", bh: 23.55, br: 140 },
  { age: 0.0003, time: "23:59:54", what: "člověk rozumný", when: "300 tis. let", bh: 24, br: 164 },
];

const SWEEP = 2.2;

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* eon bands */}
      <Fade>
        {EONS.map((e) => (
          <g key={e.name}>
            <path d={band(toT(e.from), toT(e.to))} className={`bz3-o bz3-thin ${e.cls}`} />
            <path id={`${id}-${e.name}`} d={arc(toT(e.from), toT(e.to), (R1 + R2) / 2)} fill="none" />
            <text className="bz3-eon-t" dy={4}>
              <textPath href={`#${id}-${e.name}`} startOffset="50%" textAnchor="middle">
                {e.name}
              </textPath>
            </text>
          </g>
        ))}
        <path d={band(toT(0.539), 24)} fill={pat(id, "d")} />
        <circle cx={CX} cy={CY} r={R2} className="bz3-o" />
        <circle cx={CX} cy={CY} r={R1} className="bz3-o bz3-thin" />
        {Array.from({ length: 24 }, (_, h) => {
          const [a, b] = pt(h, R2);
          const [c, d] = pt(h, R2 + (h % 6 ? 4 : 8));
          return <line key={h} x1={a} y1={b} x2={c} y2={d} className="bz3-o bz3-thin" />;
        })}
        {[0, 6, 12, 18].map((h) => {
          const [x, y] = pt(h, 78);
          return (
            <text key={h} x={x} y={y + 5} textAnchor="middle" className="bz3-num bz3-b-num">
              {h}:00
            </text>
          );
        })}
        <text x={CX} y={CY + 34} textAnchor="middle" className="bz3-lbl bz3-b">
          24 h = 4,6 mld. let
        </text>
        <text x={CX} y={CY + 54} textAnchor="middle" className="bz3-lbl bz3-sm">
          1 h ≐ 190 mil. let
        </text>
      </Fade>

      {/* clock hand sweeping through the day */}
      <motion.g
        variants={{
          hidden: { rotate: 0 },
          show: { rotate: 360, transition: { duration: SWEEP, ease: "linear" } },
        }}
        style={{ transformBox: "view-box", transformOrigin: `${CX}px ${CY}px` }}
      >
        <line x1={CX} y1={CY} x2={CX} y2={CY - 58} className="bz3-hand" />
      </motion.g>
      <circle cx={CX} cy={CY} r={4} className="bz3-hand-hub" />

      {EVENTS.map((e, i) => {
        const t = toT(e.age);
        const [rx, ry] = pt(t, R2);
        const [bx, by] = pt(e.bh ?? t, e.br);
        return (
          <Pop key={i} delay={0.15 + (t / 24) * SWEEP}>
            <line x1={rx} y1={ry} x2={bx} y2={by} className="bz3-lead" />
            <circle cx={rx} cy={ry} r={2.6} className="bz3-dot" />
            <Num x={bx} y={by} n={i + 1} r={10} />
          </Pop>
        );
      })}

      {/* legend */}
      {EVENTS.map((e, i) => {
        const y = 362 + i * 25;
        return (
          <Fade key={i} delay={0.3 + i * 0.12}>
            <Num x={22} y={y - 5} n={i + 1} r={9} />
            <text x={38} y={y} className="bz3-num">
              {e.time}
            </text>
            <text x={112} y={y} className="bz3-lbl bz3-sm bz3-b">
              {e.what}
            </text>
            <text x={W - 10} y={y} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
              {e.when}
            </text>
          </Fade>
        );
      })}
    </>
  );
}

export default function GeologicalTimescale() {
  return (
    <Figure level={7} label={LABEL} w={W} h={H} max={540} replay>
      <Plate />
    </Figure>
  );
}
