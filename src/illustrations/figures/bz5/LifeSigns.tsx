import { StepStrip } from "../../sequence/StepFigure";
import { Body, Draw, Fade, Figure, Frame, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Tabule znaků života, každý s malým příkladem. Jsou z buněk: pletivo z buněk s jádry. Látková přeměna: housenka přijímá potravu z listu a vylučuje zbytky. Růst a vývoj: ze semene vyroste klíční rostlinka a pak rostlina. Rozmnožování: ptačí hnízdo s vejci a líhnoucím se mládětem. Dráždivost: citlivka po dotyku složí lístky. Pohyb: plovoucí ryba. Dědičnost: kotě má stejnou kresbu srsti jako kočka. Poslední políčko ukazuje krystal soli a plamen: krystal roste a oheň spotřebovává kyslík, ale nejsou z buněk, a proto nejsou živé.";

const W = 160;
const H = 120;

function Cells() {
  const pts: [number, number][] = [
    [80, 60],
    [52, 44],
    [52, 78],
    [108, 44],
    [108, 78],
    [80, 26],
    [80, 94],
    [26, 60],
    [134, 60],
  ];
  return (
    <Frame w={W} h={H}>
      {pts.map(([x, y], i) => {
        const hex = Array.from({ length: 6 }, (_, k) => {
          const a = (k * Math.PI) / 3 + Math.PI / 6;
          return `${f1(x + Math.cos(a) * 19)} ${f1(y + Math.sin(a) * 19.5)}`;
        }).join(" L");
        return (
          <Pop key={i} delay={i * 0.06}>
            <path d={`M${hex}Z`} className="bz5-o bz5-leaf2" />
            <path
              d={`M${hex}Z`}
              className="bz5-o bz5-thin"
              transform={`translate(${x} ${y}) scale(0.84) translate(${-x} ${-y})`}
            />
            <circle
              cx={x + 4}
              cy={y - 3}
              r={5}
              className="bz5-o bz5-thin bz5-nuc"
            />
            <ellipse
              cx={x - 7}
              cy={y + 7}
              rx={3}
              ry={1.8}
              className="bz5-chl bz5-o bz5-thin"
            />
          </Pop>
        );
      })}
    </Frame>
  );
}

function Metabolism() {
  const { id } = useFig();
  const leaf =
    "M18 96 C20 50 60 22 110 18 C112 44 104 66 92 78 C96 70 86 60 78 66 C74 58 64 60 64 70 C50 84 34 92 18 96 Z";
  return (
    <Frame w={W} h={H}>
      <Body d={leaf} fill="bz5-leaf" hatch="d" hatchOpacity={0.5} />
      <path d="M18 96 C44 72 74 44 108 20" className="bz5-o bz5-thin" />
      <Pop delay={0.3}>
        {/* caterpillar biting the leaf edge */}
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <circle
            key={k}
            cx={92 + k * 9}
            cy={84 + Math.sin(k) * 3}
            r={6}
            className="bz5-o bz5-thin bz5-larva"
          />
        ))}
        <circle cx={84} cy={80} r={6.6} className="bz5-o bz5-larva" />
        <circle cx={82} cy={78} r={1.2} className="bz5-spot" />
        <path
          d="M95 91 v4 M104 91 v4 M113 91 v4 M122 91 v4"
          className="bz5-o bz5-thin"
        />
      </Pop>
      <Fade delay={0.6}>
        {[
          [146, 100],
          [140, 106],
          [150, 108],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={2.2}
            className="bz5-spot"
            opacity={0.6}
          />
        ))}
        <path
          d="M14 30 L36 30"
          className="bz5-arr bz5-arr-lvl"
          markerEnd={`url(#${id}-ah-lvl)`}
        />
        <text x={14} y={22} className="bz5-lbl bz5-sm bz5-lvl-t">
          potrava
        </text>
      </Fade>
    </Frame>
  );
}

