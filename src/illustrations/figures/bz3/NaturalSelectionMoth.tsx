import { StepFilm } from "../../sequence/StepFigure";
import { Figure, Frame, Pop, f1, pat, rng, useFig } from "./kit";
import { Bird, Moth } from "./bio";

const LABEL =
  "Přírodní výběr u drsnokřídlece březového ve stepech. Na světlé kůře porostlé lišejníky splývají světlí motýli, tmaví jsou nápadní a ptáci je snáze uloví. Když průmyslové saze zčernaly kmeny, byli naopak nápadní světlí motýli a ptáci lovili hlavně je. Tmaví přežívali a měli víc potomků, takže po mnoha generacích tvořili většinu populace. Sloupec vpravo ukazuje podíl světlé a tmavé formy.";

const W = 360;
const H = 250;
const TX = 14; // trunk
const TW = 236;
const TY = 12;
const TH = 226;

type M = { x: number; y: number; dark: boolean; rot: number; eaten?: boolean };

const SPOTS: [number, number, number][] = [
  [52, 46, -14],
  [150, 38, 10],
  [210, 76, -6],
  [92, 92, 18],
  [40, 140, 4],
  [168, 128, -20],
  [118, 168, 8],
  [212, 182, 14],
  [64, 206, -10],
  [160, 214, 0],
];

const moths = (dark: number[], eaten: number[] = []): M[] =>
  SPOTS.map(([x, y, rot], i) => ({
    x,
    y,
    rot,
    dark: dark.includes(i),
    eaten: eaten.includes(i),
  }));

function Bark({ soot }: { soot: boolean }) {
  const { id } = useFig();
  const r = rng(7);
  const furrows: string[] = [];
  for (let i = 0; i < 11; i++) {
    let x = TX + 10 + i * 21 + r() * 6;
    let d = `M${f1(x)} ${TY}`;
    for (let y = TY + 14; y <= TY + TH; y += 14) {
      x += (r() - 0.5) * 7;
      d += ` L${f1(x)} ${y}`;
    }
    furrows.push(d);
  }
  const lichens: string[] = [];
  if (!soot)
    for (let i = 0; i < 16; i++) {
      const cx = TX + 12 + r() * (TW - 24);
      const cy = TY + 10 + r() * (TH - 20);
      const rr = 7 + r() * 9;
      let d = "";
      for (let k = 0; k <= 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const q = rr * (0.7 + r() * 0.45);
        d += `${k ? "L" : "M"}${f1(cx + Math.cos(a) * q)} ${f1(cy + Math.sin(a) * q * 0.8)} `;
      }
      lichens.push(d + "Z");
    }
  return (
    <g>
      <rect x={TX} y={TY} width={TW} height={TH} rx={4} className={soot ? "bz3-bark-soot" : "bz3-bark"} />
      {lichens.map((d, i) => (
        <path key={i} d={d} className="bz3-lichen" />
      ))}
      <path d={furrows.join(" ")} className={soot ? "bz3-furrow bz3-furrow-soot" : "bz3-furrow"} />
      <rect x={TX} y={TY} width={TW} height={TH} rx={4} fill={pat(id, soot ? "dd" : "d")} opacity={soot ? 0.5 : 0.35} />
      <rect x={TX} y={TY} width={TW} height={TH} rx={4} className="bz3-o" />
    </g>
  );
}

function Share({ light }: { light: number }) {
  const x = 266;
  const bw = 30;
  const y0 = 46;
  const h = 170;
  const hl = (h * light) / 100;
  const yd = Math.max(y0 + (h - hl) / 2 + 5, y0 + 12);
  const yl = Math.max(y0 + h - hl / 2 + 5, yd + 18);
  return (
    <g>
      <text x={x + bw / 2} y={y0 - 8} textAnchor="middle" className="bz3-lbl bz3-sm">
        tmaví
      </text>
      <rect x={x} y={y0} width={bw} height={h - hl} className="bz3-share-dark" />
      <rect x={x} y={y0 + h - hl} width={bw} height={hl} className="bz3-share-light" />
      <rect x={x} y={y0} width={bw} height={h} className="bz3-o" />
      <text x={x + bw + 5} y={yd} className="bz3-share-t">
        {100 - light} %
      </text>
      <text x={x + bw + 5} y={yl} className="bz3-share-t">
        {light} %
      </text>
      <text x={x + bw / 2} y={y0 + h + 20} textAnchor="middle" className="bz3-lbl bz3-sm">
        světlí
      </text>
    </g>
  );
}

function Scene({
  soot,
  ms,
  bird,
  light,
}: {
  soot: boolean;
  ms: M[];
  bird?: [number, number, boolean];
  light: number;
}) {
  return (
    <Frame w={W} h={H}>
      <Bark soot={soot} />
      {ms.map((m, i) => (
        <g key={i} opacity={m.eaten ? 0.9 : 1}>
          <Moth x={m.x} y={m.y} dark={m.dark} rot={m.rot} />
          {m.eaten && (
            <Pop delay={0.5 + i * 0.05}>
              <circle cx={m.x} cy={m.y} r={22} className="bz3-eaten" />
              <path
                d={`M${m.x - 12} ${m.y - 12} L${m.x + 12} ${m.y + 12} M${m.x + 12} ${m.y - 12} L${m.x - 12} ${m.y + 12}`}
                className="bz3-eaten-x"
              />
            </Pop>
          )}
        </g>
      ))}
      {bird && (
        <Pop delay={0.2}>
          <Bird x={bird[0]} y={bird[1]} s={1.5} flip={bird[2]} />
        </Pop>
      )}
      <Share light={light} />
    </Frame>
  );
}

export default function NaturalSelectionMoth() {
  return (
    <Figure level={7} label={LABEL} interactive max={620}>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: "Světlá kůra s lišejníky",
            art: <Scene soot={false} ms={moths([3])} light={90} />,
            caption:
              "Světlí drsnokřídlci na lišejnících splývají. Tmavá forma je vzácná a na kůře nápadná.",
          },
          {
            title: "Ptáci loví nápadné",
            art: <Scene soot={false} ms={moths([3], [3])} bird={[128, 64, true]} light={95} />,
            caption:
              "Tmavého motýla pták najde snadno. Přežijí hlavně světlí a předají své alely potomkům.",
          },
          {
            title: "Saze zčernají kmeny",
            art: <Scene soot ms={moths([3, 7])} light={80} />,
            caption:
              "V 19. století průmyslové saze zničily lišejníky a zčernaly kůru. Teď jsou nápadní světlí motýli.",
          },
          {
            title: "Ptáci loví světlé",
            art: (
              <Scene soot ms={moths([3, 7], [1, 4, 5, 8])} bird={[118, 138, false]} light={65} />
            ),
            caption:
              "Ptáci teď chytají hlavně světlé motýly. Tmaví častěji přežijí a mají víc potomků.",
          },
          {
            title: "Po mnoha generacích",
            art: <Scene soot ms={moths([0, 1, 2, 3, 4, 5, 7, 8, 9])} light={10} />,
            caption:
              "Tmavá forma převládla. Když se ve 20. století vyčistilo ovzduší, poměr se zase obrátil.",
          },
        ]}
      />
    </Figure>
  );
}
