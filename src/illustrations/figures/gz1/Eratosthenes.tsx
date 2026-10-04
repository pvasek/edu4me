import { Draw, Fade, Figure, f1, pat, useFig } from "./kit";

const LABEL =
  "Eratosthenovo měření obvodu Země. V poledne v den letního slunovratu svítilo Slunce v Syéné (dnešním Asuánu) přímo do studny – stálo v nadhlavníku. Ve stejnou chvíli vrhala svislá tyč v Alexandrii stín a sluneční paprsky s ní svíraly úhel 7,2°. Paprsky jsou rovnoběžné, proto je stejný úhel 7,2° i ve středu Země mezi oběma městy. 7,2° je padesátina plného úhlu 360°, takže obvod Země je 50 × 5 000 stadií = 250 000 stadií, asi 40 000 km.";

const W = 560;
const H = 570;
const O: [number, number] = [300, 470];
const R = 340;
const RAD = Math.PI / 180;
const ANG = 7.2;
const S: [number, number] = [O[0], O[1] - R];
const A: [number, number] = [O[0] - R * Math.sin(ANG * RAD), O[1] - R * Math.cos(ANG * RAD)];
const yAt = (x: number) => O[1] - Math.sqrt(R * R - (x - O[0]) ** 2);

function Plate() {
  const { id } = useFig();
  const x0 = 30;
  const x1 = 560;
  const earth = `M${x0} ${f1(yAt(x0))} A${R} ${R} 0 0 1 ${x1} ${f1(yAt(x1))} V${O[1] + 20} H${x0}Z`;
  const ra = 76;
  return (
    <>
      {/* the Earth (a slice through it) */}
      <path d={earth} className="gz1-land" />
      <path d={earth} fill={pat(id, "d")} opacity={0.5} />
      <path d={`M${x0} ${f1(yAt(x0))} A${R} ${R} 0 0 1 ${x1} ${f1(yAt(x1))}`} className="gz1-o" />
      {/* parallel sun rays */}
      {[90, 150, 210, A[0], S[0], 360, 420, 480].map((x, i) => (
        <path key={i} d={`M${f1(x)} 16 V${f1(yAt(x) - (Math.abs(x - A[0]) < 1 ? 16 : 0))}`} className="gz1-ray" markerEnd={undefined} />
      ))}
      <text x={540} y={30} textAnchor="end" className="gz1-lbl gz1-b gz1-acc-t">
        rovnoběžné sluneční paprsky
      </text>
      {/* the ray through Alexandria continued to the centre, and the radii */}
      <path d={`M${f1(A[0])} ${f1(A[1])} V${O[1]}`} className="gz1-ray gz1-dash" style={{ opacity: 0.6 }} />
      <Draw d={`M${O[0]} ${O[1]} L${f1(A[0])} ${f1(A[1] - 16)}`} className="gz1-o gz1-lvl-s" delay={0.2} />
      <Draw d={`M${O[0]} ${O[1]} L${S[0]} ${S[1]}`} className="gz1-o gz1-lvl-s" delay={0.2} />
      <Draw
        d={`M${O[0]} ${O[1] - ra} A${ra} ${ra} 0 0 0 ${f1(O[0] - ra * Math.sin(ANG * RAD))} ${f1(O[1] - ra * Math.cos(ANG * RAD))}`}
        className="gz1-o gz1-lvl-s"
        delay={0.6}
      />
      <circle cx={O[0]} cy={O[1]} r={3.5} className="gz1-dot" />
      {/* stick at Alexandria (radial), well at Syene */}
      <path d={`M${f1(A[0])} ${f1(A[1])} L${f1(A[0] - 16 * Math.sin(ANG * RAD))} ${f1(A[1] - 16 * Math.cos(ANG * RAD))}`} className="gz1-stick" style={{ strokeWidth: 3 }} />
      <rect x={S[0] - 4} y={S[1]} width={8} height={12} className="gz1-fill gz1-o gz1-thin" />
      <Fade delay={0.9}>
        <text x={O[0] + 10} y={O[1] - ra - 4} className="gz1-lbl gz1-b gz1-lvl-t">
          7,2°
        </text>
        <text x={O[0]} y={O[1] + 24} textAnchor="middle" className="gz1-lbl gz1-sm">
          střed Země
        </text>
        <path d={`M${f1(A[0])} ${f1(A[1] - 26)} Q${(A[0] + S[0]) / 2} ${f1(S[1] - 40)} ${S[0]} ${S[1] - 26}`} className="gz1-o gz1-thin" />
        <text x={(A[0] + S[0]) / 2} y={S[1] - 42} textAnchor="middle" className="gz1-lbl gz1-b gz1-halo">
          5 000 stadií
        </text>
        <text x={A[0] - 10} y={A[1] + 26} textAnchor="end" className="gz1-lbl gz1-b gz1-halo">
          Alexandrie
        </text>
        <text x={S[0] + 10} y={S[1] + 26} className="gz1-lbl gz1-b gz1-halo">
          Syéné (Asuán)
        </text>
      </Fade>
      <Fade delay={1.1}>
        <Inset />
      </Fade>
      <Fade delay={1.4}>
        <text x={W / 2} y={H - 34} textAnchor="middle" className="gz1-lbl gz1-b">
          7,2° = 1/50 z 360° → obvod = 50 × 5 000 stadií
        </text>
        <text x={W / 2} y={H - 12} textAnchor="middle" className="gz1-lbl gz1-b gz1-lvl-t">
          = 250 000 stadií ≈ 40 000 km
        </text>
      </Fade>
    </>
  );
}

