import { Arrow, DrawArrow, Fade, Figure, Pop, pat, rng, useFig } from "./kit";
import { T, Tree } from "./land";

const LABEL =
  "Práce větru v poušti a za ní. Vítr nese písek nízko nad zemí a obrušuje skály nejvíc u země, takže z nich vznikají skalní hřiby. Písek ukládá do přesypů; barchan je přesyp ve tvaru půlměsíce, jeho cípy míří po větru. Na návětrné straně má mírný svah, po kterém vítr žene zrnka nahoru, na závětrné straně strmý svah asi 33°, po kterém se písek sesouvá, a tak se celý barchan pomalu posouvá po větru. Nejjemnější prach vítr odnáší daleko za poušť a ukládá ho jako spraš – úrodnou žlutou horninu, například na Sprašové plošině v Číně nebo u nás na jižní Moravě a v Polabí.";

const W = 480;
const H = 330;
const G = 236; // desert floor
const LX = 360; // start of the loess

const DUNE = `M140 ${G} C190 ${G - 10} 230 ${G - 48} 262 ${G - 62} Q268 ${G - 62} 272 ${G - 56} L298 ${G}Z`;
const LOESS = `M${LX} ${G} L${LX} 196 Q${LX + 30} 190 ${W - 4} 188 L${W - 4} ${G + 40} L${LX} ${G + 40}Z`;

function Plate() {
  const { id } = useFig();
  const r = rng(11);
  return (
    <>
      {/* bedrock and desert floor */}
      <rect x={4} y={G} width={W - 8} height={H - 4 - G} className="gz2-rock" />
      <rect x={4} y={G} width={W - 8} height={H - 4 - G} fill={pat(id, "d")} opacity={0.4} />
      <rect x={4} y={G} width={LX - 4} height={10} className="gz2-sand" />
      <path d={`M4 ${G} H${W - 4} M4 ${G + 10} H${LX}`} className="gz2-o gz2-thin" />
      {/* loess */}
      <path d={LOESS} className="gz2-loess" />
      <path d={LOESS} fill={pat(id, "v")} opacity={0.6} />
      <path d={LOESS} className="gz2-o" />
      <path d={`M${LX} 196 Q${LX + 30} 190 ${W - 4} 188`} className="gz2-o" style={{ strokeWidth: 4, stroke: "var(--gz2-grass-line)" }} />
      {[392, 420, 452].map((x) => (
        <Tree key={x} x={x} y={190} s={0.8} />
      ))}
      {/* rock pedestal */}
      <path
        d={`M58 ${G} Q64 ${G - 18} 62 ${G - 36} Q52 ${G - 56} 40 ${G - 78} Q40 ${G - 104} 72 ${G - 110} Q104 ${G - 104} 104 ${G - 78} Q92 ${G - 56} 82 ${G - 36} Q80 ${G - 18} 86 ${G}Z`}
        className="gz2-sed"
      />
      <path
        d={`M58 ${G} Q64 ${G - 18} 62 ${G - 36} Q52 ${G - 56} 40 ${G - 78} Q40 ${G - 104} 72 ${G - 110} Q104 ${G - 104} 104 ${G - 78} Q92 ${G - 56} 82 ${G - 36} Q80 ${G - 18} 86 ${G}Z`}
        fill={pat(id, "h")}
      />
      <path
        d={`M58 ${G} Q64 ${G - 18} 62 ${G - 36} Q52 ${G - 56} 40 ${G - 78} Q40 ${G - 104} 72 ${G - 110} Q104 ${G - 104} 104 ${G - 78} Q92 ${G - 56} 82 ${G - 36} Q80 ${G - 18} 86 ${G}Z`}
        className="gz2-o"
      />
      {/* sand grains blasting the foot of the rock */}
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={8 + r() * 36} cy={G - 4 - r() * 26} r={1.6} className="gz2-sand gz2-o gz2-thin" />
      ))}
      {/* barchan in section */}
      <path d={DUNE} className="gz2-sand" />
      <path d={DUNE} fill={pat(id, "dots")} />
      <path d={DUNE} className="gz2-o" />
      <Arrow d={`M176 ${G - 12} Q216 ${G - 30} 252 ${G - 58}`} tone="acc" />
      <Arrow d={`M276 ${G - 46} L290 ${G - 14}`} tone="acc" />
      {/* barchan from above */}
      <g transform="translate(222 64)">
        <path d="M44 -32 Q-6 -42 -32 -16 Q-42 0 -32 16 Q-6 42 44 32 Q2 20 8 0 Q2 -20 44 -32Z" className="gz2-sand gz2-o" />
        <path d="M30 -27 Q-6 -16 -4 0 Q-6 16 30 27" className="gz2-o gz2-thin gz2-dash" />
      </g>
      {/* dust carried far */}
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${150 + k * 40} ${G - 70 - k * 8} Q${300 + k * 10} ${100 - k * 10} ${400 + k * 26} ${182}`} className="gz2-o gz2-thin gz2-dot2" />
      ))}
      <DrawArrow d="M10 26 H120" tone="lvl" className="gz2-vec" delay={0.1} />
      <Pop delay={0.4}>
        <T x={66} y={50} cls="gz2-b gz2-lvl-t">vítr</T>
      </Pop>
      <Fade delay={0.6}>
        <T x={72} y={G - 120} cls="gz2-b">skalní hřib</T>
        <T x={8} y={H - 34} a="start" cls="gz2-sm">písek obrušuje skálu u země</T>
        <T x={222} y={120} cls="gz2-sm gz2-b">barchan shora</T>
        <T x={292} y={30} a="end" cls="gz2-sm gz2-sec">cípy po větru</T>
        <T x={168} y={G - 40} a="end" cls="gz2-sm">mírný</T>
        <T x={168} y={G - 24} a="end" cls="gz2-sm">návětrný svah</T>
        <T x={302} y={G - 66} a="start" cls="gz2-sm">strmý závětrný</T>
        <T x={302} y={G - 50} a="start" cls="gz2-sm">svah ≈ 33°</T>
        <T x={220} y={G + 30} cls="gz2-sm gz2-b">barchan (přesyp)</T>
        <T x={W - 8} y={150} a="end" cls="gz2-sm gz2-muted-t">jemný prach</T>
        <T x={W - 8} y={G + 30} a="end" cls="gz2-b">spraš</T>
      </Fade>
    </>
  );
}

export default function WindLandforms() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={640} replay>
      <Plate />
    </Figure>
  );
}
