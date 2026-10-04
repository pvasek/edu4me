import { DrawArrow, Fade, Figure, Person, Pop, useCompact } from "./kit";

const LABEL =
  "Lokalizační faktory průmyslu: továrna uprostřed a šipky od faktorů, které rozhodují, kde stojí. Suroviny, energie, pracovní síla, trh (odbyt), doprava a státní pobídky. Tradiční těžký průmysl, například hutě na Ostravsku nebo v Porúří, vznikal u ložisek uhlí a železné rudy. Moderní průmysl s vyspělými technologiemi hledá vzdělané lidi, univerzity, dobrou dopravu a letiště, například v Brně nebo v Silicon Valley.";

type Icon = "ore" | "energy" | "labour" | "market" | "transport" | "state";
const FACTORS: { k: Icon; t: string; s: string }[] = [
  { k: "ore", t: "suroviny", s: "uhlí, ruda, dřevo" },
  { k: "energy", t: "energie", s: "elektřina, plyn" },
  { k: "labour", t: "pracovní síla", s: "levná / vzdělaná" },
  { k: "market", t: "trh (odbyt)", s: "zákazníci blízko" },
  { k: "transport", t: "doprava", s: "dálnice, železnice, přístav" },
  { k: "state", t: "státní pobídky", s: "dotace, nižší daně" },
];

function Glyph({ k, x, y }: { k: Icon; x: number; y: number }) {
  const g = (() => {
    switch (k) {
      case "ore":
        return (
          <>
            <path d="M-12 8 L-8 -2 L-1 -4 L3 4 Z" className="gz4-coal gz4-o gz4-thin" />
            <path d="M0 8 L4 -6 L11 -3 L13 8 Z" className="gz4-rock-d gz4-o gz4-thin" />
          </>
        );
      case "energy":
        return <path d="M2 -12 L-8 2 H0 L-3 12 L8 -3 H0 Z" className="gz4-mt-machine gz4-o gz4-thin" />;
      case "labour":
        return <Person x={0} y={11} s={1.15} />;
      case "market":
        return (
          <>
            <path d="M-12 -8 H-8 L-4 5 H9 L12 -4 H-6" className="gz4-o gz4-thin" />
            <circle cx={-2} cy={9} r={2} className="gz4-o gz4-thin" />
            <circle cx={7} cy={9} r={2} className="gz4-o gz4-thin" />
          </>
        );
      case "transport":
        return (
          <>
            <path d="M-13 5 V-6 H3 V5 Z M3 -2 H9 L13 2 V5 H3" className="gz4-blue-fill gz4-o gz4-thin" />
            <circle cx={-8} cy={7} r={2.6} className="gz4-coal" />
            <circle cx={8} cy={7} r={2.6} className="gz4-coal" />
          </>
        );
      case "state":
        return (
          <>
            <circle r={11} className="gz4-sf-gold gz4-o gz4-thin" />
            <text y={4.5} textAnchor="middle" className="gz4-eq gz4-eq-sm" style={{ fontWeight: 800 }}>
              Kč
            </text>
          </>
        );
    }
  })();
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={20} className="gz4-tag" />
      {g}
    </g>
  );
}

function Factory({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 20 V-6 L-26 -18 V-6 L-12 -18 V-6 L2 -18 V-6 L16 -18 V20 Z" className="gz4-lvl-fill gz4-o" />
      <path d="M22 20 V-34 H32 V20" className="gz4-city gz4-o" />
      <path d="M16 20 V-2 H40 V20 Z" className="gz4-lvl-fill2 gz4-o gz4-thin" />
      {[-32, -18, -4].map((wx) => (
        <rect key={wx} x={wx} y={2} width={8} height={7} className="gz4-glass gz4-o gz4-thin" />
      ))}
      <path d="M-46 20 H46" className="gz4-o" />
      <path d="M27 -40 q6 -6 2 -12 q6 -4 4 -10" className="gz4-o gz4-thin gz4-faint" />
    </g>
  );
}

