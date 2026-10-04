import { motion } from "motion/react";
import { ease } from "../../../ui/motion";
import { Draw, Fade, Figure, Head, Pop } from "./kit";

const LABEL =
  "Energetická přeměna: od uhlí, ropy a zemního plynu k obnovitelným zdrojům (slunce, vítr, voda) a jádru. Potřebuje ukládání energie do baterií a přečerpávacích elektráren, silnější přenosové sítě a elektrifikaci s úsporami. Výroba elektřiny v roce 2024, zaokrouhleno: ve světě uhlí asi 34 %, plyn a ropa 25 %, jádro 9 %, obnovitelné zdroje 32 %; v Česku uhlí asi 35 %, plyn a ostatní fosilní 6 %, jádro 41 % a obnovitelné zdroje 18 %. Zdroje: Ember 2025, ENTSO-E.";

const W = 500;
const H = 486;

type Ic = "coal" | "oil" | "gas" | "sun" | "wind" | "water" | "atom" | "battery" | "grid" | "plug";

function Icon({ k }: { k: Ic }) {
  switch (k) {
    case "coal":
      return (
        <g>
          <path d="M-12 6 l4 -10 8 -2 6 6 -2 8 z" className="gz7-et-coal gz7-o gz7-thin" />
          <path d="M2 10 l2 -8 8 -2 4 8 -6 4 z" className="gz7-et-coal gz7-o gz7-thin" />
        </g>
      );
    case "oil":
      return (
        <g>
          <rect x={-9} y={-12} width={18} height={24} rx={3} className="gz7-et-oil gz7-o gz7-thin" />
          <path d="M-9 -4 h18 M-9 4 h18" className="gz7-o gz7-thin" />
        </g>
      );
    case "gas":
      return <path d="M0 -13 q10 10 6 18 q-2 6 -6 7 q-4 -1 -6 -7 q-3 -8 6 -18 z M0 2 q4 4 0 9 q-4 -5 0 -9z" className="gz7-et-gas gz7-o gz7-thin" />;
    case "sun":
      return (
        <g>
          <circle r={7} className="gz7-sun gz7-o gz7-thin" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <path key={i} d={`M${(Math.cos(a) * 10).toFixed(1)} ${(Math.sin(a) * 10).toFixed(1)} L${(Math.cos(a) * 14).toFixed(1)} ${(Math.sin(a) * 14).toFixed(1)}`} className="gz7-o gz7-thin" />;
          })}
        </g>
      );
    case "wind":
      return (
        <g>
          <path d="M0 -2 V14 M-3 14 h6" className="gz7-o gz7-thin" />
          <path d="M0 -2 L1 -15 L-1 -15 Z M0 -2 L12 4 L11 6 Z M0 -2 L-12 4 L-11 6 Z" className="gz7-paper-fill gz7-o gz7-thin" />
          <circle cy={-2} r={1.8} className="gz7-dot" />
        </g>
      );
    case "water":
      return <path d="M0 -13 q11 13 7 20 a8 8 0 0 1 -14 0 q-4 -7 7 -20 z" className="gz7-water gz7-o gz7-thin" />;
    case "atom":
      return (
        <g>
          <ellipse rx={13} ry={5} className="gz7-o gz7-thin" fill="none" />
          <ellipse rx={13} ry={5} transform="rotate(60)" className="gz7-o gz7-thin" fill="none" />
          <ellipse rx={13} ry={5} transform="rotate(-60)" className="gz7-o gz7-thin" fill="none" />
          <circle r={2.6} className="gz7-et-atom" />
        </g>
      );
    case "battery":
      return (
        <g>
          <rect x={-12} y={-7} width={22} height={14} rx={2} className="gz7-paper-fill gz7-o gz7-thin" />
          <rect x={10} y={-3} width={3} height={6} className="gz7-o gz7-thin" />
          <rect x={-10} y={-5} width={13} height={10} className="gz7-et-batt" />
        </g>
      );
    case "grid":
      return <path d="M-8 13 L0 -13 L8 13 M-10 -6 H10 M-7 3 H7 M-4 -6 L4 3 M4 -6 L-4 3" className="gz7-o gz7-thin" />;
    default:
      return (
        <g>
          <path d="M-12 8 h10 q8 0 8 -8 v-4 h-12 v4" className="gz7-o gz7-thin" fill="none" />
          <path d="M-2 -4 v-7 M6 -4 v-7" className="gz7-o" />
          <path d="M6 4 q8 0 8 8" className="gz7-o gz7-thin" fill="none" />
        </g>
      );
  }
}

function Token({ x, y, k, t, cls }: { x: number; y: number; k: Ic; t: string; cls: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={22} className={`${cls} gz7-o gz7-thin`} />
      <g transform={`translate(${x} ${y})`}>
        <Icon k={k} />
      </g>
      <text x={x} y={y + 40} textAnchor="middle" className="gz7-lbl gz7-sm">
        {t}
      </text>
    </g>
  );
}

