import { DrawArrow, Fade, FadeArrow, Figure, Lbl, Pop, f1, pat, useFig, useLive } from "./kit";

const LABEL =
  "Tropická cyklóna shora a v řezu. Shora: spirální pásy oblaků a deště se stáčejí ke středu, kde je oko – kruhová oblast klidu a jasné oblohy o průměru asi 30 až 65 km; kolem oka je oční stěna z nejvyšších bouřkových oblaků s nejsilnějším větrem. Na severní polokouli se vzduch točí proti směru hodinových ručiček, celá bouře měří asi 500 km. V řezu: nad oceánem teplejším než 26,5 °C se vzduch nasává ke středu, v oční stěně prudce stoupá a ve výšce 12–15 km se rozlévá do stran; v oku vzduch klesá. Podle oblasti se jmenuje hurikán (Atlantik, Karibik a východní Pacifik), tajfun (severozápadní Pacifik) nebo cyklon (Indický oceán a okolí Austrálie); vítr v ní dosahuje nejméně 119 km/h.";

const W = 520;
const H = 600;
const C: [number, number] = [146, 156];
const R = 122;
const pt = (deg: number, r: number) =>
  `${f1(C[0] + Math.cos((deg * Math.PI) / 180) * r)} ${f1(C[1] + Math.sin((deg * Math.PI) / 180) * r)}`;

/** one spiral rain band: turns anticlockwise (screen) while it winds in */
function arm(a0: number, r0: number, r1: number, turn: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const a = a0 - turn * t;
    const r = r0 + (r1 - r0) * t;
    pts.push(`${f1(C[0] + Math.cos(a) * r)} ${f1(C[1] + Math.sin(a) * r)}`);
  }
  return "M" + pts.join(" L");
}

function Plan() {
  const { id } = useFig();
  const live = useLive();
  return (
    <g>
      <Fade>
        <circle cx={C[0]} cy={C[1]} r={R} className="gz3-sea" />
        <circle cx={C[0]} cy={C[1]} r={R} fill={pat(id, "h")} opacity={0.6} />
      </Fade>
      <g className={live ? "gz3-spin-slow" : ""} style={{ transformOrigin: `${C[0]}px ${C[1]}px` }}>
        <Pop delay={0.2}>
          {[0, 1, 2, 3].map((k) => {
            const d = arm((k * Math.PI) / 2, R - 6, 30, 3.3);
            return (
              <g key={k}>
                <path d={d} className="gz3-band-o" />
                <path d={d} className="gz3-band-i" />
              </g>
            );
          })}
          {/* eye wall */}
          <circle cx={C[0]} cy={C[1]} r={26} className="gz3-o gz3-cloud-d" style={{ strokeWidth: 1 }} />
          <circle cx={C[0]} cy={C[1]} r={26} fill={pat(id, "d")} opacity={0.6} />
          <circle cx={C[0]} cy={C[1]} r={10} className="gz3-o gz3-sea" style={{ strokeWidth: 1 }} />
        </Pop>
      </g>
      {/* rotation (anticlockwise in the northern hemisphere) */}
      <DrawArrow
        d={`M${pt(-30, R + 12)} A${R + 12} ${R + 12} 0 0 0 ${pt(-100, R + 12)}`}
        tone="lvl"
        className="gz3-wind"
        delay={0.7}
      />
      <DrawArrow
        d={`M${pt(150, R + 12)} A${R + 12} ${R + 12} 0 0 0 ${pt(80, R + 12)}`}
        tone="lvl"
        className="gz3-wind"
        delay={0.7}
      />
      <Fade delay={1}>
        <Lbl x={C[0] + 40} y={C[1] + 6} tx={C[0] + 4} ty={C[1] + 2} className="gz3-b gz3-halo">
          oko
        </Lbl>
        <Lbl x={C[0] - 44} y={C[1] - 50} anchor="end" tx={C[0] - 18} ty={C[1] - 18} className="gz3-sm gz3-halo">
          oční stěna
        </Lbl>
        <path d={`M${C[0] - R} ${C[1] + R + 42} H${C[0] + R} M${C[0] - R} ${C[1] + R + 36} v12 M${C[0] + R} ${C[1] + R + 36} v12`} className="gz3-o gz3-thin" />
        <text x={C[0]} y={C[1] + R + 38} textAnchor="middle" className="gz3-eq gz3-halo">
          ≈ 500 km
        </text>
      </Fade>
    </g>
  );
}

const NAMES = [
  { n: "hurikán", w: "Atlantik, Karibik,", w2: "východní Pacifik" },
  { n: "tajfun", w: "severozápadní Pacifik", w2: "(Filipíny, Japonsko)" },
  { n: "cyklon", w: "Indický oceán,", w2: "okolí Austrálie" },
];

