import { motion } from "motion/react";
import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, BASE, Fade, Figure, Frame, PAIR, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "CRISPR-Cas9, animace po krocích. 1. Hledání: enzym Cas9 nese vodicí RNA a projíždí DNA. 2. Shoda: kde DNA obsahuje úsek doplňkový k vodicí RNA a hned za ním krátký úsek PAM, Cas9 DNA rozplete a vodicí RNA se s ní spáruje. 3. Střih: Cas9 přestřihne oba řetězce DNA – vznikne dvouřetězcový zlom. 4. Oprava: buňka konce spojí, často s malou chybou, a gen tím vyřadí; nebo podle dodané předlohy do místa zlomu vloží nový úsek – gen opraví nebo přidá.";

const W = 440;
const H = 240;
const CY = 150; // DNA axis
const GAP = 8;
const T0 = 232; // target
const T1 = 322;
const PAM1 = 350;
const CUT = T1 - 12;

const SEQ = (() => {
  const r = rng(5);
  return Array.from({ length: 60 }, () => "ATGC"[Math.floor(r() * 4)]);
})();

/** double-stranded DNA from a to b; `open` lifts the upper strand over the target */
function Dna({
  a = 8,
  b = W - 8,
  y = CY,
  open = false,
  cut = 0,
  insert,
  scar = false,
}: {
  a?: number;
  b?: number;
  y?: number;
  open?: boolean;
  /** half-gap of a double-strand break at CUT */
  cut?: number;
  /** inserted new segment [x0, x1] */
  insert?: [number, number];
  scar?: boolean;
}) {
  const up = (x: number) =>
    open && x > T0 - 14 && x < T1 + 14
      ? -26 * Math.sin((Math.PI * (x - (T0 - 14))) / (T1 - T0 + 28))
      : 0;
  const shift = (x: number) => (cut ? (x < CUT ? -cut : cut) : 0);
  const rungs = [];
  for (let i = 0, x = a + 6; x < b - 2; i++, x += 10) {
    if (cut && Math.abs(x - CUT) < 6) continue;
    const base = SEQ[i % SEQ.length];
    const ins = insert && x > insert[0] && x < insert[1];
    const xs = x + shift(x);
    const yTop = y - GAP + up(x);
    if (open && up(x) < -6) {
      rungs.push(
        <line key={i} x1={xs} x2={xs} y1={yTop} y2={yTop + 7} stroke={BASE[base]} className="bz4-rung" />,
        <line key={`b${i}`} x1={xs} x2={xs} y1={y + GAP} y2={y + GAP - 7} stroke={BASE[PAIR[base]]} className="bz4-rung" />,
      );
    } else
      rungs.push(
        <g key={i} opacity={ins ? 1 : 0.95}>
          <line x1={xs} x2={xs} y1={yTop} y2={y} stroke={BASE[base]} className="bz4-rung" />
          <line x1={xs} x2={xs} y1={y} y2={y + GAP} stroke={BASE[PAIR[base]]} className="bz4-rung" />
        </g>,
      );
  }
  const strand = (dy: number, lift: boolean) => {
    const segs: string[] = [];
    const mk = (from: number, to: number) => {
      const pts: string[] = [];
      for (let x = from; x <= to; x += 4) pts.push(`${f1(x + shift(x))} ${f1(y + dy + (lift ? up(x) : 0))}`);
      segs.push("M" + pts.join(" L"));
    };
    if (cut) {
      mk(a, CUT - 2);
      mk(CUT + 2, b);
    } else mk(a, b);
    return segs.join(" ");
  };
  return (
    <g>
      {rungs}
      <path d={strand(-GAP, true)} className="bz4-strand-old" />
      <path d={strand(GAP, false)} className="bz4-strand-old" />
      {insert && (
        <g>
          <rect x={insert[0]} y={y - GAP - 6} width={insert[1] - insert[0]} height={2 * GAP + 12} rx={3} className="bz4-cr-ins" />
          <path d={`M${insert[0]} ${y - GAP} H${insert[1]} M${insert[0]} ${y + GAP} H${insert[1]}`} className="bz4-strand-new" />
        </g>
      )}
      {scar && <rect x={CUT - 5} y={y - GAP - 3} width={10} height={2 * GAP + 6} rx={2} className="bz4-cr-scar" />}
    </g>
  );
}

