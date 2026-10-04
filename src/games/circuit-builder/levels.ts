/**
 * Stavitel obvodů – circuits and number sets per level (spec/courses/fyzika/games.md).
 *
 *   6  sériové a paralelní zapojení, Ohmův zákon, jas žárovek přes výkon (ZŠ čísla, zdroj bez vnitřního odporu)
 *   11 Kirchhoffovy zákony, zdroj s vnitřním odporem U = U_e − R_i·I, výsledný odpor smíšené sítě, výkon
 *
 * Every task is built from a template + random numbers, then solved with logic.ts.
 * Templates reject numbers that would give ugly answers at ZŠ level.
 */
import { shuffle } from '../shared/util'
import {
  EFFECT_TEXT,
  amm,
  applyChange,
  arrangements,
  brightest,
  brightnessMargin,
  effectOn,
  fmt,
  label,
  lamp,
  lampPowers,
  par,
  power,
  q,
  relation,
  res,
  ser,
  slot,
  solve,
  sw,
  volt,
  wire,
  type Change,
  type Circuit,
  type Effect,
  type Goal,
  type Net,
  type Part,
} from './logic'

type Rng = () => number

interface Base {
  /** Unique within a round (template + numbers). */
  key: string
  level: number
  circuit: Circuit
  /** Czech question (inline markup allowed). */
  prompt: string
  /** One-line Czech explanation shown after the answer. */
  explain: string
  /** Show the resistance of lamps (resistors always show theirs). */
  lampValues: boolean
}

export interface MeterTask extends Base {
  kind: 'meter'
  answer: number
  unit: 'A' | 'V' | 'W' | 'Ω'
  /** Symbol in front of the input, e.g. "I", "U_{2}". */
  symbol: string
  /** Meter readings shown as given data (meter id → value). */
  given?: Record<string, number>
  /** Hide R_i on the source (it is what is asked). */
  hideRi?: boolean
}

export interface BrightTask extends Base {
  kind: 'bright'
  /** Lamp id or 'same'. */
  answer: string
  options: string[]
}

export interface ChangeTask extends Base {
  kind: 'change'
  change: Change
  target: string
  answer: Effect
}

export interface BuildTask extends Base {
  kind: 'build'
  pieces: Part[]
  goal: Goal
  /** One arrangement that meets the goal (shown after a failed second try). */
  solution: Record<string, Part>
}

export type Task = MeterTask | BrightTask | ChangeTask | BuildTask
export type Kind = Task['kind']

const pick = <T,>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]
const pickN = <T,>(arr: readonly T[], n: number, rng: Rng): T[] => shuffle(arr, rng).slice(0, n)
/** ZŠ-friendly: at most two decimals and not tiny. */
const nice = (x: number) => Number.isFinite(x) && x >= 0.1 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6

const V = (x: number) => q(x, 'V')
const A = (x: number) => q(x, 'A')
const W = (x: number) => q(x, 'W')
const O = (x: number) => q(x, 'Ω')

// ------------------------------------------------------------------ number sets

const U6 = [4.5, 6, 9, 12, 24]
const R6 = [2, 3, 4, 6, 8, 12]
const UE11 = [4.5, 6, 9, 12, 24]
const RI11 = [0.5, 1, 2]
const R11 = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20]

type Gen<T extends Task> = (rng: Rng) => T | null

const meter = (level: number, key: string, circuit: Circuit, m: Omit<MeterTask, 'kind' | 'level' | 'key' | 'circuit' | 'lampValues'> & { lampValues?: boolean }): MeterTask => ({
  kind: 'meter',
  level,
  key,
  circuit,
  lampValues: true,
  ...m,
})

// ------------------------------------------------------------------ level 6: meters

