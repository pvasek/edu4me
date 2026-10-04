import {
  Draw,
  DrawArrow,
  Fade,
  Figure,
  Pop,
  Travel,
  f1,
  pat,
  rng,
  useFig,
} from "./kit";

const LABEL =
  "Špička kořene v podélném řezu, zdola nahoru. Na samém konci kořenová čepička, která chrání špičku při prodírání půdou a odlupuje se. Nad ní dělivá zóna s drobnými buňkami, které se rychle dělí. Pak prodlužovací zóna, kde se buňky natahují a tlačí špičku hlouběji. Výš je zóna kořenových vlásků: buňky pokožky z ní vysílají tenké výběžky do půdy. Ve výřezu voda s minerálními látkami obaluje zrnka půdy a vstupuje do kořenového vlásku. Nahoře zóna větvení s postranním kořenem.";

const W = 400;
const H = 560;
const CX = 80;
const HW = 26; // half width of the root
const L = CX - HW;
const R = CX + HW;
const ROOT = `M${L} 14 V430 C${L} 482 ${CX - 14} 522 ${CX} 534 C${CX + 14} 522 ${R} 482 ${R} 430 V14`;
const ROOT_Z = `${ROOT} Z`;

/** zone limits (y) */
const Z = { branch: 14, hair: 88, elong: 292, div: 400, cap: 468, tip: 534 };

function Cells() {
  const { id } = useFig();
  const rows: string[] = [];
  // rows of cells: tall where they elongate, tiny where they divide
  const hRow = (yy: number) =>
    yy > Z.div
      ? 7
      : yy > Z.elong
        ? 7 + ((Z.div - yy) / (Z.div - Z.elong)) * 22
        : 28;
  let yy = Z.cap;
  while (yy > Z.branch) {
    const h = hRow(yy);
    rows.push(`M${L} ${f1(yy)} H${R}`);
    yy -= h;
  }
  const cols = [0.2, 0.4, 0.6, 0.8].map((t) => L + t * HW * 2);
  const colPath = cols.map((x) => `M${f1(x)} ${Z.branch} V${Z.cap}`).join(" ");
  return (
    <g>
      <clipPath id={`${id}-root`}>
        <path d={ROOT_Z} />
      </clipPath>
      <g clipPath={`url(#${id}-root)`}>
        <path d={ROOT_Z} className="bz5-root-f" />
        <rect
          x={L}
          y={Z.div}
          width={HW * 2}
          height={Z.cap - Z.div}
          className="bz5-div-f"
        />
        <path
          d={rows.join(" ") + " " + colPath}
          className="bz5-o bz5-thin"
          style={{ opacity: 0.7 }}
        />
        {/* the central cylinder with water-conducting vessels */}
        <path
          d={`M${CX - 7} ${Z.branch} V${Z.elong + 40} M${CX + 7} ${Z.branch} V${Z.elong + 40}`}
          className="bz5-o bz5-thin"
        />
        <rect
          x={CX - 7}
          y={Z.branch}
          width={14}
          height={Z.elong + 40 - Z.branch}
          fill={pat(id, "v")}
        />
        {/* small nuclei in the dividing cells */}
        {Array.from({ length: 9 }, (_, r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <circle
              key={`${r}-${c}`}
              cx={f1(L + 5.2 + c * 10.4)}
              cy={f1(Z.div + 3.5 + r * 7)}
              r={1.8}
              className="bz5-nuc-dot"
            />
          )),
        )}
      </g>
    </g>
  );
}

function Cap() {
  const R1 = rng(4);
  const cap = `M${L + 2} ${Z.cap} C${L + 2} 498 ${CX - 12} 526 ${CX} 534 C${CX + 12} 526 ${R - 2} 498 ${R - 2} ${Z.cap} Z`;
  return (
    <g>
      <path d={cap} className="bz5-cap-f bz5-o" />
      <path
        d={`M${L + 8} ${Z.cap + 14} Q${CX} ${Z.cap + 24} ${R - 8} ${Z.cap + 14} M${L + 14} ${Z.cap + 32} Q${CX} ${Z.cap + 44} ${R - 14} ${Z.cap + 32} M${CX - 12} ${Z.cap + 50} Q${CX} ${Z.cap + 58} ${CX + 12} ${Z.cap + 50} M${CX} ${Z.cap} V532`}
        className="bz5-o bz5-thin"
      />
      {/* loose cells sloughing off */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = Math.PI * (0.15 + (i / 5) * 0.7);
        const r = 64 + R1() * 6;
        return (
          <ellipse
            key={i}
            cx={f1(CX + Math.cos(a) * r * 0.62)}
            cy={f1(476 + Math.sin(a) * r)}
            rx={4}
            ry={3}
            className="bz5-cap-f bz5-o bz5-thin"
          />
        );
      })}
    </g>
  );
}

