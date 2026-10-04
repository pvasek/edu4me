import { Draw, Fade, Figure, Lbl, Pop, f1, pat, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Rybník v řezu od břehu do středu. Na mělkém pobřeží roste rákos a orobinec, v rákosí hnízdí rákosník a žijí tu skokani. Dál od břehu je zóna plovoucích listů s leknínem, jehož listy plavou na hladině a kořeny vězí v bahně. Ve volné vodě se vznášejí řasy, sinice a perloočky (plankton), plave tu štika a u dna kapr. Na dně leží bahno plné rozkladačů, larev pakomárů a škeblí.";

const WL = 128; // water level
const H = 340;
/** zone boundaries in the wide layout: land | reeds | floating leaves | open water | land */
const FULL = [0, 36, 206, 344, 604, 640];
const NARROW = [0, 18, 130, 214, 384, 400];

/** depth of the bottom (y) at a wide-layout x */
function bottom(x: number) {
  const pts: [number, number][] = [
    [0, WL - 10],
    [30, WL - 4],
    [44, WL + 8],
    [206, 186],
    [344, 236],
    [420, 282],
    [560, 288],
    [618, WL + 2],
    [640, WL - 10],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x <= x1) {
      const t = (x - x0) / (x1 - x0);
      // smoothstep for a soft profile
      const s = t * t * (3 - 2 * t);
      return y0 + (y1 - y0) * s;
    }
  }
  return WL;
}

function Reed({ x, top, X }: { x: number; top: number; X: (x: number) => number }) {
  const b = bottom(x);
  const px = X(x);
  return (
    <g>
      <path d={`M${f1(px)} ${f1(b)} Q${f1(px - 2)} ${f1((b + top) / 2)} ${f1(px + 3)} ${top}`} className="bz7-reed" />
      <path d={`M${f1(px + 1)} ${f1(top + 40)} q-12 4 -18 14 M${f1(px + 2)} ${f1(top + 62)} q12 2 18 12`} className="bz7-reed-leaf" />
      <path d={`M${f1(px + 3)} ${top} q-6 -8 -2 -16 q4 6 2 16 q6 -10 4 -18`} className="bz7-plume" />
    </g>
  );
}

function Cattail({ x, top, X }: { x: number; top: number; X: (x: number) => number }) {
  const b = bottom(x);
  const px = X(x);
  return (
    <g>
      <path d={`M${f1(px)} ${f1(b)} V${top}`} className="bz7-reed" />
      <rect x={px - 3.6} y={top + 8} width={7.2} height={22} rx={3.6} className="bz7-spike" />
      <path d={`M${f1(px)} ${f1(b)} Q${f1(px + 10)} ${f1(top + 60)} ${f1(px + 14)} ${top + 26}`} className="bz7-reed-leaf" />
    </g>
  );
}

function LilyPad({ x, X, flower = false }: { x: number; X: (x: number) => number; flower?: boolean }) {
  const b = bottom(x);
  const px = X(x);
  return (
    <g>
      <path d={`M${f1(px - 6)} ${f1(b - 2)} C${f1(px - 20)} ${f1((b + WL) / 2)} ${f1(px + 10)} ${f1((b + WL) / 2)} ${f1(px)} ${WL + 1}`} className="bz7-petiole" />
      <path d={`M${f1(px - 6)} ${f1(b - 2)} q-8 2 -12 6 M${f1(px - 6)} ${f1(b - 2)} q6 4 10 6`} className="bz7-petiole" />
      <path d={`M${f1(px - 18)} ${WL} A18 4 0 1 0 ${f1(px + 18)} ${WL} L${f1(px + 4)} ${WL - 1}Z`} className="bz7-pad" />
      {flower && (
        <g>
          {[-6, -3, 0, 3, 6].map((dx) => (
            <path
              key={dx}
              d={`M${f1(px + dx * 0.5)} ${WL - 2} Q${f1(px + dx * 1.6 - 2)} ${WL - 10} ${f1(px + dx * 1.2)} ${WL - 16 + Math.abs(dx)} Q${f1(px + dx * 1.6 + 2)} ${WL - 9} ${f1(px + dx * 0.5)} ${WL - 2}Z`}
              className="bz7-lily"
            />
          ))}
          <circle cx={px} cy={WL - 6} r={2} className="bz7-stamen" />
        </g>
      )}
    </g>
  );
}