function Legend() {
  return (
    <Fade delay={0.9}>
      <text x={318} y={40} className="gz3-lbl gz3-sm gz3-muted-t">
        jména podle oblasti
      </text>
      {NAMES.map((r, i) => (
        <g key={r.n}>
          <text x={318} y={70 + i * 60} className="gz3-lbl gz3-b gz3-big gz3-lvl-t">
            {r.n}
          </text>
          <text x={318} y={89 + i * 60} className="gz3-lbl gz3-sm">
            {r.w}
          </text>
          <text x={318} y={106 + i * 60} className="gz3-lbl gz3-sm">
            {r.w2}
          </text>
        </g>
      ))}
      <text x={318} y={300} className="gz3-lbl gz3-sm gz3-b">
        vítr ≥ 119 km/h
      </text>
      <text x={318} y={254} className="gz3-lbl gz3-sm gz3-lvl-t">
        točí se proti směru
      </text>
      <text x={318} y={271} className="gz3-lbl gz3-sm gz3-lvl-t">
        hodinových ručiček
      </text>
    </Fade>
  );
}

function Section() {
  const S = 556; // sea surface
  const cx = 260;
  const tower = (x: number, w: number, top: number) =>
    `M${x - w} ${S - 40} C${x - w - 8} ${S - 70} ${x - w + 4} ${top + 40} ${x - w * 0.4} ${top + 10} C${x - 4} ${top - 6} ${x + 8} ${top - 4} ${x + w * 0.45} ${top + 12} C${x + w} ${top + 40} ${x + w + 6} ${S - 70} ${x + w} ${S - 40} Z`;
  return (
    <g>
      <Fade delay={0.2}>
        <rect x={10} y={S} width={W - 20} height={28} className="gz3-sea" />
        <path d={`M10 ${S} H${W - 10}`} className="gz3-o" />
        <text x={W - 16} y={S + 20} textAnchor="end" className="gz3-lbl gz3-sm">
          teplý oceán &gt; 26,5 °C
        </text>
      </Fade>
      <Pop delay={0.3}>
        {/* outflow shield */}
        <path
          d={`M40 392 C80 376 160 366 ${cx - 24} 362 L${cx + 24} 362 C360 366 440 376 480 392 C440 398 380 396 ${cx + 30} 384 L${cx - 30} 384 C140 396 80 398 40 392 Z`}
          className="gz3-o gz3-cloud"
        />
        {[
          [cx - 150, 26, 452],
          [cx + 150, 26, 452],
          [cx - 92, 28, 420],
          [cx + 92, 28, 420],
        ].map(([x, w, t]) => (
          <path key={x} d={tower(x, w, t)} className="gz3-o gz3-cloud-d" />
        ))}
        <path d={tower(cx - 40, 24, 368)} className="gz3-o gz3-cloud-d" />
        <path d={tower(cx + 40, 24, 368)} className="gz3-o gz3-cloud-d" />
        {[cx - 150, cx + 150, cx - 92, cx + 92, cx - 40, cx + 40].map((x) => (
          <g key={x}>
            {[-12, -4, 4, 12].map((dx) => (
              <path key={dx} d={`M${x + dx} ${S - 36} l-3 30`} className="gz3-rain-s" />
            ))}
          </g>
        ))}
      </Pop>
      {/* air: in at the bottom, up the eye wall, out at the top, down in the eye */}
      <DrawArrow d={`M30 ${S - 12} H${cx - 64}`} tone="lvl" className="gz3-wind" delay={0.6} />
      <DrawArrow d={`M${W - 30} ${S - 12} H${cx + 64}`} tone="lvl" className="gz3-wind" delay={0.6} />
      <DrawArrow d={`M${cx - 40} ${S - 50} V392`} tone="red" className="gz3-wind" delay={0.9} />
      <DrawArrow d={`M${cx + 40} ${S - 50} V392`} tone="red" className="gz3-wind" delay={0.9} />
      <DrawArrow d={`M${cx - 70} 350 H40`} tone="lvl" className="gz3-wind" delay={1.2} />
      <DrawArrow d={`M${cx + 70} 350 H${W - 40}`} tone="lvl" className="gz3-wind" delay={1.2} />
      <FadeArrow d={`M${cx} 410 V${S - 30}`} tone="muted" className="gz3-dash" delay={1.3} />
      <Fade delay={1.3}>
        <text x={cx} y={S - 12} textAnchor="middle" className="gz3-lbl gz3-b">
          oko
        </text>
        <text x={cx} y={340} textAnchor="middle" className="gz3-lbl gz3-sm">
          výtok vzduchu ve 12–15 km
        </text>
        <text x={W - 14} y={430} textAnchor="end" className="gz3-lbl gz3-sm gz3-sec">
          spirální pásy deště
        </text>
        <Lbl x={14} y={430} className="gz3-sm" tx={cx - 46} ty={410}>
          oční stěna
        </Lbl>
      </Fade>
    </g>
  );
}

export default function TropicalCyclone() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plan />
      <Legend />
      <Section />
    </Figure>
  );
}
