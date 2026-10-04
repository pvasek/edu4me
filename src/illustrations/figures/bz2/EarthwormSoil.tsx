import {
  Draw,
  Fade,
  Frame,
  Lbl,
  Plates,
  Pop,
  pat,
  useFig,
  type P2,
} from "./kit";

const LABEL =
  "Žížala obecná v řezu půdou. Nahoře je vrstva opadaného listí, pod ní tmavý humus a světlejší minerální půda. Žížala si hloubí svislé chodbičky, které půdu provzdušňují a odvádějí vodu. Za noci vtahuje listy do chodbičky a požírá je spolu se zeminou; na povrchu u ústí chodbičky nechává hromádky trusu, ze kterých vzniká humus. Tělo je složené z více než sta článků se ztluštělým opaskem. Výřez ukazuje články zblízka: na každém jsou čtyři páry drobných štětinek, kterými se žížala opírá o stěny chodbičky.";

const W = 360;
const H = 340;

/** Points of a cubic Bézier. */
function cubic(p0: P2, p1: P2, p2: P2, p3: P2, n: number): P2[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  });
}

/** A segmented worm along a cubic (head at p0). */
function Worm({
  p,
  w = 11,
  rings = 30,
  clit = [0.22, 0.32],
}: {
  p: [P2, P2, P2, P2];
  w?: number;
  rings?: number;
  clit?: [number, number];
}) {
  const d = `M${p[0].join(" ")} C${p[1].join(" ")} ${p[2].join(" ")} ${p[3].join(" ")}`;
  const pts = cubic(p[0], p[1], p[2], p[3], rings);
  const c = cubic(p[0], p[1], p[2], p[3], 60).filter(
    (_, i) => i / 60 >= clit[0] && i / 60 <= clit[1],
  );
  return (
    <g>
      <Draw d={d} className="bz2-o" style={{ strokeWidth: w + 3 }} />
      <Draw d={d} className="bz2-wormbody" style={{ strokeWidth: w }} />
      <Draw
        d={`M${c.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L")}`}
        className="bz2-wormclit"
        style={{ strokeWidth: w + 1 }}
      />
      <Fade delay={0.8}>
        {pts.slice(1, -1).map((q, i) => {
          const a = pts[i];
          const b = pts[i + 2];
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const L = Math.hypot(dx, dy) || 1;
          const nx = (-dy / L) * (w / 2);
          const ny = (dx / L) * (w / 2);
          return (
            <line
              key={i}
              x1={q[0] - nx}
              y1={q[1] - ny}
              x2={q[0] + nx}
              y2={q[1] + ny}
              className="bz2-o bz2-hair"
            />
          );
        })}
      </Fade>
    </g>
  );
}