function TargetMarks({ y = CY }: { y?: number }) {
  return (
    <g>
      <rect x={T0} y={y + GAP + 6} width={T1 - T0} height={5} className="bz4-cr-tgt" />
      <rect x={T1 + 4} y={y + GAP + 6} width={PAM1 - T1 - 4} height={5} className="bz4-cr-pam" />
      <text x={(T0 + T1) / 2} y={y + 80} textAnchor="middle" className="bz4-lbl bz4-sm">
        cílová sekvence
      </text>
      <line x1={(T0 + T1) / 2} y1={y + 66} x2={(T0 + T1) / 2} y2={y + GAP + 12} className="bz4-lead" />
      <text x={PAM1 + 4} y={y + GAP + 30} className="bz4-lbl bz4-sm bz4-b">
        PAM
      </text>
    </g>
  );
}

/** Cas9 with its guide RNA (the 20-nt spacer pairs with DNA, the scaffold sticks out) */
function Cas9({ x, paired = false }: { x: number; paired?: boolean }) {
  const { id } = useFig();
  const d = `M${x - 70} ${CY + 6} C${x - 80} ${CY - 50} ${x - 30} ${CY - 74} ${x + 10} ${CY - 66} C${x + 56} ${CY - 60} ${x + 80} ${CY - 30} ${x + 70} ${CY + 14} C${x + 62} ${CY + 46} ${x + 10} ${CY + 52} ${x - 30} ${CY + 44} C${x - 58} ${CY + 40} ${x - 66} ${CY + 30} ${x - 70} ${CY + 6}Z`;
  const rnaY = paired ? CY - 2 : CY - 34;
  return (
    <g>
      <path d={d} className="bz4-o bz4-cr-cas" />
      <path d={d} fill={pat(id, "d")} opacity={0.35} className="bz4-nohit" />
      {/* guide RNA: spacer + hairpin scaffold */}
      <path
        d={`M${x - 46} ${rnaY} H${x + 30} C${x + 46} ${rnaY} ${x + 44} ${CY - 60} ${x + 30} ${CY - 70} C${x + 22} ${CY - 84} ${x + 50} ${CY - 92} ${x + 46} ${CY - 72} C${x + 44} ${CY - 60} ${x + 60} ${CY - 56} ${x + 64} ${CY - 80}`}
        className="bz4-strand-rna"
      />
      {Array.from({ length: 9 }, (_, i) => {
        const k = Math.ceil((x - 46 - 14) / 10) + i;
        const bx = 14 + k * 10;
        if (bx > x + 30) return null;
        const b = SEQ[k % SEQ.length];
        return (
          <line
            key={i}
            x1={bx}
            x2={bx}
            y1={rnaY}
            y2={rnaY + 8}
            stroke={BASE[b === "T" ? "U" : b]}
            className="bz4-rung"
          />
        );
      })}
    </g>
  );
}

function Search() {
  return (
    <Frame w={W} h={H}>
      <Dna />
      <TargetMarks />
      <motion.g initial={{ x: -40 }} animate={{ x: 0 }} transition={{ duration: 1.1 }}>
        <Cas9 x={124} />
      </motion.g>
      <Arrow d="M206 40 H252" tone="lvl" />
      <text x={124} y={24} textAnchor="middle" className="bz4-lbl bz4-b">
        Cas9
      </text>
      <text x={262} y={46} className="bz4-lbl bz4-sm bz4-cr-rna-t">
        vodicí RNA hledá shodu
      </text>
    </Frame>
  );
}

