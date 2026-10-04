import { Draw, Fade, Frame, Lbl, Num, Plates, pat, useFig } from "./kit";

const LABEL =
  "Trávicí soustava člověka zepředu a co se kde tráví. Trávicí trubice vede z dutiny ústní jícnem do žaludku, pak do tenkého střeva, které začíná dvanáctníkem, dál do tlustého střeva a konečníku. Připojené jsou trávicí žlázy: slinné žlázy, játra se žlučníkem a slinivka břišní. 1. Ústa: zuby rozmělní potravu, sliny začnou štěpit škrob. 2. Žaludek: kyselina chlorovodíková zabíjí mikroby, pepsin štěpí bílkoviny. 3. Dvanáctník: žluč z jater rozbije tuky na kapičky, šťáva ze slinivky štěpí škrob, tuky i bílkoviny. 4. Tenké střevo: dokončí trávení a živiny se vstřebají do krve. 5. Tlusté střevo: vstřebá vodu, bakterie rozkládají zbytky.";

const GUT = "bz2-o bz2-gut2";

function Tract() {
  const { id } = useFig();
  const small =
    "M190 272 Q206 284 196 296 Q160 300 128 292 Q116 304 130 314 Q170 316 204 312 Q214 326 200 334 Q160 340 126 332 Q114 344 132 352 Q168 356 196 352";
  return (
    <Frame w={330} h={440}>
      {/* torso outline */}
      <path d="M142 92 Q100 100 84 124 L74 300 Q72 380 104 430 M178 92 Q220 100 236 124 L246 300 Q248 380 216 430" className="bz2-o bz2-thin bz2-dash" />
      {/* head + mouth */}
      <path d="M130 52 Q126 14 160 10 Q194 14 192 52 Q190 74 172 80 L148 80 Q132 72 130 52Z" className="bz2-o bz2-flesh" />
      <path d="M140 62 Q150 68 162 62" className="bz2-o" />
      <ellipse cx={184} cy={64} rx={9} ry={6} className="bz2-o bz2-gland" />
      {/* oesophagus */}
      <Draw d="M156 70 Q160 120 178 190" className="bz2-o" style={{ strokeWidth: 9 }} />
      <Draw d="M156 70 Q160 120 178 190" className="bz2-gutline" style={{ strokeWidth: 6 }} />
      {/* liver + gallbladder */}
      <path d="M84 180 Q120 158 192 170 Q198 186 176 196 Q130 216 92 224 Q76 206 84 180Z" className="bz2-o bz2-liver" />
      <path d="M84 180 Q120 158 192 170 Q198 186 176 196 Q130 216 92 224 Q76 206 84 180Z" fill={pat(id, "d")} opacity={0.5} />
      <ellipse cx={150} cy={216} rx={9} ry={6} className="bz2-o bz2-bile" />
      {/* stomach */}
      <path d="M176 186 Q208 166 232 184 Q248 214 226 242 Q200 260 176 246 Q192 232 194 214 Q190 200 176 196Z" className={GUT} />
      <path d="M190 194 Q214 190 222 214 M188 222 Q206 232 220 228" className="bz2-o bz2-thin" />
      {/* pancreas */}
      <path d="M156 252 Q196 240 240 244 Q246 252 238 256 Q196 256 160 262Z" className="bz2-o bz2-gland" />
      {/* duodenum (C-loop) */}
      <path d="M176 246 Q148 244 142 260 Q140 276 162 280 Q182 280 190 272" className="bz2-o" style={{ strokeWidth: 11 }} fill="none" />
      <path d="M176 246 Q148 244 142 260 Q140 276 162 280 Q182 280 190 272" className="bz2-gutline" style={{ strokeWidth: 8 }} />
      {/* large intestine */}
      <path d="M112 372 L104 282 Q104 268 120 266 L214 262 Q230 264 230 280 L232 360 Q230 384 196 390 L170 394 L166 424" className="bz2-o" style={{ strokeWidth: 17 }} fill="none" />
      <path d="M112 372 L104 282 Q104 268 120 266 L214 262 Q230 264 230 280 L232 360 Q230 384 196 390 L170 394 L166 424" className="bz2-colon" style={{ strokeWidth: 14 }} />
      <path d="M112 372 L104 282 Q104 268 120 266 L214 262 Q230 264 230 280 L232 360 Q230 384 196 390 L170 394 L166 424" className="bz2-haustra" style={{ strokeWidth: 14 }} />
      <path d="M112 372 Q104 384 112 392" className="bz2-o" style={{ strokeWidth: 3 }} />
      {/* small intestine */}
      <path d={small} className="bz2-o" style={{ strokeWidth: 9 }} fill="none" />
      <path d={small} className="bz2-gutline" style={{ strokeWidth: 6 }} />
      <path d="M196 352 Q170 368 118 364" className="bz2-o" style={{ strokeWidth: 9 }} fill="none" />
      <path d="M196 352 Q170 368 118 364" className="bz2-gutline" style={{ strokeWidth: 6 }} />
      {/* numbered stations */}
      <Fade delay={0.6}>
        <Num x={128} y={64} n={1} />
        <Num x={246} y={206} n={2} />
        <Num x={134} y={252} n={3} />
        <Num x={164} y={324} n={4} r={9} />
        <Num x={246} y={330} n={5} />
      </Fade>
      <Lbl x={204} y={42} tx={184} ty={60} className="bz2-xs" sec>slinná žláza</Lbl>
      <Lbl x={204} y={118} tx={164} ty={130} className="bz2-sm">jícen</Lbl>
      <Lbl x={6} y={160} tx={100} ty={186} className="bz2-sm bz2-b">játra</Lbl>
      <Lbl x={6} y={240} tx={146} ty={220} className="bz2-sm">žlučník</Lbl>
      <Lbl x={326} y={170} tx={220} ty={186} anchor="end" lx={292} ly={176} className="bz2-sm bz2-b">žaludek</Lbl>
      <Lbl x={326} y={256} tx={238} ty={250} anchor="end" lx={292} ly={252} className="bz2-sm">slinivka</Lbl>
      <Lbl x={6} y={296} tx={102} ty={300} className="bz2-sm">tlusté střevo</Lbl>
      <Lbl x={326} y={300} tx={208} ty={312} anchor="end" lx={294} ly={300} className="bz2-sm">tenké střevo</Lbl>
      <Lbl x={6} y={420} tx={164} ty={420} className="bz2-sm">konečník</Lbl>
      <Lbl x={6} y={268} tx={142} ty={262} className="bz2-xs" sec>dvanáctník</Lbl>
    </Frame>
  );
}

