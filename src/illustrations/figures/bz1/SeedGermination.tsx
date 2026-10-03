import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Body, Draw, Fade, Figure, Frame, Lbl, Pop, ell, pat, useFig } from "./kit";

const LABEL =
  "Klíčení semene fazole ve čtyřech krocích. Semeno potřebuje vodu, teplo a vzduch (kyslík), světlo zatím ne. 1 semeno nasaje vodu a nabobtná, osemení praskne. 2 první vyroste kořínek a roste dolů za vodou. 3 klíček se ohnutý jako háček prodírá půdou nahoru ke světlu. 4 nad zemí se rozevřou dva děložní lístky se zásobou živin a mezi nimi první pravé listy, které začnou fotosyntézu.";

const W = 340;
const H = 268;
const GY = 128;
const SX = 232;
const SY = 176;

function Conditions() {
  return (
    <g>
      <path d="M26 22 C26 22 16 34 16 41 A10 10 0 0 0 36 41 C36 34 26 22 26 22 Z" className="bz1-o bz1-water" />
      <text x={26} y={70} textAnchor="middle" className="bz1-lbl bz1-sm">
        voda
      </text>
      <rect x={70} y={20} width={8} height={26} rx={4} className="bz1-o bz1-fill" />
      <circle cx={74} cy={50} r={7} className="bz1-o bz1-red-fill" />
      <path d="M74 50 V30" className="bz1-o" style={{ stroke: "var(--bad)", strokeWidth: 3 }} />
      <text x={74} y={70} textAnchor="middle" className="bz1-lbl bz1-sm">
        teplo
      </text>
      <path d="M106 32 H124 Q132 32 132 26 Q132 20 126 20 M106 42 H136 Q144 42 144 48 Q144 54 138 54 M110 37 H128" className="bz1-o" style={{ stroke: "var(--blue)", strokeWidth: 1.8 }} />
      <text x={125} y={70} textAnchor="middle" className="bz1-lbl bz1-sm">
        vzduch
      </text>
    </g>
  );
}

function Scene({ children }: { children: React.ReactNode }) {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <rect x={6} y={GY} width={W - 12} height={H - GY - 6} rx={4} className="bz1-soil" />
      <rect x={6} y={GY} width={W - 12} height={H - GY - 6} rx={4} fill={pat(id, "dots")} />
      <path d={`M6 ${GY} H${W - 6}`} className="bz1-o" />
      <Conditions />
      {children}
    </Frame>
  );
}

const SEED = (rx: number, ry: number) =>
  `M${SX - rx} ${SY} C${SX - rx} ${SY - ry * 1.3} ${SX + rx} ${SY - ry * 1.3} ${SX + rx} ${SY} C${SX + rx} ${SY + ry} ${SX + rx * 0.3} ${SY + ry} ${SX} ${SY + ry * 0.55} C${SX - rx * 0.3} ${SY + ry} ${SX - rx} ${SY + ry} ${SX - rx} ${SY} Z`;

function Seed({ rx = 22, ry = 15, split = false }: { rx?: number; ry?: number; split?: boolean }) {
  return (
    <g>
      <Body d={SEED(rx, ry)} fill="bz1-shell" hatch="d" hatchOpacity={0.5} />
      {split && <path d={`M${SX - rx + 6} ${SY - 2} Q${SX} ${SY - 8} ${SX + rx - 6} ${SY - 2}`} className="bz1-o" />}
      <ellipse cx={SX + 2} cy={SY + ry * 0.35} rx={3} ry={1.8} className="bz1-o bz1-thin bz1-fill3" />
    </g>
  );
}

function Root({ len, laterals = false }: { len: number; laterals?: boolean }) {
  const y0 = SY + 8;
  return (
    <g>
      <path d={`M${SX} ${y0} C${SX - 4} ${y0 + len * 0.4} ${SX + 4} ${y0 + len * 0.7} ${SX} ${y0 + len}`} className="bz1-o" style={{ strokeWidth: 2.6, stroke: "color-mix(in srgb, var(--yellow) 50%, var(--ink))" }} />
      {laterals && (
        <path
          d={`M${SX} ${y0 + 24} Q${SX - 14} ${y0 + 30} ${SX - 26} ${y0 + 44} M${SX + 1} ${y0 + 32} Q${SX + 14} ${y0 + 38} ${SX + 24} ${y0 + 52} M${SX} ${y0 + 50} L${SX - 14} ${y0 + 66}`}
          className="bz1-o"
          style={{ strokeWidth: 1.4 }}
        />
      )}
      <path d={`M${SX - 4} ${y0 + len - 18} l-5 -2 M${SX + 4} ${y0 + len - 22} l5 -2 M${SX - 3} ${y0 + len - 30} l-5 -2 M${SX + 3} ${y0 + len - 12} l5 -2`} className="bz1-o bz1-thin" />
    </g>
  );
}

