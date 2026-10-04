/**
 * Drawing kit for the geography figures of levels 1–2 (gz1, see spec/illustration-guide.md
 * and spec/courses/zemepis/figures.md; adapted from the biology bz8 kit): engraved
 * atlas plates, fine outlines, hatching, the level colour (--level) as the one accent.
 * One <Figure> per plate: it owns the viewBox, role/aria-label, the hatch
 * patterns and arrow heads, and starts the draw-in when the plate scrolls
 * into view. Children use the small motion helpers below (Draw, Pop, Fade)
 * which pick up the "hidden" → "show" variants from the Figure.
 */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ease, spring } from "../../../ui/motion";
import { ChemText } from "../../../diagrams/util";
import { ReplayButton } from "../../sequence/StepFigure";
import { loadView, peekView, type GeoData } from "../../../geo/load";
import "./gz1.css";

export { ChemText };
export type Tone = "ink" | "acc" | "blue" | "lvl" | "red" | "green" | "muted";

interface FigState {
  id: string;
  /** the plate has scrolled into view (ambient loops may start) */
  seen: boolean;
  /** reduced motion requested */
  still: boolean;
  /** container narrower than 440 px */
  narrow: boolean;
  /** increments on "Přehrát znovu" */
  run: number;
}
const FigCtx = createContext<FigState>({
  id: "gz1",
  seen: false,
  still: true,
  narrow: false,
  run: 0,
});
export const useFig = () => useContext(FigCtx);
/** Ambient loops run only when in view and motion is allowed. */
export const useLive = () => {
  const f = useFig();
  return f.seen && !f.still;
};
/** url() of one of the Figure's shared patterns / markers. */
export const pat = (id: string, k: string) => `url(#${id}-${k})`;

// ------------------------------------------------------------------ variants
const dly = (c: unknown) => (typeof c === "number" ? c : 0);

export const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (c: unknown) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, delay: dly(c), ease: ease.inOut },
      opacity: { duration: 0.05, delay: dly(c) },
    },
  }),
};
export const popV: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: (c: unknown) => ({
    opacity: 1,
    scale: 1,
    transition: { ...spring.bouncy, delay: dly(c) },
  }),
};
export const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (c: unknown) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: dly(c), ease: ease.out },
  }),
};
export const riseV: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (c: unknown) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: dly(c), ease: ease.out },
  }),
};

const origin = { transformBox: "fill-box", transformOrigin: "center" } as const;

// ------------------------------------------------------------------ figure
/**
 * Tracks whether the plate's container is narrow (< `limit` px), so a figure
 * can switch to its compact layout. Pass the result to <Figure compact={…}>.
 */
export function useCompact(limit = 440) {
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 999;
      setNarrow(w > 0 && w < limit);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [limit]);
  return { ref, narrow };
}