const M6: Record<string, Gen<MeterTask>> = {
  serI: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = [pick(R6, rng), pick(R6, rng)]
    const c: Circuit = { ue: U, ri: 0, net: ser(amm(), res('R1', r1), res('R2', r2)) }
    const I = solve(c).I
    if (!nice(I)) return null
    return meter(6, `serI-${U}-${r1}-${r2}`, c, {
      prompt: 'Rezistory jsou zapojené **za sebou**. Co ukáže ampérmetr?',
      answer: I,
      unit: 'A',
      symbol: 'I',
      explain: `V sérii se odpory sčítají: R = ${O(r1)} + ${O(r2)} = ${O(r1 + r2)}, takže I = U / R = ${V(U)} / ${O(r1 + r2)} = ${A(I)}.`,
    })
  },
  serU: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = [pick(R6, rng), pick(R6, rng)]
    if (r1 === r2) return null
    const c: Circuit = { ue: U, ri: 0, net: ser(res('R1', r1), par(res('R2', r2), volt())) }
    const s = solve(c)
    const U2 = s.part.get('V')!.U
    if (!nice(U2) || !nice(s.I)) return null
    return meter(6, `serU-${U}-${r1}-${r2}`, c, {
      prompt: 'Jaké napětí ukáže voltmetr připojený k rezistoru R₂?',
      answer: U2,
      unit: 'V',
      symbol: 'U_{2}',
      explain: `Proud I = U / (R₁ + R₂) = ${V(U)} / ${O(r1 + r2)} = ${A(s.I)}, na R₂ je U₂ = R₂ · I = ${O(r2)} · ${A(s.I)} = ${V(U2)}. ${r2 > r1 ? 'Větší' : 'Menší'} odpor dostane ${r2 > r1 ? 'větší' : 'menší'} díl napětí.`,
    })
  },
  serI3: (rng) => {
    const U = pick(U6, rng)
    const rs = [pick(R6, rng), pick(R6, rng), pick(R6, rng)]
    const c: Circuit = { ue: U, ri: 0, net: ser(amm(), res('R1', rs[0]), res('R2', rs[1]), res('R3', rs[2])) }
    const I = solve(c).I
    const R = rs[0] + rs[1] + rs[2]
    if (!nice(I)) return null
    return meter(6, `serI3-${U}-${rs.join('-')}`, c, {
      prompt: 'Tři rezistory za sebou. Co ukáže ampérmetr?',
      answer: I,
      unit: 'A',
      symbol: 'I',
      explain: `R = ${rs.map(O).join(' + ')} = ${O(R)} a I = U / R = ${V(U)} / ${O(R)} = ${A(I)}.`,
    })
  },
  parI: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = [pick(R6, rng), pick(R6, rng)]
    const c: Circuit = { ue: U, ri: 0, net: ser(amm(), par(res('R1', r1), res('R2', r2))) }
    const s = solve(c)
    const [i1, i2] = [U / r1, U / r2]
    if (!nice(s.I) || !nice(i1) || !nice(i2)) return null
    return meter(6, `parI-${U}-${r1}-${r2}`, c, {
      prompt: 'Rezistory jsou zapojené **vedle sebe** (paralelně). Co ukáže ampérmetr v hlavní větvi?',
      answer: s.I,
      unit: 'A',
      symbol: 'I',
      explain: `Každá větev má celé napětí ${V(U)}: I₁ = ${V(U)} / ${O(r1)} = ${A(i1)}, I₂ = ${V(U)} / ${O(r2)} = ${A(i2)}. Proudy se sečtou: I = ${A(s.I)}.`,
    })
  },
  parBranch: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = [pick(R6, rng), pick(R6, rng)]
    if (r1 === r2) return null
    const c: Circuit = { ue: U, ri: 0, net: par(res('R1', r1), ser(amm(), res('R2', r2))) }
    const I2 = U / r2
    if (!nice(I2)) return null
    return meter(6, `parBranch-${U}-${r1}-${r2}`, c, {
      prompt: 'Ampérmetr je ve větvi s rezistorem R₂. Co ukáže?',
      answer: I2,
      unit: 'A',
      symbol: 'I_{2}',
      explain: `Paralelní větev má napětí zdroje ${V(U)}, R₁ vedle ní nic nemění: I₂ = U / R₂ = ${V(U)} / ${O(r2)} = ${A(I2)}.`,
    })
  },
  lampP: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = [pick(R6, rng), pick(R6, rng)]
    const c: Circuit = { ue: U, ri: 0, net: ser(lamp('Z1', r1), lamp('Z2', r2)) }
    const s = solve(c)
    const U1 = s.part.get('Z1')!.U
    const P = power(s, 'Z1')
    if (!nice(s.I) || !nice(U1) || !nice(P)) return null
    return meter(6, `lampP-${U}-${r1}-${r2}`, c, {
      prompt: 'Žárovky jsou zapojené za sebou. Jaký výkon má žárovka Ž₁?',
      answer: P,
      unit: 'W',
      symbol: 'P_{1}',
      explain: `I = U / (R₁ + R₂) = ${V(U)} / ${O(r1 + r2)} = ${A(s.I)}, U₁ = R₁ · I = ${V(U1)}, a tedy P₁ = U₁ · I = ${W(P)}.`,
    })
  },
  parP: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = [pick(R6, rng), pick(R6, rng)]
    if (r1 === r2) return null
    const c: Circuit = { ue: U, ri: 0, net: par(lamp('Z1', r1), lamp('Z2', r2)) }
    const I2 = U / r2
    const P = power(solve(c), 'Z2')
    if (!nice(I2) || !nice(P)) return null
    return meter(6, `parP-${U}-${r1}-${r2}`, c, {
      prompt: 'Žárovky jsou zapojené paralelně. Jaký výkon má žárovka Ž₂?',
      answer: P,
      unit: 'W',
      symbol: 'P_{2}',
      explain: `Ž₂ má celé napětí zdroje ${V(U)}: I₂ = ${V(U)} / ${O(r2)} = ${A(I2)} a P₂ = U · I₂ = ${W(P)}.`,
    })
  },
}

