import { motion } from 'motion/react'
import { spring } from '../../../ui/motion'
import { StepFilm } from '../../sequence/StepFigure'
import { Bubbles, ChemText, Erlenmeyer, Fade, Figure, Frame, Note, Pop, pat, usePid } from './kit'

const MASS = '152,4 g'

/** Lab balance with a readout; pan top at y. */
function Balance({ cx, y }: { cx: number; y: number }) {
  const p = usePid()
  return (
    <g>
      <rect x={cx - 78} y={y} width={156} height={7} rx={3} className="f35-fill2" />
      <rect x={cx - 10} y={y + 7} width={20} height={9} className="f35-fill2" />
      <path d={`M${cx - 96} ${y + 16} H${cx + 96} L${cx + 104} ${y + 62} H${cx - 104}Z`} className="f35-fill" />
      <path d={`M${cx - 96} ${y + 16} H${cx + 96} L${cx + 104} ${y + 62} H${cx - 104}Z`} fill={pat(p, 'd')} />
      <rect x={cx - 44} y={y + 25} width={88} height={27} rx={4} className="f35-lcd" />
      <text x={cx} y={y + 44} textAnchor="middle" className="f35-mono f35-b" style={{ fontSize: 15 }}>
        {MASS}
      </text>
      <circle cx={cx + 70} cy={y + 39} r={5} className="f35-fill2" />
      <circle cx={cx - 70} cy={y + 39} r={5} className="f35-fill2" />
    </g>
  )
}

function Scene({ x, y, after }: { x: number; y: number; after: boolean }) {
  const p = usePid()
  const cx = x + 110
  const top = y + 116
  return (
    <g>
      <Erlenmeyer cx={cx} y={top} w={96} h={112} neckW={22} level={36}>
        {after && <Bubbles xs={[cx - 30, cx - 16, cx - 2, cx + 12, cx + 26, cx - 22, cx + 4, cx + 20]} y={top + 108} h={34} r={2.4} />}
        {after && <rect x={cx - 48} y={top + 112 - 36 - 5} width={96} height={6} className="f35-foam" />}
      </Erlenmeyer>
      {after ? (
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          variants={{ hidden: { scale: 0.3, opacity: 0.4 }, show: { scale: 1, opacity: 1, transition: { ...spring.gentle, delay: 0.25 } } }}
        >
          <path
            d={`M${cx - 7} ${top - 2} C${cx - 10} ${top - 12} ${cx - 42} ${top - 30} ${cx - 40} ${top - 62} C${cx - 38} ${top - 92} ${cx + 38} ${top - 92} ${cx + 40} ${top - 62} C${cx + 42} ${top - 30} ${cx + 10} ${top - 12} ${cx + 7} ${top - 2}Z`}
            className="f35-balloon"
          />
          <path
            d={`M${cx - 7} ${top - 2} C${cx - 10} ${top - 12} ${cx - 42} ${top - 30} ${cx - 40} ${top - 62} C${cx - 38} ${top - 92} ${cx + 38} ${top - 92} ${cx + 40} ${top - 62} C${cx + 42} ${top - 30} ${cx + 10} ${top - 12} ${cx + 7} ${top - 2}Z`}
            fill={pat(p, 'd')}
          />
          <path d={`M${cx - 24} ${top - 70} Q${cx - 20} ${top - 82} ${cx - 8} ${top - 84}`} className="f35-glass-glint" />
          {[
            [-16, -56],
            [8, -66],
            [18, -44],
            [-6, -38],
            [-22, -30],
            [14, -24],
          ].map(([dx, dy], i) => (
            <g key={i}>
              <circle cx={cx + dx - 5} cy={top + dy} r={3.4} className="f35-atom-edge" style={{ strokeWidth: 0.8, fill: '#d9493b' }} />
              <circle cx={cx + dx} cy={top + dy} r={3.8} className="f35-atom-edge" style={{ strokeWidth: 0.8, fill: '#3b3b3b' }} />
              <circle cx={cx + dx + 5} cy={top + dy} r={3.4} className="f35-atom-edge" style={{ strokeWidth: 0.8, fill: '#d9493b' }} />
            </g>
          ))}
        </motion.g>
      ) : (
        <g>
          {/* limp balloon hanging over the neck, soda inside */}
          <path
            d={`M${cx - 7} ${top - 2} C${cx - 12} ${top - 12} ${cx - 2} ${top - 22} ${cx + 12} ${top - 20} C${cx + 34} ${top - 18} ${cx + 44} ${top + 2} ${cx + 38} ${top + 16} C${cx + 32} ${top + 26} ${cx + 18} ${top + 20} ${cx + 12} ${top + 8} C${cx + 10} ${top + 2} ${cx + 8} ${top - 1} ${cx + 7} ${top - 2}Z`}
            className="f35-balloon"
          />
          {[
            [26, 8],
            [31, 12],
            [22, 12],
            [30, 4],
            [34, 9],
            [26, 15],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={cx + dx} cy={top + dy} r={1.9} className="f35-powder" />
          ))}
        </g>
      )}
      <rect x={cx - 13} y={top - 4} width={26} height={7} rx={2} className="f35-fill2" />
      <Balance cx={cx} y={top + 112} />
    </g>
  )
}

function Labels({ x, y, after }: { x: number; y: number; after: boolean }) {
  const cx = x + 110
  const top = y + 116
  return after ? (
    <Fade d={0.7}>
      <Note x={cx + 58} y={top - 70} tx={cx + 30} ty={top - 56}>
        <ChemText text="CO_{2}" />
      </Note>
    </Fade>
  ) : (
    <Fade d={0.3}>
      <Note x={cx - 54} y={top + 38} anchor="end" tx={cx - 26} ty={top + 92}>
        ocet
      </Note>
      <Note x={cx + 60} y={top - 26} tx={cx + 32} ty={top + 6}>
        soda
      </Note>
    </Fade>
  )
}

const LABEL =
  'Zákon zachování hmotnosti: uzavřená baňka s octem a balonkem s jedlou sodou stojí na váze, která ukazuje 152,4 g. Po reakci vzniklý oxid uhličitý nafoukne balonek, ale váha ukazuje stále 152,4 g. Hmotnost reaktantů se rovná hmotnosti produktů.'

/** One frame: the same flask on the same balance, before or after the reaction. */
function Plate({ after }: { after: boolean }) {
  return (
    <Frame
      layouts={[
        {
          w: 320,
          h: 340,
          max: 440,
          draw: () => (
            <>
              <Scene x={50} y={-10} after={after} />
              <Labels x={50} y={-10} after={after} />
              {after && (
                <Pop d={0.8}>
                  <rect x={10} y={298} width={300} height={34} rx={6} className="f35-lvfill" />
                  <text x={160} y={320} textAnchor="middle" className="f35-t f35-b" style={{ fontSize: 16 }}>
                    m(reaktantů) = m(produktů)
                  </text>
                </Pop>
              )}
            </>
          ),
        },
      ]}
    />
  )
}

export default function ConservationOfMass() {
  return (
    <Figure level={4} label={LABEL} max={440} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: 'Před reakcí',
            caption: 'V uzavřené baňce je ocet, v balonku na hrdle jedlá soda. Váha ukazuje 152,4 g.',
            art: <Plate after={false} />,
          },
          {
            title: 'Po reakci',
            caption: 'Vzniklý oxid uhličitý nafoukl balonek, ale váha ukazuje stále 152,4 g.',
            art: <Plate after />,
          },
        ]}
      />
    </Figure>
  )
}
