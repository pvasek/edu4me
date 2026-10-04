import {
  Fade,
  Frame,
  Lbl,
  Plates,
  Pop,
  Draw,
  ScaleBar,
  f1,
  pat,
  useFig,
} from "./kit";

const LABEL =
  "Dva viry v řezu. Vlevo virus bez obalu: kapsida z bílkovinných dílků (kapsomer) ve tvaru dvacetistěnu chrání uvnitř stočenou nukleovou kyselinu, DNA nebo RNA. Vpravo obalený virus, jako je virus oparu (herpes): kapsidu ve tvaru dvacetistěnu s DNA kryje obal z tuků vypůjčený z buňky a z obalu trčí bílkovinné výběžky, kterými se virus přichytí k buňce. Dole srovnání velikostí ve stejném měřítku: bakterie dlouhá 2 µm, virus chřipky 0,1 µm a virus obrny 0,03 µm.";

/** Corners of a regular hexagon (an icosahedron seen along a 3-fold axis). */
const hexPts = (
  cx: number,
  cy: number,
  r: number,
  rot = 0,
): [number, number][] =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 + rot;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
const poly = (p: [number, number][]) =>
  `M${p.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(" L")}Z`;

/** Coiled nucleic acid inside a capsid. */
function Coil({
  cx,
  cy,
  r,
  cls = "bz5-rna",
}: {
  cx: number;
  cy: number;
  r: number;
  cls?: string;
}) {
  let d = "";
  const n = 180;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 6;
    const rr =
      r *
      (0.5 + 0.28 * Math.sin((7 * a) / 3 + 1) + 0.16 * Math.sin((11 * a) / 5));
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr * 0.9;
    d += `${i ? " L" : "M"}${f1(x)} ${f1(y)}`;
  }
  return (
    <Draw d={d} className={cls} delay={0.5} style={{ strokeWidth: 1.5 }} />
  );
}

/** Icosahedral capsid in projection: outline, face edges and capsomeres. */
function Capsid({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig();
  const P = hexPts(cx, cy, r, Math.PI / 6);
  // capsomeres along the outline
  const caps: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const [x0, y0] = P[i];
    const [x1, y1] = P[(i + 1) % 6];
    for (let k = 0; k < 5; k++) {
      const t = k / 5;
      caps.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    }
  }
  return (
    <g>
      <path d={poly(P)} className="bz5-virus" />
      <path d={poly(P)} fill={pat(id, "d")} opacity={0.35} />
      <path
        d={poly(P.map(([x, y]) => [cx + (x - cx) * 0.8, cy + (y - cy) * 0.8]))}
        className="bz5-cyto bz5-o bz5-thin"
      />
      {caps.map(([x, y], i) => (
        <circle
          key={i}
          cx={f1(x)}
          cy={f1(y)}
          r={r * 0.085}
          className="bz5-o bz5-thin bz5-capso"
        />
      ))}
      <path d={poly(P)} className="bz5-o" />
    </g>
  );
}

function Naked() {
  const cx = 130;
  const cy = 150;
  return (
    <Frame w={300} h={300} title="Virus bez obalu">
      <Pop delay={0.05}>
        <Capsid cx={cx} cy={cy} r={86} />
      </Pop>
      <Coil cx={cx} cy={cy} r={50} cls="bz5-dna" />
      <Fade delay={0.8}>
        <Lbl x={168} y={28} tx={160} ty={78} className="bz5-b">
          {"kapsida\nz bílkovin"}
        </Lbl>
        <Lbl x={222} y={130} tx={cx + 70} ty={cy - 30} className="bz5-sm">
          {"dílek\n(kapsomera)"}
        </Lbl>
        <Lbl
          x={204}
          y={258}
          tx={cx + 20}
          ty={cy + 22}
          className="bz5-b bz5-violet-t"
        >
          {"DNA\nnebo RNA"}
        </Lbl>
        <text x={14} y={290} className="bz5-lbl bz5-sm bz5-muted-t">
          např. adenovirus, virus obrny
        </text>
      </Fade>
    </Frame>
  );
}

