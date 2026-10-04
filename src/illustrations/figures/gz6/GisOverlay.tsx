import { StepFilm } from "../../sequence/StepFigure";
import { Draw, Fade, Figure, Frame, Pop, pat, useFig } from "./kit";

const LABEL =
  "Analýza v GIS v pěti krocích: kde ve výřezu krajiny 2,6 × 2,6 km stavět nové domy. 1. Vrstva řek: tok řeky jako čára. 2. Obalová zóna (buffer) 200 m kolem řeky – kvůli povodním se v ní stavět nebude. 3. Vrstva sklonu svahu: příliš strmé svahy se vyloučí. 4. Vrstva chráněných území: přírodní rezervace se vyloučí. 5. Překrytí vrstev (overlay): co zbude mimo všechny vyloučené plochy, jsou plochy vhodné k výstavbě.";

const W = 440;
const H = 290;
const M = 14; // map origin
const S = 260; // map size (1 px = 10 m)

const RIVER = "M90 0 C112 60 66 112 110 150 S152 214 138 260";
const SLOPE = "M168 0 H260 V128 Q222 120 204 80 Q186 44 168 0 Z";
const RESERVE = "M0 168 Q44 156 64 188 Q76 230 44 260 H0 Z";

const LAYERS = ["řeky", "obalová zóna", "sklon svahu", "chráněná území"];

function Stack({ upto, result = false }: { upto: number; result?: boolean }) {
  return (
    <g>
      <text x={358} y={30} textAnchor="middle" className="gz6-lbl gz6-b">
        vrstvy
      </text>
      {LAYERS.map((name, i) => {
        const y = 44 + i * 42;
        const on = i < upto;
        const cur = i === upto - 1 && !result;
        return (
          <g key={name} className={on ? "" : "gz6-ghost"}>
            <path
              d={`M298 ${y} H398 L420 ${y + 24} H320 Z`}
              className={cur ? "gz6-box-lvl" : "gz6-box"}
            />
            <text x={359} y={y + 17} textAnchor="middle" className={`gz6-lbl gz6-sm ${cur ? "gz6-b" : ""}`}>
              {name}
            </text>
          </g>
        );
      })}
      {result && (
        <Pop delay={0.4}>
          <path d="M359 214 V232" className="gz6-arr gz6-arr-lvl" />
          <path d="M298 240 H398 L420 266 H320 Z" className="gz6-lvl-f gz6-o" />
          <text x={359} y={258} textAnchor="middle" className="gz6-lbl gz6-b gz6-sm" style={{ fill: "var(--on-level)" }}>
            vhodné plochy
          </text>
        </Pop>
      )}
    </g>
  );
}

function MapBase({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <rect x={M} y={M} width={S} height={S} className="gz6-land" />
      <g transform={`translate(${M} ${M})`}>{children}</g>
      <rect x={M} y={M} width={S} height={S} className="gz6-o" fill="none" />
      {/* scale bar: 500 m */}
      <path d={`M${M + 8} ${M + S - 10} h50 M${M + 8} ${M + S - 14} v8 M${M + 58} ${M + S - 14} v8`} className="gz6-o" style={{ strokeWidth: 2 }} />
      <text x={M + 33} y={M + S - 16} textAnchor="middle" className="gz6-num gz6-halo" style={{ fontSize: 11 }}>
        500 m
      </text>
    </g>
  );
}

function River({ draw = false }: { draw?: boolean }) {
  return draw ? (
    <Draw d={RIVER} className="gz6-o gz6-blue-s" style={{ strokeWidth: 4 }} delay={0.1} />
  ) : (
    <path d={RIVER} className="gz6-o gz6-blue-s" style={{ strokeWidth: 4 }} />
  );
}

function Buffer({ grey = false }: { grey?: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <path d={RIVER} fill="none" style={{ stroke: grey ? "var(--muted)" : "var(--lvl)", strokeWidth: 40, opacity: grey ? 0.55 : 0.35 }} />
      {!grey && <path d={RIVER} fill="none" style={{ stroke: pat(id, "d"), strokeWidth: 40 }} />}
    </g>
  );
}

