import { motion } from "motion/react";
import { Arrow, DrawArrow, Fade, Figure, Lbl, Num, Pop, pat, rng, useFig } from "./kit";

const LABEL =
  "Chemická synapse. Nahoře presynaptické zakončení axonu s váčky plnými neurotransmiteru, uprostřed úzká synaptická štěrbina, dole postsynaptická membrána další buňky. 1. Na zakončení dorazí akční potenciál. 2. Otevřou se vápníkové kanály a ionty Ca²⁺ vniknou do zakončení. 3. Váčky splynou s membránou a vylijí neurotransmiter do štěrbiny. 4. Neurotransmiter se naváže na receptory postsynaptické membrány, otevřou se iontové kanály, dovnitř proudí Na⁺ a vzniká nový vzruch. 5. Neurotransmiter se pumpou vrací zpět do zakončení (zpětné vychytávání) nebo ho rozloží enzym, a signál tak skončí.";

const W = 480;
const H = 520;
const PRE = 258; // presynaptic membrane
const POST = 292; // postsynaptic membrane

const knob = `M206 0 L206 54 C206 88 108 96 92 168 C80 222 120 ${PRE} 180 ${PRE} L300 ${PRE} C360 ${PRE} 400 222 388 168 C372 96 274 88 274 54 L274 0`;
const postCell = `M10 ${POST + 4} C80 ${POST - 2} 160 ${POST} 240 ${POST} C320 ${POST} 400 ${POST - 2} 470 ${POST + 4} L470 400 L10 400Z`;

function Vesicle({ x, y, r = 15, open = false }: { x: number; y: number; r?: number; open?: boolean }) {
  const dots = [
    [-5, -4],
    [4, -5],
    [0, 3],
    [6, 4],
    [-6, 5],
  ];
  return (
    <g>
      {open ? (
        <path d={`M${x - r} ${PRE} C${x - r} ${PRE - r * 2} ${x + r} ${PRE - r * 2} ${x + r} ${PRE}`} className="bz4-o bz4-sy-ves" />
      ) : (
        <circle cx={x} cy={y} r={r} className="bz4-o bz4-sy-ves" />
      )}
      {!open && dots.map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={2.4} className="bz4-sy-nt" />)}
    </g>
  );
}

function Receptor({ x, bound }: { x: number; bound: boolean }) {
  return (
    <g>
      <path d={`M${x - 12} ${POST - 10} V${POST + 16} H${x - 4} V${POST - 2} M${x + 12} ${POST - 10} V${POST + 16} H${x + 4} V${POST - 2}`} className="bz4-o bz4-sy-rec" />
      <path d={`M${x - 12} ${POST - 10} V${POST + 16} H${x - 4} V${POST - 2} H${x - 12}Z M${x + 12} ${POST - 10} V${POST + 16} H${x + 4} V${POST - 2} H${x + 12}Z`} className="bz4-sy-rec-f" />
      {bound && <circle cx={x} cy={POST - 6} r={3} className="bz4-sy-nt" />}
    </g>
  );
}

function CaChannel({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 11} y={PRE - 14} width={8} height={24} rx={2} className="bz4-o bz4-thin bz4-sy-ch" />
      <rect x={x + 3} y={PRE - 14} width={8} height={24} rx={2} className="bz4-o bz4-thin bz4-sy-ch" />
    </g>
  );
}