export function Figure({
  label,
  w = 0,
  h = 0,
  x0 = 0,
  max = 640,
  level,
  className = "",
  controls,
  replay = false,
  interactive = false,
  compact,
  boost = true,
  children,
}: {
  label: string;
  /** viewBox size (not needed with `interactive`) */
  w?: number;
  h?: number;
  /** viewBox min-x (lets a compact layout crop the side margins) */
  x0?: number;
  max?: number;
  level: 1 | 2;
  className?: string;
  /** HTML controls under the plate (toggles) */
  controls?: ReactNode;
  /** show the shared "Přehrát znovu" button that re-runs the entrance (keep it ≤ ~2.5 s) */
  replay?: boolean;
  /**
   * hosts a <StepFilm> / <StepStrip> (children are HTML, each step drawn with <Frame>):
   * the wrapper is then not a role="img" (the film carries role="img" + label itself)
   */
  interactive?: boolean;
  /** from useCompact(): the container ref and its narrow flag */
  compact?: ReturnType<typeof useCompact>;
  /** enlarge text in narrow containers (off for figures with their own compact layout) */
  boost?: boolean;
  children: ReactNode;
}) {
  const own = useCompact();
  const { ref: box, narrow } = compact ?? own;
  const svg = useRef<SVGSVGElement>(null);
  const seen = useInView(svg, { once: true, amount: 0.4 });
  const still = !!useReducedMotion();
  const id = "gz1" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [run, setRun] = useState(0);
  const cls = `gz1 gz1-l${level} ${narrow ? (boost ? "gz1-narrow" : "gz1-compact") : ""} ${className}`;
  if (interactive)
    return (
      <div ref={box} className={cls}>
        <div className="gz1-host" style={{ maxWidth: max }}>
          <FigCtx.Provider value={{ id, seen: true, still, narrow, run }}>
            {children}
          </FigCtx.Provider>
        </div>
        {controls && <div className="gz1-controls">{controls}</div>}
      </div>
    );
  return (
    <div ref={box} className={cls}>
      <svg
        ref={svg}
        className="gz1-svg"
        viewBox={`${x0} 0 ${w} ${h}`}
        role="img"
        aria-label={label}
        style={{ maxWidth: max }}
      >
        <Defs id={id} />
        <FigCtx.Provider value={{ id, seen, still, narrow, run }}>
          <motion.g
            key={run}
            initial="hidden"
            animate={seen ? "show" : "hidden"}
          >
            {children}
          </motion.g>
        </FigCtx.Provider>
      </svg>
      {(controls || replay) && (
        <div className="gz1-controls">
          {controls}
          {replay && <ReplayButton onClick={() => setRun((r) => r + 1)} />}
        </div>
      )}
    </div>
  );
}

/**
 * One frame of a <StepFilm> (or one panel of a <StepStrip>) inside an `interactive`
 * Figure: an engraved svg plate with its own patterns that draws itself in as soon as
 * it is mounted (a film mounts each frame when it is shown). Keep a frame's entrance
 * ≤ ~1.2 s. Frames of one film share the same viewBox.
 */
export function Frame({
  w,
  h,
  x0 = 0,
  className = "",
  children,
}: {
  w: number;
  h: number;
  x0?: number;
  className?: string;
  children: ReactNode;
}) {
  const host = useFig();
  const id = "gz1" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<SVGSVGElement>(null);
  // ambient loops (useLive) run only while the frame is on screen
  const seen = useInView(ref, { amount: 0.2 });
  return (
    <svg
      ref={ref}
      className={`gz1-svg ${className}`}
      viewBox={`${x0} 0 ${w} ${h}`}
      aria-hidden="true"
      focusable="false"
    >
      <Defs id={id} />
      <FigCtx.Provider value={{ ...host, id, seen }}>
        <motion.g initial="hidden" animate="show">
          {children}
        </motion.g>
      </FigCtx.Provider>
    </svg>
  );
}

/** Segmented toggle (HTML, under the plate). */
export function Toggle<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; text: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="gz1-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className="gz1-btn"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.text}
        </button>
      ))}
    </div>
  );
}

const TONES: Tone[] = ["ink", "acc", "blue", "lvl", "red", "green", "muted"];

