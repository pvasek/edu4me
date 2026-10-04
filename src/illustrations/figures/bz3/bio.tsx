/**
 * Shared organism glyphs for the bz3 plates (engraved, fine outlines, hatching).
 */
import { f1, pat, useFig } from "./kit";

export const PURPLE = "#8a55b0";
export const PURPLE_PALE = "#c9a8de";
export const WHITE_PETAL = "#fbf8f0";
export const LEAF = "#5c8f4e";
export const LEAF_LIGHT = "#8dbb72";
export const BARK = "#8a6a48";

/** Pea flower seen from the front: notched banner, two wings, keel, green calyx and stalk. */
export function PeaFlower({
  x,
  y,
  s = 1,
  white = false,
}: {
  x: number;
  y: number;
  s?: number;
  white?: boolean;
}) {
  const { id } = useFig();
  const banner = white ? WHITE_PETAL : PURPLE_PALE;
  const wing = white ? WHITE_PETAL : PURPLE;
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <path d="M0 22 Q-1 30 -5 38" className="bz3-stalk" />
      <path
        d="M0 6 C-20 7 -25 -16 -9 -22 Q-2 -22 0 -16 Q2 -22 9 -22 C25 -16 20 7 0 6Z"
        fill={banner}
        className="bz3-o bz3-petal"
      />
      <path
        d="M0 2 L0 -14 M-2 2 L-9 -14 M2 2 L9 -14 M-3 3 L-15 -6 M3 3 L15 -6"
        className="bz3-vein"
      />
      <path
        d="M-1 5 C-14 3 -20 16 -10 21 C-5 22 -2 16 -1 5Z"
        fill={wing}
        className="bz3-o bz3-petal"
      />
      <path
        d="M1 5 C14 3 20 16 10 21 C5 22 2 16 1 5Z"
        fill={wing}
        className="bz3-o bz3-petal"
      />
      {!white && (
        <path
          d="M-1 5 C-14 3 -20 16 -10 21 C-5 22 -2 16 -1 5Z M1 5 C14 3 20 16 10 21 C5 22 2 16 1 5Z"
          fill={pat(id, "d")}
        />
      )}
      <path
        d="M-3 8 C-5 19 5 19 3 8Z"
        fill={white ? WHITE_PETAL : PURPLE_PALE}
        className="bz3-o bz3-petal"
      />
      <path d="M-6 17 L-3 24 H3 L6 17 L2 20 L0 16 L-2 20Z" className="bz3-calyx" />
    </g>
  );
}

/** A dried pea seed (round). */
export function Pea({
  x,
  y,
  r = 7,
  color = "#d9c45a",
}: {
  x: number;
  y: number;
  r?: number;
  color?: string;
}) {
  const { id } = useFig();
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} className="bz3-o bz3-thin" />
      <path
        d={`M${x + r * 0.2} ${y + r * 0.95} A${r} ${r} 0 0 0 ${x + r * 0.95} ${y + r * 0.2} A${r * 1.2} ${r * 1.2} 0 0 1 ${x + r * 0.2} ${y + r * 0.95}Z`}
        fill={pat(id, "sh")}
      />
      <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} className="bz3-shine-dot" />
    </g>
  );
}

