import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Nitroděložní vývoj člověka, animace po krocích. 1. Oplození: ve vejcovodu se spermie spojí s vajíčkem a vznikne zygota. 2. Rýhování a zahnízdění: zygota se cestou vejcovodem dělí na 2, 4, 8 buněk a asi 7. den se zahnízdí ve sliznici dělohy. 3. Zárodek (embryo): do konce 8. týdne se založí všechny orgány, srdce bije už kolem 6. týdne; zárodek měří asi 2 cm. 4. Plod: od 9. týdne hlavně roste, živiny a kyslík dostává přes placentu a pupečník, plave v plodové vodě. 5. Porod: asi ve 40. týdnu se děloha začne stahovat, otevře se děložní hrdlo a dítě, dlouhé asi 50 cm, projde porodními cestami hlavičkou napřed.";

const W = 420;
const H = 300;

function Tag({ a, b }: { a: string; b: string }) {
  return (
    <Fade delay={0.2}>
      <text x={W - 8} y={22} textAnchor="end" className="bz2-lbl bz2-b bz2-lvl-t">
        {a}
      </text>
      <text x={W - 8} y={42} textAnchor="end" className="bz2-lbl bz2-sm">
        {b}
      </text>
    </Fade>
  );
}

/** Non-pregnant uterus with tubes and ovaries. */
function Organs() {
  const { id } = useFig();
  const uterus = "M176 150 Q210 140 244 150 Q252 200 226 236 L222 262 H198 L194 236 Q168 200 176 150Z";
  return (
    <g>
      <path d="M180 156 Q140 118 112 104 Q84 92 70 112" className="bz2-o" style={{ strokeWidth: 12 }} />
      <path d="M180 156 Q140 118 112 104 Q84 92 70 112" className="bz2-tubeline" style={{ strokeWidth: 9 }} />
      <path d="M240 156 Q280 118 308 104 Q336 92 350 112" className="bz2-o" style={{ strokeWidth: 12 }} />
      <path d="M240 156 Q280 118 308 104 Q336 92 350 112" className="bz2-tubeline" style={{ strokeWidth: 9 }} />
      {[62, 358].map((x) => (
        <g key={x}>
          <path d={`M${x - 10} 112 l-6 8 M${x} 116 l-2 10 M${x + 8} 114 l4 9`} className="bz2-o bz2-thin" />
          <ellipse cx={x} cy={140} rx={18} ry={11} className="bz2-o bz2-ovary" />
        </g>
      ))}
      <path d={uterus} className="bz2-o bz2-uterus" />
      <path d={uterus} fill={pat(id, "b")} opacity={0.5} />
      <path d="M186 160 Q210 154 234 160 Q236 196 216 226 L204 226 Q184 196 186 160Z" className="bz2-o bz2-thin bz2-uterus-in" />
    </g>
  );
}

function Sperm({ x, y, a }: { x: number; y: number; a: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <ellipse cx={0} cy={0} rx={3.6} ry={2.4} className="bz2-o bz2-hair bz2-paper-f" />
      <path d="M3.6 0 q5 -3 9 0 q4 3 9 0" className="bz2-o bz2-hair" />
    </g>
  );
}

function Cells({ x, y, n, r = 6 }: { x: number; y: number; n: number; r?: number }) {
  const pts =
    n === 1
      ? [[0, 0]]
      : n === 2
        ? [[-r * 0.5, 0], [r * 0.5, 0]]
        : n === 4
          ? [[-r * 0.45, -r * 0.45], [r * 0.45, -r * 0.45], [-r * 0.45, r * 0.45], [r * 0.45, r * 0.45]]
          : Array.from({ length: 8 }, (_, i) => [Math.cos(i) * r * 0.5, Math.sin(i * 1.7) * r * 0.5]);
  const cr = n === 1 ? r * 0.8 : n === 2 ? r * 0.55 : n === 4 ? r * 0.45 : r * 0.36;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={r + 1.5} className="bz2-o bz2-thin bz2-zona" />
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={cr} className="bz2-o bz2-hair bz2-embryo" />
      ))}
    </g>
  );
}

