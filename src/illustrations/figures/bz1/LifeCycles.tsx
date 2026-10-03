import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Body, Figure, Frame, Lbl, ell, f1, pat, useFig } from "./kit";

const LABEL =
  "Nepohlavní a pohlavní rozmnožování. Nepohlavně: kvasinka pučí, na mateřské buňce vyroste pupen, který se oddělí jako nová buňka; jahodník vyhání šlahouny a na jejich konci zakoření nová rostlina. Potomek má jediného rodiče a je jeho kopií (klonem). Pohlavně: dva rodiče vytvoří pohlavní buňky, vajíčko a spermii, ty splynou v oplozené vajíčko (zygotu) a z něj vyroste potomek, který má geny od obou rodičů, a proto je každý trochu jiný.";

const W = 320;
const H = 304;

function Yeast({ x, y, r, bud }: { x: number; y: number; r: number; bud?: number }) {
  const { id } = useFig();
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="bz1-o bz1-lvl-fill" />
      <circle cx={x} cy={y} r={r} fill={pat(id, "dots")} opacity={0.6} />
      <circle cx={x - r * 0.15} cy={y + r * 0.1} r={r * 0.32} className="bz1-o bz1-thin bz1-nuc" />
      {bud && (
        <g>
          <circle cx={x + r * 0.95} cy={y - r * 0.55} r={bud} className="bz1-o bz1-lvl-fill" />
          <circle cx={x + r * 0.95} cy={y - r * 0.55} r={bud} fill={pat(id, "dots")} opacity={0.6} />
        </g>
      )}
    </g>
  );
}

/** Trifoliate strawberry leaf on a petiole from (x, y) up by h. */
function Trifol({ x, y, h, s = 1, lean = 0 }: { x: number; y: number; h: number; s?: number; lean?: number }) {
  const tx = x + lean;
  const ty = y - h;
  return (
    <g>
      <path d={`M${x} ${y} Q${x + lean * 0.2} ${y - h * 0.6} ${tx} ${ty}`} className="bz1-o" />
      {[-50, 0, 50].map((a) => (
        <g key={a} transform={`translate(${tx} ${ty}) rotate(${a}) scale(${s})`}>
          <Body d={ell(0, -9, 6, 9)} fill="bz1-leaf" thin />
          <path d="M0 -1 V-16" className="bz1-o bz1-thin" />
        </g>
      ))}
    </g>
  );
}