/** two magnified details: the stick's shadow and the lit well */
function Inset() {
  const { id } = useFig();
  const L = 96;
  const G = 440; // ground line
  const X = 120; // stick
  const sh = L * Math.tan(ANG * RAD);
  const t = Math.tan(ANG * RAD);
  return (
    <g>
      {/* Alexandria */}
      <rect x={10} y={290} width={196} height={180} rx={6} className="gz1-tag" />
      <path d={`M24 ${G} H192`} className="gz1-o" />
      <path d={`M${X} ${G} h${f1(-sh)}`} className="gz1-o" style={{ strokeWidth: 5, stroke: "var(--ink)" }} />
      <path d={`M${X} ${G} V${G - L}`} className="gz1-stick" style={{ strokeWidth: 3.5 }} />
      {/* the ray grazing the top of the stick comes from the south (right) */}
      <path d={`M${f1(X - sh)} ${G} L${f1(X + 46 * t)} ${G - L - 46}`} className="gz1-ray" />
      <path d={`M${X} ${G - L} V${G - L - 46}`} className="gz1-o gz1-thin gz1-dash" />
      <path
        d={`M${X} ${G - L - 34} A34 34 0 0 1 ${f1(X + 34 * Math.sin(ANG * RAD))} ${f1(G - L - 34 * Math.cos(ANG * RAD))}`}
        className="gz1-o gz1-lvl-s"
        style={{ strokeWidth: 2 }}
      />
      <text x={X + 12} y={G - L - 16} className="gz1-lbl gz1-b gz1-lvl-t">
        7,2°
      </text>
      <text x={f1(X - sh - 8)} y={G - 6} textAnchor="end" className="gz1-lbl gz1-sm">
        stín
      </text>
      <text x={108} y={G + 22} textAnchor="middle" className="gz1-lbl gz1-b gz1-sm">
        Alexandrie: stín tyče
      </text>
      {/* Syene */}
      <rect x={366} y={290} width={184} height={180} rx={6} className="gz1-tag" />
      <path d="M378 360 H436 M476 360 H538" className="gz1-o" />
      <path d="M436 360 V430 H476 V360" className="gz1-o" />
      <rect x={437} y={410} width={38} height={19} className="gz1-lake" />
      <rect x={437} y={410} width={38} height={19} fill={pat(id, "h")} />
      {[444, 456, 468].map((x) => (
        <path key={x} d={`M${x} 304 V408`} className="gz1-ray" />
      ))}
      <text x={484} y={392} className="gz1-lbl gz1-sm">
        světlo
      </text>
      <text x={484} y={410} className="gz1-lbl gz1-sm">
        až na dno
      </text>
      <text x={458} y={G + 22} textAnchor="middle" className="gz1-lbl gz1-b gz1-sm">
        Syéné: Slunce v nadhlavníku
      </text>
    </g>
  );
}

export default function Eratosthenes() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
