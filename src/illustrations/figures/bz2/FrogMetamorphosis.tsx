import { StepFilm } from "../../sequence/StepFigure";
import { Fade, Figure, Frame, Pop, pat, rng, useFig } from "./kit";

const LABEL =
  "Proměna žáby, animace po krocích. 1. Snůška: žába klade do vody vajíčka obalená rosolem. 2. Pulec: z vajíčka se vylíhne pulec s ocasem a vnějšími žábrami, žije jen ve vodě a spásá řasy. 3. Pulec se zadníma nohama: žábry zarostou dovnitř, vyrostou zadní nohy. 4. Žabka s ocáskem: má už všechny čtyři nohy, ocas se zkracuje a začne dýchat plícemi. 5. Dospělá žába: ocas zmizel, žába dýchá plícemi a kůží a vylézá na souš; za potravou loví hmyz.";

const W = 400;
const H = 250;
const WL = 96; // water level

function Pond() {
  const { id } = useFig();
  return (
    <g>
      <rect x={0} y={WL} width={W} height={H - WL} className="bz2-water" />
      <rect x={0} y={WL} width={W} height={H - WL} fill={pat(id, "h")} opacity={0.5} />
      <path d={`M0 ${WL} Q50 ${WL - 3} 100 ${WL} T200 ${WL} T300 ${WL} T400 ${WL}`} className="bz2-o" />
      <path d={`M0 ${H - 18} Q100 ${H - 30} 200 ${H - 20} T400 ${H - 22} V${H} H0Z`} className="bz2-o bz2-soil" />
      <path d={`M0 ${H - 18} Q100 ${H - 30} 200 ${H - 20} T400 ${H - 22} V${H} H0Z`} fill={pat(id, "soil")} />
      {/* reeds */}
      {[16, 30, 46].map((x, i) => (
        <path key={x} d={`M${x} ${H - 22} Q${x + (i % 2 ? 4 : -4)} ${WL + 30} ${x + (i % 2 ? -2 : 3)} ${WL - 46 + i * 6}`} className="bz2-o bz2-leaf2" style={{ strokeWidth: 3 }} />
      ))}
    </g>
  );
}

function Spawn() {
  const r = rng(7);
  const eggs = Array.from({ length: 34 }, () => [140 + r() * 120, 112 + r() * 70] as const);
  return (
    <Pop>
      {eggs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={10} className="bz2-o bz2-thin bz2-jelly" />
          <circle cx={x} cy={y} r={3.4} className="bz2-ink-f" />
        </g>
      ))}
    </Pop>
  );
}

function Tadpole({ x, y, s = 1, legs = 0, gills = false, tail = 1 }: { x: number; y: number; s?: number; legs?: 0 | 2 | 4; gills?: boolean; tail?: number }) {
  const { id } = useFig();
  const tl = 90 * tail;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* tail */}
      {tail > 0 && (
        <path
          d={`M18 -8 Q${18 + tl * 0.5} -${18 * tail} ${18 + tl} 0 Q${18 + tl * 0.5} ${18 * tail} 18 8Z`}
          className="bz2-o bz2-tadtail"
        />
      )}
      {tail > 0 && <path d={`M18 0 Q${18 + tl * 0.5} -3 ${18 + tl} 0`} className="bz2-o bz2-thin" />}
      {/* hind legs */}
      {legs >= 2 && <path d="M14 12 Q20 30 8 34 L0 34" className="bz2-o" style={{ strokeWidth: 3.6 }} />}
      {/* body */}
      <ellipse cx={0} cy={0} rx={26} ry={18} className="bz2-o bz2-tadbody" />
      <ellipse cx={0} cy={0} rx={26} ry={18} fill={pat(id, "dots")} />
      {legs >= 4 && <path d="M-12 12 L-16 28 L-22 30" className="bz2-o" style={{ strokeWidth: 3 }} />}
      <circle cx={-14} cy={-6} r={3.4} className="bz2-o bz2-paper-f" />
      <circle cx={-14} cy={-6} r={1.8} className="bz2-ink-f" />
      {gills && (
        <path d="M-2 -16 q-4 -10 2 -14 q4 4 0 10 M4 -16 q2 -12 10 -12 q0 6 -6 10" className="bz2-o bz2-gill" />
      )}
    </g>
  );
}

