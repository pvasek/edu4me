import { Draw, Fade, Flame, Hx, Lbl, Plate, Pop, useHatch } from './kit'

const TOP = 250 // top of the barrel
const COL = 352 // air collar top
const BASE = 394 // barrel bottom / base top

/** One burner in half cutaway: the front wall of the barrel is cut away so the jet and the gas stream are visible. */
function Burner({ cx, open }: { cx: number; open: boolean }) {
  const h = useHatch()
  const L = cx - 15
  const R = cx + 15
  return (
    <g>
      {/* rubber hose */}
      <path
        d={`M${R + 36} ${BASE + 8} C${R + 70} ${BASE + 8} ${R + 70} ${BASE + 36} ${R + 110} ${BASE + 36}`}
        className="f12-hose"
      />
      <path d={`M${R + 36} ${BASE + 8} C${R + 70} ${BASE + 8} ${R + 70} ${BASE + 36} ${R + 110} ${BASE + 36}`} className="f12-hose-hl" />
      {/* gas inlet */}
      <Hx d={`M${R} ${BASE + 3} L${R + 40} ${BASE + 4} L${R + 40} ${BASE + 12} L${R} ${BASE + 13} Z`} kind="d" tone="var(--f12-metal)" />
      {/* base */}
      <Hx d={`M${cx - 38} ${BASE} L${cx + 38} ${BASE} L${cx + 58} ${BASE + 26} L${cx - 58} ${BASE + 26} Z`} kind="x" tone="var(--f12-metal)" />
      <path className="f12-thin" d={`M${cx - 58} ${BASE + 26} L${cx + 58} ${BASE + 26} L${cx + 58} ${BASE + 30} L${cx - 58} ${BASE + 30} Z`} style={{ fill: 'var(--f12-metal-2)' }} />
      {/* barrel: back wall (inside) */}
      <path className="f12-inner" d={`M${L} ${TOP} L${R} ${TOP} L${R} ${BASE} L${L} ${BASE} Z`} />
      <path className="f12-hatch" d={`M${L} ${TOP} L${L + 7} ${TOP} L${L + 7} ${BASE} L${L} ${BASE} Z`} fill={h('d')} />
      {/* walls in section (thick, cross-hatched) */}
      <Hx d={`M${L - 4} ${TOP} L${L} ${TOP} L${L} ${BASE} L${L - 4} ${BASE} Z`} kind="x" tone="var(--f12-metal-2)" className="f12-thin" />
      <Hx d={`M${R} ${TOP} L${R + 4} ${TOP} L${R + 4} ${BASE} L${R} ${BASE} Z`} kind="x" tone="var(--f12-metal-2)" className="f12-thin" />
      {/* jet (tryska) */}
      <Hx d={`M${cx - 8} ${BASE} L${cx - 3.5} ${BASE - 20} L${cx + 3.5} ${BASE - 20} L${cx + 8} ${BASE} Z`} kind="x" tone="var(--f12-metal-2)" className="f12-thin" />
      {/* gas stream */}
      <Fade delay={0.9}>
        <path className="f12-flow f12-gas" d={`M${cx} ${BASE - 22} L${cx} ${TOP + 4}`} />
        {open && (
          <>
            <path className="f12-flow f12-air" d={`M${R + 62} ${COL + 10} L${R + 8} ${COL + 10} Q${cx + 5} ${COL + 8} ${cx + 5} ${COL - 20} L${cx + 5} ${TOP + 4}`} />
            <path className="f12-flow f12-air" d={`M${L - 62} ${COL + 10} L${L - 8} ${COL + 10} Q${cx - 5} ${COL + 8} ${cx - 5} ${COL - 20} L${cx - 5} ${TOP + 4}`} />
          </>
        )}
      </Fade>
      {/* air collar (regulace vzduchu) */}
      <Hx d={`M${L - 7} ${COL} L${R + 7} ${COL} L${R + 7} ${COL + 20} L${L - 7} ${COL + 20} Z`} kind="d" tone="var(--f12-metal)" />
      {open ? (
        <>
          <rect className="f12-thin f12-inner" x={L - 7} y={COL + 5} width={7} height={10} />
          <rect className="f12-thin f12-inner" x={R} y={COL + 5} width={7} height={10} />
        </>
      ) : (
        <path className="f12-thin" d={`M${L - 7} ${COL + 10} L${R + 7} ${COL + 10}`} />
      )}
      {/* outline draws in */}
      <Draw d={`M${L - 4} ${TOP} L${L - 4} ${BASE} M${R + 4} ${BASE} L${R + 4} ${TOP} M${L - 4} ${TOP} L${L} ${TOP} M${R} ${TOP} L${R + 4} ${TOP}`} dur={0.9} />
    </g>
  )
}

