import {
  Draw,
  EndOn,
  Fade,
  Figure,
  Head,
  Pop,
  Qty,
  Sym,
  Travel,
  Vec,
  useCompact,
} from "./kit";

const LABEL =
  "Lorentzova síla na kladně nabitou částici v homogenním magnetickém poli, jehož indukce B míří kolmo do nákresny (křížky). Částice letí rychlostí v; magnetická síla F_m je kolmá na rychlost i na indukci, a proto mění jen směr pohybu, ne velikost rychlosti. Když částice letí vpravo, síla míří nahoru do středu; na pravém kraji letí nahoru a síla míří vlevo. Částice proto obíhá proti směru hodinových ručiček po kružnici o poloměru r = m · v / (Q · B). Vpravo Flemingovo pravidlo levé ruky, stejné jako pro sílu na vodič s proudem: indukční čáry vstupují do dlaně levé ruky, natažené prsty ukazují směr pohybu kladné částice (to je směr proudu), odtažený palec ukazuje směr síly F_m. Pro zápornou částici míří síla opačně. F_m, v a B jsou navzájem kolmé.";

const CX = 164;
const CY = 176;
const R = 104;
/** Crosses stay away from the vectors and their labels. */
const KEEP: [number, number][] = [
  [CX + 40, CY + R],
  [CX + 80, CY + R],
  [CX, CY + R - 30],
  [CX + 16, CY + R - 46],
  [CX + R, CY - 40],
  [CX + R + 16, CY - 56],
  [CX + R - 35, CY],
  [CX + R - 40, CY + 22],
  [CX - 16, CY + 56],
];
const ORBIT = `M${CX} ${CY + R} A${R} ${R} 0 1 0 ${CX} ${CY - R} A${R} ${R} 0 1 0 ${CX} ${CY + R}`;

function Field() {
  const xs = [34, 74, 114, 154, 194, 234, 274, 314];
  const ys = [60, 100, 140, 180, 220, 260, 300];
  return (
    <g>
      <rect
        x={14}
        y={40}
        width={320}
        height={284}
        rx={6}
        className="fz4-bfield"
      />
      <Fade delay={0.1}>
        {ys.map((y) =>
          xs.map((x) => {
            const near =
              Math.abs(Math.hypot(x - CX, y - CY) - R) < 14 ||
              KEEP.some(([kx, ky]) => Math.hypot(x - kx, y - ky) < 20);
            return near ? null : (
              <EndOn
                key={`${x}-${y}`}
                x={x}
                y={y}
                r={5.5}
                out={false}
                tone="ink"
              />
            );
          }),
        )}
      </Fade>
    </g>
  );
}

function Particle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="fz4-proton" />
      <text x={x} y={y + 5} textAnchor="middle" className="fz4-proton-t">
        +
      </text>
    </g>
  );
}

function Orbit() {
  const bottom: [number, number] = [CX, CY + R];
  const right: [number, number] = [CX + R, CY];
  return (
    <g>
      <Draw d={ORBIT} className="fz4-orbit-path" delay={0.2} />
      <Fade delay={1}>
        <Head
          x={CX - R * Math.SQRT1_2}
          y={CY + R * Math.SQRT1_2}
          deg={45}
          tone="ink"
          s={1.2}
        />
        <Head
          x={CX + R * Math.SQRT1_2}
          y={CY - R * Math.SQRT1_2}
          deg={-135}
          tone="ink"
          s={1.2}
        />
        <path
          d={`M${CX} ${CY} V${CY + R}`}
          className="fz4-o fz4-thin fz4-dash"
        />
        <circle cx={CX} cy={CY} r={2.5} className="fz4-dot" />
        <Sym x={CX - 10} y={CY + 60} t="r" anchor="end" />
      </Fade>
      {/* two moments of the motion */}
      <Pop delay={0.6}>
        <circle cx={bottom[0]} cy={bottom[1]} r={10} className="fz4-ghost-q" />
        <circle cx={right[0]} cy={right[1]} r={10} className="fz4-ghost-q" />
      </Pop>
      <Vec
        a={[bottom[0] + 12, bottom[1]]}
        b={[bottom[0] + 72, bottom[1]]}
        tone="blue"
        t="v"
        at={[bottom[0] + 82, bottom[1] + 6]}
        anchor="start"
        delay={0.8}
      />
      <Vec
        a={[bottom[0], bottom[1] - 12]}
        b={[bottom[0], bottom[1] - 58]}
        tone="red"
        t="F_{m}"
        at={[bottom[0] + 8, bottom[1] - 44]}
        anchor="start"
        delay={1}
      />
      <Vec
        a={[right[0], right[1] - 12]}
        b={[right[0], right[1] - 66]}
        tone="blue"
        t="v"
        at={[right[0] + 10, right[1] - 54]}
        anchor="start"
        delay={0.9}
      />
      <Vec
        a={[right[0] - 12, right[1]]}
        b={[right[0] - 58, right[1]]}
        tone="red"
        t="F_{m}"
        at={[right[0] - 40, right[1] + 24]}
        anchor="middle"
        delay={1.1}
      />
      <Travel
        path={ORBIT}
        dur={6}
        rest={[CX - R * 0.866, CY - R * 0.5]}
        phase={0.58}
      >
        <Particle x={0} y={0} />
      </Travel>
    </g>
  );
}

