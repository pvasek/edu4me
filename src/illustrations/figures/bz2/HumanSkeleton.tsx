import { Fade, Frame, Lbl, Plates, pat, useFig } from "./kit";

const LABEL =
  "Lidská kostra zepředu s hlavními kostmi: lebka, klíční kost a lopatka (ramenní pletenec), hrudní kost a žebra tvoří hrudník, páteř, pánev, v paži kost pažní, loketní a vřetenní, v noze kost stehenní (nejdelší kost těla), čéška, kost holenní a lýtková. Výřezy: kulovitý kloub (kyčelní), který se hýbe do všech stran, a kladkový kloub (loketní), který se ohýbá jen v jedné rovině jako pant; kloubní hlavice zapadá do kloubní jamky a obě plochy kryje chrupavka. Řez dlouhou kostí: na povrchu okostice, pevná hutná kost, na koncích houbovitá kost s červenou kostní dření, uprostřed dutina se žlutou kostní dření a na kloubních koncích chrupavka.";

const B = "bz2-o bz2-bone";
const C = 200; // body axis

/** A long bone between two points, drawn as a slim shaft with knobbly ends. */
function Long({ a, b, w = 7 }: { a: [number, number]; b: [number, number]; w?: number }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const r = w * 0.95;
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <path
        d={`M${r} ${-w / 2} L${L - r} ${-w / 2} M${r} ${w / 2} L${L - r} ${w / 2}`}
        className="bz2-o"
      />
      <rect x={r * 0.6} y={-w / 2} width={L - r * 1.2} height={w} className="bz2-bone" />
      <path d={`M${r} ${-w / 2} L${L - r} ${-w / 2} M${r} ${w / 2} L${L - r} ${w / 2}`} className="bz2-o" />
      <ellipse cx={r * 0.7} cy={0} rx={r} ry={w * 0.85} className={B} />
      <ellipse cx={L - r * 0.7} cy={0} rx={r} ry={w * 0.85} className={B} />
    </g>
  );
}

