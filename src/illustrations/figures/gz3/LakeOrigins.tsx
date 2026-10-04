import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, pat, useFig } from "./kit";

const LABEL =
  "Jezera podle vzniku, každé v malém řezu. Tektonické jezero vyplňuje propadlinu mezi zlomy – Bajkal je s hloubkou 1 642 m nejhlubší jezero světa. Ledovcové jezero leží v karu, míse vyhloubené ledovcem, a hradí ho morénový val – tak vzniklo Černé jezero na Šumavě, největší přirozené jezero Česka, hluboké asi 40 m. Sopečné jezero vyplňuje kráter maaru, který vyhloubil výbuch sopečných plynů a páry. Slepé rameno je odškrcený meandr, který řeka opustila, když při povodni prorazila šíji. Přehradní nádrž vznikla za hrází, kterou lidé přehradili údolí; největší v Česku je Lipno s rozlohou 48,7 km².";

const W = 300;
const H = 170;

function Water({ d }: { d: string }) {
  const { id } = useFig();
  return (
    <g>
      <path d={d} className="gz3-water" />
      <path d={d} fill={pat(id, "h")} opacity={0.7} />
    </g>
  );
}
function Rock({ d, cls = "gz3-rock" }: { d: string; cls?: string }) {
  const { id } = useFig();
  return (
    <g>
      <path d={d} className={cls} />
      <path d={d} fill={pat(id, "d")} opacity={0.5} />
      <path d={d} className="gz3-o" />
    </g>
  );
}
const T = ({ x, y, t, a = "middle", c = "" }: { x: number; y: number; t: string; a?: "start" | "middle" | "end"; c?: string }) => (
  <text x={x} y={y} textAnchor={a} className={`gz3-lbl gz3-b gz3-strip-t gz3-halo ${c}`}>
    {t}
  </text>
);

function Tectonic() {
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={H - 8} className="gz3-sky" />
      <Rock d="M4 58 L96 58 L132 166 L4 166 Z" />
      <Rock d="M296 58 L204 58 L168 166 L296 166 Z" />
      <Rock d="M100 152 L200 152 L196 166 L104 166 Z" cls="gz3-rock2" />
      <Water d="M98 66 L202 66 L182 140 L118 140 Z" />
      <path d="M104 140 L196 140 L200 152 L100 152 Z" className="gz3-o gz3-clay" />
      <Arrow d="M150 22 V48" tone="red" />
      <path d="M96 58 L132 166 M204 58 L168 166" className="gz3-fault" />
      <Arrow d="M232 82 V112" tone="muted" />
      <T x={244} y={100} t="zlom" a="start" />
      <T x={150} y={104} t="1 642 m" c="gz3-blue-t" />
      <T x={150} y={18} t="propadlina" />
    </Frame>
  );
}

function Glacial() {
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={H - 8} className="gz3-sky" />
      <Water d="M78 118 H222 C208 134 182 148 150 148 C120 147 94 136 78 118 Z" />
      <Rock d="M4 166 V20 L40 14 L62 30 C70 80 76 112 108 136 C140 156 188 152 214 126 C226 108 236 104 248 110 C262 118 280 124 296 124 V166 Z" />
      <path d="M200 124 C214 106 236 100 250 112 C258 118 262 124 268 124 L262 132 L196 132 Z" className="gz3-o gz3-sand" />
      <path d="M78 118 H210" className="gz3-o gz3-thin gz3-blue-s" />
      <T x={110} y={58} t="kar" />
      <T x={236} y={92} t="moréna" />
      <T x={150} y={136} t="≈ 40 m" c="gz3-blue-t" />
    </Frame>
  );
}

function Maar() {
  const { id } = useFig();
  const crater = "M70 70 C90 66 100 64 110 72 C130 112 170 112 190 72 C200 64 210 66 230 70";
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={H - 8} className="gz3-sky" />
      <Rock d={`M4 72 H70 ${crater.slice(crater.indexOf("C"))} H296 V166 H4 Z`} />
      <path d="M124 98 C120 130 128 150 118 166 H182 C172 150 180 130 176 98 Z" className="gz3-rock2" />
      <path d="M124 98 C120 130 128 150 118 166 H182 C172 150 180 130 176 98 Z" fill={pat(id, "dots")} />
      <path d="M124 98 C120 130 128 150 118 166 M176 98 C180 130 172 150 182 166" className="gz3-o gz3-dash" />
      <Water d="M112 76 C132 106 168 106 188 76 Z" />
      <path d="M70 70 C90 66 100 64 110 72 M190 72 C200 64 210 66 230 70" className="gz3-o gz3-clay-s" />
      <T x={150} y={34} t="kráter maaru" />
      <T x={262} y={60} t="val" />
      <T x={150} y={150} t="sopouch" />
    </Frame>
  );
}

function Oxbow() {
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={H - 8} className="gz3-grass" />
      <path d="M8 124 C70 124 100 118 130 118 C170 118 210 124 292 124" className="gz3-river gz3-river-wide" />
      <path d="M120 112 C78 70 112 22 152 24 C196 26 220 70 178 112" className="gz3-river gz3-oxbow" />
      <Arrow d="M232 140 H272" tone="blue" />
      <path d="M128 118 L170 118" className="gz3-o gz3-thin gz3-dash" />
      <T x={150} y={74} t="slepé rameno" />
      <T x={60} y={152} t="řeka" />
      <T x={150} y={144} t="proražená šíje" c="gz3-muted-t gz3-strip-sm" />
    </Frame>
  );
}

function Reservoir() {
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={H - 8} className="gz3-sky" />
      <Rock d="M4 166 V112 C60 120 120 132 188 144 L232 150 C260 152 280 154 296 156 V166 Z" />
      <Water d="M4 60 H196 L196 144 C120 132 60 120 4 112 Z" />
      <path d="M232 150 C260 152 280 154 296 156" className="gz3-river" />
      <path d="M190 48 L206 48 L236 152 L188 146 Z" className="gz3-o gz3-concrete" />
      <path d="M4 60 H190" className="gz3-o gz3-thin gz3-blue-s" />
      <T x={84} y={96} t="nádrž" c="gz3-blue-t" />
      <T x={250} y={60} t="hráz" />
      <T x={262} y={142} t="řeka" />
    </Frame>
  );
}

export default function LakeOrigins() {
  return (
    <Figure label={LABEL} max={940} interactive>
      <div className="gz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          phoneColumns={2}
          steps={[
            { title: "Tektonické", art: <Tectonic />, caption: "Voda vyplnila propadlinu mezi zlomy. Bajkal: 1\u00a0642\u00a0m, nejhlubší na světě." },
            { title: "Ledovcové", art: <Glacial />, caption: "Ledovec vyhloubil kar, morénový val ho hradí. Černé jezero na Šumavě." },
            { title: "Sopečné", art: <Maar />, caption: "Maar: kráter po výbuchu sopečných plynů a páry zaplnila voda." },
            { title: "Slepé rameno", art: <Oxbow />, caption: "Řeka prorazila šíji meandru, odškrcený oblouk zůstal stát." },
            { title: "Přehradní nádrž", art: <Reservoir />, caption: "Umělé jezero za hrází. Největší v Česku: Lipno, 48,7\u00a0km²." },
          ]}
        />
      </div>
    </Figure>
  );
}
