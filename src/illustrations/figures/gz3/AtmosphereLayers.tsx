import { Draw, Fade, FadePath, Figure, Lbl, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Vrstvy atmosféry ve skutečném měřítku výšky od 0 do 110 km s křivkou teploty. Troposféra sahá do výšky asi 12 km; odehrává se v ní počasí, teplota s výškou klesá z průměrných +15 °C u země na asi −56 °C. Patří sem Mount Everest (8 849 m) i dopravní letadla (asi 11 km). Stratosféra (12–50 km) obsahuje ozonovou vrstvu v 15–35 km, která pohlcuje UV záření, a proto se v ní teplota zvyšuje až k 0 °C; sondážní balony praskají ve 30–35 km. V mezosféře (50–85 km) teplota klesá až k −90 °C a shoří v ní meteory. Termosféra nad 85 km se ohřívá až přes 1 000 °C, září v ní polární záře a ve výšce asi 400 km obíhá Mezinárodní vesmírná stanice ISS.";

const W = 500;
const H = 690;
const X0 = 56;
const X1 = 484;
/** altitude (km) → y */
const y = (km: number) => 610 - km * 5;
/** temperature (°C) → x */
const x = (t: number) => 150 + (t + 100) * 1.7;

// U.S. Standard Atmosphere 1976 (km, °C)
const PROFILE: [number, number][] = [
  [0, 15],
  [11, -56.5],
  [20, -56.5],
  [32, -44.5],
  [47, -2.5],
  [51, -2.5],
  [71, -58.5],
  [85, -86],
  [90, -87],
  [96, -84],
  [100, -78],
  [105, -62],
  [110, -33],
];
const CURVE =
  "M" + PROFILE.map(([km, t]) => `${f1(x(t))} ${f1(y(km))}`).join(" L");

const LAYERS = [
  { from: 0, to: 12, cls: "gz3-sky2", name: "troposféra", sub: "0–12 km · počasí" },
  { from: 12, to: 50, cls: "gz3-sky", name: "stratosféra", sub: "12–50 km" },
  { from: 50, to: 85, cls: "gz3-sky3", name: "mezosféra", sub: "50–85 km" },
  { from: 85, to: 110, cls: "gz3-sky", name: "termosféra", sub: "nad 85 km" },
];

function Plane({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path
        d="M-16 0 Q-14 -2.6 8 -2.4 Q15 -2 17 0 Q15 2 8 2.4 L-14 2.4 Z"
        className="gz3-o gz3-fill"
        style={{ strokeWidth: 1 }}
      />
      <path d="M-2 -1 L-8 -9 L-4 -9 L5 -1 M-2 1.5 L-7 8 L-3 8 L4 2 M-14 -1 L-17 -7 L-14 -7 L-10 -1" className="gz3-o gz3-fill" style={{ strokeWidth: 0.9 }} />
    </g>
  );
}

function Balloon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={10} ry={12} className="gz3-o gz3-fill" />
      <path d={`M${cx} ${cy + 12} L${cx} ${cy + 30}`} className="gz3-o gz3-thin" />
      <rect x={cx - 4} y={cy + 30} width={8} height={7} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 1 }} />
    </g>
  );
}

