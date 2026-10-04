import { motion } from "motion/react";
import { StepFilm } from "../../sequence/StepFigure";
import { BASE, Draw, Fade, Figure, Frame, Pop, Sign, pat, rng, useFig, Arrow } from "./kit";

const LABEL =
  "PCR a gelová elektroforéza, animace po krocích. 1. Denaturace: při 95 °C se dvoušroubovice DNA rozdělí na dva samostatné řetězce. 2. Nasednutí primerů: při ochlazení na asi 55 °C se krátké primery připojí ke konci hledaného úseku na každém řetězci. 3. Prodlužování: při 72 °C Taq-polymeráza od primerů doplní nové řetězce – z jedné molekuly jsou dvě. 4. Řetězová reakce: každý cyklus počet kopií zdvojnásobí, po 30 cyklech je jich 2 na 30, asi miliarda. 5. Gelová elektroforéza: záporně nabitá DNA putuje gelem ke kladné elektrodě, krátké úseky rychleji než dlouhé; vznikne vzor proužků – DNA otisk. Vzorek ze stopy se shoduje se vzorkem osoby B, nikoli osoby A.";

const W = 440;
const H = 250;
const X0 = 24;
const X1 = 330;
const T0 = 120; // target region
const T1 = 262;
const SEQ = (() => {
  const r = rng(21);
  return Array.from({ length: 40 }, () => "ATGC"[Math.floor(r() * 4)]);
})();
const PAIR: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };

/** one strand with half-rungs pointing up (dir −1) or down (dir 1) */
function Strand({
  y,
  dir,
  comp = false,
  from = X0,
  to = X1,
  cls = "bz4-strand-old",
}: {
  y: number;
  dir: 1 | -1;
  comp?: boolean;
  from?: number;
  to?: number;
  cls?: string;
}) {
  const ticks = [];
  for (let i = 0; X0 + 8 + i * 12 < X1; i++) {
    const x = X0 + 8 + i * 12;
    if (x < from || x > to) continue;
    const b = comp ? PAIR[SEQ[i]] : SEQ[i];
    ticks.push(<line key={i} x1={x} x2={x} y1={y} y2={y + dir * 8} stroke={BASE[b]} className="bz4-rung" />);
  }
  return (
    <g>
      {ticks}
      <path d={`M${from} ${y} H${to}`} className={cls} />
    </g>
  );
}

function Target() {
  return (
    <g>
      <rect x={T0} y={30} width={T1 - T0} height={150} rx={6} className="bz4-pcr-target" />
      <text x={(T0 + T1) / 2} y={24} textAnchor="middle" className="bz4-lbl bz4-sm bz4-lvl-t">
        hledaný úsek
      </text>
    </g>
  );
}

function Thermo({ t, hot }: { t: string; hot: number }) {
  const { id } = useFig();
  const top = 46;
  const bot = 176;
  const lvl = bot - (bot - top) * hot;
  return (
    <g>
      <rect x={384} y={top - 6} width={16} height={bot - top + 10} rx={8} className="bz4-o bz4-fill" />
      <motion.rect
        x={388}
        width={8}
        initial={{ y: bot, height: 0 }}
        animate={{ y: lvl, height: bot - lvl + 4 }}
        transition={{ duration: 0.9 }}
        className="bz4-pcr-hg"
      />
      <circle cx={392} cy={bot + 14} r={13} className="bz4-o bz4-pcr-hg" />
      <circle cx={392} cy={bot + 14} r={13} fill={pat(id, "hi")} opacity={0.5} />
      {[0, 0.25, 0.5, 0.75, 1].map((k) => (
        <line key={k} x1={400} x2={406} y1={bot - (bot - top) * k} y2={bot - (bot - top) * k} className="bz4-o bz4-thin" />
      ))}
      <text x={392} y={top - 14} textAnchor="middle" className="bz4-pcr-temp">
        {t}
      </text>
    </g>
  );
}

function Polymerase({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const d =
    "M-16 -4 C-18 -16 -4 -19 5 -15 C14 -12 17 -4 16 3 C14 12 4 16 -5 15 C-13 13 -15 6 -11 3 C-8 0 -14 2 -16 -4Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d={d} className="bz4-o bz4-protein" />
    </g>
  );
}

const TOP = 72;
const BOT = 156;

