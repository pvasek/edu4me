/**
 * Drawing kit for the biology figures of levels 4–7 (bz6: extra plates –
 * sponges to the origin of life; see spec/illustration-guide.md and
 * spec/courses/biologie/figures.md). Adapted from the fz4 kit: engraved
 * naturalist plates, hatching instead of gradients, the page's level colour
 * (--level) as the one accent.
 *
 * Three hosts:
 * - <Figure>  one svg plate (role="img"), optional "Přehrát znovu";
 * - <Plates>  a main plate and its insets as separate svgs in a responsive
 *             grid (role="img" on the grid), so insets drop under the main
 *             plate on phones instead of shrinking;
 * - <Figure interactive> + <StepFilm>/<StepStrip>, every step drawn with <Frame>.
 * Children use the motion helpers (Draw, Pop, Fade, Rise) that pick up the
 * "hidden" → "show" variants from their host.
 */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
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
import "./bz6.css";

export { ChemText };

export type Tone =
  | "ink"
  | "acc"
  | "blue"
  | "lvl"
  | "red"
  | "green"
  | "muted"
  | "oxy"
  | "deoxy";
export type Level = 4 | 5 | 6 | 7;

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
  id: "bz6",
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
/** url() of one of the plate's shared patterns / markers. */
export const pat = (id: string, k: string) => `url(#${id}-${k})`;

// ------------------------------------------------------------------ variants
const dly = (c: unknown) => (typeof c === "number" ? c : 0);

export const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (c: unknown) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, delay: dly(c), ease: ease.inOut },
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
    transition: { duration: 0.45, delay: dly(c), ease: ease.out },
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

// ------------------------------------------------------------------ hosts
/** Tracks whether the container is narrow (< `limit` px). */
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
  max?: number;
  level: Level;
  className?: string;
  controls?: ReactNode;
  /** the shared "Přehrát znovu" button (entrance ≤ ~2.5 s) */
  replay?: boolean;
  /** hosts a StepFilm / StepStrip (HTML children, each step a <Frame>) */
  interactive?: boolean;
  compact?: ReturnType<typeof useCompact>;
  /** enlarge text in narrow containers */
  boost?: boolean;
  children: ReactNode;
}) {
  const own = useCompact();
  const { ref: box, narrow } = compact ?? own;
  const svg = useRef<SVGSVGElement>(null);
  const seen = useInView(svg, { once: true, amount: 0.4 });
  const still = !!useReducedMotion();
  const id = "bz6" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [run, setRun] = useState(0);
  const cls = `bz6 bz6-l${level} ${narrow && boost ? "bz6-narrow" : ""} ${narrow ? "bz6-is-narrow" : ""} ${className}`;
  if (interactive)
    return (
      <div ref={box} className={cls}>
        <div className="bz6-host" style={{ maxWidth: max }}>
          <FigCtx.Provider value={{ id, seen: true, still, narrow, run }}>
            {children}
          </FigCtx.Provider>
        </div>
        {controls && <div className="bz6-controls">{controls}</div>}
      </div>
    );
  return (
    <div ref={box} className={cls}>
      <svg
        ref={svg}
        className="bz6-svg"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={label}
        style={{ maxWidth: max, ["--k" as string]: (w / 330).toFixed(3) }}
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
        <div className="bz6-controls">
          {controls}
          {replay && <ReplayButton onClick={() => setRun((r) => r + 1)} />}
        </div>
      )}
    </div>
  );
}

/**
 * A main plate and its insets: every child is a <Frame>; they sit in a grid
 * (`cols` on wide screens, one column under `stackBelow` px) and draw in when
 * the grid scrolls into view. The grid carries role="img" and the description.
 */
