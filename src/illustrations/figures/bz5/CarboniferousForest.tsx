import { DrawArrow, Fade, Figure, Lbl, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Bažinatý prales z karbonu, asi před 300 miliony let. Rostou v něm stromovité plavuně šupinovník a pečetník vysoké přes 30 metrů, s kmeny pokrytými jizvami po listech, přeslička kalamit s článkovaným stonkem a přesleny listů a stromová kapradina s korunou listů. Nad vodou letí obří vážka Meganeura s rozpětím křídel asi 70 centimetrů. Dole řez zemí: odumřelé rostliny padají do vody bez kyslíku a hromadí se jako rašelina, překryjí je vrstvy písku a jílu a tlakem a teplem se za miliony let mění v černé uhlí.";

const W = 400;
const H = 610;
const GROUND = 336;

/** Trunk with a clipped lattice of leaf scars. */
function Trunk({
  x,
  top,
  w0,
  w1,
  scars,
  id: key,
}: {
  x: number;
  top: number;
  w0: number;
  w1: number;
  scars: "diamond" | "rows";
  id: string;
}) {
  const { id } = useFig();
  const d = `M${x - w0 / 2} ${GROUND} C${x - w0 / 2} ${GROUND - 60} ${x - w1 / 2} ${top + 60} ${x - w1 / 2} ${top} H${x + w1 / 2} C${x + w1 / 2} ${top + 60} ${x + w0 / 2} ${GROUND - 60} ${x + w0 / 2} ${GROUND} Z`;
  const lat: string[] = [];
  if (scars === "diamond") {
    for (let k = top - 40; k < GROUND + 40; k += 9) {
      lat.push(
        `M${x - 20} ${k} L${x + 20} ${k + 22}`,
        `M${x - 20} ${k + 22} L${x + 20} ${k}`,
      );
    }
  } else {
    for (let c = -2; c <= 2; c++) {
      lat.push(`M${x + c * 4.4} ${top} V${GROUND}`);
      for (let k = top + 6; k < GROUND; k += 10)
        lat.push(`M${f1(x + c * 4.4 - 1.4)} ${k + (c % 2) * 5} h2.8`);
    }
  }
  const clip = `${id}-${key}`;
  return (
    <g>
      <clipPath id={clip}>
        <path d={d} />
      </clipPath>
      <path d={d} className="bz5-bark" />
      <g clipPath={`url(#${clip})`}>
        <path
          d={lat.join(" ")}
          className="bz5-o bz5-thin"
          style={{ opacity: 0.7 }}
        />
      </g>
      <path d={d} className="bz5-o" />
    </g>
  );
}

/** A tuft of grass-like leaves at (x, y). */
function tuft(x: number, y: number, n: number, len: number, up = true) {
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI * (0.1 + (0.8 * i) / (n - 1)) * (up ? 1 : -1);
    d.push(
      `M${x} ${y} q${f1(Math.cos(a) * len * 0.5)} ${f1(Math.sin(a) * len * 0.7)} ${f1(Math.cos(a) * len)} ${f1(Math.sin(a) * len * 0.8 + len * 0.25)}`,
    );
  }
  return d.join(" ");
}

function Lepidodendron() {
  const x = 84;
  const top = 96;
  // the crown forks again and again (dichotomous branching)
  const forks = `M${x} ${top} Q${x - 10} ${top - 20} ${x - 34} ${top - 34} M${x} ${top} Q${x + 10} ${top - 20} ${x + 34} ${top - 34}
    M${x - 34} ${top - 34} L${x - 52} ${top - 46} M${x - 34} ${top - 34} L${x - 28} ${top - 58}
    M${x + 34} ${top - 34} L${x + 28} ${top - 58} M${x + 34} ${top - 34} L${x + 54} ${top - 44}`;
  const tips: [number, number][] = [
    [x - 52, top - 46],
    [x - 28, top - 58],
    [x + 28, top - 58],
    [x + 54, top - 44],
  ];
  return (
    <g>
      <Trunk x={x} top={top} w0={30} w1={14} scars="diamond" id="lep" />
      <path d={forks} className="bz5-o bz5-twig" style={{ strokeWidth: 5 }} />
      <path
        d={tips.map(([a, b]) => tuft(a, b, 9, 18)).join(" ")}
        className="bz5-o bz5-needle"
      />
      {tips.slice(1, 3).map(([a, b]) => (
        <ellipse
          key={a}
          cx={a}
          cy={b + 10}
          rx={3}
          ry={7}
          className="bz5-o bz5-thin bz5-cone"
        />
      ))}
      {/* roots spreading in the mud */}
      <path
        d={`M${x - 15} ${GROUND} q-20 4 -34 14 M${x + 15} ${GROUND} q20 4 34 14`}
        className="bz5-o bz5-twig"
        style={{ strokeWidth: 3 }}
      />
    </g>
  );
}

