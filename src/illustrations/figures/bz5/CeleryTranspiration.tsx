import { StepFilm } from "../../sequence/StepFigure";
import {
  Draw,
  DrawArrow,
  Fade,
  Figure,
  Frame,
  Lbl,
  Pop,
  f1,
  pat,
  useFig,
} from "./kit";

const LABEL =
  "Pokus s řapíkatým celerem ve třech krocích. 1 začátek: čerstvě seříznutý řapík celeru stojí ve sklenici s vodou obarvenou potravinářskou barvou, listy jsou zelené. 2 po několika hodinách: barva vystoupala cévami v řapíku až do listů a obarvila jejich žilky, protože listy vodu vypařují a táhnou ji vzhůru. 3 průřez: na příčném řezu řapíkem jsou vidět barevné tečky u vnější strany – cévní svazky, kterými voda stoupá. Zbytek řapíku zůstal bez barvy.";

const W = 360;
const H = 260;
const GLASS_W = "M38 176 H140 L134 246 Q134 252 128 252 H50 Q44 252 44 246 Z";

/** Celery petiole from the cut base (in the water) up to the leaves. */
const STALK_L = "M78 244 C76 200 74 150 80 70";
const STALK_R = "M98 244 C98 200 96 150 96 70";
const VESSELS = [
  "M83 242 C81 200 79 150 84 74",
  "M88 242 C87 200 86 150 88 72",
  "M93 242 C93 200 91 150 92 74",
];
const VEINS = [
  "M88 72 C70 60 52 48 34 30",
  "M88 72 C90 52 96 34 104 14",
  "M88 72 C112 62 134 50 156 34",
  "M52 50 L44 58 M52 50 L50 36",
  "M98 36 L88 28 M98 36 L110 30",
  "M126 54 L130 66 M126 54 L132 42",
];

/** A toothed celery leaflet along a vein, from (x0, y0) to (x1, y1). */
function leaflet(x0: number, y0: number, x1: number, y1: number, w: number) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const pts: string[] = [];
  const n = 8;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const ww = w * Math.sin(Math.PI * t) * (i % 2 ? 1 : 0.7);
    pts.push(`${f1(x0 + dx * t + nx * ww)} ${f1(y0 + dy * t + ny * ww)}`);
  }
  for (let i = n - 1; i > 0; i--) {
    const t = i / n;
    const ww = w * Math.sin(Math.PI * t) * (i % 2 ? 1 : 0.7);
    pts.push(`${f1(x0 + dx * t - nx * ww)} ${f1(y0 + dy * t - ny * ww)}`);
  }
  return `M${pts.join(" L")}Z`;
}
const LEAVES = [
  leaflet(84, 66, 26, 24, 15),
  leaflet(88, 66, 106, 6, 15),
  leaflet(92, 66, 164, 28, 15),
];

function Celery({ dyed }: { dyed: "none" | "rising" | "done" }) {
  const { id } = useFig();
  return (
    <g>
      {/* glass with coloured water */}
      <path d={GLASS_W} className="bz5-dye-water" />
      <path d={GLASS_W} fill={pat(id, "h")} opacity={0.6} />
      {/* leaves */}
      {LEAVES.map((d, i) => (
        <g key={i}>
          <path d={d} className="bz5-leaf" />
          <path d={d} fill={pat(id, "d")} opacity={0.35} />
          <path d={d} className="bz5-o bz5-thin" />
        </g>
      ))}
      {dyed === "none" && (
        <path d={VEINS.join(" ")} className="bz5-o bz5-thin bz5-stem-s" />
      )}
      {dyed === "done" && <path d={VEINS.join(" ")} className="bz5-dye-s" />}
      {/* the petiole */}
      <path
        d={`${STALK_L} L96 70 C96 150 98 200 98 244 Z`}
        className="bz5-stem"
      />
      <path
        d={`${STALK_L} L96 70 C96 150 98 200 98 244 Z`}
        fill={pat(id, "v")}
        opacity={0.4}
      />
      <path d={STALK_L} className="bz5-o" />
      <path d={STALK_R} className="bz5-o" />
      {dyed === "done" && <path d={VESSELS.join(" ")} className="bz5-dye-s" />}
      {/* glass outline over everything */}
      <path
        d="M32 150 L44 246 Q44 254 52 254 H126 Q134 254 134 246 L146 150"
        className="bz5-o"
      />
      <path d="M38 176 H140" className="bz5-o bz5-thin" />
      <path
        d="M36 160 L46 244"
        className="bz5-o bz5-thin"
        style={{ opacity: 0.4 }}
      />
    </g>
  );
}

function S1() {
  return (
    <Frame w={W} h={H}>
      <Celery dyed="none" />
      <Fade delay={0.4}>
        <Lbl x={176} y={120} tx={98} ty={120} className="bz5-b">
          řapík celeru
        </Lbl>
        <Lbl x={176} y={204} tx={136} ty={210} className="bz5-b bz5-dye-t">
          {"voda s potravinářskou\nbarvou"}
        </Lbl>
        <Lbl x={176} y={60} tx={150} ty={36} className="bz5-sm">
          listy jsou zelené
        </Lbl>
        <Lbl x={176} y={252} tx={98} ty={244} className="bz5-sm" sec>
          čerstvě seříznutý konec
        </Lbl>
      </Fade>
    </Frame>
  );
}

