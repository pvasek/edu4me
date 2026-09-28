import { Fragment, type ReactNode } from 'react'

/**
 * Tiny inline markup used by all course content.
 *
 *   **bold**        *italic*        ==highlight==
 *   $H2SO4$         chemistry: digits after a letter or ")" become subscripts
 *   $Fe^{3+}$ $SO4^2-$  superscripts (braced or a run of digits/+/-)
 *   ^{23} _{6}      super/subscript anywhere
 *   -> <=> <-       arrows (→ ⇌ ←)
 */
export function Md({ text }: { text: string }) {
  return <>{parse(text)}</>
}

const ARROWS: [RegExp, string][] = [
  [/<=>/g, '⇌'],
  [/->/g, '→'],
  [/<-/g, '←'],
]

function arrows(s: string) {
  for (const [re, ch] of ARROWS) s = s.replace(re, ch)
  return s
}

/**
 * Long equations may wrap, but only between terms: a no-break space glues each
 * operator (+, →, ⇌, =) to the term before it, so a line ends with the operator
 * and a species is never split (species contain no spaces).
 */
function breakable(s: string) {
  return s.replace(/ ([+→⇌⇄←=]) /g, '\u00a0$1 ')
}

let keySeed = 0
const k = () => `m${keySeed++}`

export function parse(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let i = 0
  let buf = ''
  const flush = () => {
    if (buf) out.push(...scripts(arrows(buf), false))
    buf = ''
  }
  while (i < text.length) {
    const rest = text.slice(i)
    if (rest.startsWith('**')) {
      const end = text.indexOf('**', i + 2)
      if (end > -1) {
        flush()
        out.push(<strong key={k()}>{parse(text.slice(i + 2, end))}</strong>)
        i = end + 2
        continue
      }
    }
    if (rest.startsWith('==')) {
      const end = text.indexOf('==', i + 2)
      if (end > -1) {
        flush()
        out.push(<mark key={k()}>{parse(text.slice(i + 2, end))}</mark>)
        i = end + 2
        continue
      }
    }
    if (text[i] === '*' && text[i + 1] !== ' ') {
      const end = text.indexOf('*', i + 1)
      if (end > -1) {
        flush()
        out.push(<em key={k()}>{parse(text.slice(i + 1, end))}</em>)
        i = end + 1
        continue
      }
    }
    if (text[i] === '$') {
      const end = text.indexOf('$', i + 1)
      if (end > -1) {
        flush()
        out.push(
          <span className="chem" key={k()}>
            {scripts(breakable(arrows(text.slice(i + 1, end))), true)}
          </span>,
        )
        i = end + 1
        continue
      }
    }
    buf += text[i]
    i++
  }
  flush()
  return out
}

/** Handles ^{..} _{..} everywhere, and automatic chemistry subscripts in chem mode. */
function scripts(s: string, chem: boolean): ReactNode[] {
  const out: ReactNode[] = []
  let buf = ''
  const flush = () => {
    if (buf) out.push(<Fragment key={k()}>{buf}</Fragment>)
    buf = ''
  }
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if ((c === '^' || c === '_') && s[i + 1] === '{') {
      const end = s.indexOf('}', i + 2)
      if (end > -1) {
        flush()
        const inner = s.slice(i + 2, end)
        out.push(c === '^' ? <sup key={k()}>{inner}</sup> : <sub key={k()}>{inner}</sub>)
        i = end
        continue
      }
    }
    if (chem && c === '^') {
      let j = i + 1
      while (j < s.length && /[0-9+\-−]/.test(s[j])) j++
      if (j > i + 1) {
        flush()
        out.push(<sup key={k()}>{s.slice(i + 1, j).replace(/-/g, '−')}</sup>)
        i = j - 1
        continue
      }
    }
    if (chem && /[0-9]/.test(c) && i > 0 && /[A-Za-z)\]]/.test(s[i - 1])) {
      let j = i
      while (j < s.length && /[0-9]/.test(s[j])) j++
      flush()
      out.push(<sub key={k()}>{s.slice(i, j)}</sub>)
      i = j - 1
      continue
    }
    buf += c
  }
  flush()
  return out
}

/** Plain-text version (for comparisons, aria-labels, search). */
export function plain(text: string): string {
  return arrows(text)
    .replace(/\*\*|==|\$/g, '')
    .replace(/\*/g, '')
    .replace(/[\^_]\{([^}]*)\}/g, '$1')
}
