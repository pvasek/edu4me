import { Arrow, Body, Fade, Figure, Lbl, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Stavba semenné rostliny: kořen v půdě, stonek, listy a květ. Modré šipky: dřevní část cévních svazků (xylém) vede vodu s minerálními látkami od kořene nahoru do listů. Oranžové šipky: lýková část (floém) rozvádí cukry vyrobené v listech do celé rostliny, nahoru ke květu i dolů do kořene. Výřez: kořenové vlásky na konci kořene zvětšují povrch a nasávají z půdy vodu s rozpuštěnými minerálními látkami.";

const W = 420;
const H = 500;
const SX = 140;
const GY = 318;

const LEAF = "M0 0 C-14 -10 -18 -32 0 -52 C18 -32 14 -10 0 0 Z";

function Leaf({ y, rot, s }: { y: number; rot: number; s: number }) {
  return (
    <g transform={`translate(${SX} ${y}) rotate(${rot}) scale(${s})`}>
      <Body d={LEAF} fill="bz1-leaf" />
      <path d="M0 -2 V-48 M0 -12 L-9 -20 M0 -12 L9 -20 M0 -24 L-10 -32 M0 -24 L10 -32 M0 -36 L-6 -42 M0 -36 L6 -42" className="bz1-o bz1-thin" />
    </g>
  );
}

function Plant() {
  const { id } = useFig();
  return (
    <g>
      <rect x={10} y={GY} width={240} height={168} rx={4} className="bz1-soil" />
      <rect x={10} y={GY} width={240} height={168} rx={4} fill={pat(id, "dots")} />
      <path d={`M10 ${GY} H250`} className="bz1-o" />
      {/* roots */}
      <path
        d={`M${SX} ${GY} C${SX - 2} 370 ${SX + 3} 420 ${SX} 470 M${SX} 340 C${SX - 20} 352 ${SX - 40} 362 ${SX - 66} 390 M${SX} 352 C${SX + 24} 362 ${SX + 44} 380 ${SX + 60} 410 M${SX} 392 C${SX - 16} 404 ${SX - 30} 420 ${SX - 40} 448 M${SX} 410 C${SX + 14} 420 ${SX + 26} 436 ${SX + 32} 460 M${SX - 40} 372 L${SX - 52} 400 M${SX + 34} 372 L${SX + 50} 368`}
        className="bz1-o"
        style={{ strokeWidth: 2.4 }}
      />
      {/* stem */}
      <Body d={`M${SX - 5} ${GY} V96 H${SX + 5} V${GY} Z`} fill="bz1-stem" />
      <Leaf y={270} rot={-60} s={1.1} />
      <Leaf y={226} rot={60} s={1.15} />
      <Leaf y={182} rot={-55} s={1} />
      <Leaf y={142} rot={55} s={0.85} />
      {/* flower */}
      <path d={`M${SX} 98 L${SX - 12} 90 M${SX} 98 L${SX + 12} 90`} className="bz1-o" style={{ strokeWidth: 3, stroke: "color-mix(in srgb, var(--green) 70%, var(--ink))" }} />
      {[-60, -30, 0, 30, 60].map((a) => (
        <g key={a} transform={`rotate(${a} ${SX} 92)`}>
          <Body d={`M${SX} 92 C${SX - 12} 80 ${SX - 10} 58 ${SX} 54 C${SX + 10} 58 ${SX + 12} 80 ${SX} 92 Z`} fill="bz1-petal" thin />
        </g>
      ))}
      <circle cx={SX} cy={88} r={6} className="bz1-o bz1-pollen" />
    </g>
  );
}

function RootHairs({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  const R = rng(4);
  const hairs: string[] = [];
  const ux = 0.725;
  const uy = 0.689;
  for (let i = 0; i < 22; i++) {
    const t = 0.08 + (i / 22) * 0.78;
    const px = x - 74 + t * 120;
    const py = y - 70 + t * 114;
    const side = i % 2 ? 1 : -1;
    const l = 12 + R() * 12;
    const nx = uy * side;
    const ny = -ux * side;
    const sx = px + nx * 7;
    const sy = py + ny * 7;
    hairs.push(`M${f1(sx)} ${f1(sy)} q${f1(nx * l * 0.5 - ux * 3)} ${f1(ny * l * 0.5 - uy * 3)} ${f1(nx * l)} ${f1(ny * l)}`);
  }
  const cid = `${id}-hair`;
  return (
    <g>
      <clipPath id={cid}>
        <circle cx={x} cy={y} r={68} />
      </clipPath>
      <circle cx={x} cy={y} r={68} className="bz1-soil" />
      <g clipPath={`url(#${cid})`}>
        <circle cx={x} cy={y} r={68} fill={pat(id, "dots")} />
        {(
          [
            [-40, 30, 9],
            [30, -40, 8],
            [44, 20, 10],
            [-10, 50, 7],
            [-50, -10, 7],
          ] as const
        ).map(([dx, dy, r]) => (
          <g key={dx}>
            <circle cx={x + dx} cy={y + dy} r={r + 3} className="bz1-water" />
            <circle cx={x + dx} cy={y + dy} r={r} className="bz1-o bz1-thin bz1-shell" />
          </g>
        ))}
        <path d={`M${x - 74} ${y - 70} L${x + 46} ${y + 44}`} className="bz1-o" style={{ strokeWidth: 16, stroke: "var(--edge)", strokeLinecap: "round" }} />
        <path d={`M${x - 74} ${y - 70} L${x + 46} ${y + 44}`} style={{ strokeWidth: 13, stroke: "color-mix(in srgb, var(--yellow) 30%, var(--surface))", strokeLinecap: "round", fill: "none" }} />
        <path d={hairs.join(" ")} className="bz1-o" style={{ strokeWidth: 1.3 }} />
      </g>
      <circle cx={x} cy={y} r={68} className="bz1-o" style={{ strokeWidth: 2 }} />
    </g>
  );
}

export default function PlantOrgans() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={580} replay>
      <Fade>
        <Plant />
      </Fade>
      {/* xylem: water up */}
      <Pop delay={0.6}>
        <Arrow d={`M${SX - 2} 456 V112`} tone="blue" className="bz1-vec" />
        <Arrow d={`M${SX + 2} 228 L${SX + 40} 206`} tone="blue" className="bz1-vec" />
      </Pop>
      {/* phloem: sugars from a leaf to the flower and the root */}
      <Pop delay={1}>
        <Arrow d={`M${SX - 44} 246 L${SX - 2} 270`} tone="acc" className="bz1-vec" />
        <Arrow d={`M${SX + 2} 262 V108`} tone="acc" className="bz1-vec" />
        <Arrow d={`M${SX + 2} 276 V440`} tone="acc" className="bz1-vec" />
      </Pop>
      <Fade delay={0.4}>
        <Lbl x={92} y={62} tx={SX - 12} ty={74} anchor="end" className="bz1-b">
          květ
        </Lbl>
        <Lbl x={66} y={176} tx={118} ty={168} anchor="end" className="bz1-b">
          list
        </Lbl>
        <Lbl x={70} y={300} tx={SX - 5} ty={300} anchor="end" className="bz1-b">
          stonek
        </Lbl>
        <Lbl x={60} y={474} tx={SX - 2} ty={462} anchor="end" className="bz1-b bz1-halo">
          kořen
        </Lbl>
      </Fade>
      <Fade delay={0.9}>
        <rect x={212} y={30} width={198} height={132} rx={8} className="bz1-box" />
        <path d="M226 64 V44" className="bz1-arr bz1-arr-blue" />
        <path d="M222 48 L226 40 L230 48 Z" className="bz1-mk bz1-mk-blue" />
        <text x={240} y={52} className="bz1-lbl bz1-b bz1-blue-t">
          dřevní část (xylém)
        </text>
        <text x={240} y={72} className="bz1-lbl bz1-sm">
          voda a minerální látky
        </text>
        <path d="M226 104 V128" className="bz1-arr bz1-arr-acc" />
        <path d="M222 124 L226 132 L230 124 Z" className="bz1-mk bz1-mk-acc" />
        <text x={240} y={112} className="bz1-lbl bz1-b bz1-acc-t">
          lýková část (floém)
        </text>
        <text x={240} y={132} className="bz1-lbl bz1-sm">
          {"cukry z listů do"}
        </text>
        <text x={240} y={150} className="bz1-lbl bz1-sm">
          {"celé rostliny"}
        </text>
      </Fade>
      <Pop delay={1.3}>
        <path d={`M${SX + 30} 460 L262 420`} className="bz1-o bz1-thin bz1-dash" />
        <circle cx={SX + 30} cy={460} r={6} className="bz1-o bz1-thin" />
        <RootHairs x={330} y={390} />
        <text x={330} y={480} textAnchor="middle" className="bz1-lbl bz1-b bz1-halo">
          kořenové vlásky
        </text>
        <Arrow d="M372 360 L352 374" tone="blue" />
        <Arrow d="M300 440 L318 424" tone="blue" />
      </Pop>
    </Figure>
  );
}
