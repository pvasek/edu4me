import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Draw, Fade, Figure, Frame, Lbl, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Jak se tělo brání mikrobům, v pěti krocích na řezu kůží. 1 kůže je hradba: bakterie se přes neporušenou kůži nedostanou. 2 rána: poraněnou kůží bakterie proniknou do těla a množí se. 3 bílá krvinka (fagocyt) vyleze z cévy a bakterie pohltí. 4 lymfocyt vyrobí protilátky, které se na bakterie přesně přichytí a označí je. 5 paměť: paměťové buňky si mikroba pamatují, při dalším setkání vznikne protilátek hned hodně. Očkování vytvoří paměť bez nemoci; graf ukazuje malou pomalou odpověď při prvním a velkou rychlou při druhém setkání.";

const W = 360;
const H = 250;
const SKIN = 88;
const EPI = 114;
const CAP = 204;

function Bact({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot})`}>
      <rect x={-8} y={-4} width={16} height={8} rx={4} className="bz1-o bz1-thin bz1-bact" />
      <path d="M8 0 q4 -3 7 0" className="bz1-o bz1-thin" />
    </g>
  );
}

function Ab({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <path
      d="M0 0 V-8 L-5 -14 M0 -8 L5 -14"
      transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})`}
      className="bz1-o bz1-lvl-s"
      style={{ strokeWidth: 2.2 }}
    />
  );
}

function Skin({ cut = false }: { cut?: boolean }) {
  const { id } = useFig();
  const epi = cut
    ? `M0 ${SKIN} H160 L176 ${EPI + 10} L192 ${SKIN} H${W} V${EPI} H0 Z`
    : `M0 ${SKIN} H${W} V${EPI} H0 Z`;
  const cells: string[] = [];
  for (let x = 0; x < W; x += 22) {
    if (cut && x > 150 && x < 196) continue;
    cells.push(`M${x} ${SKIN} V${EPI}`);
  }
  return (
    <g>
      <rect x={0} y={EPI} width={W} height={H - EPI} className="bz1-flesh" />
      <rect x={0} y={EPI} width={W} height={H - EPI} fill={pat(id, "dots")} opacity={0.4} />
      <path d={epi} className="bz1-skin" />
      <path d={epi} fill={pat(id, "d")} opacity={0.6} />
      <path d={`${cells.join(" ")} M0 ${(SKIN + EPI) / 2} H${cut ? 156 : W} ${cut ? `M196 ${(SKIN + EPI) / 2} H${W}` : ""}`} className="bz1-o bz1-thin" style={{ opacity: 0.5 }} />
      <path d={epi} className="bz1-o" />
      {/* capillary with red blood cells */}
      <rect x={-2} y={CAP} width={W + 4} height={26} className="bz1-blood" />
      <path d={`M0 ${CAP} H${W} M0 ${CAP + 26} H${W}`} className="bz1-o" />
      {[20, 70, 120, 230, 280, 330].map((x) => (
        <ellipse key={x} cx={x} cy={CAP + 13} rx={9} ry={5} className="bz1-o bz1-thin bz1-red-fill" />
      ))}
    </g>
  );
}