function Defs({ id }: { id: string }) {
  const hl = (
    k: string,
    gap: number,
    rot: number,
    cls = "gz1-hl",
    both = false,
  ) => (
    <pattern
      key={k}
      id={`${id}-${k}`}
      width={gap}
      height={gap}
      patternUnits="userSpaceOnUse"
      patternTransform={`rotate(${rot})`}
    >
      <line className={cls} x1={0} y1={0} x2={0} y2={gap} />
      {both && <line className={cls} x1={0} y1={0} x2={gap} y2={0} />}
    </pattern>
  );
  return (
    <defs>
      {hl("d", 4.5, 45)}
      {hl("dd", 2.6, 45, "gz1-hl gz1-hl-dark")}
      {hl("b", 4.5, -45)}
      {hl("x", 4.5, 45, "gz1-hl", true)}
      {hl("xd", 3, 45, "gz1-hl gz1-hl-dark", true)}
      {hl("v", 4, 0)}
      {hl("hi", 2.4, 45, "gz1-hl-light")}
      {hl("sh", 2.2, -45, "gz1-hl-shade")}
      <pattern
        id={`${id}-h`}
        width={10}
        height={4.2}
        patternUnits="userSpaceOnUse"
      >
        <line className="gz1-hl" x1={0} y1={2.1} x2={10} y2={2.1} />
      </pattern>
      <pattern
        id={`${id}-dots`}
        width={6}
        height={6}
        patternUnits="userSpaceOnUse"
      >
        <circle className="gz1-stip" cx={1.5} cy={1.5} r={0.7} />
        <circle className="gz1-stip" cx={4.5} cy={4.5} r={0.7} />
      </pattern>
      <pattern
        id={`${id}-brick`}
        width={16}
        height={9}
        patternUnits="userSpaceOnUse"
      >
        <path
          className="gz1-hl gz1-hl-dark"
          d="M0 0.5 H16 M0 5 H16 M4 0.5 V5 M12 5 V9"
        />
      </pattern>
      {TONES.map((t) => (
        <marker
          key={t}
          id={`${id}-ah-${t}`}
          viewBox="0 0 10 10"
          refX={8.5}
          refY={5}
          markerWidth={9}
          markerHeight={9}
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path
            className={`gz1-mk gz1-mk-${t}`}
            d="M0 0.8 L10 5 L0 9.2 L2.4 5 Z"
          />
        </marker>
      ))}
    </defs>
  );
}

// ------------------------------------------------------------------ motion bits
/** A stroke that draws itself in. */
export function Draw({
  d,
  className = "gz1-o",
  delay = 0,
  arrow,
  start,
  style,
}: {
  d: string;
  className?: string;
  delay?: number;
  arrow?: Tone;
  start?: boolean;
  style?: React.CSSProperties;
}) {
  const { id } = useFig();
  return (
    <motion.path
      d={d}
      className={className}
      variants={drawV}
      custom={delay}
      markerEnd={arrow ? pat(id, `ah-${arrow}`) : undefined}
      markerStart={arrow && start ? pat(id, `ah-${arrow}`) : undefined}
      style={style}
    />
  );
}

export function Pop({
  delay = 0,
  children,
  className,
}: {
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.g
      variants={popV}
      custom={delay}
      style={origin}
      className={className}
    >
      {children}
    </motion.g>
  );
}
export function Fade({
  delay = 0,
  children,
  className,
}: {
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.g variants={fadeV} custom={delay} className={className}>
      {children}
    </motion.g>
  );
}
export function Rise({
  delay = 0,
  children,
  className,
}: {
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.g variants={riseV} custom={delay} className={className}>
      {children}
    </motion.g>
  );
}

/**
 * Something that travels along a path forever (SMIL animateMotion, which
 * runs in SVG user units). `phase` 0–1 staggers several travellers; at rest
 * (reduced motion, not yet seen) it sits at `rest`.
 */
export function Travel({
  path,
  dur,
  phase = 0,
  rest,
  rotate,
  fade = false,
  children,
}: {
  path: string;
  dur: number;
  phase?: number;
  rest: [number, number];
  rotate?: boolean;
  /** fade in at the start and out at the end of each lap */
  fade?: boolean;
  children: ReactNode;
}) {
  const live = useLive();
  if (!live)
    return <g transform={`translate(${rest[0]} ${rest[1]})`}>{children}</g>;
  const begin = `${(-phase * dur).toFixed(2)}s`;
  return (
    <g>
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={begin}
        repeatCount="indefinite"
        rotate={rotate ? "auto" : undefined}
      />
      {fade && (
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.12;0.85;1"
          dur={`${dur}s`}
          begin={begin}
          repeatCount="indefinite"
        />
      )}
      {children}
    </g>
  );
}

