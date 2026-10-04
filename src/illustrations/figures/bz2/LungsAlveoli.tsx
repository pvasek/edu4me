import { DrawArrow, Eq, Fade, Frame, Lbl, Plates, blob, pat, useFig, useLive, type P2 } from "./kit";

const LABEL =
  "Dýchací soustava a plicní sklípek. Vzduch jde nosní dutinou, hltanem a hrtanem do průdušnice zpevněné chrupavčitými prstenci, ta se dělí na dvě průdušky a ty se dál větví na stále tenčí průdušinky, jako koruna stromu obrácená vzhůru nohama. Na jejich konci jsou hrozníčky plicních sklípků. Pravá plíce má tři laloky, levá dva, protože vedle ní leží srdce. Pod plícemi je klenutá bránice, hlavní dýchací sval. Výřez: plicní sklípek obtočený vlásečnicí; kyslík přechází ze vzduchu ve sklípku do krve, oxid uhličitý z krve do sklípku. Vzduch a krev dělí jen dvě tenké vrstvy buněk.";

/** A branching bronchial tree from (x, y) going in direction a (radians). */
function tree(x: number, y: number, a: number, len: number, depth: number, out: string[]) {
  const x2 = x + Math.cos(a) * len;
  const y2 = y + Math.sin(a) * len;
  out.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`);
  if (depth > 0) {
    tree(x2, y2, a - 0.5, len * 0.68, depth - 1, out);
    tree(x2, y2, a + 0.45, len * 0.68, depth - 1, out);
  }
}

function Airways() {
  const { id } = useFig();
  const L = 150; // body axis
  const right: P2[] = [[136, 136], [104, 128], [72, 170], [58, 250], [64, 312], [118, 314], [140, 290], [142, 200]];
  const left: P2[] = [[164, 136], [196, 128], [228, 170], [242, 250], [236, 312], [190, 314], [168, 294], [186, 260], [166, 240], [158, 200]];
  const tR: string[] = [];
  const tL: string[] = [];
  tree(136, 180, Math.PI * 0.68, 34, 3, tR);
  tree(164, 180, Math.PI * 0.32, 34, 3, tL);
  return (
    <Frame w={320} h={350}>
      {/* head profile: nasal cavity, pharynx, larynx */}
      <path d="M118 10 Q150 0 182 12 Q196 34 190 56 L178 64 L176 92 L124 92 L122 64 Q108 44 118 10Z" className="bz2-o bz2-flesh" />
      <path d="M126 30 Q146 22 168 30 L170 40 Q148 36 128 42Z" className="bz2-o bz2-air" />
      <path d="M160 40 Q170 52 160 64 L156 92 L146 92 L146 64" className="bz2-o bz2-air" />
      {/* trachea with rings */}
      <rect x={L - 9} y={92} width={18} height={70} rx={4} className="bz2-o bz2-air" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${L - 9} ${98 + i * 8} H${L + 9}`} className="bz2-o bz2-cartring" />
      ))}
      {/* lungs */}
      <path d={blob(right)} className="bz2-o bz2-lungtissue" />
      <path d={blob(right)} fill={pat(id, "dots")} />
      <path d={blob(left)} className="bz2-o bz2-lungtissue" />
      <path d={blob(left)} fill={pat(id, "dots")} />
      {/* lobes: right 3, left 2 */}
      <path d="M68 200 Q100 194 140 216 M62 262 Q100 250 140 252" className="bz2-o bz2-thin" />
      <path d="M232 214 Q200 230 164 226" className="bz2-o bz2-thin" />
      {/* bronchi + bronchioles */}
      <path d={`M${L} 160 L136 180 M${L} 160 L164 180`} className="bz2-o" style={{ strokeWidth: 7 }} />
      <path d={`M${L} 160 L136 180 M${L} 160 L164 180`} className="bz2-airline" style={{ strokeWidth: 4 }} />
      <path d={tR.join(" ")} className="bz2-o bz2-bronch" />
      <path d={tL.join(" ")} className="bz2-o bz2-bronch" />
      {/* diaphragm */}
      <path d="M40 336 Q70 300 112 318 Q150 330 188 318 Q230 300 262 336" className="bz2-o bz2-diaphragm" style={{ strokeWidth: 6 }} />
      <Lbl x={204} y={24} tx={168} ty={34} className="bz2-sm">nosní dutina</Lbl>
      <Lbl x={204} y={60} tx={164} ty={58} className="bz2-sm" sec>hltan</Lbl>
      <Lbl x={204} y={86} tx={156} ty={86} className="bz2-sm">hrtan</Lbl>
      <Lbl x={6} y={110} tx={L - 10} ty={122} className="bz2-sm bz2-b">průdušnice</Lbl>
      <Lbl x={204} y={124} tx={160} ty={172} className="bz2-sm">průdušky</Lbl>
      <Lbl x={316} y={190} tx={210} ty={236} anchor="end" lx={290} ly={196} className="bz2-sm">průdušinky</Lbl>
      <Lbl x={6} y={180} className="bz2-sm bz2-b">pravá plíce</Lbl>
      <Lbl x={6} y={198} className="bz2-xs bz2-muted-t" sec>3 laloky</Lbl>
      <Lbl x={316} y={290} anchor="end" className="bz2-sm bz2-b">levá plíce</Lbl>
      <Lbl x={316} y={308} anchor="end" className="bz2-xs bz2-muted-t" sec>2 laloky</Lbl>
      <Lbl x={160} y={346} anchor="middle" className="bz2-sm bz2-b bz2-lvl-t">bránice</Lbl>
    </Frame>
  );
}

