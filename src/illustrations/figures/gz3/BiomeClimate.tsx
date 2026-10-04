import { Fade, Figure, Lbl, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Whittakerův diagram: biomy podle průměrné roční teploty (vodorovně, od −15 do 30 °C) a ročního úhrnu srážek (svisle, od 0 do 4 500 mm). Tundra je nejchladnější a suchá (pod −5 °C, do asi 700 mm). Tajga roste mezi −5 a 5 °C. V mírném pásu (5–20 °C) přechází se srážkami poušť ve step, listnatý les a mírný deštný les. V teple nad 20 °C je při malých srážkách poušť, při středních savana a nad asi 2 000 mm tropický deštný les. Česko s průměrnou teplotou 8,3 °C a srážkami 684 mm (ČHMÚ, normál 1991–2020) leží v oblasti listnatého lesa.";

const W = 520;
const H = 470;
const L = 74;
const R = 500;
const T = 30;
const B = 404;
const x = (t: number) => L + ((t + 15) * (R - L)) / 45;
const y = (p: number) => B - (p * (B - T)) / 4500;
const poly = (pts: [number, number][]) =>
  "M" + pts.map(([t, p]) => `${f1(x(t))} ${f1(y(p))}`).join(" L") + "Z";

const BIOMES: { pts: [number, number][]; cls: string; name: string; at: [number, number]; two?: string }[] = [
  { pts: [[-15, 0], [-5, 0], [-5, 700], [-15, 250]], cls: "gz3-ice", name: "tundra", at: [-10, 140] },
  { pts: [[-5, 300], [5, 450], [5, 2000], [-5, 700]], cls: "gz3-conifer", name: "tajga", at: [0, 900] },
  { pts: [[-5, 150], [5, 200], [20, 300], [20, 750], [5, 450], [-5, 300]], cls: "gz3-meadow", name: "step", at: [12.5, 400] },
  { pts: [[-5, 0], [30, 0], [30, 500], [20, 300], [5, 200], [-5, 150]], cls: "gz3-sand", name: "poušť", at: [22, 90] },
  { pts: [[5, 450], [20, 750], [20, 2200], [5, 1500]], cls: "gz3-leaf", name: "listnatý", two: "les", at: [12.5, 1450] },
  { pts: [[5, 1500], [20, 2200], [20, 2900], [5, 2000]], cls: "gz3-mixed", name: "mírný deštný les", at: [12.5, 2180] },
  { pts: [[20, 300], [30, 500], [30, 2400], [20, 1800]], cls: "gz3-savanna", name: "savana", at: [25, 1100] },
  { pts: [[20, 1800], [30, 2400], [30, 4500], [20, 2900]], cls: "gz3-rain", name: "tropický", two: "deštný les", at: [25, 3150] },
];

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* grid and axes */}
      <Fade>
        {[1000, 2000, 3000, 4000].map((p) => (
          <path key={p} d={`M${L} ${f1(y(p))} H${R}`} className="gz3-grid" />
        ))}
        {[-10, -5, 0, 5, 10, 15, 20, 25].map((t) => (
          <path key={t} d={`M${f1(x(t))} ${T} V${B}`} className="gz3-grid" />
        ))}
      </Fade>
      {BIOMES.map((b, i) => (
        <Pop key={b.name} delay={0.1 + i * 0.08}>
          <path d={poly(b.pts)} className={b.cls} />
          <path d={poly(b.pts)} fill={pat(id, "d")} opacity={0.25} />
          <path d={poly(b.pts)} className="gz3-o gz3-thin" />
        </Pop>
      ))}
      <path d={`M${L} ${T - 10} V${B} H${R + 6}`} className="gz3-o" />
      {[0, 1000, 2000, 3000, 4000].map((p) => (
        <text key={p} x={L - 7} y={f1(y(p) + 4.5)} textAnchor="end" className="gz3-num">
          {p === 0 ? "0" : `${p / 1000} 000`}
        </text>
      ))}
      {[-15, -10, -5, 0, 5, 10, 15, 20, 25, 30].map((t) => (
        <g key={t}>
          <path d={`M${f1(x(t))} ${B} v5`} className="gz3-o gz3-thin" />
          <text x={f1(x(t))} y={B + 20} textAnchor="middle" className="gz3-num">
            {t < 0 ? `−${-t}` : t}
          </text>
        </g>
      ))}
      <text x={(L + R) / 2} y={B + 46} textAnchor="middle" className="gz3-lbl gz3-sm">
        průměrná roční teplota (°C)
      </text>
      <text
        x={18}
        y={(T + B) / 2}
        textAnchor="middle"
        transform={`rotate(-90 18 ${(T + B) / 2})`}
        className="gz3-lbl gz3-sm"
      >
        roční srážky (mm)
      </text>

      <Fade delay={0.9}>
        {BIOMES.map((b) => (
          <text key={b.name} x={f1(x(b.at[0]))} y={f1(y(b.at[1]))} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo gz3-biome-t">
            {b.name}
            {b.two && (
              <tspan x={f1(x(b.at[0]))} dy="1.1em">
                {b.two}
              </tspan>
            )}
          </text>
        ))}
      </Fade>
      <Pop delay={1.2}>
        <path
          d={`M${f1(x(8.3))} ${f1(y(684) - 7)} l2 5 h5.5 l-4.5 3.5 l1.8 5.5 l-4.8 -3.4 l-4.8 3.4 l1.8 -5.5 l-4.5 -3.5 h5.5 Z`}
          className="gz3-star"
        />
      </Pop>
      <Fade delay={1.3}>
        <Lbl x={x(-13)} y={y(1500)} tx={x(8.3)} ty={y(684) - 2} className="gz3-b gz3-halo">
          Česko
        </Lbl>
        <text x={x(-13)} y={f1(y(1500) + 16)} className="gz3-lbl gz3-sm gz3-halo">
          8,3 °C, 684 mm
        </text>
      </Fade>
    </>
  );
}

export default function BiomeClimate() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