// ------------------------------------------------------------------ brightness (both levels)

const powersText = (c: Circuit) => {
  const p = lampPowers(c)
  return Object.keys(p)
    .sort()
    .map((id) => `${label(id)} ${W(p[id])}`)
    .join(', ')
}

function bright(level: number, key: string, c: Circuit, lampValues: boolean, why: string): BrightTask | null {
  const answer = brightest(c)
  if (answer !== 'same' && brightnessMargin(c) < 1.15) return null
  const ids = Object.keys(lampPowers(c)).sort()
  const who = answer === 'same' ? 'Všechny svítí stejně' : `Nejjasněji svítí ${label(answer)}`
  return {
    kind: 'bright',
    level,
    key,
    circuit: c,
    lampValues,
    prompt: lampValues ? 'Která žárovka svítí nejjasněji? Jas určuje výkon P = U · I.' : 'Žárovky jsou **stejné**. Která svítí nejjasněji?',
    answer,
    options: [...ids, 'same'],
    explain: `${who} – ${why}. Výkony: ${powersText(c)}.`,
  }
}

/** Lamp ids Z1..Zn in random positions. */
const ids = (n: number, rng: Rng) => shuffle(['Z1', 'Z2', 'Z3'].slice(0, n), rng)

const B6: Record<string, Gen<BrightTask>> = {
  serDiff: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = pickN(R6, 2, rng)
    return bright(6, `serDiff-${U}-${r1}-${r2}`, { ue: U, ri: 0, net: ser(lamp('Z1', r1), lamp('Z2', r2)) }, true, 'v sérii teče oběma stejný proud, víc energie předá žárovka s větším odporem (P = R · I²)')
  },
  parDiff: (rng) => {
    const U = pick(U6, rng)
    const [r1, r2] = pickN(R6, 2, rng)
    return bright(6, `parDiff-${U}-${r1}-${r2}`, { ue: U, ri: 0, net: par(lamp('Z1', r1), lamp('Z2', r2)) }, true, 'paralelně mají obě stejné napětí, větší proud a výkon má žárovka s menším odporem (P = U² / R)')
  },
  serPar: (rng) => {
    const [a, b, c] = ids(3, rng)
    return bright(6, `serPar-${a}`, { ue: 6, ri: 0, net: ser(lamp(a, 6), par(lamp(b, 6), lamp(c, 6))) }, false, `celý proud jde přes ${label(a)} a teprve pak se dělí mezi dvě žárovky`)
  },
  parSer: (rng) => {
    const [a, b, c] = ids(3, rng)
    return bright(6, `parSer-${c}`, { ue: 6, ri: 0, net: par(ser(lamp(a, 6), lamp(b, 6)), lamp(c, 6)) }, false, `${label(c)} má celé napětí zdroje, zatímco ${label(a)} a ${label(b)} se o něj dělí napůl`)
  },
  allSer: () => bright(6, 'allSer', { ue: 9, ri: 0, net: ser(lamp('Z1', 6), lamp('Z2', 6), lamp('Z3', 6)) }, false, 'stejnými žárovkami v sérii teče stejný proud a každá má třetinu napětí'),
  allPar: () => bright(6, 'allPar', { ue: 6, ri: 0, net: par(lamp('Z1', 6), lamp('Z2', 6), lamp('Z3', 6)) }, false, 'každá žárovka má vlastní větev s celým napětím zdroje'),
}