function Skeleton() {
  const { id } = useFig();
  const ribs = Array.from({ length: 10 }, (_, i) => i);
  const side = (s: 1 | -1) => (x: number) => C + s * x;
  return (
    <Frame w={400} h={580} row="span 2">
      {/* skull */}
      <ellipse cx={C} cy={50} rx={30} ry={34} className={B} />
      <ellipse cx={C} cy={50} rx={30} ry={34} fill={pat(id, "d")} opacity={0.5} />
      <path d={`M${C - 22} 68 Q${C - 20} 96 ${C} 100 Q${C + 20} 96 ${C + 22} 68`} className={B} />
      <ellipse cx={C - 11} cy={52} rx={8} ry={7} className="bz2-o bz2-fill3" />
      <ellipse cx={C + 11} cy={52} rx={8} ry={7} className="bz2-o bz2-fill3" />
      <path d={`M${C} 60 L${C - 4} 72 H${C + 4}Z`} className="bz2-o bz2-fill3" />
      <path d={`M${C - 12} 84 H${C + 12}`} className="bz2-o bz2-thin" />
      {/* neck vertebrae */}
      {[104, 111, 118].map((y) => (
        <rect key={y} x={C - 6} y={y} width={12} height={6} rx={2} className={B} />
      ))}
      {/* shoulder girdle: scapulae (behind, dashed), clavicles */}
      {([1, -1] as const).map((s) => (
        <g key={s}>
          <path d={`M${side(s)(36)} 128 L${side(s)(62)} 130 L${side(s)(44)} 180Z`} className="bz2-o bz2-thin bz2-dash" fill="none" />
          <path d={`M${side(s)(6)} 126 Q${side(s)(30)} 116 ${side(s)(58)} 124`} className="bz2-o" style={{ strokeWidth: 5 }} />
          <path d={`M${side(s)(6)} 126 Q${side(s)(30)} 116 ${side(s)(58)} 124`} className="bz2-bone-s" style={{ strokeWidth: 2.6 }} />
        </g>
      ))}
      {/* ribs */}
      {ribs.map((i) =>
        ([1, -1] as const).map((s) => {
          const y0 = 132 + i * 9;
          const out = 48 - Math.abs(i - 4) * 1.5;
          const x = side(s);
          return (
            <path
              key={`${i}${s}`}
              d={`M${x(8)} ${y0} C${x(out * 0.8)} ${y0 - 10} ${x(out + 6)} ${y0 + 8} ${x(out - 2)} ${y0 + 22}`}
              className="bz2-o"
              style={{ strokeWidth: 2.4 }}
            />
          );
        }),
      )}
      {/* sternum */}
      <path d={`M${C - 7} 126 H${C + 7} L${C + 6} 204 L${C} 212 L${C - 6} 204Z`} className={B} />
      {/* lumbar spine */}
      {[222, 236, 250, 264].map((y) => (
        <rect key={y} x={C - 9} y={y} width={18} height={11} rx={3} className={B} />
      ))}
      {/* pelvis */}
      <path
        d={`M${C - 12} 278 Q${C - 62} 262 ${C - 62} 290 Q${C - 56} 318 ${C - 32} 326 L${C - 10} 336 L${C + 10} 336 L${C + 32} 326 Q${C + 56} 318 ${C + 62} 290 Q${C + 62} 262 ${C + 12} 278Z`}
        className={B}
      />
      <path
        d={`M${C - 12} 278 Q${C - 62} 262 ${C - 62} 290 Q${C - 56} 318 ${C - 32} 326 L${C - 10} 336 L${C + 10} 336 L${C + 32} 326 Q${C + 56} 318 ${C + 62} 290 Q${C + 62} 262 ${C + 12} 278Z`}
        fill={pat(id, "d")}
        opacity={0.5}
      />
      <path d={`M${C - 12} 278 L${C - 10} 312 L${C} 318 L${C + 10} 312 L${C + 12} 278`} className="bz2-o bz2-thin" />
      <circle cx={C - 22} cy={318} r={7} className="bz2-o bz2-thin bz2-fill" />
      <circle cx={C + 22} cy={318} r={7} className="bz2-o bz2-thin bz2-fill" />
      {/* arms */}
      {([1, -1] as const).map((s) => {
        const x = side(s);
        return (
          <g key={`a${s}`}>
            <Long a={[x(62), 130]} b={[x(76), 236]} w={8} />
            <Long a={[x(74), 240]} b={[x(84), 330]} w={5} />
            <Long a={[x(82), 238]} b={[x(98), 326]} w={5} />
            {/* hand */}
            <path d={`M${x(80)} 334 h${s * 22} v10 h${-s * 22}Z`} className={B} />
            {[0, 1, 2, 3, 4].map((k) => (
              <path key={k} d={`M${x(82 + k * 4.5)} 344 L${x(80 + k * 6)} ${370 - Math.abs(k - 2) * 4}`} className="bz2-o" style={{ strokeWidth: 2.4 }} />
            ))}
          </g>
        );
      })}
      {/* legs */}
      {([1, -1] as const).map((s) => {
        const x = side(s);
        return (
          <g key={`l${s}`}>
            <circle cx={x(36)} cy={300} r={9} className={B} />
            <Long a={[x(40), 304]} b={[x(30), 440]} w={10} />
            <ellipse cx={x(30)} cy={444} rx={7} ry={8} className={B} />
            <Long a={[x(26), 452]} b={[x(26), 548]} w={8} />
            <Long a={[x(40), 454]} b={[x(38), 546]} w={4} />
            <path d={`M${x(18)} 552 h${s * 26} l${s * 8} 18 h${-s * 40}Z`} className={B} />
          </g>
        );
      })}
      <Fade delay={0.3}>
        <Lbl x={8} y={34} tx={C - 28} ty={42} className="bz2-b">lebka</Lbl>
        <Lbl x={8} y={112} tx={C - 34} ty={120} className="bz2-sm">klíční kost</Lbl>
        <Lbl x={8} y={150} tx={C - 3} ty={150} lx={110} ly={146} className="bz2-sm">hrudní kost</Lbl>
        <Lbl x={8} y={196} tx={C - 40} ty={196} className="bz2-sm">žebra</Lbl>
        <Lbl x={8} y={236} tx={C - 9} ty={242} lx={100} ly={232} className="bz2-sm">páteř</Lbl>
        <Lbl x={8} y={278} tx={C - 50} ty={286} className="bz2-sm">pánev</Lbl>
        <Lbl x={8} y={380} tx={C - 35} ty={380} className="bz2-sm bz2-b">stehenní kost</Lbl>
        <Lbl x={8} y={430} tx={C - 36} ty={444} className="bz2-sm">čéška</Lbl>
        <Lbl x={8} y={500} tx={C - 26} ty={500} className="bz2-sm">holenní kost</Lbl>
        <Lbl x={392} y={142} tx={C + 46} ty={150} anchor="end" lx={340} ly={146} className="bz2-sm">lopatka</Lbl>
        <Lbl x={392} y={196} tx={C + 70} ty={190} anchor="end" lx={340} ly={196} className="bz2-sm">pažní kost</Lbl>
        <Lbl x={392} y={276} tx={C + 92} ty={290} anchor="end" lx={350} ly={282} className="bz2-sm">loketní kost</Lbl>
        <Lbl x={392} y={312} tx={C + 80} ty={304} anchor="end" lx={350} ly={312} className="bz2-sm" sec>vřetenní kost</Lbl>
        <Lbl x={392} y={520} tx={C + 39} ty={512} anchor="end" lx={350} ly={516} className="bz2-sm">lýtková kost</Lbl>
      </Fade>
    </Frame>
  );
}

