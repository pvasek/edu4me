import { Draw, Fade, Figure, Pop, f1, pat, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Řez smíšeným lesem po patrech. Stromové patro nad 5 metrů: dub, buk a jedle, strakapoud a veverka, dostává všechno světlo. Keřové patro od 1 do 5 metrů: líska, bez černý a hloh, pěnice a srnec, dopadá sem asi pětina světla. Bylinné patro do 1 metru: sasanka hajní, konvalinka a kapradiny, mravenci a plži, jen asi 5 % světla. Mechové patro při zemi: mechy, lišejníky a houby, asi 1 až 2 % světla. Pod ním leží opad a půda se žížalami, chvostoskoky a houbami, které rozkládají listí.";

// heights of the storeys (not to scale: the tree storey is squeezed)
const TOP = 12;
const Y_SHRUB = 178; // top of the shrub storey (5 m)
const Y_HERB = 256; // 1 m
const Y_MOSS = 334; // a few cm
const G = 394; // ground
const H = 462;

type Row = { y0: number; y1: number; head: string; lines: string[]; light: string };
const ROWS: Row[] = [
  { y0: TOP, y1: Y_SHRUB, head: "stromové patro · nad 5 m", lines: ["dub, buk, jedle", "strakapoud, veverka"], light: "světlo: 100 %" },
  { y0: Y_SHRUB, y1: Y_HERB, head: "keřové patro · 1–5 m", lines: ["líska, bez černý, hloh", "pěnice, srnec"], light: "světlo: asi 20 %" },
  { y0: Y_HERB, y1: Y_MOSS, head: "bylinné patro · do 1 m", lines: ["sasanka, konvalinka, kapradí", "mravenci, plži"], light: "světlo: asi 5 %" },
  { y0: Y_MOSS, y1: G, head: "mechové patro", lines: ["mechy, lišejníky, houby"], light: "světlo: 1–2 %" },
  { y0: G, y1: H - 6, head: "opad a půda", lines: ["žížaly, chvostoskoci, houby:", "rozkládají listí na humus"], light: "" },
];

/** A lobed crown: bumps around an ellipse (quadratic arcs pushed outwards). */
function cloud(cx: number, cy: number, rx: number, ry: number, n: number, seed: number) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 0.9 + r() * 0.12;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k, a] as const;
  });
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    const am = (p[2] + (i === n - 1 ? q[2] + Math.PI * 2 : q[2])) / 2;
    const bump = 1.28;
    d += ` Q${f1(cx + Math.cos(am) * rx * bump)} ${f1(cy + Math.sin(am) * ry * bump)} ${f1(q[0])} ${f1(q[1])}`;
  }
  return d + "Z";
}

function Oak({ x, w }: { x: number; w: number }) {
  const { id } = useFig();
  const crown = cloud(x, 82, w / 2, 62, 11, 3);
  return (
    <g>
      <path
        d={`M${x - 9} ${G} C${x - 7} ${G - 80} ${x - 6} ${G - 170} ${x - 3} 120 L${x + 3} 120 C${x + 6} ${G - 170} ${x + 7} ${G - 80} ${x + 9} ${G}Z`}
        className="bz7-trunk"
      />
      <path d={`M${x - 3} 150 Q${x - w * 0.22} 130 ${x - w * 0.3} 104 M${x + 3} 140 Q${x + w * 0.2} 124 ${x + w * 0.28} 100`} className="bz7-branch" />
      <path d={crown} className="bz7-crown" />
      <path d={crown} fill={pat(id, "d")} opacity={0.45} />
      <path d={`M${x - 4} ${G - 160} q2 -6 0 -12 M${x + 3} ${G - 100} q-2 -6 0 -12 M${x - 3} ${G - 60} q2 -6 0 -12`} className="bz7-bark" />
    </g>
  );
}

