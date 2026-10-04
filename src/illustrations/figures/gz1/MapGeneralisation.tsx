import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, StripBox, f1, rng, useFig } from "./kit";

const LABEL =
  "Totéž místo na mapách tří měřítek. V měřítku 1 : 10 000 jsou vidět jednotlivé domy, ulice, kostel a řeka. V měřítku 1 : 100 000 splynou domy v jednu plochu zástavby a přibudou okolní lesy, železnice a vesnice. V měřítku 1 : 1 000 000 je celé město jen tečka se jménem. Čím menší měřítko, tím větší území a tím víc mapa zjednodušuje (generalizuje). Pod každou mapou je grafické měřítko.";

const W = 240;
const H = 270;
const M0 = 20; // map frame left / top
const S = 200; // map frame size in px

/** metres → px for a frame showing ±ext metres around the town centre */
const mk = (ext: number) => (x: number, y: number) => [M0 + S / 2 + (x * S) / (2 * ext), M0 + S / 2 + (y * S) / (2 * ext)] as [number, number];

/** the same river in every map (metres, y grows southwards) */
const riverY = (x: number) => 190 + 120 * Math.sin(x / 700) + 1500 * Math.sin(x / 9000) + 5000 * Math.sin(x / 20000);
function river(ext: number) {
  const p = mk(ext);
  let d = "";
  for (let i = 0; i <= 60; i++) {
    const x = -ext + (2 * ext * i) / 60;
    const [a, b] = p(x, riverY(x));
    d += `${i ? "L" : "M"}${f1(a)} ${f1(b)}`;
  }
  return d;
}

function poly(ext: number, pts: [number, number][]) {
  const p = mk(ext);
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${f1(p(x, y)[0])} ${f1(p(x, y)[1])}`).join("") + "Z";
}
function line(ext: number, pts: [number, number][]) {
  const p = mk(ext);
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${f1(p(x, y)[0])} ${f1(p(x, y)[1])}`).join("");
}

function ScaleBar({ unit, a }: { unit: string; a: number }) {
  // half the frame = 3 units of a/3 (300 m, 3 km, 30 km)
  const y = M0 + S + 22;
  const L = S / 2;
  return (
    <g>
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={M0 + (k * L) / 3}
          y={y - 4}
          width={L / 3}
          height={6}
          className={`gz1-o gz1-thin ${k % 2 ? "gz1-fill" : ""}`}
          style={k % 2 ? undefined : { fill: "var(--ink)" }}
        />
      ))}
      <text x={M0} y={y + 20} textAnchor="middle" className="gz1-scale-t">
        0
      </text>
      <text x={M0 + L} y={y + 20} textAnchor="middle" className="gz1-scale-t">
        {`${a} ${unit}`}
      </text>
    </g>
  );
}

function Shell({ children, bar }: { children: React.ReactNode; bar: React.ReactNode }) {
  const { id } = useFig();
  return (
    <>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x={M0} y={M0} width={S} height={S} />
        </clipPath>
      </defs>
      <rect x={M0} y={M0} width={S} height={S} className="gz1-mapbg" />
      <g clipPath={`url(#${id}-clip)`}>{children}</g>
      <rect x={M0} y={M0} width={S} height={S} className="gz1-o" />
      {bar}
    </>
  );
}

/** 1 : 10 000 – the frame is 600 m across */
function Large() {
  const E = 300;
  const p = mk(E);
  const R = rng(7);
  const houses: string[] = [];
  // rows of houses along the streets (metres)
  const rows: [number, number, number, number][] = [
    [-290, -110, -70, 1], // along the main street, north side
    [-290, -110, -10, 1], // south side
    [30, 290, -70, 1],
    [30, 290, -10, 1],
    [-290, -110, -250, 1],
    [30, 290, -250, 1],
    [-60, -20, -280, 0],
  ];
  for (const [a, b, y] of rows) {
    for (let x = a; x < b - 20; x += 34 + R() * 8) {
      const w = 20 + R() * 8;
      const h = 18 + R() * 6;
      const [px, py] = p(x, y - h / 2);
      houses.push(`M${f1(px)} ${f1(py)} h${f1((w * S) / 600)} v${f1((h * S) / 600)} h${f1((-w * S) / 600)}Z`);
    }
  }
  const [cx, cy] = p(-60, -150);
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Shell bar={<ScaleBar unit="m" a={300} />}>
        <path d={poly(E, [[-300, 20], [-90, 20], [-90, 400], [-300, 400]])} className="gz1-meadow" />
        <path d={river(E)} className="gz1-river" style={{ strokeWidth: 7, opacity: 0.85 }} />
        {/* streets */}
        <path d={line(E, [[-300, -40], [300, -40]])} className="gz1-street" />
        <path d={line(E, [[-300, -220], [300, -220]])} className="gz1-street" />
        <path d={line(E, [[-90, -300], [-90, 300]])} className="gz1-street" />
        <path d={line(E, [[10, -300], [10, 300]])} className="gz1-street" />
        {houses.map((d, i) => (
          <path key={i} d={d} className="gz1-house" />
        ))}
        {/* church: block with a cross */}
        <rect x={cx - 9} y={cy - 12} width={20} height={34} className="gz1-house" />
        <path d={`M${cx + 1} ${cy - 7} v14 M${cx - 5} ${cy - 2} h12`} className="gz1-o" style={{ strokeWidth: 2 }} />
        {/* park trees */}
        {Array.from({ length: 9 }, (_, i) => {
          const [tx, ty] = p(-270 + (i % 3) * 60, 80 + Math.floor(i / 3) * 55);
          return <circle key={i} cx={tx} cy={ty} r={5} className="gz1-forest gz1-o gz1-thin" />;
        })}
      </Shell>
      <text x={cx + 16} y={cy + 4} className="gz1-lbl gz1-sm gz1-halo">
        kostel
      </text>
    </Frame>
  );
}