function S1() {
  return (
    <Scene>
      <Pop delay={0.2}>
        <Seed rx={24} ry={16} />
      </Pop>
      {[
        [SX - 52, SY - 18],
        [SX + 52, SY - 10],
        [SX - 44, SY + 26],
        [SX + 44, SY + 30],
      ].map(([x, y], i) => (
        <Arrow key={i} d={`M${x} ${y} L${x + (SX - x) * 0.4} ${y + (SY - y) * 0.4}`} tone="blue" />
      ))}
      <Fade delay={0.5}>
        <Lbl x={W - 14} y={GY + 108} anchor="end" className="bz1-b">
          nasaje vodu a nabobtná
        </Lbl>
        <Lbl x={SX - 34} y={GY - 12} tx={SX - 6} ty={SY - 16} anchor="end">
          semeno
        </Lbl>
      </Fade>
    </Scene>
  );
}

function S2() {
  return (
    <Scene>
      <Draw d={`M${SX} ${SY + 8} C${SX - 4} ${SY + 30} ${SX + 4} ${SY + 50} ${SX} ${SY + 70}`} className="bz1-o" delay={0.1} style={{ strokeWidth: 2.6 }} />
      <Fade delay={0.8}>
        <Root len={62} />
      </Fade>
      <Seed rx={26} ry={17} split />
      <Fade delay={0.6}>
        <Lbl x={SX - 40} y={SY + 66} tx={SX - 2} ty={SY + 52} anchor="end" className="bz1-b">
          kořínek roste dolů
        </Lbl>
      </Fade>
    </Scene>
  );
}

function S3() {
  return (
    <Scene>
      <Root len={78} laterals />
      <Draw d={`M${SX - 6} ${SY - 10} C${SX - 10} ${SY - 40} ${SX - 14} ${GY - 4} ${SX - 2} ${GY - 16} C${SX + 6} ${GY - 22} ${SX + 14} ${GY - 18} ${SX + 14} ${GY - 6}`} className="bz1-o bz1-lvl-s" delay={0.1} style={{ strokeWidth: 5 }} />
      <Seed rx={26} ry={17} split />
      <Fade delay={0.8}>
        <Lbl x={SX - 34} y={GY - 34} tx={SX - 6} ty={GY - 16} anchor="end" className="bz1-b">
          {"klíček se prodírá\nk světlu (háček)"}
        </Lbl>
      </Fade>
    </Scene>
  );
}

function Cotyledon({ side }: { side: 1 | -1 }) {
  return (
    <g transform={`translate(${SX} ${GY - 58}) scale(${side} 1)`}>
      <Body d="M0 0 C10 -14 32 -16 40 -4 C34 8 14 10 0 0 Z" fill="bz1-leaf2" hatch="d" hatchOpacity={0.4} />
    </g>
  );
}

function TrueLeaf({ side }: { side: 1 | -1 }) {
  return (
    <g transform={`translate(${SX} ${GY - 92}) scale(${side} 1) rotate(-30)`}>
      <Body d={ell(16, 0, 16, 8)} fill="bz1-leaf" />
      <path d="M2 0 H30" className="bz1-o bz1-thin" />
    </g>
  );
}

function S4() {
  return (
    <Scene>
      <Root len={86} laterals />
      <path d={`M${SX} ${SY + 8} C${SX - 4} ${GY} ${SX + 2} ${GY - 50} ${SX} ${GY - 92}`} className="bz1-o bz1-lvl-s" style={{ strokeWidth: 5 }} />
      <Pop delay={0.2}>
        <Cotyledon side={-1} />
        <Cotyledon side={1} />
      </Pop>
      <Pop delay={0.5}>
        <TrueLeaf side={-1} />
        <TrueLeaf side={1} />
      </Pop>
      <Fade delay={0.8}>
        <Lbl x={W - 12} y={GY - 26} tx={SX + 34} ty={GY - 62} anchor="end" className="bz1-sm bz1-b">
          {"děložní\nlístky"}
        </Lbl>
        <Lbl x={W - 12} y={GY - 110} tx={SX + 26} ty={GY - 104} anchor="end" className="bz1-sm bz1-b bz1-lvl-t">
          {"první\nlisty"}
        </Lbl>
      </Fade>
    </Scene>
  );
}

export default function SeedGermination() {
  return (
    <Figure level={3} label={LABEL} max={540} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          { title: "Semeno bobtná", caption: "Ke klíčení stačí voda, teplo a vzduch. Semeno nasaje vodu a osemení praskne.", art: <S1 /> },
          { title: "Kořínek", caption: "Jako první vyroste kořínek a míří dolů za vodou.", art: <S2 /> },
          { title: "Klíček", caption: "Stonek se ohnutý jako háček prodírá půdou ke světlu.", art: <S3 /> },
          { title: "První listy", caption: "Nad zemí se rozevřou děložní lístky a první pravé listy začnou fotosyntézu.", art: <S4 /> },
        ]}
      />
    </Figure>
  );
}
