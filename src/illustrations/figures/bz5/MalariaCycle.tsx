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
  f1,
  pat,
  rng,
  useFig,
} from "./kit";

const LABEL =
  "Životní cyklus zimničky, původce malárie, v pěti krocích. 1 bodnutí: samice komára Anopheles bodne člověka a se slinami vpustí do krve zárodky zimničky. 2 játra: zárodky doputují do jater, v jaterní buňce se namnoží na tisíce nových a buňka praskne. 3 krvinky: zimničky napadají červené krvinky, množí se v nich a krvinky hromadně praskají; pokaždé přijde záchvat horečky, každé 2 až 3 dny. 4 pohlavní buňky: některé zimničky se v krvi změní v pohlavní buňky a komár, který nemocného bodne, je nasaje s krví. 5 v komárovi: ve střevě komára se pohlavní buňky spojí, vyvinou se noví zárodci a přesunou se do slinných žláz – při dalším bodnutí se cyklus opakuje.";

const W = 360;
const H = 250;

/** Anopheles female, side view, head at (0, 0), body tilted up (typical posture). */
function Mosquito({
  x,
  y,
  s = 1,
  gut = false,
  bite = false,
}: {
  x: number;
  y: number;
  s?: number;
  gut?: boolean;
  bite?: boolean;
}) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs */}
      <path
        d="M-16 -6 L-30 10 L-34 30 M-12 -4 L-14 14 L-12 30 M-8 -6 L6 8 L18 30 M-20 -10 L-48 4 L-60 30"
        className="bz5-o bz5-thin"
      />
      {/* abdomen tilted up, thorax, head */}
      <path
        d="M-22 -12 C-40 -30 -64 -54 -82 -70 C-88 -74 -92 -68 -86 -62 C-68 -44 -44 -20 -26 -4 Z"
        className="bz5-o bz5-mosq"
      />
      <path
        d="M-22 -12 C-40 -30 -64 -54 -82 -70 C-88 -74 -92 -68 -86 -62 C-68 -44 -44 -20 -26 -4 Z"
        fill={pat(id, "h")}
        opacity={0.6}
      />
      {gut ? (
        <g>
          <path d="M-30 -14 C-46 -28 -62 -44 -74 -58" className="bz5-gut" />
        </g>
      ) : null}
      <ellipse cx={-16} cy={-10} rx={13} ry={10} className="bz5-o bz5-mosq" />
      <circle cx={-2} cy={-4} r={6} className="bz5-o bz5-mosq" />
      {gut && (
        <ellipse
          cx={-14}
          cy={-10}
          rx={5}
          ry={3.4}
          className="bz5-o bz5-thin bz5-gland"
        />
      )}
      <circle cx={0} cy={-6} r={2.6} className="bz5-spot" />
      {/* proboscis and palps, pointing down and forward */}
      <path
        d={bite ? "M2 0 L30 66" : "M2 0 L22 36"}
        className="bz5-o"
        style={{ strokeWidth: 1.6 }}
      />
      <path d="M1 1 L18 30 M-1 2 L14 30" className="bz5-o bz5-thin" />
      <path
        d="M-2 -10 Q6 -24 18 -26 M0 -10 Q10 -20 20 -20"
        className="bz5-o bz5-thin"
      />
      {/* wing with dark spots (Anopheles) */}
      <path
        d="M-18 -18 C-36 -44 -58 -62 -76 -78 C-64 -60 -44 -38 -24 -16 Z"
        className="bz5-o bz5-thin bz5-wing"
      />
      <path
        d="M-36 -36 l3 -3 M-50 -50 l3 -3 M-62 -62 l3 -3"
        className="bz5-o"
        style={{ strokeWidth: 2.4 }}
      />
    </g>
  );
}

/** Skin above, a blood vessel below. */
function Skin({ vessel = 206 }: { vessel?: number }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={0} y={150} width={W} height={H - 150} className="bz5-flesh" />
      <rect x={0} y={150} width={W} height={14} className="bz5-skin" />
      <rect
        x={0}
        y={150}
        width={W}
        height={14}
        fill={pat(id, "d")}
        opacity={0.5}
      />
      <path d={`M0 150 H${W}`} className="bz5-o" />
      <rect x={0} y={vessel - 18} width={W} height={36} className="bz5-blood" />
      <path
        d={`M0 ${vessel - 18} H${W} M0 ${vessel + 18} H${W}`}
        className="bz5-o"
      />
    </g>
  );
}

