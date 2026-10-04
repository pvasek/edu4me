import { motion } from "motion/react";
import { ease } from "../../../ui/motion";
import { Fade, Figure, Legend, f1 } from "./kit";

const GOALS = [
  "Konec chudoby",
  "Konec hladu",
  "Zdraví a kvalitní život",
  "Kvalitní vzdělání",
  "Rovnost mužů a žen",
  "Pitná voda, kanalizace",
  "Dostupné a čisté energie",
  "Důstojná práce a ekonomický růst",
  "Průmysl, inovace a infrastruktura",
  "Méně nerovností",
  "Udržitelná města a obce",
  "Odpovědná výroba a spotřeba",
  "Klimatická opatření",
  "Život ve vodě",
  "Život na souši",
  "Mír, spravedlnost a silné instituce",
  "Partnerství ke splnění cílů",
];

/** the five "P" of Agenda 2030: goals 1–6 people, 7–11 prosperity, 12–15 planet, 16 peace, 17 partnership */
const GROUPS = [
  { t: "lidé", from: 0, to: 5, cls: "gz7-sdg-people" },
  { t: "prosperita", from: 6, to: 10, cls: "gz7-sdg-prosp" },
  { t: "planeta", from: 11, to: 14, cls: "gz7-sdg-planet" },
  { t: "mír", from: 15, to: 15, cls: "gz7-sdg-peace" },
  { t: "partnerství", from: 16, to: 16, cls: "gz7-sdg-partner" },
];
const groupOf = (i: number) => GROUPS.find((g) => i >= g.from && i <= g.to)!;

const LABEL =
  "Sedmnáct cílů udržitelného rozvoje OSN (Agenda 2030) jako číslované kolo: " +
  GOALS.map((g, i) => `${i + 1}. ${g}`).join(", ") +
  ". Barvy dělí cíle do pěti skupin: lidé, prosperita, planeta, mír a partnerství.";

const W = 420;
const H = 380;
const CX = 210;
const CY = 186;
const RO = 140;
const RI = 70;
const STEP = 360 / 17;

const pol = (a: number, r: number) => [CX + Math.cos((a * Math.PI) / 180) * r, CY + Math.sin((a * Math.PI) / 180) * r];

function seg(a0: number, a1: number, r0: number, r1: number) {
  const [x0, y0] = pol(a0, r1);
  const [x1, y1] = pol(a1, r1);
  const [x2, y2] = pol(a1, r0);
  const [x3, y3] = pol(a0, r0);
  return `M${f1(x0)} ${f1(y0)} A${r1} ${r1} 0 0 1 ${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)} A${r0} ${r0} 0 0 0 ${f1(x3)} ${f1(y3)} Z`;
}

export default function SdgWheel() {
  return (
    <Figure
      level={12}
      label={LABEL}
      w={W}
      h={H}
      max={540}
      replay
      controls={<Legend items={GOALS.map((g, i) => ({ n: i + 1, fill: groupOf(i).cls, text: g }))} />}
    >
      {GOALS.map((_, i) => {
        const a0 = -90 + i * STEP + 0.8;
        const a1 = -90 + (i + 1) * STEP - 0.8;
        const [nx, ny] = pol((a0 + a1) / 2, (RO + RI) / 2);
        return (
          <motion.g
            key={i}
            style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}
            variants={{
              hidden: { opacity: 0, scale: 0.7 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.45, delay: 0.05 + i * 0.07, ease: ease.out } },
            }}
          >
            <path d={seg(a0, a1, RI, RO)} className={`${groupOf(i).cls} gz7-o gz7-thin`} />
            <text x={nx} y={ny + 6} textAnchor="middle" className="gz7-sdg-n">
              {i + 1}
            </text>
          </motion.g>
        );
      })}
      {/* group arcs and names */}
      <Fade delay={1.3}>
        {GROUPS.map((g) => {
          const a0 = -90 + g.from * STEP + 1;
          const a1 = -90 + (g.to + 1) * STEP - 1;
          const [x0, y0] = pol(a0, RO + 10);
          const [x1, y1] = pol(a1, RO + 10);
          const mid = (a0 + a1) / 2;
          const [lx, ly] = pol(mid, RO + 24);
          const c = Math.cos((mid * Math.PI) / 180);
          return (
            <g key={g.t}>
              <path d={`M${f1(x0)} ${f1(y0)} A${RO + 10} ${RO + 10} 0 0 1 ${f1(x1)} ${f1(y1)}`} className="gz7-sdg-arc" />
              <text
                x={lx}
                y={ly + 5}
                textAnchor={c > 0.3 ? "start" : c < -0.3 ? "end" : "middle"}
                className="gz7-lbl gz7-b"
              >
                {g.t}
              </text>
            </g>
          );
        })}
      </Fade>
      <text x={CX} y={CY - 8} textAnchor="middle" className="gz7-title">
        Agenda 2030
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" className="gz7-lbl gz7-sm">
        17 cílů
      </text>
      <text x={CX} y={CY + 31} textAnchor="middle" className="gz7-lbl gz7-sm">
        169 dílčích cílů
      </text>
    </Figure>
  );
}
