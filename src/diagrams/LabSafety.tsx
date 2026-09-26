import { useState, type ReactNode } from 'react'
import type { DiagramProps } from './util'

// GHS pictograms are standardised: red frame, black symbol, white ground (same in both themes).
const K = '#111'
const W = '#fff'

const flame = (x: number, y: number, s = 1) =>
  `M${x} ${y} c${-9 * s} ${-6 * s} ${-12 * s} ${-16 * s} ${-6 * s} ${-26 * s} c${1 * s} ${6 * s} ${4 * s} ${8 * s} ${6 * s} ${8 * s} c${-2 * s} ${-9 * s} ${2 * s} ${-16 * s} ${8 * s} ${-20 * s} c${-1 * s} ${8 * s} ${6 * s} ${12 * s} ${7 * s} ${20 * s} c${1 * s} ${-3 * s} ${3 * s} ${-5 * s} ${5 * s} ${-6 * s} c${3 * s} ${9 * s} ${-1 * s} ${19 * s} ${-14 * s} ${24 * s} Z`

const SYMBOLS: Record<string, ReactNode> = {
  explosive: (
    <g fill={K}>
      <circle cx={46} cy={60} r={10} />
      <rect x={50} y={45} width={6} height={6} transform="rotate(35 53 48)" />
      <path d="M58 42 l6 -6 M60 46 l8 -2" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M30 40 l6 5 M26 54 l8 1 M31 72 l6 -4 M44 78 l1 -6 M58 74 l-4 -5 M66 62 l-7 -1 M46 36 l1 7" stroke={K} strokeWidth={3} strokeLinecap="round" />
      <path d="M63 30 l2 6 5 -3 -2 6 6 1 -5 3 3 5 -6 -2 -1 6 -3 -5 -4 4 1 -6 -6 -1 5 -3 -3 -5 6 2 Z" />
    </g>
  ),
  flammable: (
    <g fill={K}>
      <path d={flame(50, 70, 1.1)} transform="translate(-4 0)" />
      <rect x={30} y={72} width={40} height={4} />
    </g>
  ),
  oxidising: (
    <g>
      <circle cx={50} cy={62} r={10} fill="none" stroke={K} strokeWidth={5} />
      <path d={flame(50, 51, 0.8)} fill={K} transform="translate(-3 0)" />
      <rect x={30} y={75} width={40} height={4} fill={K} />
    </g>
  ),
  gas: (
    <g transform="rotate(-30 50 56)">
      <rect x={30} y={48} width={42} height={18} rx={8} fill={K} />
      <rect x={71} y={52} width={6} height={10} fill={K} />
      <rect x={77} y={50} width={4} height={14} fill={K} />
    </g>
  ),
  corrosive: (
    <g fill={K} stroke={K} strokeLinecap="round">
      <rect x={30} y={28} width={9} height={18} rx={2} transform="rotate(-35 34 37)" />
      <rect x={58} y={28} width={9} height={18} rx={2} transform="rotate(-35 62 37)" />
      <path d="M40 46 v5 M42 54 v3 M67 46 v5 M69 54 v3" strokeWidth={2.4} fill="none" />
      <path d="M26 66 h20 l-3 -3 -3 4 -3 -4 -3 4 z" strokeWidth={1} />
      <rect x={24} y={67} width={24} height={5} stroke="none" />
      <path d="M55 72 h18 c3 0 3 -4 0 -4 h-6 c3 0 3 -4 0 -4 h-10 l-2 -3 c-2 -3 -5 -1 -4 2 l2 5 z" strokeWidth={1} />
      <rect x={20} y={76} width={60} height={4} stroke="none" />
    </g>
  ),
  toxic: (
    <g fill={K}>
      <path d="M30 78 L70 58 M30 58 L70 78" stroke={K} strokeWidth={5} strokeLinecap="round" />
      <circle cx={50} cy={44} r={14} />
      <rect x={43} y={52} width={14} height={10} rx={2} />
      <circle cx={44.5} cy={43} r={4} fill={W} />
      <circle cx={55.5} cy={43} r={4} fill={W} />
      <path d="M50 48 l-2 4 h4 z" fill={W} />
    </g>
  ),
  harmful: (
    <g fill={K}>
      <rect x={45} y={28} width={10} height={32} rx={3} />
      <circle cx={50} cy={70} r={6} />
    </g>
  ),
  health: (
    <g fill={K}>
      <circle cx={50} cy={34} r={9} />
      <path d="M30 80 c0 -18 6 -32 20 -32 s20 14 20 32 z" />
      <path d="M50 54 l2.5 6 6 -2 -3 5.5 5 3.5 -6 1 0.5 6 -5 -3.5 -5 3.5 0.5 -6 -6 -1 5 -3.5 -3 -5.5 6 2 z" fill={W} />
    </g>
  ),
  environment: (
    <g fill={K} stroke={K} strokeLinecap="round">
      <path d="M38 64 V34 M38 44 l-8 -8 M38 40 l7 -9 M38 50 l9 -6" strokeWidth={3} fill="none" />
      <rect x={24} y={63} width={52} height={3} stroke="none" />
      <path d="M44 74 c6 -6 18 -6 24 0 c-6 6 -18 6 -24 0 z M68 74 l7 -5 v10 z" stroke="none" />
      <circle cx={49} cy={73} r={1.4} fill={W} stroke="none" />
    </g>
  ),
}

