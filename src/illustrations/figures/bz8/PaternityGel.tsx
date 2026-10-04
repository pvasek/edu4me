import { motion, type Variants } from "motion/react";
import { ease } from "../../../ui/motion";
import { Fade, Figure, pat, useFig } from "./kit";

const LABEL =
  "Gelová elektroforéza při určování otcovství. Pět drah: žebříček známých délek, matka, dítě, muž A a muž B. DNA putuje od záporné elektrody nahoře ke kladné dole, kratší úseky doputují dál. Dítě má proužky ve 2. a 4. řadě. Proužek ve 2. řadě má i matka, takže ho dítě zdědilo po ní. Proužek ve 4. řadě má jen muž A, a ten proto může být otcem. Muž B tento proužek nemá a je vyloučen.";

const W = 440;
const H = 404;
const GX = 72;
const LANE = 64;
const TOP = 62;
const BOT = 318;
const WELL = 74;
const ROWS = [116, 152, 188, 224, 260];
const LANES = ["M", "matka", "dítě", "muž A", "muž B"];
const cx = (i: number) => GX + LANE / 2 + i * LANE;

type Tone = "mom" | "dad" | "ink";
/** bands per lane (row index 1–5) and where each child allele came from */
const BANDS: [number, number, Tone][] = [
  [1, 2, "mom"],
  [1, 5, "ink"],
  [2, 2, "mom"],
  [2, 4, "dad"],
  [3, 1, "ink"],
  [3, 4, "dad"],
  [4, 3, "ink"],
  [4, 5, "ink"],
];
const LADDER = [96, 108, 122, 136, 152, 170, 188, 206, 224, 242, 260, 280, 300];

/** a band travels from its well down to its final place */
const migrate: Variants = {
  hidden: (d: number) => ({ opacity: 0, y: -d }),
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, delay: 0.15, ease: ease.out },
  },
};

function Band({ x, y, tone, w = 44, h = 9 }: { x: number; y: number; tone: Tone; w?: number; h?: number }) {
  return (
    <motion.g variants={migrate} custom={y - WELL}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        className={`bz8-band bz8-band-${tone}`}
      />
    </motion.g>
  );
}

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* lane headers */}
      {LANES.map((t, i) => (
        <text
          key={t}
          x={cx(i)}
          y={44}
          textAnchor="middle"
          className={`bz8-lbl bz8-b ${i === 2 ? "bz8-lvl-t" : ""}`}
        >
          {t}
        </text>
      ))}
      <text x={414} y={44} textAnchor="middle" className="bz8-lbl bz8-sm bz8-muted-t">
        řada
      </text>
      {/* gel slab */}
      <rect x={GX} y={TOP} width={LANE * 5} height={BOT - TOP} rx={4} className="bz8-gel" />
      <rect x={GX} y={TOP} width={LANE * 5} height={BOT - TOP} rx={4} fill={pat(id, "d")} opacity={0.35} />
      <rect x={GX} y={TOP} width={LANE * 5} height={BOT - TOP} rx={4} className="bz8-o" />
      {LANES.map((_, i) => (
        <rect key={i} x={cx(i) - 23} y={WELL - 4} width={46} height={8} rx={1.5} className="bz8-well" />
      ))}
      {/* electrodes and direction */}
      <circle cx={34} cy={WELL} r={13} className="bz8-tag" />
      <text x={34} y={WELL + 6} textAnchor="middle" className="bz8-eq bz8-eq-lg">
        −
      </text>
      <circle cx={34} cy={BOT - 4} r={13} className="bz8-tag-lvl" />
      <text x={34} y={BOT + 1} textAnchor="middle" className="bz8-eq bz8-eq-lg">
        +
      </text>
      <path d={`M34 ${WELL + 20} V${BOT - 24}`} className="bz8-arr bz8-arr-ink" markerEnd={pat(id, "ah-ink")} />
      <text
        x={22}
        y={(WELL + BOT) / 2}
        textAnchor="middle"
        transform={`rotate(-90 22 ${(WELL + BOT) / 2})`}
        className="bz8-lbl bz8-sm"
      >
        pohyb DNA
      </text>
      {/* row numbers */}
      {ROWS.map((y, r) => (
        <text key={r} x={414} y={y + 5} textAnchor="middle" className="bz8-num">
          {r + 1}
        </text>
      ))}
      <text x={GX} y={342} className="bz8-lbl bz8-sm bz8-muted-t bz8-sec">
        kratší úseky doputují dál
      </text>
      {/* ladder */}
      {LADDER.map((y) => (
        <Band key={y} x={cx(0)} y={y} tone="ink" w={38} h={4} />
      ))}
      {/* sample bands */}
      {BANDS.map(([lane, row, tone]) => (
        <Band key={`${lane}-${row}`} x={cx(lane)} y={ROWS[row - 1]} tone={tone} />
      ))}
      {/* which child band came from whom */}
      <Fade delay={1.7}>
        <path d={`M${cx(1) + 24} ${ROWS[1]} H${cx(2) - 24}`} className="bz8-link bz8-link-mom" />
        <path d={`M${cx(2) + 24} ${ROWS[3]} H${cx(3) - 24}`} className="bz8-link bz8-link-dad" />
      </Fade>
      <Fade delay={2}>
        <text x={cx(3)} y={340} textAnchor="middle" className="bz8-lbl bz8-big bz8-b bz8-good-t">
          ✓
        </text>
        <text x={cx(3)} y={358} textAnchor="middle" className="bz8-lbl bz8-sm bz8-b bz8-good-t">
          může být
        </text>
        <text x={cx(4)} y={340} textAnchor="middle" className="bz8-lbl bz8-big bz8-b bz8-red-t">
          ✗
        </text>
        <text x={cx(4)} y={358} textAnchor="middle" className="bz8-lbl bz8-sm bz8-b bz8-red-t">
          vyloučen
        </text>
      </Fade>
      {/* legend */}
      <rect x={GX} y={378} width={26} height={9} rx={3} className="bz8-band bz8-band-mom" />
      <text x={GX + 34} y={387} className="bz8-lbl bz8-sm">
        alela od matky
      </text>
      <rect x={GX + 166} y={378} width={26} height={9} rx={3} className="bz8-band bz8-band-dad" />
      <text x={GX + 200} y={387} className="bz8-lbl bz8-sm">
        alela od otce
      </text>
    </>
  );
}

export default function PaternityGel() {
  return (
    <Figure level={10} label={LABEL} w={W} h={H} max={560} replay>
      <Plate />
    </Figure>
  );
}