function Fir({ x, w }: { x: number; w: number }) {
  const { id } = useFig();
  const tiers = [0, 1, 2, 3, 4];
  return (
    <g>
      <path d={`M${x - 6} ${G} L${x - 2.5} 30 H${x + 2.5} L${x + 6} ${G}Z`} className="bz7-trunk" />
      {tiers.map((t) => {
        const y0 = 22 + t * 30;
        const hw = (w / 2) * (0.35 + t * 0.16);
        const d = `M${x} ${y0} L${f1(x + hw)} ${y0 + 46} Q${x} ${y0 + 38} ${f1(x - hw)} ${y0 + 46}Z`;
        return (
          <g key={t}>
            <path d={d} className="bz7-needle" />
            <path d={d} fill={pat(id, "b")} opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
}

function Shrub({ x, w, flowers = false }: { x: number; w: number; flowers?: boolean }) {
  const { id } = useFig();
  const crown = cloud(x, 214, w / 2, 28, 8, Math.round(x));
  return (
    <g>
      <path
        d={`M${x} ${G} Q${x - 4} 300 ${x - w * 0.25} 240 M${x} ${G} Q${x + 2} 300 ${x + 2} 230 M${x} ${G} Q${x + 6} 300 ${x + w * 0.28} 240`}
        className="bz7-stem"
      />
      <path d={crown} className="bz7-bush" />
      <path d={crown} fill={pat(id, "d")} opacity={0.4} />
      {flowers &&
        [-0.25, 0.05, 0.3].map((k, i) => (
          <g key={i}>
            {[-3, 0, 3].map((dx) => (
              <circle key={dx} cx={x + k * w + dx} cy={202 + i * 6 + Math.abs(dx)} r={1.9} className="bz7-umbel" />
            ))}
          </g>
        ))}
    </g>
  );
}

function Anemone({ x, h }: { x: number; h: number }) {
  const y = G - h;
  return (
    <g>
      <path d={`M${x} ${G} Q${x - 2} ${y + 20} ${x} ${y}`} className="bz7-herb-s" />
      <path d={`M${x - 9} ${y + 16} L${x} ${y + 12} L${x + 9} ${y + 16}`} className="bz7-herb-s" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <ellipse key={i} cx={x + Math.cos(a) * 4.2} cy={y + Math.sin(a) * 4.2} rx={3.4} ry={2.2} transform={`rotate(${f1((a * 180) / Math.PI)} ${f1(x + Math.cos(a) * 4.2)} ${f1(y + Math.sin(a) * 4.2)})`} className="bz7-petal" />;
      })}
      <circle cx={x} cy={y} r={1.8} className="bz7-stamen" />
    </g>
  );
}

function Lily({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} ${G} C${x - 10} ${G - 20} ${x - 12} ${G - 42} ${x - 4} ${G - 58} C${x} ${G - 40} ${x + 2} ${G - 20} ${x} ${G}Z`} className="bz7-herb-l" />
      <path d={`M${x + 2} ${G} Q${x + 4} ${G - 40} ${x + 12} ${G - 56}`} className="bz7-herb-s" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x + 5 + i * 2} ${G - 32 - i * 6} a2.6 2.6 0 1 0 0.01 0`} className="bz7-bell" />
      ))}
    </g>
  );
}

function Fern({ x, flip = false }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  const leaflets = Array.from({ length: 8 }, (_, i) => {
    const t = 0.18 + i * 0.1;
    const px = x + s * 34 * t * t * 1.4;
    const py = G - 80 * t + 20 * t * t;
    const l = 9 * (1 - t * 0.7);
    return `M${f1(px)} ${f1(py)} l${f1(-l * 0.7)} ${f1(-l * 0.6)} M${f1(px)} ${f1(py)} l${f1(l * 0.6)} ${f1(-l * 0.7)}`;
  }).join(" ");
  return (
    <g>
      <path d={`M${x} ${G} Q${x + s * 4} ${G - 70} ${x + s * 40} ${G - 66}`} className="bz7-herb-s" />
      <path d={leaflets} className="bz7-frond" />
    </g>
  );
}