function Wheel({ cx, cy, rx, ry, narrow }: { cx: number; cy: number; rx: number; ry: number; narrow: boolean }) {
  // the six factors around the factory, label outside each glyph
  const ang = [-150, -90, -30, 30, 90, 150];
  return (
    <>
      {FACTORS.map((f, i) => {
        const a = (ang[i] * Math.PI) / 180;
        const x = cx + rx * Math.cos(a);
        const y = cy + ry * Math.sin(a);
        const ax = cx + (rx - 26) * Math.cos(a) * 0.62;
        const ay = cy + (ry - 26) * Math.sin(a) * 0.62;
        const sx = x - 24 * Math.cos(a);
        const sy = y - 24 * Math.sin(a);
        const right = !narrow && (Math.cos(a) > 0.2 || ang[i] === -90);
        const left = !narrow && Math.cos(a) < -0.2;
        const below = narrow ? ang[i] !== -90 : Math.sin(a) > 0.5 && !left && !right;
        const tx = right ? x + 26 : left ? x - 26 : x;
        const anchor = right ? "start" : left ? "end" : "middle";
        const ty = below ? y + (narrow ? 40 : 38) : left || right ? y - 2 : y - 28;
        return (
          <g key={f.k}>
            <DrawArrow d={`M${sx.toFixed(1)} ${sy.toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)}`} tone="lvl" delay={0.3 + i * 0.08} />
            <Pop delay={0.15 + i * 0.08}>
              <Glyph k={f.k} x={x} y={y} />
            </Pop>
            <Fade delay={0.5 + i * 0.08}>
              <text x={tx} y={ty} textAnchor={anchor} className="gz4-lbl gz4-b">
                {f.t}
              </text>
              {!narrow && (
                <text x={tx} y={ty + 18} textAnchor={anchor} className="gz4-lbl gz4-sm gz4-muted-t">
                  {f.s}
                </text>
              )}
            </Fade>
          </g>
        );
      })}
      <Factory x={cx} y={cy} s={narrow ? 0.9 : 1} />
    </>
  );
}

function Card({ x, y, w, h, old, narrow }: { x: number; y: number; w: number; h: number; old: boolean; narrow: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={old ? "gz4-box" : "gz4-box-lvl"} />
      <g transform={`translate(${x + 30} ${y + h / 2 + 4})`}>
        {old ? (
          <>
            {/* blast furnace and coal heap */}
            <path d="M-12 14 L-8 -16 H4 L8 14 Z" className="gz4-rock-d gz4-o gz4-thin" />
            <path d="M-6 -16 V-24 H2 V-16" className="gz4-o gz4-thin" />
            <path d="M8 14 Q14 2 22 14 Z" className="gz4-coal gz4-o gz4-thin" />
          </>
        ) : (
          <>
            {/* microchip */}
            <rect x={-12} y={-12} width={24} height={24} rx={3} className="gz4-lvl-fill2 gz4-o gz4-thin" />
            <rect x={-6} y={-6} width={12} height={12} className="gz4-fill gz4-o gz4-thin" />
            <path d="M-8 -12 V-17 M0 -12 V-17 M8 -12 V-17 M-8 12 V17 M0 12 V17 M8 12 V17 M-12 -8 H-17 M-12 0 H-17 M-12 8 H-17 M12 -8 H17 M12 0 H17 M12 8 H17" className="gz4-o gz4-thin" />
          </>
        )}
      </g>
      <text x={x + 62} y={y + 26} className="gz4-lbl gz4-b">
        {old ? "tradiční těžký průmysl" : "moderní hi-tech průmysl"}
      </text>
      <text x={x + 62} y={y + 46} className="gz4-lbl gz4-sm">
        {old ? "u ložisek uhlí a železné rudy" : narrow ? "u univerzit a letišť" : "u univerzit, letišť a vzdělaných lidí"}
      </text>
      <text x={x + 62} y={y + 66} className="gz4-lbl gz4-sm gz4-muted-t">
        {old ? "Ostravsko, Porúří" : "Brno, Silicon Valley"}
      </text>
    </g>
  );
}

export default function IndustryLocation() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 400 : 680;
  const wheelH = n ? 342 : 356;
  const H = n ? wheelH + 2 * 86 + 16 : wheelH + 98;
  return (
    <Figure level={6} label={LABEL} w={W} h={H} max={720} compact={compact} boost={false} replay>
      <Wheel cx={W / 2} cy={n ? 166 : 174} rx={n ? 128 : 190} ry={112} narrow={n} />
      <Fade delay={1}>
        {n ? (
          <>
            <Card x={6} y={wheelH} w={W - 12} h={78} old narrow />
            <Card x={6} y={wheelH + 86} w={W - 12} h={78} old={false} narrow />
          </>
        ) : (
          <>
            <Card x={10} y={wheelH} w={W / 2 - 16} h={80} old narrow={false} />
            <Card x={W / 2 + 6} y={wheelH} w={W / 2 - 16} h={80} old={false} narrow={false} />
          </>
        )}
      </Fade>
    </Figure>
  );
}
