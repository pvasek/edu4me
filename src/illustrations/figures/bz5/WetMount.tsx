import { motion } from "motion/react";
import { StepFilm } from "../../sequence/StepFigure";
import {
  DrawArrow,
  Draw,
  Fade,
  Figure,
  Frame,
  Lbl,
  Pop,
  pat,
  rng,
  f1,
  useFig,
} from "./kit";

const LABEL =
  "Příprava vodního preparátu z pokožky cibule v pěti krocích. 1 kapka vody: kapátkem kápneme vodu doprostřed podložního sklíčka. 2 pokožka: z vnitřní strany šupiny cibule sloupneme pinzetou tenkou průhlednou blanku a vložíme ji do kapky. 3 krycí sklíčko: přiložíme ho šikmo k okraji kapky a pomalu spouštíme preparační jehlou, aby pod ním nezůstaly bubliny. 4 obarvení: ke kraji krycího sklíčka kápneme Lugolův roztok a filtrační papír na druhé straně ho natáhne pod sklíčko. 5 pozorování: v mikroskopu uvidíme řady obdélníkových buněk s buněčnou stěnou a hnědě obarveným jádrem.";

const W = 360;
const H = 240;
const SY = 186; // top of the slide

function Slide() {
  const { id } = useFig();
  return (
    <g>
      <rect x={24} y={SY} width={312} height={11} className="bz5-glass" />
      <rect
        x={24}
        y={SY}
        width={312}
        height={11}
        fill={pat(id, "hi")}
        opacity={0.5}
      />
      <rect x={24} y={SY} width={312} height={11} className="bz5-o" />
    </g>
  );
}

const DROP = `M138 ${SY} Q140 ${SY - 18} 180 ${SY - 19} Q220 ${SY - 18} 222 ${SY} Z`;
const FILM = `M152 ${SY - 5} q14 -4 28 0 t28 0`;

function Drop({ film = false }: { film?: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <path d={DROP} className="bz5-water" />
      <path d={DROP} fill={pat(id, "h")} opacity={0.6} />
      <path d={DROP} className="bz5-o bz5-thin" />
      {film && (
        <path
          d={FILM}
          className="bz5-o bz5-onion-skin"
          style={{ strokeWidth: 2.4 }}
        />
      )}
    </g>
  );
}

/** Glass dropper with its rubber bulb; the tip at (x, y). */
function Dropper({
  x,
  y,
  stain = false,
}: {
  x: number;
  y: number;
  stain?: boolean;
}) {
  const { id } = useFig();
  return (
    <g>
      <path
        d={`M${x - 5} ${y - 74} V${y - 10} L${x - 1.6} ${y} H${x + 1.6} L${x + 5} ${y - 10} V${y - 74} Z`}
        className="bz5-glass"
      />
      {stain && (
        <path
          d={`M${x - 4} ${y - 34} V${y - 10} L${x - 1.2} ${y - 1} H${x + 1.2} L${x + 4} ${y - 10} V${y - 34} Z`}
          className="bz5-lugol"
        />
      )}
      <path
        d={`M${x - 5} ${y - 74} V${y - 10} L${x - 1.6} ${y} H${x + 1.6} L${x + 5} ${y - 10} V${y - 74} Z`}
        className="bz5-o"
      />
      <path
        d={`M${x - 8} ${y - 74} Q${x - 10} ${y - 110} ${x} ${y - 112} Q${x + 10} ${y - 110} ${x + 8} ${y - 74} Z`}
        className="bz5-o bz5-bulb"
      />
      <path
        d={`M${x - 8} ${y - 74} Q${x - 10} ${y - 110} ${x} ${y - 112} Q${x + 10} ${y - 110} ${x + 8} ${y - 74} Z`}
        fill={pat(id, "d")}
        opacity={0.5}
      />
    </g>
  );
}

const fall = (dy: number) => ({
  hidden: { y: -dy, opacity: 0 },
  show: {
    y: 0,
    opacity: [0, 1, 1, 0],
    transition: { duration: 0.7, delay: 0.2, ease: "easeIn" as const },
  },
});

