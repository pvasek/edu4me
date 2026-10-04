import { Fade, Figure, Note, f1, pat, useFig, useLive } from "./kit";

const LABEL =
  "Riziko = hrozba × zranitelnost ÷ kapacita (schopnost katastrofu zvládnout). Stejné zemětřesení o síle M 7 zasáhne dvě města. V bohatém městě stojí domy postavené podle protizemětřesných předpisů, lidé jsou varovaní a cvičení a záchranáři i nemocnice fungují, takže zranitelnost je malá a riziko nízké: škody, ale málo obětí. V chudém městě se hroutí domy z nezpevněných cihel a betonu v hustě zastavěných čtvrtích bez varování a záchrany, zranitelnost je velká a riziko vysoké. Skutečné příklady z roku 2010: zemětřesení na Haiti (M 7,0) zabilo podle odhadů 100 000 až 316 000 lidí, mnohem silnější zemětřesení v Chile (M 8,8, asi 500× víc uvolněné energie) asi 525 lidí.";

const W = 460;
const H = 420;
const G = 192; // ground line

function Braced({ x, w, h }: { x: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={G - h} width={w} height={h} className="gz6-fill gz6-o" />
      {Array.from({ length: Math.floor(h / 22) }, (_, i) => {
        const y0 = G - h + i * 22;
        return <path key={i} d={`M${x} ${y0} L${x + w} ${y0 + 22} M${x + w} ${y0} L${x} ${y0 + 22}`} className="gz6-o gz6-thin gz6-faint" />;
      })}
    </g>
  );
}

function Hospital({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={G - 40} width={46} height={40} className="gz6-fill gz6-o" />
      <rect x={x + 17} y={G - 34} width={12} height={12} className="gz6-tag" style={{ strokeWidth: 0.8 }} />
      <path d={`M${x + 23} ${G - 32} v8 M${x + 19} ${G - 28} h8`} className="gz6-o gz6-red-s" style={{ strokeWidth: 2.2 }} />
      <rect x={x + 18} y={G - 14} width={10} height={14} className="gz6-o gz6-thin" fill="none" />
    </g>
  );
}

function House({ x, w = 26, h = 24, rot = 0, broken = false }: { x: number; w?: number; h?: number; rot?: number; broken?: boolean }) {
  return (
    <g transform={rot ? `rotate(${rot} ${x + w / 2} ${G})` : undefined}>
      <rect x={x} y={G - h} width={w} height={h} className="gz6-fill gz6-o" />
      <rect x={x + w / 2 - 4} y={G - h + 6} width={8} height={7} className="gz6-o gz6-thin" fill="none" />
      {broken && <path d={`M${x + 4} ${G - h} l6 9 l-4 6 l7 9`} className="gz6-o gz6-thin" />}
    </g>
  );
}

