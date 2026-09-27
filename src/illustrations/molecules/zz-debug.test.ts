import { it } from 'vitest'
import { MOLECULES } from '../catalog'
import { getMolecule } from './library'
import { vdist } from './geometry'
it('debug', () => {
  for (const id of MOLECULES) {
    const m = getMolecule(id)
    const bonded = new Set(m.bonds.map((b) => `${Math.min(b.a, b.b)}-${Math.max(b.a, b.b)}`))
    const nb = (i:number)=> m.bonds.filter(b=>b.a===i||b.b===i).map(b=>b.a===i?b.b:b.a)
    let min = 9, pair = ''
    for (let i = 0; i < m.atoms.length; i++) for (let j = i + 1; j < m.atoms.length; j++) {
      if (bonded.has(`${i}-${j}`)) continue
      const d = vdist(m.atoms[i].p, m.atoms[j].p)
      const lim = m.atoms[i].el==='H'&&m.atoms[j].el==='H' ? 1.7 : 2.2
      if (d < lim && !nb(i).some(k=>nb(j).includes(k))) console.log(id, i, m.atoms[i].el, 'nb', nb(i).join(','), j, m.atoms[j].el,'nb', nb(j).join(','), d.toFixed(2))
      if (d < min) { min = d; pair = `${i}${m.atoms[i].el}-${j}${m.atoms[j].el}` }
    }
    console.log('MIN', id, min.toFixed(2), pair)
  }
})