/** Fleming's left-hand rule triad (as in the lesson): B into the palm, fingers along v, thumb F_m; v and B span the shaded plane. */
function Triad() {
  const o: [number, number] = [40, 160];
  const v: [number, number] = [130, 160];
  const b: [number, number] = [102, 116];
  const f: [number, number] = [40, 34];
  return (
    <g>
      <text x={100} y={0} textAnchor="middle" className="fz4-lbl fz4-b">
        pravidlo levé ruky
      </text>
      <Fade delay={0.4}>
        <path
          d={`M${o[0]} ${o[1]} L${v[0]} ${v[1]} L${v[0] + b[0] - o[0]} ${b[1]} L${b[0]} ${b[1]}Z`}
          className="fz4-plane"
        />
      </Fade>
      <Vec
        a={o}
        b={v}
        tone="blue"
        t="v"
        at={[v[0] + 12, v[1] + 6]}
        anchor="start"
        delay={0.5}
      />
      <Vec
        a={o}
        b={b}
        tone="ink"
        t="B"
        at={[b[0] + 8, b[1] - 6]}
        anchor="start"
        delay={0.65}
      />
      <Vec
        a={o}
        b={f}
        tone="red"
        t="F_{m}"
        at={[f[0] + 12, f[1] + 10]}
        anchor="start"
        delay={0.8}
      />
      <Fade delay={1.2}>
        <text x={100} y={194} textAnchor="middle" className="fz4-lbl fz4-sm">
          indukční čáry <tspan className="fz4-it fz4-b">B</tspan> do dlaně,
        </text>
        <text x={100} y={212} textAnchor="middle" className="fz4-lbl fz4-sm">
          prsty ve směru <tspan className="fz4-it fz4-b">v</tspan> (kladný náboj),
        </text>
        <text x={100} y={230} textAnchor="middle" className="fz4-lbl fz4-sm">
          palec ukáže <tspan className="fz4-it fz4-b">F</tspan>
          <tspan className="fz4-b" fontSize="70%" dy="0.3em">
            m
          </tspan>
        </text>
      </Fade>
    </g>
  );
}

export default function LorentzForce() {
  const compact = useCompact();
  const n = compact.narrow;
  return (
    <Figure
      level={11}
      w={n ? 348 : 556}
      h={n ? 590 : 340}
      max={n ? 420 : 700}
      compact={compact}
      boost={false}
      label={LABEL}
    >
      <Field />
      <Orbit />
      <Fade delay={0.3}>
        <rect x={22} y={4} width={196} height={28} rx={5} className="fz4-tag" />
        <EndOn x={38} y={18} r={7} out={false} tone="ink" />
        <text x={52} y={24} className="fz4-lbl fz4-sm fz4-b">
          <tspan className="fz4-it">B</tspan> míří do nákresny
        </text>
      </Fade>
      <Pop delay={1.4}>
        <rect
          x={CX - 80}
          y={CY - 52}
          width={160}
          height={32}
          rx={6}
          className="fz4-tag-lvl"
        />
        <Qty x={CX} y={CY - 30} s="r = m v / (Q B)" anchor="middle" />
      </Pop>
      <g transform={n ? "translate(74 360)" : "translate(346 90)"}>
        <Triad />
      </g>
    </Figure>
  );
}
