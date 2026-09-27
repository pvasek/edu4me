import type { ReactNode } from 'react'
import { Arrow, Atom, ChemText, Fade, Figure, Pop, T } from './kit'

function Bread({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-11 12 V-3 C-15 -5 -15 -13 -8 -13 C-5 -17 5 -17 8 -13 C15 -13 15 -5 11 -3 V12Z" className="f35-bread" />
      <path d="M-8 9 V-4 C-11 -6 -11 -10 -6 -10 C-3 -13 3 -13 6 -10 C11 -10 11 -6 8 -4 V9Z" className="f35-bread-in" />
    </g>
  )
}
function Cheese({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-12 10 L12 10 L12 -3 L-12 -10Z" className="f35-cheese" />
      <circle cx={-4} cy={1} r={2.4} className="f35-cheese-hole" />
      <circle cx={5} cy={5} r={1.7} className="f35-cheese-hole" />
      <circle cx={6} cy={-2} r={1.4} className="f35-cheese-hole" />
    </g>
  )
}
function Sandwich({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-15 6 H15 Q17 10 15 12 H-15 Q-17 10 -15 6Z" className="f35-bread" />
      <path d="M-16 1 L16 1 L14 6 L-14 6Z" className="f35-cheese" />
      <path d="M-15 -8 C-15 -12 15 -12 15 -8 V1 H-15Z" className="f35-bread" />
    </g>
  )
}

function H2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Atom x={x - 5} y={y} r={7} el="H" sym={false} />
      <Atom x={x + 5} y={y} r={7} el="H" sym={false} />
    </g>
  )
}
function O2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Atom x={x - 6.5} y={y} r={9} el="O" sym={false} />
      <Atom x={x + 6.5} y={y} r={9} el="O" sym={false} />
    </g>
  )
}
function H2O({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Atom x={x - 9} y={y + 7} r={6.5} el="H" sym={false} />
      <Atom x={x + 9} y={y + 7} r={6.5} el="H" sym={false} />
      <Atom x={x} y={y - 1} r={9.5} el="O" sym={false} />
    </g>
  )
}

/** A labelled panel. */
function Box({ x, y, w, h, title, children }: { x: number; y: number; w: number; h: number; title: string; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className="f35-box" />
      <text x={x + 10} y={y + 20} className="f35-note" style={{ fontSize: 15 }}>
        {title}
      </text>
      {children}
    </g>
  )
}

const grid = (n: number, cols: number, x: number, y: number, dx: number, dy: number) =>
  Array.from({ length: n }, (_, i) => [x + (i % cols) * dx, y + Math.floor(i / cols) * dy] as const)

/** Sandwich analogy: 8 bread + 3 cheese → 3 sandwiches, 2 bread left. `ox, oy` = origin, `wide` side by side. */
function Analogy({ ox, oy, wide }: { ox: number; oy: number; wide: boolean }) {
  const bx = wide ? 0 : 0
  const rx = wide ? 300 : 0
  const ry = wide ? 0 : 162
  return (
    <g transform={`translate(${ox} ${oy})`}>
      <Box x={bx} y={30} w={wide ? 250 : 320} h={122} title="máš">
        {grid(8, 4, bx + 24, 68, 30, 34).map(([x, y], i) => (
          <Pop key={i} d={0.1 + i * 0.04}>
            <Bread x={x} y={y} />
          </Pop>
        ))}
        {grid(3, 1, bx + (wide ? 156 : 190), 58, 0, 30).map(([x, y], i) => (
          <Pop key={i} d={0.5 + i * 0.06}>
            <Cheese x={x} y={y} />
          </Pop>
        ))}
        <text x={bx + (wide ? 176 : 212)} y={63} className="f35-t f35-small">
          3 plátky
        </text>
        <text x={bx + 24} y={146} className="f35-t f35-small f35-muted">
          8 krajíců
        </text>
        <Fade d={1.8}>
          <text x={bx + (wide ? 176 : 212)} y={100} className="f35-note f35-lvt" style={{ fontSize: 15, fontWeight: 700 }}>
            limitující
          </text>
          <text x={bx + (wide ? 176 : 212)} y={116} className="f35-t f35-muted" style={{ fontSize: 11 }}>
            (dojde první)
          </text>
        </Fade>
      </Box>
      {wide ? (
        <Arrow x1={258} y1={92} x2={292} y2={92} className="f35-arrow-lv" delay={0.8} />
      ) : (
        <Arrow x1={160} y1={156} x2={160} y2={186} className="f35-arrow-lv" delay={0.8} />
      )}
      <Box x={rx} y={30 + ry} w={wide ? 240 : 320} h={122} title="vyrobíš">
        {grid(3, 3, rx + 30, 76 + ry, 38, 0).map(([x, y], i) => (
          <Pop key={i} d={1.1 + i * 0.15}>
            <Sandwich x={x} y={y} />
          </Pop>
        ))}
        <text x={rx + 16} y={112 + ry} className="f35-t f35-small">
          3 sendviče
        </text>
        <Pop d={1.8}>
          <rect x={rx + (wide ? 146 : 200)} y={46 + ry} width={78} height={60} rx={6} className="f35-left" />
          <Bread x={rx + (wide ? 168 : 222)} y={74 + ry} />
          <Bread x={rx + (wide ? 200 : 254)} y={74 + ry} />
          <text x={rx + (wide ? 185 : 239)} y={124 + ry} textAnchor="middle" className="f35-note f35-warn-t" style={{ fontSize: 15, fontWeight: 700 }}>
            zbudou 2
          </text>
          <text x={rx + (wide ? 185 : 239)} y={141 + ry} textAnchor="middle" className="f35-t f35-small f35-muted">
            v nadbytku
          </text>
        </Pop>
      </Box>
    </g>
  )
}

