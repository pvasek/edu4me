import { Arrow, Draw, Fade, Figure, Lbl, Pop, pat, smooth, useFig, type P2 } from "./kit";

const LABEL =
  "Transport látek v rostlině. Xylémem (modře) stoupá voda s minerálními látkami od kořenových vlásků kořenem a stonkem do listů; z listů se průduchy vypařuje (transpirace) a výpar táhne souvislý sloupec vody vzhůru, protože molekuly vody drží při sobě (koheze). Floémem (oranžově) putují cukry, hlavně sacharóza, ze zdroje – listu, kde vznikají fotosyntézou – do spotřebičů: do plodu, rostoucího vrcholu a do kořene, tedy nahoru i dolů. Detail cévního svazku: céva xylému je trubice z mrtvých buněk se ztlustěním z ligninu; floém tvoří živé sítkovice se sítkovými deskami a průvodní buňky.";

const W = 500;
const H = 560;
const SX = 156; // stem axis
const SOIL = 404;

function Leaf({ base, tip, w, flip = false }: { base: P2; tip: P2; w: number; flip?: boolean }) {
  const { id } = useFig();
  const [bx, by] = base;
  const [tx, ty] = tip;
  const mx = (bx + tx) / 2;
  const my = (by + ty) / 2;
  const nx = -(ty - by);
  const ny = tx - bx;
  const L = Math.hypot(nx, ny);
  const k = (w / L) * (flip ? -1 : 1);
  const d = `M${bx} ${by} Q${mx + nx * k} ${my + ny * k} ${tx} ${ty} Q${mx - nx * k} ${my - ny * k} ${bx} ${by}Z`;
  return (
    <g>
      <path d={d} className="bz4-o bz4-xp-leaf" />
      <path d={d} fill={pat(id, "d")} opacity={0.35} />
      <path d={`M${bx} ${by} L${tx} ${ty}`} className="bz4-o bz4-thin" />
    </g>
  );
}

export default function XylemPhloem() {
  const { id } = useFig();
  const roots: P2[][] = [
    [[SX, SOIL], [SX - 6, 440], [SX - 40, 480], [SX - 70, 520]],
    [[SX, SOIL], [SX + 4, 450], [SX + 34, 490], [SX + 60, 528]],
    [[SX, 430], [SX - 4, 480], [SX + 2, 534]],
    [[SX - 30, 470], [SX - 66, 470], [SX - 96, 486]],
  ];
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={640} replay>
      <Soil />
      {/* roots */}
      {roots.map((r, i) => (
        <Draw key={i} d={smooth(r)} className="bz4-xp-root" delay={0.1} />
      ))}
      {[
        [SX + 46, 508],
        [SX - 58, 508],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l-6 -4 M${x} ${y} l6 -5 M${x - 4} ${y + 4} l-7 0 M${x + 4} ${y + 5} l7 1`} className="bz4-o bz4-thin" />
      ))}
      {/* stem */}
      <path d={`M${SX - 8} ${SOIL} V84 Q${SX} 60 ${SX + 8} 84 V${SOIL}Z`} className="bz4-o bz4-xp-stem" />
      {/* leaves, fruit */}
      <Leaf base={[SX + 8, 170]} tip={[292, 118]} w={34} />
      <Leaf base={[SX - 8, 232]} tip={[44, 196]} w={26} flip />
      <Leaf base={[SX + 8, 110]} tip={[222, 76]} w={16} />
      <path d={`M${SX - 8} 300 Q120 302 104 318`} className="bz4-o" />
      <circle cx={92} cy={342} r={28} className="bz4-o bz4-xp-fruit" />
      <circle cx={92} cy={342} r={28} fill={pat(id, "sh")} opacity={0.3} />
      <path d="M100 322 a14 14 0 0 1 12 12" className="bz4-shine" />

      {/* xylem: up (blue) */}
      <Draw d={`M${SX + 3} 520 V${SOIL} V180 L${SX + 3} 172 L250 136`} className="bz4-xp-xyl" delay={0.4} />
      <Fade delay={0.9}>
        {[470, 380, 290, 210].map((y) => (
          <Arrow key={y} d={`M${SX + 3} ${y} V${y - 14}`} tone="blue" />
        ))}
        {/* transpiration */}
        {[
          [236, 150],
          [262, 140],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q-6 8 0 16 q6 8 0 16`} className="bz4-xp-vap" transform={`rotate(180 ${x} ${y})`} />
        ))}
        <text x={300} y={150} className="bz4-lbl bz4-sm bz4-b bz4-blue-t">
          transpirace
        </text>
        <text x={300} y={168} className="bz4-lbl bz4-sm bz4-blue-t">
          H₂O průduchy ven
        </text>
      </Fade>

      {/* phloem: source → sinks (orange) */}
      <Draw d={`M250 130 L${SX - 3} 176 V${SOIL} V500`} className="bz4-xp-phl" delay={0.6} />
      <Draw d={`M${SX - 3} 176 V96`} className="bz4-xp-phl" delay={0.6} />
      <Draw d={`M${SX - 3} 300 Q124 304 108 318`} className="bz4-xp-phl" delay={0.8} />
      <Fade delay={1.2}>
        <Arrow d={`M${SX - 3} 150 V122`} tone="acc" />
        <Arrow d={`M${SX - 3} 250 V276`} tone="acc" />
        <Arrow d={`M${SX - 3} 420 V446`} tone="acc" />
        <Arrow d="M118 307 L110 315" tone="acc" />
      </Fade>

      {/* labels */}
      <Fade delay={1.4}>
        <Lbl x={300} y={92} tx={262} ty={128} className="bz4-sm bz4-b bz4-acc-t">
          list = zdroj cukrů
        </Lbl>
        <text x={14} y={380} className="bz4-lbl bz4-sm bz4-b bz4-acc-t">plod</text>
        <text x={14} y={396} className="bz4-lbl bz4-sm">spotřebič</text>
        <Lbl x={14} y={70} tx={SX - 6} ty={86} className="bz4-sm">
          rostoucí vrchol
        </Lbl>
        <text x={W - 14} y={470} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">kořen</text>
        <text x={W - 14} y={488} textAnchor="end" className="bz4-lbl bz4-sm">nasává vodu a minerály,</text>
        <text x={W - 14} y={505} textAnchor="end" className="bz4-lbl bz4-sm">ukládá cukry (spotřebič)</text>
        <Lbl x={14} y={548} tx={SX - 58} ty={508} className="bz4-sm">
          kořenové vlásky
        </Lbl>
      </Fade>

      {/* key */}
      <Fade delay={1.0}>
        <path d="M300 222 H330" className="bz4-xp-xyl" />
        <text x={338} y={227} className="bz4-lbl bz4-sm bz4-b">xylém</text>
        <text x={338} y={244} className="bz4-lbl bz4-sm">voda nahoru (koheze)</text>
        <path d="M300 268 H330" className="bz4-xp-phl" />
        <text x={338} y={273} className="bz4-lbl bz4-sm bz4-b">floém</text>
        <text x={338} y={290} className="bz4-lbl bz4-sm">cukry nahoru i dolů</text>
      </Fade>
      <Inset />
    </Figure>
  );
}

