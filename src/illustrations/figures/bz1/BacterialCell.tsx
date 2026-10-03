import { Body, Draw, Fade, Figure, Lbl, Pop, ScaleBar, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Bakteriální buňka (prokaryotní) v řezu: na povrchu pevná buněčná stěna, pod ní cytoplazmatická membrána, uvnitř cytoplazma s ribozomy. Bakterie nemá jádro, její DNA leží volně v cytoplazmě jako nukleoid, vedle něj malé kruhové plazmidy. Na povrchu krátká vlákna pili (fimbrie), kterými se přichytí, a dlouhý bičík, kterým plave. Bakterie je dlouhá asi 2 µm. Dole tři základní tvary bakterií: kulovité koky, tyčinky a spirálovité spirily.";

const W = 440;
const H = 420;
const X0 = 50;
const X1 = 296;
const Y0 = 78;
const Y1 = 176;
const R = (Y1 - Y0) / 2;
const CY = (Y0 + Y1) / 2;

const stadium = (k: number) =>
  `M${X0 + R} ${Y0 + k} H${X1 - R} A${R - k} ${R - k} 0 0 1 ${X1 - R} ${Y1 - k} H${X0 + R} A${R - k} ${R - k} 0 0 1 ${X0 + R} ${Y0 + k} Z`;

function wave(x0: number, y0: number, len: number, amp: number, lambda: number) {
  const pts: string[] = [];
  for (let s = 0; s <= len; s += 3) pts.push(`${f1(x0 + s)} ${f1(y0 + amp * Math.sin((2 * Math.PI * s) / lambda) * Math.min(1, s / 20))}`);
  return "M" + pts.join(" L");
}

function Bacterium() {
  const { id } = useFig();
  const R2 = rng(7);
  const pili = Array.from({ length: 16 }, (_, i) => {
    const t = i / 16;
    // walk around the outline
    const per = 2 * (X1 - X0 - 2 * R) + 2 * Math.PI * R;
    let s = t * per + 20;
    let x = 0;
    let y = 0;
    let nx = 0;
    let ny = 0;
    const top = X1 - X0 - 2 * R;
    if (s < top) {
      x = X0 + R + s;
      y = Y0;
      ny = -1;
    } else if ((s -= top) < Math.PI * R) {
      const a = -Math.PI / 2 + s / R;
      x = X1 - R + Math.cos(a) * R;
      y = CY + Math.sin(a) * R;
      nx = Math.cos(a);
      ny = Math.sin(a);
    } else if ((s -= Math.PI * R) < top) {
      x = X1 - R - s;
      y = Y1;
      ny = 1;
    } else {
      s -= top;
      const a = Math.PI / 2 + s / R;
      x = X0 + R + Math.cos(a) * R;
      y = CY + Math.sin(a) * R;
      nx = Math.cos(a);
      ny = Math.sin(a);
    }
    const l = 9 + R2() * 6;
    return `M${f1(x)} ${f1(y)} l${f1(nx * l + (R2() - 0.5) * 4)} ${f1(ny * l + (R2() - 0.5) * 4)}`;
  });
  const ribo = Array.from({ length: 34 }, () => [X0 + 26 + R2() * (X1 - X0 - 52), Y0 + 18 + R2() * (Y1 - Y0 - 36)]);
  return (
    <g>
      {/* flagellum */}
      <g className="bz1-wiggle">
        <path d={wave(X1 - 2, CY + 6, 130, 9, 42)} className="bz1-o" style={{ strokeWidth: 2 }} />
      </g>
      <path d={pili.join(" ")} className="bz1-o bz1-thin" />
      <Body d={`${stadium(0)} ${stadium(7)}`} fill="bz1-wall" hatch="d" style={{ fillRule: "evenodd" }} />
      <path d={stadium(7)} className="bz1-bact" />
      <path d={stadium(7)} fill={pat(id, "dots")} opacity={0.35} />
      <path d={stadium(10)} className="bz1-o bz1-thin" />
      {ribo.map(([x, y], i) => (
        <circle key={i} cx={f1(x)} cy={f1(y)} r={1.9} className="bz1-ribo" />
      ))}
      {/* nucleoid: a tangled loop of DNA without a membrane */}
      <path
        d="M128 128 C120 104 150 98 168 108 C186 118 172 136 190 140 C214 146 226 124 212 112 C198 100 176 112 170 128 C164 146 140 152 132 140 C126 132 146 118 156 126 C166 134 150 146 146 136"
        className="bz1-dna"
        style={{ strokeWidth: 2 }}
      />
      <circle cx={246} cy={110} r={8} className="bz1-dna" />
      <circle cx={236} cy={150} r={6} className="bz1-dna" />
    </g>
  );
}

function Coccus({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} className="bz1-o bz1-bact" />;
}
function Rod({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return <rect x={x - 22} y={y - 8} width={44} height={16} rx={8} transform={`rotate(${rot} ${x} ${y})`} className="bz1-o bz1-bact" />;
}

export default function BacterialCell() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={600} replay>
      <Pop>
        <Bacterium />
      </Pop>
      <Fade delay={0.6}>
        <Lbl x={20} y={30} tx={X0 + 30} ty={Y0 + 9} className="bz1-b">
          buněčná stěna
        </Lbl>
        <Lbl x={160} y={30} tx={148} ty={Y0 + 10}>
          membrána
        </Lbl>
        <Lbl x={262} y={34} tx={233} ty={Y0 - 9}>
          {"pili (fimbrie)"}
        </Lbl>
        <Lbl x={352} y={178} tx={X1 + 50} ty={CY + 15} className="bz1-b">
          bičík
        </Lbl>
        <Lbl x={20} y={214} tx={132} ty={140} className="bz1-b">
          {"nukleoid\n(DNA bez jádra)"}
        </Lbl>
        <Lbl x={176} y={214} tx={236} ty={156}>
          plazmid
        </Lbl>
        <Lbl x={262} y={214} tx={262} ty={160} sec>
          ribozomy
        </Lbl>
        <ScaleBar x={296} y={236} len={123} text="1 µm" />
      </Fade>
      <Draw d={`M14 262 H${W - 14}`} className="bz1-o bz1-thin bz1-dash" delay={0.8} />
      <Fade delay={1}>
        <text x={W / 2} y={286} textAnchor="middle" className="bz1-title">
          Tvary bakterií
        </text>
        {/* cocci: a chain and a cluster */}
        {[0, 1, 2, 3].map((i) => (
          <Coccus key={i} x={30 + i * 18} y={318} />
        ))}
        {(
          [
            [86, 346],
            [104, 344],
            [94, 330],
            [96, 360],
            [112, 360],
          ] as const
        ).map(([x, y], i) => (
          <Coccus key={`c${i}`} x={x} y={y} />
        ))}
        <Rod x={196} y={318} rot={-10} />
        <Rod x={246} y={330} rot={20} />
        <Rod x={206} y={352} rot={4} />
        {[0, 1].map((i) => (
          <path
            key={i}
            d={wave(318 + i * 10, 318 + i * 30, 88, 8, 24)}
            className="bz1-o"
            style={{ strokeWidth: 7, stroke: "var(--edge)" }}
          />
        ))}
        {[0, 1].map((i) => (
          <path
            key={`s${i}`}
            d={wave(318 + i * 10, 318 + i * 30, 88, 8, 24)}
            style={{ strokeWidth: 4, fill: "none", stroke: "color-mix(in srgb, var(--teal) 30%, var(--surface))", strokeLinecap: "round" }}
          />
        ))}
        <text x={74} y={398} textAnchor="middle" className="bz1-lbl bz1-b">
          koky
        </text>
        <text x={220} y={398} textAnchor="middle" className="bz1-lbl bz1-b">
          tyčinky
        </text>
        <text x={366} y={398} textAnchor="middle" className="bz1-lbl bz1-b">
          spirily
        </text>
      </Fade>
    </Figure>
  );
}
