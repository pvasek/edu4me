import {
  Draw,
  Fade,
  Frame,
  Lbl,
  Plates,
  Pop,
  blob,
  pat,
  useFig,
  type P2,
} from "./kit";

const LABEL =
  "Nezmar zelený v podélném řezu. Trubicovité tělo je přichycené nohou k vodní rostlině, nahoře je ústní otvor obklopený rameny (chapadly) s žahavými buňkami. Stěna těla má dvě vrstvy buněk: vnější pokožku a vnitřní vrstvu, mezi nimi je rosolovitá mezoglea. Uvnitř je láčka, trávicí dutina s jediným otvorem. Na boku raší pupen, nový nezmar. Výřez ukazuje žahavou buňku: v klidu je v ní tobolka se stočeným vláknem, po dotyku spouštěcí brvy vlákno vystřelí a zabodne se do kořisti.";

// body wall: outer U, inner U (open at the mouth)
const OUT: P2[] = [
  [141, 112],
  [128, 128],
  [124, 200],
  [127, 280],
  [130, 345],
  [150, 362],
  [170, 345],
  [173, 280],
  [176, 200],
  [172, 128],
  [159, 112],
];
const IN: P2[] = [
  [147, 116],
  [138, 132],
  [136, 200],
  [138, 280],
  [140, 333],
  [150, 344],
  [160, 333],
  [162, 280],
  [164, 200],
  [162, 132],
  [153, 116],
];
const MID: P2[] = OUT.map((p, i) => [(p[0] + IN[i][0]) / 2, (p[1] + IN[i][1]) / 2]);

function wallPath(a: P2[], b: P2[]) {
  // smooth outer edge, smooth inner edge back
  const outer = blob(a, false);
  const inner = blob([...b].reverse(), false).replace(/^M/, "L");
  return `${outer} ${inner}Z`;
}

const TENTACLES: string[] = [
  "M136 120 Q104 84 70 70 Q48 62 34 40",
  "M140 116 Q122 72 112 34",
  "M146 113 Q146 70 140 24",
  "M154 113 Q158 66 172 26",
  "M160 116 Q182 76 214 52",
  "M164 120 Q200 100 238 98 Q262 98 282 84",
];

function Hydra() {
  const { id } = useFig();
  const ecto = wallPath(OUT, MID);
  const endo = wallPath(MID, IN);
  const cavity = blob(IN, false) + "Z";
  return (
    <Frame w={320} h={410}>
      {/* water-plant stem */}
      <path d="M40 386 Q160 352 300 380 L300 394 Q160 368 40 400Z" className="bz2-o bz2-leaf" />
      <path d="M40 386 Q160 352 300 380 L300 394 Q160 368 40 400Z" fill={pat(id, "d")} />
      {/* tentacles: hollow tubes with batteries of stinging cells */}
      {TENTACLES.map((d, i) => (
        <g key={i}>
          <Draw d={d} className="bz2-o" delay={0.1 * i} style={{ strokeWidth: 6.5 }} />
          <Draw d={d} className="bz2-tent" delay={0.1 * i} />
        </g>
      ))}
      <Fade delay={0.9}>
        {TENTACLES.map((d, i) => {
          // dots along the tentacle, sampled on the path end points (approx.)
          const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
          const pts: P2[] = [];
          for (let k = 0; k + 1 < nums.length; k += 2) pts.push([nums[k], nums[k + 1]]);
          const a = pts[0];
          const b = pts[pts.length - 1];
          return Array.from({ length: 5 }, (_, j) => {
            const t = 0.3 + j * 0.15;
            const c = pts[1];
            const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * (pts.length > 3 ? pts[2][0] : b[0]);
            const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * (pts.length > 3 ? pts[2][1] : b[1]);
            return <circle key={`${i}-${j}`} cx={x} cy={y} r={2} className="bz2-o bz2-hair bz2-lvl-f" />;
          });
        })}
      </Fade>
      {/* cavity (láčka) */}
      <path d={cavity} className="bz2-water" />
      {/* two cell layers and the mesoglea between */}
      <path d={ecto} className="bz2-o bz2-flesh" />
      <path d={ecto} fill={pat(id, "b")} className="bz2-nohit" />
      <path d={endo} className="bz2-o bz2-lvlmid-f" />
      <path d={endo} fill={pat(id, "dots")} className="bz2-nohit" />
      <path d={blob(MID, false)} className="bz2-meso" />
      {/* bud: a small new hydra growing from the side */}
      <path d="M174 244 Q198 238 210 214 L224 222 Q208 260 174 274Z" className="bz2-o bz2-flesh" />
      <path d="M174 244 Q198 238 210 214 L224 222 Q208 260 174 274Z" fill={pat(id, "b")} className="bz2-nohit" />
      <path d="M176 254 Q198 248 214 222" className="bz2-o bz2-thin bz2-water" fill="none" />
      <path d="M210 214 Q202 198 192 194 M216 216 Q220 198 228 190 M223 221 Q236 212 246 214" className="bz2-o" style={{ strokeWidth: 2.4 }} />
      {/* prey caught by a tentacle: a water flea */}
      <g transform="translate(26 34) rotate(-20)">
        <ellipse cx={0} cy={0} rx={11} ry={8} className="bz2-o bz2-fill2" />
        <circle cx={-6} cy={-2} r={2} className="bz2-ink-f" />
        <path d="M-8 -6 L-16 -14 M-8 -6 L-4 -16" className="bz2-o bz2-thin" />
      </g>
      {/* labels */}
      <Lbl x={8} y={124} tx={118} ty={95} className="bz2-b">rameno</Lbl>
      <Lbl x={210} y={132} tx={152} ty={114} className="bz2-b">ústní otvor</Lbl>
      <Lbl x={10} y={196} tx={150} ty={196} className="bz2-b">láčka</Lbl>
      <Lbl x={10} y={250} tx={126} ty={250}>pokožka</Lbl>
      <Lbl x={10} y={300} tx={137} ty={305} sec>mezoglea</Lbl>
      <Lbl x={206} y={318} tx={163} ty={300}>vnitřní vrstva</Lbl>
      <Lbl x={232} y={256} tx={212} ty={240}>pupen</Lbl>
      <Lbl x={206} y={352} tx={164} ty={355}>noha</Lbl>
      <Lbl x={50} y={24} sec className="bz2-sm bz2-muted-t">kořist</Lbl>
    </Frame>
  );
}