function Rbc({
  x,
  y,
  ring = false,
  burst = false,
  gam = false,
}: {
  x: number;
  y: number;
  ring?: boolean;
  burst?: boolean;
  gam?: boolean;
}) {
  return (
    <g>
      <ellipse
        cx={x}
        cy={y}
        rx={12}
        ry={8}
        className="bz5-o bz5-thin bz5-red-cell"
        style={burst ? { strokeDasharray: "5 4" } : undefined}
      />
      {!burst && !gam && (
        <ellipse
          cx={x}
          cy={y}
          rx={5}
          ry={3}
          className="bz5-o bz5-thin bz5-blood"
        />
      )}
      {ring && (
        <circle
          cx={x + 3}
          cy={y - 1}
          r={3.4}
          className="bz5-o bz5-plasmo-ring"
        />
      )}
      {gam && (
        <path
          d={`M${x - 8} ${y + 2} Q${x} ${y - 7} ${x + 8} ${y + 2} Q${x} ${y - 2} ${x - 8} ${y + 2} Z`}
          className="bz5-o bz5-thin bz5-plasmo"
        />
      )}
    </g>
  );
}

/** A sickle-shaped sporozoite. */
function Sporo({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <path
      d="M-6 2 Q0 -5 6 2 Q0 -2 -6 2 Z"
      transform={`translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(1.7)`}
      className="bz5-o bz5-thin bz5-plasmo"
    />
  );
}

function S1() {
  return (
    <Frame w={W} h={H}>
      <Skin />
      <Mosquito x={146} y={112} s={1.3} bite />
      <Pop delay={0.4}>
        {[
          [204, 202, 10],
          [224, 214, -20],
          [246, 200, 30],
          [270, 210, 5],
        ].map(([x, y, r], i) => (
          <motion.g
            key={i}
            variants={{
              hidden: { x: -10, opacity: 0 },
              show: {
                x: 0,
                opacity: 1,
                transition: { delay: 0.5 + i * 0.15, duration: 0.5 },
              },
            }}
          >
            <Sporo x={x} y={y} r={r} />
          </motion.g>
        ))}
      </Pop>
      <Fade delay={0.6}>
        <Lbl x={226} y={40} tx={150} ty={102} className="bz5-b">
          {"samice komára\nAnopheles"}
        </Lbl>
        <Lbl
          x={292}
          y={136}
          tx={270}
          ty={206}
          className="bz5-b bz5-plasmo-t bz5-halo"
        >
          {"zárodky\nzimničky"}
        </Lbl>
        <text x={14} y={240} className="bz5-lbl bz5-sm">
          krevní céva
        </text>
        <text
          x={14}
          y={178}
          className="bz5-lbl bz5-sm"
          style={{ opacity: 0.9 }}
        >
          kůže
        </text>
      </Fade>
    </Frame>
  );
}

function Liver() {
  const { id } = useFig();
  const R = rng(11);
  const cells: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++)
      cells.push([40 + c * 52 + (r % 2) * 26, 70 + r * 46]);
  const sick: [number, number] = [170, 116];
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} className="bz5-liver-bg" />
      {cells.map(([x, y], i) => {
        const hex = Array.from({ length: 6 }, (_, k) => {
          const a = (k * Math.PI) / 3 + Math.PI / 6;
          return `${f1(x + Math.cos(a) * 28)} ${f1(y + Math.sin(a) * 26)}`;
        }).join(" L");
        const isSick = Math.abs(x - sick[0]) < 2 && Math.abs(y - sick[1]) < 2;
        if (isSick) return null;
        return (
          <g key={i}>
            <path d={`M${hex}Z`} className="bz5-o bz5-thin bz5-liver" />
            <circle
              cx={x + 2}
              cy={y}
              r={6}
              className="bz5-o bz5-thin bz5-nuc"
            />
          </g>
        );
      })}
      {/* the infected cell, swollen with thousands of new parasites */}
      <circle
        cx={sick[0]}
        cy={sick[1]}
        r={40}
        className="bz5-o bz5-liver"
        style={{ strokeWidth: 2 }}
      />
      <circle
        cx={sick[0]}
        cy={sick[1]}
        r={40}
        fill={pat(id, "d")}
        opacity={0.3}
      />
      <Pop delay={0.3}>
        {Array.from({ length: 60 }, (_, i) => {
          const a = R() * Math.PI * 2;
          const rr = Math.sqrt(R()) * 34;
          return (
            <circle
              key={i}
              cx={f1(sick[0] + Math.cos(a) * rr)}
              cy={f1(sick[1] + Math.sin(a) * rr)}
              r={2.2}
              className="bz5-plasmo-dot"
            />
          );
        })}
      </Pop>
    </g>
  );
}

