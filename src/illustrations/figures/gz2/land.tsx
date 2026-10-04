/**
 * Landscape bits shared by the gz2 relief plates: smooth outlines, trees, houses,
 * water with hatching, wave crests and arrows of forces.
 */
import type { ReactNode } from "react";
import { f1, pat, useFig, type P2 } from "./kit";

/** Smooth path through points (Catmull-Rom → cubic Bézier); `closed` closes the loop. */
export function smooth(pts: P2[], closed = false, k = 6) {
  const n = pts.length;
  const at = (i: number) =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / k)} ${f1(p1[1] + (p2[1] - p0[1]) / k)} ${f1(p2[0] - (p3[0] - p1[0]) / k)} ${f1(p2[1] - (p3[1] - p1[1]) / k)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** Polyline path. */
export const poly = (pts: P2[], closed = true) =>
  "M" + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(" L") + (closed ? "Z" : "");

/** A little deciduous tree standing at (x, y). */
export function Tree({ x, y, s = 1, conifer = false }: { x: number; y: number; s?: number; conifer?: boolean }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <path d="M0 0 V-9" className="gz2-trunk" />
      {conifer ? (
        <path d="M0 -26 L6 -14 H3.5 L8 -6 H-8 L-3.5 -14 H-6Z" className="gz2-tree" />
      ) : (
        <path d="M0 -24 C7 -24 9 -18 8 -14 C11 -11 8 -6 3 -7 C1 -5 -3 -5 -4 -7 C-9 -6 -11 -11 -8 -14 C-9 -19 -6 -24 0 -24Z" className="gz2-tree" />
      )}
    </g>
  );
}

/** A small house standing at (x, y). */
export function House({ x, y, s = 1, tilt = 0 }: { x: number; y: number; s?: number; tilt?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${tilt}) scale(${s})`}>
      <path d="M-8 0 V-10 H8 V0Z" className="gz2-fill gz2-o gz2-thin" />
      <path d="M-10 -9 L0 -18 L10 -9Z" className="gz2-roof gz2-o gz2-thin" />
      <path d="M-2.5 0 V-5 H2.5 V0" className="gz2-o gz2-thin" />
    </g>
  );
}

/** Water body: tint + horizontal engraving. */
export function Water({ d, deep = false, className = "" }: { d: string; deep?: boolean; className?: string }) {
  const { id } = useFig();
  return (
    <g className={className}>
      <path d={d} className={deep ? "gz2-sea2" : "gz2-sea"} />
      <path d={d} fill={pat(id, "h")} opacity={0.55} className="gz2-nohit" />
    </g>
  );
}

/** Wavy line from x0 to x1 at height y (crest amplitude a, wavelength l). */
export function waves(x0: number, x1: number, y: number, a = 2.5, l = 16) {
  let d = `M${f1(x0)} ${f1(y)}`;
  for (let x = x0; x < x1 - 0.1; x += l) {
    const e = Math.min(x + l, x1);
    d += ` Q${f1(x + (e - x) / 4)} ${f1(y - a)} ${f1(x + (e - x) / 2)} ${f1(y)} T${f1(e)} ${f1(y)}`;
  }
  return d;
}

/** A labelled boxed caption line (title of a sub-panel). */
export function Head({ x, y, children, anchor = "start", className = "" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; className?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={`gz2-title ${className}`}>
      {children}
    </text>
  );
}

/** Text with a paper-coloured halo, so it reads over hatching. */
export function T({
  x,
  y,
  children,
  a = "middle",
  cls = "",
}: {
  x: number;
  y: number;
  children: ReactNode;
  a?: "start" | "middle" | "end";
  cls?: string;
}) {
  const lines = typeof children === "string" ? children.split("\n") : null;
  return (
    <text x={x} y={y} textAnchor={a} className={`gz2-lbl gz2-halo ${cls}`}>
      {lines && lines.length > 1
        ? lines.map((l, i) => (
            <tspan key={i} x={x} dy={i ? "1.08em" : 0}>
              {l}
            </tspan>
          ))
        : children}
    </text>
  );
}
