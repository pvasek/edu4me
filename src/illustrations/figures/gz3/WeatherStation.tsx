import { DrawArrow, Fade, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Meteorologická stanice na trávníku. Bílá žaluziová budka stojí tak, aby teploměry a vlhkoměr uvnitř byly ve výšce 2 m nad zemí ve stínu a vzduch jimi volně proudil: měří teplotu vzduchu ve °C a relativní vlhkost v %. Srážkoměr s ústím 1 m nad zemí zachytí srážky, které se udávají v mm (1 mm = 1 litr vody na 1 m²). Slunoměr se skleněnou koulí vypaluje stopu do papírového pásku a ukazuje délku slunečního svitu v hodinách. Na stožáru ve výšce 10 m je anemometr s miskami, který měří rychlost větru v m/s, a směrovka, která ukazuje, odkud vítr vane. Barometr (tlakoměr) je v budově stanice a měří tlak vzduchu v hPa.";

const W = 520;
const H = 440;
const G = 420; // ground
const M = 50; // px per metre near the ground

function Screen() {
  const { id } = useFig();
  const x0 = 128;
  const x1 = 222;
  const top = G - 2.45 * M;
  const bot = G - 1.55 * M;
  return (
    <g>
      {/* legs */}
      {[x0 + 10, x1 - 10].map((lx) => (
        <path key={lx} d={`M${lx} ${bot} V${G}`} className="gz3-o" style={{ strokeWidth: 2.4 }} />
      ))}
      <path d={`M${x0 + 10} ${G - 30} H${x1 - 10}`} className="gz3-o gz3-thin" />
      {/* roof */}
      <path d={`M${x0 - 8} ${top} L${(x0 + x1) / 2} ${top - 18} L${x1 + 8} ${top} Z`} className="gz3-o gz3-snow" />
      {/* box with louvres */}
      <rect x={x0} y={top} width={x1 - x0} height={bot - top} className="gz3-o gz3-snow" />
      <rect x={x0} y={top} width={x1 - x0} height={bot - top} fill={pat(id, "b")} opacity={0.7} className="gz3-nohit" />
      {/* open door: the inside */}
      <rect x={x0 + 18} y={top + 6} width={x1 - x0 - 36} height={bot - top - 12} className="gz3-o gz3-fill2" style={{ strokeWidth: 1 }} />
      {/* thermometers */}
      {[x0 + 34, x0 + 52].map((tx, i) => (
        <g key={tx}>
          <rect x={tx - 3} y={top + 12} width={6} height={bot - top - 26} rx={3} className="gz3-o gz3-fill" style={{ strokeWidth: 1 }} />
          <circle cx={tx} cy={bot - 12} r={4.5} className="gz3-o gz3-red-fill" style={{ strokeWidth: 1 }} />
          <path d={`M${tx} ${bot - 14} V${top + 22 + i * 6}`} className="gz3-thermo-line" />
        </g>
      ))}
      {/* hygrometer */}
      <circle cx={x0 + 74} cy={(top + bot) / 2} r={7} className="gz3-o gz3-fill" style={{ strokeWidth: 1 }} />
      <path d={`M${x0 + 74} ${(top + bot) / 2} l4 -4`} className="gz3-o gz3-thin" />
      {/* the open door */}
      <path d={`M${x0} ${top} L${x0 - 16} ${top + 8} L${x0 - 16} ${bot - 4} L${x0} ${bot}`} className="gz3-o gz3-snow" />
    </g>
  );
}

function Gauge() {
  const x = 52;
  return (
    <g>
      <path d={`M${x} ${G - 14} V${G}`} className="gz3-o" style={{ strokeWidth: 3 }} />
      <path d={`M${x - 16} ${G - 1 * M} L${x + 16} ${G - 1 * M} L${x + 14} ${G - 14} L${x - 14} ${G - 14} Z`} className="gz3-o gz3-fill" />
      <ellipse cx={x} cy={G - 1 * M} rx={16} ry={3.5} className="gz3-o gz3-water" style={{ strokeWidth: 1 }} />
      <path d={`M${x - 12} ${G - 26} H${x + 12}`} className="gz3-o gz3-thin" />
    </g>
  );
}

function Sunshine() {
  const x = 300;
  const cy = G - 0.95 * M;
  return (
    <g>
      <path d={`M${x} ${cy + 18} V${G}`} className="gz3-o" style={{ strokeWidth: 3 }} />
      <path d={`M${x - 22} ${cy + 18} H${x + 22}`} className="gz3-o" />
      <path d={`M${x - 20} ${cy - 6} A21 21 0 0 0 ${x + 20} ${cy - 6}`} className="gz3-o" style={{ strokeWidth: 3 }} transform={`rotate(180 ${x} ${cy})`} />
      <circle cx={x} cy={cy} r={13} className="gz3-o gz3-glass" />
      <path d={`M${x - 6} ${cy - 5} a7 7 0 0 1 6 -4`} className="gz3-o gz3-thin" />
      <path d={`M${x - 14} ${cy + 18} V${cy + 4} M${x + 14} ${cy + 18} V${cy + 4}`} className="gz3-o gz3-thin" />
    </g>
  );
}

function Mast() {
  const x = 432;
  const top = 74;
  return (
    <g>
      <path d={`M${x} ${G} V258 M${x} 242 V${top}`} className="gz3-o" style={{ strokeWidth: 4 }} />
      <path d={`M${x - 9} 262 l18 -6 M${x - 9} 245 l18 -6`} className="gz3-o gz3-thin" />
      {/* guy wires */}
      <path d={`M${x} 300 L${x - 38} ${G} M${x} 300 L${x + 38} ${G}`} className="gz3-o gz3-thin" />
      {/* anemometer: cups on three arms */}
      <path d={`M${x} ${top} V${top - 16}`} className="gz3-o" style={{ strokeWidth: 2 }} />
      <path d={`M${x - 26} ${top - 16} H${x + 26}`} className="gz3-o" style={{ strokeWidth: 1.4 }} />
      <path d={`M${x - 26} ${top - 22} a7 7 0 0 0 0 13 Z`} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 1 }} />
      <path d={`M${x + 26} ${top - 22} a7 7 0 0 1 0 13 Z`} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 1 }} />
      <ellipse cx={x + 2} cy={top - 16} rx={5} ry={6} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 1 }} />
      <path d={`M${x - 20} ${top - 34} A26 8 0 0 1 ${x + 22} ${top - 32}`} className="gz3-arr gz3-arr-lvl" />
      {/* wind vane on a side arm */}
      <path d={`M${x} ${top + 30} H${x + 40} V${top + 20}`} className="gz3-o" style={{ strokeWidth: 1.6 }} />
      <path d={`M${x + 18} ${top + 20} H${x + 64}`} className="gz3-o" style={{ strokeWidth: 1.6 }} />
      <path d={`M${x + 12} ${top + 20} l8 -5 v10 Z`} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 1 }} />
      <path d={`M${x + 56} ${top + 20} l12 -10 v20 Z`} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 1 }} />
    </g>
  );
}