const CATS = [
  { k: "coal", t: "uhlí", cls: "gz7-et-s-coal" },
  { k: "gas", t: "plyn, ropa a jiná fosilní", cls: "gz7-et-s-gas" },
  { k: "nuc", t: "jádro", cls: "gz7-et-s-nuc" },
  { k: "ren", t: "obnovitelné (voda, vítr, slunce, biomasa)", cls: "gz7-et-s-ren" },
] as const;

const BARS = [
  { name: "svět", v: [34, 25, 9, 32] },
  { name: "Česko", v: [35, 6, 41, 18] },
];

export default function EnergyTransition() {
  const BX = 92;
  const BW = 390;
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={640} replay>
      {/* from … to … */}
      <text x={92} y={22} textAnchor="middle" className="gz7-lbl gz7-b">
        dosud
      </text>
      <text x={372} y={22} textAnchor="middle" className="gz7-lbl gz7-b gz7-lvl-t">
        cíl: nízké emise
      </text>
      <Pop delay={0.1}>
        <Token x={40} y={58} k="coal" t="uhlí" cls="gz7-et-fossil" />
        <Token x={92} y={58} k="oil" t="ropa" cls="gz7-et-fossil" />
        <Token x={144} y={58} k="gas" t="plyn" cls="gz7-et-fossil" />
      </Pop>
      <Draw d="M178 58 H238" className="gz7-arr gz7-arr-lvl gz7-cp-arr" delay={0.3} />
      <Fade delay={0.8}>
        <Head x={256} y={58} dir={0} tone="lvl" />
      </Fade>
      <Pop delay={0.6}>
        <Token x={284} y={58} k="sun" t="slunce" cls="gz7-et-green" />
        <Token x={336} y={58} k="wind" t="vítr" cls="gz7-et-green" />
        <Token x={388} y={58} k="water" t="voda" cls="gz7-et-green" />
        <Token x={448} y={58} k="atom" t="jádro" cls="gz7-et-green" />
      </Pop>
      <Fade delay={0.9}>
        <text x={250} y={140} textAnchor="middle" className="gz7-lbl gz7-sm gz7-muted-t">
          slunce a vítr kolísají, proto přechod potřebuje:
        </text>
        <Token x={110} y={176} k="battery" t="ukládání energie" cls="gz7-paper-fill" />
        <Token x={250} y={176} k="grid" t="silnější sítě" cls="gz7-paper-fill" />
        <Token x={390} y={176} k="plug" t="elektrifikaci a úspory" cls="gz7-paper-fill" />
      </Fade>

      {/* shares */}
      <text x={W / 2} y={262} textAnchor="middle" className="gz7-lbl gz7-b">
        výroba elektřiny 2024 (zaokrouhleno, %)
      </text>
      {BARS.map((b, i) => {
        const y = 286 + i * 58;
        let acc = 0;
        return (
          <g key={b.name}>
            <text x={BX - 10} y={y + 21} textAnchor="end" className="gz7-lbl gz7-b">
              {b.name}
            </text>
            {b.v.map((v, k) => {
              const x = BX + (acc / 100) * BW;
              acc += v;
              const w = (v / 100) * BW;
              return (
                <g key={k}>
                  <motion.rect
                    x={x}
                    y={y}
                    height={30}
                    className={`${CATS[k].cls} gz7-o gz7-thin`}
                    variants={{
                      hidden: { width: 0 },
                      show: { width: w, transition: { duration: 0.6, delay: 1 + i * 0.3 + k * 0.12, ease: ease.out } },
                    }}
                  />
                  <Fade delay={1.6 + i * 0.3}>
                    <text
                      x={x + w / 2}
                      y={v >= 8 ? y + 20 : y - 6}
                      textAnchor="middle"
                      className={`gz7-eq ${v >= 8 && k === 0 ? "gz7-inv-t" : ""}`}
                    >
                      {v}
                    </text>
                  </Fade>
                </g>
              );
            })}
          </g>
        );
      })}
      {/* legend */}
      {CATS.map((c, k) => {
        const x = k % 2 === 0 ? 20 : 180;
        const y = 410 + Math.floor(k / 2) * 26;
        return (
          <g key={c.k}>
            <rect x={x} y={y - 12} width={16} height={16} rx={3} className={`${c.cls} gz7-o gz7-thin`} />
            <text x={x + 22} y={y + 1} className="gz7-lbl gz7-sm">
              {c.t}
            </text>
          </g>
        );
      })}
      <text x={W - 4} y={H - 4} textAnchor="end" className="gz7-src">
        Ember 2025 (svět), ENTSO-E / Energostat (Česko)
      </text>
    </Figure>
  );
}