/** Molecular version: 4 H₂ + 3 O₂ → 4 H₂O + 1 O₂ left. */
function Molecular({ ox, oy, wide }: { ox: number; oy: number; wide: boolean }) {
  const rx = wide ? 300 : 0
  const ry = wide ? 0 : 162
  return (
    <g transform={`translate(${ox} ${oy})`}>
      <Box x={0} y={30} w={wide ? 250 : 320} h={122} title="4 H₂ + 3 O₂">
        {grid(4, 2, 34, 66, 40, 36).map(([x, y], i) => (
          <Pop key={i} d={0.3 + i * 0.05}>
            <H2 x={x} y={y} />
          </Pop>
        ))}
        {grid(3, 1, wide ? 170 : 180, 58, 0, 32).map(([x, y], i) => (
          <Pop key={i} d={0.6 + i * 0.06}>
            <O2 x={x} y={y} />
          </Pop>
        ))}
        <Fade d={2}>
          <text x={24} y={144} className="f35-note f35-lvt" style={{ fontSize: 15, fontWeight: 700 }}>
            <ChemText text="H_{2} limitující" />
          </text>
        </Fade>
      </Box>
      {wide ? (
        <Arrow x1={258} y1={92} x2={292} y2={92} className="f35-arrow-lv" delay={1} />
      ) : (
        <Arrow x1={160} y1={156} x2={160} y2={186} className="f35-arrow-lv" delay={1} />
      )}
      <Box x={rx} y={30 + ry} w={wide ? 240 : 320} h={122} title="4 H₂O + zbytek">
        {grid(4, 2, rx + 30, 70 + ry, 40, 38).map(([x, y], i) => (
          <Pop key={i} d={1.3 + i * 0.12}>
            <H2O x={x} y={y} />
          </Pop>
        ))}
        <Pop d={2}>
          <rect x={rx + (wide ? 146 : 200)} y={46 + ry} width={78} height={60} rx={6} className="f35-left" />
          <O2 x={rx + (wide ? 185 : 239)} y={76 + ry} />
          <text x={rx + (wide ? 185 : 239)} y={124 + ry} textAnchor="middle" className="f35-note f35-warn-t" style={{ fontSize: 15, fontWeight: 700 }}>
            <ChemText text="zbude 1 O_{2}" />
          </text>
          <text x={rx + (wide ? 185 : 239)} y={141 + ry} textAnchor="middle" className="f35-t f35-small f35-muted">
            v nadbytku
          </text>
        </Pop>
      </Box>
    </g>
  )
}

export default function LimitingReagent() {
  return (
    <Figure
      level={4}
      label="Limitující reaktant na příkladu sendvičů: na jeden sendvič potřebuješ 2 krajíce chleba a 1 plátek sýra. Z 8 krajíců a 3 plátků uděláš 3 sendviče, sýr dojde první a je limitující, 2 krajíce zbudou v nadbytku. Stejně u molekul: podle 2 H2 + O2 → 2 H2O dají 4 H2 a 3 O2 čtyři molekuly vody, vodík je limitující a 1 O2 zbude."
      layouts={[
        {
          w: 560,
          h: 360,
          max: 680,
          when: 'wide',
          draw: () => (
            <>
              <T x={10} y={20} anchor="start" className="f35-title">
                recept: 2 krajíce + 1 sýr → 1 sendvič
              </T>
              <Analogy ox={10} oy={4} wide />
              <line x1={10} x2={550} y1={176} y2={176} className="f35-rule" />
              <T x={10} y={206} anchor="start" className="f35-title">
                <ChemText text="rovnice: 2 H_{2} + O_{2} → 2 H_{2}O" />
              </T>
              <Molecular ox={10} oy={190} wide />
            </>
          ),
        },
        {
          w: 340,
          h: 700,
          max: 420,
          when: 'narrow',
          draw: () => (
            <>
              <T x={170} y={20} className="f35-title" size={17}>
                2 krajíce + 1 sýr → 1 sendvič
              </T>
              <Analogy ox={10} oy={4} wide={false} />
              <line x1={10} x2={330} y1={352} y2={352} className="f35-rule" />
              <T x={170} y={384} className="f35-title" size={17}>
                <ChemText text="2 H_{2} + O_{2} → 2 H_{2}O" />
              </T>
              <Molecular ox={10} oy={368} wide={false} />
            </>
          ),
        },
      ]}
    />
  )
}
