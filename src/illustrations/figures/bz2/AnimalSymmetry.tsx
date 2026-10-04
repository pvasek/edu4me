import { StepStrip } from "../../sequence/StepFigure";
import { Dashed, Fade, Figure, Frame, Shade, StripBox, blob, useFig, pat } from "./kit";

const LABEL =
  "Souměrnost těla živočichů ve čtyřech obrázcích. Houbovec nemá žádnou osu souměrnosti, její tělo je nepravidelné. Medúza má souměrnost paprsčitou: tělem vede více rovin souměrnosti středem, jako u koláče. Žížala a brouk jsou souměrní dvoustranně: jediná rovina je dělí na levou a pravou polovinu, mají přední konec s hlavou a tělo složené z článků.";

const W = 200;
const H = 200;

function Sponge() {
  const { id } = useFig();
  const body = blob([
    [70, 176],
    [58, 140],
    [52, 96],
    [64, 50],
    [84, 30],
    [98, 44],
    [112, 28],
    [134, 46],
    [142, 92],
    [150, 132],
    [136, 176],
  ]);
  return (
    <Frame w={W} h={H} className="bz2-small">
      <path d="M30 186 Q100 168 172 186 L172 196 L30 196Z" className="bz2-o bz2-fill3" />
      <path d="M30 186 Q100 168 172 186 L172 196 L30 196Z" fill={pat(id, "dots")} />
      <Shade d={body} fill="bz2-leaf2" hatch="d" />
      {/* osculum (výdechový otvor) */}
      <ellipse cx={98} cy={42} rx={9} ry={4} className="bz2-o bz2-ink-f" />
      {/* pores */}
      {[
        [72, 70], [88, 82], [118, 74], [128, 104], [76, 112], [98, 120], [118, 140], [86, 150], [104, 96], [66, 146],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} className="bz2-o bz2-thin bz2-paper-f" />
      ))}
      <Fade delay={0.5}>
        <text x={100} y={18} textAnchor="middle" className="bz2-lbl bz2-b bz2-big bz2-bad-t">
          žádná osa
        </text>
      </Fade>
    </Frame>
  );
}

function Jellyfish() {
  const cx = 100;
  const cy = 114;
  const axes = [0, 45, 90, 135];
  return (
    <Frame w={W} h={H} className="bz2-small">
      {/* tentacle fringe */}
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2;
        const r1 = 62;
        const r2 = 71 + (i % 2) * 4;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a + 0.05) * r2}
            y2={cy + Math.sin(a + 0.05) * r2}
            className="bz2-o bz2-thin"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={62} className="bz2-o bz2-water" />
      <circle cx={cx} cy={cy} r={55} className="bz2-o bz2-thin bz2-dash" fill="none" />
      {/* four horseshoe gonads, open towards the centre */}
      {[45, 135, 225, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        const gx = cx + Math.cos(r) * 27;
        const gy = cy + Math.sin(r) * 27;
        const o = r + Math.PI; // opening towards the centre
        const p = (k: number) => [gx + Math.cos(o + k) * 10, gy + Math.sin(o + k) * 10];
        const [ax, ay] = p(0.9);
        const [bx, by] = p(-0.9);
        return (
          <g key={a}>
            <path d={`M${ax.toFixed(1)} ${ay.toFixed(1)} A10 10 0 1 1 ${bx.toFixed(1)} ${by.toFixed(1)}`} className="bz2-o" style={{ strokeWidth: 8, stroke: "var(--edge)" }} />
            <path d={`M${ax.toFixed(1)} ${ay.toFixed(1)} A10 10 0 1 1 ${bx.toFixed(1)} ${by.toFixed(1)}`} className="bz2-o" style={{ strokeWidth: 5.5, stroke: "var(--lvl-mid)" }} />
          </g>
        );
      })}
      {/* mouth: four-armed cross */}
      <path d={`M${cx - 9} ${cy} H${cx + 9} M${cx} ${cy - 9} V${cy + 9}`} className="bz2-o" />
      {axes.map((a, i) => {
        const r = Math.PI * (a / 180);
        const dx = Math.cos(r) * 92;
        const dy = Math.sin(r) * 92;
        return (
          <Dashed
            key={a}
            d={`M${cx - dx} ${cy - dy} L${cx + dx} ${cy + dy}`}
            delay={0.15 * i}
          />
        );
      })}
      <Fade delay={0.6}>
        <text x={100} y={18} textAnchor="middle" className="bz2-lbl bz2-b bz2-big bz2-lvl-t">
          mnoho os
        </text>
      </Fade>
    </Frame>
  );
}