const B11: Record<string, Gen<BrightTask>> = {
  mixVals: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = pickN(R11, 3, rng)
    const c: Circuit = { ue, ri, net: ser(lamp('Z1', r1), par(lamp('Z2', r2), lamp('Z3', r3))) }
    return bright(11, `mixVals-${ue}-${ri}-${r1}-${r2}-${r3}`, c, true, 'rozhoduje výkon P = U · I, ne poloha v obvodu ani samotný odpor')
  },
  parSerVals: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = pickN(R11, 3, rng)
    const c: Circuit = { ue, ri, net: par(ser(lamp('Z1', r1), lamp('Z2', r2)), lamp('Z3', r3)) }
    return bright(11, `parSerVals-${ue}-${ri}-${r1}-${r2}-${r3}`, c, true, 'obě větve mají stejné svorkové napětí; v sériové větvi se dělí v poměru odporů')
  },
}

// ------------------------------------------------------------------ switch opens / lamp burns out

const changeWhat = (ch: Change) => (ch.open ? `Spínač ${label(ch.open)} rozepneme.` : `Žárovka ${label(ch.burnt!)} se přepálí.`)

function change(level: number, key: string, c: Circuit, ch: Change, target: string): ChangeTask {
  const answer = effectOn(c, ch, target)
  const moved = ch.open ?? ch.burnt!
  const rel = relation(c.net, moved, target)
  const s0 = solve(c)
  const s1 = solve(applyChange(c, ch))
  const T = label(target)
  const u0 = s0.part.get(target)!.U
  const u1 = s1.part.get(target)!.U
  const nums = `napětí na ${T}: ${V(u0)} → ${V(u1)}`
  let why: string
  if (answer === 'off') why = rel === 'ser' ? `${T} je s ${label(moved)} v sérii, jediná cesta proudu se přeruší.` : `obvod se přeruší v nerozvětvené části, proud neteče nikudy.`
  else if (answer === 'same') why = `${T} má vlastní větev přímo u zdroje bez vnitřního odporu, napětí na ní se nezmění (${V(u1)}).`
  else if (c.ri > 0 && rel === 'par' && Math.abs(s0.I - s1.I) > 1e-9 && s0.part.get(target)!.U !== s0.U) {
    why = `vzroste celkový odpor, ze zdroje teče menší proud a přerozdělí se napětí (${nums}).`
  } else if (c.ri > 0 && rel === 'par')
    why = `ze zdroje teče menší proud (${A(s0.I)} → ${A(s1.I)}), klesne úbytek R_{i} · I a svorkové napětí vzroste (${V(s0.U)} → ${V(s1.U)}).`
  else if (answer === 'brighter') why = `celkový odpor se změní a na ${T} teď připadne větší napětí (${nums}).`
  else why = `celkový odpor vzroste, proud ze zdroje klesne (${A(s0.I)} → ${A(s1.I)}) a na ${T} zbude menší napětí (${nums}).`
  return {
    kind: 'change',
    level,
    key,
    circuit: c,
    lampValues: level >= 11,
    prompt: `${changeWhat(ch)} Co udělá žárovka ${T}?`,
    change: ch,
    target,
    answer,
    explain: `${T} ${EFFECT_TEXT[answer]}: ${why}`,
  }
}

const C6: Record<string, Gen<ChangeTask>> = {
  serBurn: (rng) => {
    const [a, b] = ids(2, rng)
    return change(6, `serBurn-${a}`, { ue: 4.5, ri: 0, net: ser(sw(), lamp('Z1', 6), lamp('Z2', 6)) }, { burnt: a }, b)
  },
  serSwitch: (rng) => {
    const t = pick(['Z1', 'Z2'], rng)
    return change(6, `serSwitch-${t}`, { ue: 4.5, ri: 0, net: ser(lamp('Z1', 6), sw(), lamp('Z2', 6)) }, { open: 'S' }, t)
  },
  parSwitch: (rng) => {
    const t = pick(['Z1', 'Z2'], rng)
    return change(6, `parSwitch-${t}`, { ue: 4.5, ri: 0, net: par(lamp('Z1', 6), ser(sw(), lamp('Z2', 6))) }, { open: 'S' }, t)
  },
  parBurn: (rng) => {
    const [a, b] = ids(2, rng)
    return change(6, `parBurn-${a}`, { ue: 4.5, ri: 0, net: par(lamp('Z1', 6), lamp('Z2', 6)) }, { burnt: a }, b)
  },
  mainSwitch: (rng) => {
    const t = pick(['Z1', 'Z2'], rng)
    return change(6, `mainSwitch-${t}`, { ue: 4.5, ri: 0, net: ser(sw(), par(lamp('Z1', 6), lamp('Z2', 6))) }, { open: 'S' }, t)
  },
  mixBurn: (rng) => {
    const [burnt, other] = shuffle(['Z2', 'Z3'], rng)
    const t = pick(['Z1', other], rng)
    return change(6, `mixBurn-${burnt}-${t}`, { ue: 6, ri: 0, net: ser(lamp('Z1', 6), par(lamp('Z2', 6), lamp('Z3', 6))) }, { burnt }, t)
  },
}