function Rubble({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} ${G} L${x + 8} ${G - 10} L${x + 14} ${G - 6} L${x + 22} ${G - 14} L${x + 32} ${G - 5} L${x + 40} ${G}`} className="gz6-town gz6-o" />
      <path d={`M${x + 6} ${G - 3} h6 M${x + 18} ${G - 8} l5 3 M${x + 28} ${G - 4} h5`} className="gz6-o gz6-thin" />
      <path d={`M${x + 22} ${G - 14} l4 -12 l10 2`} className="gz6-o gz6-thin" />
    </g>
  );
}

function Bullet({ x, y, t, good }: { x: number; y: number; t: string; good: boolean }) {
  return (
    <g>
      <circle cx={x + 4} cy={y - 4.5} r={3} style={{ fill: good ? "var(--good)" : "var(--bad)" }} />
      <text x={x + 13} y={y} className="gz6-lbl gz6-sm">
        {t}
      </text>
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const live = useLive();
  return (
    <>
      <Note x={10} y={6} w={W - 20} h={40} lvl>
        <text x={W / 2} y={32} textAnchor="middle" className="gz6-lbl gz6-b gz6-big">
          riziko = hrozba × zranitelnost ÷ kapacita
        </text>
      </Note>
      <text x={W / 2} y={70} textAnchor="middle" className="gz6-lbl gz6-sm">
        stejná hrozba: zemětřesení M 7 pod oběma městy
      </text>

      {/* panels */}
      <rect x={10} y={82} width={212} height={G - 82} className="gz6-air" />
      <rect x={238} y={82} width={212} height={G - 82} className="gz6-air" />
      <rect x={10} y={G} width={440} height={26} className="gz6-soil" />
      <rect x={10} y={G} width={440} height={26} fill={pat(id, "d")} opacity={0.6} />
      <path d={`M10 ${G} H450`} className="gz6-o" />
      <path d={`M230 82 V${G}`} className="gz6-o gz6-thin gz6-dash" />
      <text x={18} y={100} className="gz6-lbl gz6-b">
        bohaté město
      </text>
      <text x={442} y={100} textAnchor="end" className="gz6-lbl gz6-b">
        chudé město
      </text>

      {/* rich city: everything stands */}
      <g className={live ? "gz6-shake" : ""}>
        <Braced x={24} w={34} h={74} />
        <Hospital x={68} />
        <Braced x={124} w={28} h={56} />
        <House x={160} />
        <House x={190} w={24} h={30} />
      </g>
      {/* siren / warning */}
      <path d="M200 140 l6 -10 l6 10 Z" className="gz6-o" style={{ fill: "var(--yellow)" }} />
      <text x={206} y={139} textAnchor="middle" className="gz6-eq" style={{ fontSize: 8, fontWeight: 800 }}>
        !
      </text>

      {/* poor city: collapse */}
      <g className={live ? "gz6-shake" : ""}>
        <House x={246} w={24} h={22} broken />
        <Rubble x={274} />
        <House x={318} w={22} h={26} rot={-12} broken />
        <House x={346} w={26} h={20} />
        <Rubble x={376} />
        <House x={418} w={22} h={24} rot={9} broken />
      </g>

      {/* the same quake under both */}
      {[14, 28, 42].map((r) => (
        <path key={r} d={`M${230 - r} ${G + 22} A${r} ${r * 0.6} 0 0 1 ${230 + r} ${G + 22}`} className={`gz6-o gz6-red-s ${live ? "gz6-pulse" : ""}`} style={{ strokeWidth: 1.3 }} />
      ))}
      <path d={`M230 ${G + 15} L232 ${G + 20} L237 ${G + 22} L232 ${G + 24} L230 ${G + 29} L228 ${G + 24} L223 ${G + 22} L228 ${G + 20} Z`} style={{ fill: "var(--bad)", stroke: "var(--edge)", strokeWidth: 0.6 }} />

      {/* outcomes */}
      <Fade delay={0.6}>
        <text x={18} y={244} className="gz6-lbl gz6-b gz6-big gz6-good-t">
          riziko nízké
        </text>
        <text x={18} y={261} className="gz6-lbl gz6-sm">
          škody, ale málo obětí
        </text>
        <text x={442} y={244} textAnchor="end" className="gz6-lbl gz6-b gz6-big gz6-red-t">
          riziko vysoké
        </text>
        <text x={442} y={261} textAnchor="end" className="gz6-lbl gz6-sm">
          mnoho obětí, dlouhá obnova
        </text>
      </Fade>
      <Fade delay={0.9}>
        <text x={18} y={286} className="gz6-lbl gz6-b">
          co snižuje zranitelnost
        </text>
        {["stavby podle předpisů", "varování a nácvik", "záchranáři, nemocnice", "pojištění, peníze na obnovu"].map((t, i) => (
          <Bullet key={t} x={18} y={304 + i * 17} t={t} good />
        ))}
        <text x={246} y={286} className="gz6-lbl gz6-b">
          co ji zvyšuje
        </text>
        {["nezpevněné cihly a beton", "husté chudé čtvrti na svazích", "žádné varování ani cvičení", "slabá záchrana a zdravotnictví"].map((t, i) => (
          <Bullet key={t} x={246} y={304 + i * 17} t={t} good={false} />
        ))}
      </Fade>
      <Fade delay={1.2}>
        <path d={`M10 ${f1(H - 52)} H450`} className="gz6-o gz6-thin gz6-faint" />
        <text x={10} y={H - 30} className="gz6-eq gz6-eq-sm">
          Haiti 2010: M 7,0 → odhadem 100 000–316 000 obětí
        </text>
        <text x={10} y={H - 10} className="gz6-eq gz6-eq-sm">
          Chile 2010: M 8,8 (≈ 500× víc energie) → asi 525 obětí
        </text>
      </Fade>
    </>
  );
}

export default function HazardRisk() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} boost={false} replay>
      <Plate />
    </Figure>
  );
}