function Denature() {
  return (
    <Frame w={W} h={H}>
      <Target />
      <motion.g initial={{ y: (BOT - TOP) / 2 - 8 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
        <Strand y={TOP} dir={1} />
      </motion.g>
      <motion.g initial={{ y: -(BOT - TOP) / 2 + 8 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
        <Strand y={BOT} dir={-1} comp />
      </motion.g>
      <Fade delay={1}>
        <text x={X0} y={214} className="bz4-lbl bz4-sm">
          vodíkové vazby mezi bázemi povolí
        </text>
      </Fade>
      <Thermo t="95 °C" hot={1} />
    </Frame>
  );
}

function Primers({ extend = false }: { extend?: boolean }) {
  return (
    <g>
      {/* primer on the upper template, at the right end of the target, copies leftwards */}
      <Pop delay={extend ? 0 : 0.3}>
        <path d={`M${T1 - 24} ${TOP + 16} H${T1}`} className="bz4-strand-new bz4-pcr-primer" />
      </Pop>
      <Pop delay={extend ? 0 : 0.5}>
        <path d={`M${T0} ${BOT - 16} H${T0 + 24}`} className="bz4-strand-new bz4-pcr-primer" />
      </Pop>
    </g>
  );
}

function Anneal() {
  return (
    <Frame w={W} h={H}>
      <Target />
      <Strand y={TOP} dir={1} />
      <Strand y={BOT} dir={-1} comp />
      <Primers />
      <Fade delay={0.7}>
        <text x={T1 + 6} y={TOP + 38} className="bz4-lbl bz4-sm bz4-b bz4-lvl-t">
          primer
        </text>
        <text x={T0 - 6} y={BOT - 28} textAnchor="end" className="bz4-lbl bz4-sm bz4-b bz4-lvl-t">
          primer
        </text>
        <text x={X0} y={214} className="bz4-lbl bz4-sm">
          krátké primery ohraničí hledaný úsek
        </text>
      </Fade>
      <Thermo t="55 °C" hot={0.45} />
    </Frame>
  );
}

function Extend() {
  return (
    <Frame w={W} h={H}>
      <Target />
      <Strand y={TOP} dir={1} />
      <Strand y={BOT} dir={-1} comp />
      <Primers extend />
      <Draw d={`M${T1 - 24} ${TOP + 16} H${X0}`} className="bz4-strand-new" delay={0.1} />
      <Draw d={`M${T0 + 24} ${BOT - 16} H${X1}`} className="bz4-strand-new" delay={0.1} />
      <Fade delay={1}>
        <Polymerase x={X0 + 6} y={TOP + 8} flip />
        <Polymerase x={X1 - 6} y={BOT - 8} />
        <text x={X0} y={214} className="bz4-lbl bz4-sm">
          Taq-polymeráza doplní nové řetězce: 1 → 2 molekuly
        </text>
      </Fade>
      <Thermo t="72 °C" hot={0.62} />
    </Frame>
  );
}

function Mini({ x, y, top, bot }: { x: number; y: number; top: boolean; bot: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} h30`} className={top ? "bz4-pcr-mini-old" : "bz4-pcr-mini-new"} />
      <path d={`M${x} ${y + 5} h30`} className={bot ? "bz4-pcr-mini-old" : "bz4-pcr-mini-new"} />
    </g>
  );
}

function Doubling() {
  const cols = [1, 2, 4, 8];
  return (
    <Frame w={W} h={H}>
      {cols.map((n, k) => {
        const x = 24 + k * 72;
        return (
          <Pop key={n} delay={0.15 + k * 0.25}>
            <text x={x + 15} y={30} textAnchor="middle" className="bz4-lbl bz4-sm">
              {k === 0 ? "start" : `${k}. cyklus`}
            </text>
            {Array.from({ length: n }, (_, i) => (
              <Mini key={i} x={x} y={52 + i * 17} top={i === 0} bot={i === n - 1} />
            ))}
            <text x={x + 15} y={208} textAnchor="middle" className="bz4-pcr-n">
              {n}
            </text>
          </Pop>
        );
      })}
      {[0, 1, 2].map((k) => (
        <Arrow key={k} d={`M${60 + k * 72} 104 H${92 + k * 72}`} tone="muted" />
      ))}
      <Fade delay={1.1}>
        <text x={W - 16} y={90} textAnchor="end" className="bz4-lbl bz4-b">
          po 30 cyklech
        </text>
        <text x={W - 16} y={118} textAnchor="end" className="bz4-pcr-n">
          2<tspan dy={-9} fontSize="13">30</tspan>
          <tspan dy={9}> ≈ 10</tspan>
          <tspan dy={-9} fontSize="13">9</tspan>
        </text>
        <text x={W - 16} y={144} textAnchor="end" className="bz4-lbl bz4-sm">
          asi miliarda kopií
        </text>
        <text x={W - 16} y={164} textAnchor="end" className="bz4-lbl bz4-sm">
          za dvě hodiny
        </text>
      </Fade>
      <text x={24} y={238} className="bz4-lbl bz4-sm">
        počet kopií (tmavě: původní řetězec)
      </text>
    </Frame>
  );
}

const LANES: [string, number[]][] = [
  ["žebříček", [40, 56, 72, 90, 110, 132, 156]],
  ["stopa", [62, 98, 140]],
  ["osoba A", [52, 84, 122, 150]],
  ["osoba B", [62, 98, 140]],
];

function Gel() {
  const { id } = useFig();
  const gx = 34;
  const lw = 62;
  const gap = 14;
  return (
    <Frame w={W} h={H}>
      <rect x={gx - 10} y={26} width={4 * lw + 3 * gap + 20} height={170} rx={4} className="bz4-o bz4-pcr-gel" />
      <rect x={gx - 10} y={26} width={4 * lw + 3 * gap + 20} height={170} rx={4} fill={pat(id, "dots")} opacity={0.5} />
      <Sign x={gx - 22} y={20} s="−" r={10} />
      <Sign x={gx - 22} y={200} s="+" r={10} />
      {LANES.map(([name, bands], k) => {
        const x = gx + k * (lw + gap);
        const match = k === 1 || k === 3;
        return (
          <g key={name}>
            <rect x={x + 6} y={30} width={lw - 12} height={7} rx={1} className="bz4-o bz4-thin bz4-fill3" />
            {bands.map((b, i) => (
              <motion.rect
                key={i}
                x={x + 6}
                width={lw - 12}
                height={5}
                rx={2}
                initial={{ y: 34, opacity: 0 }}
                animate={{ y: b + 6, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.1 }}
                className={match ? "bz4-pcr-band bz4-pcr-band-m" : "bz4-pcr-band"}
              />
            ))}
            <text x={x + lw / 2} y={218} textAnchor="middle" className={`bz4-lbl bz4-sm ${match ? "bz4-b bz4-lvl-t" : ""}`}>
              {name}
            </text>
          </g>
        );
      })}
      <Arrow d={`M${W - 34} 50 V180`} tone="ink" />
      <text x={W - 44} y={64} textAnchor="end" className="bz4-lbl bz4-sm bz4-pcr-side">
        dlouhé
      </text>
      <text x={W - 44} y={178} textAnchor="end" className="bz4-lbl bz4-sm bz4-pcr-side">
        krátké
      </text>
      <Fade delay={1.2}>
        <text x={W / 2} y={244} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
          stopa = osoba B: shodný DNA otisk
        </text>
      </Fade>
    </Frame>
  );
}

const STEPS = [
  {
    title: "Denaturace (95 °C)",
    caption: "Teplo rozdělí dvoušroubovici DNA na dva samostatné řetězce.",
    art: <Denature />,
  },
  {
    title: "Nasednutí primerů (55 °C)",
    caption: "Při ochlazení se krátké primery připojí na začátek hledaného úseku na každém řetězci.",
    art: <Anneal />,
  },
  {
    title: "Prodlužování (72 °C)",
    caption: "Tepelně odolná Taq-polymeráza od primerů doplní nové řetězce. Z jedné molekuly jsou dvě.",
    art: <Extend />,
  },
  {
    title: "Řetězová reakce",
    caption: "Každý cyklus počet kopií zdvojnásobí: 1, 2, 4, 8… Po 30 cyklech asi miliarda kopií.",
    art: <Doubling />,
  },
  {
    title: "Gelová elektroforéza",
    caption:
      "Záporně nabitá DNA putuje gelem k + elektrodě, krátké úseky rychleji. Vzor proužků je DNA otisk.",
    art: <Gel />,
  },
];

export default function PcrElectrophoresis() {
  return (
    <Figure level={10} label={LABEL} max={620} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