function Growth() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <path d="M6 100 H154" className="bz5-o" />
      <path d="M6 100 H154 V116 H6 Z" className="bz5-soil" />
      <Pop delay={0.1}>
        <ellipse cx={24} cy={95} rx={7} ry={4.6} className="bz5-o bz5-seed" />
      </Pop>
      <Pop delay={0.35}>
        <path
          d="M66 100 V80"
          className="bz5-o bz5-stem-s"
          style={{ strokeWidth: 2 }}
        />
        <path
          d="M66 82 C58 74 50 76 48 80 C54 86 62 84 66 82 Z M66 82 C74 74 82 76 84 80 C78 86 70 84 66 82 Z"
          className="bz5-o bz5-thin bz5-leaf"
        />
        <path d="M66 100 l-4 8 M66 100 l3 9" className="bz5-o bz5-thin" />
      </Pop>
      <Pop delay={0.6}>
        <path
          d="M124 100 V30"
          className="bz5-o bz5-stem-s"
          style={{ strokeWidth: 2.4 }}
        />
        {[
          [84, -1],
          [66, 1],
          [50, -1],
          [36, 1],
        ].map(([y, s]) => (
          <path
            key={y}
            d={`M124 ${y} C${124 + s * 8} ${y - 12} ${124 + s * 22} ${y - 12} ${124 + s * 28} ${y - 6} C${124 + s * 20} ${y + 2} ${124 + s * 8} ${y + 2} 124 ${y} Z`}
            className="bz5-o bz5-thin bz5-leaf"
          />
        ))}
        <circle cx={124} cy={26} r={6} className="bz5-o bz5-pollen" />
        <path
          d="M124 100 l-8 12 M124 100 l6 14 M124 100 l0 14"
          className="bz5-o bz5-thin"
        />
      </Pop>
      <Fade delay={0.8}>
        <path
          d="M34 90 H46"
          className="bz5-arr bz5-arr-muted"
          markerEnd={`url(#${id}-ah-muted)`}
        />
        <path
          d="M88 72 H102"
          className="bz5-arr bz5-arr-muted"
          markerEnd={`url(#${id}-ah-muted)`}
        />
      </Fade>
    </Frame>
  );
}

function Reproduction() {
  const { id } = useFig();
  const nest = "M14 80 Q80 76 146 80 Q140 112 80 114 Q20 112 14 80 Z";
  return (
    <Frame w={W} h={H}>
      <Pop delay={0.1}>
        <ellipse
          cx={58}
          cy={74}
          rx={14}
          ry={10}
          className="bz5-o bz5-egg"
          transform="rotate(-10 58 74)"
        />
        <ellipse cx={82} cy={72} rx={14} ry={10} className="bz5-o bz5-egg" />
      </Pop>
      <Pop delay={0.35}>
        {/* a chick hatching from the third egg */}
        <path
          d="M94 80 L96 68 L101 74 L106 66 L111 74 L116 67 L120 80 Q108 90 94 80 Z"
          className="bz5-o bz5-egg"
        />
        <circle cx={107} cy={56} r={11} className="bz5-o bz5-chick" />
        <path
          d="M117 55 L124 57 L117 59 Z"
          className="bz5-o bz5-thin bz5-pollen"
        />
        <circle cx={110} cy={53} r={1.4} className="bz5-spot" />
        <path d="M102 47 l-2 -5 M106 45 l0 -6" className="bz5-o bz5-thin" />
      </Pop>
      <path d={nest} className="bz5-nest" />
      <path d={nest} fill={pat(id, "x")} />
      <path d={nest} className="bz5-o" />
      <path
        d="M22 86 Q80 96 138 86 M30 98 Q80 108 130 98"
        className="bz5-o bz5-thin"
      />
    </Frame>
  );
}