export default function BunsenBurner() {
  const A = 205
  const B = 440
  return (
    <Plate
      level={1}
      w={640}
      h={470}
      max={660}
      label="Plynový kahan v řezu. Plyn proudí tryskou do hlavně. Vlevo je přívod vzduchu zavřený a hoří žlutý svítivý plamen, asi 1000 °C, který čadí. Vpravo je přívod vzduchu otevřený, vzduch se v hlavni mísí s plynem a hoří modrý nesvítivý plamen: ve vnitřním kuželu asi 300 °C, nejteplejší místo nad jeho špičkou asi 1500 °C."
    >
      {/* headers */}
      <Fade delay={0.1}>
        <text className="f12-title" x={A} y={30} textAnchor="middle">
          svítivý plamen
        </text>
        <text className="f12-small" x={A} y={50} textAnchor="middle">
          vzduch zavřený
        </text>
        <text className="f12-title" x={B} y={30} textAnchor="middle">
          nesvítivý plamen
        </text>
        <text className="f12-small" x={B} y={50} textAnchor="middle">
          vzduch otevřený
        </text>
      </Fade>
      <path className="f12-hair f12-dash" d="M322 20 L322 450" />

      <Burner cx={A} open={false} />
      <Burner cx={B} open />

      {/* flames */}
      <Pop delay={0.7} origin="50% 100%">
        <Flame x={A} y={TOP} h={172} kind="yellow" />
        <g className="f12-soot">
          <path d={`M${A - 4} ${TOP - 176} q-8 -10 0 -18 q8 -8 0 -18`} />
          <path d={`M${A + 8} ${TOP - 170} q-7 -9 1 -16 q7 -7 -1 -14`} />
        </g>
      </Pop>
      <Pop delay={0.9} origin="50% 100%">
        <Flame x={B} y={TOP} h={126} kind="blue" />
      </Pop>
      <Pop delay={1.4}>
        <circle className="f12-hot" cx={B} cy={TOP - 60} r={5} />
      </Pop>

      {/* labels: burner parts (left) */}
      <Lbl x={160} y={296} tx={A - 19} ty={290} anchor="end">
        hlaveň
      </Lbl>
      <Lbl x={160} y={352} tx={A - 22} ty={COL + 6} anchor="end" line2="vzduchu">
        regulace
      </Lbl>
      <Lbl x={126} y={398} tx={A - 6} ty={BASE - 12} anchor="end" lx={128} ly={394}>
        tryska
      </Lbl>
      <Lbl x={120} y={445} tx={A - 40} ty={BASE + 14} anchor="end">
        podstavec
      </Lbl>
      <Lbl x={320} y={454} tx={A + 92} ty={BASE + 26} anchor="end" sec>
        přívod plynu
      </Lbl>
      <Lbl x={240} y={214} tx={A} ty={TOP - 22} anchor="middle" className="f12-lab-strong" lx={228} ly={203}>
        ≈ 1000 °C
      </Lbl>
      <Lbl x={250} y={120} tx={A + 20} ty={TOP - 118} line2="čadí sazemi" sec>
        žlutý, svítí,
      </Lbl>

      {/* labels: flame B (right) */}
      <Lbl x={500} y={TOP - 64} tx={B + 5} ty={TOP - 60} className="f12-lab-strong" line2="≈ 1500 °C" lx={496} ly={TOP - 60}>
        nejteplejší
      </Lbl>
      <Lbl x={500} y={TOP - 8} tx={B + 8} ty={TOP - 20} className="f12-lab-strong" line2="≈ 300 °C" lx={496} ly={TOP - 12}>
        vnitřní kužel
      </Lbl>
      <Lbl x={500} y={TOP - 128} tx={B + 22} ty={TOP - 96} line2="(oxidační)" line2Sec sec>
        vnější plášť
      </Lbl>
      <Lbl x={526} y={COL - 20} tx={B + 60} ty={COL + 10} line2="vstupuje" lx={522} ly={COL - 16}>
        vzduch
      </Lbl>
      <Lbl x={374} y={300} tx={B - 3} ty={300} anchor="end" line2="se mísí" sec>
        plyn + vzduch
      </Lbl>
    </Plate>
  )
}
