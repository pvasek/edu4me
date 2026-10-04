import { Draw, Fade, Figure, pat, useFig } from "./kit";
import { T, Tree, smooth, waves } from "./land";

const LABEL =
  "Řeka od pramene k ústí ve třech pohledech: podélný profil, mapa shora a příčné řezy údolím. Horní tok: řeka teče z hor prudce dolů, má velký spád, zahlubuje se do dna (hloubková eroze) a vytváří úzká údolí tvaru V, peřeje a vodopády. Střední tok: spád se zmenšuje, řeka víc podemílá břehy (boční eroze), klikatí se v meandrech a údolí se rozšiřuje. Dolní tok: řeka teče pomalu širokou rovnou nivou, ukládá štěrk, písek a bahno (akumulace) a při ústí do moře vytváří deltu nebo nálevkovité ústí (estuár).";

const W = 480;
const H = 438;
const COL = [0, 160, 320, 480];
const PT = 32; // profile top
const PB = 138;

const PROFILE: [number, number][] = [
  [14, 40],
  [56, 64],
  [100, 80],
];
const PROFILE2: [number, number][] = [
  [108, 94],
  [160, 104],
  [240, 116],
  [320, 122],
  [400, 125],
  [446, 126],
];

function Profile() {
  const { id } = useFig();
  const p1 = smooth(PROFILE);
  const p2 = smooth(PROFILE2).replace(/^M/, "L");
  const d = `${p1} L102 82 ${p2}`;
  const land = `${d} L446 ${PB} L14 ${PB}Z`;
  return (
    <g>
      <path d={land} className="gz2-land" />
      <path d={land} fill={pat(id, "d")} opacity={0.4} />
      <path d={`M446 126 H${W - 6} V${PB} H446Z`} className="gz2-sea" />
      <path d={`M446 126 H${W - 6}`} className="gz2-o gz2-thin" />
      <path d={land} className="gz2-o gz2-thin" />
      <Draw d={d} className="gz2-river" style={{ strokeWidth: 3.5 }} delay={0.1} />
      <T x={20} y={PT - 2} a="start" cls="gz2-sm">pramen</T>
      <T x={112} y={74} a="start" cls="gz2-sm">vodopád</T>
      <T x={W - 8} y={116} a="end" cls="gz2-sm">ústí</T>
    </g>
  );
}

const PY = 232; // plan centre line
const UPPER = smooth([
  [10, PY - 28],
  [40, PY - 18],
  [70, PY - 24],
  [104, PY - 8],
  [130, PY - 12],
  [160, PY],
]);
const TRIB = smooth([
  [60, PY + 30],
  [86, PY + 10],
  [104, PY - 8],
]);
const MIDDLE = (() => {
  let d = `M160 ${PY}`;
  for (let i = 0; i < 4; i++) {
    const x = 160 + i * 40;
    const s = i % 2 ? -1 : 1;
    d += ` C${x + 6} ${PY + s * 36} ${x + 34} ${PY + s * 36} ${x + 40} ${PY}`;
  }
  return d;
})();
const LOWER = smooth([
  [320, PY],
  [350, PY + 12],
  [380, PY + 4],
  [410, PY - 6],
  [436, PY],
]);

function Plan() {
  const { id } = useFig();
  return (
    <g>
      <rect x={6} y={PY - 46} width={W - 12} height={92} rx={4} className="gz2-grass" />
      {/* mountains in the upper course */}
      <rect x={6} y={PY - 46} width={150} height={92} rx={4} fill={pat(id, "x")} opacity={0.5} />
      {/* floodplain in the lower course */}
      <path d={`M300 ${PY - 30} Q380 ${PY - 40} 440 ${PY - 34} L440 ${PY + 34} Q380 ${PY + 42} 300 ${PY + 30}Z`} className="gz2-sed" />
      <path d={`M440 ${PY - 46} H${W - 6} V${PY + 46} H440Z`} className="gz2-sea" />
      <path d={`M440 ${PY - 46} H${W - 6} V${PY + 46} H440Z`} fill={pat(id, "h")} opacity={0.5} />
      {/* delta */}
      <path d={`M436 ${PY} L462 ${PY - 22} L470 ${PY - 6} L468 ${PY + 12} L458 ${PY + 24}Z`} className="gz2-sand gz2-o gz2-thin" />
      <rect x={6} y={PY - 46} width={W - 12} height={92} rx={4} className="gz2-o" />
      <Draw d={UPPER} className="gz2-river" style={{ strokeWidth: 2 }} delay={0.3} />
      <Draw d={TRIB} className="gz2-river" style={{ strokeWidth: 1.5 }} delay={0.3} />
      <Draw d={MIDDLE} className="gz2-river" style={{ strokeWidth: 3.5 }} delay={0.6} />
      <Draw d={LOWER} className="gz2-river" style={{ strokeWidth: 6 }} delay={0.9} />
      <path d={`M436 ${PY} L462 ${PY - 20} M436 ${PY} L468 ${PY - 2} M436 ${PY} L460 ${PY + 20}`} className="gz2-river" style={{ strokeWidth: 2.5 }} />
      <T x={60} y={PY + 44} cls="gz2-sm">přítok</T>
      <T x={240} y={PY - 30} cls="gz2-sm">meandry</T>
      <T x={370} y={PY + 30} cls="gz2-sm">niva</T>
      <T x={W - 8} y={PY - 30} a="end" cls="gz2-sm">delta</T>
    </g>
  );
}

