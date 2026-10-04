import {
  Dashed,
  DrawArrow,
  Eq,
  Fade,
  Frame,
  Lbl,
  Plates,
  pat,
  useFig,
  useLive,
} from "./kit";

const LABEL =
  "Stavba těla ryby (kapra) z boku. Tělo kryjí šupiny, pohyb řídí ploutve: nepárová hřbetní, ocasní a řitní a párové prsní a břišní. Za hlavou je skřele, pod ní žábry. Podél boku vede postranní čára, smyslový orgán, který vnímá proudění a tlakové vlny ve vodě. V průřezu je vidět plynový měchýř, kterým ryba vyrovnává vztlak. Výřez ukazuje dýchání: ryba nasaje vodu ústy, voda proteče přes žaberní lístky, do krve přejde kyslík, z krve odejde oxid uhličitý a voda vyteče pod skřelemi ven.";

const BODY =
  "M40 122 Q66 70 160 56 Q250 50 330 104 L340 110 L340 136 Q250 184 160 188 Q76 186 40 122Z";

function Fish() {
  const { id } = useFig();
  return (
    <Frame w={420} h={250}>
      {/* fins (behind the body) */}
      <path d="M150 60 L172 20 Q214 24 252 40 L262 70Z" className="bz2-o bz2-fin" />
      <path d="M150 60 L172 20 Q214 24 252 40 L262 70Z" fill={pat(id, "v")} />
      <path d="M336 106 L404 56 Q388 122 404 192 L336 140Z" className="bz2-o bz2-fin" />
      <path d="M336 106 L404 56 Q388 122 404 192 L336 140Z" fill={pat(id, "h")} />
      <path d="M266 164 L280 204 L314 190 L306 150Z" className="bz2-o bz2-fin" />
      <path d="M266 164 L280 204 L314 190 L306 150Z" fill={pat(id, "v")} />
      <path d="M176 186 L194 222 L216 188Z" className="bz2-o bz2-fin" />
      <path d="M176 186 L194 222 L216 188Z" fill={pat(id, "v")} />
      {/* body with scales */}
      <path d={BODY} className="bz2-o bz2-fishbody" />
      <path d={BODY} fill={pat(id, "x")} opacity={0.55} />
      {/* operculum and gills */}
      <path d="M98 74 Q120 120 102 174" className="bz2-o" style={{ strokeWidth: 2 }} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${86 - k * 6} ${92 + k * 2} Q${100 - k * 6} 124 ${88 - k * 6} ${156 - k * 2}`} className="bz2-gill" />
      ))}
      {/* pectoral fin (in front of the body) */}
      <path d="M106 154 L130 198 L144 166Z" className="bz2-o bz2-fin" />
      <path d="M106 154 L130 198 L144 166Z" fill={pat(id, "v")} />
      {/* eye, mouth, nostril */}
      <circle cx={64} cy={104} r={8} className="bz2-o bz2-paper-f" />
      <circle cx={64} cy={104} r={4} className="bz2-ink-f" />
      <path d="M40 122 L56 124" className="bz2-o" />
      {/* swim bladder (cut-away window) */}
      <ellipse cx={212} cy={114} rx={78} ry={32} className="bz2-o bz2-thin bz2-dash bz2-fill" />
      <ellipse cx={176} cy={112} rx={30} ry={18} className="bz2-o bz2-bladder" />
      <ellipse cx={240} cy={114} rx={40} ry={20} className="bz2-o bz2-bladder" />
      <path d="M206 112 H200" className="bz2-o" />
      {/* lateral line */}
      <Dashed d="M108 92 Q150 84 210 86 Q290 90 338 118" className="bz2-latline" delay={0.4} />
      {/* labels */}
      <Lbl x={168} y={14} tx={196} ty={30} className="bz2-sm">hřbetní ploutev</Lbl>
      <Lbl x={418} y={30} tx={398} ty={64} anchor="end" className="bz2-sm">ocasní</Lbl>
      <Lbl x={330} y={234} tx={292} ty={194} className="bz2-sm">řitní</Lbl>
      <Lbl x={204} y={244} tx={194} ty={214} className="bz2-sm">břišní</Lbl>
      <Lbl x={70} y={238} tx={128} ty={190} className="bz2-sm">prsní</Lbl>
      <Lbl x={6} y={52} tx={104} ty={82} className="bz2-b">skřele</Lbl>
      <Lbl x={6} y={210} tx={86} ty={150} className="bz2-sm bz2-red-t">žábry</Lbl>
      <Lbl x={288} y={78} tx={262} ty={88} className="bz2-sm bz2-lvl-t bz2-b">postranní čára</Lbl>
      <Lbl x={230} y={164} tx={232} ty={130} anchor="middle" className="bz2-sm bz2-b">plynový měchýř</Lbl>
      <Lbl x={6} y={84} tx={60} ty={98} className="bz2-sm" sec>oko</Lbl>
    </Frame>
  );
}

function Gills() {
  const live = useLive();
  // side view of the head: water in the mouth → over the gill filaments → out under the operculum
  return (
    <Frame w={300} h={220} title="dýchání žábrami">
      <g className={live ? "bz2-live" : ""}>
        <path d="M30 110 Q60 40 170 36 L176 186 Q60 184 30 110Z" className="bz2-o bz2-fishbody" />
        <path d="M150 40 Q190 110 152 184" className="bz2-o" style={{ strokeWidth: 2 }} />
        {/* gill arch with filaments */}
        <path d="M118 60 Q150 110 120 168" className="bz2-o" style={{ strokeWidth: 3 }} />
        {Array.from({ length: 13 }, (_, i) => {
          const t = i / 12;
          const y = 64 + t * 100;
          const x = 118 + Math.sin(Math.PI * t) * 22;
          return <path key={i} d={`M${x} ${y} l18 ${-2 + t * 4}`} className="bz2-gill" />;
        })}
        {/* water path */}
        <path d="M-2 110 H70 Q110 110 140 90 Q170 70 196 66 L282 66" className="bz2-flow bz2-flow-water" />
        <path d="M-2 110 H70 Q110 110 140 130 Q170 150 196 156 L282 156" className="bz2-flow bz2-flow-water" />
        <DrawArrow d="M6 96 H40" tone="blue" />
        <DrawArrow d="M214 66 H262" tone="blue" delay={0.4} />
        <DrawArrow d="M214 156 H262" tone="blue" delay={0.4} />
      </g>
      <circle cx={70} cy={86} r={6} className="bz2-o bz2-paper-f" />
      <circle cx={70} cy={86} r={3} className="bz2-ink-f" />
      <Fade delay={0.6}>
        <Eq x={4} y={152} t="voda s O_{2}" className="bz2-eq-sm" />
        <Eq x={292} y={52} t="voda ven" anchor="end" className="bz2-eq-sm" />
        <Eq x={292} y={188} t="CO_{2} ven" anchor="end" className="bz2-eq-sm" />
      </Fade>
      <Lbl x={100} y={212} tx={140} ty={150} className="bz2-sm bz2-red-t bz2-b">žaberní lístky: O₂ do krve</Lbl>
      <Lbl x={196} y={20} tx={168} ty={50} className="bz2-sm">skřele</Lbl>
    </Frame>
  );
}

export default function FishAnatomy() {
  return (
    <Plates label={LABEL} level={5} max={760} cols="1.45fr 1fr" stackBelow={620}>
      <Fish />
      <Gills />
    </Plates>
  );
}