const C11: Record<string, Gen<ChangeTask>> = {
  parRi: (rng) => {
    const [a, b] = ids(2, rng)
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2] = [pick(R11, rng), pick(R11, rng)]
    return change(11, `parRi-${a}-${ue}-${ri}-${r1}-${r2}`, { ue, ri, net: par(lamp('Z1', r1), lamp('Z2', r2)) }, { burnt: a }, b)
  },
  parSwitchRi: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2] = [pick(R11, rng), pick(R11, rng)]
    return change(11, `parSwitchRi-${ue}-${ri}-${r1}-${r2}`, { ue, ri, net: par(lamp('Z1', r1), ser(sw(), lamp('Z2', r2))) }, { open: 'S' }, 'Z1')
  },
  mixRi: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = [pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    const [burnt, other] = shuffle(['Z2', 'Z3'], rng)
    const t = pick(['Z1', other], rng)
    const task = change(11, `mixRi-${burnt}-${t}-${ue}-${ri}-${r1}-${r2}-${r3}`, { ue, ri, net: ser(lamp('Z1', r1), par(lamp('Z2', r2), lamp('Z3', r3))) }, { burnt }, t)
    // with R_i every lamp changes; a change under 2 % would be graded "svítí stejně" with a wrong reason
    return task.answer === 'same' ? null : task
  },
}

// ------------------------------------------------------------------ build

/** One main slot, then two parallel branches (the first with two slots). */
const mix4 = (): Net => ser(slot('a'), par(ser(slot('b'), slot('c')), slot('d')))
/** One main slot, then two parallel branches with one slot each. */
const mix3 = (): Net => ser(slot('a'), par(slot('b'), slot('c')))

function build(level: number, key: string, c: Circuit, pieces: Part[], goal: Goal, prompt: string, explain: string, lampValues = false): BuildTask | null {
  const all = arrangements(c, pieces, goal)
  const good = all.filter((x) => x.ok)
  if (!good.length || good.length === all.length) return null
  return { kind: 'build', level, key, circuit: c, pieces, goal, prompt, explain, solution: good[0].placed, lampValues }
}

const BU6: Record<string, Gen<BuildTask>> = {
  switchOnly: (rng) => {
    const t = pick(['Z1', 'Z2'], rng)
    return build(
      6,
      `switchOnly-${t}`,
      { ue: 4.5, ri: 0, net: mix4() },
      [lamp('Z1', 6), lamp('Z2', 6), sw(), wire('W1')],
      { t: 'switchOnly', lamp: t },
      `Obě žárovky svítí a spínač ovládá **jen ${label(t)}**.`,
      `Spínač musí být v sérii s ${label(t)} v její vlastní větvi; druhá žárovka má svou větev.`,
    )
  },
  switchAll: () =>
    build(
      6,
      'switchAll',
      { ue: 4.5, ri: 0, net: mix4() },
      [lamp('Z1', 6), lamp('Z2', 6), sw(), wire('W1')],
      { t: 'switchAll' },
      'Obě žárovky svítí a spínač zhasíná **obě najednou**.',
      'Spínač patří do nerozvětvené části obvodu, kudy teče proud pro obě žárovky.',
    ),
  ammeterOnly: (rng) => {
    const t = pick(['Z1', 'Z2'], rng)
    return build(
      6,
      `ammeterOnly-${t}`,
      { ue: 4.5, ri: 0, net: mix4() },
      [lamp('Z1', 6), lamp('Z2', 6), amm(), wire('W1')],
      { t: 'ammeterOnly', lamp: t },
      `Obě žárovky svítí a ampérmetr měří proud **jen žárovkou ${label(t)}**.`,
      `Ampérmetr se zapojuje do série – do stejné větve jako ${label(t)}.`,
    )
  },
  voltSource: () =>
    build(
      6,
      'voltSource',
      { ue: 4.5, ri: 0, net: mix4() },
      [lamp('Z1', 6), lamp('Z2', 6), volt(), wire('W1')],
      { t: 'voltSource' },
      'Obě žárovky svítí a voltmetr měří **napětí zdroje**.',
      'Voltmetr se připojuje paralelně; v sérii by kvůli svému velkému odporu proud téměř zastavil.',
    ),
  independent: () =>
    build(
      6,
      'independent',
      { ue: 4.5, ri: 0, net: mix3() },
      [lamp('Z1', 6), lamp('Z2', 6), wire('W1')],
      { t: 'independent' },
      'Obě žárovky svítí, a když se jedna přepálí, **druhá svítí dál**.',
      'Žárovky musí být paralelně, každá ve vlastní větvi – jako doma v zásuvkách.',
    ),
}

