import { Arrow, Draw, DrawArrow, Fade, FadeArrow, FadePath, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Podzemní voda v řezu krajinou. Část srážek se vsakuje do půdy a propustnými vrstvami písku a štěrku klesá dolů. Horní, provzdušněná zóna má v pórech vzduch i vodu; níže jsou všechny póry zaplněné vodou – to je zvodnělá vrstva. Její horní hranice je hladina podzemní vody. Pod ní leží nepropustná vrstva jílu, přes kterou voda neprosákne. Podzemní voda pomalu teče ke svahu a k řece: kde hladina podzemní vody vychází na povrch, vyvěrá pramen, a řeku podzemní voda napájí i v suchu. Studna musí sahat pod hladinu podzemní vody. Hlouběji leží další zvodnělá vrstva sevřená mezi dvěma nepropustnými vrstvami.";

const W = 520;
const H = 400;

const SURF = "M8 92 C80 94 140 104 200 128 C250 150 280 170 320 186 C360 200 400 204 424 206 L464 206 C480 200 496 196 512 194";
const WT = "M8 152 C100 156 200 164 260 174 C286 180 300 185 320 188 C360 200 400 204 424 206";
const B1 = [
  [8, 238],
  [512, 260],
] as const;
const B2 = [
  [8, 264],
  [512, 286],
] as const;
const B3 = [
  [8, 306],
  [512, 326],
] as const;

function Plate() {
  const { id } = useFig();
  const band = (a: readonly (readonly number[])[], b: readonly (readonly number[])[]) =>
    `M${a[0][0]} ${a[0][1]} L${a[1][0]} ${a[1][1]} L${b[1][0]} ${b[1][1]} L${b[0][0]} ${b[0][1]} Z`;
  const permeable = `${SURF} V${B1[1][1]} L${B1[0][0]} ${B1[0][1]} Z`;
  const saturated = `${WT} L464 206 C480 200 496 196 512 194 V${B1[1][1]} L${B1[0][0]} ${B1[0][1]} Z`;
  return (
    <>
      <Fade>
        <rect x={8} y={8} width={W - 16} height={H - 16} className="gz3-sky" />
        {/* permeable sand and gravel */}
        <path d={permeable} className="gz3-sand" />
        <path d={permeable} fill={pat(id, "dots")} />
        {/* saturated part */}
        <path d={saturated} className="gz3-gwater" />
        <path d={saturated} fill={pat(id, "dots")} />
        {/* impermeable clay, confined aquifer, bottom clay */}
        <path d={band(B1, B2)} className="gz3-clay" />
        <path d={band(B1, B2)} fill={pat(id, "h")} />
        <path d={band(B2, B3)} className="gz3-gwater" />
        <path d={band(B2, B3)} fill={pat(id, "dots")} />
        <path d={`M8 ${B3[0][1]} L512 ${B3[1][1]} V392 H8 Z`} className="gz3-clay" />
        <path d={`M8 ${B3[0][1]} L512 ${B3[1][1]} V392 H8 Z`} fill={pat(id, "h")} />
        {[B1, B2, B3].map((b, i) => (
          <path key={i} d={`M${b[0][0]} ${b[0][1]} L${b[1][0]} ${b[1][1]}`} className="gz3-o gz3-thin" />
        ))}
        {/* soil and surface */}
        <path d={SURF} className="gz3-soil-line" />
        <path d={SURF} className="gz3-o" />
        {/* river */}
        <path d="M424 206 C430 214 458 214 464 206 Z" className="gz3-o gz3-water" />
      </Fade>

      {/* water table */}
      <FadePath d={WT} className="gz3-wt" delay={0.3} />
      <Pop delay={0.8}>
        <path d="M178 157 l10 0 l-5 7 Z" className="gz3-wt-mark" />
        <path d="M180 166 h6 M181.5 169 h3" className="gz3-o gz3-thin gz3-blue-s" />
      </Pop>

      {/* well */}
      <Pop delay={0.4}>
        <path d="M86 92 V196 M104 92 V196" className="gz3-o" style={{ strokeWidth: 2.2 }} />
        <path d="M87 196 H103" className="gz3-o gz3-thin" />
        <rect x={87} y={155} width={16} height={40} className="gz3-water" />
        <path d="M80 92 h30 M84 72 V92 M106 72 V92 M80 72 h30" className="gz3-o" />
        <path d="M95 72 V140" className="gz3-o gz3-thin" />
        <rect x={91} y={140} width={8} height={9} className="gz3-o gz3-fill" style={{ strokeWidth: 1 }} />
      </Pop>

      {/* rain and infiltration */}
      <Fade delay={0.5}>
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${150 + i * 14} ${24 + (i % 2) * 6} l-4 14`} className="gz3-rain-s" />
        ))}
      </Fade>
      {[170, 210].map((x, i) => (
        <DrawArrow key={x} d={`M${x} ${118 + i * 14} V${158 + i * 12}`} tone="blue" delay={0.6 + i * 0.1} />
      ))}
      {/* groundwater flow */}
      {[
        "M40 200 C120 204 200 210 260 212",
        "M300 214 C340 216 380 214 418 210",
      ].map((d, i) => (
        <FadeArrow key={i} d={d} tone="blue" delay={0.9 + i * 0.15} className="gz3-gw" />
      ))}
      <FadeArrow d="M340 298 C390 300 430 304 480 308" tone="blue" delay={1.1} className="gz3-gw" />
      {/* spring and its brook */}
      <Pop delay={1}>
        <circle cx={318} cy={186} r={4} className="gz3-o gz3-water" />
      </Pop>
      <Draw d="M320 188 C340 196 370 200 424 207" className="gz3-river gz3-river-s" delay={1.1} />
      <Arrow d="M326 168 L320 180" tone="blue" />

      {/* labels */}
      <Fade delay={1.2}>
        <Lbl x={286} y={30} className="gz3-b">
          srážky
        </Lbl>
        <Lbl x={222} y={118} className="gz3-sm">
          vsakování
        </Lbl>
        <Lbl x={114} y={84} className="gz3-b">
          studna
        </Lbl>
        <Lbl x={330} y={162} className="gz3-b">
          pramen
        </Lbl>
        <Lbl x={444} y={232} anchor="middle" className="gz3-b gz3-blue-t">
          řeka
        </Lbl>
        <text x={112} y={188} className="gz3-lbl gz3-sm gz3-b gz3-blue-t gz3-halo">
          hladina podzemní vody
        </text>
        <Lbl x={14} y={44} tx={56} ty={124} className="gz3-sm">
          provzdušněná zóna
        </Lbl>
        <text x={24} y={226} className="gz3-lbl gz3-b gz3-halo">
          zvodnělá vrstva (písek, štěrk)
        </text>
        <text x={24} y={258} className="gz3-lbl gz3-sm gz3-b gz3-halo">
          nepropustná vrstva (jíl)
        </text>
        <text x={24} y={300} className="gz3-lbl gz3-sm gz3-b gz3-halo">
          zvodnělá vrstva mezi nepropustnými
        </text>
        <text x={24} y={360} className="gz3-lbl gz3-sm gz3-b gz3-halo">
          nepropustná vrstva (jíl)
        </text>
      </Fade>
    </>
  );
}

export default function Groundwater() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