function S1() {
  return (
    <Frame w={W} h={H}>
      <Slide />
      <Dropper x={180} y={112} />
      <motion.g variants={fall(40)}>
        <ellipse
          cx={180}
          cy={SY - 26}
          rx={4}
          ry={5.5}
          className="bz5-water bz5-o bz5-thin"
        />
      </motion.g>
      <Pop delay={0.8}>
        <Drop />
      </Pop>
      <Fade delay={0.6}>
        <Lbl x={120} y={52} tx={172} ty={40} anchor="end" className="bz5-b">
          kapátko
        </Lbl>
        <Lbl x={262} y={150} tx={208} ty={SY - 10} className="bz5-b bz5-blue-t">
          kapka vody
        </Lbl>
        <text x={180} y={224} textAnchor="middle" className="bz5-lbl">
          podložní sklíčko
        </text>
      </Fade>
    </Frame>
  );
}

/** A piece of onion scale with its thin inner skin peeling off. */
function Scale() {
  const { id } = useFig();
  const d = "M22 58 Q70 22 128 40 L124 60 Q72 46 28 78 Z";
  return (
    <g>
      <path d={d} className="bz5-onion" />
      <path d={d} fill={pat(id, "d")} opacity={0.5} />
      <path d={d} className="bz5-o" />
      <path
        d="M36 66 Q74 40 118 50"
        className="bz5-o bz5-thin"
        style={{ opacity: 0.6 }}
      />
    </g>
  );
}

/** Tweezers whose tips meet at (x, y). */
function Tweezers({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path
        d="M0 0 L54 -10 L96 -14 L96 -8 L54 -4 Z"
        className="bz5-o bz5-fill3"
      />
      <path d="M0 0 L54 4 L96 4 L96 -2 L54 -1 Z" className="bz5-o bz5-fill2" />
    </g>
  );
}

function S2() {
  return (
    <Frame w={W} h={H}>
      <Slide />
      <Scale />
      <Drop />
      <Draw
        d="M124 62 Q150 80 176 118"
        className="bz5-o bz5-onion-skin bz5-dash"
        style={{ strokeWidth: 1.4 }}
      />
      <Pop delay={0.5}>
        <path
          d={FILM}
          className="bz5-o bz5-onion-skin"
          style={{ strokeWidth: 2.4 }}
        />
        <Tweezers x={210} y={SY - 7} rot={-28} />
      </Pop>
      <Fade delay={0.7}>
        <Lbl x={30} y={110} tx={60} ty={60} className="bz5-b">
          {"šupina\ncibule"}
        </Lbl>
        <Lbl x={92} y={156} tx={156} ty={SY - 6} anchor="end" className="bz5-b">
          tenká pokožka
        </Lbl>
        <Lbl x={300} y={118} tx={270} ty={152} className="bz5-sm">
          pinzeta
        </Lbl>
        <text x={180} y={224} textAnchor="middle" className="bz5-lbl bz5-sm">
          z vnitřní strany šupiny, průhledná jako papír na pečení
        </text>
      </Fade>
    </Frame>
  );
}