function Wbc({ x, y, r = 24, children }: { x: number; y: number; r?: number; children?: React.ReactNode }) {
  const pts = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const rr = r + 3 * Math.sin(3 * a) + 2 * Math.cos(5 * a);
    return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`;
  });
  return (
    <g>
      <path d={`M${pts.join(" L")}Z`} className="bz1-o bz1-wbc" style={{ strokeLinejoin: "round" }} />
      <path d={`M${x - r * 0.5} ${y + r * 0.35} q6 -8 12 0 t12 0`} className="bz1-o" style={{ stroke: "var(--violet)", strokeWidth: 5, opacity: 0.6 }} />
      {children}
    </g>
  );
}

function F1() {
  return (
    <Frame w={W} h={H}>
      <Skin />
      {(
        [
          [60, 74, 10],
          [118, 70, -20],
          [214, 76, 5],
          [262, 66, 30],
          [312, 74, -8],
        ] as const
      ).map(([x, y, r], i) => (
        <Pop key={i} delay={0.1 + i * 0.1}>
          <Bact x={x} y={y} rot={r} />
        </Pop>
      ))}
      <Draw d="M150 46 L164 80 L178 50" className="bz1-o bz1-dash" delay={0.1} arrow="ink" />
      <Fade delay={0.7}>
        <text x={14} y={30} className="bz1-lbl bz1-b">
          kůže je hradba
        </text>
        <Lbl x={248} y={34} tx={262} ty={62}>
          bakterie
        </Lbl>
        <Lbl x={14} y={142} tx={40} ty={102}>
          pokožka
        </Lbl>
        <Lbl x={262} y={190} tx={250} ty={CAP + 4} className="bz1-sm" sec>
          céva s krví
        </Lbl>
      </Fade>
    </Frame>
  );
}

const INSIDE: [number, number, number][] = [
  [170, 136, 20],
  [150, 152, -30],
  [192, 152, 60],
  [206, 134, -10],
  [166, 170, 10],
  [222, 166, 40],
];

function F2() {
  return (
    <Frame w={W} h={H}>
      <Skin cut />
      {INSIDE.map(([x, y, r], i) => (
        <Pop key={i} delay={0.2 + i * 0.12}>
          <Bact x={x} y={y} rot={r} />
        </Pop>
      ))}
      <Fade delay={0.5}>
        <text x={14} y={30} className="bz1-lbl bz1-b bz1-red-t">
          rána: bakterie pronikají
        </text>
        <Lbl x={206} y={60} tx={180} ty={94}>
          rána
        </Lbl>
        <Lbl x={250} y={150} tx={228} ty={166} className="bz1-sm">
          {"bakterie\nse množí"}
        </Lbl>
      </Fade>
    </Frame>
  );
}

function F3() {
  return (
    <Frame w={W} h={H}>
      <Skin cut />
      <Bact x={150} y={150} rot={-30} />
      <Bact x={222} y={168} rot={40} />
      <Pop delay={0.2}>
        <Wbc x={186} y={150} r={26}>
          <circle cx={182} cy={142} r={9} className="bz1-o bz1-thin bz1-fill" />
          <Bact x={182} y={142} rot={20} />
          <circle cx={198} cy={156} r={9} className="bz1-o bz1-thin bz1-fill" />
          <Bact x={198} y={156} rot={-15} />
        </Wbc>
      </Pop>
      <Pop delay={0.5}>
        <Wbc x={96} y={CAP - 4} r={18} />
      </Pop>
      <Draw d="M110 186 C120 170 136 162 154 156" className="bz1-o bz1-dash" delay={0.1} arrow="ink" />
      <Fade delay={0.6}>
        <text x={14} y={30} className="bz1-lbl bz1-b">
          bílá krvinka pohlcuje
        </text>
        <Lbl x={250} y={132} tx={208} ty={140} className="bz1-b">
          {"bílá krvinka\n(fagocyt)"}
        </Lbl>
        <Lbl x={14} y={150} tx={84} ty={CAP - 14} className="bz1-sm" sec>
          {"opouští\ncévu"}
        </Lbl>
      </Fade>
    </Frame>
  );
}

function Lympho({ x, y, cls = "bz1-wbc" }: { x: number; y: number; cls?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={17} className={`bz1-o ${cls}`} />
      <circle cx={x + 1} cy={y + 1} r={12} className="bz1-o bz1-thin bz1-nuc" />
    </g>
  );
}

const TAGGED: [number, number, number][] = [
  [196, 140, 20],
  [232, 160, -30],
  [178, 168, 60],
];

function F4() {
  return (
    <Frame w={W} h={H}>
      <Skin cut />
      <Lympho x={84} y={160} />
      {TAGGED.map(([x, y, r], i) => (
        <g key={i}>
          <Bact x={x} y={y} rot={r} />
          <Pop delay={0.4 + i * 0.15}>
            <Ab x={x} y={y - 4} rot={0} />
            <Ab x={x + 3} y={y + 4} rot={160} />
          </Pop>
        </g>
      ))}
      {(
        [
          [118, 140, -60],
          [130, 176, -110],
          [150, 152, -80],
        ] as const
      ).map(([x, y, r], i) => (
        <Pop key={`f${i}`} delay={0.2 + i * 0.1}>
          <Ab x={x} y={y} rot={r} />
        </Pop>
      ))}
      <Fade delay={0.7}>
        <text x={14} y={30} className="bz1-lbl bz1-b">
          protilátky označí bakterie
        </text>
        <Lbl x={14} y={196} tx={76} ty={174} className="bz1-b">
          lymfocyt
        </Lbl>
        <Lbl x={254} y={130} tx={208} ty={134} className="bz1-b bz1-lvl-t">
          protilátky
        </Lbl>
      </Fade>
    </Frame>
  );
}

function F5() {
  const gx = 222;
  const gy = 64;
  const curve = (t0: number, amp: number, w: number) => {
    const pts: string[] = [];
    for (let t = t0; t <= t0 + w; t += 2) {
      const u = (t - t0) / w;
      pts.push(`${f1(gx + t)} ${f1(gy - amp * Math.sin(Math.PI * u) ** 2)}`);
    }
    return "M" + pts.join(" L");
  };
  return (
    <Frame w={W} h={H}>
      <Skin />
      <Lympho x={64} y={160} cls="bz1-lvl-fill" />
      {(
        [
          [190, 150, 10],
          [228, 166, -40],
        ] as const
      ).map(([x, y, r], i) => (
        <g key={i}>
          <Bact x={x} y={y} rot={r} />
          <Ab x={x} y={y - 4} />
          <Ab x={x + 3} y={y + 4} rot={160} />
          <Ab x={x - 9} y={y} rot={-80} />
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Pop key={i} delay={0.2 + i * 0.08}>
          <Ab x={124 + i * 14} y={140 + (i % 2) * 22} rot={-70 - i * 10} />
        </Pop>
      ))}
      {/* syringe: vaccination */}
      <g transform="translate(26 36) rotate(-20)">
        <rect x={0} y={-6} width={40} height={12} rx={2} className="bz1-o bz1-glass" />
        <rect x={4} y={-4} width={20} height={8} className="bz1-lvl-fill" />
        <path d="M40 0 H56 M-10 0 H0 M-10 -7 V7" className="bz1-o" style={{ strokeWidth: 1.6 }} />
      </g>
      <text x={14} y={74} className="bz1-lbl bz1-sm bz1-b">
        očkování
      </text>
      {/* mini graph: antibodies after the 1st and 2nd contact */}
      <Fade delay={0.3}>
        <path d={`M${gx} ${gy} H${gx + 128} M${gx} ${gy} V${gy - 54}`} className="bz1-o bz1-thin" />
        <text x={gx - 4} y={gy - 44} textAnchor="end" className="bz1-lbl bz1-sm">
          {"protilátky"}
        </text>
        <text x={gx + 128} y={gy + 14} textAnchor="end" className="bz1-lbl bz1-sm bz1-muted-t">
          čas
        </text>
      </Fade>
      <Draw d={curve(6, 12, 46)} className="bz1-o bz1-lvl-s" delay={0} style={{ strokeWidth: 2 }} />
      <Draw d={curve(70, 46, 46)} className="bz1-o bz1-lvl-s" delay={0.1} style={{ strokeWidth: 2.6 }} />
      <Fade delay={0.9}>
        <text x={gx + 29} y={gy - 16} textAnchor="middle" className="bz1-eq bz1-eq-sm">
          1.
        </text>
        <text x={gx + 93} y={gy + 14} textAnchor="middle" className="bz1-eq bz1-eq-sm">
          2.
        </text>
        <Lbl x={14} y={197} className="bz1-sm bz1-b bz1-lvl-t">
          {"paměťová buňka"}
        </Lbl>
      </Fade>
      <Arrow d="M64 54 L84 82" tone="lvl" dashed />
    </Frame>
  );
}

export default function ImmuneResponseBasic() {
  return (
    <Figure level={2} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          { title: "Kůže je hradba", caption: "Neporušená kůže bakterie do těla nepustí.", art: <F1 /> },
          { title: "Rána", caption: "Poraněnou kůží bakterie proniknou dovnitř a množí se.", art: <F2 /> },
          { title: "Bílá krvinka", caption: "Fagocyt vyleze z cévy a bakterie pohltí.", art: <F3 /> },
          { title: "Protilátky", caption: "Lymfocyt vyrobí protilátky, které se přichytí jen na tuto bakterii.", art: <F4 /> },
          {
            title: "Paměť a očkování",
            caption: "Paměťové buňky si mikroba pamatují: podruhé je obrana rychlá a silná. Očkování ji naučí bez nemoci.",
            art: <F5 />,
          },
        ]}
      />
    </Figure>
  );
}
