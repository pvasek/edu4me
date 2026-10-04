import type { ReactNode } from "react";
import { Draw, DrawArrow, Fade, Figure, Lbl, Liquid, Pop, f1, pat, useClock, useFig } from "./kit";

const LABEL =
  "Potometr. Uříznutý olistěný výhon je vzduchotěsně zasazený gumovou zátkou do trubice plné vody. Trubice pokračuje vodorovnou kapilárou se stupnicí, jejíž konec je ponořený v kádince s vodou. Jak listy odpařují vodu, výhon nasává vodu z kapiláry a vzduchová bublina v ní se posouvá směrem k výhonu. Z posunu bubliny za určitý čas se spočítá objem přijaté vody. Nádržka s kohoutkem vrací bublinu na začátek stupnice. Bublina se posouvá rychleji na světle, v teple, ve větru a v suchém vzduchu.";

const W = 520;
const H = 450;
const SX = 130; // shoot / tube axis
const CY = 300; // capillary axis
const X0 = 448; // bubble start
const MOVE = 64; // bubble travel (px) during the replayable run
const MM = 5; // px per millimetre on the scale

function leaf(x: number, y: number, ang: number, len: number, w: number) {
  const r = (ang * Math.PI) / 180;
  const ux = Math.cos(r);
  const uy = Math.sin(r);
  const nx = -uy;
  const ny = ux;
  const tx = x + ux * len;
  const ty = y + uy * len;
  const mx = x + ux * len * 0.45;
  const my = y + uy * len * 0.45;
  return {
    blade: `M${f1(x)} ${f1(y)} Q${f1(mx + nx * w)} ${f1(my + ny * w)} ${f1(tx)} ${f1(ty)} Q${f1(mx - nx * w)} ${f1(my - ny * w)} ${f1(x)} ${f1(y)}Z`,
    rib: `M${f1(x)} ${f1(y)} L${f1(x + ux * len * 0.92)} ${f1(y + uy * len * 0.92)}`,
    tip: [tx, ty] as [number, number],
  };
}

const LEAVES = [
  { y: 70, ang: -150, len: 52 },
  { y: 92, ang: -32, len: 56 },
  { y: 128, ang: -158, len: 60 },
  { y: 150, ang: -22, len: 60 },
  { y: 186, ang: -168, len: 54 },
];

function Shoot() {
  const { id } = useFig();
  return (
    <g>
      <path d={`M${SX} 222 C${SX - 2} 160 ${SX + 3} 100 ${SX} 46`} className="bz8-stemline" />
      {LEAVES.map((l, i) => {
        const L = leaf(SX, l.y, l.ang, l.len, 15);
        return (
          <g key={i}>
            <path d={L.blade} className="bz8-leaf" />
            <path d={L.blade} fill={pat(id, "d")} opacity={0.4} />
            <path d={L.blade} className="bz8-o bz8-thin" />
            <path d={L.rib} className="bz8-o bz8-thin" />
          </g>
        );
      })}
      {/* top bud */}
      <path d={`M${SX} 46 q-7 -10 0 -20 q7 10 0 20Z`} className="bz8-leaf bz8-o bz8-thin" />
    </g>
  );
}

/** water vapour leaving the leaves */
function Vapour() {
  const tips = LEAVES.map((l) => leaf(SX, l.y, l.ang, l.len, 15).tip);
  return (
    <g>
      {tips.map(([x, y], i) => {
        const dir = x < SX ? -1 : 1;
        let d = `M${f1(x + dir * 4)} ${f1(y - 4)}`;
        for (let k = 1; k <= 4; k++) d += ` q${dir * 3} ${-3} ${dir * 1} ${-7}`;
        return <DrawArrow key={i} d={d} tone="blue" delay={0.3 + i * 0.12} />;
      })}
    </g>
  );
}

function Row({ y, icon, text }: { y: number; icon: ReactNode; text: string }) {
  return (
    <g>
      <g transform={`translate(330 ${y - 5})`}>{icon}</g>
      <text x={350} y={y} className="bz8-lbl bz8-sm">
        {text}
      </text>
    </g>
  );
}

const SUN = (
  <g>
    <circle r={6} className="bz8-sun bz8-o bz8-thin" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return (
        <path
          key={i}
          d={`M${f1(Math.cos(a) * 8.5)} ${f1(Math.sin(a) * 8.5)} L${f1(Math.cos(a) * 12)} ${f1(Math.sin(a) * 12)}`}
          className="bz8-o bz8-thin"
        />
      );
    })}
  </g>
);
const THERMO = (
  <g>
    <path d="M-3 4 V-10 a3 3 0 0 1 6 0 V4" className="bz8-o bz8-thin bz8-fill" />
    <circle cy={7} r={5} className="bz8-red-fill bz8-o bz8-thin" />
    <path d="M0 6 V-5" className="bz8-thermo-line" />
  </g>
);
const WIND = (
  <g>
    <path d="M-11 -5 H5 a4 4 0 1 0 -4 -4" className="bz8-o bz8-thin" />
    <path d="M-11 1 H9" className="bz8-o bz8-thin" />
    <path d="M-11 7 H3 a4 4 0 1 1 -4 4" className="bz8-o bz8-thin" />
  </g>
);
const DRY = (
  <g>
    <path d="M0 -11 C6 -3 8 1 8 5 a8 8 0 0 1 -16 0 C-8 1 -6 -3 0 -11Z" className="bz8-o bz8-thin bz8-fill" />
    <path d="M-10 11 L10 -9" className="bz8-o" style={{ stroke: "var(--bad)" }} />
  </g>
);