function valueBuild(rng: Rng, meterKind: 'A' | 'V'): BuildTask | null {
  const ue = pick(UE11, rng)
  const ri = pick(RI11, rng)
  const rs = pickN(R11, 3, rng)
  const pieces = rs.map((r, i) => res(`R${i + 1}`, r))
  const net = meterKind === 'A' ? ser(amm(), slot('a'), par(slot('b'), slot('c'))) : ser(par(slot('a'), volt()), par(slot('b'), slot('c')))
  const c: Circuit = { ue, ri, net }
  const main = pick(pieces, rng)
  const others = pieces.filter((p) => p !== main)
  const target = solve({ ...c, net: meterKind === 'A' ? ser(amm(), main, par(others[0], others[1])) : ser(par(main, volt()), par(others[0], others[1])) })
  const value = meterKind === 'A' ? target.I : target.part.get('V')!.U
  // Every other choice of the main resistor must give a clearly different reading.
  for (const p of pieces) {
    if (p === main) continue
    const rest = pieces.filter((x) => x !== p)
    const s = solve({ ...c, net: meterKind === 'A' ? ser(amm(), p, par(rest[0], rest[1])) : ser(par(p, volt()), par(rest[0], rest[1])) })
    const v = meterKind === 'A' ? s.I : s.part.get('V')!.U
    if (Math.abs(v - value) < value * 0.06) return null
  }
  const unit = meterKind === 'A' ? 'A' : 'V'
  const shown = Number(value.toPrecision(3))
  const goal: Goal = { t: 'value', meter: meterKind, value: shown }
  const mr = (main as { r: number }).r
  const [o1, o2] = others.map((o) => (o as { r: number }).r)
  const Rp = (o1 * o2) / (o1 + o2)
  return build(
    11,
    `value${meterKind}-${ue}-${ri}-${rs.join('-')}-${mr}`,
    c,
    pieces,
    goal,
    meterKind === 'A' ? `Rozmísti rezistory tak, aby ampérmetr ukazoval **${q(shown, unit)}**.` : `Rozmísti rezistory tak, aby voltmetr ukazoval **${q(shown, unit)}**.`,
    `Do hlavní větve patří ${O(mr)}: R = ${O(mr)} + ${fmt(o1)} · ${fmt(o2)} / (${fmt(o1)} + ${fmt(o2)}) Ω = ${O(mr + Rp)}, I = U_{e} / (R + R_{i}) = ${A(target.I)}${meterKind === 'V' ? `, U = ${O(mr)} · I = ${V(value)}` : ''}.`,
    true,
  )
}

const BU11: Record<string, Gen<BuildTask>> = {
  valueA: (rng) => valueBuild(rng, 'A'),
  valueV: (rng) => valueBuild(rng, 'V'),
}

// ------------------------------------------------------------------ level 11: meters

