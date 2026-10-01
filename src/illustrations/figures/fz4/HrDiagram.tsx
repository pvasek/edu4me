import { DrawArrow, Fade, Figure, Lbl, Pop, f1, rng } from "./kit";

const LABEL =
  "Hertzsprungův–Russellův diagram. Vodorovně povrchová teplota hvězdy, která klesá zleva doprava: horké modré hvězdy třídy O a B jsou vlevo (30 000 K), chladné červené třídy M vpravo (3 000 K). Svisle svítivost v násobcích svítivosti Slunce od 10⁻⁴ do 10⁶. Asi 90 % hvězd leží na hlavní posloupnosti, pásu od horkých jasných hvězd vlevo nahoře k chladným slabým trpaslíkům vpravo dole; na ní je i Slunce (5 800 K, svítivost 1). Vpravo nahoře jsou chladní, ale velcí a jasní obři, nad nimi napříč diagramem veleobři. Vlevo dole jsou bílí trpaslíci, horcí, ale malí a slabí.";

const X0 = 74;
const X1 = 446;
const Y0 = 34;
const Y1 = 362;
const T_HI = 4.65; // log T at the left edge
const T_LO = 3.42;
const L_LO = -4.5;
const L_HI = 6.5;
const px = (lt: number) => X0 + ((T_HI - lt) / (T_HI - T_LO)) * (X1 - X0);
const py = (ll: number) => Y1 - ((ll - L_LO) / (L_HI - L_LO)) * (Y1 - Y0);
const SUN = [Math.log10(5772), 0] as const;

function color(lt: number) {
  if (lt > 4.3) return "#8fb3ff";
  if (lt > 4.0) return "#c7d8ff";
  if (lt > 3.86) return "#f4f1ea";
  if (lt > 3.77) return "#fff0b0";
  if (lt > 3.68) return "#ffd27a";
  if (lt > 3.58) return "#ffab5a";
  return "#ff7a4a";
}

type Star = { t: number; l: number };
function stars(): Star[] {
  const r = rng(11);
  const out: Star[] = [];
  for (let i = 0; i < 70; i++) {
    const t = 3.5 + r() ** 1.6 * 1.0;
    out.push({ t, l: 7.0 * (t - SUN[0]) + (r() - 0.5) * 0.7 });
  }
  for (let i = 0; i < 12; i++)
    out.push({ t: 3.58 + r() * 0.13, l: 1.3 + r() * 1.5 });
  for (let i = 0; i < 9; i++)
    out.push({ t: 3.52 + r() * 0.85, l: 4.7 + r() * 1.0 });
  for (let i = 0; i < 9; i++) {
    const t = 3.85 + r() * 0.55;
    out.push({ t, l: -2.6 + 2.6 * (t - 4.1) + (r() - 0.5) * 0.5 });
  }
  return out;
}
const STARS = stars();

export default function HrDiagram() {
  const band = `M${f1(px(4.55))} ${f1(py(6.2))} L${f1(px(4.62))} ${f1(py(5.1))} L${f1(px(3.48))} ${f1(py(-2.6))} L${f1(px(3.46))} ${f1(py(-1.4))}Z`;
  const classes: [string, number][] = [
    ["O", 4.56],
    ["B", 4.3],
    ["A", 3.96],
    ["F", 3.84],
    ["G", 3.76],
    ["K", 3.65],
    ["M", 3.52],
  ];
  return (
    <Figure level={12} w={460} h={430} max={600} label={LABEL}>
      <rect
        x={X0}
        y={Y0}
        width={X1 - X0}
        height={Y1 - Y0}
        className="fz4-hr-bg"
      />
      <Fade delay={0.2}>
        <path d={band} className="fz4-hr-band" />
      </Fade>
      {/* axes and ticks */}
      <path d={`M${X0} ${Y0} V${Y1} H${X1}`} className="fz4-o" />
      {[
        [30000, "30 000"],
        [10000, "10 000"],
        [6000, "6 000"],
        [3000, "3 000"],
      ].map(([t, s]) => {
        const x = px(Math.log10(t as number));
        return (
          <g key={s}>
            <path d={`M${f1(x)} ${Y1} v6`} className="fz4-o fz4-thin" />
            <text x={x} y={Y1 + 20} textAnchor="middle" className="fz4-num">
              {s}
            </text>
          </g>
        );
      })}
      {[-4, -2, 0, 2, 4, 6].map((l) => (
        <g key={l}>
          <path d={`M${X0 - 6} ${f1(py(l))} h6`} className="fz4-o fz4-thin" />
          <text x={X0 - 9} y={py(l) + 5} textAnchor="end" className="fz4-num">
            {l === 0 ? "1" : "10"}
            {l !== 0 && (
              <tspan dy="-0.45em" fontSize="72%">
                {l < 0 ? `−${-l}` : l}
              </tspan>
            )}
          </text>
        </g>
      ))}
      {classes.map(([c, lt]) => (
        <text
          key={c}
          x={px(lt)}
          y={Y0 - 10}
          textAnchor="middle"
          className="fz4-eq fz4-b-eq"
        >
          {c}
        </text>
      ))}
      <text
        x={(X0 + X1) / 2}
        y={Y1 + 44}
        textAnchor="middle"
        className="fz4-lbl fz4-b"
      >
        povrchová teplota <tspan className="fz4-it">T</tspan> (K)
      </text>
      <DrawArrow
        d={`M${X0 + 70} ${Y1 + 58} H${X0 + 10}`}
        tone="blue"
        delay={1}
      />
      <text x={X0 + 78} y={Y1 + 63} className="fz4-lbl fz4-sm fz4-blue-t">
        teplejší
      </text>
      <text
        transform={`translate(18 ${(Y0 + Y1) / 2}) rotate(-90)`}
        textAnchor="middle"
        className="fz4-lbl fz4-b"
      >
        svítivost (Slunce = 1)
      </text>
      {/* stars */}
      <Fade delay={0.5}>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={f1(px(s.t))}
            cy={f1(py(s.l))}
            r={f1(2.2 + Math.max(0, s.l + 4) * 0.42)}
            fill={color(s.t)}
            className="fz4-star"
          />
        ))}
      </Fade>
      <Pop delay={1.1}>
        <circle cx={px(SUN[0])} cy={py(SUN[1])} r={7} className="fz4-sunmark" />
        <circle cx={px(SUN[0])} cy={py(SUN[1])} r={2} className="fz4-dot" />
      </Pop>
      <Fade delay={1.2}>
        <Lbl
          x={px(SUN[0]) - 26}
          y={py(SUN[1]) + 40}
          tx={px(SUN[0]) - 4}
          ty={py(SUN[1]) + 6}
          anchor="end"
          className="fz4-b"
        >
          Slunce
        </Lbl>
        <Lbl
          x={86}
          y={224}
          tx={px(4.12)}
          ty={py(1.9)}
          className="fz4-b fz4-lvl-t"
        >
          hlavní posloupnost
        </Lbl>
        <text x={86} y={242} className="fz4-lbl fz4-sm">
          asi 90 % hvězd
        </text>
        <text
          x={px(3.66)}
          y={py(3.35)}
          textAnchor="middle"
          className="fz4-lbl fz4-b"
        >
          obři
        </text>
        <text
          x={px(3.95)}
          y={py(4.3)}
          textAnchor="middle"
          className="fz4-lbl fz4-b"
        >
          veleobři
        </text>
        <text x={px(4.05)} y={py(-3.95)} className="fz4-lbl fz4-b">
          bílí trpaslíci
        </text>
      </Fade>
    </Figure>
  );
}