function Iss({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path d="M-20 0 H20" className="gz3-o" />
      {[-17, -11, 11, 17].map((sx) => (
        <rect key={sx} x={sx - 2.5} y={-11} width={5} height={22} className="gz3-o gz3-lvl-fill" style={{ strokeWidth: 0.9 }} />
      ))}
      <rect x={-6} y={-3.5} width={12} height={7} rx={2} className="gz3-o gz3-fill" style={{ strokeWidth: 1 }} />
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* layers */}
      <Fade>
        {LAYERS.map((l) => (
          <rect
            key={l.name}
            x={X0}
            y={y(l.to)}
            width={X1 - X0}
            height={y(l.from) - y(l.to)}
            className={l.cls}
          />
        ))}
        {/* ozone layer 15–35 km */}
        <rect x={X0} y={y(35)} width={X1 - X0} height={y(15) - y(35)} fill={pat(id, "dots")} className="gz3-nohit" />
        <rect x={X0} y={y(35)} width={X1 - X0} height={y(15) - y(35)} className="gz3-lvlsoft-f" opacity={0.55} />
        {[12, 50, 85].map((km) => (
          <path key={km} d={`M${X0} ${y(km)} H${X1}`} className="gz3-o gz3-dash gz3-thin" />
        ))}
        {/* ground */}
        <path d={`M${X0 - 4} ${y(0)} H${X1 + 4}`} className="gz3-o" />
      </Fade>

      {/* altitude axis */}
      <path d={`M${X0} ${y(0)} V${y(110)}`} className="gz3-o" />
      <path d={`M${X0 - 5} ${y(110) - 6} l10 -4 M${X0 - 5} ${y(110) - 12} l10 -4`} className="gz3-o gz3-thin" />
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((km) => (
        <g key={km}>
          <path d={`M${X0 - 5} ${y(km)} h5`} className="gz3-o gz3-thin" />
          <text x={X0 - 8} y={y(km) + 4.5} textAnchor="end" className="gz3-num">
            {km}
          </text>
        </g>
      ))}
      <text x={X0 - 8} y={y(110) - 18} textAnchor="end" className="gz3-num">
        km
      </text>

      {/* temperature axis */}
      <path d={`M${x(-100)} 632 H${x(40)}`} className="gz3-o gz3-thin" />
      {[-100, -80, -60, -40, -20, 0, 20, 40].map((t) => (
        <g key={t}>
          <path d={`M${x(t)} 632 v5`} className="gz3-o gz3-thin" />
          <text x={x(t)} y={652} textAnchor="middle" className="gz3-num">
            {t < 0 ? `−${-t}` : t}
          </text>
        </g>
      ))}
      <text x={x(-30)} y={676} textAnchor="middle" className="gz3-lbl gz3-sm">
        teplota vzduchu (°C)
      </text>

      {/* layer names (right column) */}
      <Fade delay={0.3}>
        {LAYERS.map((l) => {
          const mid = y((l.from + l.to) / 2);
          const ny = l.from === 0 ? mid - 2 : l.from === 12 ? y(44) : mid;
          return (
            <g key={l.name}>
              <text x={X1 - 8} y={ny} textAnchor="end" className="gz3-lbl gz3-b gz3-big">
                {l.name}
              </text>
              <text x={X1 - 8} y={ny + 18} textAnchor="end" className="gz3-lbl gz3-sm">
                {l.sub}
              </text>
            </g>
          );
        })}
        <text x={X1 - 8} y={y(26)} textAnchor="end" className="gz3-lbl gz3-b gz3-lvl-t">
          ozonová vrstva
        </text>
        <text x={X1 - 8} y={y(26) + 17} textAnchor="end" className="gz3-lbl gz3-sm gz3-lvl-t">
          15–35 km, pohlcuje UV
        </text>
        <text x={X1 - 8} y={y(97) + 36} textAnchor="end" className="gz3-lbl gz3-sm gz3-red-t">
          ohřívá se až přes 1 000 °C
        </text>
      </Fade>

      {/* temperature curve */}
      <Draw d={CURVE} className="gz3-curve gz3-warm-s" delay={0.4} />
      <FadePath d={`M${f1(x(-33))} ${y(110)} Q${f1(x(-24))} ${y(112)} ${f1(x(-16))} ${y(113.5)}`} className="gz3-curve gz3-warm-s gz3-dash" delay={1.4} />
      <Fade delay={1.3}>
        <text x={x(15)} y={626} textAnchor="middle" className="gz3-eq gz3-red-t">
          +15 °C
        </text>
        <text x={x(-56.5) + 8} y={y(17)} className="gz3-eq gz3-red-t">
          −56 °C
        </text>
        <text x={x(-2.5) + 8} y={y(49) + 5} className="gz3-eq gz3-red-t">
          ≈ 0 °C
        </text>
        <text x={x(-86) - 8} y={y(88) + 2} textAnchor="end" className="gz3-eq gz3-red-t">
          −90 °C
        </text>
      </Fade>

      {/* references */}
      <Pop delay={0.6}>
        <path
          d={`M${X0 + 2} ${y(0)} L80 ${y(4)} L92 ${y(6.5)} L100 ${y(8.849)} L110 ${y(7)} L124 ${y(5.5)} L138 ${y(3)} L152 ${y(0)} Z`}
          className="gz3-o gz3-rock"
        />
        <path d={`M92 ${y(6.5)} L100 ${y(8.849)} L110 ${y(7)} L104 ${y(7.4)} L98 ${y(6.8)} Z`} className="gz3-snow" />
      </Pop>
      <Pop delay={0.7}>
        <Plane cx={176} cy={y(11)} />
      </Pop>
      <Pop delay={0.75}>
        <g transform={`translate(196 ${y(3.4)})`}>
          <path d="M-16 4 Q-18 -4 -9 -4 Q-7 -11 1 -9 Q6 -14 11 -7 Q19 -6 16 4 Z" className="gz3-o gz3-cloud" style={{ strokeWidth: 1.1 }} />
        </g>
      </Pop>
      <Fade delay={0.9}>
        <Lbl x={64} y={y(20)} tx={176} ty={y(11) - 3} className="gz3-sm">
          letadla ≈ 11 km
        </Lbl>
        <Lbl x={64} y={y(16)} tx={100} ty={y(8.849)} className="gz3-sm">
          Everest 8 849 m
        </Lbl>
      </Fade>
      <Pop delay={0.85}>
        <Balloon cx={100} cy={y(33)} />
      </Pop>
      <Fade delay={0.95}>
        <text x={120} y={y(33) - 2} className="gz3-lbl gz3-sm">
          sondážní
        </text>
        <text x={120} y={y(33) + 14} className="gz3-lbl gz3-sm">
          balon
        </text>
      </Fade>
      <Fade delay={1}>
        <g className="gz3-sec">
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M${74 + k * 22} ${y(83 - k * 1.5)} l16 ${12 + k * 2}`}
              className="gz3-arr gz3-arr-acc"
              strokeDasharray="1 3"
            />
          ))}
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={90 + k * 22} cy={y(83 - k * 1.5) + 12 + k * 2} r={2.2} className="gz3-acc-f" fill="var(--accent)" />
          ))}
          <text x={66} y={y(75) + 2} className="gz3-lbl gz3-sm">
            meteory shoří
          </text>
        </g>
        <g className="gz3-sec">
          <path
            d={`M70 ${y(106)} q14 -6 28 0 t28 0 t28 0 M70 ${y(106)} v18 M98 ${y(106)} v24 M126 ${y(106)} v16 M154 ${y(106)} v22`}
            className="gz3-aurora"
          />
          <text x={66} y={y(97) + 6} className="gz3-lbl gz3-sm">
            polární záře
          </text>
        </g>
      </Fade>
      <Pop delay={1.1}>
        <Iss cx={112} cy={28} />
      </Pop>
      <Fade delay={1.2}>
        <text x={140} y={33} className="gz3-lbl gz3-b">
          ISS ≈ 400 km
        </text>
      </Fade>
    </>
  );
}

export default function AtmosphereLayers() {
  return (
    <Figure label={LABEL} w={W} h={H} max={560} replay>
      <Plate />
    </Figure>
  );
}
