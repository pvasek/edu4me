import { useState } from 'react'
import { motion } from 'motion/react'
import { Plate, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Experiment, Readout } from './kit'
import { GENOTYPES, genotypeRatio, isWhite, offspring, phenotypeRatio, punnett, type Genotype } from './punnett-cross.model'

/**
 * "Vyzkoušej si" for b7-2: choose the genotypes of two pea plants; the Punnett square
 * fills in and 20 offspring appear in the expected proportions (A = fialový květ,
 * dominant; a = bílý květ, recessive).
 */

// Punnett square (viewBox units)
const SQ_X = 48 // left edge of the cells
const SQ_Y = 78 // top edge of the cells
const CELL = 50
// offspring grid
const OX = 196
const OY = 46
const OCOL = 5
const ODX = 33
const ODY = 40

/** Flower colours are the subject's own colours, kept literal so a white flower stays white in the dark theme. */
const PURPLE = 'color-mix(in srgb, var(--violet) 80%, var(--surface))'
const WHITE = '#f7f3ea'

const say = (g: Genotype) => (isWhite(g) ? 'bílý' : 'fialový')

function Flower({ x, y, g, r = 6 }: { x: number; y: number; g: Genotype; r?: number }) {
  const fill = isWhite(g) ? WHITE : PURPLE
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.62} rx={r * 0.48} ry={r * 0.62} transform={`rotate(${a})`} style={{ fill, stroke: 'var(--edge)', strokeWidth: 0.8 }} />
      ))}
      <circle r={r * 0.3} style={{ fill: 'var(--yellow)', stroke: 'var(--edge)', strokeWidth: 0.6 }} />
    </g>
  )
}

/** A small pea plant: stem, two leaves and a flower. */
function Plant({ x, y, g, i }: { x: number; y: number; g: Genotype; i: number }) {
  const { still } = usePlate()
  const stroke = 'color-mix(in srgb, var(--green) 70%, var(--ink))'
  return (
    <motion.g
      key={g}
      initial={still ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: still ? 0 : 0.3, delay: still ? 0 : i * 0.03 }}
    >
      <path d={`M${x} ${y + 15} V${y + 2}`} style={{ stroke, strokeWidth: 1.4, fill: 'none' }} />
      <path d={`M${x} ${y + 11} q-7 -1 -8 -6 q6 0 8 6 M${x} ${y + 9} q7 -1 8 -6 q-6 0 -8 6`} style={{ stroke, strokeWidth: 0.8, fill: 'color-mix(in srgb, var(--green) 50%, var(--surface))' }} />
      <Flower x={x} y={y} g={g} r={6.5} />
    </motion.g>
  )
}

function Gamete({ x, y, a }: { x: number; y: number; a: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={12} className="ph-o" style={{ fill: 'var(--surface-2)' }} />
      <text x={x} y={y + 5.5} textAnchor="middle" className="ph-sym" style={{ fontSize: 16 }}>
        {a}
      </text>
    </g>
  )
}

function crossLabel(mother: Genotype, father: Genotype): string {
  const { counts, white } = punnett(mother, father)
  const [pa, pb] = phenotypeRatio(counts)
  const g = genotypeRatio(counts)
  const phen = pb === 0 ? 'všichni potomci kvetou fialově' : pa === 0 ? 'všichni potomci kvetou bíle' : `fialové a bílé květy v poměru ${pa} : ${pb}`
  return (
    `Křížení hrachu: rodič ${mother} (${say(mother)} květ) × rodič ${father} (${say(father)} květ). ` +
    `Punnettův čtverec dává genotypy AA : Aa : aa v poměru ${g.join(' : ')}, takže ${phen}. ` +
    `Z 20 potomků je ${20 - white * 20} fialových a ${white * 20} bílých.`
  )
}