const M11: Record<string, Gen<MeterTask>> = {
  mixI: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = [pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    const c: Circuit = { ue, ri, net: ser(amm(), res('R1', r1), par(res('R2', r2), res('R3', r3))) }
    const s = solve(c)
    return meter(11, `mixI-${ue}-${ri}-${r1}-${r2}-${r3}`, c, {
      prompt: 'Zdroj má vnitřní odpor. Co ukáže ampérmetr?',
      answer: s.I,
      unit: 'A',
      symbol: 'I',
      explain: `R = R₁ + R₂ · R₃ / (R₂ + R₃) = ${O(s.R)}, I = U_{e} / (R + R_{i}) = ${V(ue)} / ${O(s.R + ri)} = ${A(s.I)}.`,
    })
  },
  terminalU: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = [pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    const c: Circuit = { ue, ri, net: par(ser(res('R1', r1), par(res('R2', r2), res('R3', r3))), volt()) }
    const s = solve(c)
    return meter(11, `terminalU-${ue}-${ri}-${r1}-${r2}-${r3}`, c, {
      prompt: 'Voltmetr je připojený na svorky zdroje. Jaké **svorkové napětí** ukáže?',
      answer: s.U,
      unit: 'V',
      symbol: 'U',
      explain: `R = ${O(s.R)}, I = U_{e} / (R + R_{i}) = ${A(s.I)}, U = U_{e} − R_{i} · I = ${V(ue)} − ${O(ri)} · ${A(s.I)} = ${V(s.U)}.`,
    })
  },
  branchI: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = [pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    if (r2 === r3) return null
    const c: Circuit = { ue, ri, net: ser(res('R1', r1), par(res('R2', r2), ser(amm(), res('R3', r3)))) }
    const s = solve(c)
    const Up = s.part.get('R3')!.U
    const I3 = s.part.get('R3')!.I
    return meter(11, `branchI-${ue}-${ri}-${r1}-${r2}-${r3}`, c, {
      prompt: 'Jaký proud teče rezistorem R₃ (co ukáže ampérmetr)?',
      answer: I3,
      unit: 'A',
      symbol: 'I_{3}',
      explain: `I = U_{e} / (R + R_{i}) = ${A(s.I)}; na rozvětvení je U = U_{e} − (R_{i} + R₁) · I = ${V(Up)}, takže I₃ = ${V(Up)} / ${O(r3)} = ${A(I3)} (a I₂ = I − I₃ = ${A(s.I - I3)}).`,
    })
  },
  loopU: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = [pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    const c: Circuit = { ue, ri, net: ser(res('R1', r1), par(res('R2', r2), res('R3', r3), volt())) }
    const s = solve(c)
    const U = s.part.get('V')!.U
    return meter(11, `loopU-${ue}-${ri}-${r1}-${r2}-${r3}`, c, {
      prompt: 'Co ukáže voltmetr na paralelní dvojici R₂, R₃?',
      answer: U,
      unit: 'V',
      symbol: 'U_{23}',
      explain: `I = ${A(s.I)}; podle 2. Kirchhoffova zákona U_{e} = R_{i} · I + R₁ · I + U₂₃, tedy U₂₃ = ${V(ue)} − ${V(ri * s.I)} − ${V(r1 * s.I)} = ${V(U)}.`,
    })
  },
  equivR: (rng) => {
    const [r1, r2, r3, r4] = [pick(R11, rng), pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    const c: Circuit = { ue: 12, ri: 1, net: ser(par(ser(res('R1', r1), res('R2', r2)), res('R3', r3)), res('R4', r4)) }
    const R = solve(c).R
    const r12 = r1 + r2
    const rp = (r12 * r3) / (r12 + r3)
    return meter(11, `equivR-${r1}-${r2}-${r3}-${r4}`, c, {
      prompt: 'Jaký je **výsledný odpor** vnější části obvodu (bez zdroje)?',
      answer: R,
      unit: 'Ω',
      symbol: 'R',
      explain: `R₁ + R₂ = ${O(r12)}; paralelně s R₃: ${fmt(r12)} · ${fmt(r3)} / (${fmt(r12)} + ${fmt(r3)}) = ${O(rp)}; plus R₄: R = ${O(R)}.`,
    })
  },
  shortI: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick([0.1, 0.2, 0.5, 1, 1.5], rng)
    const c: Circuit = { ue, ri, net: amm() }
    const I = solve(c).I
    return meter(11, `shortI-${ue}-${ri}`, c, {
      prompt: 'Svorky zdroje spojíme přímo ampérmetrem (**zkrat**). Jaký proud ukáže?',
      answer: I,
      unit: 'A',
      symbol: 'I_{k}',
      explain: `Vnější odpor je nulový, proud brzdí jen vnitřní odpor: I_{k} = U_{e} / R_{i} = ${V(ue)} / ${O(ri)} = ${A(I)}. Proto je zkrat nebezpečný.`,
    })
  },
  powerR1: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const [r1, r2, r3] = [pick(R11, rng), pick(R11, rng), pick(R11, rng)]
    const c: Circuit = { ue, ri, net: ser(res('R1', r1), par(res('R2', r2), res('R3', r3))) }
    const s = solve(c)
    const P = power(s, 'R1')
    return meter(11, `powerR1-${ue}-${ri}-${r1}-${r2}-${r3}`, c, {
      prompt: 'Jaký výkon se mění v teplo na rezistoru R₁?',
      answer: P,
      unit: 'W',
      symbol: 'P_{1}',
      explain: `R = ${O(s.R)}, I = U_{e} / (R + R_{i}) = ${A(s.I)}, P₁ = R₁ · I² = ${O(r1)} · (${A(s.I)})² = ${W(P)}.`,
    })
  },
  findRi: (rng) => {
    const ue = pick(UE11, rng)
    const ri = pick(RI11, rng)
    const r1 = pick(R11, rng)
    const c: Circuit = { ue, ri, net: par(ser(amm(), res('R1', r1)), volt()) }
    const s = solve(c)
    const I = Number(s.I.toFixed(2))
    const U = Number(s.U.toFixed(2))
    const Ri = (ue - U) / I
    if (Math.abs(Ri - ri) > ri * 0.02) return null
    return meter(11, `findRi-${ue}-${ri}-${r1}`, c, {
      prompt: `Zdroj má U_{e} = ${V(ue)}. Voltmetr na svorkách ukazuje ${V(U)} a ampérmetr ${A(I)}. Jaký je vnitřní odpor zdroje?`,
      answer: Ri,
      unit: 'Ω',
      symbol: 'R_{i}',
      given: { A: I, V: U },
      hideRi: true,
      explain: `Na vnitřním odporu se ztratí U_{e} − U = ${V(ue - U)}, takže R_{i} = (U_{e} − U) / I = ${V(ue - U)} / ${A(I)} = ${O(Ri)}.`,
    })
  },
}