function Sigillaria() {
  const x = 336;
  const top = 126;
  return (
    <g>
      <Trunk x={x} top={top} w0={30} w1={20} scars="rows" id="sig" />
      <path
        d={`M${x} ${top} Q${x - 4} ${top - 14} ${x - 16} ${top - 26} M${x} ${top} Q${x + 4} ${top - 14} ${x + 16} ${top - 26}`}
        className="bz5-o bz5-twig"
        style={{ strokeWidth: 6 }}
      />
      <path
        d={`${tuft(x - 16, top - 26, 13, 30)} ${tuft(x + 16, top - 26, 13, 30)}`}
        className="bz5-o bz5-needle"
      />
    </g>
  );
}

function Calamites() {
  const x = 164;
  const top = 150;
  const nodes: number[] = [];
  for (let y = GROUND - 22; y > top; y -= 22) nodes.push(y);
  return (
    <g>
      <path
        d={`M${x - 8} ${GROUND} V${top} H${x + 8} V${GROUND} Z`}
        className="bz5-o bz5-stem"
      />
      <path
        d={`M${x - 3} ${top} V${GROUND} M${x + 3} ${top} V${GROUND}`}
        className="bz5-o bz5-thin"
        style={{ opacity: 0.5 }}
      />
      <path
        d={nodes.map((y) => `M${x - 9} ${y} H${x + 9}`).join(" ")}
        className="bz5-o"
        style={{ strokeWidth: 2 }}
      />
      {/* whorls of narrow leaves at the upper nodes, side branches */}
      <path
        d={nodes
          .filter((y) => y < 250)
          .map(
            (y) =>
              `M${x - 8} ${y} l-22 -8 M${x - 8} ${y} l-18 6 M${x + 8} ${y} l22 -8 M${x + 8} ${y} l18 6`,
          )
          .join(" ")}
        className="bz5-o bz5-needle"
      />
      <path
        d={`M${x} ${top} V${top - 30} M${x - 10} ${top - 14} l20 0 M${x - 8} ${top - 24} l16 0`}
        className="bz5-o bz5-needle"
      />
    </g>
  );
}

function TreeFern() {
  const x = 252;
  const top = 214;
  const fronds = [-150, -125, -100, -80, -55, -30].map((deg) => {
    const a = (deg * Math.PI) / 180;
    const ex = x + Math.cos(a) * 62;
    const ey = top + Math.sin(a) * 34 + 22;
    const cx = x + Math.cos(a) * 34;
    const cy = top + Math.sin(a) * 50;
    const d = `M${x} ${top} Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`;
    // pinnae: short ticks along the frond
    const ticks: string[] = [];
    for (let t = 0.2; t < 0.95; t += 0.1) {
      const px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * cx + t * t * ex;
      const py = (1 - t) * (1 - t) * top + 2 * (1 - t) * t * cy + t * t * ey;
      ticks.push(`M${f1(px)} ${f1(py)} l-3 7 M${f1(px)} ${f1(py)} l3 7`);
    }
    return `${d} ${ticks.join(" ")}`;
  });
  return (
    <g>
      <path
        d={`M${x - 7} ${GROUND} L${x - 5} ${top} H${x + 5} L${x + 7} ${GROUND} Z`}
        className="bz5-o bz5-bark"
      />
      <path
        d={`M${x - 6} ${GROUND - 20} l12 -6 M${x - 6} ${GROUND - 50} l12 -6 M${x - 6} ${GROUND - 80} l12 -6`}
        className="bz5-o bz5-thin"
      />
      <path d={fronds.join(" ")} className="bz5-o bz5-needle" />
    </g>
  );
}

function Dragonfly({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M-4 -2 C-20 -16 -40 -16 -40 -10 C-38 -4 -18 -2 -4 0 Z M-4 2 C-20 12 -36 14 -36 8 C-34 4 -18 2 -4 2 Z"
        className="bz5-o bz5-thin bz5-wing"
      />
      <path
        d="M4 -2 C20 -16 40 -16 40 -10 C38 -4 18 -2 4 0 Z M4 2 C20 12 36 14 36 8 C34 4 18 2 4 2 Z"
        className="bz5-o bz5-thin bz5-wing"
      />
      <path d="M0 -6 V36" className="bz5-o" style={{ strokeWidth: 3.4 }} />
      <circle cx={0} cy={-8} r={4} className="bz5-o bz5-fish" />
    </g>
  );
}