function S2() {
  return (
    <Frame w={W} h={H}>
      <Liver />
      <Draw
        d="M0 30 C60 30 110 60 132 92"
        className="bz5-o bz5-lvl-s bz5-dash"
        style={{ strokeWidth: 1.8 }}
      />
      <Sporo x={124} y={84} r={50} />
      <Fade delay={0.8}>
        <rect
          x={210}
          y={196}
          width={140}
          height={46}
          rx={8}
          className="bz5-tag"
        />
        <text
          x={280}
          y={215}
          textAnchor="middle"
          className="bz5-lbl bz5-b bz5-plasmo-t"
        >
          tisíce nových
        </text>
        <text x={280} y={233} textAnchor="middle" className="bz5-lbl bz5-sm">
          v jedné buňce
        </text>
        <Lbl x={12} y={232} tx={70} ty={196} className="bz5-b bz5-halo">
          jaterní buňky
        </Lbl>
        <text x={8} y={20} className="bz5-lbl bz5-sm bz5-halo">
          krví do jater
        </text>
      </Fade>
    </Frame>
  );
}

function Fever({ x, y }: { x: number; y: number }) {
  // temperature: a spike every 48 h
  const pts: string[] = [];
  for (let t = 0; t <= 6; t += 0.25) {
    const ph = t % 2;
    const v = ph < 0.4 ? Math.sin((ph / 0.4) * Math.PI) : 0;
    pts.push(`${f1(x + t * 24)} ${f1(y + 44 - v * 36)}`);
  }
  return (
    <g>
      <path d={`M${x} ${y - 6} V${y + 50} H${x + 150}`} className="bz5-o" />
      <Draw d={`M${pts.join(" L")}`} className="bz5-o bz5-fever" delay={0.6} />
      <text x={x + 4} y={y - 10} className="bz5-lbl bz5-sm">
        teplota
      </text>
      <text x={x + 150} y={y + 66} textAnchor="end" className="bz5-lbl bz5-sm">
        dny →
      </text>
    </g>
  );
}

function S3() {
  return (
    <Frame w={W} h={H}>
      <rect x={0} y={150} width={W} height={H - 150} className="bz5-blood" />
      <path d={`M0 150 H${W}`} className="bz5-o" />
      {[
        [30, 190, 0],
        [70, 220, 1],
        [112, 186, 0],
        [196, 222, 1],
        [244, 184, 1],
        [290, 214, 0],
        [330, 186, 1],
      ].map(([x, y, ring], i) => (
        <Rbc key={i} x={x} y={y} ring={!!ring} />
      ))}
      {/* a cell bursting */}
      <Rbc x={156} y={206} burst />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <motion.circle
            key={i}
            r={2.4}
            cx={156}
            cy={206}
            className="bz5-plasmo-dot"
            variants={{
              hidden: { x: 0, y: 0 },
              show: {
                x: Math.cos(a) * 22,
                y: Math.sin(a) * 15,
                transition: { duration: 0.8, delay: 0.3 },
              },
            }}
          />
        );
      })}
      <Fade delay={0.4}>
        <Fever x={186} y={30} />
        <text x={14} y={46} className="bz5-lbl bz5-b">
          krvinky praskají
        </text>
        <text x={14} y={66} className="bz5-lbl bz5-sm">
          všechny naráz,
        </text>
        <text x={14} y={84} className="bz5-lbl bz5-sm">
          každé 2–3 dny
        </text>
        <text x={14} y={110} className="bz5-lbl bz5-b bz5-red-t">
          → záchvat horečky
        </text>
        <Lbl
          x={236}
          y={140}
          tx={247}
          ty={183}
          className="bz5-sm bz5-plasmo-t"
          sec
        >
          zimnička v krvince
        </Lbl>
      </Fade>
    </Frame>
  );
}