// ------------------------------------------------------------------ drawing bits
/** Straight or curved arrow (path + marker head). */
export function Arrow({
  d,
  tone = "ink",
  className = "",
  both = false,
  dashed = false,
}: {
  d: string;
  tone?: Tone;
  className?: string;
  both?: boolean;
  dashed?: boolean;
}) {
  const { id } = useFig();
  return (
    <path
      d={d}
      className={`gz1-arr gz1-arr-${tone} ${dashed ? "gz1-dash" : ""} ${className}`}
      markerEnd={pat(id, `ah-${tone}`)}
      markerStart={both ? pat(id, `ah-${tone}`) : undefined}
    />
  );
}

/** An arrow that draws itself in. */
export function DrawArrow({
  d,
  tone = "ink",
  delay = 0,
  className = "",
  both = false,
}: {
  d: string;
  tone?: Tone;
  delay?: number;
  className?: string;
  both?: boolean;
}) {
  return (
    <Draw
      d={d}
      className={`gz1-arr gz1-arr-${tone} ${className}`}
      delay={delay}
      arrow={tone}
      start={both}
    />
  );
}

/**
 * Italic plate label with a thin leader line to (tx, ty).
 * `sec` marks secondary labels that disappear in narrow containers.
 */
export function Lbl({
  x,
  y,
  tx,
  ty,
  lx,
  ly,
  anchor = "start",
  sec = false,
  className = "",
  children,
}: {
  x: number;
  y: number;
  tx?: number;
  ty?: number;
  lx?: number;
  ly?: number;
  anchor?: "start" | "middle" | "end";
  sec?: boolean;
  className?: string;
  children: ReactNode;
}) {
  let lead: ReactNode = null;
  // a plain string with "\n" becomes several lines (tspans)
  const lines =
    typeof children === "string" ? children.split("\n") : [flat(children)];
  const multi = typeof children === "string" && lines.length > 1;
  if (tx !== undefined && ty !== undefined) {
    // estimate the text run so the leader leaves from the side facing the target
    const size = className.includes("gz1-big")
      ? 19
      : className.includes("gz1-sm")
        ? 14.5
        : 16.5;
    const tw =
      Math.max(...lines.map((l) => l.length)) *
      size *
      (className.includes("gz1-b") ? 0.46 : 0.43);
    const left =
      anchor === "start" ? x : anchor === "end" ? x - tw : x - tw / 2;
    const right = left + tw;
    let sx: number;
    let sy = y - size * 0.3;
    if (tx > right) sx = right + 4;
    else if (tx < left) sx = left - 4;
    else {
      sx = Math.min(Math.max(tx, left), right);
      sy = ty < y ? y - size * 0.95 : y + 5 + (lines.length - 1) * size * 1.08;
    }
    sx = lx ?? sx;
    sy = ly ?? sy;
    lead = (
      <>
        <line className="gz1-lead" x1={sx} y1={sy} x2={tx} y2={ty} />
        <circle className="gz1-dot" cx={tx} cy={ty} r={2} />
      </>
    );
  }
  return (
    <g className={`${sec ? "gz1-sec" : ""}`}>
      {lead}
      <text className={`gz1-lbl ${className}`} x={x} y={y} textAnchor={anchor}>
        {multi
          ? lines.map((l, i) => (
              <tspan key={i} x={x} dy={i ? "1.08em" : 0}>
                {l}
              </tspan>
            ))
          : children}
      </text>
    </g>
  );
}

function flat(n: ReactNode): string {
  if (n === null || n === undefined || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(flat).join("");
  if (typeof n === "object" && "props" in n) {
    const p = (n as { props: { children?: ReactNode; text?: string } }).props;
    return p.text
      ? p.text.replace(/[\^_]\{([^}]*)\}/g, "$1")
      : flat(p.children);
  }
  return "";
}

/** A formula (ChemText markup: ^{2+}, _{2}). */
export function Eq({
  x,
  y,
  t,
  anchor = "start",
  className = "",
}: {
  x: number;
  y: number;
  t: string;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text className={`gz1-eq ${className}`} x={x} y={y} textAnchor={anchor}>
      <ChemText text={t} />
    </text>
  );
}

