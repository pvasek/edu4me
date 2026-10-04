import { StepFilm } from "../../sequence/StepFigure";
import { DrawArrow, Fade, Figure, Frame, Pop, f1, pat, rng, useFig, useLive } from "./kit";

const LABEL =
  "Dezertifikace v Sahelu ve čtyřech krocích. 1. Suchá savana: tráva, akácie a pár stád, srážky asi 200 až 600 mm za rok, tenká úrodná půda drží pohromadě kořeny. 2. Tlak lidí a sucha: příliš mnoho dobytka spase trávu (nadměrná pastva), stromy se kácejí na palivo a přijde několik suchých let. 3. Eroze: holou půdu odnáší vítr a přívalové deště vymílají strže, úrodná vrstva mizí a postupují písečné duny – ze savany se stává poušť. 4. Jak to zastavit: výsadba stromů v pásu Velké zelené zdi (8 000 km napříč Afrikou, cíl obnovit 100 milionů hektarů do roku 2030), jamky zaï a kamenné valy, které zadrží vodu a půdu, a řízená pastva.";

const W = 440;
const H = 232;
const G = 168;

function Tuft({ x, s = 1, dry = false }: { x: number; s?: number; dry?: boolean }) {
  return (
    <path
      d={`M${x} ${G} q-3 -${f1(10 * s)} -7 -${f1(13 * s)} M${x} ${G} q0 -${f1(12 * s)} 1 -${f1(16 * s)} M${x} ${G} q3 -${f1(9 * s)} 8 -${f1(12 * s)}`}
      className="gz6-o"
      style={{ stroke: dry ? "var(--yellow)" : "var(--good)", strokeWidth: 1.4 }}
    />
  );
}

function Acacia({ x, s = 1, stump = false }: { x: number; s?: number; stump?: boolean }) {
  if (stump)
    return (
      <g>
        <path d={`M${x - 4} ${G} V${G - 8} H${x + 4} V${G} Z`} className="gz6-soil gz6-o" />
        <ellipse cx={x} cy={G - 8} rx={4} ry={1.6} className="gz6-sand gz6-o gz6-thin" />
      </g>
    );
  return (
    <g transform={`translate(${x} ${G}) scale(${s})`}>
      <path d="M0 0 L-1 -26 M-1 -22 L-12 -34 M0 -20 L12 -34" className="gz6-o" style={{ strokeWidth: 2.2 }} />
      <path d="M-30 -36 Q-26 -48 -8 -46 Q0 -54 14 -48 Q32 -48 30 -38 Q20 -32 0 -34 Q-20 -30 -30 -36 Z" className="gz6-veg gz6-o" />
    </g>
  );
}

function Cow({ x, flip = false }: { x: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${G}) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-10 -9 Q-10 -15 -2 -15 H8 Q12 -15 12 -11 L16 -14 L17 -9 L13 -8 Q12 -5 8 -5 H-6 Q-10 -5 -10 -9 Z" className="gz6-fill gz6-o gz6-thin" />
      <path d="M-7 -5 V0 M-3 -5 V0 M5 -5 V0 M9 -5 V0" className="gz6-o gz6-thin" />
    </g>
  );
}

function Sun({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  let rays = "";
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5;
    rays += `M${f1(x + Math.cos(a) * (r + 4))} ${f1(y + Math.sin(a) * (r + 4))} L${f1(x + Math.cos(a) * (r + 10))} ${f1(y + Math.sin(a) * (r + 10))} `;
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="gz6-sun gz6-o" />
      <path d={rays} className="gz6-o gz6-acc-s" style={{ strokeWidth: 1.6 }} />
    </g>
  );
}