/** One pinna of a mimosa leaf: open leaflets, or folded after a touch. */
function Pinna({ x, y, folded }: { x: number; y: number; folded: boolean }) {
  const pairs = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <path
        d={`M${x} ${y} V${y - 74}`}
        className="bz5-o bz5-stem-s"
        style={{ strokeWidth: 1.6 }}
      />
      {pairs.map((k) => {
        const yy = y - 12 - k * 12;
        return [-1, 1].map((s) => (
          <ellipse
            key={`${k}${s}`}
            cx={folded ? x + s * 3 : x + s * 10}
            cy={folded ? yy - 6 : yy}
            rx={folded ? 2.6 : 9}
            ry={folded ? 6 : 3.4}
            className="bz5-o bz5-thin bz5-leaf"
          />
        ));
      })}
    </g>
  );
}

function Response() {
  return (
    <Frame w={W} h={H}>
      <path
        d="M80 118 V96 M80 96 Q60 96 48 104 M80 96 Q100 96 112 104"
        className="bz5-o bz5-stem-s"
        style={{ strokeWidth: 2 }}
      />
      <Pinna x={48} y={104} folded={false} />
      <Pop delay={0.3}>
        <Pinna x={112} y={104} folded />
      </Pop>
      {/* fingertip */}
      <Pop delay={0.1}>
        <path
          d="M160 26 Q138 18 126 26 Q120 34 128 38 Q140 40 160 38"
          className="bz5-o bz5-skin"
        />
        <path d="M128 30 q3 -2 6 0" className="bz5-o bz5-thin" />
      </Pop>
      <Fade delay={0.5}>
        <path
          d="M118 44 q-4 4 0 8 M124 46 q-3 4 0 8"
          className="bz5-o bz5-thin bz5-lvl-s"
        />
      </Fade>
    </Frame>
  );
}

function Movement() {
  const { id } = useFig();
  const fish =
    "M44 60 C60 38 102 36 122 56 C128 62 128 62 122 66 C102 84 60 82 44 60 Z";
  return (
    <Frame w={W} h={H}>
      <Fade>
        <path
          d="M8 98 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0"
          className="bz5-o bz5-thin bz5-blue-s"
        />
      </Fade>
      <Pop delay={0.1}>
        <path d="M46 60 L20 42 L26 60 L20 78 Z" className="bz5-o bz5-fish" />
        <path d="M70 44 Q84 26 100 42" className="bz5-o bz5-fish" />
        <Body d={fish} fill="bz5-fish" hatch="d" hatchOpacity={0.4} />
        <path d="M104 46 Q98 60 104 74" className="bz5-o bz5-thin" />
        <circle cx={113} cy={56} r={2.6} className="bz5-spot" />
        <path d="M88 66 Q96 72 92 80" className="bz5-o bz5-thin" />
      </Pop>
      <Draw
        d="M12 52 H2 M14 62 H0 M12 72 H2"
        className="bz5-o bz5-thin bz5-lvl-s"
        delay={0.4}
      />
      <Draw
        d="M132 60 H152"
        className="bz5-arr bz5-arr-lvl"
        delay={0.5}
        arrow="lvl"
      />
      <circle
        cx={140}
        cy={30}
        r={3}
        className="bz5-o bz5-thin"
        fill={pat(id, "hi")}
      />
      <circle cx={148} cy={20} r={2} className="bz5-o bz5-thin" />
    </Frame>
  );
}