function Moss({ x, w }: { x: number; w: number }) {
  const n = Math.max(3, Math.round(w / 9));
  let d = `M${x} ${G}`;
  for (let i = 0; i < n; i++) {
    const x0 = x + (i * w) / n;
    const x1 = x + ((i + 1) * w) / n;
    d += ` Q${f1((x0 + x1) / 2)} ${G - 13 - (i % 2) * 5} ${f1(x1)} ${G}`;
  }
  return (
    <g>
      <path d={d + "Z"} className="bz7-moss" />
      <path d={Array.from({ length: n }, (_, i) => `M${f1(x + ((i + 0.5) * w) / n)} ${G - 2} v-7`).join(" ")} className="bz7-moss-t" />
    </g>
  );
}

function Mushroom({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 2.5} ${G} V${G - 10} H${x + 2.5} V${G}Z`} className="bz7-o bz7-thin bz7-fill" />
      <path d={`M${x - 9} ${G - 9} Q${x} ${G - 26} ${x + 9} ${G - 9}Z`} className="bz7-cap" />
    </g>
  );
}

function Woodpecker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)})`}>
      <path d="M0 -10 C-6 -8 -7 4 -4 10 L-7 18 L-1 12 C3 10 5 0 4 -6 C4 -10 2 -12 0 -10Z" className="bz7-wp" />
      <path d="M2 -9 L8 -8 L2 -6.5" className="bz7-o bz7-thin" />
      <path d="M-1 -12 C1 -13.5 3 -12 3 -10 L0 -10Z" className="bz7-wp-red" />
      <path d="M-4 2 h5 M-4 5 h5" className="bz7-wp-bar" />
      <circle cx={1} cy={-8.5} r={0.9} className="bz7-eye" />
    </g>
  );
}

function SmallBird({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)})`}>
      <path d="M-9 1 C-6 -4 0 -6 5 -4 C7 -7 10 -6 11 -4 L14 -3.5 L11 -2.5 C10 1 6 4 0 4 C-3 4 -6 3 -7 3 L-12 5Z" className="bz7-bird" />
      <circle cx={8} cy={-4} r={0.9} className="bz7-eye-l" />
    </g>
  );
}

function Snail({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 8} ${G - 1} H${x + 8} Q${x + 11} ${G - 1} ${x + 11} ${G - 5} M${x + 10} ${G - 5} l2 -4 M${x + 10} ${G - 5} l-1 -4`} className="bz7-o bz7-thin" />
      <circle cx={x} cy={G - 7} r={6} className="bz7-shell" />
      <path d={`M${x} ${G - 7} m2 0 a2 2 0 1 0 -2 2 a4 4 0 1 0 4 -4`} className="bz7-o bz7-thin" />
    </g>
  );
}

