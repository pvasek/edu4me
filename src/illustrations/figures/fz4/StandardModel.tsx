import { ChemText, Fade, Figure, Pop, useCompact } from "./kit";

const LABEL =
  "Standardní model částic. Částice hmoty (fermiony) ve třech generacích: kvarky u (up), c (charm) a t (top) s nábojem +2/3 e; kvarky d (down), s (strange) a b (bottom) s nábojem −1/3 e; leptony elektron, mion a tauon s nábojem −e; tři neutrina ν_e, ν_μ a ν_τ bez náboje. Nositelé interakcí (kalibrační bosony): gluon g (silná interakce, náboj 0), foton γ (elektromagnetická, 0), bozon Z (slabá, 0) a bozony W⁺ a W⁻ (slabá, ±1). Higgsův boson H má náboj 0. Běžná hmota je jen z první generace: kvarků u, d a elektronu.";

type Kind = "q" | "l" | "b" | "h";
interface P {
  s: string;
  name: string;
  q: string;
  k: Kind;
}
const GEN: P[][] = [
  [
    { s: "u", name: "up", q: "+2/3", k: "q" },
    { s: "d", name: "down", q: "−1/3", k: "q" },
    { s: "e", name: "elektron", q: "−1", k: "l" },
    { s: "ν_{e}", name: "neutrino", q: "0", k: "l" },
  ],
  [
    { s: "c", name: "charm", q: "+2/3", k: "q" },
    { s: "s", name: "strange", q: "−1/3", k: "q" },
    { s: "μ", name: "mion", q: "−1", k: "l" },
    { s: "ν_{μ}", name: "neutrino", q: "0", k: "l" },
  ],
  [
    { s: "t", name: "top", q: "+2/3", k: "q" },
    { s: "b", name: "bottom", q: "−1/3", k: "q" },
    { s: "τ", name: "tauon", q: "−1", k: "l" },
    { s: "ν_{τ}", name: "neutrino", q: "0", k: "l" },
  ],
];
const BOSONS: P[] = [
  { s: "g", name: "gluon", q: "0", k: "b" },
  { s: "γ", name: "foton", q: "0", k: "b" },
  { s: "Z", name: "bozon Z", q: "0", k: "b" },
  { s: "W^{±}", name: "bozon W", q: "±1", k: "b" },
];
const HIGGS: P = { s: "H", name: "Higgsův boson", q: "0", k: "h" };

function Cell({
  x,
  y,
  w,
  h,
  p,
  delay,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  p: P;
  delay: number;
}) {
  return (
    <Pop delay={delay}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        className={`fz4-smd-cell fz4-smd-${p.k}`}
      />
      <text x={x + 7} y={y + 16} className="fz4-smd-ch">
        {p.q}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 9}
        textAnchor="middle"
        className="fz4-smd-s"
      >
        <ChemText text={p.s} />
      </text>
      <text
        x={x + w / 2}
        y={y + h - 9}
        textAnchor="middle"
        className="fz4-smd-n"
      >
        {p.name}
      </text>
    </Pop>
  );
}

function Side({
  x,
  y,
  h,
  t,
  k,
}: {
  x: number;
  y: number;
  h: number;
  t: string;
  k: Kind;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={18}
        height={h}
        rx={5}
        className={`fz4-smd-${k} fz4-smd-side`}
      />
      <text
        transform={`translate(${x + 13} ${y + h / 2}) rotate(-90)`}
        textAnchor="middle"
        className="fz4-smd-side-t"
      >
        {t}
      </text>
    </g>
  );
}

export default function StandardModel() {
  const compact = useCompact();
  const n = compact.narrow;
  // fermion grid
  const cw = n ? 96 : 88;
  const ch = n ? 76 : 74;
  const gx = (i: number) => (n ? 30 : 30) + i * (cw + 5);
  const gy = (r: number) => 40 + r * (ch + 5);
  const bottom = gy(4) - 5;
  const legendY = n ? 508 : bottom + 30;
  return (
    <Figure
      level={12}
      w={n ? 340 : 540}
      h={n ? 564 : legendY + 52}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      label={LABEL}
    >
      {["I", "II", "III"].map((g, i) => (
        <text
          key={g}
          x={gx(i) + cw / 2}
          y={30}
          textAnchor="middle"
          className="fz4-lbl fz4-b"
        >
          {g}. generace
        </text>
      ))}
      <Side x={8} y={gy(0)} h={2 * ch + 5} t="kvarky" k="q" />
      <Side x={8} y={gy(2)} h={2 * ch + 5} t="leptony" k="l" />
      {GEN.map((col, i) =>
        col.map((p, r) => (
          <Cell
            key={p.s}
            x={gx(i)}
            y={gy(r)}
            w={cw}
            h={ch}
            p={p}
            delay={0.1 + i * 0.12 + r * 0.05}
          />
        )),
      )}
      {/* ordinary matter = first generation */}
      <Fade delay={1}>
        <rect
          x={gx(0) - 3}
          y={gy(0) - 3}
          width={cw + 6}
          height={3 * ch + 16}
          rx={9}
          className="fz4-smd-matter"
        />
      </Fade>
      {n ? (
        <g>
          <text x={170} y={398} textAnchor="middle" className="fz4-lbl fz4-b">
            nositelé interakcí a Higgsův boson
          </text>
          {[...BOSONS, { ...HIGGS, name: "Higgs" }].map((p, i) => (
            <Cell
              key={p.s}
              x={8 + i * 66}
              y={406}
              w={62}
              h={76}
              p={{ ...p, name: p.name.replace("bozon ", "") }}
              delay={0.6 + i * 0.06}
            />
          ))}
        </g>
      ) : (
        <g>
          <text
            x={gx(3) + 6 + cw / 2}
            y={30}
            textAnchor="middle"
            className="fz4-lbl fz4-b"
          >
            bosony
          </text>
          {BOSONS.map((p, r) => (
            <Cell
              key={p.s}
              x={gx(3) + 6}
              y={gy(r)}
              w={cw}
              h={ch}
              p={p}
              delay={0.6 + r * 0.06}
            />
          ))}
          <Cell x={gx(4) + 10} y={gy(0)} w={cw} h={ch} p={HIGGS} delay={0.9} />
          <text
            x={gx(4) + 10 + cw / 2}
            y={gy(1) + 20}
            textAnchor="middle"
            className="fz4-lbl fz4-sm"
          >
            dává částicím
          </text>
          <text
            x={gx(4) + 10 + cw / 2}
            y={gy(1) + 38}
            textAnchor="middle"
            className="fz4-lbl fz4-sm"
          >
            hmotnost
          </text>
        </g>
      )}
      <Fade delay={1.1}>
        <text x={n ? 10 : 30} y={legendY} className="fz4-lbl fz4-sm">
          <tspan className="fz4-b fz4-lvl-t">rámeček: běžná hmota</tspan> (u, d,
          elektron)
        </text>
        <text x={n ? 10 : 30} y={legendY + 20} className="fz4-lbl fz4-sm">
          náboj je uveden v násobcích e
        </text>
        <text x={n ? 10 : 30} y={legendY + 40} className="fz4-lbl fz4-sm">
          g silná, γ elektromagnetická, Z a W slabá interakce
        </text>
      </Fade>
    </Figure>
  );
}
