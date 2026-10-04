import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import { levelNum, type GameProps } from '../types'
import { Bench, MirrorScene, RefractScene } from './Bench'
import { ANGLE_TOL, LEVELS, TOL12, TOL5, makeRound, type Task } from './levels'
import {
  BEND_TEXT,
  ELEMENT_NAME,
  fmt,
  imageOf,
  imagePoint,
  isMirror,
  nearImage,
  parseNum,
  propsOf,
  propsText,
  within,
  type Bend,
  type Pt,
  type Size,
} from './logic'
import './ray-optics.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
const BONUS_TIME: Record<Task['kind'], [number, number]> = { locate: [15, 45], props: [15, 45], reflect: [10, 35], refract: [8, 30], calc: [25, 75] }
const KIND_TITLE: Record<Task['kind'], string> = {
  locate: 'Kde vznikne obraz?',
  props: 'Jaký bude obraz?',
  reflect: 'Odraz na rovinném zrcadle',
  refract: 'Lom světla',
  calc: 'Zobrazovací rovnice',
}
const CALC_WORD: Record<string, string> = { ap: 'vzdálenost obrazu', Z: 'zvětšení', f: 'ohnisková vzdálenost', phi: 'optická mohutnost' }

type Status = 'play' | 'done'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
interface PropPick {
  real?: boolean
  size?: Size
  inverted?: boolean
  none: boolean
}

