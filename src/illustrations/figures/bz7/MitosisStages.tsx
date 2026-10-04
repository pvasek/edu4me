import { motion } from "motion/react";
import type { ReactNode } from "react";
import { StepFilm } from "../../sequence/StepFigure";
import { Draw, Fade, Figure, Frame, Lbl, Pop, f1 } from "./kit";

const LABEL =
  "Mitóza jedné živočišné buňky se čtyřmi chromozomy (2n = 4, od matky červené, od otce modré) v pěti krocích. Interfáze: v jádře je rozvolněný chromatin, ve fázi S se DNA zdvojí. Profáze: chromozomy se zkrátí a zviditelní, každý ze dvou sesterských chromatid, jadérko zmizí a centrozomy se rozestupují k pólům. Metafáze: vlákna dělicího vřeténka se upnou na centromery a čtyři chromozomy se seřadí v ekvatoriální rovině. Anafáze: osm sesterských chromatid se oddělí a vlákna je táhnou k pólům, ke každému čtyři. Telofáze a cytokineze: vzniknou dvě jádra a buňka se zaškrtí na dvě dceřiné buňky, každá opět se čtyřmi chromozomy.";

const W = 360;
const H = 276;
const CX = 180;
const CY = 140;
const MOM = "#d9603b";
const DAD = "#3f6fb5";
const LONG = 30;
const SHORT = 18;
/** the four chromosomes: colour, length, metaphase height */
const CHR = [
  { col: MOM, len: LONG, y: 94 },
  { col: DAD, len: LONG, y: 128 },
  { col: MOM, len: SHORT, y: 158 },
  { col: DAD, len: SHORT, y: 182 },
];
/** pole positions (centrosomes) in the dividing cell */
const PL = CX - 112;
const PR = CX + 112;

/** One chromatid: a rounded rod centred at (x, y), tilted by `rot` degrees. */
function Rod({
  x,
  y,
  len,
  col,
  rot = 0,
}: {
  x: number;
  y: number;
  len: number;
  col: string;
  rot?: number;
}) {
  const w = 5.5;
  return (
    <rect
      x={x - w / 2}
      y={y - len / 2}
      width={w}
      height={len}
      rx={w / 2}
      fill={col}
      className="bz7-chrom"
      transform={rot ? `rotate(${rot} ${f1(x)} ${f1(y)})` : undefined}
    />
  );
}

/** A replicated chromosome: two sister chromatids joined at the centromere. */
function Dup({
  x,
  y,
  len,
  col,
  rot = 0,
}: {
  x: number;
  y: number;
  len: number;
  col: string;
  rot?: number;
}) {
  return (
    <g transform={rot ? `rotate(${rot} ${f1(x)} ${f1(y)})` : undefined}>
      <Rod x={x - 3.2} y={y} len={len} col={col} />
      <Rod x={x + 3.2} y={y} len={len} col={col} />
      <circle cx={x} cy={y} r={2.6} className="bz7-centro" />
    </g>
  );
}

/** A centrosome: two centrioles at right angles, with short aster rays. */
function Centrosome({ x, y, aster = false }: { x: number; y: number; aster?: boolean }) {
  return (
    <g>
      {aster && (
        <path
          d={Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return `M${f1(x + Math.cos(a) * 7)} ${f1(y + Math.sin(a) * 7)} L${f1(x + Math.cos(a) * 17)} ${f1(y + Math.sin(a) * 17)}`;
          }).join(" ")}
          className="bz7-aster"
        />
      )}
      <rect x={x - 5} y={y - 2} width={7} height={4} rx={1} className="bz7-centriole" />
      <rect x={x + 1} y={y - 5} width={4} height={8} rx={1} className="bz7-centriole" />
    </g>
  );
}

function CellBody({ children }: { children?: ReactNode }) {
  return (
    <g>
      <ellipse cx={CX} cy={CY} rx={140} ry={98} className="bz7-cellbg" />
      <ellipse cx={CX} cy={CY} rx={140} ry={98} className="bz7-o" />
      {children}
    </g>
  );
}

/** The chromosome count tag above the cell. */
function Count({ t }: { t: string }) {
  return (
    <text x={CX} y={26} textAnchor="middle" className="bz7-eq bz7-count">
      {t}
    </text>
  );
}

