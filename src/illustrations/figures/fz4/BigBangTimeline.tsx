import { ChemText, Draw, Fade, Figure, Pop, f1, rng, useCompact } from "./kit";

const LABEL =
  "Dějiny vesmíru od velkého třesku po dnešek; časová osa není v měřítku. Vesmír se rozpíná, jeho šířka v obrázku roste. Velký třesk před 13,8 miliardy let, hned poté inflace – prudké rozepnutí mezi 10⁻³⁶ a 10⁻³² s. Během prvních asi 3 minut vznikla jádra vodíku a helia. Asi 380 000 let po třesku vychladlo plazma na asi 3 000 K, vznikly atomy, vesmír se stal průhledným a uvolnilo se reliktní záření. Pak nastaly temné věky, první hvězdy se rozzářily asi po 200 milionech let a galaxie vznikaly přibližně do 1 miliardy let. Slunce a Země vznikly 9,2 miliardy let po třesku, dnes je vesmíru 13,8 miliardy let a reliktní záření má teplotu 2,7 K.";

interface M {
  p: number;
  name: string;
  time: string;
}
const MS: M[] = [
  { p: 0, name: "velký třesk", time: "t = 0" },
  { p: 0.09, name: "inflace", time: "10^{−36} až 10^{−32} s" },
  { p: 0.22, name: "jádra H a He", time: "první 3 minuty" },
  { p: 0.38, name: "reliktní záření", time: "380 000 let, 3 000 K" },
  { p: 0.54, name: "první hvězdy", time: "asi 200 mil. let" },
  { p: 0.69, name: "galaxie", time: "asi 1 mld. let" },
  { p: 0.84, name: "Slunce a Země", time: "9,2 mld. let" },
  { p: 1, name: "dnes", time: "13,8 mld. let, 2,7 K" },
];

/** Half-width of the Universe at time p (0–1): inflation, steady growth, late speed-up. */
const half = (p: number) =>
  p < 0.09
    ? 2 + 26 * (p / 0.09) ** 1.6
    : 28 + 54 * ((p - 0.09) / 0.91) + 12 * Math.max(0, (p - 0.7) / 0.3) ** 2;

type Pt = [number, number];

function layout(n: boolean) {
  // wide: time runs to the right; narrow: time runs down
  const at = (p: number, off: number): Pt =>
    n ? [96 + off * 0.7, 44 + p * 478] : [34 + p * 596, 152 + off];
  return at;
}

const DOTS = (() => {
  const r = rng(5);
  return Array.from({ length: 150 }, () => ({
    p: r(),
    u: r() * 2 - 1,
    s: r(),
  }));
})();

function Universe({ n }: { n: boolean }) {
  const at = layout(n);
  const steps = Array.from({ length: 81 }, (_, i) => i / 80);
  const top = steps.map((p) => at(p, -half(p)));
  const bot = steps.map((p) => at(p, half(p))).reverse();
  const outline =
    "M" +
    [...top, ...bot].map((q) => `${f1(q[0])} ${f1(q[1])}`).join(" L") +
    "Z";
  const seg = (p0: number, p1: number) => {
    const s = steps.filter((p) => p >= p0 && p <= p1);
    const a = s.map((p) => at(p, -half(p)));
    const b = s.map((p) => at(p, half(p))).reverse();
    return (
      "M" + [...a, ...b].map((q) => `${f1(q[0])} ${f1(q[1])}`).join(" L") + "Z"
    );
  };
  return (
    <g>
      <path d={seg(0, 0.385)} className="fz4-bb-hot" />
      <path d={seg(0.375, 0.54)} className="fz4-bb-dark" />
      <path d={seg(0.53, 1)} className="fz4-bb-space" />
      {/* the CMB release */}
      <path d={seg(0.37, 0.4)} className="fz4-bb-cmb" />
      <Fade delay={0.6}>
        {DOTS.map((d, i) => {
          const p = d.p;
          if (p < 0.12 || (p > 0.36 && p < 0.56)) return null;
          const q = at(p, d.u * half(p) * 0.82);
          if (p < 0.36)
            return (
              <circle
                key={i}
                cx={f1(q[0])}
                cy={f1(q[1])}
                r={1.3}
                className="fz4-bb-plasma"
              />
            );
          if (p < 0.69)
            return d.s < 0.5 ? (
              <circle
                key={i}
                cx={f1(q[0])}
                cy={f1(q[1])}
                r={1.6}
                className="fz4-bb-star"
              />
            ) : null;
          return d.s < 0.32 ? (
            <ellipse
              key={i}
              cx={f1(q[0])}
              cy={f1(q[1])}
              rx={4}
              ry={1.8}
              transform={`rotate(${f1(d.s * 400)} ${f1(q[0])} ${f1(q[1])})`}
              className="fz4-bb-galaxy"
            />
          ) : d.s < 0.6 ? (
            <circle
              key={i}
              cx={f1(q[0])}
              cy={f1(q[1])}
              r={1.2}
              className="fz4-bb-star"
            />
          ) : null;
        })}
      </Fade>
      <Draw d={outline} className="fz4-o fz4-bb-edge" delay={0} />
      <circle cx={at(0, 0)[0]} cy={at(0, 0)[1]} r={4} className="fz4-bb-bang" />
    </g>
  );
}

function Labels({ n }: { n: boolean }) {
  const at = layout(n);
  return (
    <Fade delay={1}>
      {MS.map((m, i) => {
        const up = i % 2 === 0;
        if (n) {
          const [, y] = at(m.p, 0);
          const edge = at(m.p, half(m.p));
          return (
            <g key={m.name}>
              <path
                d={`M${f1(edge[0] + 4)} ${f1(y)} H190`}
                className="fz4-lead"
              />
              <circle cx={at(m.p, 0)[0]} cy={y} r={2.5} className="fz4-dot" />
              <text x={196} y={y} className="fz4-lbl fz4-b">
                {m.name}
              </text>
              <text x={196} y={y + 17} className="fz4-eq fz4-eq-sm">
                <ChemText text={m.time} />
              </text>
            </g>
          );
        }
        const [x] = at(m.p, 0);
        const edge = at(m.p, up ? -half(m.p) : half(m.p));
        const ty = up ? 24 : 278;
        const anchor =
          i === 0 ? "start" : i === MS.length - 1 ? "end" : "middle";
        const tx = i === 0 ? x - 6 : x;
        return (
          <g key={m.name}>
            <path
              d={`M${f1(x)} ${f1(edge[1] + (up ? -4 : 4))} V${up ? ty + 22 : ty - 18}`}
              className="fz4-lead"
            />
            <text
              x={tx}
              y={up ? ty : ty + 2}
              textAnchor={anchor}
              className="fz4-lbl fz4-b"
            >
              {m.name}
            </text>
            <text
              x={tx}
              y={up ? ty + 16 : ty + 18}
              textAnchor={anchor}
              className="fz4-eq fz4-eq-sm"
            >
              <ChemText text={m.time} />
            </text>
          </g>
        );
      })}
    </Fade>
  );
}

export default function BigBangTimeline() {
  const compact = useCompact();
  const n = compact.narrow;
  return (
    <Figure
      level={12}
      w={n ? 340 : 664}
      h={n ? 560 : 322}
      max={n ? 420 : 780}
      compact={compact}
      boost={false}
      label={LABEL}
    >
      <Universe n={n} />
      <Labels n={n} />
      <Pop delay={1.3}>
        <text x={10} y={n ? 554 : 318} className="fz4-lbl fz4-sm fz4-muted-t">
          časová osa není v měřítku
        </text>
      </Pop>
    </Figure>
  );
}