/** Liquid body: tinted fill + horizontal engraving hatch. */
export function Liquid({
  d,
  color,
  opacity = 0.45,
  className = "",
}: {
  d: string;
  color: string;
  opacity?: number;
  className?: string;
}) {
  const { id } = useFig();
  return (
    <g className={className}>
      <path d={d} fill={color} fillOpacity={opacity} />
      <path d={d} fill={pat(id, "h")} className="gz1-nohit" />
    </g>
  );
}

/** Deterministic pseudo-random numbers for scattering particles. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Point on a quadratic Bézier. */
export function qpt(
  p0: [number, number],
  c: [number, number],
  p1: [number, number],
  t: number,
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
  ];
}

// ------------------------------------------------------------------ plate bits

/** Numbered badge (for anatomy plates with a legend). */
export function Num({
  x,
  y,
  n,
  r = 10,
}: {
  x: number;
  y: number;
  n: number | string;
  r?: number;
}) {
  return (
    <g className="gz1-num-badge">
      <circle cx={x} cy={y} r={r} />
      <text
        x={x}
        y={y + r * 0.4}
        textAnchor="middle"
        style={{ fontSize: r * 1.15 }}
      >
        {n}
      </text>
    </g>
  );
}

/**
 * Time in seconds (0 → `dur`) of a one-shot animation that starts when the plate
 * is seen and restarts on "Přehrát znovu". Reduced motion shows the end at once.
 */
export function useClock(dur: number) {
  const { seen, still, run } = useFig();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (still || typeof requestAnimationFrame === "undefined") {
      setT(dur);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = Math.min(dur, (now - t0) / 1000);
      setT(s);
      if (s < dur) raf = requestAnimationFrame(tick);
    };
    setT(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, still, run, dur]);
  return t;
}

// ------------------------------------------------------------------ numbers
export type P2 = [number, number];
export const f1 = (n: number) => n.toFixed(1);
/** Czech number formatting: decimal comma, thin space for thousands. */
export const cz = (n: number, digits = 0) => {
  const [i, d] = n.toFixed(digits).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return d ? `${int},${d}` : int;
};

/**
 * Italic symbol (ChemText markup: S, V, a^{2}).
 * Variables are italic by convention; units belong in <Eq> (upright).
 */
export function Sym({
  x,
  y,
  t,
  anchor = "middle",
  tone = "ink",
  className = "",
}: {
  x: number;
  y: number;
  t: string;
  anchor?: "start" | "middle" | "end";
  tone?: Tone;
  className?: string;
}) {
  return (
    <text
      className={`gz1-sym-t gz1-tone-${tone} ${className}`}
      x={x}
      y={y}
      textAnchor={anchor}
    >
      <ChemText text={t} />
    </text>
  );
}


/** A light boxed formula / note (the level tint when `lvl`). */
export function Note({
  x,
  y,
  w,
  h = 30,
  lvl = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  lvl?: boolean;
  children: ReactNode;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className={lvl ? "gz1-tag-lvl" : "gz1-tag"}
      />
      {children}
    </g>
  );
}

/**
 * A quantity "symbol = value": the symbol (ChemText markup, e.g. Q_{1}) italic,
 * the value and unit upright.
 */
export function Qty({
  x,
  y,
  s,
  v,
  anchor = "start",
  className = "",
}: {
  x: number;
  y: number;
  s: string;
  v?: string;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text className={`gz1-eq ${className}`} x={x} y={y} textAnchor={anchor}>
      <tspan className="gz1-it gz1-qs">
        {/* the zero-width tail resets the baseline after a trailing index */}
        <ChemText text={s + "​"} />
      </tspan>
      {v !== undefined && <ChemText text={` = ${v}`} />}
    </text>
  );
}

