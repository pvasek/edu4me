import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, StripBox, rng } from "./kit";

const LABEL =
  "Typy kulturní difuze. Relokační difuze: migranti si kulturu přenesou s sebou do nové oblasti, například Italové pizzu do New Yorku. Expanzní nákazová difuze: novinka se šíří z ohniska do okolí od člověka k člověku jako vlna, například slang nebo virální video. Expanzní hierarchická difuze: novinka se nejdřív ujme v metropoli, pak v krajských městech a nakonec v malých městech, venkov mezi nimi zůstává pozadu, například móda nebo chytré telefony.";

const W = 240;
const H = 200;

function Dot({ x, y, k }: { x: number; y: number; k: 0 | 1 | 2 | 3 }) {
  return <circle cx={x} cy={y} r={4.2} className={`gz7-cd gz7-cd-${k}`} />;
}

function Relocation() {
  const R = rng(7);
  const pts = (x0: number, x1: number, n: number) =>
    Array.from({ length: n }, () => [x0 + R() * (x1 - x0), 56 + R() * 110] as const);
  const home = pts(22, 82, 14);
  const fresh = pts(160, 220, 14);
  return (
    <Frame w={W} h={H} className="gz7-small">
      <rect x={0} y={20} width={W} height={H - 20} rx={8} className="gz7-sea" />
      <path d="M10 36 Q60 26 96 44 Q104 110 92 178 L10 178 Z" className="gz7-land gz7-o" />
      <path d="M146 40 Q190 28 232 38 V178 H150 Q138 110 146 40 Z" className="gz7-land gz7-o" />
      {home.map(([x, y], i) => (
        <Dot key={i} x={x} y={y} k={1} />
      ))}
      {fresh.map(([x, y], i) => (
        <Dot key={i} x={x} y={y} k={y < 120 && x < 196 ? 1 : 0} />
      ))}
      <Arrow d="M84 96 Q120 64 156 90" tone="lvl" className="gz7-mig-thick" />
      <text x={120} y={46} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b gz7-lvl-t gz7-halo">
        migranti
      </text>
      <text x={52} y={196} textAnchor="middle" className="gz7-lbl gz7-sm">
        odkud
      </text>
      <text x={190} y={196} textAnchor="middle" className="gz7-lbl gz7-sm">
        kam
      </text>
    </Frame>
  );
}

function Contagious() {
  const cx = 120;
  const cy = 106;
  const dots: [number, number, 0 | 1 | 2 | 3][] = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 10; c++) {
      const x = 20 + c * 22 + (r % 2) * 11;
      const y = 30 + r * 22;
      if (x > 226) continue;
      const d = Math.hypot(x - cx, y - cy);
      dots.push([x, y, d < 30 ? 1 : d < 58 ? 2 : d < 84 ? 3 : 0]);
    }
  return (
    <Frame w={W} h={H} className="gz7-small">
      {[30, 58, 84].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} className="gz7-o gz7-thin gz7-dash gz7-wave" />
      ))}
      {dots.map(([x, y, k], i) => (
        <Dot key={i} x={x} y={y} k={k} />
      ))}
      <circle cx={cx} cy={cy} r={8} className="gz7-cd gz7-cd-1 gz7-o" />
      <text x={cx + 32} y={cy - 22} className="gz7-num gz7-halo">
        1
      </text>
      <text x={cx + 50} y={cy - 40} className="gz7-num gz7-halo">
        2
      </text>
      <text x={cx + 68} y={cy - 56} className="gz7-num gz7-halo">
        3
      </text>
      <text x={120} y={16} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
        ohnisko a vlny do okolí
      </text>
    </Frame>
  );
}

function Hierarchical() {
  const metro: [number, number] = [120, 46];
  const regional: [number, number][] = [
    [46, 104],
    [120, 112],
    [196, 100],
  ];
  const small: [number, number][] = [
    [22, 162],
    [70, 168],
    [110, 172],
    [150, 166],
    [186, 160],
    [222, 170],
  ];
  const R = rng(3);
  const villages = Array.from({ length: 16 }, () => [14 + R() * 212, 70 + R() * 110] as const).filter(
    ([x, y]) =>
      ![metro, ...regional, ...small].some(([a, b]) => Math.hypot(a - x, b - y) < 20),
  );
  return (
    <Frame w={W} h={H} className="gz7-small">
      {regional.map(([x, y], i) => (
        <Arrow key={i} d={`M${metro[0] + (x - metro[0]) * 0.22} ${metro[1] + 12} L${x + (metro[0] - x) * 0.18} ${y - 14}`} tone="lvl" className="gz7-mig-mid" />
      ))}
      {small.map(([x, y], i) => {
        const [rx, ry] = regional[Math.min(2, Math.floor(i / 2))];
        return <Arrow key={i} d={`M${rx + (x - rx) * 0.25} ${ry + 10} L${x + (rx - x) * 0.18} ${y - 9}`} tone="lvl" className="gz7-mig-thin" />;
      })}
      {villages.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} className="gz7-cd gz7-cd-0" />
      ))}
      <circle cx={metro[0]} cy={metro[1]} r={13} className="gz7-cd gz7-cd-1 gz7-o" />
      {regional.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={9} className="gz7-cd gz7-cd-2 gz7-o" />
      ))}
      {small.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6} className="gz7-cd gz7-cd-3 gz7-o gz7-thin" />
      ))}
      <text x={142} y={42} className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
        metropole
      </text>
      <text x={120} y={16} textAnchor="middle" className="gz7-lbl gz7-sm gz7-muted-t">
        venkov mezi městy čeká
      </text>
    </Frame>
  );
}

export default function CulturalDiffusion() {
  return (
    <Figure level={11} label={LABEL} max={800} interactive boost={false}>
      <StripBox
        label={LABEL}
        note="Barevná tečka = místo, kde se novinka už ujala; čím sytější, tím dřív."
      >
        <StepStrip
          min={200}
          steps={[
            {
              title: "Relokační difuze",
              art: <Relocation />,
              caption:
                "Kulturu si s sebou přenesou migranti: Italové pizzu do New Yorku, Britové angličtinu do Austrálie.",
            },
            {
              title: "Expanzní – nákazová",
              art: <Contagious />,
              caption:
                "Z ohniska do okolí od člověka k člověku, jako vlna: slang, virální video, dříve i nemoci.",
            },
            {
              title: "Expanzní – hierarchická",
              art: <Hierarchical />,
              caption:
                "Shora dolů: metropole → krajská města → malá města. Móda, chytré telefony, nové sporty.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
