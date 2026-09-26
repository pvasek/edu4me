import { BY_SYMBOL } from './elements'

/**
 * Parses a chemical formula into element counts.
 * Supports parentheses/brackets, hydrates with "·" or "*" and leading multipliers:
 *   parseFormula('Ca(OH)2')        -> { Ca: 1, O: 2, H: 2 }
 *   parseFormula('CuSO4·5H2O')     -> { Cu: 1, S: 1, O: 9, H: 10 }
 * Charges written as ^2- or ^{2-} are ignored. Throws on unknown elements.
 */
export function parseFormula(formula: string): Record<string, number> {
  const clean = formula.replace(/\^\{?[0-9]*[+\-−]\}?/g, '').replace(/\s/g, '').replace(/\*/g, '·')
  const total: Record<string, number> = {}
  for (const part of clean.split('·')) {
    const m = part.match(/^(\d+)(.*)$/)
    const mult = m ? Number(m[1]) : 1
    const counts = parseGroup(m ? m[2] : part)
    for (const [el, c] of Object.entries(counts)) total[el] = (total[el] ?? 0) + c * mult
  }
  return total
}

function parseGroup(s: string): Record<string, number> {
  const stack: Record<string, number>[] = [{}]
  let i = 0
  const readNum = () => {
    let j = i
    while (j < s.length && /\d/.test(s[j])) j++
    const n = j > i ? Number(s.slice(i, j)) : 1
    i = j
    return n
  }
  while (i < s.length) {
    const c = s[i]
    if (c === '(' || c === '[') {
      stack.push({})
      i++
    } else if (c === ')' || c === ']') {
      i++
      const n = readNum()
      const top = stack.pop()!
      const into = stack[stack.length - 1]
      for (const [el, k] of Object.entries(top)) into[el] = (into[el] ?? 0) + k * n
    } else if (/[A-Z]/.test(c)) {
      let sym = c
      i++
      if (i < s.length && /[a-z]/.test(s[i])) sym += s[i++]
      if (!BY_SYMBOL[sym]) throw new Error(`Neznámý prvek ${sym} ve vzorci ${s}`)
      const n = readNum()
      const top = stack[stack.length - 1]
      top[sym] = (top[sym] ?? 0) + n
    } else {
      throw new Error(`Neočekávaný znak "${c}" ve vzorci ${s}`)
    }
  }
  if (stack.length !== 1) throw new Error(`Neuzavřená závorka ve vzorci ${s}`)
  return stack[0]
}

/** Molar mass in g/mol using the table's relative atomic masses. */
export function molarMass(formula: string): number {
  return Object.entries(parseFormula(formula)).reduce((sum, [el, n]) => sum + BY_SYMBOL[el].mass * n, 0)
}
