import { Callouts, Legend, type Callout } from "./callouts";
import { Fade, Figure, f1, pat, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Řez kůží. Nahoře je pokožka, jejíž svrchní rohová vrstva z odumřelých buněk se stále olupuje. Pod ní leží škára s cévami (tepénkou a žilkou s vlásečnicovými kličkami), s nervem a receptory: hmatovým tělískem v bradavce škáry, volnými nervovými zakončeními pro bolest a teplo a tlakovým tělískem hlouběji v podkoží. Ve škáře je vlasový váček s chlupem, mazovou žlázou a vzpřimovačem chlupu a stočená potní žláza, jejíž vývod ústí pórem na povrchu. Nejspodnější vrstvu, podkožní vazivo, tvoří hlavně tukové buňky.";

const X0 = 124;
const X1 = 356;
const TOP = 62;
const DERM = 268;
const BOT = 394;
/** the wavy border between epidermis and dermis (papillae point up) */
const base = (x: number) => 101 - 7 * Math.cos((2 * Math.PI * (x - X0)) / 46.4);
const PAP = [217, 263.4, 309.8];

function basePath(dir: 1 | -1) {
  const pts: string[] = [];
  for (let k = 0; k <= 58; k++) {
    const x = dir === 1 ? X0 + (k * (X1 - X0)) / 58 : X1 - (k * (X1 - X0)) / 58;
    pts.push(`${f1(x)} ${f1(base(x))}`);
  }
  return pts.join(" L");
}

// hair follicle: from the bulb B up to the skin surface S
const B: [number, number] = [160, 252];
const S: [number, number] = [186, TOP];
const len = Math.hypot(S[0] - B[0], S[1] - B[1]);
const ux = (S[0] - B[0]) / len;
const uy = (S[1] - B[1]) / len;
const nx = -uy;
const ny = ux;
const fol = (t: number, o: number): [number, number] => [B[0] + ux * len * t + nx * o, B[1] + uy * len * t + ny * o];
const P = (p: [number, number]) => `${f1(p[0])} ${f1(p[1])}`;

const ITEMS: Callout[] = [
  { t: "chlup", x: 150, y: 24, tx: 202, ty: 22, anchor: "end" },
  { t: "mazová žláza", x: 8, y: 140, tx: 200, ty: 140, b: [206, 114] },
  { t: "vzpřimovač chlupu", x: 8, y: 166, tx: 191, ty: 170, b: [224, 190] },
  { t: "vlasový váček", x: 8, y: 238, tx: 162, ty: 222 },
  { t: "pór", x: 364, y: 40, tx: 287, ty: 63 },
  { t: "rohová vrstva", x: 364, y: 66, tx: 346, ty: 66 },
  { t: "nervová zakončení", x: 364, y: 96, tx: 241, ty: 86 },
  { t: "hmatové tělísko", x: 364, y: 124, tx: 312, ty: 114 },
  { t: "tepénka", x: 364, y: 218, tx: 348, ty: 230, cls: "bz6-red-t" },
  { t: "žilka", x: 364, y: 246, tx: 348, ty: 244, cls: "bz6-blue-t" },
  { t: "potní žláza", x: 364, y: 290, tx: 304, ty: 286 },
  { t: "tlakové tělísko", x: 364, y: 336, tx: 346, ty: 336 },
  { t: "tukové buňky", x: 364, y: 380, tx: 312, ty: 376 },
];

function Skin({ narrow }: { narrow: boolean }) {
  const { id } = useFig();
  const epi = `M${X0} ${TOP} L${X1} ${TOP} L${basePath(-1)} Z`;
  const derm = `M${basePath(1)} L${X1} ${DERM} L${X0} ${DERM}Z`;
  const sub = `M${X0} ${DERM} H${X1} V${BOT} H${X0}Z`;
  // fat cells
  const r = rng(7);
  const fat: [number, number, number][] = [];
  for (let row = 0; row < 6; row++)
    for (let k = 0; k < 11; k++) {
      const x = X0 + 12 + k * 21.5 + (row % 2 ? 10 : 0) + (r() - 0.5) * 3;
      const y = DERM + 14 + row * 21 + (r() - 0.5) * 3;
      if (x > X1 - 10 || y > BOT - 9) continue;
      if (Math.hypot(x - 330, y - 336) < 26) continue;
      fat.push([x, y, 9.5 + r() * 1.5]);
    }
  // follicle outline
  const folL = `M${P(fol(0.02, -11))} L${P(fol(1, -10))}`;
  const folR = `M${P(fol(0.02, 11))} L${P(fol(1, 10))}`;
  // sweat gland coil + duct
  const coil: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const a = (k / 60) * Math.PI * 7;
    const rr = 13 + 5 * Math.sin(k * 0.7);
    coil.push(`${f1(304 + Math.cos(a) * rr)} ${f1(286 + Math.sin(a) * rr * 0.65)}`);
  }
  const duct: string[] = [];
  for (let k = 0; k <= 40; k++) {
    const y = 276 - (k / 40) * (276 - TOP);
    const amp = y < 104 ? 4 : 2;
    duct.push(`${f1(296 - ((276 - y) / 214) * 9 + amp * Math.sin(k * (y < 104 ? 1.6 : 0.7)))} ${f1(y)}`);
  }
  return (
    <>
      {/* layers */}
      <path d={sub} className="bz6-fatbg" />
      {fat.map(([x, y, rr], i) => (
        <circle key={i} cx={f1(x)} cy={f1(y)} r={f1(rr)} className="bz6-fat" />
      ))}
      <path d={derm} className="bz6-dermis" />
      <path d={derm} fill={pat(id, "dots")} opacity={0.5} />
      {/* collagen fibres */}
      {[150, 176, 206, 232].map((y, i) => (
        <path
          key={y}
          d={`M${X0 + 4} ${y} q14 ${i % 2 ? -5 : 5} 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0`}
          className="bz6-fibre"
        />
      ))}
      <path d={epi} className="bz6-flesh" />
      <path d={epi} fill={pat(id, "d")} opacity={0.35} />
      <path d={`M${X0} ${TOP} H${X1} V${TOP + 8} H${X0}Z`} className="bz6-corneum" />
      <path d={`M${X0} ${TOP} H${X1} V${TOP + 8} H${X0}Z`} fill={pat(id, "h")} />
      <path d={`M${basePath(1)}`} className="bz6-o bz6-thin" />
      {/* blood vessels with capillary loops into the papillae */}
      <path d={`M${X0} 230 Q${X0 + 60} 224 ${X0 + 116} 230 T${X1} 230`} className="bz6-artery" />
      <path d={`M${X0} 244 Q${X0 + 60} 250 ${X0 + 116} 244 T${X1} 244`} className="bz6-vein" />
      {PAP.map((x) => (
        <g key={x}>
          <path d={`M${x - 4} 229 C${x - 6} 160 ${x - 5} 112 ${x} 108`} className="bz6-cap-a" />
          <path d={`M${x} 108 C${x + 5} 112 ${x + 6} 160 ${x + 4} 245`} className="bz6-cap-v" />
        </g>
      ))}
      {/* nerve with its endings */}
      <path d={`M${X0} 258 C200 262 260 254 ${X1} 260`} className="bz6-nerve" />
      <path d="M241 258 C238 200 244 140 241 104 M241 104 L234 84 M241 104 L242 82 M241 104 L249 86" className="bz6-nerve bz6-nerve-fine" />
      <path d="M312 259 C318 200 314 150 312 120" className="bz6-nerve bz6-nerve-fine" />
      <path d="M330 262 C334 290 332 310 330 324" className="bz6-nerve bz6-nerve-fine" />
      {/* touch corpuscle in a papilla */}
      <ellipse cx={312} cy={114} rx={4.5} ry={8} className="bz6-o bz6-thin bz6-corp" />
      {[-4, 0, 4].map((d) => (
        <path key={d} d={`M308 ${114 + d} H316`} className="bz6-o bz6-hair" />
      ))}
      {/* pressure (lamellar) corpuscle in the subcutis */}
      {[18, 14, 10, 6].map((rx, i) => (
        <ellipse key={rx} cx={330} cy={336} rx={rx} ry={rx * 0.62} className={`bz6-o bz6-hair ${i === 0 ? "bz6-corp" : ""}`} />
      ))}
      {/* sweat gland and duct */}
      <path d={coil.map((c, i) => (i ? "L" : "M") + c).join(" ")} className="bz6-sweat" />
      <path d={"M" + duct.join(" L")} className="bz6-sweat" />
      <path d="M282 62 Q287 70 292 62" className="bz6-o bz6-thin bz6-paper-f" />
      {/* hair follicle, sebaceous gland, arrector muscle */}
      <path d={`M${P(fol(0.02, -11))} L${P(fol(1, -10))} L${P(fol(1, 10))} L${P(fol(0.02, 11))}Z`} className="bz6-follicle" />
      <path d={folL} className="bz6-o" />
      <path d={folR} className="bz6-o" />
      <ellipse cx={B[0]} cy={B[1] + 4} rx={13} ry={11} className="bz6-o bz6-follicle" />
      <path d={`M${B[0] - 5} ${B[1] + 15} Q${B[0]} ${B[1] + 2} ${B[0] + 5} ${B[1] + 15}`} className="bz6-o bz6-thin bz6-dermis" />
      <path
        d="M184 144 C188 128 204 126 210 136 C220 140 216 156 206 160 C198 166 186 162 184 152"
        className="bz6-o bz6-sebum"
      />
      <path d="M181 190 C196 160 212 130 222 104" className="bz6-muscle" />
      <path d={`M${P(fol(0.06, 0))} L${P(fol(1, 0))} L210 4`} className="bz6-hairshaft" />
      {/* outline of the block */}
      <path d={`M${X0} ${TOP} V${BOT} H${X1} V${TOP}`} className="bz6-o" />
      <path d={`M${X0} ${TOP} H${X1}`} className="bz6-o" />
      <path d={`M${X0} ${DERM} H${X1}`} className="bz6-o bz6-thin bz6-dash" />
      {/* layer brackets */}
      <Fade delay={0.3}>
        {[
          [TOP, 100, "pokožka"],
          [104, DERM - 2, "škára"],
          [DERM + 2, BOT, narrow ? "podkoží" : "podkožní vazivo"],
        ].map(([a, b, t]) => (
          <g key={t as string}>
            <path d={`M118 ${a} H114 V${b} H118`} className="bz6-o bz6-thin" />
            <text
              x={narrow ? 108 : 108}
              y={((a as number) + (b as number)) / 2 + 5}
              textAnchor="end"
              className={`bz6-lbl bz6-b ${narrow ? "bz6-layer-n" : ""}`}
            >
              {t}
            </text>
          </g>
        ))}
      </Fade>
      <Fade delay={0.6}>
        <Callouts items={narrow ? ITEMS : ITEMS} narrow={narrow} />
      </Fade>
    </>
  );
}

export default function SkinSection() {
  const cmp = useCompact(520);
  return (
    <Figure
      label={LABEL}
      level={6}
      w={cmp.narrow ? 372 : 480}
      h={404}
      max={640}
      compact={cmp}
      boost={false}
      controls={cmp.narrow ? <Legend items={ITEMS} /> : undefined}
    >
      <g transform={cmp.narrow ? "translate(-10 0)" : undefined}>
        <Skin narrow={cmp.narrow} />
      </g>
    </Figure>
  );
}
