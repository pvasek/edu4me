/**
 * Small engraved animal silhouettes (facing right, about 60 × 30 around 0,0)
 * for the cladogram and the speciation plates.
 */
import { pat, useFig } from "./kit";

const PATHS: Record<string, { body: string; detail?: string; eye?: [number, number] }> = {
  mihule: {
    body: "M-30 3 C-24 -2 -6 -4 12 -3 C22 -3 28 -2 30 1 C29 5 22 6 12 6 C-6 7 -24 7 -30 3Z",
    detail: "M8 1 h0.1 M11 1 h0.1 M14 1 h0.1 M17 1 h0.1 M20 1 h0.1 M-24 2 C-14 0 -6 -6 4 -3",
    eye: [24, 0],
  },
  zralok: {
    body: "M-30 -8 L-24 1 L-30 9 L-20 3 C-8 6 10 7 22 4 C28 3 31 1 30 -1 C26 -5 16 -6 8 -6 L2 -15 L-2 -6 C-10 -5 -16 -3 -20 -1Z",
    detail: "M10 4 L4 11 L14 6 M14 -2 v4 M17 -2 v4 M20 -2 v4",
    eye: [24, -2],
  },
  kapr: {
    body: "M-30 -10 L-22 0 L-30 10 L-18 3 C-10 12 14 12 26 2 C28 0 28 -1 26 -3 C14 -14 -10 -12 -18 -3Z",
    detail: "M10 -9 C12 -4 12 4 10 9 M-4 -11 L0 -16 L8 -11 M-2 7 L2 12 L6 8",
    eye: [20, -2],
  },
  skokan: {
    body: "M-20 6 C-24 -4 -10 -14 6 -12 C16 -11 24 -6 26 0 C27 4 22 6 18 6 L-4 8 C-12 9 -18 9 -20 6Z",
    detail: "M-14 4 C-24 6 -24 14 -12 14 L4 14 M-6 9 L-10 14 M10 6 C12 10 12 12 16 14 L20 14 M8 -4 C10 0 14 2 18 2",
    eye: [16, -8],
  },
  jesterka: {
    body: "M-30 2 C-20 -2 -6 -4 6 -4 C16 -5 26 -3 30 0 C27 3 18 3 8 4 C-6 5 -20 5 -30 2Z",
    detail: "M-4 3 L-8 10 L-12 10 M-4 -3 L-8 -10 L-12 -10 M14 3 L18 10 L22 10 M14 -4 L18 -10 L22 -10",
    eye: [24, -1],
  },
  mys: {
    body: "M-14 6 C-18 -2 -10 -12 4 -12 C14 -12 22 -6 28 2 C24 6 16 8 6 8 L-10 8 C-12 8 -13 7 -14 6Z",
    detail: "M-14 4 C-22 4 -28 0 -30 -6 M10 -10 C8 -18 16 -18 16 -10 M-6 8 v4 M12 8 v4",
    eye: [20, -2],
  },
  pinkava: {
    body: "M-20 2 C-16 -8 -4 -12 6 -10 C12 -14 20 -12 22 -6 C23 -1 18 6 2 8 C-8 9 -16 8 -20 2Z M-20 2 L-30 -2 L-28 6Z",
    detail: "M-12 0 C-4 -2 4 0 10 4 M2 8 L0 14 M8 8 L8 14",
    eye: [16, -7],
  },
};

export function Animal({
  kind,
  x,
  y,
  s = 1,
  flip = false,
  tone = "bz4-an",
  beak,
}: {
  kind: keyof typeof PATHS;
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  tone?: string;
  /** finch beak size override (speciation) */
  beak?: "thick" | "thin";
}) {
  const { id } = useFig();
  const p = PATHS[kind];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d={p.body} className={`bz4-o ${tone}`} />
      <path d={p.body} fill={pat(id, "d")} opacity={0.4} className="bz4-nohit" />
      {p.detail && <path d={p.detail} className="bz4-o bz4-thin" fill="none" />}
      {beak === "thick" && <path d="M21 -10 L32 -5 L21 1Z" className="bz4-o bz4-an-beak" />}
      {beak === "thin" && <path d="M21 -7 L35 -5 L21 -3Z" className="bz4-o bz4-an-beak" />}
      {kind === "pinkava" && !beak && <path d="M21 -8 L31 -5 L21 -2Z" className="bz4-o bz4-an-beak" />}
      {p.eye && <circle cx={p.eye[0]} cy={p.eye[1]} r={1.6} className="bz4-an-eye" />}
    </g>
  );
}