function Match() {
  return (
    <Frame w={W} h={H}>
      <Dna open />
      <Fade delay={0.1}>
        <Cas9 x={(T0 + T1) / 2} paired />
      </Fade>
      <TargetMarks />
      <Fade delay={0.6}>
        <text x={(T0 + T1) / 2 - 90} y={44} textAnchor="end" className="bz4-lbl bz4-sm bz4-cr-rna-t">
          vodicí RNA
        </text>
        <text x={(T0 + T1) / 2 - 90} y={62} textAnchor="end" className="bz4-lbl bz4-sm">
          se páruje s DNA
        </text>
        <line x1={(T0 + T1) / 2 - 86} y1={56} x2={T0 + 6} y2={CY - 6} className="bz4-lead" />
      </Fade>
    </Frame>
  );
}

function Cut() {
  return (
    <Frame w={W} h={H}>
      <Dna cut={5} />
      <g opacity={0.35}>
        <Cas9 x={(T0 + T1) / 2} paired />
      </g>
      <TargetMarks />
      <Pop delay={0.3}>
        <path
          d={`M${CUT - 6} ${CY - 40} L${CUT + 4} ${CY - 22} L${CUT - 4} ${CY - 18} L${CUT + 6} ${CY}`}
          className="bz4-cr-bolt"
        />
        <path
          d={`M${CUT + 6} ${CY + 40} L${CUT - 4} ${CY + 22} L${CUT + 4} ${CY + 18} L${CUT - 6} ${CY}`}
          className="bz4-cr-bolt"
        />
      </Pop>
      <Fade delay={0.6}>
        <text x={CUT - 14} y={40} textAnchor="end" className="bz4-lbl bz4-b bz4-red-t">
          dvouřetězcový zlom
        </text>
        <text x={CUT - 14} y={58} textAnchor="end" className="bz4-lbl bz4-sm">
          Cas9 přestřihne oba řetězce
        </text>
      </Fade>
    </Frame>
  );
}

function Repair() {
  return (
    <Frame w={W} h={H}>
      <Fade>
        <text x={8} y={26} className="bz4-lbl bz4-b">
          a) spojení konců
        </text>
        <text x={W - 8} y={26} textAnchor="end" className="bz4-lbl bz4-sm bz4-red-t">
          často s chybou: gen vyřazen
        </text>
      </Fade>
      <g transform="translate(0 -84)">
        <Dna scar />
      </g>
      <Fade delay={0.4}>
        <text x={8} y={134} className="bz4-lbl bz4-b">
          b) podle dodané předlohy
        </text>
        <text x={W - 8} y={134} textAnchor="end" className="bz4-lbl bz4-sm bz4-lvl-t">
          vložen nový úsek: gen opraven
        </text>
      </Fade>
      <Pop delay={0.5}>
        <Dna y={176} insert={[CUT - 30, CUT + 30]} />
      </Pop>
    </Frame>
  );
}

const STEPS = [
  {
    title: "Hledání",
    caption: "Cas9 nese vodicí RNA, kterou vědci navrhli podle hledaného místa, a projíždí DNA.",
    art: <Search />,
  },
  {
    title: "Shoda",
    caption: "Kde je DNA doplňková k vodicí RNA a hned za ní úsek PAM, Cas9 DNA rozplete a RNA se s ní spáruje.",
    art: <Match />,
  },
  {
    title: "Střih",
    caption: "Cas9 přestřihne oba řetězce DNA přesně v tomto místě.",
    art: <Cut />,
  },
  {
    title: "Oprava",
    caption: "Buňka zlom opraví: buď konce slepí (často s chybou, gen se vyřadí), nebo podle předlohy vloží nový úsek.",
    art: <Repair />,
  },
];

export default function Crispr() {
  return (
    <Figure level={10} label={LABEL} max={620} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