/** Simple human figure for pedigrees is drawn with symbols; this is the X / Y glyph. */
export function SexChromosome({
  x,
  y,
  kind,
  h = 70,
  w = 13,
  gene,
}: {
  x: number;
  y: number;
  kind: "X" | "Y";
  h?: number;
  w?: number;
  /** allele mark on the X ("D" healthy, "d" colour blind, "L" the locus only) */
  gene?: "D" | "d" | "L";
}) {
  const { id } = useFig();
  const L = kind === "X" ? h : h * 0.42;
  const c = kind === "X" ? L * 0.4 : L * 0.25;
  const r = w / 2;
  const pinch = 4;
  const chromatid = (cx: number) =>
    `M${f1(cx - r)} ${f1(y + r)} A${r} ${r} 0 0 1 ${f1(cx + r)} ${f1(y + r)} L${f1(cx + r)} ${f1(y + c - pinch)} Q${f1(cx + r * 0.2)} ${f1(y + c)} ${f1(cx + r)} ${f1(y + c + pinch)} L${f1(cx + r)} ${f1(y + L - r)} A${r} ${r} 0 0 1 ${f1(cx - r)} ${f1(y + L - r)} L${f1(cx - r)} ${f1(y + c + pinch)} Q${f1(cx - r * 0.2)} ${f1(y + c)} ${f1(cx - r)} ${f1(y + c - pinch)}Z`;
  const gy = y + L * 0.68;
  return (
    <g>
      {[x - r - 0.5, x + r + 0.5].map((cx) => (
        <g key={cx}>
          <path
            d={chromatid(cx)}
            className={`bz3-o ${kind === "X" ? "bz3-chr-x" : "bz3-chr-y"}`}
          />
          <path d={chromatid(cx)} fill={pat(id, "d")} opacity={0.6} />
          {gene && (
            <rect
              x={cx - r}
              y={gy - 3.5}
              width={w}
              height={7}
              className={gene === "D" ? "bz3-gene-ok" : gene === "d" ? "bz3-gene-bad" : "bz3-gene-locus"}
            />
          )}
        </g>
      ))}
    </g>
  );
}

/** Peppered moth (Biston betularia) seen from above, wings spread. */
export function Moth({
  x,
  y,
  s = 1,
  dark = false,
  rot = 0,
}: {
  x: number;
  y: number;
  s?: number;
  dark?: boolean;
  rot?: number;
}) {
  const wing = dark ? "#2b2a2c" : "#ece7da";
  const spots = dark ? "#4a474a" : "#2b2a2c";
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})`}>
      {/* fore- and hindwings */}
      <path
        d="M0 -3 C-6 -9 -20 -10 -24 -6 C-22 -1 -12 3 0 2Z M0 -3 C6 -9 20 -10 24 -6 C22 -1 12 3 0 2Z"
        fill={wing}
        className="bz3-moth-o"
      />
      <path
        d="M0 1 C-6 1 -15 4 -14 9 C-9 11 -3 7 0 4Z M0 1 C6 1 15 4 14 9 C9 11 3 7 0 4Z"
        fill={wing}
        className="bz3-moth-o"
      />
      {/* peppering */}
      <path
        d="M-18 -6 l1 0.6 M-13 -5 l1.2 -0.4 M-8 -3 l0.8 0.8 M-15 -2 l1 0 M-20 -7 l0.6 0.8 M-10 4 l1 0.4 M-7 7 l0.6 0.8 M18 -6 l-1 0.6 M13 -5 l-1.2 -0.4 M8 -3 l-0.8 0.8 M15 -2 l-1 0 M20 -7 l-0.6 0.8 M10 4 l-1 0.4 M7 7 l-0.6 0.8 M-12 -7.5 C-9 -5 -6 -6 -4 -4 M12 -7.5 C9 -5 6 -6 4 -4"
        stroke={spots}
        className="bz3-moth-spots"
      />
      {/* body and antennae */}
      <ellipse cx={0} cy={1} rx={1.8} ry={7} fill={dark ? "#1d1c1e" : "#cfc6b3"} className="bz3-moth-o" />
      <path d="M-0.6 -5.5 Q-3 -10 -6 -11 M0.6 -5.5 Q3 -10 6 -11" className="bz3-moth-ant" />
    </g>
  );
}

/** A small perched or flying songbird (silhouette with an engraved eye). */
export function Bird({
  x,
  y,
  s = 1,
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <path
        d="M-18 2 C-12 -6 -2 -9 6 -6 C9 -10 14 -10 16 -7 L22 -6 L16 -4 C16 2 10 8 0 8 C-6 8 -10 6 -12 5 L-22 8 L-18 2Z"
        className="bz3-bird"
      />
      <path d="M-6 -4 C-2 -14 6 -16 10 -12 C4 -10 0 -6 -2 -2Z" className="bz3-bird-wing" />
      <circle cx={12} cy={-6.5} r={1.3} className="bz3-bird-eye" />
    </g>
  );
}