const PICTOS = [
  { key: 'explosive', code: 'GHS01', label: 'Výbušné', example: 'zábavní pyrotechnika, nitroglycerin' },
  { key: 'flammable', code: 'GHS02', label: 'Hořlavé', example: 'líh, benzín, aceton v odlakovači' },
  { key: 'oxidising', code: 'GHS03', label: 'Oxidující', example: 'koncentrovaný peroxid vodíku podporuje hoření' },
  { key: 'gas', code: 'GHS04', label: 'Plyn pod tlakem', example: 'tlaková láhev s CO₂ nebo kyslíkem' },
  { key: 'corrosive', code: 'GHS05', label: 'Žíravé', example: 'hydroxid sodný v čističi odpadů' },
  { key: 'toxic', code: 'GHS06', label: 'Toxické', example: 'methanol, kyanid draselný' },
  { key: 'harmful', code: 'GHS07', label: 'Dráždivé', example: 'prací prášek dráždí oči a kůži' },
  { key: 'health', code: 'GHS08', label: 'Nebezpečné pro zdraví', example: 'benzen může způsobit rakovinu' },
  { key: 'environment', code: 'GHS09', label: 'Nebezpečné pro životní prostředí', example: 'síran měďnatý je jedovatý pro ryby' },
]

export function Pictogram({ kind, size }: { kind: string; size?: number }) {
  return (
    <svg className="dg-ghs" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <rect x={17} y={17} width={66} height={66} transform="rotate(45 50 50)" fill={W} stroke="#e3001b" strokeWidth={7} strokeLinejoin="miter" />
      {SYMBOLS[kind]}
    </svg>
  )
}

export default function LabSafety(_: DiagramProps) {
  const [sel, setSel] = useState<string | null>(null)
  const cur = PICTOS.find((p) => p.key === sel)
  return (
    <div className="dg dg-ghs-wrap" role="group" aria-label="Výstražné symboly nebezpečnosti GHS. Klepni na symbol a uvidíš příklad.">
      <ul className="dg-ghs-grid">
        {PICTOS.map((p) => (
          <li key={p.key}>
            <button
              type="button"
              className={`dg-ghs-btn${sel === p.key ? ' is-on' : ''}`}
              aria-pressed={sel === p.key}
              onClick={() => setSel((s) => (s === p.key ? null : p.key))}
            >
              <Pictogram kind={p.key} />
              <span className="dg-ghs-label">{p.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="dg-ghs-info" aria-live="polite">
        {cur ? (
          <>
            <strong>{cur.label}</strong> <span className="mono muted">{cur.code}</span> – {cur.example}
          </>
        ) : (
          <span className="muted">Klepni na symbol a uvidíš příklad z běžného života.</span>
        )}
      </p>
    </div>
  )
}
