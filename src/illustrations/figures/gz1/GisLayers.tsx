import { DrawArrow, Fade, Figure, Rise, useFig } from "./kit";

const LABEL =
  "GIS skládá mapu z vrstev dat. Každá vrstva nese jeden druh údajů o stejném území: využití ploch (les, pole, zástavba), reliéf (vrstevnice), vodstvo (řeka a rybník), silnice a budovy. Položením vrstev přes sebe vznikne výsledná mapa; vrstvy lze libovolně zapínat, vypínat a kombinovat.";

const W = 440;
const H = 610;
const OX = 34;
const OY = 22;
const GAP = 58;
/** content square 0..200 → oblique layer */
const skew = (k: number) => `matrix(0.9 0 0.45 0.3 ${OX} ${OY + k * GAP})`;

type Layer = { key: string; name: string; draw: () => React.ReactNode };

const LAYERS: Layer[] = [
  {
    key: "build",
    name: "budovy",
    draw: () => (
      <g>
        {[
          [96, 92],
          [114, 92],
          [96, 112],
          [118, 114],
          [134, 100],
          [80, 104],
          [104, 130],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={12} height={12} className="gz1-house" />
        ))}
      </g>
    ),
  },
  {
    key: "roads",
    name: "silnice",
    draw: () => (
      <g>
        <path d="M0 40 C60 50 140 80 200 100" className="gz1-road" />
        <path d="M0 40 C60 50 140 80 200 100" className="gz1-road-in" />
        <path d="M100 0 C104 60 96 140 110 200" className="gz1-road" />
        <path d="M100 0 C104 60 96 140 110 200" className="gz1-road-in" />
      </g>
    ),
  },
  {
    key: "water",
    name: "vodstvo",
    draw: () => (
      <g>
        <path d="M0 150 C50 130 90 170 140 160 S190 170 200 176" className="gz1-river" style={{ strokeWidth: 4 }} />
        <ellipse cx={46} cy={70} rx={26} ry={16} className="gz1-lake gz1-o gz1-thin" />
      </g>
    ),
  },
  {
    key: "relief",
    name: "reliéf",
    draw: () => (
      <g>
        {[60, 42, 24].map((r) => (
          <ellipse key={r} cx={150} cy={60} rx={r} ry={r * 0.7} className="gz1-contour" style={{ strokeWidth: 2 }} />
        ))}
        <path d="M150 54 L156 64 L144 64Z" style={{ fill: "var(--ink)" }} />
      </g>
    ),
  },
  {
    key: "use",
    name: "využití ploch",
    draw: () => (
      <g>
        <path d="M120 0 H200 V90 C170 100 130 70 120 0Z" className="gz1-forest" />
        <path d="M0 110 H70 L80 200 H0Z" className="gz1-field" />
        <path d="M76 82 H150 V146 H84Z" className="gz1-built" />
        <path d="M150 120 H200 V200 H120Z" className="gz1-field2" />
      </g>
    ),
  },
];

function Sheet({ k, layer }: { k: number; layer: Layer }) {
  const { id } = useFig();
  return (
    <g>
      <g transform={skew(k)}>
        <clipPath id={`${id}-sq-${k}`}>
          <rect width={200} height={200} />
        </clipPath>
        <rect width={200} height={200} className="gz1-sheet" />
        <g clipPath={`url(#${id}-sq-${k})`}>{layer.draw()}</g>
        <rect width={200} height={200} className="gz1-sheet-o" />
      </g>
    </g>
  );
}

const MAPX = (W - 220) / 2;
const MAPY = OY + 4 * GAP + 60 + 62;

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* bottom layer first, so the upper sheets lie on top */}
      {LAYERS.map((_, i) => i)
        .reverse()
        .map((i) => (
          <Rise key={LAYERS[i].key} delay={0.1 + (LAYERS.length - 1 - i) * 0.15}>
            <Sheet k={i} layer={LAYERS[i]} />
            <text x={OX + 180 + 90 + 8} y={OY + i * GAP + 36} className="gz1-lbl gz1-b gz1-halo">
              {LAYERS[i].name}
            </text>
          </Rise>
        ))}
      <DrawArrow d={`M${W / 2} ${MAPY - 50} V${MAPY - 10}`} tone="lvl" delay={1.0} className="gz1-vec" />
      <Fade delay={1.0}>
        <text x={W / 2 + 14} y={MAPY - 24} className="gz1-lbl gz1-b gz1-lvl-t">
          vrstvy → mapa
        </text>
      </Fade>
      <Fade delay={1.2}>
        <g transform={`translate(${MAPX} ${MAPY}) scale(1.1)`}>
          <clipPath id={`${id}-map`}>
            <rect width={200} height={200} />
          </clipPath>
          <rect width={200} height={200} className="gz1-mapbg" />
          <g clipPath={`url(#${id}-map)`}>
            {[...LAYERS].reverse().map((l) => (
              <g key={l.key}>{l.draw()}</g>
            ))}
          </g>
          <rect width={200} height={200} className="gz1-o" />
        </g>
      </Fade>
    </>
  );
}

export default function GisLayers() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={500} replay>
      <Plate />
    </Figure>
  );
}