function Picture({ mother, father }: { mother: Genotype; father: Genotype }) {
  const { rows, cols, cells } = punnett(mother, father)
  const kids = offspring(mother, father)
  const purple = kids.filter((g) => !isWhite(g)).length
  return (
    <>
      {/* parents */}
      <Flower x={SQ_X + 8} y={20} g={mother} r={7.5} />
      <text x={SQ_X + 20} y={25} className="ph-lbl">
        {mother}
      </text>
      <text x={SQ_X + CELL - 4} y={26} textAnchor="middle" className="ph-lbl" style={{ fontSize: 20 }}>
        ×
      </text>
      <Flower x={SQ_X + CELL + 16} y={20} g={father} r={7.5} />
      <text x={SQ_X + CELL + 28} y={25} className="ph-lbl">
        {father}
      </text>
      {/* gametes: rows from the first parent, columns from the second */}
      {cols.map((a, j) => (
        <Gamete key={`c${j}`} x={SQ_X + CELL * (j + 0.5)} y={SQ_Y - 18} a={a} />
      ))}
      {rows.map((a, i) => (
        <Gamete key={`r${i}`} x={SQ_X - 20} y={SQ_Y + CELL * (i + 0.5)} a={a} />
      ))}
      <text x={SQ_X - 34} y={SQ_Y - 30} className="ph-cap">
        gamety
      </text>
      {cells.map((row, i) =>
        row.map((g, j) => (
          <g key={`${i}${j}`}>
            <rect
              x={SQ_X + CELL * j}
              y={SQ_Y + CELL * i}
              width={CELL}
              height={CELL}
              className="ph-o"
              style={{ fill: isWhite(g) ? 'var(--surface)' : 'color-mix(in srgb, var(--violet) 14%, var(--surface))' }}
            />
            <Flower x={SQ_X + CELL * (j + 0.5)} y={SQ_Y + CELL * i + 17} g={g} r={6.5} />
            <text x={SQ_X + CELL * (j + 0.5)} y={SQ_Y + CELL * i + 42} textAnchor="middle" className="ph-lbl" style={{ fontSize: 16 }}>
              {g}
            </text>
          </g>
        )),
      )}
      <path d={`M${SQ_X} ${SQ_Y} h${2 * CELL} v${2 * CELL} h${-2 * CELL} Z`} className="ph-o ph-thick" />
      <text x={SQ_X + CELL} y={SQ_Y + 2 * CELL + 22} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        každé políčko = ¼
      </text>
      {/* offspring */}
      <text x={OX + (ODX * (OCOL - 1)) / 2} y={OY - 22} textAnchor="middle" className="ph-cap">
        20 potomků
      </text>
      {kids.map((g, k) => (
        <Plant key={`${mother}${father}${k}`} x={OX + ODX * (k % OCOL)} y={OY + ODY * Math.floor(k / OCOL)} g={g} i={k} />
      ))}
      <text x={OX + (ODX * (OCOL - 1)) / 2} y={OY + ODY * 4 + 4} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        {purple} fialových, {20 - purple} bílých
      </text>
    </>
  )
}

export default function PunnettCross() {
  const [mother, setMother] = useState<Genotype>('AA')
  const [father, setFather] = useState<Genotype>('aa')
  const nar = useNarrow()
  const { counts, white } = punnett(mother, father)
  const [pa, pb] = phenotypeRatio(counts)
  const options = GENOTYPES.map((g) => ({ value: g, label: g }))
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[6, 4, 354, 222]} max={480} label={crossLabel(mother, father)}>
          <Picture mother={mother} father={father} />
        </Plate>
      }
      controls={
        <>
          <Choice label="první rodič" value={mother} onChange={setMother} options={options} />
          <Choice label="druhý rodič" value={father} onChange={setFather} options={options} />
        </>
      }
      readouts={
        <>
          <Readout label="genotypy AA : Aa : aa" value={genotypeRatio(counts).join(' : ')} />
          <Readout label="květy fialové : bílé" value={pb === 0 ? 'jen fialové' : pa === 0 ? 'jen bílé' : `${pa} : ${pb}`} />
        </>
      }
      challenge="Vyber rodiče tak, aby byla čtvrtina potomků bílá."
      done={white === 0.25}
    />
  )
}
