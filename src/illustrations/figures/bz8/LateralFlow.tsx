import { DrawArrow, Fade, Figure, Lbl, f1, pat, useClock, useFig } from "./kit";

const LABEL =
  "Těhotenský nebo antigenní test s bočním tokem. Kapka vzorku vzlíná po proužku zleva doprava: přes vzorkovou podložku k barevným protilátkám, které navážou hormon hCG, dál k testovací čáře T, kde pevně přichycené protilátky zachytí komplex hCG s barevnou protilátkou, a ke kontrolní čáře C, která zachytí barevné protilátky vždy. Zbytek nasaje savá podložka. Pozitivní test ukáže čáru C i T, negativní jen čáru C. Bez čáry C je test neplatný.";

const W = 440;
const H = 470;
const SY = 112; // strip top
const SH = 26;
const X0 = 20;
const X1 = 420;
const CONJ = [96, 160];
const MEM = [160, 362];
const TX = 236;
const CX = 302;

/** a Y-shaped antibody; `up` = arms point up */
function Ab({ x, y, up = true, tone = "fix", particle = false }: { x: number; y: number; up?: boolean; tone?: "fix" | "col"; particle?: boolean }) {
  const s = up ? -1 : 1;
  const arm = `M${x} ${y + s * 10} L${f1(x - 6)} ${y + s * 17} M${x} ${y + s * 10} L${f1(x + 6)} ${y + s * 17}`;
  return (
    <g>
      <path d={`M${x} ${y} V${y + s * 10}`} className={`bz8-ab bz8-ab-${tone}`} />
      <path d={arm} className={`bz8-ab bz8-ab-${tone}`} />
      {particle && <circle cx={x} cy={y - s * 5} r={5} className="bz8-gold bz8-o bz8-thin" />}
    </g>
  );
}
function Hcg({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y}Z`} className="bz8-hcg bz8-o bz8-thin" />;
}

function Strip() {
  const { id } = useFig();
  const t = useClock(2.4);
  const k = t / 2.4;
  const wet = X0 + (X1 - X0) * Math.min(1, k * 1.08);
  const tOn = wet > TX + 4;
  const cOn = wet > CX + 4;
  return (
    <g>
      {/* backing and pads */}
      <rect x={X0 - 4} y={SY + SH - 4} width={X1 - X0 + 8} height={8} rx={2} className="bz8-fill2 bz8-o bz8-thin" />
      <rect x={X0} y={SY} width={CONJ[0] - X0 + 6} height={SH} className="bz8-pad" />
      <rect x={CONJ[0]} y={SY + 2} width={CONJ[1] - CONJ[0] + 4} height={SH - 4} className="bz8-conj" />
      <rect x={MEM[0]} y={SY + 4} width={MEM[1] - MEM[0]} height={SH - 8} className="bz8-mem" />
      <rect x={MEM[1] - 4} y={SY} width={X1 - MEM[1] + 4} height={SH} className="bz8-pad" />
      {/* the wet front */}
      <rect x={X0} y={SY + 4} width={Math.max(0, wet - X0)} height={SH - 8} className="bz8-wet" />
      <rect x={X0} y={SY + 4} width={Math.max(0, wet - X0)} height={SH - 8} fill={pat(id, "h")} opacity={0.35} />
      {/* coloured antibodies travelling with the liquid */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = CONJ[0] + 8 + i * 7 + Math.max(0, wet - CONJ[1]) * (0.3 + (i % 3) * 0.12);
        if (x > Math.min(wet, MEM[1] + 20) - 4) return null;
        return <circle key={i} cx={f1(x)} cy={SY + 8 + (i % 3) * 5} r={2.2} className="bz8-gold" />;
      })}
      {/* test and control lines */}
      <rect x={TX - 3} y={SY + 4} width={6} height={SH - 8} className={tOn ? "bz8-line-on" : "bz8-line-off"} />
      <rect x={CX - 3} y={SY + 4} width={6} height={SH - 8} className={cOn ? "bz8-line-on" : "bz8-line-off"} />
      {[X0, CONJ[0], MEM[0], MEM[1]].map((x, i) => (
        <path key={i} d={`M${x} ${SY} V${SY + SH}`} className="bz8-o bz8-thin" />
      ))}
      <rect x={X0} y={SY} width={X1 - X0} height={SH} rx={2} className="bz8-o" />
      <text x={TX} y={SY - 6} textAnchor="middle" className="bz8-lbl bz8-b">
        T
      </text>
      <text x={CX} y={SY - 6} textAnchor="middle" className="bz8-lbl bz8-b">
        C
      </text>
    </g>
  );
}

function Zoom({ x, w, title, test }: { x: number; w: number; title: string; test: boolean }) {
  const y = 214;
  const h = 96;
  const base = y + h - 14;
  const xs = [x + w * 0.3, x + w * 0.7];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className="bz8-tag" />
      <text x={x + w / 2} y={y - 8} textAnchor="middle" className="bz8-lbl bz8-sm bz8-b">
        {title}
      </text>
      <path d={`M${x + 8} ${base} H${x + w - 8}`} className="bz8-o" style={{ strokeWidth: 3 }} />
      {xs.map((cx, i) => (
        <g key={i}>
          <Ab x={cx} y={base} />
          {test ? (
            <>
              <Hcg x={cx} y={base - 23} />
              <Ab x={cx} y={base - 46} up={false} tone="col" particle />
            </>
          ) : (
            <Ab x={cx} y={base - 36} up={false} tone="col" particle />
          )}
        </g>
      ))}
    </g>
  );
}

function Cassette({ x, y, pos, text }: { x: number; y: number; pos: boolean; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={180} height={46} rx={14} className="bz8-fill2 bz8-o" />
      <circle cx={x + 30} cy={y + 23} r={10} className="bz8-pad bz8-o bz8-thin" />
      <rect x={x + 70} y={y + 14} width={80} height={18} rx={4} className="bz8-mem bz8-o bz8-thin" />
      <rect x={x + 94} y={y + 15} width={5} height={16} className={pos ? "bz8-line-on" : "bz8-line-off"} />
      <rect x={x + 122} y={y + 15} width={5} height={16} className="bz8-line-on" />
      <text x={x + 96} y={y + 10} textAnchor="middle" className="bz8-num" style={{ fontSize: 10 }}>
        T
      </text>
      <text x={x + 124} y={y + 10} textAnchor="middle" className="bz8-num" style={{ fontSize: 10 }}>
        C
      </text>
      <text x={x + 90} y={y + 68} textAnchor="middle" className={`bz8-lbl bz8-b ${pos ? "bz8-lvl-t" : ""}`}>
        {text}
      </text>
    </g>
  );
}

function Plate() {
  return (
    <>
      <Lbl x={X0} y={58} tx={44} ty={SY + 4} className="bz8-sm">
        vzorek (moč)
      </Lbl>
      <Lbl x={128} y={86} tx={128} ty={SY + 4} anchor="middle" className="bz8-sm">
        barevné protilátky
      </Lbl>
      <Lbl x={TX} y={58} tx={TX} ty={SY - 22} anchor="middle" className="bz8-sm">
        testovací čára
      </Lbl>
      <Lbl x={CX + 8} y={86} tx={CX} ty={SY - 22} anchor="middle" className="bz8-sm">
        kontrolní čára
      </Lbl>
      <Lbl x={X1} y={58} tx={392} ty={SY + 4} anchor="end" className="bz8-sm">
        savá podložka
      </Lbl>
      <path d="M48 70 q-7 10 0 14 q7 -4 0 -14Z" className="bz8-wet bz8-o bz8-thin" />
      <Strip />
      <DrawArrow d={`M${X0 + 10} ${SY + SH + 18} H${X1 - 10}`} tone="blue" delay={0.1} />
      <text x={(X0 + X1) / 2} y={SY + SH + 38} textAnchor="middle" className="bz8-lbl bz8-sm bz8-blue-t">
        kapalina vzlíná po proužku
      </text>
      <Fade delay={0.6}>
        <Zoom x={X0} w={196} title="na čáře T" test />
        <Zoom x={X1 - 196} w={196} title="na čáře C" test={false} />
        <text x={X0 + 98} y={330} textAnchor="middle" className="bz8-lbl bz8-sm">
          hCG mezi dvěma protilátkami
        </text>
        <text x={X1 - 98} y={330} textAnchor="middle" className="bz8-lbl bz8-sm">
          chytí barevnou protilátku vždy
        </text>
        {/* small legend for the molecules */}
        <Hcg x={X0 + 154} y={232} />
        <text x={X0 + 164} y={237} className="bz8-lbl bz8-sm bz8-acc-t">
          hCG
        </text>
      </Fade>
      <Fade delay={1.2}>
        <Cassette x={X0} y={356} pos text="pozitivní: C i T" />
        <Cassette x={X1 - 180} y={356} pos={false} text="negativní: jen C" />
        <text x={(X0 + X1) / 2} y={458} textAnchor="middle" className="bz8-lbl bz8-sm bz8-muted-t">
          bez čáry C je test neplatný
        </text>
      </Fade>
    </>
  );
}

export default function LateralFlow() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={580} replay>
      <Plate />
    </Figure>
  );
}