function Clock({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={22} className="bz5-o bz5-fill" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <path
            key={i}
            d={`M${f1(x + Math.cos(a) * 18)} ${f1(y + Math.sin(a) * 18)} L${f1(x + Math.cos(a) * 21)} ${f1(y + Math.sin(a) * 21)}`}
            className="bz5-o bz5-thin"
          />
        );
      })}
      <path
        d={`M${x} ${y} V${y - 14} M${x} ${y} L${x + 10} ${y + 5}`}
        className="bz5-o"
      />
    </g>
  );
}

function S2() {
  return (
    <Frame w={W} h={H}>
      <Celery dyed="none" />
      {VESSELS.map((d, i) => (
        <Draw key={i} d={d} className="bz5-dye-s" delay={0.1 + i * 0.08} />
      ))}
      <Draw d={VEINS.join(" ")} className="bz5-dye-s" delay={0.9} />
      <DrawArrow d="M116 214 V150" tone="red" delay={0.3} />
      <Fade delay={0.6}>
        <Clock x={300} y={50} />
        <text x={300} y={92} textAnchor="middle" className="bz5-lbl bz5-sm">
          po několika hodinách
        </text>
        <Lbl x={176} y={150} tx={92} ty={150} className="bz5-b bz5-dye-t">
          {"barva stoupá\ncévami"}
        </Lbl>
        <Lbl x={176} y={46} tx={130} ty={50} className="bz5-b">
          {"žilky listů\nse obarví"}
        </Lbl>
        <text x={176} y={226} className="bz5-lbl bz5-sm">
          listy vodu vypařují
        </text>
        <text x={176} y={244} className="bz5-lbl bz5-sm">
          a táhnou ji vzhůru
        </text>
      </Fade>
    </Frame>
  );
}

/** Cross-section of the petiole: a ribbed crescent, the bundles by the outer side. */
function Section({ cx, cy, dyed }: { cx: number; cy: number; dyed: boolean }) {
  const { id } = useFig();
  // outer side: scalloped arc (ribs); inner side: a shallow groove
  const n = 9;
  let outer = "";
  const bundles: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (1 - i / n);
    const x = cx + Math.cos(a) * 74;
    const y = cy - 10 + Math.sin(a) * 56;
    if (i === 0) outer = `M${f1(x)} ${f1(y)}`;
    else {
      const am = Math.PI * (1 - (i - 0.5) / n);
      const rx = cx + Math.cos(am) * 82;
      const ry = cy - 10 + Math.sin(am) * 63;
      outer += ` Q${f1(rx)} ${f1(ry)} ${f1(x)} ${f1(y)}`;
    }
    if (i > 0 && i < n + 1) {
      const am = Math.PI * (1 - (i - 0.5) / n);
      bundles.push([cx + Math.cos(am) * 62, cy - 10 + Math.sin(am) * 46]);
    }
  }
  const d = `${outer} C${cx + 56} ${cy - 30} ${cx + 30} ${cy - 4} ${cx} ${cy - 6} C${cx - 30} ${cy - 4} ${cx - 56} ${cy - 30} ${cx - 74} ${cy - 10} Z`;
  return (
    <g>
      <path d={d} className="bz5-stem-light" />
      <path d={d} fill={pat(id, "dots")} opacity={0.4} />
      <path d={d} className="bz5-o" />
      {bundles.map(([x, y], i) => (
        <g key={i}>
          <ellipse
            cx={f1(x)}
            cy={f1(y)}
            rx={6}
            ry={7}
            className={
              dyed ? "bz5-dye-f bz5-o bz5-thin" : "bz5-o bz5-thin bz5-fill"
            }
          />
          <ellipse
            cx={f1(x)}
            cy={f1(y - 2)}
            rx={3}
            ry={3}
            className="bz5-o bz5-thin"
            style={{ opacity: 0.5 }}
          />
        </g>
      ))}
    </g>
  );
}

function S3() {
  return (
    <Frame w={W} h={H}>
      <Celery dyed="done" />
      <path
        d="M64 130 H112"
        className="bz5-o bz5-lvl-s"
        style={{ strokeWidth: 2.4, strokeDasharray: "5 3" }}
      />
      <Pop delay={0.2}>
        <path d="M112 130 L190 116" className="bz5-o bz5-thin bz5-dash" />
        <Section cx={266} cy={120} dyed />
      </Pop>
      <Fade delay={0.6}>
        <text x={266} y={40} textAnchor="middle" className="bz5-lbl bz5-b">
          průřez řapíkem
        </text>
        <Lbl
          x={266}
          y={222}
          tx={266}
          ty={172}
          anchor="middle"
          className="bz5-b bz5-dye-t"
        >
          {"barevné tečky\n= cévní svazky"}
        </Lbl>
        <text
          x={266}
          y={134}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-halo"
        >
          bez barvy
        </text>
      </Fade>
    </Frame>
  );
}

export default function CeleryTranspiration() {
  return (
    <Figure level={3} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: "Začátek",
            caption: "Čerstvě seříznutý řapík celeru stojí v obarvené vodě.",
            art: <S1 />,
          },
          {
            title: "Po několika hodinách",
            caption: "Barva vystoupala cévami až do žilek listů.",
            art: <S2 />,
          },
          {
            title: "Průřez řapíkem",
            caption: "Barevné tečky jsou cévní svazky: voda stoupá jen jimi.",
            art: <S3 />,
          },
        ]}
      />
    </Figure>
  );
}
