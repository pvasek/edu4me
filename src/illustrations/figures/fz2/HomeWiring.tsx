import { Draw, Fade, Figure, Pop, pat, useCompact, useFig } from './kit'

const LABEL =
  'Elektrická instalace v domě. Přípojka vede přes elektroměr do rozvaděče. Tam je hlavní jistič, proudový chránič, který při úniku proudu 30 mA vypne celý obvod, a jističe jednotlivých okruhů, které vypnou při přetížení nebo zkratu. Zásuvky jsou zapojené paralelně mezi fázový vodič L (hnědý) a nulový vodič N (modrý), takže každý spotřebič má 230 V a funguje nezávisle. Ochranný vodič PE (zelenožlutý) je spojený s uzemněním a s kolíkem zásuvky. Zástrčka má dva kolíky a otvor pro ochranný kolík.'

const L = '#8b5a2b'
const N = '#3d6fd1'
const PE = '#4f9e4a'
const YL = { L16: 184, L10: 198, N: 214, PE: 230 }

function Wire({ d, c, pe = false, delay = 0 }: { d: string; c: string; pe?: boolean; delay?: number }) {
  return (
    <g>
      <Draw d={d} className="fz2-wire-o" delay={delay} />
      <Draw d={d} className="fz2-wire-c" delay={delay} style={{ stroke: c }} />
      {pe && (
        <Fade delay={delay + 0.9}>
          <path d={d} className="fz2-wire-c fz2-wire-pe" />
        </Fade>
      )}
    </g>
  )
}
const Dot = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={2.8} className="fz2-pt" />

function Module({ x, w, t1, t2, lvl = false }: { x: number; w: number; t1: string; t2: string; lvl?: boolean }) {
  return (
    <g>
      <rect x={x} y={62} width={w} height={60} rx={3} className={lvl ? 'fz2-o fz2-module fz2-module-lvl' : 'fz2-o fz2-module'} />
      <rect x={x + w / 2 - 5} y={70} width={10} height={16} rx={2} className="fz2-o fz2-fill3" />
      <text x={x + w / 2} y={102} textAnchor="middle" className="fz2-mod-t">
        {t1}
      </text>
      <text x={x + w / 2} y={115} textAnchor="middle" className="fz2-mod-t fz2-mod-b">
        {t2}
      </text>
    </g>
  )
}

function Socket({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={17} className="fz2-o fz2-fill" />
      <circle cx={x - 7} cy={y + 3} r={3} className="fz2-o fz2-fill3" />
      <circle cx={x + 7} cy={y + 3} r={3} className="fz2-o fz2-fill3" />
      <rect x={x - 2} y={y - 12} width={4} height={8} rx={1} className="fz2-o fz2-pin" />
    </g>
  )
}

function Lamp({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} className="fz2-o fz2-lamp" />
      <path d={`M${x - 9} ${y - 9} L${x + 9} ${y + 9} M${x + 9} ${y - 9} L${x - 9} ${y + 9}`} className="fz2-o" />
    </g>
  )
}

function Plug({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={190} height={104} rx={10} className="fz2-o fz2-fill" />
      <text x={x + 95} y={y + 20} textAnchor="middle" className="fz2-lbl fz2-b fz2-sm">
        zástrčka
      </text>
      <circle cx={x + 52} cy={y + 60} r={30} className="fz2-o fz2-plug" />
      <circle cx={x + 40} cy={y + 66} r={4} className="fz2-o fz2-pin" />
      <circle cx={x + 64} cy={y + 66} r={4} className="fz2-o fz2-pin" />
      <circle cx={x + 52} cy={y + 44} r={4.5} className="fz2-o fz2-fill" />
      <text x={x + 90} y={y + 48} className="fz2-mod-t fz2-left">
        otvor pro
      </text>
      <text x={x + 90} y={y + 60} className="fz2-mod-t fz2-left">
        ochranný kolík
      </text>
      <text x={x + 90} y={y + 80} className="fz2-mod-t fz2-left">
        kolíky L a N
      </text>
    </g>
  )
}