function Barometer() {
  const cx = 290;
  const cy = 128;
  const r = 42;
  const ticks = Array.from({ length: 11 }, (_, i) => -130 + i * 26);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 5} className="gz3-o gz3-clay" />
      <circle cx={cx} cy={cy} r={r} className="gz3-o gz3-fill" />
      {ticks.map((a) => {
        const rad = ((a - 90) * Math.PI) / 180;
        return (
          <path
            key={a}
            d={`M${(cx + Math.cos(rad) * (r - 4)).toFixed(1)} ${(cy + Math.sin(rad) * (r - 4)).toFixed(1)} L${(cx + Math.cos(rad) * (r - 10)).toFixed(1)} ${(cy + Math.sin(rad) * (r - 10)).toFixed(1)}`}
            className="gz3-o gz3-thin"
          />
        );
      })}
      <text x={cx - 20} y={cy + 30} textAnchor="middle" className="gz3-num gz3-tiny">
        980
      </text>
      <text x={cx + 20} y={cy + 30} textAnchor="middle" className="gz3-num gz3-tiny">
        1040
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="gz3-num gz3-tiny">
        hPa
      </text>
      <path d={`M${cx} ${cy} L${cx + 6} ${cy - 30}`} className="gz3-o" style={{ strokeWidth: 2 }} />
      <circle cx={cx} cy={cy} r={3} className="gz3-dot" />
    </g>
  );
}