/** Spindle fibres from both poles to the points `to` (left fibre ends, right fibre ends). */
function Fibres({ to }: { to: [number, number, number][] }) {
  return (
    <g>
      {to.map(([xl, xr, y], i) => (
        <g key={i}>
          <Draw d={`M${PL + 4} ${CY} L${f1(xl)} ${f1(y)}`} className="bz7-fibre" delay={0.1} />
          <Draw d={`M${PR - 4} ${CY} L${f1(xr)} ${f1(y)}`} className="bz7-fibre" delay={0.1} />
        </g>
      ))}
    </g>
  );
}

/** Loose chromatin threads inside a nucleus at (x, y). */
function Chromatin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const t = (dx: number, dy: number) => `${f1(x + dx * s)} ${f1(y + dy * s)}`;
  return (
    <g>
      <path
        d={`M${t(-30, -10)} C${t(-18, -28)} ${t(-6, 6)} ${t(4, -14)} S${t(22, -6)} ${t(26, -20)}`}
        className="bz7-thread"
        style={{ stroke: MOM }}
      />
      <path
        d={`M${t(-28, 12)} C${t(-14, -2)} ${t(-4, 26)} ${t(8, 10)} S${t(24, 22)} ${t(30, 4)}`}
        className="bz7-thread"
        style={{ stroke: DAD }}
      />
      <path
        d={`M${t(-12, 26)} C${t(-4, 16)} ${t(6, 32)} ${t(16, 22)}`}
        className="bz7-thread"
        style={{ stroke: MOM }}
      />
      <path
        d={`M${t(-20, -24)} C${t(-10, -32)} ${t(4, -26)} ${t(12, -32)}`}
        className="bz7-thread"
        style={{ stroke: DAD }}
      />
    </g>
  );
}

function Interphase() {
  return (
    <Frame w={W} h={H}>
      <Count t="2n = 4 · ve fázi S se DNA zdvojí" />
      <CellBody>
        <Pop delay={0.1}>
          <circle cx={CX} cy={CY} r={52} className="bz7-nucleus" />
          <circle cx={CX} cy={CY} r={52} className="bz7-o" />
          <Chromatin x={CX} y={CY} />
          <circle cx={CX + 18} cy={CY + 4} r={9} className="bz7-nucleolus" />
        </Pop>
        <Fade delay={0.4}>
          <Centrosome x={CX + 82} y={CY - 46} />
        </Fade>
      </CellBody>
      <Fade delay={0.6}>
        <Lbl x={20} y={58} tx={CX - 40} ty={CY - 34}>
          jádro
        </Lbl>
        <Lbl x={24} y={268} tx={CX - 22} ty={CY + 10} sec>
          chromatin
        </Lbl>
        <Lbl x={336} y={268} tx={CX + 22} ty={CY + 8} anchor="end">
          jadérko
        </Lbl>
        <Lbl x={340} y={58} tx={CX + 86} ty={CY - 48} anchor="end">
          centrozom
        </Lbl>
      </Fade>
    </Frame>
  );
}

function Prophase() {
  const pos = [
    [CX - 22, CY - 12, -20],
    [CX + 14, CY - 22, 25],
    [CX - 6, CY + 22, 70],
    [CX + 26, CY + 14, -40],
  ];
  return (
    <Frame w={W} h={H}>
      <Count t="4 chromozomy · každý ze 2 chromatid" />
      <CellBody>
        <circle cx={CX} cy={CY} r={54} className="bz7-o bz7-envelope" />
        {CHR.map((c, i) => (
          <Pop key={i} delay={0.15 + i * 0.12}>
            <Dup x={pos[i][0]} y={pos[i][1]} len={c.len} col={c.col} rot={pos[i][2]} />
          </Pop>
        ))}
        <motion.g initial={{ x: 0, y: 0 }} animate={{ x: -46, y: 46 }} transition={{ duration: 1, ease: "easeInOut" }}>
          <Centrosome x={CX - 66} y={CY - 46} aster />
        </motion.g>
        <motion.g initial={{ x: 0, y: 0 }} animate={{ x: 46, y: 46 }} transition={{ duration: 1, ease: "easeInOut" }}>
          <Centrosome x={CX + 66} y={CY - 46} aster />
        </motion.g>
        <Fade delay={0.8}>
          <path
            d={`M${PL + 10} ${CY} Q${CX} ${CY - 74} ${PR - 10} ${CY} M${PL + 10} ${CY} Q${CX} ${CY + 74} ${PR - 10} ${CY}`}
            className="bz7-fibre bz7-fibre-soft"
          />
        </Fade>
      </CellBody>
      <Fade delay={0.7}>
        <Lbl x={24} y={268} tx={CX - 40} ty={CY + 36}>
          jaderný obal se rozpadá
        </Lbl>
        <Lbl x={340} y={58} tx={CX + 18} ty={CY - 36} anchor="end">
          chromozom
        </Lbl>
        <Lbl x={20} y={58} tx={PL + 2} ty={CY - 10} sec>
          vřeténko
        </Lbl>
      </Fade>
    </Frame>
  );
}