function Frog({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const { id } = useFig();
  const body = "M-40 -6 Q-36 -30 -8 -32 Q26 -30 40 -8 Q46 8 30 14 L-26 14 Q-44 10 -40 -6Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* hind leg (folded) */}
      <path d="M22 -4 Q54 -6 50 14 Q40 22 12 20 L44 22 L54 26" className="bz2-o bz2-frog" />
      <path d={body} className="bz2-o bz2-frog" />
      <path d={body} fill={pat(id, "dots")} />
      {/* front leg */}
      <path d="M-20 8 L-24 26 L-34 28 M-24 26 L-18 29" className="bz2-o" style={{ strokeWidth: 3 }} />
      {/* eye + tympanum */}
      <circle cx={-26} cy={-28} r={8} className="bz2-o bz2-frog" />
      <circle cx={-26} cy={-29} r={4} className="bz2-ink-f" />
      <circle cx={-10} cy={-14} r={5} className="bz2-o bz2-thin" />
      <path d="M-42 -6 Q-30 0 -18 -4" className="bz2-o bz2-thin" />
    </g>
  );
}

function Tag({ when, breath }: { when: string; breath: string }) {
  return (
    <Fade delay={0.2}>
      <text x={W - 10} y={22} textAnchor="end" className="bz2-lbl bz2-b bz2-lvl-t">
        {when}
      </text>
      <text x={W - 10} y={42} textAnchor="end" className="bz2-lbl bz2-sm">
        {breath}
      </text>
    </Fade>
  );
}

const STEPS = [
  {
    title: "Snůška",
    caption: "Žába klade do vody stovky vajíček v rosolu; rosol je chrání a drží pohromadě.",
    art: (
      <>
        <Spawn />
        <Tag when="jaro" breath="vajíčka v rosolu" />
      </>
    ),
  },
  {
    title: "Pulec",
    caption: "Vylíhne se pulec: ocas, vnější žábry, žije jen ve vodě a spásá řasy.",
    art: (
      <>
        <Pop>
          <Tadpole x={150} y={160} s={1.45} gills />
        </Pop>
        <Tag when="po 1–3 týdnech" breath="dýchá žábrami" />
      </>
    ),
  },
  {
    title: "Pulec se zadníma nohama",
    caption: "Žábry zarostou pod kůži, pulec roste a vyraší mu zadní nohy.",
    art: (
      <>
        <Pop>
          <Tadpole x={140} y={156} s={1.7} legs={2} />
        </Pop>
        <Tag when="asi 6–8 týdnů" breath="žábry uvnitř" />
      </>
    ),
  },
  {
    title: "Žabka s ocáskem",
    caption: "Má už čtyři nohy, ocas se vstřebává a vyvíjejí se plíce – žabka připlouvá k hladině pro vzduch.",
    art: (
      <>
        <Pop>
          <Tadpole x={180} y={126} s={1.7} legs={4} tail={0.45} />
        </Pop>
        <Tag when="asi 10–12 týdnů" breath="začíná dýchat plícemi" />
      </>
    ),
  },
  {
    title: "Žába",
    caption: "Ocas zmizel. Dospělá žába dýchá plícemi i kůží, vylézá na souš a loví hmyz.",
    art: (
      <>
        <path d="M120 100 Q200 84 290 98 Q290 110 200 112 Q120 112 120 100Z" className="bz2-o bz2-leaf" />
        <Pop>
          <Frog x={200} y={64} s={1.45} />
        </Pop>
        <Tag when="asi 3 měsíce" breath="plíce a kůže" />
      </>
    ),
  },
];

export default function FrogMetamorphosis() {
  return (
    <Figure level={5} label={LABEL} max={600} interactive>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s) => ({
          ...s,
          art: (
            <Frame w={W} h={H}>
              <Pond />
              {s.art}
            </Frame>
          ),
        }))}
      />
    </Figure>
  );
}