/** A fish seen from the side, head to the right (or left with `flip`). */
function Fish({ x, y, len, kind, flip = false }: { x: number; y: number; len: number; kind: "carp" | "pike"; flip?: boolean }) {
  const { id } = useFig();
  const s = len / 60;
  const body =
    kind === "carp"
      ? "M-30 0 C-22 -14 4 -18 22 -8 C28 -4 30 0 30 2 C26 8 8 13 -6 10 C-16 8 -24 4 -30 0Z"
      : "M-30 0 C-20 -6 10 -7 24 -4 C29 -3 32 0 32 1 C28 3 10 6 -10 5 C-20 4 -26 2 -30 0Z";
  const tail = kind === "carp" ? "M-29 0 L-40 -9 L-37 0 L-40 9Z" : "M-29 0 L-38 -7 L-36 0 L-38 7Z";
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <path d={tail} className={kind === "carp" ? "bz7-carp" : "bz7-pike"} />
      <path d={body} className={kind === "carp" ? "bz7-carp" : "bz7-pike"} />
      <path d={body} fill={pat(id, kind === "carp" ? "x" : "d")} opacity={0.4} />
      {kind === "carp" ? (
        <path d="M-6 -15 Q2 -22 10 -14 M24 4 q4 4 2 8" className="bz7-o bz7-thin" />
      ) : (
        <path d="M-16 -4 Q-12 -10 -8 -5 M-16 4 Q-12 9 -8 5 M20 1 H31" className="bz7-o bz7-thin" />
      )}
      <circle cx={kind === "carp" ? 20 : 23} cy={-3} r={1.6} className="bz7-eye-l" />
    </g>
  );
}

/** Water flea (Daphnia) as seen under a lens: shell, eye, antennae, gut. */
function Daphnia({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <path d="M-4 -12 C8 -14 14 -2 10 8 C8 13 2 16 -2 18 L-1 12 C-8 8 -10 -4 -4 -12Z" className="bz7-daphnia" />
      <path d="M-6 -8 C-12 -14 -16 -16 -20 -14 M-12 -12 l-4 -8 M-16 -14 l-6 -4" className="bz7-o bz7-thin" />
      <path d="M-2 -6 C4 -4 4 6 0 10" className="bz7-gut" />
      <circle cx={-5} cy={-8} r={2} className="bz7-eye-l" />
      <path d="M3 4 a2.4 2.4 0 1 0 0.01 0 M5 0 a2 2 0 1 0 0.01 0" className="bz7-egg" />
    </g>
  );
}

function Duck({ x }: { x: number }) {
  return (
    <g transform={`translate(${f1(x)} ${WL})`}>
      <path d="M-14 0 C-14 -8 -6 -10 4 -8 C6 -14 8 -18 13 -17 C17 -16 17 -12 15 -10 L20 -9 L15 -7 C14 -4 12 -2 10 0Z" className="bz7-duck" />
      <path d="M8 -17 C12 -19 16 -16 15 -10 L10 -10 C8 -12 7 -15 8 -17Z" className="bz7-duck-head" />
      <circle cx={13} cy={-14} r={0.9} className="bz7-eye" />
      <path d="M-8 -5 Q0 -9 6 -5" className="bz7-o bz7-thin" />
    </g>
  );
}

function Frog({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)})`}>
      <path d="M-9 0 C-9 -6 -2 -9 4 -7 C8 -9 10 -6 9 -3 C10 0 6 1 2 1Z" className="bz7-frog" />
      <path d="M-8 0 l-4 1 l2 -3 M2 1 l3 1" className="bz7-o bz7-thin" />
      <circle cx={6} cy={-7} r={1.4} className="bz7-eye-l" />
    </g>
  );
}

function Mussel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(-12)`}>
      <path d="M-12 0 C-10 -7 6 -9 12 -3 C14 1 6 4 -4 4 C-9 4 -12 2 -12 0Z" className="bz7-mussel" />
      <path d="M-6 -4 Q2 -6 8 -3 M-4 -1 Q3 -3 9 -1" className="bz7-o bz7-thin" />
    </g>
  );
}

function Larva({ x, y }: { x: number; y: number }) {
  return <path d={`M${f1(x)} ${f1(y)} q3 -4 6 0 t6 0 t5 -2`} className="bz7-larva" />;
}

