import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, Tree, f1, pat, useFig } from "./kit";

const LABEL =
  "Čtyři stadia vývoje měst. Urbanizace: lidé se stěhují z venkova do města a nejrychleji roste jádro. Suburbanizace: lidé odcházejí z jádra do zázemí za městem, roste zázemí a jádro ztrácí obyvatele. Desurbanizace: ubývá obyvatel jádra i zázemí, lidé odcházejí do menších měst a na venkov. Reurbanizace: lidé se vracejí do obnoveného jádra.";

const W = 300;
const H = 202;
const C: [number, number] = [150, 88];
const RC = 30; // core
const RZ = 62; // hinterland (zázemí)
const pol = (r: number, deg: number): [number, number] => [
  C[0] + r * Math.cos((deg * Math.PI) / 180),
  C[1] + r * Math.sin((deg * Math.PI) / 180),
];

type Trend = "up2" | "up" | "down" | "down2";

function Scene({ arrows, core, ring }: { arrows: [number, number][]; core: Trend; ring: Trend }) {
  const { id } = useFig();
  const ang = [-150, -30, 30, 150];
  return (
    <>
      {/* countryside */}
      <rect x={4} y={4} width={W - 8} height={170} rx={8} className="gz4-grass" />
      <rect x={4} y={4} width={W - 8} height={170} rx={8} fill={pat(id, "dots")} opacity={0.5} />
      <Tree x={22} y={34} s={0.75} />
      <Tree x={34} y={40} s={0.6} />
      <Tree x={274} y={160} s={0.75} />
      <Tree x={262} y={164} s={0.6} />
      <rect x={256} y={14} width={30} height={20} className="gz4-field gz4-o gz4-thin" />
      <rect x={14} y={142} width={28} height={20} className="gz4-field gz4-o gz4-thin" />
      {/* hinterland ring with family houses */}
      <circle cx={C[0]} cy={C[1]} r={RZ} className="gz4-land gz4-o gz4-thin gz4-dash" />
      {Array.from({ length: 16 }, (_, i) => {
        const p = pol(46 + (i % 2) * 8, i * 22.5 + 10);
        return <rect key={i} x={f1(p[0] - 3)} y={f1(p[1] - 3)} width={6} height={6} className="gz4-roof gz4-o gz4-thin" />;
      })}
      {/* core */}
      <circle cx={C[0]} cy={C[1]} r={RC} className="gz4-lvl-fill gz4-o gz4-thin" />
      {[
        [-14, -12, 10, 10],
        [0, -16, 10, 13],
        [-15, 2, 12, 10],
        [2, 1, 12, 12],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={C[0] + x} y={C[1] + y} width={w} height={h} className="gz4-lvl-fill2" />
          <rect x={C[0] + x} y={C[1] + y} width={w} height={h} fill={pat(id, "xd")} />
          <rect x={C[0] + x} y={C[1] + y} width={w} height={h} className="gz4-o gz4-thin" />
        </g>
      ))}
      {/* movement */}
      {ang.map((a, i) => {
        const [r0, r1] = arrows[i % arrows.length];
        const p0 = pol(r0, a);
        const p1 = pol(r1, a);
        return (
          <DrawArrow
            key={a}
            d={`M${f1(p0[0])} ${f1(p0[1])} L${f1(p1[0])} ${f1(p1[1])}`}
            tone="lvl"
            className="gz4-vec"
            delay={0.15 + i * 0.1}
          />
        );
      })}
      <text x={C[0]} y={C[1] + RC + 14} textAnchor="middle" className="gz4-lbl gz4-sm gz4-b gz4-halo">
        jádro
      </text>
      <text x={C[0]} y={C[1] - RZ + 14} textAnchor="middle" className="gz4-lbl gz4-sm gz4-halo">
        zázemí
      </text>
      <text x={W - 12} y={94} textAnchor="end" className="gz4-lbl gz4-sm gz4-muted-t">
        venkov
      </text>
      {/* trend of population */}
      <TrendTag x={W / 2 - 8} y={194} what="jádro" t={core} anchor="end" />
      <TrendTag x={W / 2 + 8} y={194} what="zázemí" t={ring} />
    </>
  );
}

function TrendTag({ x, y, what, t, anchor = "start" }: { x: number; y: number; what: string; t: Trend; anchor?: "start" | "end" }) {
  const up = t === "up" || t === "up2";
  const two = t === "up2" || t === "down2";
  const sym = up ? "▲" : "▼";
  return (
    <text x={x} y={y} textAnchor={anchor} className="gz4-lbl gz4-sm">
      {what}{" "}
      <tspan className={up ? "gz4-good-t" : "gz4-red-t"} style={{ fontStyle: "normal" }}>
        {two ? sym + sym : sym}
      </tspan>
      <tspan className="gz4-muted-t">{up ? " roste" : " ubývá"}</tspan>
    </text>
  );
}

export default function UrbanisationStages() {
  return (
    <Figure level={5} label={LABEL} max={980} interactive boost={false}>
      <div className="gz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={230}
          steps={[
            {
              title: "Urbanizace",
              art: (
                <Frame w={W} h={H}>
                  <Scene arrows={[[128, 34]]} core="up2" ring="up" />
                </Frame>
              ),
              caption: "Z venkova do města za prací v továrnách. Česko v 19. století, dnes Afrika a jižní Asie.",
            },
            {
              title: "Suburbanizace",
              art: (
                <Frame w={W} h={H}>
                  <Scene arrows={[[14, 56]]} core="down" ring="up2" />
                </Frame>
              ),
              caption: "Z jádra do rodinných domů v zázemí. Okolí Prahy po roce 1990.",
            },
            {
              title: "Desurbanizace",
              art: (
                <Frame w={W} h={H}>
                  <Scene arrows={[[20, 128]]} core="down2" ring="down" />
                </Frame>
              ),
              caption: "Ubývá lidí v jádru i zázemí, stěhují se do menších měst a na venkov.",
            },
            {
              title: "Reurbanizace",
              art: (
                <Frame w={W} h={H}>
                  <Scene arrows={[[90, 18]]} core="up" ring="down" />
                </Frame>
              ),
              caption: "Návrat do obnoveného centra, nové byty i na místě starých továren (brownfieldy).",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
