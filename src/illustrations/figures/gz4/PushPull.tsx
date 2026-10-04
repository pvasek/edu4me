import { DrawArrow, Fade, Figure, House, Person, Pop, useCompact } from "./kit";

const LABEL =
  "Migrace mezi dvěma místy. V místě odchodu lidi vypuzují odpuzující faktory (push): válka a násilí, chudoba a nedostatek práce, sucho a neúroda. Cílové místo je přitahuje přitahujícími faktory (pull): práce a vyšší mzdy, bezpečí, rodina a známí, vzdělání. Mezi oběma místy stojí překážky: hranice a víza, náklady na cestu, vzdálenost a jazyk.";

const PUSH = ["válka a násilí", "chudoba, málo práce", "sucho a neúroda"];
const PULL = ["práce a vyšší mzdy", "bezpečí", "rodina a známí", "vzdělání"];
const OBST = ["hranice, víza", "náklady na cestu", "vzdálenost", "jazyk"];

/** Origin scene: dry cracked land, a sun, a damaged house. */
function Origin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-70 0 H70" className="gz4-o" />
      <path d="M-70 0 H70 V8 H-70 Z" className="gz4-sand" />
      <path d="M-50 3 l6 3 l5 -2 M-10 2 l4 4 l7 -1 M30 3 l5 3 l6 -2" className="gz4-o gz4-thin" />
      <circle cx={46} cy={-40} r={11} className="gz4-pp-sun gz4-o gz4-thin" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path
          key={a}
          d={`M${46 + Math.cos((a * Math.PI) / 180) * 15} ${-40 + Math.sin((a * Math.PI) / 180) * 15} l${Math.cos((a * Math.PI) / 180) * 5} ${Math.sin((a * Math.PI) / 180) * 5}`}
          className="gz4-o gz4-thin"
        />
      ))}
      {/* damaged house: roof broken */}
      <path d="M-44 0 V-22 H-16 V0 Z" className="gz4-land gz4-o gz4-thin" />
      <path d="M-48 -22 L-30 -36 L-24 -31 M-16 -22 L-20 -26" className="gz4-o gz4-thin" />
      <path d="M-36 -22 l4 8 l-3 6 l4 8" className="gz4-o gz4-thin" />
      <path d="M-4 0 q2 -10 0 -16 M-4 -8 l-5 -5 M-4 -11 l4 -4" className="gz4-o gz4-thin" />
    </g>
  );
}

/** Destination scene: a town with houses, a factory and a school. */
function Destination({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-70 0 H70 V8 H-70 Z" className="gz4-grass" />
      <path d="M-70 0 H70" className="gz4-o" />
      <House x={-58} y={0} w={16} h={14} />
      <House x={-34} y={0} w={14} h={11} />
      {/* factory with chimney */}
      <path d="M-12 0 V-22 L-2 -16 V-22 L8 -16 V-22 L18 -16 V0 Z" className="gz4-city gz4-o gz4-thin" />
      <path d="M22 0 V-40 H28 V0" className="gz4-city gz4-o gz4-thin" />
      {/* block of flats */}
      <path d="M36 0 V-34 H62 V0 Z" className="gz4-fill gz4-o gz4-thin" />
      {[-28, -20, -12].map((yy) => (
        <path key={yy} d={`M40 ${yy} h5 M49 ${yy} h5 M58 ${yy} h1`} className="gz4-o gz4-thin" />
      ))}
    </g>
  );
}

function Badge({ x, y, s }: { x: number; y: number; s: "+" | "−" }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} className={s === "+" ? "gz4-pp-plus" : "gz4-pp-minus"} />
      <text x={x} y={y + 4.6} textAnchor="middle" className="gz4-eq gz4-light-t" style={{ fontWeight: 800 }}>
        {s}
      </text>
    </g>
  );
}

function List({
  x,
  y,
  items,
  s,
  gap = 24,
  delay = 0,
}: {
  x: number;
  y: number;
  items: string[];
  s: "+" | "−";
  gap?: number;
  delay?: number;
}) {
  return (
    <Fade delay={delay}>
      {items.map((t, i) => (
        <g key={t}>
          <Badge x={x} y={y + i * gap - 5} s={s} />
          <text x={x + 14} y={y + i * gap} className="gz4-lbl">
            {t}
          </text>
        </g>
      ))}
    </Fade>
  );
}