function Joints() {
  const { id } = useFig();
  return (
    <Frame w={300} h={200} title="klouby">
      {/* ball-and-socket (hip) */}
      <g>
        <path d="M24 40 Q70 18 116 40 L110 58 Q70 40 30 58Z" className={B} />
        <path d="M40 54 Q70 30 100 54" className="bz2-o bz2-cart" style={{ strokeWidth: 4 }} />
        <circle cx={70} cy={70} r={24} className={B} />
        <circle cx={70} cy={70} r={24} fill={pat(id, "spongy")} opacity={0.5} />
        <path d="M54 88 L60 150 H80 L86 88" className={B} />
        <path d="M46 70 A24 24 0 0 1 94 70" className="bz2-o bz2-cart" style={{ strokeWidth: 3 }} />
        <path d="M24 112 A46 18 0 1 0 116 112" className="bz2-arr bz2-arr-lvl" />
        <path d="M112 106 L118 113 L110 116" className="bz2-o bz2-lvl-s" />
        <text x={70} y={176} textAnchor="middle" className="bz2-lbl bz2-b">kulovitý</text>
        <text x={70} y={194} textAnchor="middle" className="bz2-lbl bz2-xs bz2-muted-t">kyčel, rameno</text>
      </g>
      {/* hinge (elbow) */}
      <g>
        <path d="M200 20 L206 70 H236 L242 20" className={B} />
        <ellipse cx={221} cy={78} rx={24} ry={14} className={B} />
        <path d="M197 80 A24 14 0 0 0 245 80" className="bz2-o bz2-cart" style={{ strokeWidth: 3 }} />
        <path d="M196 92 Q221 74 246 92 L240 150 H204Z" className={B} />
        <path d="M196 92 Q221 74 246 92" className="bz2-o bz2-cart" style={{ strokeWidth: 3 }} />
        <path d="M270 140 A60 60 0 0 0 268 70" className="bz2-arr bz2-arr-lvl" />
        <path d="M262 76 L268 68 L274 77" className="bz2-o bz2-lvl-s" />
        <text x={221} y={176} textAnchor="middle" className="bz2-lbl bz2-b">kladkový</text>
        <text x={221} y={194} textAnchor="middle" className="bz2-lbl bz2-xs bz2-muted-t">loket, prsty</text>
      </g>
      <Lbl x={134} y={34} tx={92} ty={52} className="bz2-xs" sec>jamka</Lbl>
      <Lbl x={134} y={80} tx={92} ty={74} className="bz2-xs" sec>hlavice</Lbl>
    </Frame>
  );
}