/** Cover slip leaning from the left edge of the drop. */
function CoverSlip({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${-angle} 136 ${SY})`}>
      <rect
        x={136}
        y={SY - 3.4}
        width={86}
        height={3.4}
        className="bz5-glass"
      />
      <rect
        x={136}
        y={SY - 3.4}
        width={86}
        height={3.4}
        className="bz5-o bz5-thin"
      />
    </g>
  );
}

function S3() {
  return (
    <Frame w={W} h={H}>
      <Slide />
      <Drop film />
      <path
        d={`M134 ${SY} Q131 ${SY - 6} 140 ${SY - 12}`}
        className="bz5-o bz5-thin bz5-blue-s"
      />
      <motion.g
        variants={{
          hidden: { rotate: 12, opacity: 0 },
          show: {
            rotate: 0,
            opacity: 1,
            transition: { duration: 1, ease: "easeOut" },
          },
        }}
        style={{
          originX: "136px",
          originY: `${SY}px`,
          transformBox: "view-box",
        }}
      >
        <CoverSlip angle={38} />
        {/* dissecting needle under the far edge */}
        <path
          d="M206 132 L288 84"
          className="bz5-o"
          style={{ strokeWidth: 1.4 }}
        />
        <rect
          x={282}
          y={70}
          width={44}
          height={10}
          rx={4}
          transform="rotate(-30 288 84)"
          className="bz5-o bz5-fill3"
        />
      </motion.g>
      <DrawArrow d="M232 112 Q250 150 238 178" tone="lvl" delay={0.9} />
      <Fade delay={0.6}>
        <Lbl x={76} y={86} tx={168} ty={160} className="bz5-b" anchor="middle">
          krycí sklíčko
        </Lbl>
        <Lbl
          x={316}
          y={124}
          tx={268}
          ty={96}
          anchor="middle"
          className="bz5-sm"
        >
          {"preparační\njehla"}
        </Lbl>
        <text x={252} y={166} className="bz5-lbl bz5-sm bz5-lvl-t">
          pomalu
        </text>
        <text x={180} y={224} textAnchor="middle" className="bz5-lbl bz5-sm">
          voda vytlačí vzduch, pod sklíčkem nezůstanou bubliny
        </text>
      </Fade>
    </Frame>
  );
}

const LAYER = `M134 ${SY} V${SY - 4} H226 V${SY} Z`;

function Mounted() {
  const { id } = useFig();
  return (
    <g>
      <path d={LAYER} className="bz5-water" />
      <path d={LAYER} fill={pat(id, "h")} opacity={0.6} />
      <path
        d={`M148 ${SY - 2} H212`}
        className="bz5-o bz5-onion-skin"
        style={{ strokeWidth: 1.6 }}
      />
      <rect
        x={130}
        y={SY - 7.4}
        width={100}
        height={3.4}
        className="bz5-glass"
      />
      <rect
        x={130}
        y={SY - 7.4}
        width={100}
        height={3.4}
        className="bz5-o bz5-thin"
      />
    </g>
  );
}

function S4() {
  return (
    <Frame w={W} h={H}>
      <Slide />
      <Mounted />
      <motion.rect
        x={134}
        y={SY - 4}
        width={92}
        height={4}
        className="bz5-lugol"
        variants={{
          hidden: { scaleX: 0 },
          show: {
            scaleX: 1,
            transition: { duration: 1.1, delay: 0.5, ease: "easeInOut" },
          },
        }}
        style={{ originX: 0, transformBox: "fill-box" }}
      />
      <Dropper x={124} y={SY - 14} stain />
      <ellipse
        cx={128}
        cy={SY - 3}
        rx={5}
        ry={3}
        className="bz5-lugol bz5-o bz5-thin"
      />
      {/* filter paper strip */}
      <path
        d={`M228 ${SY - 1} L300 ${SY - 30} L310 ${SY - 22} L234 ${SY + 1} Z`}
        className="bz5-o bz5-paper"
      />
      <DrawArrow d={`M140 ${SY + 26} H222`} tone="lvl" delay={0.4} />
      <Fade delay={0.6}>
        <Lbl
          x={80}
          y={60}
          tx={118}
          ty={70}
          anchor="end"
          className="bz5-b bz5-lugol-t"
        >
          {"Lugolův\nroztok"}
        </Lbl>
        <Lbl
          x={300}
          y={128}
          tx={284}
          ty={SY - 22}
          anchor="middle"
          className="bz5-b"
        >
          {"filtrační\npapír"}
        </Lbl>
        <text x={180} y={234} textAnchor="middle" className="bz5-lbl bz5-sm">
          papír nasaje vodu a barvivo se natáhne pod sklíčko
        </text>
      </Fade>
    </Frame>
  );
}

const VX = 292;
const VY = 96;
const VR = 60;
/** The field of view: stained onion epidermis, a brick wall of long cells. */
const CELLS = (() => {
  const R = rng(7);
  const out: { x: number; y: number; nx: number; ny: number; k: string }[] = [];
  const cw = 62;
  const ch = 22;
  for (let row = -4; row <= 4; row++) {
    const off = (row % 2) * (cw / 2);
    for (let col = -3; col <= 3; col++) {
      const x = VX + col * cw + off - cw / 2;
      const y = VY + row * ch - ch / 2;
      out.push({
        x,
        y,
        nx: x + cw * (0.3 + R() * 0.4),
        ny: y + ch * (0.35 + R() * 0.3),
        k: `${row}/${col}`,
      });
    }
  }
  return out;
})();
const NUC = CELLS.find((c) => c.k === "-1/0")!;

function View() {
  const { id } = useFig();
  return (
    <g>
      <clipPath id={`${id}-view`}>
        <circle cx={VX} cy={VY} r={VR} />
      </clipPath>
      <circle cx={VX} cy={VY} r={VR} className="bz5-fill" />
      <g clipPath={`url(#${id}-view)`}>
        {CELLS.map((c) => (
          <g key={c.k}>
            <rect
              x={f1(c.x)}
              y={f1(c.y)}
              width={62}
              height={22}
              className="bz5-o bz5-onion-cell"
              style={{ strokeWidth: 1.6 }}
            />
            <ellipse
              cx={f1(c.nx)}
              cy={f1(c.ny)}
              rx={5}
              ry={3.6}
              className="bz5-o bz5-thin bz5-lugol-nuc"
            />
          </g>
        ))}
      </g>
      <circle
        cx={VX}
        cy={VY}
        r={VR}
        className="bz5-o"
        style={{ strokeWidth: 3 }}
      />
    </g>
  );
}