function Alveolus() {
  const live = useLive();
  return (
    <Frame w={300} h={300} title="plicní sklípek">
      {/* the end of a bronchiole with a cluster of alveoli */}
      <path d="M18 40 L76 92" className="bz2-o" style={{ strokeWidth: 12 }} />
      <path d="M18 40 L76 92" className="bz2-airline" style={{ strokeWidth: 9 }} />
      <circle cx={150} cy={150} r={70} className="bz2-o bz2-alv" />
      <circle cx={88} cy={102} r={24} className="bz2-o bz2-alv" />
      <circle cx={102} cy={202} r={28} className="bz2-o bz2-alv" />
      {/* capillary wrapping the alveolus: blue in → red out */}
      <g className={live ? "bz2-live" : ""}>
        <path d="M60 260 Q140 250 196 222 Q240 190 232 140" className="bz2-capil bz2-capil-deoxy" />
        <path d="M232 140 Q226 90 186 76 Q150 64 140 30 L150 6" className="bz2-capil bz2-capil-oxy" />
        <path d="M60 260 Q140 250 196 222 Q240 190 232 140 Q226 90 186 76 Q150 64 140 30" className="bz2-flow bz2-flow-light" />
      </g>
      {/* gas exchange */}
      <DrawArrow d="M168 130 Q196 118 214 98" tone="oxy" delay={0.5} />
      <DrawArrow d="M222 192 Q196 186 176 170" tone="deoxy" delay={0.8} />
      <Fade delay={0.9}>
        <Eq x={150} y={150} t="O_{2}" anchor="middle" className="bz2-gas bz2-red-t" />
        <Eq x={150} y={176} t="CO_{2}" anchor="middle" className="bz2-gas bz2-blue-t" />
      </Fade>
      <text x={150} y={110} textAnchor="middle" className="bz2-lbl bz2-sm">vzduch</text>
      <Lbl x={294} y={288} tx={150} ty={250} anchor="end" lx={240} ly={278} className="bz2-sm bz2-blue-t">odkysličená krev</Lbl>
      <Lbl x={294} y={24} tx={150} ty={22} anchor="end" className="bz2-sm bz2-red-t bz2-b">okysličená krev</Lbl>
      <Lbl x={6} y={300} tx={200} ty={216} lx={70} ly={290} className="bz2-sm" sec>vlásečnice</Lbl>
      <Lbl x={6} y={24} tx={30} ty={50} className="bz2-sm" sec>průdušinka</Lbl>
    </Frame>
  );
}

export default function LungsAlveoli() {
  return (
    <Plates label={LABEL} level={6} max={760} cols="1.1fr 1fr" stackBelow={600}>
      <Airways />
      <Alveolus />
    </Plates>
  );
}