function Strata() {
  const { id } = useFig();
  const R = rng(9);
  const bits: string[] = [];
  for (let i = 0; i < 26; i++) {
    const x = 10 + R() * 300;
    const y = 352 + R() * 26;
    bits.push(`M${f1(x)} ${f1(y)} l${f1(6 + R() * 10)} ${f1(-2 + R() * 4)}`);
  }
  return (
    <g>
      {/* peat: plant remains under water, no oxygen */}
      <rect x={4} y={GROUND} width={W - 8} height={48} className="bz5-peat" />
      <path d={bits.join(" ")} className="bz5-o bz5-thin" />
      {/* sand */}
      <rect x={4} y={384} width={W - 8} height={44} className="bz5-sand" />
      <rect x={4} y={384} width={W - 8} height={44} fill={pat(id, "dots")} />
      {/* clay */}
      <rect x={4} y={428} width={W - 8} height={34} className="bz5-clay" />
      <rect x={4} y={428} width={W - 8} height={34} fill={pat(id, "h")} />
      {/* pressed plant layer */}
      <rect x={4} y={462} width={W - 8} height={22} className="bz5-peat-dark" />
      <rect x={4} y={484} width={W - 8} height={40} className="bz5-sand" />
      <rect x={4} y={484} width={W - 8} height={40} fill={pat(id, "dots")} />
      {/* coal seam */}
      <rect x={4} y={524} width={W - 8} height={16} className="bz5-coal" />
      <rect
        x={4}
        y={524}
        width={W - 8}
        height={16}
        fill={pat(id, "hi")}
        opacity={0.35}
      />
      <rect x={4} y={540} width={W - 8} height={60} className="bz5-clay" />
      <rect x={4} y={540} width={W - 8} height={60} fill={pat(id, "h")} />
      <path d={`M4 ${GROUND} H${W - 4} V600 H4 Z`} className="bz5-o" />
      <path
        d={`M4 384 H${W - 4} M4 428 H${W - 4} M4 462 H${W - 4} M4 484 H${W - 4} M4 524 H${W - 4} M4 540 H${W - 4}`}
        className="bz5-o bz5-thin"
      />
    </g>
  );
}

export default function CarboniferousForest() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={520} replay>
      <Fade>
        <Strata />
      </Fade>
      <Pop delay={0.1}>
        <Lepidodendron />
      </Pop>
      <Pop delay={0.25}>
        <Sigillaria />
      </Pop>
      <Pop delay={0.4}>
        <Calamites />
      </Pop>
      <Pop delay={0.55}>
        <TreeFern />
      </Pop>
      {/* swamp water and a fallen trunk */}
      <Fade delay={0.3}>
        <path
          d={`M4 ${GROUND - 14} H${W - 4} V${GROUND} H4 Z`}
          className="bz5-water"
        />
        <path
          d={`M4 ${GROUND - 14} q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t12 0`}
          className="bz5-o bz5-thin bz5-blue-s"
        />
        <path
          d="M196 338 L300 350 L298 360 L194 348 Z"
          className="bz5-o bz5-bark"
        />
      </Fade>
      <Pop delay={0.8}>
        <Dragonfly x={250} y={56} />
      </Pop>
      <Fade delay={1}>
        <Lbl x={6} y={20} tx={60} ty={48} className="bz5-b">
          šupinovník
        </Lbl>
        <Lbl x={396} y={20} tx={344} ty={92} anchor="end" className="bz5-b">
          pečetník
        </Lbl>
        <Lbl
          x={164}
          y={88}
          tx={164}
          ty={118}
          className="bz5-sm"
          anchor="middle"
        >
          {"kalamit\n(přeslička)"}
        </Lbl>
        <Lbl
          x={244}
          y={280}
          tx={250}
          ty={262}
          className="bz5-sm bz5-halo"
          anchor="end"
        >
          {"stromová\nkapradina"}
        </Lbl>
        <text
          x={256}
          y={114}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b"
        >
          Meganeura
        </text>
        <text x={256} y={130} textAnchor="middle" className="bz5-lbl bz5-sm">
          rozpětí 70 cm
        </text>
        <text x={14} y={362} className="bz5-lbl bz5-sm bz5-b bz5-halo">
          rašelina: rostliny bez kyslíku nehnijí
        </text>
        <text x={14} y={412} className="bz5-lbl bz5-sm bz5-halo">
          písek
        </text>
        <text x={14} y={450} className="bz5-lbl bz5-sm bz5-halo">
          jíl
        </text>
        <text x={14} y={516} className="bz5-lbl bz5-sm bz5-halo">
          stlačené vrstvy
        </text>
        <text x={14} y={572} className="bz5-lbl bz5-b bz5-halo">
          černé uhlí
        </text>
        <path d="M70 562 L96 538" className="bz5-lead" />
      </Fade>
      <DrawArrow d={`M${W - 34} 392 V574`} tone="lvl" delay={1.2} />
      <Fade delay={1.4}>
        <text
          x={W - 44}
          y={470}
          textAnchor="end"
          className="bz5-lbl bz5-sm bz5-b bz5-lvl-t bz5-halo"
        >
          tlak a teplo,
        </text>
        <text
          x={W - 44}
          y={488}
          textAnchor="end"
          className="bz5-lbl bz5-sm bz5-b bz5-lvl-t bz5-halo"
        >
          miliony let
        </text>
      </Fade>
    </Figure>
  );
}
