/**
 * Small engraved cell glyphs shared by the bz4 plates (stem cells, cancer,
 * immunity). Each is drawn around (x, y) at scale `s`.
 */
import { Cell, blob, f1, pat, smooth, useFig, type P2 } from "./kit";

type G = { x: number; y: number; s?: number };
const tr = (x: number, y: number, s = 1, rot = 0) =>
  `translate(${f1(x)} ${f1(y)})${rot ? ` rotate(${rot})` : ""} scale(${s})`;

/** a stem cell: round, big nucleus, little cytoplasm */
export function StemCell({ x, y, s = 1, lvl = true }: G & { lvl?: boolean }) {
  return (
    <g transform={tr(x, y, s)}>
      <Cell
        x={0}
        y={0}
        rx={22}
        seed={5}
        fill={lvl ? "color-mix(in srgb, var(--lvl) 28%, var(--surface))" : undefined}
        nr={12}
      />
    </g>
  );
}

/** red blood cell: biconcave disc seen from the side-top */
export function RedCell({ x, y, s = 1 }: G) {
  return (
    <g transform={tr(x, y, s)}>
      <ellipse cx={0} cy={0} rx={15} ry={11} className="bz4-o bz4-rbc" />
      <ellipse cx={0} cy={0.5} rx={7} ry={4.5} className="bz4-rbc-dip" />
    </g>
  );
}

/** white blood cell (neutrophil) with a lobed nucleus */
export function WhiteCell({ x, y, s = 1 }: G) {
  return (
    <g transform={tr(x, y, s)}>
      <Cell x={0} y={0} rx={15} seed={8} nucleus={false} fill="var(--bz4-wbc)" />
      <path
        d="M-8 -2 C-10 -8 -3 -9 -2 -4 C0 -9 6 -8 5 -2 C10 -1 9 6 3 5 C1 9 -6 8 -5 3 C-10 4 -11 0 -8 -2Z"
        className="bz4-o bz4-thin"
        fill="var(--bz4-nuc)"
      />
    </g>
  );
}

export function Platelets({ x, y, s = 1 }: G) {
  return (
    <g transform={tr(x, y, s)}>
      <path d={blob(-7, -2, 4.5, 3, 2, 0.2, 7)} className="bz4-o bz4-thin bz4-plt" />
      <path d={blob(4, -5, 3.5, 2.6, 4, 0.2, 7)} className="bz4-o bz4-thin bz4-plt" />
      <path d={blob(2, 4, 4, 3, 6, 0.2, 7)} className="bz4-o bz4-thin bz4-plt" />
    </g>
  );
}

/** neuron: soma with dendrites and an axon */
export function Neuron({ x, y, s = 1 }: G) {
  return (
    <g transform={tr(x, y, s)}>
      <path
        d="M-6 -6 L-16 -16 M-16 -16 L-22 -14 M-16 -16 L-17 -23 M6 -6 L14 -18 M14 -18 L20 -20 M14 -18 L13 -25 M-7 3 L-19 6 M-19 6 L-24 2 M2 8 L4 30 M4 30 L-1 36 M4 30 L9 36 M4 30 L4 37"
        className="bz4-o"
      />
      <path d={blob(0, 0, 9, 8, 3, 0.1, 8)} className="bz4-o bz4-neu" />
      <circle cx={0} cy={0} r={3.4} className="bz4-o bz4-thin" fill="var(--bz4-nuc)" />
    </g>
  );
}

/** a piece of striated skeletal muscle fibre with several nuclei */
export function MuscleFibre({ x, y, s = 1 }: G) {
  const { id } = useFig();
  return (
    <g transform={tr(x, y, s)}>
      <rect x={-24} y={-9} width={48} height={18} rx={8} className="bz4-o bz4-mus" />
      <rect x={-24} y={-9} width={48} height={18} rx={8} fill={pat(id, "v")} opacity={0.7} />
      <ellipse cx={-10} cy={-3} rx={4} ry={2} className="bz4-o bz4-thin" fill="var(--bz4-nuc)" />
      <ellipse cx={9} cy={3} rx={4} ry={2} className="bz4-o bz4-thin" fill="var(--bz4-nuc)" />
    </g>
  );
}

/** a sheet of cuboidal epithelial (skin / gut lining) cells */
export function Epithelium({ x, y, s = 1 }: G) {
  return (
    <g transform={tr(x, y, s)}>
      {[-18, -6, 6, 18].map((cx) => (
        <g key={cx}>
          <rect x={cx - 6} y={-9} width={12} height={18} className="bz4-o bz4-thin bz4-epi" />
          <circle cx={cx} cy={1} r={2.6} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
        </g>
      ))}
    </g>
  );
}

/** heart muscle cells: branched, striated, one central nucleus */
export function HeartCells({ x, y, s = 1 }: G) {
  const { id } = useFig();
  const d = "M-24 -8 H-4 L2 -14 H22 V-2 H6 L2 4 V10 H-20 V2 H-24Z";
  return (
    <g transform={tr(x, y, s)}>
      <path d={d} className="bz4-o bz4-mus" />
      <path d={d} fill={pat(id, "v")} opacity={0.6} />
      <path d="M-4 -8 V10" className="bz4-o bz4-thin" />
      <ellipse cx={-12} cy={1} rx={3} ry={2} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
      <ellipse cx={12} cy={-8} rx={3} ry={2} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
    </g>
  );
}