// ------------------------------------------------------------------ plate bodies
/**
 * An engraved body: tinted fill (`fill` = a gz1 fill class), an optional hatch
 * overlay (pattern key from <Defs>: d, dd, b, x, xd, v, h, dots) and the outline.
 */
export function Body({
  d,
  fill,
  hatch,
  hatchOpacity = 1,
  thin = false,
  className = "",
  style,
}: {
  d: string;
  fill?: string;
  hatch?: string;
  hatchOpacity?: number;
  thin?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { id } = useFig();
  return (
    <g className={className} style={style}>
      {fill && <path d={d} className={fill} />}
      {hatch && (
        <path
          d={d}
          fill={pat(id, hatch)}
          opacity={hatchOpacity}
          className="gz1-nohit"
        />
      )}
      <path d={d} className={`gz1-o ${thin ? "gz1-thin" : ""}`} />
    </g>
  );
}

/** Ellipse as a path (for Body). */
export const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f1(cx - rx)} ${f1(cy)} A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(cx + rx)} ${f1(cy)} A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(cx - rx)} ${f1(cy)}Z`;

export function ScaleBar({
  x,
  y,
  len,
  text,
  anchor = "middle",
}: {
  x: number;
  y: number;
  len: number;
  text: string;
  anchor?: "start" | "middle";
}) {
  return (
    <g>
      <path
        d={`M${x} ${y} h${len} M${x} ${y - 4} v8 M${x + len} ${y - 4} v8`}
        className="gz1-scale"
        style={{ strokeWidth: 1.4 }}
      />
      <path d={`M${x} ${y} h${len}`} className="gz1-scale" />
      <text
        x={anchor === "middle" ? x + len / 2 : x + len + 6}
        y={anchor === "middle" ? y + 17 : y + 4.5}
        textAnchor={anchor}
        className="gz1-scale-t"
      >
        {text}
      </text>
    </g>
  );
}

/** Small "+", "−" or "0" badge (effect on a partner in a relationship). */

// ------------------------------------------------------------------ strips
/**
 * The role="img" wrapper around a <StepStrip> (the strip itself is plain HTML):
 * it carries the description and an optional note under the panels.
 */
export function StripBox({
  label,
  note,
  children,
}: {
  label: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="gz1-stripbox" role="img" aria-label={label}>
      {children}
      {note && <p className="gz1-strip-note">{note}</p>}
    </div>
  );
}

// ------------------------------------------------------------------ globe
const RAD = Math.PI / 180;
export type Proj = (lat: number, lon: number) => { x: number; y: number; v: boolean };

/**
 * Orthographic projection of a globe of radius `r` centred at (cx, cy), seen
 * above (lat0, lon0); `rot` turns the picture clockwise in the plane (e.g. the
 * axis tilt). `v` = the point is on the visible hemisphere.
 */
export function ortho(
  cx: number,
  cy: number,
  r: number,
  lat0 = 0,
  lon0 = 0,
  rot = 0,
): Proj {
  const s0 = Math.sin(lat0 * RAD);
  const c0 = Math.cos(lat0 * RAD);
  const sr = Math.sin(rot * RAD);
  const cr = Math.cos(rot * RAD);
  return (lat, lon) => {
    const p = lat * RAD;
    const dl = (lon - lon0) * RAD;
    const x = r * Math.cos(p) * Math.sin(dl);
    const y = r * (c0 * Math.sin(p) - s0 * Math.cos(p) * Math.cos(dl));
    const v = s0 * Math.sin(p) + c0 * Math.cos(p) * Math.cos(dl) >= -1e-9;
    // screen: y up → down, then the in-plane rotation (clockwise)
    return { x: cx + x * cr + y * sr, y: cy - y * cr + x * sr, v };
  };
}

/** A path through (lat, lon) points, keeping only the visible (or, with `back`, the hidden) parts. */
export function geoPath(pts: [number, number][], P: Proj, back = false) {
  let d = "";
  let pen = false;
  for (const [la, lo] of pts) {
    const q = P(la, lo);
    const on = back ? !q.v : q.v;
    if (on) {
      d += `${pen ? "L" : "M"}${f1(q.x)} ${f1(q.y)}`;
      pen = true;
    } else pen = false;
  }
  return d;
}
/** Points of a meridian (lon) from pole to pole. */
export const meridian = (lon: number, a = -90, b = 90, n = 72) =>
  Array.from({ length: n + 1 }, (_, i) => [a + ((b - a) * i) / n, lon] as [number, number]);
/** Points of a parallel (lat) around the globe. */
export const parallel = (lat: number, a = -180, b = 180, n = 120) =>
  Array.from({ length: n + 1 }, (_, i) => [lat, a + ((b - a) * i) / n] as [number, number]);

/** Globe disc: sea fill, a little engraved shading on the far-left limb, outline. */
export function Globe({
  cx,
  cy,
  r,
  fill = "gz1-sea",
  shade = true,
}: {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  shade?: boolean;
}) {
  const { id } = useFig();
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className={fill} />
      {shade && (
        <path
          d={`M${f1(cx - r * 0.2)} ${f1(cy - r * 0.98)} A${r} ${r} 0 0 0 ${f1(cx - r * 0.2)} ${f1(cy + r * 0.98)} A${f1(r * 0.9)} ${r} 0 0 1 ${f1(cx - r * 0.2)} ${f1(cy - r * 0.98)}Z`}
          fill={pat(id, "sh")}
          className="gz1-nohit"
        />
      )}
      <circle cx={cx} cy={cy} r={r} className="gz1-o" />
    </g>
  );
}

/** The Sun: a disc with short rays. */
export function Sun({ x, y, r = 18, rays = true }: { x: number; y: number; r?: number; rays?: boolean }) {
  return (
    <g>
      {rays &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <path
              key={i}
              d={`M${f1(x + Math.cos(a) * (r + 4))} ${f1(y + Math.sin(a) * (r + 4))} L${f1(x + Math.cos(a) * (r + 11))} ${f1(y + Math.sin(a) * (r + 11))}`}
              className="gz1-sunray"
            />
          );
        })}
      <circle cx={x} cy={y} r={r} className="gz1-sun gz1-o gz1-thin" />
    </g>
  );
}

/** Small italic text centred on x (a plate caption line). */
export function Txt({
  x,
  y,
  anchor = "middle",
  className = "",
  children,
}: {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={`gz1-lbl ${className}`}>
      {children}
    </text>
  );
}

// ------------------------------------------------------------------ real map data
/** Natural Earth world data from src/geo (loaded lazily, once); undefined until it arrives. */
export function useWorld() {
  const [data, setData] = useState<GeoData | undefined>(() => peekView("world"));
  useEffect(() => {
    if (data) return;
    let live = true;
    loadView("world")
      .then((d) => live && setData(d))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [data]);
  return data;
}

/**
 * Land of the world data on an orthographic globe (see `ortho`): every country ring projected,
 * points on the far side pushed to the limb so the fill stays inside the disc.
 */
export function globeLand(data: GeoData, P: Proj, cx: number, cy: number, r: number, skip: string[] = ["ATA"]) {
  let d = "";
  for (const [code, sh] of data.countries) {
    if (skip.includes(code)) continue;
    for (const ring of sh.rings) {
      let part = "";
      let any = false;
      for (let i = 0; i < ring.length; i += 2) {
        const q = P(ring[i + 1], ring[i]);
        let x = q.x;
        let y = q.y;
        if (!q.v) {
          const dx = x - cx;
          const dy = y - cy;
          const n = Math.hypot(dx, dy) || 1;
          x = cx + (dx / n) * r;
          y = cy + (dy / n) * r;
        } else any = true;
        part += `${i ? "L" : "M"}${f1(x)} ${f1(y)}`;
      }
      if (any) d += part + "Z";
    }
  }
  return d;
}