/** Sitting cat facing left, feet at (x, y), with tabby stripes. */
function Cat({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M16 -4 C34 -6 40 -20 30 -28"
        className="bz5-o"
        style={{ strokeWidth: 5.6 / s }}
      />
      <path
        d="M16 -4 C34 -6 40 -20 30 -28"
        className="bz5-cat-s"
        style={{ strokeWidth: 3 / s }}
      />
      <path
        d="M-14 0 C-18 -20 -14 -44 0 -48 C14 -44 20 -20 18 0 Z"
        className="bz5-o bz5-cat"
      />
      <path
        d="M-10 -66 L-12 -80 L-3 -70 M10 -66 L12 -80 L3 -70"
        className="bz5-o bz5-cat"
      />
      <circle cx={0} cy={-60} r={14} className="bz5-o bz5-cat" />
      <path
        d="M-6 -62 h3 M3 -62 h3 M-1 -56 h2 M-13 -54 l-8 -1 M13 -54 l8 -1"
        className="bz5-o bz5-thin"
      />
      <path
        d="M-12 -36 q6 4 12 0 M-14 -24 q8 5 16 0 M-14 -12 q9 5 18 0 M-4 -72 v8 M4 -72 v8"
        className="bz5-o bz5-stripe"
      />
    </g>
  );
}

function Heredity() {
  return (
    <Frame w={W} h={H}>
      <path d="M8 110 H152" className="bz5-o bz5-thin" />
      <Pop delay={0.05}>
        <Cat x={52} y={110} s={1.15} />
      </Pop>
      <Pop delay={0.4}>
        <Cat x={116} y={110} s={0.66} />
      </Pop>
    </Frame>
  );
}

function NotAlive() {
  return (
    <Frame w={W} h={H}>
      <Pop delay={0.05}>
        {/* a salt crystal: a cube */}
        <path
          d="M14 56 L40 44 L66 56 L40 68 Z"
          className="bz5-o bz5-salt-top"
        />
        <path d="M14 56 V88 L40 100 V68 Z" className="bz5-o bz5-salt" />
        <path d="M66 56 V88 L40 100 V68 Z" className="bz5-o bz5-salt-dark" />
        <path
          d="M27 50 L53 62 M27 62 V94 M53 62 V94"
          className="bz5-o bz5-thin bz5-ghost"
        />
      </Pop>
      <Pop delay={0.25}>
        {/* a candle flame */}
        <rect
          x={108}
          y={74}
          width={20}
          height={34}
          className="bz5-o bz5-fill"
        />
        <path d="M118 74 V66" className="bz5-o" />
        <path
          d="M118 66 C106 52 112 36 118 22 C124 36 130 52 118 66 Z"
          className="bz5-flame"
        />
        <path
          d="M118 62 C113 54 115 46 118 40 C121 46 123 54 118 62 Z"
          className="bz5-flame-in"
        />
      </Pop>
      <Fade delay={0.5}>
        <text
          x={40}
          y={30}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b"
        >
          krystal
        </text>
        <text
          x={118}
          y={16}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b"
        >
          oheň
        </text>
        <path
          d="M66 36 l9 9 M75 36 l-9 9 M138 36 l9 9 M147 36 l-9 9"
          className="bz5-o bz5-x"
        />
      </Fade>
    </Frame>
  );
}

export default function LifeSigns() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive className="bz5-signs">
      <div className="bz5-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={150}
          phoneColumns={2}
          steps={[
            {
              title: "Jsou z buněk",
              art: <Cells />,
              caption: "Od bakterie po dub.",
            },
            {
              title: "Látková přeměna",
              art: <Metabolism />,
              caption: "Přijímá potravu, zbytky vylučuje.",
            },
            {
              title: "Růst a vývoj",
              art: <Growth />,
              caption: "Ze semene rostlina.",
            },
            {
              title: "Rozmnožování",
              art: <Reproduction />,
              caption: "Z vajec se líhnou mláďata.",
            },
            {
              title: "Dráždivost",
              art: <Response />,
              caption: "Citlivka po dotyku složí lístky.",
            },
            {
              title: "Pohyb",
              art: <Movement />,
              caption: "Ryba plave, rostlina se natáčí.",
            },
            {
              title: "Dědičnost",
              art: <Heredity />,
              caption: "Kotě má kresbu po matce.",
            },
            {
              title: "Jen zdání",
              art: <NotAlive />,
              caption: "Krystal roste, oheň „dýchá“, ale nejsou z buněk.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