/** skin fibroblast: a spindle-shaped cell */
export function Fibroblast({ x, y, s = 1 }: G) {
  const d = smooth(
    [
      [-28, 2],
      [-10, -7],
      [6, -9],
      [26, -3],
      [8, 5],
      [-8, 8],
    ] as P2[],
    true,
  );
  return (
    <g transform={tr(x, y, s)}>
      <path d={d} className="bz4-o" fill="var(--bz4-cyto)" />
      <ellipse cx={-1} cy={-1} rx={7} ry={4} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
    </g>
  );
}

/** early embryo (blastocyst): ring of flat cells, inner cell mass, cavity */
export function Blastocyst({ x, y, s = 1 }: G) {
  const ring = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);
  return (
    <g transform={tr(x, y, s)}>
      <circle cx={0} cy={0} r={30} className="bz4-o" fill="var(--bz4-cyto)" />
      <circle cx={0} cy={0} r={23} className="bz4-o bz4-thin bz4-fill" />
      {ring.map((a, i) => (
        <line
          key={i}
          x1={Math.cos(a) * 23}
          y1={Math.sin(a) * 23}
          x2={Math.cos(a) * 30}
          y2={Math.sin(a) * 30}
          className="bz4-o bz4-thin"
        />
      ))}
      {/* inner cell mass */}
      {[
        [-8, -14],
        [2, -16],
        [11, -12],
        [-3, -7],
        [7, -5],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={5.2}
          className="bz4-o bz4-thin"
          fill="color-mix(in srgb, var(--lvl) 30%, var(--surface))"
        />
      ))}
    </g>
  );
}

/** macrophage: large irregular cell with pseudopodia */
export function Macrophage({ x, y, s = 1 }: G) {
  const d = smooth(
    [
      [-30, -4],
      [-20, -16],
      [-8, -14],
      [0, -26],
      [10, -14],
      [26, -16],
      [22, -2],
      [32, 8],
      [14, 14],
      [4, 24],
      [-8, 14],
      [-24, 16],
      [-20, 4],
    ] as P2[],
    true,
  );
  return (
    <g transform={tr(x, y, s)}>
      <path d={d} className="bz4-o" fill="var(--bz4-wbc)" />
      <path d={blob(-4, 2, 9, 7, 9, 0.1, 8)} className="bz4-o bz4-thin" fill="var(--bz4-nuc)" />
    </g>
  );
}

/** lymphocyte (T or B): round, nucleus fills most of it; optional receptor ticks */
export function Lymphocyte({
  x,
  y,
  s = 1,
  fill,
  receptors = false,
  text,
}: G & { fill?: string; receptors?: boolean; text?: string }) {
  return (
    <g transform={tr(x, y, s)}>
      {receptors &&
        Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.3;
          return (
            <path
              key={i}
              d={`M${f1(Math.cos(a) * 17)} ${f1(Math.sin(a) * 17)} L${f1(Math.cos(a) * 22)} ${f1(Math.sin(a) * 22)}`}
              className="bz4-o bz4-thin"
            />
          );
        })}
      <circle cx={0} cy={0} r={17} className="bz4-o" fill={fill ?? "var(--bz4-wbc)"} />
      <circle cx={1} cy={-1} r={12} className="bz4-o bz4-thin" fill="var(--bz4-nuc)" />
      {text && (
        <text x={1} y={3.5} textAnchor="middle" className="bz4-cell-t">
          {text}
        </text>
      )}
    </g>
  );
}

/** plasma cell: oval, eccentric nucleus, lots of rough ER (lines) */
export function PlasmaCell({ x, y, s = 1 }: G) {
  return (
    <g transform={tr(x, y, s)}>
      <ellipse cx={0} cy={0} rx={22} ry={16} className="bz4-o" fill="color-mix(in srgb, var(--lvl) 22%, var(--surface))" />
      <circle cx={-10} cy={0} r={8} className="bz4-o bz4-thin" fill="var(--bz4-nuc)" />
      <path d="M2 -9 C8 -7 12 -8 16 -5 M2 -3 C8 -1 12 -2 18 0 M2 3 C8 5 12 4 17 6 M3 9 C8 10 11 10 14 9" className="bz4-o bz4-thin" />
    </g>
  );
}

/** a bacterium (rod) with a few antigen spikes */
export function Bacterium({ x, y, s = 1, rot = 0 }: G & { rot?: number }) {
  return (
    <g transform={tr(x, y, s, rot)}>
      <rect x={-14} y={-6} width={28} height={12} rx={6} className="bz4-o bz4-bact" />
      {[-8, 0, 8].map((cx) => (
        <path key={cx} d={`M${cx} -6 l-2 -4 m2 4 l2 -4`} className="bz4-o bz4-thin bz4-ag" />
      ))}
    </g>
  );
}