function Hairs() {
  const d: string[] = [];
  for (let y = Z.hair + 6; y < Z.elong - 6; y += 10) {
    const len = 6 + ((Z.elong - y) / (Z.elong - Z.hair)) * 40;
    const w = (y % 20) / 10 - 0.5;
    d.push(
      `M${L} ${y} q${f1(-len * 0.5)} ${f1(-3 + w * 4)} ${f1(-len)} ${f1(-6 - w * 3)}`,
    );
    d.push(
      `M${R} ${y + 5} q${f1(len * 0.5)} ${f1(-3 - w * 4)} ${f1(len)} ${f1(-6 + w * 3)}`,
    );
  }
  return <Draw d={d.join(" ")} className="bz5-o bz5-hairs" delay={0.4} />;
}

/** Inset: a root hair among soil grains, water entering it. */
function Inset({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig();
  const grains: [number, number, number, number][] = [
    [cx + 54, cy - 54, 18, 0.3],
    [cx + 58, cy + 12, 16, 1.2],
    [cx - 8, cy - 52, 18, 2.1],
    [cx + 16, cy + 46, 17, 0.8],
    [cx - 58, cy - 12, 15, 1.7],
  ];
  const stone = (x: number, y: number, s: number, rot: number) => {
    const p = Array.from({ length: 7 }, (_, k) => {
      const a = (k / 7) * Math.PI * 2 + rot;
      const rr = s * (0.8 + ((k * 37) % 10) / 30);
      return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr * 0.85)}`;
    });
    return `M${p.join(" L")}Z`;
  };
  const hair = `M${cx - 50} ${cy + 50} C${cx - 20} ${cy + 22} ${cx + 6} ${cy - 4} ${cx + 32} ${cy - 30}`;
  const cell = `M${cx - r - 4} ${cy + 16} L${cx - 6} ${cy + r + 4} L${cx - r - 4} ${cy + r + 4} Z`;
  return (
    <g>
      <clipPath id={`${id}-inset`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} className="bz5-soil-light" />
      <g clipPath={`url(#${id}-inset)`}>
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill={pat(id, "dots")}
          opacity={0.4}
        />
        {grains.map(([x, y, s, rot], i) => (
          <g key={i}>
            <path
              d={stone(x, y, s + 7, rot)}
              className="bz5-water bz5-o bz5-thin bz5-blue-s"
            />
            <path d={stone(x, y, s, rot)} className="bz5-o bz5-grain" />
            <path d={stone(x, y, s, rot)} fill={pat(id, "d")} opacity={0.5} />
          </g>
        ))}
        {/* an epidermis cell of the root and its hair */}
        <path d={cell} className="bz5-o bz5-root-f" />
        <path d={hair} className="bz5-hair-wall" />
        <path d={hair} className="bz5-hair-in" />
        <ellipse
          cx={cx - 12}
          cy={cy + 14}
          rx={5.5}
          ry={3.6}
          transform={`rotate(-42 ${cx - 12} ${cy + 14})`}
          className="bz5-o bz5-thin bz5-nuc"
        />
        {[0, 0.33, 0.66].map((p, i) => (
          <Travel
            key={i}
            path={`M${cx + 30} ${cy - 28} C${cx + 6} ${cy - 4} ${cx - 20} ${cy + 22} ${cx - 50} ${cy + 50}`}
            dur={4}
            phase={p}
            rest={[cx + 22 - i * 24, cy - 20 + i * 22]}
            fade
          >
            <circle r={2.6} className="bz5-drop" />
          </Travel>
        ))}
      </g>
      <DrawArrow
        d={`M${cx + 44} ${cy - 40} L${cx + 36} ${cy - 32}`}
        tone="blue"
        delay={1.6}
      />
      <DrawArrow
        d={`M${cx + 42} ${cy + 8} L${cx + 18} ${cy}`}
        tone="blue"
        delay={1.7}
      />
      <DrawArrow
        d={`M${cx - 6} ${cy - 30} L${cx - 2} ${cy - 10}`}
        tone="blue"
        delay={1.8}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="bz5-o"
        style={{ strokeWidth: 2.4 }}
      />
    </g>
  );
}

const IX = 296;
const IY = 140;
const IR = 84;
const BX = 152; // brackets

function Bracket({ y0, y1, delay }: { y0: number; y1: number; delay: number }) {
  return (
    <Draw
      d={`M${BX - 6} ${y0 + 2} H${BX} V${y1 - 2} H${BX - 6}`}
      className="bz5-o bz5-lvl-s"
      delay={delay}
      style={{ strokeWidth: 1.8 }}
    />
  );
}

export default function RootTip() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={500} replay>
      {/* a side root in the branching zone */}
      <Fade>
        <path
          d={`M${L + 2} 50 C30 58 14 74 6 96 L16 100 C22 82 36 68 ${L + 2} 66 Z`}
          className="bz5-o bz5-root-f"
        />
      </Fade>
      <Fade>
        <Cells />
        <Cap />
        <path d={ROOT} className="bz5-o" style={{ strokeWidth: 2 }} />
      </Fade>
      <Hairs />
      {/* growth arrow */}
      <DrawArrow
        d={`M${CX} ${Z.div - 30} V${Z.div + 20}`}
        tone="lvl"
        delay={1.2}
        className="bz5-ghost"
      />
      {/* zones */}
      <Bracket y0={Z.hair} y1={Z.elong} delay={0.6} />
      <Bracket y0={Z.elong} y1={Z.div} delay={0.7} />
      <Bracket y0={Z.div} y1={Z.cap} delay={0.8} />
      <Bracket y0={Z.cap} y1={Z.tip} delay={0.9} />
      <Fade delay={1}>
        <text x={BX + 10} y={262} className="bz5-lbl bz5-b">
          zóna kořenových
        </text>
        <text x={BX + 10} y={281} className="bz5-lbl bz5-b">
          vlásků <tspan className="bz5-lbl-n bz5-sec">– nasává vodu</tspan>
        </text>
        <text x={BX + 10} y={342} className="bz5-lbl bz5-b">
          prodlužovací zóna
        </text>
        <text x={BX + 10} y={361} className="bz5-lbl bz5-sm">
          buňky se natahují
        </text>
        <text x={BX + 10} y={430} className="bz5-lbl bz5-b">
          dělivá zóna
        </text>
        <text x={BX + 10} y={449} className="bz5-lbl bz5-sm">
          buňky se rychle dělí
        </text>
        <text x={BX + 10} y={500} className="bz5-lbl bz5-b">
          kořenová čepička
        </text>
        <text x={BX + 10} y={519} className="bz5-lbl bz5-sm">
          chrání špičku, odlupuje se
        </text>
      </Fade>
      {/* inset */}
      <Fade delay={0.9}>
        <path
          d={`M${R + 36} 150 L${IX - IR + 4} ${IY + 14}`}
          className="bz5-o bz5-thin bz5-dash"
        />
        <circle
          cx={R + 34}
          cy={150}
          r={9}
          className="bz5-o bz5-thin bz5-dash"
        />
      </Fade>
      <Pop delay={1}>
        <Inset cx={IX} cy={IY} r={IR} />
      </Pop>
      <Fade delay={1.4}>
        <text
          x={IX}
          y={IY - IR - 10}
          textAnchor="middle"
          className="bz5-lbl bz5-b"
        >
          kořenový vlásek
        </text>
        <text
          x={IX + 50}
          y={IY + 52}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b bz5-blue-t bz5-halo"
        >
          voda
        </text>
        <text
          x={IX - 40}
          y={IY - 34}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-halo"
        >
          zrnko půdy
        </text>
        <text
          x={IX - 52}
          y={IY + 74}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-halo bz5-sec"
        >
          buňka
        </text>
      </Fade>
    </Figure>
  );
}