function Enveloped() {
  const { id } = useFig();
  const cx = 140;
  const cy = 152;
  const R = 84;
  const spikes = Array.from(
    { length: 18 },
    (_, i) => (i / 18) * Math.PI * 2 + 0.1,
  );
  return (
    <Frame w={300} h={300} title="Virus s obalem">
      <Pop delay={0.05}>
        {spikes.map((a, i) => {
          const x0 = cx + Math.cos(a) * R;
          const y0 = cy + Math.sin(a) * R;
          const x1 = cx + Math.cos(a) * (R + 15);
          const y1 = cy + Math.sin(a) * (R + 15);
          return (
            <g key={i}>
              <path
                d={`M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}`}
                className="bz5-o"
                style={{ strokeWidth: 2.2 }}
              />
              {i % 2 ? (
                <circle
                  cx={f1(x1)}
                  cy={f1(y1)}
                  r={4}
                  className="bz5-o bz5-thin bz5-lvl-fill"
                />
              ) : (
                <path
                  d={`M${f1(x1 - Math.sin(a) * 4)} ${f1(y1 + Math.cos(a) * 4)} L${f1(x1 + Math.sin(a) * 4)} ${f1(y1 - Math.cos(a) * 4)}`}
                  className="bz5-o bz5-lvl-s"
                  style={{ strokeWidth: 3.2 }}
                />
              )}
            </g>
          );
        })}
        {/* lipid envelope: a double line */}
        <circle cx={cx} cy={cy} r={R} className="bz5-envelope" />
        <circle cx={cx} cy={cy} r={R} fill={pat(id, "dots")} opacity={0.5} />
        <circle cx={cx} cy={cy} r={R} className="bz5-o" />
        <circle cx={cx} cy={cy} r={R - 6} className="bz5-o bz5-thin" />
      </Pop>
      <Pop delay={0.25}>
        <Capsid cx={cx} cy={cy} r={52} />
      </Pop>
      <Coil cx={cx} cy={cy} r={30} cls="bz5-dna" />
      <Fade delay={0.8}>
        <Lbl
          x={176}
          y={22}
          tx={cx + 34}
          ty={cy - R - 10}
          className="bz5-b bz5-lvl-t"
        >
          {"bílkovinné\nvýběžky"}
        </Lbl>
        <Lbl x={14} y={30} tx={cx - 62} ty={cy - 58} className="bz5-b">
          {"obal\nz tuků"}
        </Lbl>
        <Lbl x={236} y={232} tx={cx + 36} ty={cy + 30} className="bz5-sm">
          kapsida
        </Lbl>
        <Lbl
          x={14}
          y={268}
          tx={cx - 10}
          ty={cy + 8}
          className="bz5-b bz5-violet-t"
        >
          DNA
        </Lbl>
        <text
          x={290}
          y={292}
          textAnchor="end"
          className="bz5-lbl bz5-sm bz5-muted-t"
        >
          např. virus oparu (herpes)
        </text>
      </Fade>
    </Frame>
  );
}

function Sizes() {
  const { id } = useFig();
  const PX = 150; // px per µm
  const bx = 20;
  const by = 80;
  const len = 2 * PX;
  return (
    <Frame w={420} h={190} title="Stejné měřítko" area="1 / -1" max={470}>
      <Pop delay={0.1}>
        <rect
          x={bx}
          y={by - 34}
          width={len}
          height={68}
          rx={34}
          className="bz5-bact"
        />
        <rect
          x={bx}
          y={by - 34}
          width={len}
          height={68}
          rx={34}
          fill={pat(id, "dots")}
          opacity={0.5}
        />
        <rect
          x={bx}
          y={by - 34}
          width={len}
          height={68}
          rx={34}
          className="bz5-o"
          style={{ strokeWidth: 2.4 }}
        />
        <path
          d={`M${bx + 90} ${by} c12 -14 30 10 44 -2 c14 -12 30 12 46 0`}
          className="bz5-dna"
        />
        <path
          d={`M${bx + len} ${by} c18 -10 30 14 50 2 c12 -7 22 -4 30 4`}
          className="bz5-o bz5-thin"
        />
      </Pop>
      {/* influenza (0,1 µm) and polio (0,03 µm) at the same scale */}
      <Pop delay={0.5}>
        <circle
          cx={bx + len + 22}
          cy={by + 54}
          r={0.05 * PX}
          className="bz5-o bz5-thin bz5-virus"
        />
        <circle
          cx={bx + len + 58}
          cy={by + 54}
          r={0.015 * PX}
          className="bz5-red-fill"
        />
      </Pop>
      <Fade delay={0.8}>
        <text
          x={bx + len / 2}
          y={by - 44}
          textAnchor="middle"
          className="bz5-lbl bz5-b"
        >
          bakterie <tspan className="bz5-eq">2 µm</tspan>
        </text>
        <Lbl
          x={bx + len - 8}
          y={by + 60}
          tx={bx + len + 13}
          ty={by + 54}
          anchor="end"
          className="bz5-red-t"
        >
          chřipka 0,1 µm
        </Lbl>
        <Lbl
          x={406}
          y={by + 100}
          tx={bx + len + 58}
          ty={by + 57}
          anchor="end"
          className="bz5-red-t"
        >
          obrna 0,03 µm
        </Lbl>
        <ScaleBar x={bx} y={by + 76} len={PX} text="1 µm" />
      </Fade>
    </Frame>
  );
}

export default function VirusStructure() {
  return (
    <Plates label={LABEL} level={2} max={640} cols="1fr 1fr" stackBelow={500}>
      <Naked />
      <Enveloped />
      <Sizes />
    </Plates>
  );
}