function Worm() {
  // top view, head up
  const segs = 20;
  const top = 34;
  const bot = 188;
  const rows = Array.from({ length: segs + 1 }, (_, i) => top + 10 + ((bot - top - 18) * i) / segs);
  const half = (y: number) => {
    const t = (y - top) / (bot - top);
    return 8 + 6 * Math.sin(Math.PI * Math.min(1, t * 1.15));
  };
  const L = rows.map((y) => [100 - half(y), y] as [number, number]);
  const R = rows.map((y) => [100 + half(y), y] as [number, number]);
  const outline =
    `M100 ${top} Q${100 - 9} ${top + 2} ${L[0][0]} ${L[0][1]} ` +
    L.slice(1).map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") +
    ` Q100 ${bot + 4} ${R[segs][0]} ${R[segs][1]} ` +
    [...R].reverse().slice(1).map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") +
    ` Q${100 + 9} ${top + 2} 100 ${top}Z`;
  return (
    <Frame w={W} h={H} className="bz2-small">
      <Shade d={outline} fill="bz2-flesh" hatch="b" hatchOp={0.6} />
      {/* clitellum (opasek) */}
      <rect x={100 - half(rows[6]) - 1} y={rows[5]} width={2 * half(rows[6]) + 2} height={rows[8] - rows[5]} rx={4} className="bz2-o bz2-flesh2" />
      {rows.slice(1, -1).map((y, i) => (
        <line key={i} x1={100 - half(y)} y1={y} x2={100 + half(y)} y2={y} className="bz2-o bz2-hair" />
      ))}
      <Dashed d="M100 22 V196" />
      <Fade delay={0.5}>
        <text x={128} y={42} className="bz2-lbl bz2-b">hlava</text>
        <line x1={126} y1={38} x2={108} y2={36} className="bz2-lead" />
        <text x={126} y={160} className="bz2-lbl bz2-sm">články</text>
        <line x1={124} y1={156} x2={110} y2={150} className="bz2-lead" />
        <text x={76} y={104} textAnchor="end" className="bz2-lbl bz2-sm">levá</text>
        <text x={124} y={104} className="bz2-lbl bz2-sm">pravá</text>
        <text x={100} y={14} textAnchor="middle" className="bz2-lbl bz2-b bz2-big bz2-lvl-t">
          jedna rovina
        </text>
      </Fade>
    </Frame>
  );
}

function Beetle() {
  const { id } = useFig();
  const leg = (y: number, side: 1 | -1, k: number) => {
    const x0 = 100 + side * 20;
    const knee = [100 + side * (44 + k * 2), y + (k - 1) * 10] as const;
    const foot = [100 + side * (60 + k * 3), y + (k - 1) * 24 + 8] as const;
    return `M${x0} ${y} L${knee[0]} ${knee[1]} L${foot[0]} ${foot[1]}`;
  };
  return (
    <Frame w={W} h={H} className="bz2-small">
      {/* legs: 3 pairs from the thorax */}
      {[0, 1, 2].map((k) =>
        ([1, -1] as const).map((s) => (
          <path key={`${k}${s}`} d={leg(84 + k * 12, s, k)} className="bz2-o" style={{ strokeWidth: 2 }} />
        )),
      )}
      {/* antennae */}
      <path d="M93 40 Q80 26 70 22 M107 40 Q120 26 130 22" className="bz2-o" />
      {/* head */}
      <ellipse cx={100} cy={48} rx={13} ry={11} className="bz2-o bz2-chitin" />
      {/* pronotum */}
      <path d="M80 62 Q100 54 120 62 L124 80 Q100 86 76 80Z" className="bz2-o bz2-chitin" />
      <path d="M80 62 Q100 54 120 62 L124 80 Q100 86 76 80Z" fill={pat(id, "d")} />
      {/* elytra */}
      <path d="M100 82 L100 182 Q74 178 72 140 Q70 100 78 84Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M100 82 L100 182 Q126 178 128 140 Q130 100 122 84Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M100 82 L100 182 Q74 178 72 140 Q70 100 78 84Z" fill={pat(id, "b")} opacity={0.7} />
      <path d="M100 82 L100 182 Q126 178 128 140 Q130 100 122 84Z" fill={pat(id, "d")} opacity={0.7} />
      <Dashed d="M100 18 V198" />
      <Fade delay={0.5}>
        <text x={150} y={52} className="bz2-lbl bz2-b">hlava</text>
        <line x1={148} y1={48} x2={113} y2={48} className="bz2-lead" />
        <text x={100} y={14} textAnchor="middle" className="bz2-lbl bz2-b bz2-big bz2-lvl-t">
          jedna rovina
        </text>
      </Fade>
    </Frame>
  );
}

export default function AnimalSymmetry() {
  return (
    <Figure level={4} label={LABEL} max={860} interactive boost={false}>
      <StripBox
        label={LABEL}
        note="Čárkovaná čára = rovina souměrnosti: rozdělí tělo na dvě zrcadlové poloviny."
      >
        <StepStrip
          min={140}
          phoneColumns={2}
          steps={[
            {
              title: "Houbovec",
              art: <Sponge />,
              caption: "Bez souměrnosti: tělo roste nepravidelně, žádný řez ho nerozdělí na dvě stejné půlky.",
            },
            {
              title: "Medúza",
              art: <Jellyfish />,
              caption: "Paprsčitá souměrnost (pohled shora): rovin je víc a všechny vedou středem.",
            },
            {
              title: "Žížala",
              art: <Worm />,
              caption: "Dvoustranná souměrnost: přední konec s hlavou, tělo z mnoha stejných článků.",
            },
            {
              title: "Brouk",
              art: <Beetle />,
              caption: "Dvoustranná souměrnost: hlava se smysly vpředu, tři páry nohou zrcadlově.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