function S5() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <Slide />
      <Mounted />
      <rect x={134} y={SY - 4} width={92} height={4} className="bz5-lugol" />
      {/* objective above the slide */}
      <path
        d="M160 58 H200 V118 L194 132 H166 L160 118 Z"
        className="bz5-o bz5-fill2"
      />
      <path
        d="M160 58 H200 V118 L194 132 H166 L160 118 Z"
        fill={pat(id, "v")}
        opacity={0.5}
      />
      <path
        d="M160 92 H200"
        className="bz5-o bz5-lvl-s"
        style={{ strokeWidth: 2.6 }}
      />
      <ellipse cx={180} cy={132} rx={12} ry={2.5} className="bz5-o bz5-glass" />
      <Draw
        d={`M180 ${SY + 10} V140`}
        className="bz5-o bz5-lvl-s bz5-dash"
        delay={0.1}
        style={{ strokeWidth: 2 }}
      />
      <Pop delay={0.3}>
        <path
          d="M200 70 L246 54 M200 120 L246 138"
          className="bz5-o bz5-thin bz5-dash"
        />
        <View />
      </Pop>
      <Fade delay={0.7}>
        <Lbl x={146} y={50} tx={162} ty={70} anchor="end" className="bz5-b">
          objektiv
        </Lbl>
        <line
          x1={NUC.nx}
          y1={NUC.ny}
          x2={VX + 4}
          y2={VY - 36}
          className="bz5-lead"
        />
        <text x={VX + 6} y={VY - 38} className="bz5-lbl bz5-b bz5-halo">
          jádro
        </text>
        <text
          x={VX}
          y={VY + 40}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b bz5-halo"
        >
          buněčná stěna
        </text>
        <text x={120} y={150} textAnchor="end" className="bz5-eq bz5-eq-lg">
          100×
        </text>
        <text x={120} y={168} textAnchor="end" className="bz5-lbl bz5-sm">
          zvětšení
        </text>
      </Fade>
    </Frame>
  );
}

export default function WetMount() {
  return (
    <Figure level={1} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: "Kapka vody",
            caption:
              "Doprostřed podložního sklíčka kápni kapku vody, aby vzorek nevyschl.",
            art: <S1 />,
          },
          {
            title: "Tenká pokožka",
            caption:
              "Pinzetou sloupni z šupiny cibule tenkou blanku: jen tenkou vrstvou projde světlo.",
            art: <S2 />,
          },
          {
            title: "Krycí sklíčko šikmo",
            caption:
              "Přilož ho šikmo k okraji kapky a pomalu spouštěj, aby pod ním nezůstaly bubliny.",
            art: <S3 />,
          },
          {
            title: "Obarvení",
            caption:
              "Kapku Lugolova roztoku natáhne pod sklíčko filtrační papír, který zároveň odsaje přebytečnou vodu.",
            art: <S4 />,
          },
          {
            title: "Pozorování",
            caption:
              "Začni nejmenším objektivem. Uvidíš řady obdélníkových buněk s hnědými jádry.",
            art: <S5 />,
          },
        ]}
      />
    </Figure>
  );
}