function Metaphase() {
  return (
    <Frame w={W} h={H}>
      <Count t="4 chromozomy v ekvatoriální rovině" />
      <CellBody>
        <Fibres to={CHR.map((c) => [CX - 5.5, CX + 5.5, c.y] as [number, number, number])} />
        <Centrosome x={PL} y={CY} aster />
        <Centrosome x={PR} y={CY} aster />
        <line x1={CX} y1={CY - 86} x2={CX} y2={CY + 86} className="bz7-plane" />
        {CHR.map((c, i) => (
          <Pop key={i} delay={0.2 + i * 0.1}>
            <Dup x={CX} y={c.y} len={c.len} col={c.col} />
          </Pop>
        ))}
      </CellBody>
      <Fade delay={0.7}>
        <Lbl x={340} y={268} tx={CX + 3} ty={CY + 84} anchor="end">
          ekvatoriální rovina
        </Lbl>
        <Lbl x={20} y={58} tx={PL + 34} ty={CY - 12}>
          vlákna vřeténka
        </Lbl>
        <Lbl x={24} y={268} tx={CX - 3} ty={CHR[3].y + 4} sec>
          centromera
        </Lbl>
        <Lbl x={340} y={58} tx={PR + 2} ty={CY - 8} anchor="end" sec>
          pól buňky
        </Lbl>
      </Fade>
    </Frame>
  );
}

const SHIFT = 50;
function Anaphase() {
  const move = { duration: 1.1, ease: "easeInOut", delay: 0.15 } as const;
  return (
    <Frame w={W} h={H}>
      <Count t="8 chromatid → ke každému pólu 4" />
      <CellBody>
        <Centrosome x={PL} y={CY} aster />
        <Centrosome x={PR} y={CY} aster />
        {CHR.map((c, i) => {
          const yl = CY + (c.y - CY) * 0.75;
          const l0 = CX - 3 - c.len;
          const r0 = CX + 3 + c.len;
          return (
            <g key={i}>
              {/* shortening fibres pull each chromatid by its centromere */}
              <motion.path
                initial={{ d: `M${PL + 4} ${CY} L${f1(l0)} ${c.y}` }}
                animate={{ d: `M${PL + 4} ${CY} L${f1(l0 - SHIFT)} ${f1(yl)}` }}
                transition={move}
                className="bz7-fibre"
              />
              <motion.path
                initial={{ d: `M${PR - 4} ${CY} L${f1(r0)} ${c.y}` }}
                animate={{ d: `M${PR - 4} ${CY} L${f1(r0 + SHIFT)} ${f1(yl)}` }}
                transition={move}
                className="bz7-fibre"
              />
              <motion.g initial={{ x: 0, y: 0 }} animate={{ x: -SHIFT, y: yl - c.y }} transition={move}>
                <Rod x={CX - 3 - c.len / 2} y={c.y} len={c.len} col={c.col} rot={90} />
                <circle cx={l0 + 2.5} cy={c.y} r={2.2} className="bz7-centro" />
              </motion.g>
              <motion.g initial={{ x: 0, y: 0 }} animate={{ x: SHIFT, y: yl - c.y }} transition={move}>
                <Rod x={CX + 3 + c.len / 2} y={c.y} len={c.len} col={c.col} rot={90} />
                <circle cx={r0 - 2.5} cy={c.y} r={2.2} className="bz7-centro" />
              </motion.g>
            </g>
          );
        })}
        <Draw d={`M${CX - 18} ${CY + 74} H${CX - 62}`} className="bz7-arr bz7-arr-lvl" delay={0.3} arrow="lvl" />
        <Draw d={`M${CX + 18} ${CY + 74} H${CX + 62}`} className="bz7-arr bz7-arr-lvl" delay={0.3} arrow="lvl" />
      </CellBody>
      <Fade delay={0.9}>
        <Lbl x={20} y={268} tx={CX - 3 - SHIFT - 12} ty={CY + 24}>
          sesterské chromatidy
        </Lbl>
        <Lbl x={340} y={268} tx={CX + 40} ty={CY + 74} anchor="end" sec>
          k pólům
        </Lbl>
      </Fade>
    </Frame>
  );
}

