import { useState } from "react";
import { motion } from "motion/react";
import { spring } from "../../../ui/motion";
import { Figure, Toggle, type P2 } from "./kit";

const LABEL =
  "Weberův lokalizační trojúhelník: dvě místa se surovinami a trh. Továrna se postaví tam, kde je součet nákladů na dopravu nejmenší, tedy blíž k tomu vrcholu, odkud se veze nejvíc tun. Ocelárna potřebuje na 1 t oceli asi 1,4 t železné rudy a 0,8 t uhlí, výroba hmotnost ztrácí, a proto stojí blízko surovin. Pivovar přidává vodu, která je všude, výrobek je těžší než dovážený slad a chmel, a proto stojí u trhu.";

const W = 480;
const H = 470;
const ORE: P2 = [70, 318];
const COAL: P2 = [410, 318];
const MARKET: P2 = [240, 84];

type Case = "steel" | "beer";
const CASES: Record<
  Case,
  { w: [number, number, number]; t: [string, string, string]; mi: string; note: string[]; fac: string }
> = {
  steel: {
    w: [1.4, 0.8, 1],
    t: ["železná ruda 1,4 t", "uhlí 0,8 t", "ocel 1 t"],
    mi: "suroviny 2,2 t > výrobek 1 t",
    note: ["výroba ztrácí hmotnost →", "továrna se táhne k surovinám"],
    fac: "ocelárna",
  },
  beer: {
    w: [0.17, 0.002, 1],
    t: ["slad ≈ 0,17 t", "chmel ≈ 0,002 t", "pivo 1 t"],
    mi: "dovážené suroviny 0,17 t < výrobek 1 t",
    note: ["voda je všude, výrobek přibírá →", "pivovar stojí u trhu"],
    fac: "pivovar",
  },
};

/** least-cost point (Weber point) by Weiszfeld's iteration */
function weber(w: [number, number, number]): P2 {
  const P = [ORE, COAL, MARKET];
  // a vertex whose weight is at least the sum of the others is the optimum
  const tot = w[0] + w[1] + w[2];
  for (let i = 0; i < 3; i++) if (w[i] >= tot - w[i]) return P[i];
  let x = (ORE[0] + COAL[0] + MARKET[0]) / 3;
  let y = (ORE[1] + COAL[1] + MARKET[1]) / 3;
  for (let k = 0; k < 200; k++) {
    let nx = 0;
    let ny = 0;
    let d = 0;
    P.forEach(([px, py], i) => {
      const r = Math.max(1e-6, Math.hypot(px - x, py - y));
      nx += (w[i] * px) / r;
      ny += (w[i] * py) / r;
      d += w[i] / r;
    });
    x = nx / d;
    y = ny / d;
  }
  return [x, y];
}

// the optimum for beer is the market itself; draw the brewery just below the city icon
const atMarket = (p: P2): P2 => (p[0] === MARKET[0] && p[1] === MARKET[1] ? [p[0], p[1] + 46] : p);
const SPOT: Record<Case, P2> = { steel: atMarket(weber(CASES.steel.w)), beer: atMarket(weber(CASES.beer.w)) };

function Factory() {
  return (
    <g>
      <path d="M-20 12 V-6 L-10 -12 V-6 L0 -12 V-6 L10 -12 V12 Z" className="gz7-lvl-fill gz7-o" />
      <path d="M12 12 V-24 h7 V12" className="gz7-ink-fill gz7-o gz7-thin" />
      <path d="M15.5 -28 q4 -6 0 -10 q-4 -5 1 -10" className="gz7-smoke" />
    </g>
  );
}

function Corner({ p, label, sub, icon }: { p: P2; label: string; sub: string; icon: "ore" | "coal" | "city" }) {
  const below = p[1] > 200;
  return (
    <g>
      {icon === "city" ? (
        <g transform={`translate(${p[0]} ${p[1]})`}>
          <path d="M-22 10 V-6 h10 V-16 h10 V-26 h8 V-10 h8 V-2 h8 V10 Z" className="gz7-house-lvl gz7-o gz7-thin" />
        </g>
      ) : (
        <path
          d={`M${p[0] - 24} ${p[1] + 10} Q${p[0] - 12} ${p[1] - 18} ${p[0]} ${p[1] - 16} Q${p[0] + 14} ${p[1] - 18} ${p[0] + 24} ${p[1] + 10} Z`}
          className={`${icon === "ore" ? "gz7-ore" : "gz7-coal"} gz7-o gz7-thin`}
        />
      )}
      <text x={p[0]} y={below ? p[1] + 34 : p[1] - 54} textAnchor="middle" className="gz7-lbl gz7-b">
        {label}
      </text>
      <text x={p[0]} y={below ? p[1] + 53 : p[1] - 35} textAnchor="middle" className="gz7-lbl gz7-sm">
        {sub}
      </text>
    </g>
  );
}

export default function WeberTriangle() {
  const [c, setC] = useState<Case>("steel");
  const C = CASES[c];
  const [fx, fy] = SPOT[c];
  const P = [ORE, COAL, MARKET];
  return (
    <Figure
      level={12}
      label={LABEL}
      w={W}
      h={H}
      max={600}
      controls={
        <Toggle
          value={c}
          onChange={setC}
          label="Druh výroby"
          options={[
            { id: "steel", text: "ocelárna" },
            { id: "beer", text: "pivovar" },
          ]}
        />
      }
    >
      <path d={`M${ORE[0]} ${ORE[1]} L${COAL[0]} ${COAL[1]} L${MARKET[0]} ${MARKET[1]} Z`} className="gz7-o gz7-thin gz7-dash" />
      {/* hauled tonnes: line width ∝ weight */}
      {P.map(([px, py], i) => (
        <motion.line
          key={i}
          x1={px}
          y1={py}
          initial={false}
          animate={{ x2: fx, y2: fy, strokeWidth: 1 + C.w[i] * 6 }}
          transition={spring.gentle}
          className="gz7-haul"
        />
      ))}
      <Corner p={ORE} label={c === "steel" ? "důl na rudu" : "sladovna"} sub={C.t[0]} icon="ore" />
      <Corner p={COAL} label={c === "steel" ? "uhelný důl" : "chmelnice"} sub={C.t[1]} icon="coal" />
      <Corner p={MARKET} label="trh (město)" sub={C.t[2]} icon="city" />
      <motion.g initial={false} animate={{ x: fx, y: fy }} transition={spring.gentle}>
        <circle r={30} className="gz7-paper-fill gz7-o gz7-thin" opacity={0.85} />
        <Factory />
      </motion.g>
      <motion.text
        initial={false}
        animate={{ x: fx + (c === "beer" ? 40 : 36), y: fy + (c === "beer" ? 30 : 6) }}
        transition={spring.gentle}
        className="gz7-lbl gz7-b gz7-lvl-t gz7-halo"
      >
        {C.fac}
      </motion.text>
      <text x={14} y={128} className="gz7-lbl gz7-sm gz7-muted-t">
        šířka pásu =
      </text>
      <text x={14} y={146} className="gz7-lbl gz7-sm gz7-muted-t">
        tuny na 1 t výrobku
      </text>
      {/* rule */}
      <rect x={40} y={392} width={400} height={70} rx={8} className="gz7-tag-lvl" />
      <text x={240} y={414} textAnchor="middle" className="gz7-eq">
        {C.mi}
      </text>
      <text x={240} y={434} textAnchor="middle" className="gz7-lbl gz7-sm">
        {C.note[0]}
      </text>
      <text x={240} y={452} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b">
        {C.note[1]}
      </text>
    </Figure>
  );
}