function Plate({ narrow }: { narrow: boolean }) {
  const { id } = useFig()
  const bx = narrow ? 104 : 150 // board
  const mx = narrow ? 12 : 62 // meter
  const x1 = narrow ? 16 : 40
  const x2 = narrow ? 350 : 630
  const socks = narrow ? [96, 176] : [420, 500]
  const lamp = narrow ? 300 : 596
  const m = { main: bx + 10, rcd: bx + 58, b16: bx + 118, b10: bx + 166 }
  const midRcd = m.rcd + 36
  return (
    <g>
      {/* meter */}
      <Pop delay={0}>
        <text x={mx + 34} y={narrow ? 150 : 40} textAnchor="middle" className="fz2-lbl fz2-b fz2-sm">
          elektroměr
        </text>
        <rect x={mx} y={50} width={68} height={82} rx={5} className="fz2-o fz2-fill2" />
        <rect x={mx + 8} y={60} width={52} height={18} rx={2} className="fz2-o fz2-fill" />
        <text x={mx + 34} y={74} textAnchor="middle" className="fz2-num fz2-num-sm">
          0472
        </text>
        <text x={mx + 34} y={96} textAnchor="middle" className="fz2-mod-t">
          kWh
        </text>
        <circle cx={mx + 34} cy={114} r={8} className="fz2-o fz2-fill" />
      </Pop>
      {!narrow && (
        <text x={4} y={80} className="fz2-lbl fz2-sm">
          přípojka
        </text>
      )}
      <Wire d={narrow ? `M${mx + 34} 20 V50` : `M4 90 H${mx}`} c={L} />
      <Wire d={`M${mx + 68} 92 H${m.main}`} c={L} />

      {/* distribution board */}
      <Pop delay={0.1}>
        <text x={bx + 108} y={24} textAnchor="middle" className="fz2-lbl fz2-b fz2-sm">
          rozvaděč
        </text>
        <rect x={bx} y={32} width={216} height={130} rx={6} className="fz2-o fz2-fill2" />
        <rect x={bx} y={32} width={216} height={130} rx={6} fill={pat(id, 'd')} opacity={0.4} />
        <Module x={m.main} w={40} t1="hlavní" t2="jistič" />
        <Module x={m.rcd} w={52} t1="chránič" t2="30 mA" lvl />
        <Module x={m.b16} w={40} t1="jistič" t2="16 A" />
        <Module x={m.b10} w={40} t1="jistič" t2="10 A" />
        <rect x={bx + 10} y={136} width={60} height={10} rx={2} className="fz2-o" fill={PE} />
        <text x={bx + 76} y={146} className="fz2-mod-t fz2-left">
          PE
        </text>
      </Pop>
      <Wire d={`M${m.main + 40} 92 H${m.rcd}`} c={L} delay={0.3} />
      <Wire d={`M${m.rcd + 40} 62 V46 H${m.b10 + 20} V62 M${m.b16 + 20} 46 V62`} c={L} delay={0.4} />

      {/* circuits: L of each breaker, common N and PE */}
      <Wire d={`M${m.b16 + 20} 122 V${YL.L16} M${x1} ${YL.L16} H${x2}`} c={L} delay={0.6} />
      <Wire d={`M${m.b10 + 30} 122 V${YL.L10} H${x2}`} c={L} delay={0.65} />
      <Wire d={`M${midRcd + 10} 122 V${YL.N} M${x1} ${YL.N} H${x2}`} c={N} delay={0.7} />
      <Wire d={`M${bx + 22} 146 V${YL.PE} M${x1} ${YL.PE} H${x2}`} c={PE} pe delay={0.75} />
      <Dot x={m.b16 + 20} y={YL.L16} />
      <Dot x={midRcd + 10} y={YL.N} />
      <Dot x={bx + 22} y={YL.PE} />

      {/* earth electrode at the left end of PE */}
      <Wire d={`M${x1} ${YL.PE} V288`} c={PE} pe delay={0.8} />
      <path d={`M${x1 - 14} 288 H${x1 + 14} M${x1 - 9} 294 H${x1 + 9} M${x1 - 4} 300 H${x1 + 4}`} className="fz2-o fz2-thick" />
      <text x={narrow ? 4 : x1 + 18} y={narrow ? 318 : 300} className="fz2-lbl fz2-sm">
        uzemnění
      </text>

      {/* two sockets in parallel */}
      {socks.map((x, i) => (
        <g key={x}>
          <Wire d={`M${x - 7} ${YL.L16} V${262}`} c={L} delay={0.9 + i * 0.1} />
          <Wire d={`M${x + 7} ${YL.N} V${262}`} c={N} delay={0.9 + i * 0.1} />
          <Wire d={`M${x} ${YL.PE} V${254}`} c={PE} pe delay={0.9 + i * 0.1} />
          <Dot x={x - 7} y={YL.L16} />
          <Dot x={x + 7} y={YL.N} />
          <Dot x={x} y={YL.PE} />
          <Pop delay={1.1 + i * 0.1}>
            <Socket x={x} y={266} />
          </Pop>
        </g>
      ))}
      {/* light with its switch on the 10 A circuit */}
      <Wire d={`M${lamp - 8} ${YL.L10} V244 M${lamp - 8} 256 V262`} c={L} delay={1} />
      <Wire d={`M${lamp + 8} ${YL.N} V262`} c={N} delay={1} />
      <Dot x={lamp - 8} y={YL.L10} />
      <Dot x={lamp + 8} y={YL.N} />
      <path d={`M${lamp - 8} 244 L${lamp - 20} 254`} className="fz2-o fz2-thick" />
      <Pop delay={1.2}>
        <Lamp x={lamp} y={272} />
      </Pop>

      <Fade delay={1.2}>
        <text x={(socks[0] + socks[1]) / 2} y={306} textAnchor="middle" className="fz2-lbl fz2-sm">
          zásuvky paralelně
        </text>
        <text x={lamp} y={306} textAnchor="middle" className="fz2-lbl fz2-sm">
          světlo
        </text>
        {/* wire legend */}
        <g transform={narrow ? 'translate(16 330)' : 'translate(390 60)'}>
          {[
            [L, 'L – fáze (hnědý)', false],
            [N, 'N – nulový vodič (modrý)', false],
            [PE, 'PE – ochranný (zelenožlutý)', true],
          ].map(([c, t, pe], i) => (
            <g key={t as string}>
              <path d={`M0 ${i * 22} H28`} className="fz2-wire-o" />
              <path d={`M0 ${i * 22} H28`} className="fz2-wire-c" style={{ stroke: c as string }} />
              {pe && <path d={`M0 ${i * 22} H28`} className="fz2-wire-c fz2-wire-pe" />}
              <text x={36} y={i * 22 + 5} className="fz2-leg">
                {t as string}
              </text>
            </g>
          ))}
        </g>
      </Fade>
      <g transform={narrow ? 'translate(16 410)' : 'translate(170 252)'}>
        <Pop delay={1.3}>
          <Plug x={0} y={0} />
        </Pop>
      </g>
    </g>
  )
}

export default function HomeWiring() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure level={6} w={n ? 364 : 640} h={n ? 520 : 360} max={720} compact={compact} boost={false} label={LABEL}>
      <Plate narrow={n} />
    </Figure>
  )
}