const SY = 308; // top of the cross-sections
const SB = 392;

function Sections() {
  const { id } = useFig();
  const sec = (x0: number, top: string, water: string, sed = "") => {
    const ground = `${top} L${x0 + 150} ${SB} L${x0 + 10} ${SB}Z`;
    return (
      <g>
        <path d={ground} className="gz2-land" />
        <path d={ground} fill={pat(id, "d")} opacity={0.4} />
        {sed && <path d={sed} className="gz2-sed" />}
        {sed && <path d={sed} fill={pat(id, "dots")} />}
        <path d={water} className="gz2-water" />
        <path d={ground} className="gz2-o" />
      </g>
    );
  };
  return (
    <g>
      {sec(
        0,
        `M10 ${SY} L58 ${SY + 6} L76 ${SY + 62} L84 ${SY + 62} L102 ${SY + 6} L150 ${SY}`,
        `M74 ${SY + 54} L86 ${SY + 54} L84 ${SY + 62} L76 ${SY + 62}Z`,
      )}
      {sec(
        160,
        `M170 ${SY + 4} Q196 ${SY + 8} 214 ${SY + 44} L226 ${SY + 58} L254 ${SY + 58} L266 ${SY + 44} Q284 ${SY + 8} 310 ${SY + 4}`,
        `M232 ${SY + 52} L250 ${SY + 52} L248 ${SY + 58} L234 ${SY + 58}Z`,
        `M220 ${SY + 52} L262 ${SY + 52} L266 ${SY + 64} L216 ${SY + 64}Z`,
      )}
      {sec(
        320,
        `M330 ${SY + 34} Q340 ${SY + 40} 350 ${SY + 52} L460 ${SY + 52} Q466 ${SY + 40} 470 ${SY + 34}`,
        `M396 ${SY + 46} L420 ${SY + 46} L418 ${SY + 52} L398 ${SY + 52}Z`,
        `M350 ${SY + 52} L460 ${SY + 52} L462 ${SY + 72} L346 ${SY + 72}Z`,
      )}
      <T x={80} y={SB + 22} cls="gz2-sm gz2-b">údolí tvaru V</T>
      <T x={240} y={SB + 22} cls="gz2-sm gz2-b">širší údolí</T>
      <T x={400} y={SB + 22} cls="gz2-sm gz2-b">široká niva</T>
    </g>
  );
}

export default function RiverCourse() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={680} replay>
      {/* zone dividers */}
      {[160, 320].map((x) => (
        <path key={x} d={`M${x} 6 V${H - 6}`} className="gz2-o gz2-thin gz2-dash" style={{ opacity: 0.45 }} />
      ))}
      {["horní tok", "střední tok", "dolní tok"].map((t, i) => (
        <text key={t} x={(COL[i] + COL[i + 1]) / 2} y={16} textAnchor="middle" className="gz2-lbl gz2-b gz2-lvl-t">
          {t}
        </text>
      ))}
      <Profile />
      <Fade delay={0.6}>
        {[
          ["hloubková eroze", "prudký spád"],
          ["boční eroze", "spád se zmenšuje"],
          ["ukládání", "malý spád"],
        ].map(([a, b], i) => (
          <g key={a}>
            <T x={(COL[i] + COL[i + 1]) / 2} y={PB + 18} cls="gz2-sm gz2-b gz2-red-t">
              {a}
            </T>
            <T x={(COL[i] + COL[i + 1]) / 2} y={PB + 34} cls="gz2-sm gz2-sec">
              {b}
            </T>
          </g>
        ))}
      </Fade>
      <Plan />
      <Sections />
      {[24, 40, 120, 136].map((x, i) => (
        <Tree key={x} x={x} y={SY + (i % 2 ? 2 : 0)} s={0.7} conifer />
      ))}
      <path d={waves(446, W - 8, 130, 1.2, 10)} className="gz2-o gz2-thin" style={{ opacity: 0.5 }} />
    </Figure>
  );
}
