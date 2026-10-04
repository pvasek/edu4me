import { Dashed, Fade, Frame, Lbl, Plates, pat, useFig, type P2 } from "./kit";

const LABEL =
  "Přizpůsobení ptáka k letu. Kostra holuba z boku: lehká lebka se zobákem bez zubů, dlouhý ohebný krk, křídlo z pažní kosti, kostí předloktí a srostlých kostí ruky, hrudní kost s vysokým hřebenem (kýlem), na kterém jsou upnuty silné létací svaly, srostlá pánev a krátký ocasní pygostyl. Na plíce navazují vzdušné vaky, které zasahují i do kostí. Výřezy: dutá kost má tenkou stěnu vyztuženou příčkami a uvnitř vzduch, takže je lehká a pevná. Pero má osten a prapor z větví; větve nesou paprsky s háčky, které se do sebe zaklesnou jako suchý zip.";

const bone = "bz2-o bz2-bone";

function Skeleton() {
  const { id } = useFig();
  // neck: vertebrae along a curve from the skull to the shoulders
  const neck: P2[] = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const u = 1 - t;
    return [u * u * 96 + 2 * u * t * 128 + t * t * 146, u * u * 108 + 2 * u * t * 108 + t * t * 140];
  });
  return (
    <Frame w={400} h={330} row="span 2">
      {/* air sacs and lungs (behind the bones) */}
      <Fade delay={0.6}>
        <ellipse cx={128} cy={136} rx={16} ry={11} className="bz2-o bz2-thin bz2-airsac" />
        <ellipse cx={180} cy={184} rx={24} ry={15} className="bz2-o bz2-thin bz2-airsac" />
        <ellipse cx={222} cy={186} rx={22} ry={15} className="bz2-o bz2-thin bz2-airsac" />
        <ellipse cx={262} cy={176} rx={24} ry={18} className="bz2-o bz2-thin bz2-airsac" />
        <ellipse cx={204} cy={156} rx={26} ry={8} className="bz2-o bz2-thin bz2-lung" />
        <Dashed d="M164 128 Q172 104 184 90" className="bz2-o bz2-airsac-s bz2-dash" />
      </Fade>
      {/* wing raised: humerus → radius + ulna → hand */}
      <path d="M158 134 L192 82" className={bone} style={{ strokeWidth: 7 }} />
      <path d="M158 134 L192 82" className="bz2-bone-s" style={{ strokeWidth: 4.4 }} />
      <path d="M192 82 L252 42 M196 88 L254 50" className="bz2-o" style={{ strokeWidth: 3.4 }} />
      <path d="M252 42 L306 30 L338 24 M256 48 L304 34" className="bz2-o" style={{ strokeWidth: 3 }} />
      {/* skull + beak */}
      <path d="M62 94 L22 104 L62 108Z" className="bz2-o bz2-gold" />
      <circle cx={80} cy={98} r={19} className={bone} />
      <circle cx={76} cy={96} r={9} className="bz2-o bz2-fill2" />
      {/* neck vertebrae */}
      {neck.map(([x, y], i) => (
        <rect key={i} x={x - 5} y={y - 4} width={10} height={8} rx={2.5} transform={`rotate(${30 + i * 4} ${x} ${y})`} className={bone} />
      ))}
      {/* back (fused vertebrae) and pelvis */}
      <path d="M146 140 L240 146" className="bz2-o" style={{ strokeWidth: 5 }} />
      <path d="M228 134 Q270 126 304 146 Q276 162 232 158Z" className={bone} />
      <path d="M228 134 Q270 126 304 146 Q276 162 232 158Z" fill={pat(id, "d")} />
      <path d="M304 146 L326 132 L322 152Z" className={bone} />
      {/* ribs */}
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${162 + k * 16} 142 Q${158 + k * 16} 176 ${166 + k * 16} ${200 + k * 1.5}`} className="bz2-o" style={{ strokeWidth: 2 }} />
      ))}
      {/* sternum with keel */}
      <path d="M150 198 L248 206 L240 216 L190 268 L156 214Z" className={bone} />
      <path d="M150 198 L248 206 L240 216 L190 268 L156 214Z" fill={pat(id, "b")} />
      <path d="M156 214 L240 216" className="bz2-o bz2-thin" />
      {/* coracoid + furcula */}
      <path d="M152 138 L154 198" className="bz2-o" style={{ strokeWidth: 4 }} />
      <path d="M146 136 Q132 170 140 190 Q146 172 150 140" className="bz2-o bz2-bone" />
      {/* leg */}
      <path d="M270 158 L250 200 L286 254 L272 296" className="bz2-o" style={{ strokeWidth: 5 }} />
      <path d="M272 296 L240 304 M272 296 L250 308 M272 296 L262 310 M272 296 L292 302" className="bz2-o" style={{ strokeWidth: 2.4 }} />
      <circle cx={270} cy={158} r={4} className={bone} />
      {/* labels */}
      <Fade delay={0.3}>
        <Lbl x={6} y={66} tx={40} ty={102} className="bz2-sm">zobák bez zubů</Lbl>
        <Lbl x={6} y={160} tx={112} ty={118} className="bz2-sm">ohebný krk</Lbl>
        <Lbl x={6} y={250} tx={176} ty={240} className="bz2-b bz2-lvl-t">hřeben (kýl)</Lbl>
        <Lbl x={6} y={270} className="bz2-sm bz2-muted-t">sem jsou upnuty létací svaly</Lbl>
        <Lbl x={206} y={60} tx={176} ty={106} className="bz2-sm">pažní kost</Lbl>
        <Lbl x={262} y={18} tx={300} ty={32} className="bz2-sm" sec>srostlé kosti ruky</Lbl>
        <Lbl x={6} y={206} tx={140} ty={182} className="bz2-sm" sec>vidlice</Lbl>
        <Lbl x={396} y={96} tx={262} ty={168} anchor="end" lx={350} ly={104} className="bz2-sm bz2-blue-t bz2-b">vzdušné vaky</Lbl>
        <Lbl x={396} y={196} tx={232} ty={154} anchor="end" lx={350} ly={190} className="bz2-sm bz2-red-t">plíce</Lbl>
        <Lbl x={396} y={130} tx={300} ty={146} anchor="end" lx={340} ly={136} className="bz2-sm">srostlá pánev</Lbl>
        <Lbl x={396} y={262} tx={280} ty={276} anchor="end" lx={340} ly={262} className="bz2-sm" sec>běhák</Lbl>
      </Fade>
    </Frame>
  );
}

function HollowBone() {
  const { id } = useFig();
  const struts = Array.from({ length: 8 }, (_, i) => {
    const x = 36 + i * 22;
    return `M${x} 44 L${x + 11} 86 M${x + 11} 86 L${x + 22} 44`;
  });
  return (
    <Frame w={240} h={150} title="dutá kost">
      <path d="M20 40 Q8 40 8 54 V76 Q8 90 20 90 H220 Q232 90 232 76 V54 Q232 40 220 40Z" className={bone} />
      <path d="M20 40 Q8 40 8 54 V76 Q8 90 20 90 H220 Q232 90 232 76 V54 Q232 40 220 40Z" fill={pat(id, "d")} />
      <rect x={18} y={46} width={204} height={38} rx={6} className="bz2-o bz2-thin bz2-airsac" />
      <path d={struts.join(" ")} className="bz2-o" style={{ strokeWidth: 1.6 }} />
      <Lbl x={30} y={124} tx={60} ty={88} className="bz2-sm">tenká stěna</Lbl>
      <Lbl x={140} y={124} tx={136} ty={70} className="bz2-sm">výztuhy</Lbl>
      <Lbl x={120} y={24} tx={100} ty={50} className="bz2-sm bz2-blue-t" anchor="middle">vzduch uvnitř</Lbl>
    </Frame>
  );
}

function Feather() {
  // contour feather on the left, a zoom of barbs with hooked barbules on the right
  const barbs = Array.from({ length: 13 }, (_, i) => {
    const y = 34 + i * 10;
    const w = 26 - Math.abs(i - 5) * 1.6;
    return `M60 ${y + 6} Q${60 - w * 0.6} ${y} ${60 - w} ${y - 4} M60 ${y + 6} Q${60 + w * 0.7} ${y} ${60 + w * 1.15} ${y - 4}`;
  });
  return (
    <Frame w={240} h={200} title="stavba pera">
      <path d="M60 28 Q30 40 30 100 Q34 150 60 168 Q92 150 94 100 Q96 40 60 28Z" className="bz2-o bz2-feather" />
      <path d={barbs.join(" ")} className="bz2-o bz2-hair" />
      <path d="M60 24 V194" className="bz2-o" style={{ strokeWidth: 2.4 }} />
      {/* zoom ring */}
      <circle cx={84} cy={90} r={10} className="bz2-zoom" />
      <path d="M94 88 L140 54 M92 98 L140 150" className="bz2-zoom" />
      <rect x={140} y={40} width={96} height={124} rx={10} className="bz2-o bz2-thin bz2-fill" />
      {[0, 1, 2].map((k) => {
        const y = 70 + k * 36;
        return (
          <g key={k}>
            <path d={`M146 ${y} L230 ${y - 10}`} className="bz2-o" style={{ strokeWidth: 2 }} />
            {Array.from({ length: 7 }, (_, j) => {
              const x = 152 + j * 11;
              const yy = y - (x - 146) * 0.12;
              return (
                <g key={j}>
                  <path d={`M${x} ${yy} l6 12 l3 -2`} className="bz2-o bz2-hair" />
                  <path d={`M${x} ${yy} l6 -12`} className="bz2-o bz2-hair" />
                </g>
              );
            })}
          </g>
        );
      })}
      <Lbl x={8} y={196} tx={58} ty={180} className="bz2-sm">osten</Lbl>
      <Lbl x={4} y={22} tx={44} ty={60} className="bz2-sm">prapor</Lbl>
      <Lbl x={186} y={30} anchor="middle" className="bz2-sm bz2-b">větve</Lbl>
      <Lbl x={188} y={186} anchor="middle" className="bz2-sm bz2-lvl-t">paprsky s háčky</Lbl>
    </Frame>
  );
}

export default function BirdFlight() {
  return (
    <Plates label={LABEL} level={5} max={760} cols="1.55fr 1fr" stackBelow={600}>
      <Skeleton />
      <HollowBone />
      <Feather />
    </Plates>
  );
}
