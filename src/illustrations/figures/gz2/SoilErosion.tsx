import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, f1, pat, useFig, type P2 } from "./kit";
import { T, Tree, poly } from "./land";

const LABEL =
  "Eroze půdy na svahu a ochrana proti ní. Bez ochrany: na poli zoraném po spádu stéká dešťová voda brázdami dolů, vymílá v půdě rýhy, odnáší úrodnou ornici a ukládá ji pod svahem; potok je zakalený bahnem. S ochranou: brázdy vedou po vrstevnici napříč svahem a zadržují vodu, na strmé části jsou terasy, mezi pásy polí jsou zatravněné pásy a podél potoka travnatý pás, na hřebeni stojí větrolam – řada stromů, která brzdí vítr, aby neodnášel vyschlou půdu.";

const W = 300;
const H = 226;
// the field on the slope, seen from below (top edge = top of the slope)
const TL: P2 = [46, 52];
const TR: P2 = [256, 40];
const BR: P2 = [282, 166];
const BL: P2 = [18, 174];
const lerp = (a: P2, b: P2, t: number): P2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** point on the field: u across (0 left – 1 right), v down the slope (0 top – 1 bottom) */
const at = (u: number, v: number): P2 => lerp(lerp(TL, TR, u), lerp(BL, BR, u), v);
const FIELD = poly([TL, TR, BR, BL]);
const STREAM = (muddy: boolean) => (
  <path
    d={`M4 ${BL[1] + 14} Q80 ${BL[1] + 6} 150 ${BL[1] + 10} Q220 ${BL[1] + 14} ${W - 4} ${BR[1] + 10} L${W - 4} ${BR[1] + 26} Q220 ${BL[1] + 30} 150 ${BL[1] + 26} Q80 ${BL[1] + 22} 4 ${BL[1] + 30}Z`}
    className={muddy ? "gz2-mud gz2-o gz2-thin" : "gz2-water gz2-o gz2-thin"}
  />
);

function HillArt() {
  const { id } = useFig();
  const hill = `M4 ${TL[1] + 4} Q${TL[0]} ${TL[1] - 14} ${(TL[0] + TR[0]) / 2} ${TL[1] - 22} Q${TR[0]} ${TR[1] - 18} ${W - 4} ${TR[1] - 2} L${W - 4} ${H - 4} L4 ${H - 4}Z`;
  return (
    <g>
      <rect x={4} y={4} width={W - 8} height={H - 8} className="gz2-sky" />
      <path d={hill} className="gz2-grass" />
      <path d={hill} fill={pat(id, "dots")} opacity={0.4} />
      <path d={FIELD} className="gz2-soil" />
      <path d={FIELD} fill={pat(id, "dots")} />
    </g>
  );
}

function Bare() {
  return (
    <Frame w={W} h={H}>
      <BareArt />
    </Frame>
  );
}