function Soil() {
  const { id } = useFig();
  const burrows = [
    "M96 74 Q90 130 104 180 Q118 236 100 300",
    "M250 74 Q262 140 244 200 Q232 250 256 318",
  ];
  return (
    <Frame w={W} h={H}>
      {/* layers */}
      <rect x={6} y={74} width={W - 12} height={86} className="bz2-soil2" />
      <rect x={6} y={74} width={W - 12} height={86} fill={pat(id, "soil")} />
      <rect x={6} y={160} width={W - 12} height={172} className="bz2-soil" />
      <rect x={6} y={160} width={W - 12} height={172} fill={pat(id, "dots")} />
      <path d="M6 160 Q90 152 180 162 Q270 170 354 158" className="bz2-o bz2-thin bz2-dash" />
      {/* stones */}
      {[
        [40, 220, 10],
        [180, 290, 14],
        [310, 240, 9],
        [150, 196, 7],
        [320, 300, 12],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} className="bz2-o bz2-thin bz2-fill3" />
      ))}
      {/* roots */}
      <path d="M190 74 Q186 110 196 140 M190 100 Q176 120 170 146 M198 92 Q214 110 212 130" className="bz2-o bz2-thin" />
      {/* burrows */}
      {burrows.map((d) => (
        <g key={d}>
          <path d={d} className="bz2-o" style={{ strokeWidth: 19 }} />
          <path d={d} className="bz2-burrow" style={{ strokeWidth: 16 }} />
        </g>
      ))}
      {/* surface: grass and leaf litter */}
      <rect x={6} y={66} width={W - 12} height={9} className="bz2-o bz2-leaf2" />
      {[20, 34, 150, 170, 206, 300, 320, 338].map((x, i) => (
        <path key={i} d={`M${x} 66 l-4 -16 M${x} 66 l2 -20 M${x} 66 l7 -14`} className="bz2-o bz2-thin" />
      ))}
      {/* castings at the burrow mouth */}
      <g transform="translate(258 66) scale(1.7) translate(-258 -66)">
      <path d="M256 66 q-12 0 -10 -8 q-6 -8 6 -10 q2 -9 12 -5 q10 -2 10 7 q8 6 -2 12 q-6 6 -16 4Z" className="bz2-o bz2-soil2" />
      <path d="M248 58 q8 -3 16 0 M252 50 q6 -3 12 0" className="bz2-o bz2-thin" />
      </g>
      {/* a leaf pulled into the left burrow */}
      <Pop delay={0.9}>
        <path d="M96 76 Q78 50 58 44 Q76 36 92 46 Q104 58 100 76Z" className="bz2-o bz2-leaf" />
        <path d="M98 76 Q86 56 64 44" className="bz2-o bz2-thin" />
      </Pop>
      {/* worms */}
      <Worm p={[[100, 92], [92, 140], [116, 196], [104, 262]]} rings={34} clit={[0.18, 0.28]} />
      <Worm p={[[246, 300], [228, 262], [236, 222], [254, 160]]} w={10} rings={28} clit={[0.6, 0.7]} />
      {/* labels */}
      <Fade delay={0.4}>
        <text x={W - 10} y={92} textAnchor="end" className="bz2-lbl bz2-b bz2-halo">humus</text>
        <text x={W - 10} y={326} textAnchor="end" className="bz2-lbl bz2-b">minerální půda</text>
      </Fade>
      <Lbl x={8} y={22} tx={70} ty={50} className="bz2-sm">list do chodbičky</Lbl>
      <Lbl x={200} y={22} tx={250} ty={44} className="bz2-sm">trus (exkrementy)</Lbl>
      <Lbl x={130} y={246} tx={110} ty={232} className="bz2-b">chodbička</Lbl>
      <Lbl x={130} y={130} tx={104} ty={118} className="bz2-sm bz2-halo">opasek</Lbl>
    </Frame>
  );
}

function Bristles() {
  const { id } = useFig();
  // three segments in side view, 4 pairs of bristles each (2 visible pairs per side)
  return (
    <Frame w={260} h={190} title="články a štětinky">
      <rect x={20} y={56} width={220} height={78} rx={30} className="bz2-o bz2-wormbody-f" />
      <rect x={20} y={56} width={220} height={78} rx={30} fill={pat(id, "b")} opacity={0.6} />
      {[76, 130, 184].map((x) => (
        <line key={x} x1={x} y1={58} x2={x} y2={132} className="bz2-o" />
      ))}
      {[48, 103, 157, 211].map((x, i) => (
        <Pop key={x} delay={0.3 + i * 0.1}>
          {[
            [-5, 134, 10],
            [5, 134, 10],
            [-5, 56, -10],
            [5, 56, -10],
          ].map(([dx, y, dy], k) => (
            <line
              key={k}
              x1={x + dx}
              y1={y}
              x2={x + dx - 4}
              y2={y + dy}
              className="bz2-o"
              style={{ strokeWidth: 1.8 }}
            />
          ))}
        </Pop>
      ))}
      <Lbl x={130} y={176} tx={108} ty={144} className="bz2-b">štětinky</Lbl>
      <Lbl x={150} y={30} tx={130} ty={58} className="bz2-sm">hranice článku</Lbl>
      <Lbl x={10} y={30} className="bz2-sm bz2-muted-t" sec>← hlava</Lbl>
    </Frame>
  );
}

export default function EarthwormSoil() {
  return (
    <Plates
      label={LABEL}
      level={4}
      max={720}
      cols="1.35fr 1fr"
      replay
      note="Chodby provzdušňují půdu, trus ji hnojí – žížaly vyrábějí humus."
    >
      <Soil />
      <Bristles />
    </Plates>
  );
}