/** 1 : 100 000 – 6 km across */
function Middle() {
  const E = 3000;
  const p = mk(E);
  const [bx, by] = p(-300, -300);
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Shell bar={<ScaleBar unit="km" a={3} />}>
        <path d={poly(E, [[2900, -3000], [1100, -2900], [800, -1700], [1500, -1100], [3000, -900]])} className="gz1-forest" />
        <path d={poly(E, [[-3000, 900], [-2300, 700], [-1500, 1500], [-1700, 3000], [-3000, 3000]])} className="gz1-forest" />
        <path d={river(E)} className="gz1-river" />
        <path d={line(E, [[-3000, -40], [3000, -40]])} className="gz1-road" />
        <path d={line(E, [[-3000, -40], [3000, -40]])} className="gz1-road-in" />
        <path d={line(E, [[10, -40], [400, -3000]])} className="gz1-road" style={{ strokeWidth: 3.2 }} />
        <path d={line(E, [[10, -40], [400, -3000]])} className="gz1-road-in" style={{ strokeWidth: 1.4 }} />
        <path d={line(E, [[-3000, -1700], [3000, 2400]])} className="gz1-rail" />
        <path d={line(E, [[-3000, -1700], [3000, 2400]])} className="gz1-rail-in" />
        {/* the town as one built-up area */}
        <path d={poly(E, [[-420, -380], [380, -340], [460, 120], [120, 300], [-380, 200]])} className="gz1-built gz1-o gz1-thin" />
        {/* a village */}
        <path d={poly(E, [[1700, 1500], [2200, 1450], [2250, 1850], [1750, 1900]])} className="gz1-built gz1-o gz1-thin" />
        {/* the area of the first map */}
        <rect x={bx} y={by} width={S / 10} height={S / 10} className="gz1-extent" />
      </Shell>
    </Frame>
  );
}

/** 1 : 1 000 000 – 60 km across */
function Small() {
  const E = 30000;
  const p = mk(E);
  const [bx, by] = p(-3000, -3000);
  const town = p(0, 0);
  const towns: [number, number][] = [
    [-21000, -14000],
    [17000, -19000],
    [20000, 16000],
  ];
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Shell bar={<ScaleBar unit="km" a={30} />}>
        <path d={river(E)} className="gz1-river" style={{ strokeWidth: 1.8 }} />
        {towns.map(([x, y], i) => (
          <path key={i} d={line(E, [[0, -40], [x, y]])} className="gz1-o" style={{ stroke: "var(--bad)", strokeWidth: 1.6 }} />
        ))}
        {towns.map(([x, y], i) => {
          const [a, b] = p(x, y);
          return <circle key={i} cx={a} cy={b} r={3.4} className="gz1-o gz1-thin gz1-fill" />;
        })}
        <rect x={bx} y={by} width={S / 10} height={S / 10} className="gz1-extent" />
        <circle cx={town[0]} cy={town[1]} r={4.5} className="gz1-o gz1-thin" style={{ fill: "var(--ink)" }} />
      </Shell>
      <text x={town[0] - 10} y={town[1] + 30} textAnchor="end" className="gz1-lbl gz1-b gz1-halo">
        město
      </text>
    </Frame>
  );
}

function Strip() {
  return (
    <StepStrip
      min={180}
      steps={[
        { title: "1 : 10 000", art: <Large />, caption: "1 cm na mapě = 100 m: jednotlivé domy, ulice, kostel." },
        { title: "1 : 100 000", art: <Middle />, caption: "1 cm = 1 km: domy splynou v plochu zástavby. Rámeček = první mapa." },
        { title: "1 : 1 000 000", art: <Small />, caption: "1 cm = 10 km: celé město je jen tečka se jménem." },
      ]}
    />
  );
}

export default function MapGeneralisation() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL} note="Menší měřítko = větší území, méně podrobností (generalizace).">
        <Strip />
      </StripBox>
    </Figure>
  );
}