function Strawberry({ x, gy, s = 1 }: { x: number; gy: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${gy}) scale(${s}) translate(${-x} ${-gy})`}>
      <path
        d={`M${x} ${gy} V${gy + 14} M${x} ${gy + 3} L${x - 9} ${gy + 14} M${x} ${gy + 4} L${x + 9} ${gy + 15} M${x} ${gy + 8} L${x - 4} ${gy + 18}`}
        className="bz1-o bz1-thin"
      />
      <Trifol x={x} y={gy} h={34} lean={-14} />
      <Trifol x={x} y={gy} h={44} lean={4} />
      <Trifol x={x} y={gy} h={30} lean={18} s={0.85} />
    </g>
  );
}

function Asexual() {
  const gy = 256;
  return (
    <Frame w={W} h={H}>
      <text x={14} y={24} className="bz1-title">
        kvasinka pučí
      </text>
      <Yeast x={44} y={82} r={22} />
      <Arrow d="M76 82 H100" tone="lvl" />
      <Yeast x={134} y={86} r={22} bud={11} />
      <Arrow d="M178 82 H202" tone="lvl" />
      <Yeast x={236} y={88} r={22} />
      <Yeast x={286} y={68} r={15} />
      <Lbl x={176} y={136} tx={158} ty={70} anchor="middle" className="bz1-sm">
        pupen
      </Lbl>
      <path d="M14 150 H306" className="bz1-o bz1-thin bz1-dash" style={{ opacity: 0.45 }} />
      <text x={14} y={176} className="bz1-title">
        jahodník: šlahoun
      </text>
      <rect x={10} y={gy} width={300} height={36} className="bz1-soil" />
      <path d={`M10 ${gy} H310`} className="bz1-o" />
      <Strawberry x={66} gy={gy} />
      <path d={`M70 ${gy - 2} C120 ${gy - 44} 200 ${gy - 44} 246 ${gy - 2}`} className="bz1-o bz1-lvl-s" style={{ strokeWidth: 2.2 }} />
      <Strawberry x={248} gy={gy} s={0.75} />
      <Lbl x={160} y={gy - 44} anchor="middle" className="bz1-sm bz1-b bz1-lvl-t">
        šlahoun
      </Lbl>
      <Lbl x={248} y={gy + 28} anchor="middle" className="bz1-sm">
        nová rostlina
      </Lbl>
      <Lbl x={66} y={gy + 28} anchor="middle" className="bz1-sm">
        rodič
      </Lbl>
    </Frame>
  );
}

const MUM = "bz1-petal";
const DAD = "bz1-vac";

function Parent({ x, y, cls, sign }: { x: number; y: number; cls: string; sign: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={26} className={`bz1-o ${cls}`} />
      <text x={x} y={y + 9} textAnchor="middle" className="bz1-eq" style={{ fontSize: 26, fontWeight: 700 }}>
        {sign}
      </text>
    </g>
  );
}

function Sexual() {
  const { id } = useFig();
  const zx = 160;
  const zy = 206;
  return (
    <Frame w={W} h={H}>
      <Parent x={70} y={44} cls={MUM} sign="♀" />
      <Parent x={250} y={44} cls={DAD} sign="♂" />
      <Lbl x={160} y={50} anchor="middle" className="bz1-sm bz1-b">
        dva rodiče
      </Lbl>
      <Arrow d="M78 74 L100 112" tone="ink" />
      <Arrow d="M242 74 L222 112" tone="ink" />
      {/* egg */}
      <circle cx={108} cy={134} r={15} className={`bz1-o ${MUM}`} />
      <circle cx={108} cy={134} r={5} className="bz1-o bz1-thin bz1-nuc" />
      {/* sperm */}
      <ellipse cx={214} cy={134} rx={6} ry={4.5} className={`bz1-o ${DAD}`} />
      <path d="M220 134 q6 -5 12 0 t12 0 t12 0" className="bz1-o bz1-thin" />
      <Lbl x={30} y={140} className="bz1-sm">
        vajíčko
      </Lbl>
      <Lbl x={226} y={162} className="bz1-sm">
        spermie
      </Lbl>
      <Lbl x={160} y={118} anchor="middle" className="bz1-sm bz1-muted-t">
        {"pohlavní\nbuňky"}
      </Lbl>
      <Arrow d="M120 146 L146 192" tone="lvl" />
      <Arrow d="M206 142 L174 192" tone="lvl" />
      {/* zygote: half from each parent */}
      <path d={`M${zx} ${zy - 15} A15 15 0 0 0 ${zx} ${zy + 15} Z`} className={MUM} />
      <path d={`M${zx} ${zy - 15} A15 15 0 0 1 ${zx} ${zy + 15} Z`} className={DAD} />
      <circle cx={zx} cy={zy} r={15} className="bz1-o" />
      <Lbl x={184} y={202} className="bz1-sm">
        {"oplozené vajíčko\n(zygota)"}
      </Lbl>
      <Arrow d={`M${zx} ${zy + 18} V${zy + 40}`} tone="lvl" />
      {/* offspring with a mix of both parents' traits */}
      <g>
        <circle cx={zx} cy={zy + 66} r={24} className={`bz1-o ${MUM}`} />
        {(
          [
            [-10, -8, 8],
            [9, 4, 9],
            [-4, 13, 6],
            [12, -12, 5],
          ] as const
        ).map(([dx, dy, r]) => (
          <circle key={`${dx}${dy}`} cx={f1(zx + dx)} cy={f1(zy + 66 + dy)} r={r} className={DAD} />
        ))}
        <circle cx={zx} cy={zy + 66} r={24} fill={pat(id, "dots")} opacity={0.5} />
        <circle cx={zx} cy={zy + 66} r={24} className="bz1-o" />
      </g>
      <Lbl x={192} y={zy + 64} className="bz1-sm bz1-b">
        potomek
      </Lbl>
      <Lbl x={192} y={zy + 82} className="bz1-sm">
        geny od obou
      </Lbl>
    </Frame>
  );
}

export default function LifeCycles() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive>
      <div className="bz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={270}
          steps={[
            {
              title: "Nepohlavní rozmnožování",
              art: <Asexual />,
              caption: "Jeden rodič, potomci jsou jeho kopie (klony).",
            },
            {
              title: "Pohlavní rozmnožování",
              art: <Sexual />,
              caption: "Dva rodiče, geny se mísí, každý potomek je jiný.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
