import {
  Draw,
  EndOn,
  Fade,
  Figure,
  Pop,
  Qty,
  Sym,
  Travel,
  Vec,
  pat,
  useFig,
} from "./kit";

const LABEL =
  "Hmotnostní spektrometr. Ve zdroji vznikají kladné ionty, urychlovací napětí U mezi dvěma deskami se štěrbinami je urychlí na rychlost v. Pak vletí do magnetického pole B, které míří z nákresny ven (tečky). Lorentzova síla je stáčí po půlkružnici o poloměru r = m · v / (Q · B): ionty se stejným nábojem a větší hmotností opíšou větší oblouk. Lehké ionty m₁ dopadnou na detektor nejblíže, těžší m₂ a m₃ dál. Detektor zaznamená, kolik iontů dopadlo kam, a z toho vznikne hmotnostní spektrum.";

const Y = 80; // beam line
const XB = 200; // field boundary
const RADII = [50, 70, 90];
const ABUND = [64, 30, 44];
const COLS = ["#d9603b", "#3f7fc4", "#4f9a5a"];
const arc = (r: number) => `M${XB} ${Y} A${r} ${r} 0 0 1 ${XB} ${Y + 2 * r}`;

function Plates() {
  const { id } = useFig();
  return (
    <g>
      {[
        [92, "fz4-plate-p", "+"],
        [134, "fz4-plate-n", "−"],
      ].map(([x, c, s]) => (
        <g key={x as number}>
          <path
            d={`M${x} 46 V${Y - 5} M${x} ${Y + 5} V108`}
            className={`fz4-slit ${c}`}
          />
          <text
            x={x as number}
            y={38}
            textAnchor="middle"
            className={`fz4-charge-t ${s === "+" ? "fz4-red-t" : "fz4-blue-t"}`}
          >
            {s}
          </text>
        </g>
      ))}
      <Sym x={113} y={66} t="U" />
      {/* source */}
      <rect
        x={14}
        y={56}
        width={56}
        height={48}
        rx={5}
        className="fz4-o fz4-fill2"
      />
      <rect
        x={14}
        y={56}
        width={56}
        height={48}
        rx={5}
        fill={pat(id, "d")}
        opacity={0.5}
      />
      <path
        d="M24 92 l5 -10 l5 10 l5 -10 l5 10 l5 -10 l5 10"
        className="fz4-filament"
      />
      <text x={42} y={48} textAnchor="middle" className="fz4-lbl fz4-sm fz4-b">
        zdroj iontů
      </text>
    </g>
  );
}

function Ion({ c }: { c: string }) {
  return (
    <g>
      <circle r={6} fill={c} className="fz4-ion" />
      <text y={3.5} textAnchor="middle" className="fz4-ion-t">
        +
      </text>
    </g>
  );
}

export default function MassSpectrometer() {
  const dots: [number, number][] = [];
  for (let y = 56; y <= 300; y += 40)
    for (let x = 222; x <= 352; x += 36) {
      const clash = RADII.some(
        (r) => Math.abs(Math.hypot(x - XB, y - (Y + r)) - r) < 13,
      );
      if (!clash) dots.push([x, y]);
    }
  return (
    <Figure level={11} w={380} h={338} max={560} label={LABEL}>
      {/* magnetic field region */}
      <rect
        x={XB}
        y={36}
        width={168}
        height={284}
        rx={6}
        className="fz4-bfield"
      />
      <Fade delay={0.1}>
        {dots.map(([x, y]) => (
          <EndOn key={`${x}-${y}`} x={x} y={y} r={5.5} out tone="ink" />
        ))}
        <text
          x={XB + 84}
          y={28}
          textAnchor="middle"
          className="fz4-lbl fz4-sm fz4-b"
        >
          pole <tspan className="fz4-it">B</tspan> z nákresny
        </text>
      </Fade>
      <Plates />
      <Draw d={`M70 ${Y} H${XB}`} className="fz4-ionbeam" delay={0.1} />
      <Vec
        a={[146, Y - 14]}
        b={[184, Y - 14]}
        tone="blue"
        t="v"
        at={[166, Y - 22]}
        delay={0.5}
      />
      {RADII.map((r, i) => (
        <g key={r}>
          <Draw
            d={arc(r)}
            className="fz4-ionpath"
            style={{ stroke: COLS[i] }}
            delay={0.5 + i * 0.15}
          />
          <Fade delay={1.5}>
            <Sym
              x={XB - 16 - ABUND[i]}
              y={Y + 2 * r + 6}
              t={`m_{${i + 1}}`}
              anchor="end"
            />
          </Fade>
        </g>
      ))}
      {/* detector and the recorded spectrum */}
      <rect
        x={XB - 10}
        y={140}
        width={10}
        height={160}
        className="fz4-o fz4-steel"
      />
      <Pop delay={1.4}>
        {RADII.map((r, i) => (
          <g key={r}>
            <rect
              x={XB - 10 - ABUND[i]}
              y={Y + 2 * r - 4}
              width={ABUND[i]}
              height={8}
              fill={COLS[i]}
              className="fz4-o fz4-thin"
            />
            <circle cx={XB - 5} cy={Y + 2 * r} r={3} fill={COLS[i]} />
          </g>
        ))}
      </Pop>
      <Fade delay={1.3}>
        <text x={XB - 16} y={134} textAnchor="end" className="fz4-lbl fz4-b">
          detektor
        </text>
        <text
          x={XB - 16}
          y={Y + 2 * RADII[0] - 14}
          textAnchor="end"
          className="fz4-lbl fz4-sm"
        >
          lehčí ionty
        </text>
        <text
          x={XB - 16}
          y={Y + 2 * RADII[2] + 30}
          textAnchor="end"
          className="fz4-lbl fz4-sm"
        >
          těžší ionty
        </text>
      </Fade>
      <Pop delay={1.5}>
        <rect
          x={10}
          y={302}
          width={124}
          height={30}
          rx={6}
          className="fz4-tag-lvl"
        />
        <Qty x={72} y={322} s="r = m v / (Q B)" anchor="middle" />
      </Pop>
      {RADII.map((r, i) => (
        <Travel
          key={r}
          path={`M70 ${Y} H${XB} ${arc(r).replace(/^M[^A]*/, "")}`}
          dur={2.6}
          phase={i * 0.33}
          rest={[XB + r, Y + r]}
          fade
        >
          <Ion c={COLS[i]} />
        </Travel>
      ))}
    </Figure>
  );
}
