import {
  DrawArrow,
  Eq,
  Fade,
  Frame,
  Lbl,
  Plates,
  Pop,
  Travel,
  blob,
  f1,
  pat,
  useFig,
  useLive,
  type P2,
} from "./kit";

const LABEL =
  "Houbovec v podélném řezu. Tělo má tvar vázy přisedlé ke kameni, jeho stěnu protkávají drobné póry. Voda vtéká póry dovnitř do středové dutiny, kterou vystýlají límečkové buňky, a odtéká velkým vyvrhovacím otvorem nahoře. Tvar těla drží vápenité nebo křemičité jehlice ve stěně. Výřez ukazuje límečkovou buňku: kmitající bičík žene vodu, límeček z jemných výběžků z ní zachytí bakterie a částečky potravy a buňka je pohltí a stráví.";

// ------------------------------------------------------------------ the vase
const CX = 200;
const Y0 = 64; // lip
const Y1 = 326; // base
const yAt = (t: number) => Y0 + (Y1 - Y0) * t;
/** outer half-width */
const ro = (t: number) => 44 + 58 * Math.pow(Math.sin(Math.PI * t), 0.8) + 8 * t;
/** wall thickness */
const th = (t: number) => 16 + 6 * Math.sin(Math.PI * t);
/** inner half-width (the cavity closes towards the base) */
const ri = (t: number) => {
  const w = ro(t) - th(t);
  return t < 0.8 ? w : w * Math.max(0, Math.sqrt(Math.max(0, (0.9 - t) / 0.1)));
};

const ts = (a: number, b: number, n: number) =>
  Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));

function outerPath() {
  const right: P2[] = ts(0, 1, 13).map((t) => [CX + ro(t), yAt(t)]);
  const left: P2[] = ts(1, 0, 13).map((t) => [CX - ro(t), yAt(t)]);
  return blob([...right, ...left], false) + "Z";
}
function cavityPath() {
  const right: P2[] = ts(0, 0.88, 12).map((t) => [CX + ri(t), yAt(t)]);
  const left: P2[] = ts(0.88, 0, 12).map((t) => [CX - ri(t), yAt(t)]);
  return blob([...right, [CX, yAt(0.9)], ...left], false);
}

const PORES = [0.16, 0.3, 0.44, 0.58, 0.72];
const COLLARS = ts(0.06, 0.84, 15);

const SPICULES: [number, number, number][] = [
  [0.1, -1, 30],
  [0.23, 1, -20],
  [0.37, -1, 60],
  [0.51, 1, 10],
  [0.65, -1, -40],
  [0.8, 1, 50],
  [0.86, -1, 0],
  [0.24, -1, 75],
  [0.66, 1, -70],
];

