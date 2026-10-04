import { Draw, Fade, Figure, Pop, Town, f1 } from "./kit";

const LABEL =
  "Von Thünenův model: kolem města s trhem leží soustředné prstence využití půdy. Nejblíž zahradnictví a mléko, které se rychle kazí, pak les na dřevo, které je těžké a drahé na dopravu, dál pěstování obilí a nejdál chov dobytka, který dojde na trh sám; za ním pustina. Graf nad prstenci ukazuje rentu z polohy: u každé plodiny klesá se vzdáleností, protože roste cena dopravy, a v každém prstenci vyhrává ta plodina, jejíž přímka je nejvýš.";

const W = 480;
const H = 520;
const CX = 240;
const AX = 196; // distance axis (y)
const K = 5; // px per distance unit
const V = 1.35; // px per rent unit

/** location rent R = a − b·d of each land use (illustrative units) */
const USES = [
  { n: 1, a: 109.9, b: 7, ring: [0, 10], fill: "gz7-veg", line: "gz7-vt-1" },
  { n: 2, a: 69.9, b: 3, ring: [10, 16], fill: "gz7-forest", line: "gz7-vt-2" },
  { n: 3, a: 44.3, b: 1.4, ring: [16, 27], fill: "gz7-field", line: "gz7-vt-3" },
  { n: 4, a: 20, b: 0.5, ring: [27, 40], fill: "gz7-grass", line: "gz7-vt-4" },
] as const;

const px = (d: number) => CX + d * K;
const py = (r: number) => AX - r * V;

function tent(a: number, b: number, d0 = 0, d1 = a / b) {
  const right = `M${f1(px(d0))} ${f1(py(a - b * d0))} L${f1(px(d1))} ${f1(py(a - b * d1))}`;
  const left = `M${f1(CX - d0 * K)} ${f1(py(a - b * d0))} L${f1(CX - d1 * K)} ${f1(py(a - b * d1))}`;
  return right + " " + left;
}

const LEG = [
  { n: 1, t: "zahradnictví, mléko", s: "kazí se, doprava nejdražší" },
  { n: 2, t: "les (dřevo)", s: "těžké, objemné" },
  { n: 3, t: "obilí", s: "vydrží, dá se převézt" },
  { n: 4, t: "chov dobytka", s: "na trh dojde sám" },
];

export default function VonThunen() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={600} replay>
      {/* ---------- graph: location rent */}
      <text x={CX} y={22} textAnchor="middle" className="gz7-lbl gz7-b">
        renta z polohy (zisk z 1 ha)
      </text>
      <path d={`M${CX} ${AX} V36`} className="gz7-o gz7-thin gz7-dash" />
      {USES.map((u) => (
        <path key={u.n} d={tent(u.a, u.b)} className={`gz7-vt ${u.line} gz7-vt-faint`} />
      ))}
      {USES.map((u, i) => (
        <Draw
          key={u.n}
          d={tent(u.a, u.b, u.ring[0], u.ring[1])}
          className={`gz7-vt ${u.line}`}
          delay={0.15 + i * 0.25}
        />
      ))}
      <path d={`M${px(-44)} ${AX} H${px(44)}`} className="gz7-o" />
      <text x={px(44)} y={AX - 26} textAnchor="end" className="gz7-lbl gz7-sm">
        vzdálenost →
      </text>
      <Fade delay={1.2}>
        <text x={px(14)} y={py(74)} className="gz7-lbl gz7-sm gz7-muted-t">
          strmá přímka =
        </text>
        <text x={px(14)} y={py(74) + 17} className="gz7-lbl gz7-sm gz7-muted-t">
          drahá doprava
        </text>
      </Fade>

      {/* ---------- rings (lower half) */}
      {[...USES].reverse().map((u) => (
        <path
          key={u.n}
          d={`M${px(-u.ring[1])} ${AX} A${u.ring[1] * K} ${u.ring[1] * K} 0 0 0 ${px(u.ring[1])} ${AX} Z`}
          className={`${u.fill} gz7-o`}
        />
      ))}
      {/* the rings carry the envelope down: dashed guides */}
      {USES.map((u) => (
        <path
          key={u.n}
          d={`M${px(u.ring[1])} ${py(u.a - u.b * u.ring[1])} V${AX} M${px(-u.ring[1])} ${py(u.a - u.b * u.ring[1])} V${AX}`}
          className="gz7-o gz7-thin gz7-dot2"
        />
      ))}
      <path d={`M${px(-44)} ${AX} H${px(44)}`} className="gz7-o" />
      <Town x={CX} y={AX + 4} size={3} className="gz7-house-lvl" />
      <text x={CX} y={AX + 38} textAnchor="middle" className="gz7-lbl gz7-b gz7-halo">
        trh
      </text>
      {USES.map((u, i) => {
        const r = (i === 0 ? 38 : ((u.ring[0] + u.ring[1]) / 2) * K);
        const a = (35 * Math.PI) / 180;
        return (
          <Pop key={u.n} delay={0.4 + i * 0.15}>
            <g className="gz7-zone-n">
              <circle cx={CX + Math.cos(a) * r} cy={AX + Math.sin(a) * r} r={10.5} />
              <text x={CX + Math.cos(a) * r} y={AX + Math.sin(a) * r + 5}>
                {u.n}
              </text>
            </g>
          </Pop>
        );
      })}
      <text x={24} y={AX + 186} textAnchor="start" className="gz7-lbl gz7-sm gz7-muted-t">
        pustina
      </text>

      {/* ---------- legend */}
      {LEG.map((l, i) => {
        const x = i % 2 === 0 ? 24 : 252;
        const y = 432 + Math.floor(i / 2) * 46;
        return (
          <g key={l.n}>
            <rect x={x} y={y - 14} width={22} height={22} rx={4} className={`${USES[i].fill} gz7-o gz7-thin`} />
            <text x={x + 11} y={y + 2} textAnchor="middle" className="gz7-sw-n">
              {l.n}
            </text>
            <text x={x + 30} y={y + 1} className="gz7-lbl gz7-b">
              {l.t}
            </text>
            <text x={x + 30} y={y + 20} className="gz7-lbl gz7-sm">
              {l.s}
            </text>
          </g>
        );
      })}
    </Figure>
  );
}