function BareArt() {
  return (
    <>
      <HillArt />
      {/* furrows straight down the slope */}
      {Array.from({ length: 13 }, (_, i) => {
        const u = (i + 1) / 14;
        const [a, b] = [at(u, 0), at(u, 1)];
        return <path key={i} d={`M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}`} className="gz2-o gz2-thin gz2-faint" />;
      })}
      {/* rills cut by running water */}
      {[0.24, 0.52, 0.78].map((u, i) => {
        const pts = [0.25, 0.45, 0.65, 0.85, 1].map((v, k) => {
          const p = at(u + (k % 2 ? 0.025 : -0.02), v);
          return `${f1(p[0])} ${f1(p[1])}`;
        });
        return <path key={i} d={`M${pts.join(" L")}`} className="gz2-rill" style={{ strokeWidth: 2 + i }} />;
      })}
      {/* washed-out soil below the field */}
      <path d={`M60 ${BL[1] + 2} Q150 ${BL[1] + 22} 250 ${BR[1] + 4} L260 ${BR[1] + 12} Q150 ${BL[1] + 34} 50 ${BL[1] + 12}Z`} className="gz2-mud" />
      {STREAM(true)}
      <path d={poly([TL, TR, BR, BL])} className="gz2-o" />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${70 + k * 40} ${8 + (k % 2) * 6} l-3 9`} className="gz2-arr gz2-arr-blue" style={{ strokeWidth: 1.5 }} />
      ))}
      <Arrow d={`M${at(0.9, 0.2)[0] + 8} ${at(0.9, 0.2)[1]} L${at(0.93, 0.62)[0] + 8} ${at(0.93, 0.62)[1]}`} tone="blue" className="gz2-vec" />
      <T x={150} y={84} cls="gz2-sm gz2-b">brázdy po spádu</T>
      <T x={150} y={128} cls="gz2-sm">rýhy</T>
      <T x={150} y={H - 6} cls="gz2-sm gz2-b">smytá ornice, zakalený potok</T>
    </>
  );
}

function Protected() {
  return (
    <Frame w={W} h={H}>
      <ProtectedArt />
    </Frame>
  );
}

function ProtectedArt() {
  const { id } = useFig();
  const band = (v0: number, v1: number) => poly([at(0, v0), at(1, v0), at(1, v1), at(0, v1)]);
  return (
    <>
      <HillArt />
      {/* terraces on the steep upper part */}
      {[0, 0.1, 0.2].map((v) => (
        <g key={v}>
          <path d={band(v, v + 0.1)} className="gz2-soil" />
          <path d={band(v + 0.075, v + 0.1)} className="gz2-terrace" />
          <path d={`M${f1(at(0, v + 0.075)[0])} ${f1(at(0, v + 0.075)[1])} L${f1(at(1, v + 0.075)[0])} ${f1(at(1, v + 0.075)[1])}`} className="gz2-o" />
        </g>
      ))}
      {/* contour ploughing with grass strips between */}
      {[
        [0.3, 0.5, false],
        [0.5, 0.58, true],
        [0.58, 0.78, false],
        [0.78, 0.86, true],
        [0.86, 1, false],
      ].map(([v0, v1, grass], i) => (
        <g key={i}>
          <path d={band(v0 as number, v1 as number)} className={grass ? "gz2-grass" : "gz2-soil"} />
          {grass ? (
            <path d={band(v0 as number, v1 as number)} fill={pat(id, "v")} opacity={0.5} />
          ) : (
            Array.from({ length: 4 }, (_, k) => {
              const v = (v0 as number) + (((v1 as number) - (v0 as number)) * (k + 0.5)) / 4;
              const [a, b] = [at(0, v), at(1, v)];
              return <path key={k} d={`M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}`} className="gz2-o gz2-thin gz2-faint" />;
            })
          )}
        </g>
      ))}
      {/* grass buffer and a clear stream */}
      <path d={`M18 ${BL[1]} L282 ${BR[1]} L${W - 4} ${BR[1] + 10} Q220 ${BL[1] + 14} 150 ${BL[1] + 10} Q80 ${BL[1] + 6} 4 ${BL[1] + 14}Z`} className="gz2-grass" />
      {STREAM(false)}
      <path d={poly([TL, TR, BR, BL])} className="gz2-o" />
      {/* windbreak on the ridge */}
      {Array.from({ length: 9 }, (_, i) => {
        const p = lerp(TL, TR, i / 8);
        return <Tree key={i} x={p[0]} y={p[1] - 3} s={0.9} />;
      })}
      <T x={150} y={18} cls="gz2-sm gz2-b">větrolam</T>
      <T x={150} y={at(0.5, 0.17)[1] + 5} cls="gz2-sm">terasy</T>
      <T x={150} y={at(0.5, 0.42)[1] + 5} cls="gz2-sm gz2-b">orba po vrstevnici</T>
      <T x={150} y={at(0.5, 0.82)[1] + 5} cls="gz2-sm">zatravněný pás</T>
      <T x={150} y={H - 6} cls="gz2-sm gz2-b">čistý potok</T>
    </>
  );
}

export default function SoilErosion() {
  return (
    <Figure level={3} label={LABEL} max={760} interactive>
      <div className="gz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={280}
          steps={[
            {
              title: "Bez ochrany",
              art: <Bare />,
              caption: "Voda stéká brázdami po spádu, vymílá rýhy a odnáší úrodnou ornici do potoka.",
            },
            {
              title: "S ochranou",
              art: <Protected />,
              caption: "Orba po vrstevnici, terasy a zatravněné pásy vodu zdrží; větrolam brzdí vítr.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
