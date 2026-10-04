import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Endosymbiotická teorie ve stepech. Velká buňka s jádrem pohltí menší aerobní bakterii, ale nestráví ji. Bakterie v ní přežívá, dodává energii z dýchání a z jejích potomků se stanou mitochondrie. Později některá taková buňka pohltí sinici, která fotosyntetizuje, a z ní vznikne chloroplast – tak vznikli předci řas a rostlin. Důkazy: mitochondrie i chloroplasty mají dvojitou membránu, vlastní kruhovou DNA, malé ribozomy podobné bakteriálním a množí se samy dělením.";

const W = 360;
const H = 230;
const HOST =
  "M60 120 C52 74 98 40 152 44 C196 46 214 30 252 44 C300 62 318 104 308 142 C298 184 252 204 196 198 C148 194 112 206 82 184 C62 168 64 146 60 120Z";

function Host({ children, engulf = false }: { children?: React.ReactNode; engulf?: boolean }) {
  const { id } = useFig();
  const d = engulf
    ? "M60 120 C52 74 98 40 152 44 C196 46 214 30 252 44 C280 54 300 70 312 92 C330 84 344 100 340 120 C344 142 328 156 312 150 C298 186 252 204 196 198 C148 194 112 206 82 184 C62 168 64 146 60 120Z"
    : HOST;
  return (
    <g>
      <path d={d} className="bz3-cyto" />
      <path d={d} fill={pat(id, "dots")} opacity={0.5} />
      <path d={d} className="bz3-membrane" />
      <circle cx={130} cy={118} r={30} className="bz3-nucleus" />
      <circle cx={130} cy={118} r={30} className="bz3-env" />
      <circle cx={130} cy={118} r={26} className="bz3-env" />
      <circle cx={124} cy={122} r={9} className="bz3-nucleolus" />
      {children}
    </g>
  );
}

/** Aerobic bacterium: rod with circular DNA and small ribosomes. */
function Bact({ x, y, rot = 0, s = 1, cyan = false }: { x: number; y: number; rot?: number; s?: number; cyan?: boolean }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-24} y={-11} width={48} height={22} rx={11} className={cyan ? "bz3-cyano" : "bz3-bact"} />
      <rect x={-24} y={-11} width={48} height={22} rx={11} fill={pat(id, "d")} opacity={0.35} />
      {cyan && <path d="M-16 -5 H16 M-18 0 H18 M-16 5 H16" className="bz3-thyl" />}
      {!cyan && <ellipse cx={-2} cy={0} rx={9} ry={5} className="bz3-dna-ring" />}
      {!cyan && [10, 14, 17].map((dx, i) => <circle key={i} cx={dx} cy={i % 2 ? 4 : -4} r={1.3} className="bz3-ribo" />)}
    </g>
  );
}