export default function RayOptics({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => {
    const n = levelNum(levelId)
    return n !== undefined && LEVELS[n] ? n : undefined
  })
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const task = tasks[i]
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [text, setText] = useState('')
  const [marker, setMarker] = useState<Pt | null>(null)
  const [theta, setTheta] = useState(0)
  const [pp, setPp] = useState<PropPick>({ none: false })
  const [picked, setPicked] = useState<Bend | null>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const [full, zero] = BONUS_TIME[task.kind]
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, full, zero) : 0
  const hasCalc = tasks.some((t) => t.level === 12)

  const say = (kind: Msg['kind'], t: string) => {
    setMsg({ kind, text: t })
    setMsgN((n) => n + 1)
  }
  const award = (firstTry: boolean) => {
    const t = (Date.now() - start) / 1000
    const p = firstTry ? 100 + timeBonus(t, BONUS_MAX, full, zero) : 50
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
    return t
  }
  const done = (t = (Date.now() - start) / 1000) => {
    setFrozen(t)
    setStatus('done')
  }
  const right = (firstTry: boolean, t: string) => {
    done(award(firstTry))
    jolt.pop()
    say('good', t)
  }
  const wrongFinal = (t: string) => {
    done()
    jolt.shake()
    say('bad', t)
  }

  // ---------------------------------------------------------------- answers

  const submitCalc = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play' || task.kind !== 'calc') return
    const v = parseNum(text)
    if (v === null) {
      say('info', 'Napiš číslo, třeba −6,5 nebo 12. Desetinná čárka i tečka platí, záporné číslo začni mínusem.')
      return
    }
    const ans = `${task.symbol} = ${fmt(task.answer)}${task.unit ? ` ${task.unit}` : ''}`
    if (within(v, task.answer)) return right(tries === 0, `Správně! ${ans}.`)
    jolt.shake()
    if (tries === 0) {
      setTries(1)
      let hint = 'Dosaď znovu do 1/a + 1/a′ = 1/f a pohlídej znaménka.'
      if (within(-v, task.answer)) hint = 'Velikost sedí, ale **znaménko** ne. Kladné a′ = skutečný obraz, kladné f = spojka / duté zrcadlo, kladné Z = přímý obraz.'
      else if (task.ask === 'phi' && (within(v * 100, task.answer) || within(v / 100, task.answer))) hint = 'Pozor na jednotky: do φ = 1/f dosazuj f v **metrech**.'
      else if (task.ask === 'ap' && within(v, 1 / (1 / task.scene.f + 1 / task.scene.a))) hint = 'Z rovnice je 1/a′ = 1/f − 1/a (odčítá se).'
      say('bad', `${fmt(v)} to není. ${hint}`)
      inputRef.current?.select()
    } else {
      wrongFinal(`Ani tentokrát. Správně je ${ans}.`)
    }
  }

  const checkLocate = () => {
    if (status !== 'play' || task.kind !== 'locate' || !marker) return
    const s = task.scene
    const r = nearImage(s, marker, task.level >= 12 ? TOL12 : TOL5)
    if (r.ok) return right(tries === 0, 'Přesně tam! Podívej se, jak se paprsky protínají.')
    const img = imagePoint(s)!
    const ap = imageOf(s.f, s.a).ap!
    const mirror = isMirror(s.el)
    const sideOk = Math.sign(marker.x) === Math.sign(img.x)
    let hint: string
    if (!sideOk)
      hint = ap > 0 ? `Obraz je skutečný – vzniká ${mirror ? 'před zrcadlem, na straně předmětu' : 'za čočkou, kde se paprsky skutečně protnou'}.` : `Obraz je zdánlivý – najdeš ho ${mirror ? 'za zrcadlem' : 'na straně předmětu'}, kde se protnou prodloužení paprsků.`
    else if (Math.sign(marker.y) !== Math.sign(img.y)) hint = img.y < 0 ? 'Obraz je převrácený – šipka má mířit dolů.' : 'Obraz je přímý – šipka má mířit nahoru.'
    else if (Math.abs(marker.x - img.x) > Math.abs(marker.y - img.y) * 0.5 && Math.abs(Math.abs(marker.x) - Math.abs(img.x)) > 1e-9)
      hint = Math.abs(img.x) > Math.abs(marker.x) ? `Obraz je dál od ${mirror ? 'zrcadla' : 'čočky'}.` : `Obraz je blíž k ${mirror ? 'zrcadlu' : 'čočce'}.`
    else hint = Math.abs(img.y) > Math.abs(marker.y) ? 'Obraz je větší.' : 'Obraz je menší.'
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      say('bad', `Tady ne. ${hint} Zkus to znovu.`)
    } else wrongFinal(`Ani teď. ${hint} Obraz je ${propsText(propsOf(imageOf(s.f, s.a)))}.`)
  }

  const checkProps = () => {
    if (status !== 'play' || task.kind !== 'props') return
    const a = task.answer
    const ok = a === null ? pp.none : !pp.none && pp.real === a.real && pp.size === a.size && pp.inverted === a.inverted
    if (ok) return right(true, `Správně: ${propsText(a)}.`)
    wrongFinal(`Kdepak. ${a ? `Obraz je ${propsText(a)}.` : 'Předmět je v ohnisku, obraz nevznikne.'}`)
  }

  const checkReflect = () => {
    if (status !== 'play' || task.kind !== 'reflect') return
    if (Math.abs(theta - task.alpha) <= ANGLE_TOL) return right(true, `Správně! Úhel odrazu α′ = ${task.alpha}° (tvůj ${theta}°).`)
    wrongFinal(
      theta <= 0
        ? 'Odražený paprsek musí jít na druhou stranu kolmice než dopadající.'
        : `Tvůj paprsek svírá s kolmicí ${theta}°, správně je ${task.alpha}°.`,
    )
  }

  const chooseBend = (b: Bend) => {
    if (status !== 'play' || task.kind !== 'refract') return
    setPicked(b)
    if (b === task.answer) right(true, `Správně: ${BEND_TEXT[b]}.`)
    else wrongFinal(`Kdepak. Správně: ${BEND_TEXT[task.answer]}.`)
  }

  const giveUp = () => {
    if (status !== 'play') return
    done()
    say('info', task.kind === 'calc' ? `Nevadí. Správně je ${task.symbol} = ${fmt(task.answer)}${task.unit ? ` ${task.unit}` : ''}.` : 'Nevadí. Podívej se na paprsky.')
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setText('')
    setMarker(null)
    setTheta(0)
    setPp({ none: false })
    setPicked(null)
    setMsg(null)
    setPts(0)
    setStart(Date.now())
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const mood: Mood = status === 'done' ? (pts > 0 ? 'cheer' : 'sad') : tries ? 'think' : 'happy'
  const reveal = status === 'done'

  // ---------------------------------------------------------------- scene
  let stage: ReactNode = null
  if (task.kind === 'locate' || task.kind === 'props' || task.kind === 'calc') {
    const s = task.scene
    const cm = task.kind !== 'props' && task.level >= 12
    const onMarker =
      task.kind === 'locate'
        ? (p: Pt) => setMarker(p)
        : undefined
    const hidden = task.kind === 'calc' && task.hideElement && !reveal
    const label = `Optická lavice: ${hidden ? (isMirror(s.el) ? 'neznámé zrcadlo' : 'neznámá čočka') : ELEMENT_NAME[s.el]}${cm ? `${hidden ? '' : ` s ohniskovou vzdáleností ${fmt(s.f)} cm`}, předmět ${fmt(s.a)} cm před ní` : `, předmět ve vzdálenosti ${fmt(s.a / Math.abs(s.f))} f`}.${reveal ? ` Obraz: ${propsText(propsOf(imageOf(s.f, s.a)))}, vyznačený s význačnými paprsky.` : ''}`
    stage = (
      <>
        <Bench
          scene={s}
          cm={cm}
          reveal={reveal}
          marker={task.kind === 'locate' ? marker : undefined}
          onMarker={onMarker}
          label={label}
          hideElement={task.kind === 'calc' && task.hideElement}
        />
        {task.kind === 'locate' && !reveal && (
          <p className="ro-hint">
            {marker ? 'Dolaď polohu tažením (nebo šipkami) a zkontroluj.' : 'Ťukni nebo táhni tam, kde vznikne vrchol obrazu.'}
          </p>
        )}
        {reveal && (
          <ul className="ro-legend" aria-label="Význačné paprsky">
            <li>
              <i className="ro-ray-a" /> rovnoběžný s osou → ohniskem
            </li>
            <li>
              <i className="ro-ray-b" /> {isMirror(s.el) ? 'do vrcholu zrcadla' : 'středem čočky'}
            </li>
            <li>
              <i className="ro-ray-c" /> ohniskem → rovnoběžně
            </li>
            <li>
              <i className="ro-ray-v" /> prodloužení (zdánlivé)
            </li>
          </ul>
        )}
      </>
    )
  } else if (task.kind === 'reflect') {
    stage = (
      <>
        <MirrorScene
          alpha={task.alpha}
          given={task.given}
          theta={theta}
          onTheta={setTheta}
          reveal={reveal}
          label={`Rovinné zrcadlo s kolmicí dopadu. Dopadající paprsek zleva. ${reveal ? `Správný odražený paprsek svírá s kolmicí ${task.alpha}°.` : 'Tažením nebo šipkami natoč odražený paprsek.'}`}
        />
        {!reveal && <p className="ro-hint">Táhni za kulatou úchytku nebo použij šipky. Teď: {Math.abs(theta)}° {theta === 0 ? 'podél kolmice' : theta > 0 ? 'vpravo od kolmice' : 'vlevo od kolmice'}.</p>}
      </>
    )
  } else if (task.kind === 'refract') {
    stage = (
      <RefractScene
        m1={task.m1}
        m2={task.m2}
        alpha={task.alpha}
        reveal={reveal}
        label={`Rozhraní: nahoře ${task.m1.name}, dole ${task.m2.name}, paprsek dopadá pod úhlem ${task.alpha}° od kolmice.`}
      />
    )
  }

  const propsReady = pp.none || (pp.real !== undefined && pp.size !== undefined && pp.inverted !== undefined)

  return (
    <div className="g-sh-root ro">
      <p className="g-sh-instr">
        {hasCalc
          ? 'Znaménka: a′ > 0 skutečný obraz, a′ < 0 zdánlivý; f > 0 spojka a duté zrcadlo, f < 0 rozptylka a vypuklé zrcadlo. Tolerance ±2 %.'
          : 'Táhni, natáčej a vybírej. Po každé odpovědi uvidíš paprsky, které ukážou proč.'}
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úloha" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card ro-card">
        <div className="ro-top">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={i} className="ro-q" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <span className="eyebrow">{task.kind === 'calc' ? `${KIND_TITLE.calc} · ${CALC_WORD[task.ask]}` : KIND_TITLE[task.kind]}</span>
              <p className="ro-prompt">
                <Md text={task.prompt} />
              </p>
            </motion.div>
          </AnimatePresence>
          <Mascot mood={mood} size={52} />
          {status === 'done' && pts > 0 && <PointsPop key={`p${i}`} points={pts} />}
        </div>
        <div className="ro-stage" key={`s${i}`}>
          {stage}
        </div>
        {status === 'play' && (
          <div className="ro-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress ro-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ answer area */}
      {task.kind === 'calc' && status === 'play' && (
        <form className="ro-form" onSubmit={submitCalc}>
          <label className="ro-field">
            <span className="ro-sym">{task.symbol} =</span>
            <input
              ref={inputRef}
              className="g-sh-input ro-input"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoFocus
              aria-label={`${CALC_WORD[task.ask]}${task.unit ? ` v ${task.unit === 'cm' ? 'centimetrech' : 'dioptriích'}` : ''}`}
              placeholder="např. −12,5"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {task.unit && <span className="ro-unit">{task.unit}</span>}
          </label>
          <button type="button" className="btn ro-minus" onClick={() => setText((t) => (t.startsWith('−') || t.startsWith('-') ? t.slice(1) : `−${t}`))} aria-label="Změnit znaménko">
            ±
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
            <Icon name="check" /> Zkontrolovat
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </form>
      )}

      {task.kind === 'locate' && status === 'play' && (
        <div className="g-sh-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={checkLocate} disabled={!marker}>
            <Icon name="check" /> Zkontrolovat
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </div>
      )}

      {task.kind === 'reflect' && status === 'play' && (
        <div className="g-sh-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={checkReflect}>
            <Icon name="check" /> Zkontrolovat
          </button>
        </div>
      )}

      {task.kind === 'props' && (
        <div className="ro-props">
          <Seg label="Druh" value={pp.none ? undefined : pp.real} disabled={pp.none || reveal} options={[[true, 'skutečný'], [false, 'zdánlivý']]} onPick={(v) => setPp({ ...pp, real: v })} correct={reveal ? task.answer?.real : undefined} />
          <Seg
            label="Velikost"
            value={pp.none ? undefined : pp.size}
            disabled={pp.none || reveal}
            options={[
              ['zvětšený', 'zvětšený'],
              ['stejně velký', 'stejně velký'],
              ['zmenšený', 'zmenšený'],
            ]}
            onPick={(v) => setPp({ ...pp, size: v })}
            correct={reveal ? task.answer?.size : undefined}
          />
          <Seg label="Poloha" value={pp.none ? undefined : pp.inverted} disabled={pp.none || reveal} options={[[true, 'převrácený'], [false, 'přímý']]} onPick={(v) => setPp({ ...pp, inverted: v })} correct={reveal ? task.answer?.inverted : undefined} />
          <button type="button" className={`btn ro-none${reveal && task.answer === null ? ' is-ok' : ''}`} aria-pressed={pp.none} disabled={reveal} onClick={() => setPp({ ...pp, none: !pp.none })}>
            <Icon name={pp.none ? 'check' : 'x'} /> Obraz nevznikne
          </button>
          {status === 'play' && (
            <div className="g-sh-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={checkProps} disabled={!propsReady}>
                <Icon name="check" /> Zkontrolovat
              </button>
            </div>
          )}
        </div>
      )}

      {task.kind === 'refract' && (
        <div className="ro-opts" role="group" aria-label="Možnosti">
          {(['toward', 'away', 'straight', 'total'] as Bend[]).map((b) => {
            const st = reveal ? (b === task.answer ? 'ok' : b === picked ? 'bad' : '') : ''
            return (
              <button key={b} type="button" className={`btn ro-opt${st ? ` is-${st}` : ''}`} disabled={reveal} onClick={() => chooseBend(b)}>
                {BEND_TEXT[b]}
                {st === 'ok' && <Icon name="check" />}
                {st === 'bad' && <Icon name="x" />}
              </button>
            )
          })}
        </div>
      )}

      <div className="ro-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={msg.text} />
          </Feedback>
        )}
      </div>

      {status === 'done' && (
        <motion.div className="card-flat ro-why" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p>
            <Icon name="bulb" className="ro-why-ico" /> <Md text={task.explain} />
          </p>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další úloha'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/** Segmented choice for one image property. */
function Seg<T extends string | boolean>({
  label,
  value,
  options,
  onPick,
  disabled,
  correct,
}: {
  label: string
  value: T | undefined
  options: [T, string][]
  onPick: (v: T) => void
  disabled: boolean
  correct?: T
}) {
  return (
    <div className="ro-seg-row">
      <span className="ro-seg-label">{label}</span>
      <div className="g-sh-seg ro-seg" role="group" aria-label={label}>
        {options.map(([v, t]) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={value === v}
            disabled={disabled}
            className={correct !== undefined && correct === v ? 'is-ok' : correct !== undefined && value === v ? 'is-bad' : ''}
            onClick={() => onPick(v)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