function Telophase() {
  const L = CX - 72;
  const R = CX + 72;
  const cell = `M${CX} ${CY - 62} C${CX - 30} ${CY - 96} ${L - 92} ${CY - 100} ${L - 92} ${CY} C${L - 92} ${CY + 100} ${CX - 30} ${CY + 96} ${CX} ${CY + 62} C${CX + 30} ${CY + 96} ${R + 92} ${CY + 100} ${R + 92} ${CY} C${R + 92} ${CY - 100} ${CX + 30} ${CY - 96} ${CX} ${CY - 62}Z`;
  const kid = (x: number) => (
    <g>
      <circle cx={x} cy={CY} r={36} className="bz7-nucleus" />
      <circle cx={x} cy={CY} r={36} className="bz7-o" />
      {CHR.map((c, i) => (
        <Rod
          key={i}
          x={x - 15 + i * 10}
          y={CY + (i > 1 ? 4 : 0)}
          len={c.len * 0.9}
          col={c.col}
          rot={[-14, 10, -8, 16][i]}
        />
      ))}
    </g>
  );
  return (
    <Frame w={W} h={H}>
      <Count t="2 buňky · v každé 2n = 4" />
      <path d={cell} className="bz7-cellbg" />
      <path d={cell} className="bz7-o" />
      <Pop delay={0.15}>{kid(L - 8)}</Pop>
      <Pop delay={0.3}>{kid(R + 8)}</Pop>
      <Centrosome x={L - 66} y={CY - 46} />
      <Centrosome x={R + 66} y={CY - 46} />
      <Draw d={`M${CX} ${CY - 74} V${CY - 64}`} className="bz7-arr bz7-arr-lvl" delay={0.5} arrow="lvl" />
      <Draw d={`M${CX} ${CY + 74} V${CY + 64}`} className="bz7-arr bz7-arr-lvl" delay={0.5} arrow="lvl" />
      <Fade delay={0.7}>
        <Lbl x={340} y={58} tx={CX + 3} ty={CY - 72} anchor="end">
          rýha se zaškrcuje
        </Lbl>
        <Lbl x={20} y={268} tx={L - 24} ty={CY + 30}>
          nové jádro
        </Lbl>
      </Fade>
    </Frame>
  );
}

export default function MitosisStages() {
  return (
    <Figure level={9} label={LABEL} interactive max={600}>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: "Interfáze",
            caption: "Buňka roste a ve fázi S zdvojí DNA; chromozomy jsou rozvolněné a nejsou vidět.",
            art: <Interphase />,
          },
          {
            title: "Profáze",
            caption: "Chromozomy se zkrátí a zviditelní, každý ze dvou chromatid; centrozomy jdou k pólům.",
            art: <Prophase />,
          },
          {
            title: "Metafáze",
            caption: "Vlákna vřeténka se upnou na centromery a chromozomy se seřadí v jedné rovině.",
            art: <Metaphase />,
          },
          {
            title: "Anafáze",
            caption: "Sesterské chromatidy se oddělí a vlákna je táhnou k opačným pólům.",
            art: <Anaphase />,
          },
          {
            title: "Telofáze a cytokineze",
            caption: "Kolem chromozomů vzniknou dvě jádra a rýha rozdělí buňku na dvě shodné.",
            art: <Telophase />,
          },
        ]}
      />
    </Figure>
  );
}