/** Mitochondrion (double membrane, cristae). */
function Mito({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  let cr = "M-17 0";
  for (let i = 0; i < 6; i++) cr += ` L${-14 + i * 6} ${i % 2 ? 6 : -6}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse rx={23} ry={11} className="bz3-mito" />
      <ellipse rx={19.5} ry={8} className="bz3-mito-in" />
      <path d={cr} className="bz3-cristae" />
    </g>
  );
}

function Chloro({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse rx={24} ry={12} className="bz3-chloro" />
      <ellipse rx={20.5} ry={9} className="bz3-mito-in" />
      {[-12, -3, 6, 14].map((gx) => (
        <g key={gx}>
          {[-4, -1, 2, 5].map((gy) => (
            <rect key={gy} x={gx - 2.5} y={gy - 1} width={5} height={2.2} className="bz3-granum" />
          ))}
        </g>
      ))}
    </g>
  );
}

function T({ x, y, children, a = "middle" }: { x: number; y: number; children: string; a?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={a} className="bz3-lbl bz3-sm bz3-b bz3-halo">
      {children}
    </text>
  );
}

function F1() {
  return (
    <Frame w={W} h={H}>
      <Host />
      <Pop>
        <Bact x={326} y={196} rot={-20} />
      </Pop>
      <Arrow d="M300 188 C290 178 290 170 296 160" tone="lvl" />
      <T x={130} y={30}>buňka s jádrem</T>
      <T x={350} y={226} a="end">aerobní bakterie</T>
    </Frame>
  );
}

function F2() {
  return (
    <Frame w={W} h={H}>
      <Host engulf>
        <ellipse cx={316} cy={120} rx={30} ry={18} className="bz3-vac" />
        <Bact x={316} y={120} rot={-10} s={0.95} />
      </Host>
      <T x={210} y={28}>pohlcení, ale ne strávení</T>
    </Frame>
  );
}

function F3() {
  return (
    <Frame w={W} h={H}>
      <Host>
        <Pop>
          <Mito x={236} y={92} rot={-14} />
          <Mito x={244} y={158} rot={18} />
          <Mito x={196} y={176} rot={-4} s={0.85} />
        </Pop>
      </Host>
      <Lbl x={350} y={70} tx={252} ty={88} anchor="end" className="bz3-sm bz3-b bz3-halo">
        mitochondrie
      </Lbl>
      <T x={210} y={224}>bakterie žije uvnitř a dodává ATP</T>
    </Frame>
  );
}

function F4() {
  return (
    <Frame w={W} h={H}>
      <Host engulf>
        <Mito x={236} y={84} rot={-14} s={0.85} />
        <Mito x={210} y={170} rot={-4} s={0.85} />
        <ellipse cx={316} cy={120} rx={30} ry={18} className="bz3-vac" />
        <Bact x={316} y={120} rot={-10} s={0.95} cyan />
      </Host>
      <T x={210} y={28}>později: pohlcení sinice</T>
      <T x={350} y={226} a="end">sinice (fotosyntéza)</T>
    </Frame>
  );
}

function F5() {
  return (
    <Frame w={W} h={H}>
      <Host>
        <Mito x={236} y={84} rot={-14} s={0.85} />
        <Mito x={210} y={170} rot={-4} s={0.85} />
        <Pop>
          <Chloro x={270} y={128} rot={10} />
          <Chloro x={92} y={170} rot={-30} s={0.85} />
          <Chloro x={176} y={66} rot={12} s={0.85} />
        </Pop>
      </Host>
      <Lbl x={350} y={70} tx={284} ty={122} anchor="end" className="bz3-sm bz3-b bz3-halo">
        chloroplast
      </Lbl>
      <T x={190} y={224}>předek řas a rostlin</T>
    </Frame>
  );
}

function F6() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      {/* big mitochondrion with its "bacterial" features */}
      <g transform="translate(120 112)">
        <ellipse rx={100} ry={52} className="bz3-mito" />
        <ellipse rx={100} ry={52} fill={pat(id, "d")} opacity={0.3} />
        <ellipse rx={90} ry={43} className="bz3-mito-in" />
        <path d="M-72 -36 V-8 M-58 36 V8 M-44 -42 V-10 M-30 42 V10 M-16 -43 V-14" className="bz3-cristae bz3-cristae-big" />
        <ellipse cx={30} cy={-6} rx={22} ry={13} className="bz3-dna-ring bz3-dna-big" />
        {[
          [62, -18],
          [70, 6],
          [56, 20],
          [44, 30],
          [76, -6],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.6} className="bz3-ribo" />
        ))}
      </g>
      <Pop delay={0.2}>
        <Lbl x={W - 6} y={36} tx={204} ty={86} anchor="end" className="bz3-sm bz3-b bz3-halo">
          dvojitá membrána
        </Lbl>
        <Lbl x={W - 6} y={96} tx={172} ty={106} anchor="end" className="bz3-sm bz3-b bz3-halo">
          vlastní kruhová DNA
        </Lbl>
        <Lbl x={W - 6} y={150} tx={190} ty={122} anchor="end" className="bz3-sm bz3-b bz3-halo">
          ribozomy jako u bakterií
        </Lbl>
      </Pop>
      <Pop delay={0.5}>
        {/* dividing by fission */}
        <g transform="translate(268 196)">
          <path d={`M-30 0 C-30 -13 -6 -13 -2 -4 C2 -13 30 -13 30 0 C30 13 2 13 -2 4 C-6 13 -30 13 -30 0Z`} className="bz3-mito" />
        </g>
        <text x={206} y={200} textAnchor="end" className="bz3-lbl bz3-sm bz3-b bz3-halo">
          dělí se sama
        </text>
      </Pop>
    </Frame>
  );
}

export default function Endosymbiosis() {
  return (
    <Figure level={9} label={LABEL} interactive max={620}>
      <StepFilm
        label={LABEL}
        steps={[
          { title: "Dvě buňky", art: <F1 />, caption: "Velká buňka s jádrem a malá aerobní bakterie, která umí dýchat kyslík." },
          { title: "Pohlcení", art: <F2 />, caption: "Buňka bakterii obalí membránou a pohltí, ale nestráví ji." },
          {
            title: "Vznik mitochondrií",
            art: <F3 />,
            caption: "Bakterie se uvnitř dělí a dodává energii. Její potomci jsou dnešní mitochondrie.",
          },
          { title: "Pohlcení sinice", art: <F4 />, caption: "Některá taková buňka později pohltí i sinici, která umí fotosyntézu." },
          { title: "Vznik chloroplastů", art: <F5 />, caption: "Ze sinice se stane chloroplast. Tak vznikli předci řas a rostlin." },
          {
            title: "Důkazy",
            art: <F6 />,
            caption: "Mitochondrie i chloroplasty mají dvojitou membránu, vlastní kruhovou DNA, bakteriální ribozomy a dělí se samy.",
          },
        ]}
      />
    </Figure>
  );
}
