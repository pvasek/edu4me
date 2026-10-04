import {
  BASE,
  DrawArrow,
  Fade,
  Figure,
  Lbl,
  PAIR,
  Pop,
  f1,
  pat,
  rng,
  useFig,
  Draw,
} from "./kit";

const LABEL =
  "Replikační vidlička. Vpravo je původní dvoušroubovice DNA, kterou helikáza rozplétá; vidlička postupuje doprava. Oba rozpletené řetězce slouží jako předloha. DNA-polymeráza přidává nukleotidy jen ve směru od 5′ ke 3′ konci: na vedoucím řetězci proto syntéza běží souvisle za vidličkou, na opožďujícím se řetězci po kouscích opačným směrem – vznikají Okazakiho fragmenty, každý začíná krátkým RNA-primerem a ligáza je nakonec spojí. Dole výsledek: každá ze dvou nových molekul DNA má jeden původní a jeden nový řetězec – replikace je semikonzervativní.";

const W = 540;
const H = 420;

// fork geometry
const FX = 352; // fork point
const CY = 140;
const HX1 = 524; // end of the parental duplex
const A = 22; // half-gap of the duplex
const TT = 70; // top template (left part)
const BT = 214; // bottom template (left part)
const GAP = 15; // template – new strand distance
const X0 = 36; // left end of the strands

const SEQ = (() => {
  const r = rng(7);
  return Array.from({ length: 80 }, () => "ATGC"[Math.floor(r() * 4)]);
})();

/** template arm from the left end to the fork (straight, then a smooth bend) */
const topArm = `M${X0} ${TT} H${FX - 82} C${FX - 40} ${TT} ${FX - 26} ${CY - A} ${FX} ${CY - A}`;
const botArm = `M${X0} ${BT} H${FX - 82} C${FX - 40} ${BT} ${FX - 26} ${CY + A} ${FX} ${CY + A}`;

function helix() {
  const k = (2 * Math.PI) / 84;
  const top: string[] = [];
  const bot: string[] = [];
  for (let x = FX; x <= HX1 + 0.1; x += 3) {
    const c = Math.cos(k * (x - FX));
    top.push(`${f1(x)} ${f1(CY - A * c)}`);
    bot.push(`${f1(x)} ${f1(CY + A * c)}`);
  }
  const rungs: { x: number; y1: number; y2: number; b: string }[] = [];
  let i = 0;
  for (let x = FX + 8; x < HX1 - 2; x += 9) {
    const c = Math.cos(k * (x - FX));
    if (Math.abs(c) < 0.28) continue;
    rungs.push({ x, y1: CY - A * c, y2: CY + A * c, b: SEQ[i++ % SEQ.length] });
  }
  return { top: "M" + top.join(" L"), bot: "M" + bot.join(" L"), rungs };
}
const HELIX = helix();

/** paired rungs between a template (y1) and its new strand (y2) */
function Rungs({
  from,
  to,
  y1,
  y2,
  seed,
  half = false,
}: {
  from: number;
  to: number;
  y1: number;
  y2: number;
  seed: number;
  half?: boolean;
}) {
  const out = [];
  let i = seed;
  for (let x = from; x <= to; x += 10) {
    const b = SEQ[i++ % SEQ.length];
    const m = (y1 + y2) / 2;
    out.push(
      <g key={x}>
        <line
          x1={x}
          y1={y1}
          x2={x}
          y2={half ? y1 + (y2 - y1) * 0.45 : m}
          stroke={BASE[b]}
          className="bz4-rung"
        />
        {!half && (
          <line
            x1={x}
            y1={m}
            x2={x}
            y2={y2}
            stroke={BASE[PAIR[b]]}
            className="bz4-rung"
          />
        )}
      </g>,
    );
  }
  return <g>{out}</g>;
}

/** DNA polymerase: an engraved "hand" gripping the template and the new strand */
function Polymerase({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const { id } = useFig();
  const d =
    "M-20 -6 C-22 -20 -6 -24 6 -19 C18 -15 22 -6 20 4 C18 15 6 21 -6 19 C-16 17 -19 8 -14 4 C-10 0 -18 2 -20 -6Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d={d} className="bz4-o bz4-protein" />
      <path d={d} fill={pat(id, "d")} opacity={0.5} className="bz4-nohit" />
    </g>
  );
}