function Plate() {
  const { id } = useFig();
  const t = useClock(2.4);
  const k = t / 2.4;
  const bx = X0 - MOVE * (1 - (1 - k) * (1 - k));
  const done = k >= 0.999;
  return (
    <>
      {/* shoot with leaves */}
      <Pop>
        <Shoot />
      </Pop>
      <Vapour />
      <Fade delay={1}>
        <text x={SX + 46} y={34} className="bz8-lbl bz8-sm bz8-blue-t">
          vodní pára
        </text>
      </Fade>
      <Lbl x={SX} y={16} anchor="middle">
        olistěný výhon
      </Lbl>

      {/* glass: rubber bung, vertical tube, capillary, beaker */}
      <path d={`M${SX - 12} 218 H${SX + 12} L${SX + 9} 240 H${SX - 9}Z`} className="bz8-rubber bz8-o" />
      <Liquid d={`M${SX - 7} 240 V${CY - 3} H${470} V${CY + 3} H${SX + 7} V240Z`} color="var(--blue)" opacity={0.28} />
      <path
        d={`M${SX - 8} 240 V${CY + 8} Q${SX - 8} ${CY + 4} ${SX} ${CY + 4} H474 Q479 ${CY + 4} 479 ${CY + 10} V392 M${SX + 8} 240 V${CY - 4} H474 Q485 ${CY - 4} 485 ${CY + 10} V392`}
        className="bz8-o bz8-glass-line"
      />
      <path d={`M${SX - 8} ${CY + 8} V${CY + 4}`} className="bz8-o" />
      {/* reservoir with tap */}
      <Liquid d="M201 182 H229 V214 H217 V296 H213 V214 H201Z" color="var(--blue)" opacity={0.28} />
      <path d="M198 160 V214 Q198 218 202 218 H212 V297 M232 160 V214 Q232 218 228 218 H218 V297" className="bz8-o bz8-glass-line" />
      <circle cx={215} cy={250} r={7} className="bz8-fill bz8-o" />
      <path d="M205 250 H225" className="bz8-o" style={{ strokeWidth: 3 }} />
      <Lbl x={242} y={178} tx={232} ty={190} className="bz8-sm">
        nádržka
      </Lbl>
      <Lbl x={240} y={262} tx={222} ty={252} sec className="bz8-sm">
        kohoutek
      </Lbl>
      <Lbl x={18} y={236} tx={SX - 12} ty={228} className="bz8-sm">
        zátka
      </Lbl>
      <Lbl x={18} y={274} tx={SX - 8} ty={268} sec className="bz8-sm">
        voda
      </Lbl>
      {/* beaker */}
      <Liquid d="M454 360 H510 V404 Q510 410 504 410 H460 Q454 410 454 404Z" color="var(--blue)" opacity={0.28} />
      <path d="M450 334 V404 Q450 412 458 412 H506 Q514 412 514 404 V334" className="bz8-o" />
      <Lbl x={510} y={436} anchor="end" className="bz8-sm">
        kádinka s vodou
      </Lbl>

      {/* scale */}
      <path d={`M${X0 - 40 * MM} ${CY + 14} H${X0}`} className="bz8-o bz8-thin" />
      {Array.from({ length: 41 }, (_, i) => {
        const x = X0 - i * MM;
        const big = i % 10 === 0;
        const mid = i % 5 === 0;
        return (
          <path
            key={i}
            d={`M${x} ${CY + 14} v${big ? 10 : mid ? 7 : 4}`}
            className="bz8-o bz8-thin"
          />
        );
      })}
      {[0, 10, 20, 30, 40].map((n) => (
        <text key={n} x={X0 - n * MM} y={CY + 40} textAnchor="middle" className="bz8-num">
          {n}
        </text>
      ))}
      <text x={X0 - 20 * MM} y={CY + 58} textAnchor="middle" className="bz8-lbl bz8-sm bz8-muted-t">
        stupnice (mm)
      </text>

      {/* the bubble */}
      <path d={`M${X0} ${CY - 9} V${CY - 5}`} className="bz8-o bz8-thin bz8-dash" />
      <rect x={bx - 8} y={CY - 3.2} width={16} height={6.4} rx={3.2} className="bz8-bubble" />
      <Lbl x={bx + 4} y={CY - 44} tx={bx} ty={CY - 4} className="bz8-sm bz8-b" anchor="middle">
        vzduchová bublina
      </Lbl>
      {done && (
        <g>
          <path
            d={`M${X0} ${CY + 72} H${bx}`}
            className="bz8-arr bz8-arr-lvl"
            markerEnd={pat(id, "ah-lvl")}
          />
          <text x={(X0 + bx) / 2} y={CY + 90} textAnchor="middle" className="bz8-lbl bz8-sm bz8-b bz8-lvl-t">
            posun l
          </text>
        </g>
      )}
      <Draw d={`M${X0 - 120} ${CY - 12} H${X0 - 186}`} className="bz8-arr bz8-arr-blue" delay={0.2} arrow="blue" />
      <text x={X0 - 153} y={CY - 20} textAnchor="middle" className="bz8-lbl bz8-sm bz8-blue-t">
        voda k výhonu
      </text>

      {/* what speeds it up */}
      <rect x={306} y={36} width={204} height={162} rx={8} className="bz8-tag-lvl" />
      <text x={320} y={60} className="bz8-lbl bz8-b">
        Bublina jede rychleji:
      </text>
      <Row y={90} icon={SUN} text="na světle" />
      <Row y={120} icon={THERMO} text="v teple" />
      <Row y={150} icon={WIND} text="ve větru" />
      <Row y={180} icon={DRY} text="v suchém vzduchu" />
    </>
  );
}

export default function Potometer() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