function S4() {
  return (
    <Frame w={W} h={H}>
      <Skin />
      <Rbc x={40} y={206} />
      <Rbc x={80} y={208} gam />
      <Rbc x={124} y={204} />
      <Rbc x={250} y={206} gam />
      <Rbc x={296} y={208} />
      <Rbc x={336} y={204} gam />
      <Mosquito x={166} y={112} s={1.3} bite />
      <DrawArrow d="M222 186 L212 158" tone="lvl" delay={0.5} />
      <Fade delay={0.6}>
        <Lbl x={240} y={44} tx={162} ty={100} className="bz5-b">
          {"další komár\nsaje krev"}
        </Lbl>
        <Lbl
          x={252}
          y={136}
          tx={252}
          ty={204}
          className="bz5-b bz5-plasmo-t bz5-halo"
        >
          {"pohlavní buňky\nzimničky"}
        </Lbl>
      </Fade>
    </Frame>
  );
}

function S5() {
  return (
    <Frame w={W} h={H}>
      <Mosquito x={250} y={150} s={1.9} gut />
      {/* gametes meeting in the gut, cysts on its wall, sporozoites moving to the glands */}
      <Pop delay={0.2}>
        <circle cx={128} cy={58} r={5} className="bz5-o bz5-thin bz5-plasmo" />
        <circle cx={142} cy={66} r={4} className="bz5-o bz5-thin bz5-plasmo" />
        <circle
          cx={160}
          cy={94}
          r={7}
          className="bz5-o bz5-thin bz5-plasmo-cyst"
        />
        <circle
          cx={178}
          cy={110}
          r={7}
          className="bz5-o bz5-thin bz5-plasmo-cyst"
        />
      </Pop>
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          variants={{
            hidden: { x: 0, y: 0, opacity: 0 },
            show: {
              x: 30,
              y: 16,
              opacity: 1,
              transition: { delay: 0.5 + i * 0.2, duration: 0.8 },
            },
          }}
        >
          <Sporo x={186 + i * 4} y={112 + i * 3} r={30} />
        </motion.g>
      ))}
      <Fade delay={0.7}>
        <Lbl x={196} y={30} tx={136} ty={62} className="bz5-b">
          {"střevo: pohlavní\nbuňky se spojí"}
        </Lbl>
        <Lbl x={14} y={178} tx={222} ty={132} className="bz5-b bz5-plasmo-t">
          {"slinné žlázy:\nnoví zárodci"}
        </Lbl>
        <text
          x={W / 2}
          y={244}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-lvl-t"
        >
          ↻ při dalším bodnutí znovu do člověka
        </text>
      </Fade>
    </Frame>
  );
}

export default function MalariaCycle() {
  return (
    <Figure level={2} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: "Bodnutí komára",
            caption:
              "Samice komára Anopheles vpustí se slinami do krve zárodky zimničky.",
            art: <S1 />,
          },
          {
            title: "Játra",
            caption:
              "V jaterní buňce se zimnička namnoží na tisíce nových, pak buňka praskne.",
            art: <S2 />,
          },
          {
            title: "Červené krvinky",
            caption:
              "Zimničky se množí v krvinkách; ty hromadně praskají a přijde horečka.",
            art: <S3 />,
          },
          {
            title: "Pohlavní buňky",
            caption:
              "Některé zimničky se změní v pohlavní buňky a další komár je nasaje.",
            art: <S4 />,
          },
          {
            title: "V komárovi",
            caption:
              "Ve střevě komára se spojí, noví zárodci putují do slinných žláz – a kruh se uzavírá.",
            art: <S5 />,
          },
        ]}
      />
    </Figure>
  );
}