function Cell({ x, fired }: { x: number; fired: boolean }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} 0)`}>
      {/* the cell */}
      <path d="M-34 196 Q-40 140 -26 110 Q0 92 26 110 Q40 140 34 196Z" className="bz2-o bz2-flesh" />
      <ellipse cx={0} cy={180} rx={11} ry={8} className="bz2-o bz2-lvl-f" />
      {/* capsule */}
      <path d="M-14 166 Q-18 136 -8 118 L8 118 Q18 136 14 166Z" className="bz2-o bz2-gold" />
      <path d="M-14 166 Q-18 136 -8 118 L8 118 Q18 136 14 166Z" fill={pat(id, "d")} />
      {fired ? (
        <>
          {/* open lid */}
          <path d="M-8 118 Q-16 108 -22 110" className="bz2-o" />
          <Draw
            d="M0 118 L0 96 L-2 78 L2 58 L-1 38 L1 22"
            className="bz2-o bz2-thread"
            delay={0.6}
          />
          <Fade delay={0.6}>
            <path d="M0 106 L-6 100 M0 106 L6 100 M0 98 L-5 92 M0 98 L5 92" className="bz2-o bz2-thin" />
          </Fade>
          <Pop delay={1.3}>
            <path d="M-26 22 Q-10 6 12 10 Q30 14 26 30 Q8 38 -14 34Z" className="bz2-o bz2-fill2" />
            <path d="M-26 22 Q-10 6 12 10 Q30 14 26 30 Q8 38 -14 34Z" fill={pat(id, "b")} />
          </Pop>
        </>
      ) : (
        <>
          <path d="M-8 118 Q0 112 8 118" className="bz2-o" />
          {/* coiled thread */}
          <path
            d="M0 122 C-10 126 10 132 0 136 C-10 140 10 146 0 150 C-10 154 10 158 0 162"
            className="bz2-o bz2-thin"
          />
          {/* trigger bristle */}
          <path d="M18 104 L26 84" className="bz2-o" style={{ strokeWidth: 2 }} />
        </>
      )}
    </g>
  );
}

function Stinging() {
  return (
    <Frame w={300} h={232} title="žahavá buňka">
      <Cell x={80} fired={false} />
      <Cell x={220} fired />
      <path d="M126 150 H170" className="bz2-arr bz2-arr-lvl" />
      <path d="M164 144 L172 150 L164 156" className="bz2-o bz2-lvl-s" />
      <text x={80} y={222} textAnchor="middle" className="bz2-lbl bz2-b">v klidu</text>
      <text x={220} y={222} textAnchor="middle" className="bz2-lbl bz2-b">výstřel</text>
      <Lbl x={6} y={70} tx={104} ty={96} className="bz2-sm">spouštěcí brva</Lbl>
      <Lbl x={6} y={120} tx={66} ty={144} className="bz2-sm">tobolka</Lbl>
      <Lbl x={250} y={78} tx={221} ty={70} className="bz2-sm" sec>vlákno</Lbl>
    </Frame>
  );
}

export default function CnidarianHydra() {
  return (
    <Plates label={LABEL} level={4} max={720} cols="1.15fr 1fr" replay>
      <Hydra />
      <Stinging />
    </Plates>
  );
}