/** a small duplex: two strands with rungs */
function Mini({
  x,
  y,
  w,
  top,
  bot,
}: {
  x: number;
  y: number;
  w: number;
  top: "old" | "new";
  bot: "old" | "new";
}) {
  const rs = [];
  for (let i = 0; i * 9 + 6 < w; i++) {
    const b = SEQ[(i * 3 + x) % SEQ.length];
    rs.push(
      <g key={i}>
        <line x1={x + 6 + i * 9} y1={y} x2={x + 6 + i * 9} y2={y + 8} stroke={BASE[b]} className="bz4-rung" />
        <line x1={x + 6 + i * 9} y1={y + 8} x2={x + 6 + i * 9} y2={y + 16} stroke={BASE[PAIR[b]]} className="bz4-rung" />
      </g>,
    );
  }
  return (
    <g>
      {rs}
      <path d={`M${x} ${y} H${x + w}`} className={`bz4-strand-${top}`} />
      <path d={`M${x} ${y + 16} H${x + w}`} className={`bz4-strand-${bot}`} />
    </g>
  );
}

export default function DnaReplication() {
  const lead1 = FX - 60; // leading strand tip
  // lagging fragments [left, right] (synthesised right → left); primers at the right ends
  const frags: [number, number][] = [
    [X0 + 4, 116],
    [121, 196],
  ];
  const newest: [number, number] = [214, 252]; // in progress, polymerase at its left end
  const lagY = BT - GAP;
  const leadY = TT + GAP;
  return (
    <Figure level={10} label={LABEL} w={W} h={H} max={680} replay>
      {/* base pairs */}
      <Fade delay={0.1}>
        {HELIX.rungs.map((r, i) => (
          <g key={i}>
            <line x1={r.x} y1={r.y1} x2={r.x} y2={(r.y1 + r.y2) / 2} stroke={BASE[r.b]} className="bz4-rung" />
            <line x1={r.x} y1={(r.y1 + r.y2) / 2} x2={r.x} y2={r.y2} stroke={BASE[PAIR[r.b]]} className="bz4-rung" />
          </g>
        ))}
        <Rungs from={X0 + 6} to={lead1 - 8} y1={TT} y2={leadY} seed={3} />
        <Rungs from={lead1 + 4} to={FX - 70} y1={TT} y2={leadY} seed={20} half />
        <Rungs from={X0 + 6} to={newest[1]} y1={BT} y2={lagY} seed={9} />
        <Rungs from={newest[1] + 10} to={FX - 70} y1={BT} y2={lagY} seed={31} half />
      </Fade>

      {/* parental strands */}
      <Draw d={HELIX.top} className="bz4-strand-old" />
      <Draw d={HELIX.bot} className="bz4-strand-old" />
      <Draw d={topArm} className="bz4-strand-old" delay={0.2} />
      <Draw d={botArm} className="bz4-strand-old" delay={0.2} />

      {/* new strands */}
      <DrawArrowStrand d={`M${X0 + 4} ${leadY} H${lead1}`} delay={0.8} />
      {frags.map(([a, b], i) => (
        <g key={i}>
          <DrawArrowStrand d={`M${b} ${lagY} H${a}`} delay={0.8 + i * 0.2} />
          <Fade delay={0.8 + i * 0.2}>
            <path d={`M${b - 11} ${lagY} H${b}`} className="bz4-strand-rna" />
          </Fade>
        </g>
      ))}
      <DrawArrowStrand d={`M${newest[1]} ${lagY} H${newest[0]}`} delay={1.2} />
      <Fade delay={1.2}>
        <path d={`M${newest[1] - 11} ${lagY} H${newest[1]}`} className="bz4-strand-rna" />
      </Fade>

      {/* enzymes */}
      <Pop delay={0.5}>
        <g>
          <ellipse cx={FX + 6} cy={CY} rx={15} ry={30} className="bz4-o bz4-prot2" />
          <ellipse cx={FX + 6} cy={CY} rx={6} ry={17} className="bz4-o bz4-thin bz4-fill" />
        </g>
      </Pop>
      <Pop delay={1.0}>
        <Polymerase x={lead1 + 2} y={(TT + leadY) / 2} />
      </Pop>
      <Pop delay={1.3}>
        <Polymerase x={newest[0] - 2} y={(BT + lagY) / 2} flip />
      </Pop>

      {/* ends */}
      <Fade delay={0.6}>
        <text x={X0 - 6} y={TT + 4} textAnchor="end" className="bz4-end-t">3′</text>
        <text x={X0 - 6} y={leadY + 9} textAnchor="end" className="bz4-end-t bz4-lvl-t">5′</text>
        <text x={X0 - 6} y={lagY - 1} textAnchor="end" className="bz4-end-t bz4-lvl-t">3′</text>
        <text x={X0 - 6} y={BT + 9} textAnchor="end" className="bz4-end-t">5′</text>
        <text x={HX1 + 6} y={CY - A + 4} className="bz4-end-t">5′</text>
        <text x={HX1 + 6} y={CY + A + 4} className="bz4-end-t">3′</text>
      </Fade>

      {/* labels */}
      <Fade delay={1.5}>
        <DrawArrow d={`M${FX + 60} 86 H${FX + 130}`} tone="ink" delay={1.5} />
        <text x={FX + 95} y={76} textAnchor="middle" className="bz4-lbl bz4-sm">
          postup vidličky
        </text>
        <Lbl x={FX + 40} y={CY + 64} tx={FX + 12} ty={CY + 22} className="bz4-b">
          helikáza
        </Lbl>
        <text x={FX + 40} y={CY + 82} className="bz4-lbl bz4-sm bz4-sec">
          rozplétá dvoušroubovici
        </text>
        <text x={X0} y={30} className="bz4-lbl bz4-b bz4-lvl-t">
          vedoucí řetězec
        </text>
        <text x={X0} y={52} className="bz4-lbl bz4-sm">
          syntéza souvisle, za vidličkou
        </text>
        <Lbl x={lead1 + 10} y={34} tx={lead1 + 6} ty={TT - 12} className="bz4-sm" anchor="start">
          DNA-polymeráza
        </Lbl>
        <text x={X0} y={BT + 34} className="bz4-lbl bz4-b bz4-lvl-t">
          opožďující se řetězec
        </text>
        <text x={X0} y={BT + 55} className="bz4-lbl bz4-sm">
          Okazakiho fragmenty, syntéza opačným směrem
        </text>
        <Lbl x={FX - 30} y={BT + 34} tx={newest[1] - 5} ty={lagY + 3} className="bz4-sm" anchor="start">
          RNA-primer
        </Lbl>
        <Lbl x={FX - 30} y={BT + 52} tx={newest[0] - 6} ty={BT + 12} className="bz4-sm" sec anchor="start">
          DNA-polymeráza
        </Lbl>
        <Lbl x={X0 + 40} y={lagY - 22} tx={118.5} ty={lagY - 3} className="bz4-sm" sec anchor="start">
          ligáza spojí fragmenty
        </Lbl>
      </Fade>

      {/* result: semiconservative */}
      <Fade delay={1.7}>
        <line x1={20} x2={W - 20} y1={292} y2={292} className="bz4-lead bz4-dash" />
        <text x={W / 2} y={318} textAnchor="middle" className="bz4-lbl bz4-b">
          výsledek: semikonzervativní replikace
        </text>
        <Mini x={40} y={358} w={120} top="old" bot="old" />
        <DrawArrow d="M178 366 H218" delay={1.8} />
        <Mini x={234} y={338} w={120} top="old" bot="new" />
        <Mini x={234} y={378} w={120} top="new" bot="old" />
        <text x={100} y={398} textAnchor="middle" className="bz4-lbl bz4-sm">
          původní molekula
        </text>
        <g className="bz4-legend">
          <path d="M386 346 H414" className="bz4-strand-old" />
          <text x={422} y={351} className="bz4-lbl bz4-sm">původní</text>
          <path d="M386 372 H414" className="bz4-strand-new" />
          <text x={422} y={377} className="bz4-lbl bz4-sm">nový řetězec</text>
          <text x={386} y={402} className="bz4-lbl bz4-sm bz4-sec">každá kopie: 1 + 1</text>
        </g>
      </Fade>
    </Figure>
  );
}

/** a new strand that draws in with an arrow head at its 3′ end */
function DrawArrowStrand({ d, delay }: { d: string; delay: number }) {
  return <Draw d={d} className="bz4-strand-new bz4-strand-head" delay={delay} arrow="lvl" />;
}