function Plate() {
  return (
    <>
      {/* ground */}
      <Fade>
        <rect x={10} y={G} width={W - 20} height={14} className="gz3-grass" />
        <path d={`M10 ${G} H${W - 10}`} className="gz3-o" />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${22 + i * 20} ${G} l-3 -6 M${26 + i * 20} ${G} l2 -7`} className="gz3-o gz3-thin" />
        ))}
      </Fade>

      <Pop delay={0.1}>
        <Gauge />
      </Pop>
      <Pop delay={0.2}>
        <Screen />
      </Pop>
      <Pop delay={0.3}>
        <Sunshine />
      </Pop>
      <Pop delay={0.35}>
        <Mast />
      </Pop>
      <Pop delay={0.45}>
        <Barometer />
      </Pop>

      {/* heights */}
      <Fade delay={0.6}>
        <DrawArrow d={`M244 ${G - 2} V${G - 2 * M + 2}`} tone="muted" both />
        <path d={`M200 ${G - 2 * M} H252`} className="gz3-o gz3-thin gz3-dash" />
        <text x={250} y={G - M + 5} className="gz3-eq">
          2 m
        </text>
        <DrawArrow d={`M394 ${G - 2} V${78}`} tone="muted" both />
        <path d={`M388 74 H420`} className="gz3-o gz3-thin gz3-dash" />
        <text x={386} y={G - 120} textAnchor="end" className="gz3-eq">
          10 m
        </text>
        <DrawArrow d={`M88 ${G - 2} V${G - M + 2}`} tone="muted" both />
        <text x={93} y={G - 20} className="gz3-eq gz3-eq-sm">
          1 m
        </text>
      </Fade>

      {/* labels */}
      <Fade delay={0.8}>
        <Lbl x={52} y={G - 1 * M - 30} anchor="middle" className="gz3-b">
          srážkoměr
        </Lbl>
        <Lbl x={52} y={G - 1 * M - 13} anchor="middle" className="gz3-sm">
          srážky (mm)
        </Lbl>

        <Lbl x={175} y={G - 2.45 * M - 62} anchor="middle" className="gz3-b">
          meteorologická budka
        </Lbl>
        <Lbl x={175} y={G - 2.45 * M - 44} anchor="middle" className="gz3-sm">
          teploměr: teplota (°C)
        </Lbl>
        <Lbl x={175} y={G - 2.45 * M - 27} anchor="middle" className="gz3-sm">
          vlhkoměr: vlhkost (%)
        </Lbl>

        <Lbl x={300} y={G - 0.95 * M - 42} anchor="middle" className="gz3-b">
          slunoměr
        </Lbl>
        <Lbl x={300} y={G - 0.95 * M - 25} anchor="middle" className="gz3-sm">
          svit (h)
        </Lbl>

        <Lbl x={290} y={196} anchor="middle" className="gz3-b">
          barometr
        </Lbl>
        <Lbl x={290} y={213} anchor="middle" className="gz3-sm">
          tlak (hPa), v budově
        </Lbl>

        <Lbl x={396} y={42} anchor="end" className="gz3-b">
          anemometr
        </Lbl>
        <Lbl x={396} y={59} anchor="end" className="gz3-sm">
          rychlost větru (m/s)
        </Lbl>
        <Lbl x={500} y={130} anchor="end" className="gz3-b">
          směrovka
        </Lbl>
        <Lbl x={500} y={147} anchor="end" className="gz3-sm">
          směr větru
        </Lbl>
      </Fade>
    </>
  );
}

export default function WeatherStation() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