const ROWS: [string, string, string][] = [
  ["1", "ústa", "sliny: škrob → cukry"],
  ["2", "žaludek", "HCl, pepsin: bílkoviny"],
  ["3", "dvanáctník", "žluč: tuky na kapičky; slinivka: vše"],
  ["4", "tenké střevo", "dotrávení, vstřebání živin"],
  ["5", "tlusté střevo", "vstřebání vody, bakterie"],
];

function Where() {
  return (
    <Frame w={300} h={300} title="co se kde tráví">
      {ROWS.map(([n, place, what], i) => (
        <g key={n} transform={`translate(0 ${18 + i * 56})`}>
          <Num x={18} y={10} n={n} />
          <text x={38} y={16} className="bz2-lbl bz2-b">{place}</text>
          <text x={38} y={38} className="bz2-lbl bz2-sm">{what}</text>
          {i < ROWS.length - 1 && <path d="M18 24 V62" className="bz2-o bz2-thin bz2-dash" />}
        </g>
      ))}
    </Frame>
  );
}

export default function DigestiveSystem() {
  return (
    <Plates
      label={LABEL}
      level={6}
      max={760}
      cols="1.15fr 1fr"
      stackBelow={600}
      note="Hlavní místo vstřebávání živin je tenké střevo."
    >
      <Tract />
      <Where />
    </Plates>
  );
}
