import { Callouts, Legend, type Callout } from "./callouts";
import { Bubbles, DrawArrow, Eq, Fade, Figure, Lbl, Travel, pat, useCompact, useFig, useLive } from "./kit";

const LABEL =
  "Pokus Millera a Ureyho z roku 1953. V malé baňce vře voda – „oceán“. Pára stoupá trubicí do velké baňky s plyny, které měly tvořit pravěkou atmosféru: methanem, amoniakem, vodíkem a vodní párou. Mezi dvěma elektrodami v ní přeskakují jiskry, které napodobují blesky. Plyny pak projdou chladičem, pára zkapalní a stéká do ohybu trubice, kde se po několika dnech hromadí nahnědlá kapalina s aminokyselinami; odtud se kapalina vrací do baňky s vodou a koloběh se opakuje.";

const TUBE_UP = "M110 214 V82 Q110 70 122 70 H226 Q236 70 244 82 L252 94";
const TUBE_DOWN = "M310 200 V316";
const TRAP = "M310 316 V350 Q310 364 296 364 H222 Q208 364 208 350 V302 Q208 290 196 290 H154";
const LIQ = "M310 334 V350 Q310 364 296 364 H222 Q208 364 208 350 V334";

function Apparatus() {
  const { id } = useFig();
  const live = useLive();
  return (
    <g className={live ? "bz6-live" : ""}>
      {/* glass tubes (double line: glass wall) */}
      {[TUBE_UP, TUBE_DOWN, TRAP].map((d) => (
        <g key={d}>
          <path d={d} className="bz6-glass-edge" />
          <path d={d} className="bz6-glass-in" />
        </g>
      ))}
      <path d={LIQ} className="bz6-amino" />
      {/* sampling tap */}
      <path d="M260 366 V382" className="bz6-o" />
      <rect x={253} y={372} width={14} height={6} rx={2} className="bz6-o bz6-fill3" />
      {/* condenser jacket with cooling water */}
      <rect x={292} y={222} width={36} height={84} rx={8} className="bz6-o bz6-water" />
      <rect x={292} y={222} width={36} height={84} rx={8} fill={pat(id, "h")} opacity={0.6} />
      <path d="M310 222 V306" className="bz6-glass-edge" />
      <path d="M310 222 V306" className="bz6-glass-in" />
      <path d="M328 296 H352 M328 232 H352" className="bz6-o" style={{ strokeWidth: 5 }} />
      <path d="M328 296 H352 M328 232 H352" className="bz6-water-s" />
      <DrawArrow d="M372 296 H356" tone="blue" delay={0.8} />
      <DrawArrow d="M356 232 H372" tone="blue" delay={0.8} />
      {/* droplets running down the condenser */}
      {[0, 0.5].map((ph) => (
        <Travel key={ph} path="M310 226 V340" dur={2.2} phase={ph} rest={[310, 300]} fade>
          <circle r={2.6} className="bz6-drop" />
        </Travel>
      ))}
      {/* small flask: the "ocean" */}
      <path d="M100 214 V250 A44 44 0 1 0 120 250 V214Z" className="bz6-o bz6-glass" />
      <path d="M72 300 A44 44 0 0 0 148 300 Z" className="bz6-water" />
      <path d="M72 300 A44 44 0 0 0 148 300 Z" fill={pat(id, "h")} opacity={0.6} />
      <path d="M72 300 H148" className="bz6-o bz6-thin" />
      <Bubbles x={110} y={326} rise={24} n={5} spread={36} r={2.4} />
      {/* burner flame */}
      <path d="M110 340 C98 354 100 368 110 374 C120 368 122 354 110 340Z" className="bz6-flame" />
      <path d="M110 352 C105 360 106 368 110 371 C114 368 115 360 110 352Z" className="bz6-flame-in" />
      <path d="M92 376 H128" className="bz6-o" style={{ strokeWidth: 3 }} />
      {/* big flask: the "atmosphere" with electrodes */}
      <circle cx={310} cy={130} r={72} className="bz6-o bz6-glass" />
      <path d="M296 200 V206 M324 200 V206" className="bz6-o" />
      <path d="M266 48 L296 122 M354 48 L324 122" className="bz6-electrode" />
      <circle cx={296} cy={122} r={2.6} className="bz6-ink-f" />
      <circle cx={324} cy={122} r={2.6} className="bz6-ink-f" />
      <g className="bz6-sparks">
        <path d="M298 122 L304 112 L308 130 L314 112 L318 130 L322 122" className="bz6-spark-edge" />
        <path d="M298 122 L304 112 L308 130 L314 112 L318 130 L322 122" className="bz6-spark-in" />
        <path d="M310 106 V100 M310 138 V144 M300 108 L296 104 M320 108 L324 104 M300 136 L296 140 M320 136 L324 140" className="bz6-spark-in bz6-spark-ray" />
      </g>
      <Fade delay={0.6}>
        <Eq x={280} y={160} t="CH_{4}" anchor="middle" className="bz6-eq-sm" />
        <Eq x={340} y={160} t="NH_{3}" anchor="middle" className="bz6-eq-sm" />
        <Eq x={292} y={186} t="H_{2}" anchor="middle" className="bz6-eq-sm" />
        <Eq x={330} y={186} t="H_{2}O" anchor="middle" className="bz6-eq-sm" />
      </Fade>
      {/* circulation */}
      <DrawArrow d="M128 190 V130" tone="lvl" delay={0.5} />
      <DrawArrow d="M150 56 H200" tone="lvl" delay={0.7} />
      <DrawArrow d="M282 236 V290" tone="lvl" delay={0.9} />
      <DrawArrow d="M196 276 H164" tone="lvl" delay={1.1} />
    </g>
  );
}

