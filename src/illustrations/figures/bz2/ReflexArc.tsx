import { Fade, Figure, Lbl, pat, useClock, useFig, type P2 } from "./kit";

const LABEL =
  "Reflexní oblouk: ruka na horkém hrnci. Receptor v kůži prstu zachytí horko a vznikne vzruch. Dostředivým (smyslovým) neuronem vede vzruch paží do míchy, kde ho přes spojovací neuron převezme odstředivý (pohybový) neuron. Ten vede vzruch zpět paží do svalu (dvojhlavého svalu pažního), sval se stáhne a ruka ucukne. Odpověď vydá mícha, mozek se o bolesti dozví až o zlomek sekundy později.";

const W = 440;
const H = 310;

// impulse paths (polylines)
const SENS: P2[] = [
  [52, 236],
  [100, 226],
  [168, 214],
  [214, 160],
  [262, 106],
  [306, 112],
  [330, 132],
  [352, 156],
];
const MOTOR: P2[] = [
  [352, 156],
  [356, 186],
  [342, 214],
  [300, 222],
  [256, 176],
  [224, 152],
];

const poly = (p: P2[]) => "M" + p.map((q) => q.join(" ")).join(" L");
function along(p: P2[], t: number): P2 {
  const seg = p.slice(1).map((b, i) => Math.hypot(b[0] - p[i][0], b[1] - p[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = d / seg[i];
      return [p[i][0] + (p[i + 1][0] - p[i][0]) * k, p[i][1] + (p[i + 1][1] - p[i][1]) * k];
    }
    d -= seg[i];
  }
  return p[p.length - 1];
}

function Scene() {
  const { id } = useFig();
  const t = useClock(2.4);
  const s = t < 1.1 ? along(SENS, t / 1.1) : null;
  const m = t >= 1.1 && t < 2.1 ? along(MOTOR, (t - 1.1) / 1.0) : null;
  const pulled = t >= 2.1;
  const lift = pulled ? -16 : 0;
  return (
    <g>
      {/* pan on a hot plate */}
      <rect x={18} y={262} width={120} height={10} rx={2} className="bz2-o bz2-hot" />
      <path d="M26 246 H130 L124 262 H32Z" className="bz2-o bz2-steel" />
      <path d="M130 250 H170" className="bz2-o" style={{ strokeWidth: 5 }} />
      {[40, 62, 84, 106].map((x) => (
        <path key={x} d={`M${x} 286 q-5 -6 0 -12 q5 -6 0 -12`} className="bz2-o bz2-heat" transform="translate(0 0)" />
      ))}
      {/* arm: hand, forearm, upper arm with biceps */}
      <g transform={`translate(0 ${lift})`} style={{ transition: "transform 0.25s ease-out" }}>
        <path d="M40 236 Q36 226 48 222 L104 214 L108 236 L58 244 Q42 246 40 236Z" className="bz2-o bz2-flesh" />
        <path d="M104 212 L176 198 L182 226 L108 238Z" className="bz2-o bz2-flesh" />
      </g>
      <path d="M170 200 Q190 150 236 96 L270 112 Q232 160 192 226Z" className="bz2-o bz2-flesh" />
      <path
        d="M186 196 Q196 150 230 116 Q248 120 246 132 Q222 168 206 206Z"
        className={`bz2-o bz2-muscle ${pulled ? "bz2-muscle-on" : ""}`}
      />
      <path d="M186 196 Q196 150 230 116 Q248 120 246 132 Q222 168 206 206Z" fill={pat(id, "v")} opacity={0.5} />
      {/* spinal cord section */}
      <ellipse cx={358} cy={172} rx={56} ry={50} className="bz2-o bz2-cordwhite" />
      <path
        d="M358 150 Q344 126 332 132 Q326 146 342 160 Q330 176 328 196 Q340 206 352 188 L358 182 L364 188 Q376 206 388 196 Q386 176 374 160 Q390 146 384 132 Q372 126 358 150Z"
        className="bz2-o bz2-cordgray"
      />
      <circle cx={358} cy={172} r={3} className="bz2-o bz2-thin bz2-paper-f" />
      {/* dorsal root ganglion */}
      <ellipse cx={318} cy={118} rx={11} ry={8} className="bz2-o bz2-gang" />
      {/* neurons */}
      <path d={poly(SENS)} className="bz2-nerve bz2-nerve-s" />
      <path d="M352 156 Q352 172 354 186" className="bz2-nerve bz2-nerve-i" />
      <path d={poly(MOTOR.slice(1))} className="bz2-nerve bz2-nerve-m" />
      <circle cx={344} cy={198} r={6} className="bz2-o bz2-nerve-m-f" />
      {/* receptor */}
      <circle cx={52} cy={236} r={5} className="bz2-o bz2-gold" />
      {/* to the brain (later) */}
      <path d="M358 122 V20" className="bz2-o bz2-thin bz2-dash" />
      <path d="M352 28 L358 18 L364 28" className="bz2-o bz2-thin" />
      {/* impulse */}
      {s && <circle cx={s[0]} cy={s[1]} r={7} className="bz2-pulse" />}
      {m && <circle cx={m[0]} cy={m[1]} r={7} className="bz2-pulse" />}
      {pulled && (
        <Fade>
          <path d="M80 206 V176" className="bz2-arr bz2-arr-lvl bz2-thick" />
          <path d="M72 184 L80 172 L88 184" className="bz2-o bz2-lvl-s" style={{ strokeWidth: 2.4 }} />
        </Fade>
      )}
      <Lbl x={8} y={300} tx={52} ty={240} lx={40} ly={290} className="bz2-sm bz2-b">receptor v kůži</Lbl>
      <Lbl x={110} y={130} tx={150} ty={218} className="bz2-sm bz2-blue-t bz2-b">dostředivý neuron</Lbl>
      <Lbl x={110} y={110} className="bz2-xs bz2-muted-t">(smyslový)</Lbl>
      <Lbl x={436} y={260} tx={320} ty={222} anchor="end" lx={400} ly={254} className="bz2-sm bz2-red-t bz2-b">odstředivý neuron</Lbl>
      <Lbl x={436} y={278} anchor="end" className="bz2-xs bz2-muted-t">(pohybový)</Lbl>
      <Lbl x={436} y={110} tx={410} ty={160} anchor="end" lx={424} ly={116} className="bz2-sm bz2-b">mícha</Lbl>
      <Lbl x={162} y={70} tx={232} ty={130} className="bz2-sm">sval se stáhne</Lbl>
      <Lbl x={350} y={30} anchor="end" className="bz2-xs bz2-muted-t">do mozku – až potom</Lbl>
    </g>
  );
}

export default function ReflexArc() {
  return (
    <Figure level={6} label={LABEL} w={W} h={H} max={560} replay>
      <Scene />
    </Figure>
  );
}