/** Pregnant uterus of size k (1 = full term), with the cervix at the bottom. */
function Womb({ k, open = false }: { k: number; open?: boolean }) {
  const { id } = useFig();
  const cx = 210;
  const top = 262 - 230 * k;
  const w = 104 * k + 36;
  const d = `M${cx - 14} 262 L${cx - 16} 246 Q${cx - w} ${246 - 40 * k} ${cx - w} ${(246 + top) / 2} Q${cx - w} ${top} ${cx} ${top} Q${cx + w} ${top} ${cx + w} ${(246 + top) / 2} Q${cx + w} ${246 - 40 * k} ${cx + 16} 246 L${cx + 14} 262Z`;
  return (
    <g>
      <path d={d} className="bz2-o bz2-uterus" />
      <path d={d} fill={pat(id, "b")} opacity={0.45} />
      <path
        d={`M${cx - (open ? 12 : 4)} 256 Q${cx - w + 12} ${244 - 40 * k} ${cx - w + 12} ${(246 + top) / 2} Q${cx - w + 12} ${top + 12} ${cx} ${top + 12} Q${cx + w - 12} ${top + 12} ${cx + w - 12} ${(246 + top) / 2} Q${cx + w - 12} ${244 - 40 * k} ${cx + (open ? 12 : 4)} 256`}
        className="bz2-o bz2-thin bz2-water"
      />
    </g>
  );
}

function Fetus({ x, y, s, rot = 0 }: { x: number; y: number; s: number; rot?: number }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-12 -8 Q-36 14 -24 40 Q-6 62 22 50 Q38 36 30 8 Q24 -10 8 -10Z" className="bz2-o bz2-embryo" />
      <path d="M-12 -8 Q-36 14 -24 40 Q-6 62 22 50 Q38 36 30 8 Q24 -10 8 -10Z" fill={pat(id, "dots")} />
      <circle cx={0} cy={-26} r={20} className="bz2-o bz2-embryo" />
      <path d="M-12 -24 q3 2 6 0" className="bz2-o bz2-thin" />
      {/* arm and leg */}
      <path d="M4 2 Q-10 14 -4 24 L6 26" className="bz2-o" style={{ strokeWidth: 1.8 }} />
      <path d="M24 40 Q4 52 -6 38 Q-8 30 2 30" className="bz2-o" style={{ strokeWidth: 1.8 }} />
    </g>
  );
}