function Dragonfly({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)})`}>
      <path d="M-2 -2 C-8 -10 -18 -10 -18 -6 C-16 -3 -8 -2 -2 -1Z M-2 1 C-8 6 -16 8 -17 5 C-15 2 -8 1 -2 0Z M2 -2 C8 -10 18 -10 18 -6 C16 -3 8 -2 2 -1Z M2 1 C8 6 16 8 17 5 C15 2 8 1 2 0Z" className="bz7-wing" />
      <path d="M0 -4 V22" className="bz7-dragon" />
      <circle cx={0} cy={-5} r={2.4} className="bz7-dragon-h" />
    </g>
  );
}

export default function PondZones() {
  const compact = useCompact(460);
  const narrow = compact.narrow;
  const W = narrow ? 400 : 640;
  const B = narrow ? NARROW : FULL;
  /** wide-layout x → this layout's x (piecewise by zone) */
  const X = (x: number) => {
    for (let i = 0; i < FULL.length - 1; i++) {
      if (x <= FULL[i + 1]) return B[i] + ((x - FULL[i]) / (FULL[i + 1] - FULL[i])) * (B[i + 1] - B[i]);
    }
    return W;
  };
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={720} compact={compact}>
      <Scene W={W} X={X} B={B} narrow={narrow} />
    </Figure>
  );
}

function Scene({ W, X, B, narrow }: { W: number; X: (x: number) => number; B: number[]; narrow: boolean }) {
  const { id } = useFig();
  const N = 64;
  const prof = Array.from({ length: N + 1 }, (_, i) => {
    const x = (i / N) * 640;
    return [X(x), bottom(x)] as const;
  });
  const bed = "M" + prof.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(" L");
  const water = `M${f1(X(30))} ${WL} ${prof
    .filter(([x, y]) => y > WL && x > X(28) && x < X(622))
    .map(([x, y]) => `L${f1(x)} ${f1(y)}`)
    .join(" ")} L${f1(X(620))} ${WL}Z`;
  const mud = `${bed} L${W} ${H} L0 ${H}Z`;
  const mudTop = "M" + prof.map(([x, y]) => `${f1(x)} ${f1(y + 16)}`).join(" L");
  const r = rng(5);
  const plankton = Array.from({ length: narrow ? 26 : 46 }, () => [
    X(350 + r() * 240),
    WL + 8 + r() * 56,
  ]);
  const zones: { a: number; b: number; lines: string[] }[] = [
    { a: B[1], b: B[2], lines: narrow ? ["pobřeží"] : ["pobřeží: rákosiny"] },
    { a: B[2], b: B[3], lines: narrow ? ["plovoucí", "listy"] : ["plovoucí listy"] },
    { a: B[3], b: B[4], lines: ["volná voda"] },
  ];
  const zoom = narrow ? { x: X(548), y: 180, r: 26 } : { x: X(540), y: 176, r: 30 };
  const L = (p: Parameters<typeof Lbl>[0]) => <Lbl {...p} className={`bz7-halo ${p.className ?? ""}`} />;
  return (
    <g>
      {/* water, bottom mud and the ground below it */}
      <path d={water} className="bz7-water" />
      <path d={water} fill={pat(id, "h")} opacity={0.35} />
      <path d={mud} className="bz7-mud" />
      <path d={`${mudTop} L${W} ${H} L0 ${H}Z`} className="bz7-sub" />
      <path d={mud} fill={pat(id, "dots")} opacity={0.5} />
      <path d={bed} className="bz7-o" />
      <path d={`M${f1(X(30))} ${WL} H${f1(X(620))}`} className="bz7-surface" />

      {/* zone dividers and headers */}
      {[FULL[2], FULL[3]].map((x) => (
        <line key={x} x1={X(x)} x2={X(x)} y1={46} y2={bottom(x)} className="bz7-storey-line" />
      ))}
      {zones.map((z, i) => (
        <Fade key={i} delay={0.1 + i * 0.15}>
          {z.lines.map((t, j) => (
            <text key={j} x={(z.a + z.b) / 2} y={20 + j * 17} textAnchor="middle" className="bz7-lbl bz7-b bz7-lvl-t">
              {t}
            </text>
          ))}
        </Fade>
      ))}

      {/* shore: reeds and cattails */}
      <Pop delay={0.2}>
        {[60, 78, 96, 112, 130, 146].filter((_, i) => !narrow || i % 2 === 0).map((x, i) => (
          <Reed key={x} x={x} top={52 + (i % 3) * 7} X={X} />
        ))}
        <Cattail x={172} top={66} X={X} />
        {!narrow && <Cattail x={188} top={78} X={X} />}
      </Pop>
      {/* floating leaves */}
      <Pop delay={0.45}>
        <LilyPad x={234} X={X} />
        <LilyPad x={272} X={X} flower />
        {!narrow && <LilyPad x={316} X={X} />}
      </Pop>
      {/* plankton and the lens */}
      <Fade delay={0.6}>
        {plankton.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 ? 1.3 : 2} className={i % 4 ? "bz7-alga" : "bz7-alga-b"} />
        ))}
      </Fade>
      <Pop delay={0.8}>
        <line x1={zoom.x - zoom.r * 0.85} y1={zoom.y - zoom.r * 0.5} x2={zoom.x - zoom.r - 18} y2={zoom.y - zoom.r + 2} className="bz7-zoom" />
        <circle cx={zoom.x} cy={zoom.y} r={zoom.r} className="bz7-lens" />
        <Daphnia x={zoom.x + 2} y={zoom.y} s={zoom.r / 22} />
        <circle cx={zoom.x - zoom.r - 20} cy={zoom.y - zoom.r + 1} r={2.2} className="bz7-alga-b" />
      </Pop>
      {/* animals */}
      <Pop delay={0.95}>
        <Fish kind="pike" x={X(430)} y={176} len={narrow ? 50 : 66} />
        <Fish kind="carp" x={X(492)} y={258} len={narrow ? 46 : 58} flip />
        <Mussel x={X(380)} y={bottom(380) + 5} />
        {[250, 290, 318].map((x) => (
          <Larva key={x} x={X(x)} y={bottom(x) + 7} />
        ))}
        {!narrow && <Duck x={X(330)} />}
        <Frog x={X(196)} y={WL - 1} />
        <g transform={`translate(${f1(X(104))} 84)`}>
          <path d="M-6 0 C-4 -4 2 -5 5 -3 L8 -3 L5 -1 C4 2 0 3 -3 3 L-9 6Z" className="bz7-bird" />
        </g>
        {!narrow && <Dragonfly x={X(300)} y={60} />}
      </Pop>

      {/* species labels */}
      <Fade delay={1.2}>
        <L x={X(36) + 2} y={112} tx={X(60) + 1} ty={92} anchor="start" className="bz7-sm">
          rákos
        </L>
        <L x={narrow ? X(206) + 6 : X(196) + 18} y={narrow ? 70 : 86} tx={X(172) + 3} ty={narrow ? 82 : 86} className="bz7-sm">
          orobinec
        </L>
        <L x={X(140)} y={WL + 30} tx={X(196)} ty={WL - 4} anchor="end" className="bz7-sm" sec>
          skokan
        </L>
        <L x={X(104)} y={narrow ? 46 : 62} tx={X(104)} ty={84} anchor="middle" className="bz7-sm" sec>
          rákosník
        </L>
        <L x={X(276)} y={narrow ? 92 : 100} tx={X(272)} ty={WL - 12} anchor="middle" className="bz7-sm">
          leknín
        </L>
        {!narrow && (
          <L x={X(352)} y={100} tx={X(336)} ty={WL - 10} anchor="start" className="bz7-sm">
            kachna
          </L>
        )}
        <L x={zoom.x} y={zoom.y + zoom.r + 18} anchor="middle" className="bz7-sm">
          perloočka
        </L>
        <L x={X(430)} y={WL + 22} tx={X(420)} ty={WL + 32} anchor="end" className="bz7-sm" sec>
          řasy a sinice
        </L>
        <L x={X(430)} y={204} anchor="middle" className="bz7-sm">
          štika
        </L>
        <L x={X(492)} y={240} anchor="middle" className="bz7-sm">
          kapr
        </L>
        <L x={X(380)} y={H - 34} tx={X(380)} ty={bottom(380) + 8} anchor="middle" className="bz7-sm">
          škeble
        </L>
        <L x={X(250)} y={H - 34} tx={X(268)} ty={bottom(270) + 8} anchor="middle" className="bz7-sm">
          larvy pakomárů
        </L>
        <text x={W - 10} y={H - 12} textAnchor="end" className="bz7-lbl bz7-b bz7-mud-t">
          dno: bahno s rozkladači
        </text>
      </Fade>
      <Draw d={`M0 ${WL - 10} L${f1(X(30))} ${WL - 4}`} className="bz7-o" delay={0} />
    </g>
  );
}
