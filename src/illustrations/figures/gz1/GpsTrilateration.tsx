import { Draw, Fade, Figure, Pop, f1, useFig } from "./kit";

const LABEL =
  "Jak GPS určí polohu. Přijímač změří, jak dlouho k němu letěl signál od každé družice, a z toho spočítá vzdálenost (signál letí rychlostí světla, asi 300 000 km/s). Kolem každé družice tak vznikne kružnice (v prostoru koule) se středem v družici. Kružnice tří družic se protnou v jediném bodě – tam je přijímač. Čtvrtá družice slouží k přesnému seřízení hodin přijímače. Družice GPS obíhají asi 20 200 km nad Zemí.";

const W = 520;
const H = 486;
const P: [number, number] = [262, 316];
const SATS: [number, number][] = [
  [86, 92],
  [300, 46],
  [462, 128],
];
const S4: [number, number] = [182, 38];

function Sat({ x, y, n, faint = false }: { x: number; y: number; n: string; faint?: boolean }) {
  return (
    <g style={faint ? { opacity: 0.75 } : undefined}>
      <rect x={x - 30} y={y - 6} width={20} height={12} className="gz1-panel gz1-o gz1-thin" />
      <rect x={x + 10} y={y - 6} width={20} height={12} className="gz1-panel gz1-o gz1-thin" />
      <path d={`M${x - 10} ${y} H${x + 10}`} className="gz1-o gz1-thin" />
      <rect x={x - 8} y={y - 9} width={16} height={18} rx={2} className="gz1-lvl-f gz1-o gz1-thin" />
      <text x={x} y={y + 5} textAnchor="middle" className="gz1-satn">
        {n}
      </text>
    </g>
  );
}

function arcThrough(s: [number, number], span = 19) {
  const dx = P[0] - s[0];
  const dy = P[1] - s[1];
  const r = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx);
  const a0 = a - (span * Math.PI) / 180;
  const a1 = a + (span * Math.PI) / 180;
  return `M${f1(s[0] + r * Math.cos(a0))} ${f1(s[1] + r * Math.sin(a0))} A${f1(r)} ${f1(r)} 0 0 1 ${f1(s[0] + r * Math.cos(a1))} ${f1(s[1] + r * Math.sin(a1))}`;
}

function Plate() {
  const { narrow } = useFig();
  return (
    <>
      {/* the Earth's surface */}
      <path d={`M0 352 Q${W / 2} 300 ${W} 352 V${H - 66} H0Z`} className="gz1-land" />
      <path d={`M0 352 Q${W / 2} 300 ${W} 352`} className="gz1-o" />
      {SATS.map((s, i) => (
        <g key={i}>
          <path d={`M${s[0]} ${s[1]} L${P[0]} ${P[1]}`} className="gz1-o gz1-thin gz1-dash" style={{ opacity: 0.45 }} />
          <Draw d={arcThrough(s)} className={`gz1-range gz1-range-${i + 1}`} delay={0.3 + i * 0.3} />
        </g>
      ))}
      <path d={`M${S4[0]} ${S4[1]} L${P[0]} ${P[1]}`} className="gz1-o gz1-thin gz1-dot2" style={{ opacity: 0.6 }} />
      {SATS.map((s, i) => (
        <Pop key={i} delay={0.1 + i * 0.1}>
          <Sat x={s[0]} y={s[1]} n={String(i + 1)} />
        </Pop>
      ))}
      <Pop delay={0.4}>
        <Sat x={S4[0]} y={S4[1]} n="4" faint />
      </Pop>
      <Pop delay={1.3}>
        <circle cx={P[0]} cy={P[1]} r={7} className="gz1-fill gz1-o" style={{ strokeWidth: 2.2 }} />
        <circle cx={P[0]} cy={P[1]} r={2.6} style={{ fill: "var(--bad)" }} />
      </Pop>

      <Fade delay={1.5}>
        <text x={P[0]} y={P[1] + 90} textAnchor="middle" className="gz1-lbl gz1-b gz1-halo">
          přijímač: jediný společný bod
        </text>
        <text x={50} y={126} className="gz1-lbl gz1-sm gz1-halo">
          družice 1
        </text>
        <text x={340} y={40} className="gz1-lbl gz1-sm gz1-halo">
          družice 2
        </text>
        <text x={W - 14} y={160} textAnchor="end" className="gz1-lbl gz1-sm gz1-halo">
          družice 3
        </text>
        <text x={S4[0] - 36} y={S4[1] + 4} textAnchor="end" className="gz1-lbl gz1-sm gz1-muted-t">
          {narrow ? "4.: čas" : "4. družice:"}
        </text>
        {!narrow && (
          <text x={S4[0] - 36} y={S4[1] + 22} textAnchor="end" className="gz1-lbl gz1-sm gz1-muted-t">
            seřídí hodiny
          </text>
        )}
      </Fade>
      <Fade delay={1.8}>
        <text x={W / 2} y={H - 46} textAnchor="middle" className="gz1-lbl gz1-b">
          vzdálenost = rychlost signálu × doba letu
        </text>
        <text x={W / 2} y={H - 26} textAnchor="middle" className="gz1-lbl gz1-sm">
          signál letí asi 300 000 km/s, družice obíhají
        </text>
        <text x={W / 2} y={H - 8} textAnchor="middle" className="gz1-lbl gz1-sm">
          asi 20 200 km nad Zemí
        </text>
      </Fade>
    </>
  );
}

export default function GpsTrilateration() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