/** Border fence + coin + road: the intervening obstacles. */
function Obstacles({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* fence */}
      <path d="M-14 0 V-46 M14 0 V-46" className="gz4-o" />
      {[-40, -30, -20, -10].map((yy) => (
        <path key={yy} d={`M-14 ${yy} H14`} className="gz4-o gz4-thin" />
      ))}
      <path d="M-14 -46 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4" className="gz4-o gz4-thin" />
      <path d="M-14 -40 L14 -10 M14 -40 L-14 -10" className="gz4-o gz4-thin" style={{ opacity: 0.6 }} />
    </g>
  );
}

function Wide() {
  // three columns: origin | obstacles | destination
  return (
    <>
      <rect x={10} y={10} width={220} height={282} rx={14} className="gz4-pp-from" />
      <rect x={410} y={10} width={220} height={282} rx={14} className="gz4-pp-to" />
      <text x={120} y={38} textAnchor="middle" className="gz4-title">
        místo odchodu
      </text>
      <text x={520} y={38} textAnchor="middle" className="gz4-title">
        cílové místo
      </text>
      <Origin x={120} y={124} />
      <Destination x={520} y={124} />
      <text x={22} y={168} className="gz4-lbl gz4-b gz4-red-t">
        odpuzující faktory (push)
      </text>
      <List x={30} y={196} items={PUSH} s="−" delay={0.4} />
      <text x={422} y={168} className="gz4-lbl gz4-b gz4-good-t">
        přitahující faktory (pull)
      </text>
      <List x={430} y={196} items={PULL} s="+" delay={0.7} />

      {/* the move */}
      <DrawArrow d="M236 110 C290 70 350 70 404 110" tone="lvl" className="gz4-vec" delay={0.2} />
      <Pop delay={0.9}>
        <Person x={276} y={158} s={1} />
        <Person x={290} y={158} s={0.8} />
      </Pop>
      <Obstacles x={320} y={158} />
      <text x={320} y={186} textAnchor="middle" className="gz4-lbl gz4-b">
        překážky
      </text>
      <Fade delay={1}>
        {OBST.map((t, i) => (
          <text key={t} x={320} y={212 + i * 22} textAnchor="middle" className="gz4-lbl gz4-sm">
            {t}
          </text>
        ))}
      </Fade>
    </>
  );
}

function Narrow() {
  // stacked: origin, obstacles, destination
  return (
    <>
      <rect x={6} y={6} width={388} height={176} rx={14} className="gz4-pp-from" />
      <text x={16} y={34} className="gz4-title">
        místo odchodu
      </text>
      <Origin x={310} y={88} />
      <text x={16} y={64} className="gz4-lbl gz4-b gz4-red-t">
        odpuzující (push)
      </text>
      <List x={24} y={96} items={PUSH} s="−" gap={26} delay={0.3} />

      <DrawArrow d="M120 186 V350" tone="lvl" className="gz4-vec" delay={0.2} />
      <Obstacles x={210} y={262} />
      <Pop delay={0.8}>
        <Person x={100} y={240} />
        <Person x={88} y={242} s={0.8} />
      </Pop>
      <text x={244} y={208} className="gz4-lbl gz4-b">
        překážky
      </text>
      <Fade delay={0.9}>
        {OBST.map((t, i) => (
          <text key={t} x={244} y={232 + i * 24} className="gz4-lbl gz4-sm">
            {t}
          </text>
        ))}
      </Fade>

      <rect x={6} y={356} width={388} height={200} rx={14} className="gz4-pp-to" />
      <text x={16} y={384} className="gz4-title">
        cílové místo
      </text>
      <Destination x={310} y={438} />
      <text x={16} y={414} className="gz4-lbl gz4-b gz4-good-t">
        přitahující (pull)
      </text>
      <List x={24} y={446} items={PULL} s="+" gap={26} delay={0.6} />
    </>
  );
}

export default function PushPull() {
  const compact = useCompact();
  const n = compact.narrow;
  return (
    <Figure level={5} label={LABEL} w={n ? 400 : 640} h={n ? 562 : 300} max={680} compact={compact} boost={false} replay>
      {n ? <Narrow /> : <Wide />}
    </Figure>
  );
}