// ------------------------------------------------------------------ levels

export interface LevelSet {
  meter: Record<string, Gen<MeterTask>>
  bright: Record<string, Gen<BrightTask>>
  change: Record<string, Gen<ChangeTask>>
  build: Record<string, Gen<BuildTask>>
  /** How many tasks of each kind a round of this level has (sums to ROUND). */
  plan: Record<Kind, number>
}

export const ROUND = 10

export const LEVELS: Record<number, LevelSet> = {
  6: { meter: M6, bright: B6, change: C6, build: BU6, plan: { meter: 4, bright: 2, change: 2, build: 2 } },
  11: { meter: M11, bright: B11, change: C11, build: BU11, plan: { meter: 5, bright: 1, change: 2, build: 2 } },
}

/** Plan for a mixed round (free play): half from each level. */
const MIX_PLAN: Record<Kind, number> = { meter: 2, bright: 1, change: 1, build: 1 }

const KINDS: Kind[] = ['meter', 'bright', 'change', 'build']

/** `n` tasks of one kind from one level, each from a different template when possible, all keys unique. */
function tasksOf(level: number, kind: Kind, n: number, rng: Rng, used: Set<string>): Task[] {
  const gens = Object.values(LEVELS[level][kind]) as Gen<Task>[]
  const order = shuffle(gens, rng)
  const out: Task[] = []
  for (let k = 0; out.length < n && k < n * 4; k++) {
    const gen = order[k % order.length]
    for (let tries = 0; tries < 60; tries++) {
      const t = gen(rng)
      if (t && !used.has(t.key)) {
        used.add(t.key)
        out.push(t)
        break
      }
    }
  }
  return out
}

/** A round of ROUND tasks for a level (undefined = mix of all levels). A meter task comes first. */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const used = new Set<string>()
  const all: Task[] = []
  const lvls = level !== undefined && LEVELS[level] ? [level] : Object.keys(LEVELS).map(Number)
  for (const lv of lvls) {
    const plan = lvls.length > 1 ? MIX_PLAN : LEVELS[lv].plan
    for (const kind of KINDS) all.push(...tasksOf(lv, kind, plan[kind], rng, used))
  }
  // Meter task first; build tasks (they take longer) spread out, never two in a row.
  const rest = shuffle(
    all.filter((t) => t.kind !== 'build'),
    rng,
  )
  const first = rest.findIndex((t) => t.kind === 'meter')
  if (first > 0) rest.unshift(...rest.splice(first, 1))
  const builds = shuffle(
    all.filter((t) => t.kind === 'build'),
    rng,
  )
  const round: Task[] = []
  const slotsAt = builds.map((_, k) => Math.max(1, Math.round(((k + 1) * rest.length) / (builds.length + 1))))
  rest.forEach((t, k) => {
    round.push(t)
    slotsAt.forEach((at, b) => {
      if (at === k + 1) round.push(builds[b])
    })
  })
  return round
}

export const EFFECT_OPTIONS: { id: Effect; text: string }[] = (['off', 'brighter', 'dimmer', 'same'] as Effect[]).map((id) => ({ id, text: EFFECT_TEXT[id] }))