export default function Synapse() {
  const r = rng(4);
  const cleftDots = Array.from({ length: 14 }, () => [176 + r() * 128, PRE + 6 + r() * (POST - PRE - 14)]);
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={600} replay>
      <Plates />
      {/* action potential */}
      <DrawArrow d="M240 8 V66" tone="red" delay={0.1} className="bz4-vec" />
      <Fade delay={0.2}>
        <Num x={262} y={30} n={1} />
        <text x={286} y={28} className="bz4-lbl bz4-sm bz4-b bz4-red-t">akční potenciál</text>
        <text x={286} y={46} className="bz4-lbl bz4-sm">přichází po axonu</text>
      </Fade>

      {/* vesicles */}
      <Vesicle x={170} y={170} />
      <Vesicle x={226} y={134} />
      <Vesicle x={300} y={176} />
      <Vesicle x={268} y={120} r={13} />
      <motion.g initial={{ y: -40 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
        <Vesicle x={206} y={PRE} open />
      </motion.g>
      <motion.g initial={{ y: -46 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.85 }}>
        <Vesicle x={262} y={PRE} open />
      </motion.g>

      {/* Ca channels and ions */}
      <CaChannel x={140} />
      <CaChannel x={336} />
      <Pop delay={0.5}>
        {[
          [140, PRE + 22],
          [140, PRE - 30],
          [336, PRE + 22],
          [336, PRE - 30],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x + 18} cy={y} r={6} className="bz4-sy-ca" />
          </g>
        ))}
        <Arrow d={`M140 ${PRE + 16} V${PRE - 28}`} tone="green" />
        <Arrow d={`M336 ${PRE + 16} V${PRE - 28}`} tone="green" />
        <Num x={112} y={PRE - 8} n={2} />
        <text x={124} y={PRE + 40} textAnchor="middle" className="bz4-sy-ion bz4-good-t">Ca²⁺</text>
      </Pop>

      {/* neurotransmitter in the cleft */}
      <Fade delay={1.3}>
        {cleftDots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.4} className="bz4-sy-nt" />
        ))}
        <Num x={236} y={226} n={3} />
      </Fade>

      {/* receptors and Na+ */}
      <Receptor x={196} bound />
      <Receptor x={244} bound />
      <Receptor x={292} bound />
      <Fade delay={1.6}>
        <Arrow d={`M244 ${POST - 22} V${POST + 34}`} tone="acc" />
        <text x={252} y={POST + 40} className="bz4-sy-ion bz4-acc-t">Na⁺</text>
        <Num x={170} y={POST + 34} n={4} />
        <DrawArrow d={`M244 ${POST + 54} V${POST + 96}`} tone="red" delay={1.8} className="bz4-vec" />
        <text x={256} y={POST + 86} className="bz4-lbl bz4-sm bz4-b bz4-red-t">nový vzruch</text>
      </Fade>

      {/* reuptake */}
      <g>
        <rect x={360} y={PRE - 46} width={18} height={26} rx={4} transform={`rotate(-38 369 ${PRE - 33})`} className="bz4-o bz4-thin bz4-sy-pump" />
      </g>
      <Fade delay={1.9}>
        <Arrow d={`M352 ${PRE + 10} C370 ${PRE - 6} 376 ${PRE - 30} 366 ${PRE - 60}`} tone="lvl" />
        <Num x={406} y={PRE - 4} n={5} />
      </Fade>

      {/* labels */}
      <Fade delay={0.6}>
        <Lbl x={W - 14} y={88} tx={276} ty={112} anchor="end" className="bz4-sm" sec>
          váček s neurotransmiterem
        </Lbl>
        <text x={14} y={64} className="bz4-lbl bz4-b">presynaptické</text>
        <text x={W - 14} y={POST - 22} textAnchor="end" className="bz4-lbl bz4-sm bz4-sec">
          štěrbina
        </text>
        <text x={14} y={POST + 70} className="bz4-lbl bz4-b">postsynaptická</text>
        <text x={14} y={POST + 88} className="bz4-lbl bz4-b">buňka</text>
        <Lbl x={W - 14} y={POST + 58} tx={300} ty={POST + 8} anchor="end" className="bz4-sm">
          receptor
        </Lbl>
      </Fade>

      {/* legend */}
      <Fade delay={1.4}>
        {[
          "vzruch dorazí do zakončení",
          "otevřou se kanály, Ca²⁺ vstoupí dovnitř",
          "váčky vylijí neurotransmiter do štěrbiny",
          "navázání na receptory: Na⁺ dovnitř, nový vzruch",
          "zpětné vychytávání nebo rozklad: signál skončí",
        ].map((t, i) => (
          <g key={i}>
            <Num x={16} y={H - 98 + i * 21} n={i + 1} r={8.5} />
            <text x={32} y={H - 93 + i * 21} className="bz4-lbl bz4-sm">
              {t}
            </text>
          </g>
        ))}
      </Fade>
    </Figure>
  );
}

function Plates() {
  const { id } = useFig();
  return (
    <g>
      <path d={postCell} className="bz4-o bz4-sy-post" />
      <path d={postCell} fill={pat(id, "d")} opacity={0.3} />
      <path d={`${knob}`} className="bz4-o bz4-sy-pre" />
      <path d={`${knob}`} fill={pat(id, "d")} opacity={0.25} />
      {/* mitochondrion */}
      <ellipse cx={330} cy={126} rx={20} ry={10} transform="rotate(-30 330 126)" className="bz4-o bz4-thin bz4-sy-mito" />
      <path d="M316 130 q4 -8 8 0 q4 -8 8 0 q4 -8 8 0" transform="rotate(-30 330 126)" className="bz4-o bz4-thin" />
      <text x={14} y={82} className="bz4-lbl bz4-b">zakončení</text>
    </g>
  );
}
