import { motion } from "motion/react";
import { ease } from "../../../ui/motion";
import { Fade, Figure, cz } from "./kit";

const LABEL =
  "Virtuální voda: kolik litrů vody se spotřebuje na výrobu běžných věcí, celosvětové průměry. Šálek kávy asi 132 litrů, 1 kg pšenice asi 1 827 litrů, bavlněné tričko asi 2 720 litrů, chytrý telefon asi 12 760 litrů a 1 kg hovězího masa asi 15 415 litrů, tedy zhruba sto plných van. Zdroj: Water Footprint Network, telefon Friends of the Earth 2015.";

const W = 480;
const H = 412;
const X0 = 70;
const X1 = 452;
const MAX = 16000;
const bx = (v: number) => X0 + (v / MAX) * (X1 - X0);

type Icon = "cup" | "wheat" | "shirt" | "phone" | "beef";
const ROWS: { t: string; v: number; icon: Icon }[] = [
  { t: "šálek kávy (125 ml)", v: 132, icon: "cup" },
  { t: "1 kg pšenice", v: 1827, icon: "wheat" },
  { t: "bavlněné tričko (250 g)", v: 2720, icon: "shirt" },
  { t: "chytrý telefon", v: 12760, icon: "phone" },
  { t: "1 kg hovězího masa", v: 15415, icon: "beef" },
];

function Ico({ k, x, y }: { k: Icon; x: number; y: number }) {
  const t = `translate(${x} ${y})`;
  switch (k) {
    case "cup":
      return (
        <g transform={t}>
          <path d="M-12 -8 h20 v10 a10 9 0 0 1 -20 0 z" className="gz7-cup gz7-o gz7-thin" />
          <path d="M8 -4 a5 5 0 0 1 0 10" className="gz7-o gz7-thin" />
          <path d="M-15 11 h26" className="gz7-o gz7-thin" />
          <path d="M-6 -12 q-3 -4 0 -8 M0 -12 q-3 -4 0 -8" className="gz7-smoke" />
        </g>
      );
    case "wheat":
      return (
        <g transform={t}>
          <path d="M0 16 V-16" className="gz7-o gz7-thin" />
          {[-12, -5, 2, 9].map((yy) => (
            <g key={yy}>
              <ellipse cx={-4} cy={yy} rx={3} ry={5.5} transform={`rotate(-30 -4 ${yy})`} className="gz7-field gz7-o gz7-thin" />
              <ellipse cx={4} cy={yy} rx={3} ry={5.5} transform={`rotate(30 4 ${yy})`} className="gz7-field gz7-o gz7-thin" />
            </g>
          ))}
        </g>
      );
    case "shirt":
      return (
        <g transform={t}>
          <path d="M-6 -14 q6 5 12 0 l10 5 -4 8 -5 -2 v17 h-14 v-17 l-5 2 -4 -8 z" className="gz7-paper-fill gz7-o gz7-thin" />
        </g>
      );
    case "phone":
      return (
        <g transform={t}>
          <rect x={-8} y={-15} width={16} height={30} rx={3} className="gz7-ink-fill gz7-o gz7-thin" />
          <rect x={-6} y={-11} width={12} height={21} rx={1} className="gz7-glass-f" />
        </g>
      );
    default:
      return (
        <g transform={t}>
          <path d="M-14 2 q-2 -12 10 -14 q14 -2 18 8 q4 10 -8 14 q-14 4 -20 -8 z" className="gz7-beef gz7-o gz7-thin" />
          <path d="M-8 4 q8 -4 16 -2" className="gz7-o gz7-thin" />
          <circle cx={6} cy={-4} r={3.2} className="gz7-paper-fill gz7-o gz7-thin" />
        </g>
      );
  }
}

export default function VirtualWater() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={620} replay>
      <text x={X0} y={22} className="gz7-lbl gz7-b">
        litrů vody na výrobu
      </text>
      {[0, 5000, 10000, 15000].map((v) => (
        <g key={v}>
          <path d={`M${bx(v)} 40 V318`} className="gz7-grid" />
          <text x={bx(v)} y={336} textAnchor="middle" className="gz7-num">
            {cz(v)}
          </text>
        </g>
      ))}
      <text x={X1} y={356} textAnchor="end" className="gz7-lbl gz7-sm">
        litrů
      </text>
      {ROWS.map((r, i) => {
        const y = 46 + i * 56;
        const end = bx(r.v);
        const inside = r.v > 8000;
        return (
          <g key={i}>
            <Ico k={r.icon} x={34} y={y + 22} />
            <text x={X0} y={y + 12} className="gz7-lbl gz7-sm">
              {r.t}
            </text>
            <motion.rect
              x={X0}
              y={y + 19}
              height={20}
              rx={3}
              className="gz7-vw-bar"
              variants={{
                hidden: { width: 0 },
                show: { width: Math.max(2, end - X0), transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: ease.out } },
              }}
            />
            <Fade delay={0.6 + i * 0.12}>
              <text
                x={inside ? end - 8 : end + 6}
                y={y + 34}
                textAnchor={inside ? "end" : "start"}
                className={`gz7-eq ${inside ? "gz7-inv-t" : ""}`}
              >
                {cz(r.v)} l
              </text>
            </Fade>
          </g>
        );
      })}
      <text x={W / 2} y={384} textAnchor="middle" className="gz7-lbl gz7-sm gz7-muted-t">
        1 kg hovězího ≈ 100 plných van (vana ≈ 150 l)
      </text>
      <text x={W - 4} y={H - 2} textAnchor="end" className="gz7-src">
        Water Footprint Network; telefon: Friends of the Earth 2015
      </text>
    </Figure>
  );
}