function Soil() {
  const { id } = useFig();
  return (
    <g>
      <rect x={4} y={SOIL} width={W - 8} height={H - SOIL - 30} rx={4} className="bz4-xp-soil" />
      <rect x={4} y={SOIL} width={W - 8} height={H - SOIL - 30} rx={4} fill={pat(id, "dots")} />
      <path d={`M4 ${SOIL} H${W - 4}`} className="bz4-o" />
    </g>
  );
}

/** detail of a vascular bundle: xylem vessel and phloem sieve tube with a companion cell */
function Inset() {
  const { id } = useFig();
  const x0 = 302;
  const y0 = 312;
  const h = 80;
  const vx = x0 + 8;
  const sx = x0 + 96;
  return (
    <Pop delay={1.5}>
      <rect x={x0} y={y0 - 8} width={W - x0 - 4} height={h + 16} rx={8} className="bz4-o bz4-thin bz4-fill" />
      {/* xylem vessel with ring thickenings */}
      <rect x={vx} y={y0} width={24} height={h} className="bz4-o bz4-xp-ves" />
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={vx + 12} cy={y0 + 5 + i * 8.8} rx={12} ry={2.4} className="bz4-xp-ring" />
      ))}
      <Arrow d={`M${vx + 12} ${y0 + h - 8} V${y0 + 10}`} tone="blue" />
      <text x={vx + 32} y={y0 + 22} className="bz4-lbl bz4-sm bz4-b bz4-blue-t">céva</text>
      <text x={vx + 32} y={y0 + 40} className="bz4-lbl bz4-sm">mrtvá,</text>
      <text x={vx + 32} y={y0 + 56} className="bz4-lbl bz4-sm">lignin</text>
      {/* sieve tube with sieve plates + companion cell */}
      <rect x={sx} y={y0} width={22} height={h} className="bz4-o bz4-xp-sieve" />
      {[y0 + 27, y0 + 54].map((y) => (
        <path key={y} d={`M${sx} ${y} H${sx + 22}`} className="bz4-xp-plate" />
      ))}
      <rect x={sx + 22} y={y0} width={9} height={h} className="bz4-o bz4-thin bz4-xp-comp" />
      <rect x={sx + 22} y={y0} width={9} height={h} fill={pat(id, "dots")} />
      {[y0 + 14, y0 + 40, y0 + 66].map((y) => (
        <ellipse key={y} cx={sx + 26.5} cy={y} rx={2.6} ry={5} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
      ))}
      <Arrow d={`M${sx + 11} ${y0 + 20} V${y0 + 4}`} tone="acc" />
      <Arrow d={`M${sx + 11} ${y0 + 60} V${y0 + 76}`} tone="acc" />
      <text x={sx + 37} y={y0 + 22} className="bz4-lbl bz4-sm bz4-b bz4-acc-t">sítkovice</text>
      <text x={sx + 37} y={y0 + 40} className="bz4-lbl bz4-sm">+ průvodní</text>
      <text x={sx + 37} y={y0 + 56} className="bz4-lbl bz4-sm">buňka</text>
    </Pop>
  );
}
