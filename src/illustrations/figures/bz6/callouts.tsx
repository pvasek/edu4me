/**
 * Labels for dense anatomy plates: on wide screens italic labels with leader
 * lines; in narrow containers numbered badges at the leader's end and a
 * numbered legend under the plate (text in the plate would be too small).
 */
import type { ReactNode } from "react";
import { Lbl, Num } from "./kit";

export interface Callout {
  /** label text */
  t: string;
  /** label position (wide layout) */
  x: number;
  y: number;
  /** what the label points at */
  tx: number;
  ty: number;
  anchor?: "start" | "middle" | "end";
  /** extra classes for the label (e.g. "bz6-red-t") */
  cls?: string;
  /** badge position in the narrow layout (default: 15 px from the target towards the label) */
  b?: [number, number];
}

export function Callouts({ items, narrow, r = 10 }: { items: Callout[]; narrow: boolean; /** badge radius */ r?: number }) {
  if (!narrow)
    return (
      <g>
        {items.map((c) => (
          <Lbl
            key={c.t}
            x={c.x}
            y={c.y}
            tx={c.tx}
            ty={c.ty}
            anchor={c.anchor}
            className={`bz6-sm ${c.cls ?? ""}`}
          >
            {c.t}
          </Lbl>
        ))}
      </g>
    );
  return (
    <g>
      {items.map((c, i) => {
        let [bx, by] = c.b ?? [0, 0];
        if (!c.b) {
          const dx = c.x - c.tx;
          const dy = c.y - 5 - c.ty;
          const l = Math.hypot(dx, dy) || 1;
          bx = c.tx + (dx / l) * 2 * r;
          by = c.ty + (dy / l) * 2 * r;
        }
        return (
          <g key={c.t}>
            <line className="bz6-lead" x1={bx} y1={by} x2={c.tx} y2={c.ty} />
            <circle className="bz6-dot" cx={c.tx} cy={c.ty} r={2} />
            <Num x={bx} y={by} n={i + 1} r={r} />
          </g>
        );
      })}
    </g>
  );
}

/** The numbered legend shown under the plate in the narrow layout. */
export function Legend({ items }: { items: { t: string; cls?: string }[] }): ReactNode {
  return (
    <ol className="bz6-legend">
      {items.map((c, i) => (
        <li key={c.t}>
          <span className="bz6-legend-n">{i + 1}</span>
          {c.t}
        </li>
      ))}
    </ol>
  );
}