/** narrow layout: numbered badges, the text in a legend under the plate */
const NARROW: Callout[] = [
  { t: "„oceán“: vařící voda", x: 0, y: 0, tx: 80, ty: 310, b: [56, 252] },
  { t: "zahřívání", x: 0, y: 0, tx: 102, ty: 362, b: [68, 360] },
  { t: "„atmosféra“: plyny bez kyslíku", x: 0, y: 0, tx: 352, ty: 160, b: [394, 186] },
  { t: "jiskry = blesky", x: 0, y: 0, tx: 318, ty: 116, b: [386, 76] },
  { t: "chladič: pára zkapalní", x: 0, y: 0, tx: 326, ty: 264, b: [358, 264] },
  { t: "voda s aminokyselinami", x: 0, y: 0, tx: 302, ty: 360, b: [338, 340] },
];

export default function MillerUrey() {
  const cmp = useCompact(480);
  if (cmp.narrow)
    return (
      <Figure
        label={LABEL}
        level={7}
        w={384}
        h={392}
        max={640}
        replay
        compact={cmp}
        boost={false}
        controls={<Legend items={NARROW} />}
      >
        <g transform="translate(-34 0)">
          <Apparatus />
          <Fade delay={1}>
            <Callouts items={NARROW} narrow r={13} />
            <Eq x={136} y={166} t="pára" className="bz6-eq-lg bz6-lvl-t" />
          </Fade>
        </g>
      </Figure>
    );
  return (
    <Figure label={LABEL} level={7} w={520} h={392} max={640} replay compact={cmp} boost={false}>
      <Apparatus />
      <Fade delay={1}>
        <Lbl x={8} y={196} className="bz6-b">
          „oceán“
        </Lbl>
        <Eq x={8} y={214} t="vařící voda" className="bz6-eq-sm" />
        <Lbl x={136} y={384} tx={122} ty={362} className="bz6-sm">
          zahřívání
        </Lbl>
        <Lbl x={400} y={110} className="bz6-b">
          „atmosféra“
        </Lbl>
        <Eq x={400} y={128} t="plyny bez kyslíku" className="bz6-eq-sm" />
        <Lbl x={400} y={36} tx={318} ty={118} className="bz6-sm bz6-lvl-t bz6-b">
          jiskry = blesky
        </Lbl>
        <Lbl x={382} y={268} className="bz6-b">
          chladič
        </Lbl>
        <Eq x={382} y={286} t="pára zkapalní" className="bz6-eq-sm" />
        <Lbl x={324} y={372} tx={300} ty={360} className="bz6-sm bz6-b bz6-amino-t">
          voda s aminokyselinami
        </Lbl>
        <Eq x={134} y={164} t="pára" className="bz6-eq-sm bz6-lvl-t" />
      </Fade>
    </Figure>
  );
}
