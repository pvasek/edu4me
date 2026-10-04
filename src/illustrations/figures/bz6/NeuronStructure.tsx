import { Callouts, Legend, type Callout } from "./callouts";
import { Draw, DrawArrow, Eq, Fade, Figure, Pop, Travel, blob, pat, useCompact, useFig, useLive } from "./kit";

const LABEL =
  "Stavba neuronu. Z těla neuronu s jádrem vybíhají krátké větvené dendrity, které přijímají signály od jiných buněk. Opačným směrem vede jediný dlouhý axon (neurit), obalený tukovou myelinovou pochvou; pochva je přerušená Ranvierovými zářezy, mezi nimiž signál přeskakuje, a proto běží rychle. Na konci se axon větví do zakončení, která na synapsích předají signál další buňce. Signál běží vždy jedním směrem: od dendritů přes tělo neuronu a axon k zakončením.";

const SOMA = blob([
  [70, 92],
  [96, 84],
  [120, 102],
  [134, 118],
  [120, 134],
  [98, 152],
  [72, 146],
  [60, 120],
]);
const DENDRITES = [
  "M72 96 C60 80 50 66 40 50",
  "M96 86 C100 66 110 50 122 34",
  "M62 112 C46 112 32 108 16 100",
  "M74 146 C64 166 56 180 44 196",
  "M100 150 C108 172 112 186 124 202",
];
const TWIGS = [
  "M50 66 L30 70",
  "M40 50 L34 32",
  "M40 50 L54 34",
  "M110 50 L96 40",
  "M122 34 L118 16",
  "M122 34 L140 26",
  "M32 108 L22 124",
  "M16 100 L8 86",
  "M56 180 L72 200",
  "M44 196 L28 204",
  "M44 196 L44 216",
  "M124 202 L142 208",
  "M124 202 L120 222",
];
const SEG0 = 158;
const SEG = 46;
const GAP = 9;
const SEGS = Array.from({ length: 5 }, (_, i) => SEG0 + i * (SEG + GAP));
const NODES = SEGS.slice(0, 4).map((x) => x + SEG + GAP / 2);
const TERMINALS: [string, number, number][] = [
  ["M440 118 C462 112 474 86 496 70", 496, 70],
  ["M440 118 C470 118 488 104 512 104", 512, 104],
  ["M440 118 C470 122 488 138 510 140", 510, 140],
  ["M440 118 C456 128 470 156 494 172", 494, 172],
];

const ITEMS: Callout[] = [
  { t: "dendrity", x: 10, y: 24, tx: 46, ty: 59 },
  { t: "jádro", x: 150, y: 30, tx: 96, ty: 114 },
  { t: "tělo neuronu", x: 12, y: 240, tx: 84, ty: 142 },
  { t: "axon (neurit)", x: 150, y: 240, tx: 142, ty: 118 },
  { t: "myelinová pochva", x: 178, y: 72, tx: 236, ty: 108 },
  { t: "Ranvierův zářez", x: 296, y: 30, tx: NODES[2], ty: 118 },
  { t: "zakončení axonu", x: 530, y: 26, tx: 496, ty: 64, anchor: "end" },
];

function Neuron({ narrow }: { narrow: boolean }) {
  const { id } = useFig();
  const live = useLive();
  return (
    <>
      {DENDRITES.map((d, i) => (
        <Draw key={d} d={d} className="bz6-dend" delay={0.05 * i} />
      ))}
      {TWIGS.map((d, i) => (
        <Draw key={d} d={d} className="bz6-dend bz6-dend-fine" delay={0.3 + 0.03 * i} />
      ))}
      <Draw d="M134 118 H440" className="bz6-axon" delay={0.2} />
      {TERMINALS.map(([d, x, y], i) => (
        <g key={i}>
          <Draw d={d} className="bz6-axon bz6-axon-fine" delay={0.9 + 0.08 * i} />
          <Pop delay={1.3 + 0.08 * i}>
            <circle cx={x} cy={y} r={6.5} className="bz6-o bz6-knob" />
          </Pop>
        </g>
      ))}
      <path d={SOMA} className="bz6-o bz6-soma" />
      <path d={SOMA} fill={pat(id, "d")} opacity={0.45} />
      <circle cx={96} cy={116} r={13} className="bz6-o bz6-thin bz6-lvlsoft-f" />
      <circle cx={100} cy={112} r={4} className="bz6-ink-f" opacity={0.75} />
      {/* myelin sheath (Schwann cells) with nodes between them */}
      {SEGS.map((x, i) => (
        <Pop key={x} delay={0.5 + 0.1 * i}>
          <rect x={x} y={107} width={SEG} height={22} rx={11} className="bz6-o bz6-myelin" />
          <rect x={x} y={107} width={SEG} height={22} rx={11} fill={pat(id, "v")} opacity={0.35} />
          {i % 2 === 0 && <ellipse cx={x + SEG / 2} cy={110.5} rx={7} ry={2.6} className="bz6-o bz6-hair bz6-lvlsoft-f" />}
        </Pop>
      ))}
      {/* the signal: jumps from node to node */}
      {live && (
        <Travel path="M134 118 H440 C470 118 488 104 512 104" dur={2.4} rest={[134, 118]} fade>
          <circle r={6} className="bz6-spark" />
        </Travel>
      )}
      <DrawArrow d="M220 196 H430" tone="lvl" delay={1.2} className="bz6-thick" />
      <Fade delay={1.4}>
        <Eq x={325} y={186} t="směr signálu" anchor="middle" className={`bz6-lvl-t ${narrow ? "bz6-eq-lg" : ""}`} />
      </Fade>
      <Fade delay={0.8}>
        <Callouts items={ITEMS} narrow={narrow} r={narrow ? 14 : 10} />
      </Fade>
    </>
  );
}

export default function NeuronStructure() {
  const cmp = useCompact(480);
  return (
    <Figure
      label={LABEL}
      level={6}
      w={540}
      h={252}
      max={680}
      compact={cmp}
      boost={false}
      replay
      controls={cmp.narrow ? <Legend items={ITEMS} /> : undefined}
    >
      <Neuron narrow={cmp.narrow} />
    </Figure>
  );
}