export function Plates({
  label,
  level,
  max = 720,
  cols = "1.4fr 1fr",
  stackBelow = 560,
  replay = false,
  note,
  className = "",
  children,
}: {
  label: string;
  level: Level;
  max?: number;
  /** grid-template-columns on wide screens */
  cols?: string;
  /** container width under which the plates stack in one column */
  stackBelow?: number;
  replay?: boolean;
  /** one line under the plates */
  note?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { ref: box, narrow } = useCompact(440);
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInView(grid, { once: true, amount: 0.3 });
  const still = !!useReducedMotion();
  const id = "bz6" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [run, setRun] = useState(0);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((e) => {
      const w = e[0]?.contentRect.width ?? 999;
      setWide(!(w > 0 && w < stackBelow));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [box, stackBelow]);
  return (
    <div
      ref={box}
      className={`bz6 bz6-l${level} ${narrow ? "bz6-narrow bz6-is-narrow" : ""} ${className}`}
    >
      <div
        ref={grid}
        className="bz6-plates"
        role="img"
        aria-label={label}
        style={
          {
            maxWidth: max,
            gridTemplateColumns: wide ? cols : "minmax(0, 1fr)",
          } as CSSProperties
        }
      >
        <FigCtx.Provider value={{ id, seen, still, narrow, run }}>
          {children}
        </FigCtx.Provider>
      </div>
      {note && <p className="bz6-strip-note">{note}</p>}
      {replay && (
        <div className="bz6-controls">
          <ReplayButton onClick={() => setRun((r) => r + 1)} />
        </div>
      )}
    </div>
  );
}

/**
 * One engraved svg plate inside <Plates>, a StepFilm or a StepStrip. Inside
 * <Plates> it draws in when the grid is seen; in films and strips (host
 * `seen` is always true) it draws in as soon as it is mounted.
 * `title` adds a small heading above the plate (insets).
 */
export function Frame({
  w,
  h,
  className = "",
  title,
  area,
  row,
  children,
}: {
  w: number;
  h: number;
  className?: string;
  title?: ReactNode;
  /** grid column, e.g. "1 / -1" */
  area?: string;
  /** grid row, e.g. "span 2" (only while the plates sit side by side) */
  row?: string;
  children: ReactNode;
}) {
  const host = useFig();
  const id = "bz6" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const vis = useInView(ref, { amount: 0.2 });
  const svg = (
    <svg
      ref={ref}
      className={`bz6-svg ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      focusable="false"
      style={{ ["--k" as string]: (w / 330).toFixed(3) }}
    >
      <Defs id={id} />
      <FigCtx.Provider value={{ ...host, id, seen: host.seen && vis }}>
        <motion.g
          key={host.run}
          initial="hidden"
          animate={host.seen ? "show" : "hidden"}
        >
          {children}
        </motion.g>
      </FigCtx.Provider>
    </svg>
  );
  if (!title && !area && !row) return svg;
  return (
    <div
      className="bz6-plate"
      style={{ gridColumn: area, gridRow: row && !host.narrow ? row : undefined }}
    >
      {title && <div className="bz6-plate-t">{title}</div>}
      {svg}
    </div>
  );
}

/** A StepStrip host: role="img" wrapper + an optional note line. */
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
    <div className="bz6-stripbox" role="img" aria-label={label}>
      {children}
      {note && <p className="bz6-strip-note">{note}</p>}
    </div>
  );
}

const TONES: Tone[] = [
  "ink",
  "acc",
  "blue",
  "lvl",
  "red",
  "green",
  "muted",
  "oxy",
  "deoxy",
];

function Defs({ id }: { id: string }) {
  const hl = (
    k: string,
    gap: number,
    rot: number,
    cls = "bz6-hl",
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
      {hl("dd", 2.6, 45, "bz6-hl bz6-hl-dark")}
      {hl("b", 4.5, -45)}
      {hl("x", 4.5, 45, "bz6-hl", true)}
      {hl("xd", 3, 45, "bz6-hl bz6-hl-dark", true)}
      {hl("v", 4, 0)}
      {hl("hi", 2.4, 45, "bz6-hl-light")}
      <pattern
        id={`${id}-h`}
        width={10}
        height={4.2}
        patternUnits="userSpaceOnUse"
      >
        <line className="bz6-hl" x1={0} y1={2.1} x2={10} y2={2.1} />
      </pattern>
      <pattern
        id={`${id}-dots`}
        width={6}
        height={6}
        patternUnits="userSpaceOnUse"
      >
        <circle className="bz6-stip" cx={1.5} cy={1.5} r={0.7} />
        <circle className="bz6-stip" cx={4.5} cy={4.5} r={0.7} />
      </pattern>
      <pattern
        id={`${id}-soil`}
        width={14}
        height={12}
        patternUnits="userSpaceOnUse"
      >
        <circle className="bz6-stip" cx={2} cy={3} r={0.9} />
        <circle className="bz6-stip" cx={9} cy={2} r={0.6} />
        <circle className="bz6-stip" cx={6} cy={8} r={1.1} />
        <circle className="bz6-stip" cx={12} cy={10} r={0.7} />
      </pattern>
      <pattern
        id={`${id}-spongy`}
        width={9}
        height={9}
        patternUnits="userSpaceOnUse"
      >
        <circle
          className="bz6-hl bz6-hl-dark"
          cx={4.5}
          cy={4.5}
          r={2.6}
          fill="none"
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
            className={`bz6-mk bz6-mk-${t}`}
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
  className = "bz6-o",
  delay = 0,
  arrow,
  start,
  style,
  fill,
}: {
  d: string;
  className?: string;
  delay?: number;
  arrow?: Tone;
  start?: boolean;
  style?: CSSProperties;
  fill?: string;
}) {
  const { id } = useFig();
  return (
    <motion.path
      d={d}
      className={className}
      variants={drawV}
      custom={delay}
      fill={fill}
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
 * Something that travels along a path forever (SMIL animateMotion, in user
 * units). `phase` 0–1 staggers several travellers; at rest it sits at `rest`.
 */
export function Travel({
  path,
  dur,
  phase = 0,
  rest,
  fade = false,
  once = false,
  children,
}: {
  path: string;
  dur: number;
  phase?: number;
  rest: [number, number];
  fade?: boolean;
  /** run once and stay at the end of the path */
  once?: boolean;
  children: ReactNode;
}) {
  const live = useLive();
  const { run } = useFig();
  if (!live)
    return <g transform={`translate(${rest[0]} ${rest[1]})`}>{children}</g>;
  const begin = once ? `${phase.toFixed(2)}s` : `${(-phase * dur).toFixed(2)}s`;
  return (
    <g key={run}>
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={begin}
        repeatCount={once ? "1" : "indefinite"}
        fill={once ? "freeze" : "remove"}
      />
      {fade && !once && (
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
      className={`bz6-arr bz6-arr-${tone} ${dashed ? "bz6-dash" : ""} ${className}`}
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
      className={`bz6-arr bz6-arr-${tone} ${className}`}
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
  if (tx !== undefined && ty !== undefined) {
    const size = className.includes("bz6-big")
      ? 19
      : className.includes("bz6-sm")
        ? 14.5
        : 16.5;
    const tw =
      flat(children).length *
      size *
      (className.includes("bz6-b") ? 0.46 : 0.43);
    const left =
      anchor === "start" ? x : anchor === "end" ? x - tw : x - tw / 2;
    const right = left + tw;
    let sx: number;
    let sy = y - size * 0.3;
    if (tx > right) sx = right + 4;
    else if (tx < left) sx = left - 4;
    else {
      sx = Math.min(Math.max(tx, left), right);
      sy = ty < y ? y - size * 0.95 : y + 5;
    }
    sx = lx ?? sx;
    sy = ly ?? sy;
    lead = (
      <>
        <line className="bz6-lead" x1={sx} y1={sy} x2={tx} y2={ty} />
        <circle className="bz6-dot" cx={tx} cy={ty} r={2} />
      </>
    );
  }
  return (
    <g className={`${sec ? "bz6-sec" : ""}`}>
      {lead}
      <text className={`bz6-lbl ${className}`} x={x} y={y} textAnchor={anchor}>
        {children}
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

/** A formula (ChemText markup: O_{2}, CO_{2}). */
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
    <text className={`bz6-eq ${className}`} x={x} y={y} textAnchor={anchor}>
      <ChemText text={t} />
    </text>
  );
}

/** Numbered badge in the level colour. */
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
    <g className="bz6-num-badge">
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

/** A light boxed note (the level tint when `lvl`). */
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
  children?: ReactNode;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className={lvl ? "bz6-tag-lvl" : "bz6-tag"}
      />
      {children}
    </g>
  );
}

/** A filled arrow head at (x, y) pointing along `deg` (0 = right, 90 = down). */
export function Head({
  x,
  y,
  deg,
  tone = "ink",
  s = 1,
}: {
  x: number;
  y: number;
  deg: number;
  tone?: Tone;
  s?: number;
}) {
  return (
    <path
      d="M-5 -4.2 L5 0 L-5 4.2 L-2.6 0Z"
      className={`bz6-mk bz6-mk-${tone}`}
      transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(deg)}) scale(${s})`}
    />
  );
}

/** Rising bubbles (CSS loop) from (x, y) up by `rise`. */
export function Bubbles({
  x,
  y,
  rise = 40,
  n = 4,
  spread = 10,
  r = 2.6,
}: {
  x: number;
  y: number;
  rise?: number;
  n?: number;
  spread?: number;
  r?: number;
}) {
  const live = useLive();
  return (
    <g className={`bz6-bubbles ${live ? "" : "bz6-still"}`}>
      {Array.from({ length: n }, (_, i) => {
        const bx = x + (((i * 37) % 11) / 10) * spread - spread / 2;
        const by = y - (i / n) * rise * 0.8;
        return (
          <circle
            key={i}
            cx={bx}
            cy={by}
            r={r * (0.75 + ((i * 5) % 4) / 8)}
            className="bz6-bubble"
            style={{
              ["--rise" as string]: `${-rise * (1 - i / n)}px`,
              animationDelay: `${(-i * 0.47).toFixed(2)}s`,
            }}
          />
        );
      })}
    </g>
  );
}

/** Deterministic pseudo-random numbers. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Time in seconds (0 → `dur`) of a one-shot animation that starts when the
 * plate is seen and restarts on "Přehrát znovu". Reduced motion: the end.
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

// ------------------------------------------------------------------ numbers & shapes
export type P2 = [number, number];
export const f1 = (n: number) => n.toFixed(1);
/** Czech number formatting: decimal comma, thin space for thousands. */
export const cz = (n: number, digits = 0) => {
  const [i, d] = n.toFixed(digits).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return d ? `${int},${d}` : int;
};

/** Smooth closed path through points (Catmull-Rom → cubic Bézier). */
export function blob(pts: P2[], closed = true, k = 1) {
  const n = pts.length;
  const at = (i: number) =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: P2 = [
      p1[0] + ((p2[0] - p0[0]) / 6) * k,
      p1[1] + ((p2[1] - p0[1]) / 6) * k,
    ];
    const c2: P2 = [
      p2[0] - ((p3[0] - p1[0]) / 6) * k,
      p2[1] - ((p3[1] - p1[1]) / 6) * k,
    ];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** A shape filled with a tint and overlaid with a hatch pattern. */
export function Shade({
  d,
  fill,
  hatch = "d",
  op = 1,
  className = "bz6-o",
  hatchOp = 1,
}: {
  d: string;
  /** css class of the tint fill (e.g. "bz6-flesh") */
  fill?: string;
  hatch?: string | null;
  op?: number;
  className?: string;
  hatchOp?: number;
}) {
  const { id } = useFig();
  return (
    <g opacity={op}>
      <path d={d} className={fill ?? "bz6-fill"} />
      {hatch && (
        <path
          d={d}
          fill={pat(id, hatch)}
          opacity={hatchOp}
          className="bz6-nohit"
        />
      )}
      <path d={d} className={className} fill="none" />
    </g>
  );
}

/** A dashed axis / boundary line that fades in (pathLength would erase the dashes). */
export function Dashed({
  d,
  delay = 0,
  className = "bz6-axis-l",
}: {
  d: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.path d={d} className={className} variants={fadeV} custom={delay} />
  );
}
