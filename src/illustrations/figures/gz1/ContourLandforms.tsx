import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, StripBox, pat, useFig } from "./kit";

const LABEL =
  "Tvary terénu a jejich vrstevnice, ke každému malý náčrt. Vrchol: soustředné uzavřené vrstevnice, nejvyšší uprostřed. Hřbet: vrstevnice prohnuté ve tvaru písmene U směrem dolů po svahu. Údolí: vrstevnice prohnuté do tvaru V proti proudu potoka. Sedlo: nejnižší místo mezi dvěma vrcholy, vrstevnice tvoří tvar přesýpacích hodin. Strmý svah má vrstevnice hustě u sebe, mírný svah daleko od sebe.";

const W = 220;
const H = 268;
const T = 122; // top of the contour box
const B = 262; // bottom

function Sketch({ d, rings = [] as string[] }: { d: string; rings?: string[] }) {
  const { id } = useFig();
  return (
    <g>
      <path d={d} className="gz1-meadow" />
      <path d={d} fill={pat(id, "d")} />
      {rings.map((r, i) => (
        <path key={i} d={r} className="gz1-contour" />
      ))}
      <path d={d} className="gz1-o" />
    </g>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <rect x={14} y={T} width={W - 28} height={B - T} className="gz1-mapbg gz1-o gz1-thin" />
      {children}
    </g>
  );
}

const Ctr = ({ x, y, t }: { x: number; y: number; t: string | number }) => (
  <text x={x} y={y} textAnchor="middle" className="gz1-ctr-t gz1-halo">
    {t}
  </text>
);

function Peak() {
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sketch
        d="M14 108 C60 108 70 26 110 26 C150 26 160 108 206 108Z"
        rings={["M50 92 Q110 104 170 92", "M70 66 Q110 76 150 66", "M88 42 Q110 48 132 42"]}
      />
      <Box>
        {[
          [84, 58],
          [62, 44],
          [40, 30],
          [18, 14],
        ].map(([rx, ry], i) => (
          <ellipse key={i} cx={110} cy={192} rx={rx} ry={ry} className={`gz1-contour ${i === 0 ? "gz1-contour-b" : ""}`} />
        ))}
        <path d="M110 186 L116 197 L104 197Z" style={{ fill: "var(--ink)" }} />
        <Ctr x={194} y={196} t={300} />
        <Ctr x={110} y={161} t={340} />
      </Box>
    </Frame>
  );
}

function Ridge() {
  const ws = [30, 52, 74, 96];
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sketch d="M14 108 C26 70 44 40 72 32 C110 26 150 44 206 92 V108Z" />
      <path d="M44 62 C70 72 92 90 100 108 M100 29 C110 52 120 84 124 108 M152 50 C156 70 160 90 160 108" className="gz1-o gz1-thin" style={{ opacity: 0.6 }} />
      <path d="M72 32 C110 26 150 44 206 92" className="gz1-o gz1-dash" style={{ stroke: "var(--lvl-ink)", strokeWidth: 2 }} />
      <Box>
        {ws.map((w, i) => {
          const ay = 160 + i * 26;
          return (
            <path
              key={i}
              d={`M${110 - w} ${T} C${110 - w} ${ay - 8} ${110 - 14} ${ay} 110 ${ay} C${110 + 14} ${ay} ${110 + w} ${ay - 8} ${110 + w} ${T}`}
              className="gz1-contour"
            />
          );
        })}
        <path d={`M110 ${T + 4} V${B - 6}`} className="gz1-o gz1-thin gz1-dash" style={{ stroke: "var(--lvl-ink)" }} />
        <Ctr x={110 + ws[0] + 2} y={T + 14} t={360} />
        <Ctr x={110 + ws[3] - 2} y={T + 14} t={300} />
      </Box>
    </Frame>
  );
}