function Ground({ soil, dune = 0, gully = false }: { soil: number; dune?: number; gully?: boolean }) {
  const { id } = useFig();
  // surface with an optional dune on the right
  const surf = dune
    ? `M0 ${G} H${W - 150} Q${W - 90} ${G - dune} ${W - 40} ${G - dune * 0.7} Q${W - 20} ${G - dune * 0.6} ${W} ${G}`
    : `M0 ${G} H${W}`;
  return (
    <g>
      <rect x={0} y={0} width={W} height={G} className="gz6-air" />
      <rect x={0} y={G} width={W} height={H - G} className="gz6-rock" />
      <rect x={0} y={G} width={W} height={H - G} fill={pat(id, "b")} opacity={0.5} />
      <rect x={0} y={G} width={W} height={soil} className="gz6-soil" />
      <rect x={0} y={G} width={W} height={soil} fill={pat(id, "dots")} />
      {dune > 0 && <path d={`${surf} V${G} Z`} className="gz6-sand gz6-o" />}
      {gully && <path d={`M150 ${G} q8 ${soil + 10} 18 0`} className="gz6-air gz6-o" />}
      <path d={`M0 ${G} H${W}`} className="gz6-o" />
      <path d={`M0 ${G + soil} H${W}`} className="gz6-o gz6-thin gz6-dash" />
      <text x={W - 6} y={G + soil - 4 > G + 12 ? G + soil - 5 : G + soil + 14} textAnchor="end" className="gz6-lbl gz6-sm gz6-halo">
        úrodná půda
      </text>
    </g>
  );
}

function Tufts({ n, seed, dry = false, s = 1 }: { n: number; seed: number; dry?: boolean; s?: number }) {
  const R = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Tuft key={i} x={Math.round(8 + R() * (W - 16))} s={s * (0.7 + R() * 0.5)} dry={dry} />
      ))}
    </g>
  );
}

function Savanna() {
  return (
    <>
      <Ground soil={30} />
      <Tufts n={34} seed={3} />
      <Acacia x={80} />
      <Acacia x={250} s={1.15} />
      <Acacia x={390} s={0.9} />
      <Cow x={160} />
      <Cow x={318} flip />
      <Fade delay={0.3}>
        <path d="M296 40 Q284 40 286 30 Q288 20 300 22 Q304 8 322 12 Q334 4 348 14 Q364 14 364 28 Q372 36 360 40 Z" className="gz6-cloud gz6-o" />
        {[300, 314, 328, 342].map((x) => (
          <path key={x} d={`M${x} 48 l-3 10 M${x - 6} 66 l-3 10`} className="gz6-arr gz6-arr-blue" style={{ strokeWidth: 1.3 }} />
        ))}
        <text x={10} y={24} className="gz6-lbl gz6-b">
          Sahel: ≈ 200–600 mm srážek za rok
        </text>
        <text x={10} y={42} className="gz6-lbl gz6-sm">
          kořeny trav a stromů drží půdu
        </text>
      </Fade>
    </>
  );
}

function Pressure() {
  return (
    <>
      <Ground soil={28} />
      <Tufts n={14} seed={5} dry s={0.6} />
      <Acacia x={80} stump />
      <Acacia x={250} s={1.15} />
      <Acacia x={130} stump />
      <Acacia x={390} stump />
      {[150, 186, 212, 290, 322, 352].map((x, i) => (
        <Cow key={x} x={x} flip={i % 2 === 1} />
      ))}
      <Sun x={380} y={42} />
      <Pop delay={0.3}>
        <text x={10} y={24} className="gz6-lbl gz6-b gz6-red-t">
          nadměrná pastva
        </text>
        <text x={10} y={42} className="gz6-lbl gz6-sm">
          stáda spasou trávu až ke kořenům
        </text>
      </Pop>
      <Pop delay={0.6}>
        <text x={10} y={84} className="gz6-lbl gz6-b gz6-red-t">
          kácení na palivo
        </text>
        <path d={`M60 90 L80 ${G - 12}`} className="gz6-lead" />
      </Pop>
      <Pop delay={0.9}>
        <text x={346} y={84} textAnchor="end" className="gz6-lbl gz6-b gz6-red-t">
          sucho
        </text>
        <text x={346} y={100} textAnchor="end" className="gz6-lbl gz6-sm">
          několik let bez deště
        </text>
      </Pop>
    </>
  );
}

