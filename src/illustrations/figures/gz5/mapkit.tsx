/**
 * Helpers for the gz5 figures drawn on a real map (GeoMap from src/geo, spec/geo.md):
 * a wrapper with the gz5 tokens, smooth lines through lon/lat points, arrow heads and
 * haloed labels. Everything is drawn in GeoMap's viewBox units; `u` (units per CSS px)
 * keeps text and arrow heads the same size on screen at any width.
 */
import { useEffect, useState, type ReactNode } from "react";
import { loadView, peekView, type GeoData } from "../../../geo";
import type { MapView } from "../../../core/types";
import { smoothPath, type P2 } from "./kit";
import "./gz5.css";

export type LL = [number, number]; // [lon, lat]
export type Proj = (lon: number, lat: number) => [number, number];

/** gz5 tokens around a GeoMap plus an HTML legend under it. */
export function MapFig({
  level,
  legend,
  note,
  children,
}: {
  level: 8 | 9;
  legend?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`gz5 gz5-l${level} gz5-map`}>
      {children}
      {legend && (
        <ul className="gz5-map-legend" aria-hidden="true">
          {legend}
        </ul>
      )}
      {note && <p className="gz5-map-note">{note}</p>}
    </div>
  );
}

/** A legend entry with a small line or swatch drawn in svg. */
export function Key({ children, art }: { children: ReactNode; art: ReactNode }) {
  return (
    <li>
      <svg viewBox="0 0 34 14" width={34} height={14}>
        {art}
      </svg>
      {children}
    </li>
  );
}

/** Smooth path through lon/lat points. */
export const llPath = (project: Proj, pts: LL[]) =>
  smoothPath(pts.map(([lon, lat]) => project(lon, lat) as P2));

/** Arrow head at b, pointing away from a (u = viewBox units per px). */
export function head(a: P2, b: P2, u: number, size = 12) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const L = size * u;
  const W2 = size * 0.46 * u;
  const p = (dx: number, dy: number) =>
    `${(b[0] + dx * Math.cos(ang) - dy * Math.sin(ang)).toFixed(1)} ${(b[1] + dx * Math.sin(ang) + dy * Math.cos(ang)).toFixed(1)}`;
  return `M${p(2 * u, 0)} L${p(-L, W2)} L${p(-L * 0.7, 0)} L${p(-L, -W2)} Z`;
}

/** Haloed label in map units; `size` in CSS px. Lines split on "\n". */
export function MapText({
  x,
  y,
  u,
  text,
  size = 14,
  anchor = "middle",
  className = "",
}: {
  x: number;
  y: number;
  u: number;
  text: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  const lines = text.split("\n");
  return (
    <text
      x={x.toFixed(1)}
      y={y.toFixed(1)}
      textAnchor={anchor}
      className={`gz5-mt ${className}`}
      style={{ fontSize: size * u, strokeWidth: 3.6 * u }}
    >
      {lines.map((l, k) => (
        <tspan key={k} x={x.toFixed(1)} dy={k ? size * 1.08 * u : 0}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

/** The decoded data of a preset view (rivers with names), once loaded. */
export function useGeoData(view: MapView): GeoData | undefined {
  const [d, setD] = useState<GeoData | undefined>(() => peekView(view));
  useEffect(() => {
    if (d) return;
    let live = true;
    loadView(view).then((g) => {
      if (live) setD(g);
    });
    return () => {
      live = false;
    };
  }, [view, d]);
  return d;
}

/** Projected polyline parts of a flat [lon, lat, …] array. */
export function flatPath(project: Proj, flat: ArrayLike<number>) {
  let d = "";
  for (let i = 0; i < flat.length; i += 2) {
    const [x, y] = project(flat[i], flat[i + 1]);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