export default function ForestStoreys() {
  const compact = useCompact(460);
  const narrow = compact.narrow;
  const W = narrow ? 390 : 640;
  const DW = narrow ? 176 : 370; // drawing width
  const TX = DW + 14; // text column
  const k = DW / 370;
  const X = (x: number) => x * k; // horizontal positions in the drawing
  const rays: [number, number][] = narrow
    ? [[16, 60], [36, 40], [70, 40], [104, 300], [114, 230], [128, 60], [150, 120], [168, 386]]
    : [[24, 70], [52, 40], [84, 30], [118, 40], [150, 60], [214, 330], [226, 238], [244, 120], [262, 60], [300, 150], [334, 386], [360, 300]];
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={720} compact={compact}>
      <SoilAndBands W={W} DW={DW} />
      {/* storey rows (text) */}
      {ROWS.map((row, i) => {
        const lines = [row.head, ...row.lines, ...(row.light ? [row.light] : [])];
        const lh = 17;
        const y0 = (row.y0 + row.y1) / 2 - ((lines.length - 1) * lh) / 2 + 5;
        return (
          <Fade key={i} delay={0.3 + i * 0.22}>
            {lines.map((t, j) => (
              <text
                key={j}
                x={TX}
                y={y0 + j * lh}
                className={
                  j === 0
                    ? "bz7-lbl bz7-b bz7-lvl-t"
                    : row.light && j === lines.length - 1
                      ? "bz7-eq bz7-eq-sm bz7-lux-t"
                      : "bz7-lbl bz7-sm"
                }
              >
                {t}
              </text>
            ))}
          </Fade>
        );
      })}
      {/* light rays: most are caught by the crowns, few reach the floor */}
      {rays.map(([x, stop], i) => (
        <Draw key={i} d={`M${x} ${TOP - 6} V${stop}`} className="bz7-ray" delay={1.1 + (i % 4) * 0.1} />
      ))}
      {/* plants: trees first (back), then shrubs, herbs, moss */}
      <Pop delay={0}>
        <Oak x={X(110)} w={X(190)} />
      </Pop>
      <Pop delay={0.15}>
        <Fir x={X(292)} w={X(110)} />
      </Pop>
      <Pop delay={0.4}>
        <Shrub x={X(200)} w={X(110)} />
        <Shrub x={X(42)} w={X(76)} flowers />
      </Pop>
      <Pop delay={0.65}>
        <Fern x={X(160)} />
        {!narrow && <Fern x={X(345)} flip />}
        <Anemone x={X(60)} h={76} />
        <Anemone x={X(78)} h={66} />
        <Anemone x={X(250)} h={72} />
        <Lily x={X(325)} />
      </Pop>
      <Pop delay={0.85}>
        <Moss x={X(4)} w={X(46)} />
        <Moss x={X(212)} w={X(40)} />
        <Mushroom x={X(272)} />
        <Snail x={X(132)} />
      </Pop>
      <Pop delay={1}>
        <Woodpecker x={X(110) - 13} y={170} />
        <SmallBird x={X(200) + 6} y={222} />
      </Pop>
    </Figure>
  );
}

function SoilAndBands({ W, DW }: { W: number; DW: number }) {
  const { id } = useFig();
  const worm = `M${f1(DW * 0.55)} ${G + 40} q8 -8 16 0 t16 0 t14 -4`;
  return (
    <g>
      {ROWS.slice(0, 4).map((row, i) => (
        <rect key={i} x={0} y={row.y0} width={W} height={row.y1 - row.y0} className={i % 2 ? "bz7-band-b" : "bz7-band-a"} />
      ))}
      {[Y_SHRUB, Y_HERB, Y_MOSS].map((y) => (
        <line key={y} x1={0} x2={W} y1={y} y2={y} className="bz7-storey-line" />
      ))}
      {/* litter and soil */}
      <rect x={DW + 6} y={G} width={W - DW - 6} height={H - 6 - G} className="bz7-band-a" />
      <rect x={0} y={G} width={DW + 6} height={10} className="bz7-litter" />
      <rect x={0} y={G + 10} width={DW + 6} height={H - 6 - G - 10} className="bz7-soil" />
      <rect x={0} y={G + 10} width={DW + 6} height={H - 6 - G - 10} fill={pat(id, "dots")} opacity={0.6} />
      <path
        d={Array.from({ length: Math.round(DW / 14) }, (_, i) => `M${4 + i * 14} ${G + 4} q4 -3 9 0`).join(" ")}
        className="bz7-leafbits"
      />
      <path d={`M${f1(DW * 0.3)} ${G + 6} q-10 20 -26 34 M${f1(DW * 0.3)} ${G + 8} q6 18 18 30 M${f1(DW * 0.79)} ${G + 6} q-6 20 -18 30 M${f1(DW * 0.79)} ${G + 6} q10 16 22 22`} className="bz7-rootline" />
      <path d={worm} className="bz7-worm" />
      <path d={`M0 ${G} H${W}`} className="bz7-o" />
    </g>
  );
}