function Sponge() {
  const { id } = useFig();
  const live = useLive();
  const outer = outerPath();
  const cavity = cavityPath();
  // water through a left pore, along the wall to the cavity and up to the osculum
  const inL = (t: number) =>
    `M${f1(CX - ro(t) - 60)} ${f1(yAt(t))} H${f1(CX - ri(t) + 6)} Q${f1(CX - 18)} ${f1(yAt(t) - 10)} ${CX - 8} ${f1(yAt(t) - 70)} V30`;
  const inR = (t: number) =>
    `M${f1(CX + ro(t) + 60)} ${f1(yAt(t))} H${f1(CX + ri(t) - 6)} Q${f1(CX + 18)} ${f1(yAt(t) - 10)} ${CX + 8} ${f1(yAt(t) - 70)} V30`;
  return (
    <Frame w={420} h={380}>
      <g className={live ? "bz6-live" : ""}>
        {/* rock */}
        <path
          d="M70 372 Q90 330 150 324 Q200 318 252 324 Q320 330 346 372Z"
          className="bz6-o bz6-fill3"
        />
        <path
          d="M70 372 Q90 330 150 324 Q200 318 252 324 Q320 330 346 372Z"
          fill={pat(id, "dd")}
          opacity={0.6}
        />
        {/* body wall and the central cavity (section) */}
        <path d={outer} className="bz6-o bz6-sponge" />
        <path d={outer} fill={pat(id, "dots")} />
        <path d={cavity} className="bz6-o bz6-water" />
        {/* pores: canals through the wall */}
        {PORES.map((t) =>
          [-1, 1].map((s) => {
            const y = yAt(t);
            const d = `M${f1(CX + s * (ro(t) + 1))} ${f1(y)} L${f1(CX + s * (ri(t) - 1))} ${f1(y)}`;
            return (
              <g key={`${t}${s}`}>
                <path d={d} className="bz6-pore-edge" />
                <path d={d} className="bz6-pore" />
              </g>
            );
          }),
        )}
        {/* spicules in the wall */}
        {SPICULES.map(([t, s, a], i) => {
          const x = CX + s * (ri(t) + th(t) / 2);
          const y = yAt(t);
          return (
            <g key={i} transform={`translate(${f1(x)} ${f1(y)}) rotate(${a})`}>
              <path d="M0 0 L0 -6 M0 0 L5.2 3 M0 0 L-5.2 3" className="bz6-spicule" />
            </g>
          );
        })}
        {/* collar cells with flagella, lining the cavity */}
        {COLLARS.map((t) =>
          [-1, 1].map((s) => {
            const x = CX + s * (ri(t) - 3.2);
            const y = yAt(t);
            return (
              <g key={`${t}${s}`}>
                <path
                  d={`M${f1(x - s * 2)} ${f1(y)} q${-s * 4} -2 ${-s * 8} 0 t${-s * 6} 0`}
                  className="bz6-flag"
                />
                <circle cx={x} cy={y} r={3.3} className="bz6-o bz6-thin bz6-lvlmid-f" />
              </g>
            );
          }),
        )}
        {/* water flow */}
        {[0.3, 0.58].map((t) => (
          <g key={t}>
            <path d={inL(t)} className="bz6-flow bz6-flow-water" />
            <path d={inR(t)} className="bz6-flow bz6-flow-water" />
          </g>
        ))}
        {PORES.map((t) => (
          <g key={`a${t}`}>
            <DrawArrow
              d={`M${f1(CX - ro(t) - 34)} ${f1(yAt(t))} H${f1(CX - ro(t) - 5)}`}
              tone="blue"
              delay={0.2 + t}
            />
            <DrawArrow
              d={`M${f1(CX + ro(t) + 34)} ${f1(yAt(t))} H${f1(CX + ro(t) + 5)}`}
              tone="blue"
              delay={0.2 + t}
            />
          </g>
        ))}
        <DrawArrow d={`M${CX} ${yAt(0.45)} V${Y0 - 40}`} tone="blue" delay={1.1} className="bz6-thick" />
        {/* food particles riding the current into the pores */}
        {[0, 0.33, 0.66].map((ph, i) => (
          <Travel
            key={i}
            path={`M${f1(CX - ro(0.44) - 60)} ${f1(yAt(0.44) + (i - 1) * 3)} H${f1(CX - ri(0.44) - 2)}`}
            dur={3}
            phase={ph}
            rest={[CX - ro(0.44) - 50 + i * 14, yAt(0.44) - 10]}
            fade
          >
            <circle r={2.2} className="bz6-food" />
          </Travel>
        ))}
      </g>
      {/* labels */}
      <Fade delay={1.2}>
        <Lbl x={CX + 14} y={22} tx={CX + 26} ty={Y0 - 2} className="bz6-b">
          vyvrhovací otvor
        </Lbl>
        <Eq x={CX - 12} y={44} t="voda ven" anchor="end" className="bz6-eq-sm bz6-blue-t" />
      </Fade>
      <Lbl x={8} y={yAt(0.16) - 36} tx={CX - ro(0.16) + 6} ty={yAt(0.16)} className="bz6-b">
        póry
      </Lbl>
      <g className="bz6-sec">
        <Eq x={8} y={yAt(0.16) - 16} t="voda dovnitř" className="bz6-eq-sm bz6-blue-t" />
      </g>
      <Lbl x={412} y={yAt(0.1) + 4} tx={CX + ri(0.34) - 3} ty={yAt(0.37)} anchor="end" className="bz6-sm">
        límečkové buňky
      </Lbl>
      <Lbl x={CX} y={yAt(0.66)} anchor="middle" className="bz6-sm bz6-halo">
        středová dutina
      </Lbl>
      <Lbl x={8} y={yAt(0.9)} tx={CX - ri(0.8) - th(0.8) / 2} ty={yAt(0.8)} className="bz6-sm">
        jehlice
      </Lbl>
      <Lbl x={412} y={yAt(0.92)} tx={CX + ro(0.84) - 6} ty={yAt(0.84)} anchor="end" className="bz6-sm" sec>
        stěna těla
      </Lbl>
    </Frame>
  );
}