function Erosion() {
  const live = useLive();
  return (
    <>
      <Ground soil={10} dune={46} gully />
      <Tufts n={5} seed={8} dry s={0.5} />
      <Acacia x={80} stump />
      <Acacia x={130} stump />
      {[0, 1, 2].map((i) => (
        <g key={i} className={live ? "gz6-pulse" : ""} style={{ animationDelay: `${-i * 0.5}s` }}>
          <DrawArrow d={`M${30 + i * 40} ${G - 22 - i * 12} q60 -10 120 -6`} tone="acc" delay={0.2 + i * 0.15} />
        </g>
      ))}
      <Fade delay={0.4}>
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={60 + ((i * 37) % 200)} cy={G - 10 - ((i * 13) % 40)} r={1.3} className="gz6-spot" style={{ fill: "var(--accent)" }} />
        ))}
      </Fade>
      <Fade delay={0.5}>
        <text x={10} y={24} className="gz6-lbl gz6-b gz6-red-t">
          větrná eroze
        </text>
        <text x={10} y={42} className="gz6-lbl gz6-sm">
          vítr odnáší holou půdu
        </text>
        <text x={W - 8} y={24} textAnchor="end" className="gz6-lbl gz6-b">
          postupující duny
        </text>
        <text x={W - 8} y={42} textAnchor="end" className="gz6-lbl gz6-sm">
          ze savany je poušť
        </text>
        <text x={176} y={G + 34} className="gz6-lbl gz6-sm gz6-halo">
          strž po přívalovém dešti
        </text>
        <path d={`M174 ${G + 28} L164 ${G + 12}`} className="gz6-lead" />
      </Fade>
    </>
  );
}

function Recovery() {
  return (
    <>
      <Ground soil={22} />
      <Tufts n={22} seed={11} s={0.8} />
      {/* the Great Green Wall belt */}
      {[200, 236, 272, 308, 344, 380, 416].map((x, i) => (
        <Acacia key={x} x={x} s={0.62 + (i % 2) * 0.12} />
      ))}
      {/* zaï pits and a stone line */}
      {[40, 78, 116].map((x) => (
        <g key={x}>
          <path d={`M${x - 12} ${G} q12 14 24 0`} className="gz6-soil gz6-o" />
          <path d={`M${x} ${G + 4} q-2 -8 -6 -10 M${x} ${G + 4} q2 -8 6 -10`} className="gz6-o" style={{ stroke: "var(--good)", strokeWidth: 1.6 }} />
        </g>
      ))}
      {[136, 146, 156, 166].map((x) => (
        <ellipse key={x} cx={x} cy={G - 3} rx={5} ry={3.4} className="gz6-rock gz6-o gz6-thin" />
      ))}
      <Cow x={176} />
      <Fade delay={0.3}>
        <text x={W - 8} y={24} textAnchor="end" className="gz6-lbl gz6-b gz6-good-t">
          Velká zelená zeď
        </text>
        <text x={W - 8} y={42} textAnchor="end" className="gz6-lbl gz6-sm">
          pás stromů 8 000 km napříč Afrikou,
        </text>
        <text x={W - 8} y={58} textAnchor="end" className="gz6-lbl gz6-sm">
          cíl: obnovit 100 mil. ha do roku 2030
        </text>
      </Fade>
      <Fade delay={0.6}>
        <text x={10} y={96} className="gz6-lbl gz6-b gz6-good-t">
          jamky zaï, kamenné valy
        </text>
        <text x={10} y={112} className="gz6-lbl gz6-sm">
          zadrží vodu i půdu
        </text>
        <text x={10} y={128} className="gz6-lbl gz6-sm">
          + řízená pastva
        </text>
        <path d={`M60 134 L78 ${G - 6}`} className="gz6-lead" />
      </Fade>
    </>
  );
}

const STEPS = [
  { title: "Suchá savana", caption: "Tráva a akácie drží tenkou úrodnou půdu kořeny; prší jen pár měsíců v roce.", art: <Savanna /> },
  { title: "Tlak lidí a sucha", caption: "Příliš mnoho dobytka, kácení stromů na palivo a několik suchých let za sebou.", art: <Pressure /> },
  { title: "Eroze: vzniká poušť", caption: "Holou půdu odnese vítr a vymelou přívalové deště; postupují duny.", art: <Erosion /> },
  { title: "Jak to zastavit", caption: "Výsadba stromů, jamky zaï a kamenné valy zadrží vodu a půdu; pastva se řídí.", art: <Recovery /> },
];

export default function Desertification() {
  return (
    <Figure label={LABEL} interactive max={640}>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s) => ({
          ...s,
          art: (
            <Frame w={W} h={H} className="gz6-xl">
              {s.art}
            </Frame>
          ),
        }))}
      />
    </Figure>
  );
}