function BoneSection() {
  const { id } = useFig();
  // a long bone in half-section, lying horizontally
  const outer = "M22 70 Q14 40 40 34 Q62 30 74 48 L226 48 Q238 30 260 34 Q286 40 278 70 Q286 100 260 106 Q238 110 226 92 L74 92 Q62 110 40 106 Q14 100 22 70Z";
  return (
    <Frame w={300} h={200} title="řez kostí">
      <path d={outer} className="bz2-o bz2-bone" style={{ strokeWidth: 2.6 }} />
      {/* spongy ends with red marrow */}
      <path d="M28 70 Q22 44 42 40 Q60 38 70 54 L70 86 Q60 102 42 100 Q22 96 28 70Z" className="bz2-redmarrow" />
      <path d="M28 70 Q22 44 42 40 Q60 38 70 54 L70 86 Q60 102 42 100 Q22 96 28 70Z" fill={pat(id, "spongy")} />
      <path d="M272 70 Q278 44 258 40 Q240 38 230 54 L230 86 Q240 102 258 100 Q278 96 272 70Z" className="bz2-redmarrow" />
      <path d="M272 70 Q278 44 258 40 Q240 38 230 54 L230 86 Q240 102 258 100 Q278 96 272 70Z" fill={pat(id, "spongy")} />
      {/* marrow cavity with yellow marrow */}
      <rect x={70} y={57} width={160} height={26} rx={4} className="bz2-o bz2-thin bz2-yolk" />
      {/* compact bone hatching */}
      <rect x={74} y={49} width={152} height={7} fill={pat(id, "dd")} />
      <rect x={74} y={84} width={152} height={7} fill={pat(id, "dd")} />
      {/* cartilage caps */}
      <path d="M22 70 Q14 40 40 34" className="bz2-o bz2-cart" style={{ strokeWidth: 4 }} />
      <path d="M278 70 Q286 100 260 106" className="bz2-o bz2-cart" style={{ strokeWidth: 4 }} />
      {/* periosteum */}
      <path d="M74 45 L226 45" className="bz2-o bz2-lvl-s" style={{ strokeWidth: 1.4 }} />
      <Lbl x={150} y={22} tx={150} ty={45} anchor="middle" className="bz2-xs bz2-lvl-t bz2-b">okostice</Lbl>
      <Lbl x={110} y={130} tx={120} ty={88} className="bz2-xs">hutná kost</Lbl>
      <Lbl x={150} y={160} tx={170} ty={72} anchor="middle" className="bz2-xs">žlutá kostní dřeň</Lbl>
      <Lbl x={8} y={140} tx={44} ty={88} className="bz2-xs">houbovitá kost</Lbl>
      <Lbl x={8} y={160} className="bz2-xs bz2-red-t">s červenou dření</Lbl>
      <Lbl x={292} y={140} tx={274} ty={92} anchor="end" className="bz2-xs" sec>chrupavka</Lbl>
    </Frame>
  );
}

export default function HumanSkeleton() {
  return (
    <Plates label={LABEL} level={6} max={760} cols="1.25fr 1fr" stackBelow={600}>
      <Skeleton />
      <Joints />
      <BoneSection />
    </Plates>
  );
}