const STEPS = [
  {
    title: "Oplození",
    caption: "Ve vejcovodu pronikne do vajíčka jediná spermie. Splynutím jader vznikne zygota.",
    art: (
      <>
        <Organs />
        <Pop delay={0.2}>
          <circle cx={120} cy={106} r={13} className="bz2-o bz2-zona" />
          <circle cx={120} cy={106} r={9} className="bz2-o bz2-thin bz2-egg" />
        </Pop>
        <Fade delay={0.4}>
          <Sperm x={140} y={118} a={200} />
          <Sperm x={150} y={102} a={170} />
          <Sperm x={160} y={130} a={210} />
          <Sperm x={130} y={92} a={140} />
          <Sperm x={176} y={142} a={220} />
        </Fade>
        <Lbl x={110} y={60} tx={118} ty={94} className="bz2-sm bz2-b">vajíčko</Lbl>
        <Lbl x={178} y={88} tx={156} ty={102} className="bz2-sm">spermie</Lbl>
        <Lbl x={8} y={200} tx={56} ty={146} className="bz2-sm">vaječník</Lbl>
        <Lbl x={260} y={250} tx={226} ty={220} className="bz2-sm">děloha</Lbl>
        <Lbl x={8} y={70} tx={86} ty={98} className="bz2-sm" sec>vejcovod</Lbl>
        <Tag a="0. den" b="vzniká zygota" />
      </>
    ),
  },
  {
    title: "Rýhování a zahnízdění",
    caption: "Zygota se cestou vejcovodem dělí; asi 7. den se zahnízdí ve sliznici dělohy.",
    art: (
      <>
        <Organs />
        <Cells x={118} y={104} n={1} />
        <Cells x={146} y={116} n={2} />
        <Cells x={166} y={132} n={4} />
        <Cells x={184} y={148} n={8} r={7} />
        <Pop delay={0.4}>
          <circle cx={212} cy={168} r={9} className="bz2-o bz2-zona" />
          <circle cx={212} cy={168} r={6} className="bz2-o bz2-thin bz2-water" />
          <circle cx={208} cy={164} r={3} className="bz2-o bz2-hair bz2-embryo" />
        </Pop>
        <Arrow d="M100 90 Q150 84 190 120" tone="lvl" dashed />
        <Lbl x={8} y={70} tx={112} ty={100} className="bz2-sm bz2-b">zygota</Lbl>
        <Lbl x={150} y={66} tx={160} ty={124} className="bz2-sm">rýhování</Lbl>
        <Lbl x={260} y={250} tx={216} ty={174} className="bz2-sm bz2-b">zahnízdění</Lbl>
        <Tag a="1. týden" b="2 → 4 → 8 buněk" />
      </>
    ),
  },
  {
    title: "Zárodek (embryo)",
    caption: "Do konce 8. týdne se založí všechny orgány; srdce bije už kolem 6. týdne.",
    art: (
      <>
        <Womb k={0.42} />
        <Pop delay={0.3}>
          <ellipse cx={210} cy={186} rx={24} ry={22} className="bz2-o bz2-water" />
          <Fetus x={210} y={194} s={0.34} rot={-20} />
          <circle cx={212} cy={196} r={2.2} className="bz2-heart-dot" />
        </Pop>
        <Lbl x={8} y={150} tx={190} ty={186} className="bz2-sm bz2-b">zárodek</Lbl>
        <Lbl x={8} y={168} className="bz2-xs bz2-muted-t">asi 2 cm</Lbl>
        <Lbl x={300} y={230} tx={212} ty={196} className="bz2-sm bz2-red-t">srdce</Lbl>
        <Tag a="do 8. týdne" b="zakládají se orgány" />
      </>
    ),
  },
  {
    title: "Plod",
    caption: "Od 9. týdne plod hlavně roste. Kyslík a živiny mu přináší placenta přes pupečník.",
    art: (
      <>
        <Womb k={0.95} />
        <Pop delay={0.2}>
          <path d="M298 62 Q334 88 334 150 Q314 142 302 112 Q294 84 298 62Z" className="bz2-o bz2-placenta" />
          <path d="M310 122 Q270 116 268 148 Q266 176 220 178" className="bz2-cord" />
          <Fetus x={196} y={150} s={1.25} rot={10} />
        </Pop>
        <Lbl x={8} y={110} tx={150} ty={130} className="bz2-sm bz2-b">plod</Lbl>
        <Lbl x={414} y={70} tx={318} ty={96} anchor="end" lx={392} ly={76} className="bz2-sm bz2-b">placenta</Lbl>
        <Lbl x={414} y={226} tx={268} ty={156} anchor="end" lx={380} ly={220} className="bz2-sm">pupečník</Lbl>
        <Lbl x={8} y={240} tx={140} ty={226} className="bz2-sm bz2-blue-t">plodová voda</Lbl>
        <Tag a="3.–9. měsíc" b="plod roste" />
      </>
    ),
  },
  {
    title: "Porod",
    caption: "Asi ve 40. týdnu se děloha stahuje, otevře se děložní hrdlo a dítě vyjde hlavičkou napřed.",
    art: (
      <>
        <Womb k={0.95} open />
        <Pop delay={0.2}>
          <path d="M298 62 Q334 88 334 150 Q314 142 302 112 Q294 84 298 62Z" className="bz2-o bz2-placenta" />
          <Fetus x={212} y={172} s={1.3} rot={180} />
        </Pop>
        <Fade delay={0.5}>
          <Arrow d="M96 120 Q104 150 120 170" tone="lvl" />
          <Arrow d="M324 120 Q316 150 300 170" tone="lvl" />
          <Arrow d="M180 20 Q210 30 240 20" tone="lvl" />
        </Fade>
        <Lbl x={8} y={100} className="bz2-sm bz2-b bz2-lvl-t">stahy dělohy</Lbl>
        <Lbl x={300} y={290} tx={216} ty={258} className="bz2-sm">děložní hrdlo</Lbl>
        <Tag a="asi 40. týden" b="asi 50 cm, 3,3 kg" />
      </>
    ),
  },
];

export default function HumanDevelopment() {
  return (
    <Figure level={6} label={LABEL} max={620} interactive>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s) => ({
          ...s,
          art: (
            <Frame w={W} h={H}>
              {s.art}
            </Frame>
          ),
        }))}
      />
    </Figure>
  );
}