function Valley() {
  const ws = [96, 74, 52, 30];
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sketch
        d="M14 30 L94 96 Q110 104 126 96 L206 30 L206 108 L14 108Z"
        rings={["M34 47 L96 98", "M186 47 L124 98"]}
      />
      <path d="M100 100 Q110 104 120 100" className="gz1-river" />
      <Box>
        {ws.map((w, i) => {
          const ay = 142 + i * 28;
          return (
            <path
              key={i}
              d={`M${110 - w} ${B} C${110 - w} ${ay + 30} ${110 - 10} ${ay + 6} 110 ${ay} C${110 + 10} ${ay + 6} ${110 + w} ${ay + 30} ${110 + w} ${B}`}
              className="gz1-contour"
            />
          );
        })}
        <path d={`M110 ${T + 6} V${B}`} className="gz1-river" />
        <path d={`M104 ${B - 16} L110 ${B - 6} L116 ${B - 16}`} className="gz1-o gz1-thin" style={{ stroke: "var(--blue)" }} />
        <Ctr x={110 - ws[0] + 6} y={B - 10} t={360} />
        <Ctr x={110 - ws[3] + 2} y={B - 10} t={300} />
      </Box>
    </Frame>
  );
}

function Saddle() {
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sketch d="M14 108 C30 44 56 30 72 38 C88 46 94 66 110 66 C126 66 132 46 148 38 C164 30 190 44 206 108Z" />
      <circle cx={110} cy={66} r={3.5} className="gz1-lvl-f gz1-o gz1-thin" />
      <Box>
        <path
          d="M110 166 C132 146 198 140 200 192 C198 244 132 238 110 218 C88 238 22 244 20 192 C22 140 88 146 110 166Z"
          className="gz1-contour gz1-contour-b"
        />
        {[
          [64, 34],
          [156, 34],
        ].map(([cx, r]) => (
          <g key={cx}>
            <ellipse cx={cx} cy={192} rx={r} ry={r * 0.95} className="gz1-contour" />
            <ellipse cx={cx} cy={192} rx={r * 0.45} ry={r * 0.45} className="gz1-contour" />
          </g>
        ))}
        <path d="M106 188 l8 8 M114 188 l-8 8" className="gz1-o" style={{ stroke: "var(--lvl-ink)", strokeWidth: 2 }} />
        <Ctr x={64} y={196} t={360} />
        <Ctr x={156} y={196} t={360} />
        <Ctr x={110} y={T + 14} t={320} />
      </Box>
    </Frame>
  );
}

function Slopes() {
  const dense = Array.from({ length: 6 }, (_, i) => 30 + i * 8);
  const sparse = Array.from({ length: 4 }, (_, i) => 98 + i * 30);
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sketch d="M14 108 L68 28 C78 22 86 22 94 28 L206 108Z" />
      <Box>
        {[...dense, ...sparse].map((x, i) => (
          <path key={i} d={`M${x} ${T + 4} q4 35 0 70 t0 66`} className="gz1-contour" />
        ))}
        <path d={`M80 ${T} V${B}`} className="gz1-o gz1-thin gz1-dash" style={{ opacity: 0.5 }} />
      </Box>
      <text x={50} y={B - 8} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b gz1-halo">
        strmý
      </text>
      <text x={146} y={B - 8} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b gz1-halo">
        mírný
      </text>
    </Frame>
  );
}

export default function ContourLandforms() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL} note="Nahoře náčrt tvaru, dole jeho vrstevnice na mapě (interval 20 m).">
        <StepStrip
          min={170}
          phoneColumns={2}
          steps={[
            { title: "Vrchol", art: <Peak />, caption: "Uzavřené soustředné vrstevnice, nejvyšší uprostřed." },
            { title: "Hřbet", art: <Ridge />, caption: "Vrstevnice prohnuté jako U dolů po svahu." },
            { title: "Údolí", art: <Valley />, caption: "Vrstevnice tvoří V, které ukazuje proti proudu." },
            { title: "Sedlo", art: <Saddle />, caption: "Nejnižší místo mezi dvěma vrcholy." },
            { title: "Strmý a mírný svah", art: <Slopes />, caption: "Hustě u sebe = strmě, daleko od sebe = mírně." },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
