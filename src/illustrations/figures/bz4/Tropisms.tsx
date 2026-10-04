import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, pat, useFig, type P2 } from "./kit";

const LABEL =
  "Tropismy – růstové ohyby rostlin řízené hormonem auxinem. 1. Fototropismus: světlo dopadá na klíční rostlinu z jedné strany, auxin se přesune na zastíněnou stranu stonku, buňky tam rostou do délky víc a stonek se ohne ke světlu. 2. Gravitropismus: v položené rostlině se auxin hromadí na spodní straně. Ve stonku prodlužování buněk podporuje, spodní strana roste víc a stonek se zvedá vzhůru (negativní gravitropismus); v kořeni stejné množství auxinu růst brzdí, roste víc horní strana a kořen se stáčí dolů (pozitivní gravitropismus).";

const W = 280;
const H = 290;

/** a thick plant organ along a path (outline + fill) */
function Organ({ d, w = 13, cls = "bz4-tr-stem" }: { d: string; w?: number; cls?: string }) {
  return (
    <g>
      <path d={d} className="bz4-tr-out" style={{ strokeWidth: w + 3 }} />
      <path d={d} className={cls} style={{ strokeWidth: w }} />
    </g>
  );
}

function Auxin({ pts }: { pts: P2[] }) {
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} className="bz4-tr-aux" />
      ))}
    </g>
  );
}

function Pot({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  const d = `M${x - 40} ${y} H${x + 40} L${x + 32} ${y + 46} H${x - 32}Z`;
  return (
    <g>
      <path d={d} className="bz4-o bz4-tr-pot" />
      <path d={d} fill={pat(id, "d")} opacity={0.4} />
      <rect x={x - 44} y={y - 6} width={88} height={10} rx={2} className="bz4-o bz4-tr-pot" />
    </g>
  );
}

function Photo() {
  // stem from the pot up, bending to the right (towards the light)
  const stem = "M110 214 C110 160 112 120 136 86 C146 72 160 62 176 56";
  return (
    <Frame w={W} h={H} className="bz4-panel">
      {/* light */}
      <circle cx={252} cy={40} r={16} className="bz4-o bz4-tr-sun" />
      {[188, 204, 220, 236].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <Arrow
            key={a}
            d={`M${(252 + Math.cos(r) * 24).toFixed(1)} ${(40 + Math.sin(r) * -24).toFixed(1)} l${(Math.cos(r) * 26).toFixed(1)} ${(-Math.sin(r) * 26).toFixed(1)}`}
            tone="acc"
          />
        );
      })}
      <text x={W - 6} y={84} textAnchor="end" className="bz4-lbl bz4-sm bz4-b bz4-acc-t">
        světlo
      </text>
      <Pot x={110} y={220} />
      <Organ d={stem} />
      {/* cotyledons at the tip */}
      <path d="M176 56 q14 -14 26 -6 q-12 10 -26 6Z M176 56 q4 -18 -6 -26 q-6 14 6 26Z" className="bz4-o bz4-tr-leaf" />
      {/* auxin on the shaded (left / upper-left) side */}
      <Auxin pts={[[110, 150], [110, 132], [113, 114], [119, 100], [127, 89], [137, 78], [110, 168]]} />
      <text x={8} y={110} className="bz4-lbl bz4-sm bz4-lvl-t bz4-b">auxin</text>
      <text x={8} y={128} className="bz4-lbl bz4-sm">na stinné</text>
      <text x={8} y={146} className="bz4-lbl bz4-sm">straně</text>
      {/* magnified cells */}
      <g>
        <rect x={160} y={140} width={96} height={70} rx={6} className="bz4-o bz4-thin bz4-fill" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={168} y={148 + r * 18} width={44} height={16} className="bz4-o bz4-thin bz4-tr-cell" />
            <rect x={214} y={148 + r * 18} width={24} height={16} className="bz4-o bz4-thin bz4-tr-cell" />
          </g>
        ))}
        <circle cx={176} cy={156} r={2.4} className="bz4-tr-aux" />
        <circle cx={196} cy={174} r={2.4} className="bz4-tr-aux" />
        <circle cx={182} cy={192} r={2.4} className="bz4-tr-aux" />
        <text x={190} y={226} textAnchor="middle" className="bz4-lbl bz4-sm">stín</text>
        <text x={228} y={226} textAnchor="middle" className="bz4-lbl bz4-sm">světlo</text>
        <path d="M134 120 L160 146" className="bz4-lead bz4-dash" />
      </g>
      <text x={W / 2} y={H - 8} textAnchor="middle" className="bz4-lbl bz4-b bz4-lvl-t">
        delší buňky ve stínu → ohyb ke světlu
      </text>
    </Frame>
  );
}

function Gravi() {
  // a seedling laid on its side: shoot to the right turning up, root to the left turning down
  const shoot = "M136 150 C176 150 196 146 210 124 C220 108 222 88 222 64";
  const root = "M136 150 C100 150 80 152 66 168 C56 180 52 200 52 222";
  return (
    <Frame w={W} h={H} className="bz4-panel">
      <path d="M8 162 H272" className="bz4-lead bz4-dash" />
      <text x={W - 6} y={180} textAnchor="end" className="bz4-lbl bz4-sm bz4-muted-t">
        původně vodorovně
      </text>
      <Organ d={root} w={8} cls="bz4-tr-root" />
      <Organ d={shoot} />
      <path d="M222 64 q14 -12 26 -2 q-12 10 -26 2Z M222 64 q-14 -12 -26 -2 q12 10 26 2Z" className="bz4-o bz4-tr-leaf" />
      <ellipse cx={136} cy={150} rx={12} ry={9} className="bz4-o bz4-tr-seed" />
      {/* auxin on the lower side of both */}
      <Auxin pts={[[160, 158], [180, 156], [198, 150], [212, 140], [222, 124], [228, 108]]} />
      <Auxin pts={[[112, 156], [94, 157], [80, 162], [68, 172], [62, 184], [58, 198]]} />
      {/* gravity */}
      <Arrow d="M30 40 V96" tone="ink" className="bz4-vec" />
      <text x={40} y={70} className="bz4-lbl bz4-b">g</text>
      <text x={236} y={30} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">stonek vzhůru</text>
      <text x={236} y={48} textAnchor="end" className="bz4-lbl bz4-sm">auxin na spodní straně</text>
      <text x={8} y={252} className="bz4-lbl bz4-sm bz4-b">kořen dolů</text>
      <text x={8} y={270} className="bz4-lbl bz4-sm">auxin tu růst brzdí</text>
      <text x={W - 6} y={252} textAnchor="end" className="bz4-lbl bz4-sm">
        <tspan className="bz4-tr-dot">●</tspan> auxin
      </text>
    </Frame>
  );
}

export default function Tropisms() {
  return (
    <Figure level={11} label={LABEL} max={760} interactive boost={false}>
      <div className="bz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: "Fototropismus",
              art: <Photo />,
              caption:
                "Auxin se přesune na zastíněnou stranu. Buňky tam rostou víc do délky a stonek se ohne ke světlu.",
            },
            {
              title: "Gravitropismus",
              art: <Gravi />,
              caption:
                "Auxin klesá na spodní stranu. Stonek tam roste víc a zvedá se, v kořeni růst brzdí a kořen se stáčí dolů.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