function Slope({ grey = false }: { grey?: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <path d={SLOPE} style={{ fill: grey ? "var(--muted)" : "var(--accent)", opacity: grey ? 0.55 : 0.3 }} />
      {!grey && <path d={SLOPE} fill={pat(id, "b")} />}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${178 + i * 16} 0 Q${196 + i * 14} ${60 - i * 6} ${260} ${70 + i * 12}`}
          className="gz6-o gz6-thin"
          style={{ opacity: 0.5 }}
        />
      ))}
    </g>
  );
}

function Reserve({ grey = false }: { grey?: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <path d={RESERVE} style={{ fill: grey ? "var(--muted)" : "var(--good)", opacity: grey ? 0.55 : 0.3 }} />
      {!grey && <path d={RESERVE} fill={pat(id, "x")} />}
      {!grey &&
        [
          [16, 200],
          [36, 222],
          [14, 238],
          [40, 192],
        ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={5} className="gz6-veg gz6-o gz6-thin" />)}
    </g>
  );
}

function Lbl({ x, y, t, cls = "" }: { x: number; y: number; t: string; cls?: string }) {
  return (
    <text x={M + x} y={M + y} textAnchor="middle" className={`gz6-lbl gz6-b gz6-halo ${cls}`}>
      {t}
    </text>
  );
}

const STEPS = [
  {
    title: "Vrstva řek",
    caption: "Řeka je ve vrstvě uložená jako čára (vektor) se souřadnicemi.",
    art: (
      <>
        <MapBase>
          <River draw />
        </MapBase>
        <Fade delay={0.6}>
          <Lbl x={150} y={124} t="řeka" cls="gz6-blue-t" />
        </Fade>
        <Stack upto={1} />
      </>
    ),
  },
  {
    title: "Obalová zóna 200 m",
    caption: "Kolem řeky GIS vytvoří pás 200 m na každou stranu; kvůli povodním se v něm stavět nebude.",
    art: (
      <>
        <MapBase>
          <Fade>
            <Buffer />
          </Fade>
          <River />
        </MapBase>
        <Fade delay={0.4}>
          <Lbl x={166} y={168} t="obalová zóna" cls="gz6-lvl-t" />
          <Lbl x={166} y={186} t="(buffer) 200 m" cls="gz6-lvl-t" />
        </Fade>
        <Stack upto={2} />
      </>
    ),
  },
  {
    title: "Sklon svahu",
    caption: "Z výškového modelu se spočítá sklon; příliš strmé svahy jsou pro stavbu nevhodné.",
    art: (
      <>
        <MapBase>
          <Buffer grey />
          <River />
          <Fade>
            <Slope />
          </Fade>
        </MapBase>
        <Fade delay={0.4}>
          <Lbl x={226} y={40} t="strmý svah" cls="gz6-acc-t" />
        </Fade>
        <Stack upto={3} />
      </>
    ),
  },
  {
    title: "Chráněná území",
    caption: "Přírodní rezervace je chráněná zákonem, i ta se z výběru vyřadí.",
    art: (
      <>
        <MapBase>
          <Buffer grey />
          <River />
          <Slope grey />
          <Fade>
            <Reserve />
          </Fade>
        </MapBase>
        <Fade delay={0.4}>
          <Lbl x={62} y={160} t="rezervace" cls="gz6-good-t" />
        </Fade>
        <Stack upto={4} />
      </>
    ),
  },
  {
    title: "Překrytí vrstev (overlay)",
    caption: "Co zbude mimo všechny vyloučené plochy, je vhodné k výstavbě.",
    art: (
      <>
        <MapBase>
          <Fade>
            <rect x={0} y={0} width={S} height={S} className="gz6-lvl-fill" />
          </Fade>
          <Buffer grey />
          <River />
          <Slope grey />
          <Reserve grey />
        </MapBase>
        <Fade delay={0.5}>
          <Lbl x={40} y={110} t="vhodné" cls="gz6-lvl-t" />
          <Lbl x={196} y={200} t="vhodné" cls="gz6-lvl-t" />
        </Fade>
        <Stack upto={4} result />
      </>
    ),
  },
];

export default function GisOverlay() {
  return (
    <Figure label={LABEL} interactive max={620}>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s) => ({
          ...s,
          art: (
            <Frame w={W} h={H} className="gz6-xl">
              {s.art}
            </Frame>
          ),
        }))}
      />
    </Figure>
  );
}