// ------------------------------------------------------------------ collar cell
function wave(x: number, y0: number, y1: number, amp: number, n: number) {
  const pts: string[] = [];
  for (let k = 0; k <= 40; k++) {
    const y = y0 + ((y1 - y0) * k) / 40;
    pts.push(`${f1(x + amp * Math.sin((k / 40) * n * 2 * Math.PI))} ${f1(y)}`);
  }
  return "M" + pts.join(" L");
}

function CollarCell() {
  const { id } = useFig();
  const live = useLive();
  const body = blob(
    [
      [150, 150],
      [184, 166],
      [196, 214],
      [176, 256],
      [150, 264],
      [124, 256],
      [104, 214],
      [116, 166],
    ],
    true,
  );
  // collar: microvilli in a funnel from the cell top up
  const villi = Array.from({ length: 9 }, (_, i) => {
    const k = i / 8;
    const xb = 128 + 44 * k;
    const xt = 118 + 64 * k;
    return `M${f1(xb)} ${158 - Math.sin(Math.PI * k) * 6} L${f1(xt)} 76`;
  });
  return (
    <Frame w={300} h={290} title="límečková buňka">
      <g className={live ? "bz6-live" : ""}>
        {/* water drawn in through the collar, pushed up by the flagellum */}
        <path d="M14 120 Q80 120 118 100" className="bz6-flow bz6-flow-water" />
        <path d="M286 120 Q220 120 182 100" className="bz6-flow bz6-flow-water" />
        <path d="M150 70 V8" className="bz6-flow bz6-flow-water" />
        <path d={body} className="bz6-o bz6-cyto" />
        <path d={body} fill={pat(id, "d")} opacity={0.5} />
        {/* nucleus and food vacuoles */}
        <circle cx={154} cy={226} r={16} className="bz6-o bz6-thin bz6-lvlsoft-f" />
        <circle cx={158} cy={222} r={4.5} className="bz6-ink-f" opacity={0.7} />
        <circle cx={126} cy={196} r={9} className="bz6-o bz6-thin bz6-paper-f" />
        <rect x={121} y={193} width={9} height={4.5} rx={2.2} className="bz6-bact" />
        <circle cx={176} cy={196} r={7} className="bz6-o bz6-thin bz6-paper-f" />
        <circle cx={176} cy={196} r={2.2} className="bz6-food" />
        {/* collar */}
        {villi.map((d, i) => (
          <path key={i} d={d} className="bz6-villus" />
        ))}
        <ellipse cx={150} cy={76} rx={32} ry={5} className="bz6-o bz6-thin" fill="none" />
        {/* flagellum */}
        <path d={wave(150, 156, 18, 7, 2.5)} className="bz6-o bz6-flagellum" />
        {/* trapped bacteria on the collar */}
        {[
          [114, 104, -70],
          [186, 116, 64],
          [120, 136, -78],
        ].map(([x, y, a], i) => (
          <rect
            key={i}
            x={-6}
            y={-2.6}
            width={12}
            height={5.2}
            rx={2.6}
            className="bz6-bact"
            transform={`translate(${x} ${y}) rotate(${a})`}
          />
        ))}
      </g>
      <Pop delay={0.6}>
        <DrawArrow d="M20 104 Q62 104 96 92" tone="blue" delay={0.6} />
        <DrawArrow d="M280 104 Q238 104 204 92" tone="blue" delay={0.6} />
        <DrawArrow d="M166 40 V10" tone="blue" delay={0.9} />
      </Pop>
      <Lbl x={176} y={26} tx={156} ty={40} className="bz6-sm">
        bičík
      </Lbl>
      <Eq x={12} y={140} t="proud vody" className="bz6-eq-sm bz6-blue-t" />
      <Lbl x={292} y={70} tx={180} ty={80} anchor="end" className="bz6-sm">
        límeček
      </Lbl>
      <Lbl x={292} y={156} tx={190} ty={118} anchor="end" className="bz6-sm bz6-lvl-t">
        zachycená bakterie
      </Lbl>
      <Lbl x={292} y={250} tx={170} ty={228} anchor="end" className="bz6-sm">
        jádro
      </Lbl>
      <Lbl x={8} y={250} tx={120} ty={200} className="bz6-sm" sec>
        trávení v buňce
      </Lbl>
    </Frame>
  );
}

export default function SpongeFlow() {
  return (
    <Plates label={LABEL} level={4} max={780} cols="1.4fr 1fr" stackBelow={600}>
      <Sponge />
      <CollarCell />
    </Plates>
  );
}
