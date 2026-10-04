import {
  Dashed,
  DrawArrow,
  Eq,
  Fade,
  Frame,
  Lbl,
  Plates,
  blob,
  f1,
  pat,
  useFig,
  type P2,
} from "./kit";

const LABEL =
  "Hvězdice zespodu a její vodní cévní soustava. Uprostřed spodní strany jsou ústa, od nich vede do každého z pěti ramen rýha se čtyřmi řadami drobných panožek s přísavkami. Kolem úst probíhá okružní kanálek a z něj vybíhá do každého ramene paprsčitý kanálek naplněný mořskou vodou. Řez ramenem ukazuje, jak panožka pracuje: když se ampulka nad ní stáhne, vtlačí vodu do panožky, ta se natáhne a přísavkou se přichytí ke dnu. Druhý výřez ukazuje hvězdici na lovu: rameny obejme mlže, panožkami táhne jeho lastury od sebe a do úzké škvíry vychlípí vlastní žaludek.";

const C: P2 = [200, 196];
const ARMS = [-90, -18, 54, 126, 198];
const R = 168;
const rad = (d: number) => (d * Math.PI) / 180;
const at = (a: number, r: number, o = 0): P2 => [
  C[0] + Math.cos(rad(a)) * r - Math.sin(rad(a)) * o,
  C[1] + Math.sin(rad(a)) * r + Math.cos(rad(a)) * o,
];
/** arm half-width at radius r */
const hw = (r: number) => 34 - (26 * Math.max(0, r - 40)) / (R - 40);

function outline() {
  const pts: P2[] = [];
  for (const a of ARMS) {
    pts.push(at(a - 36, 52));
    pts.push(at(a, 70, -hw(70)));
    pts.push(at(a, 120, -hw(120)));
    pts.push(at(a, R - 6, -5));
    pts.push(at(a, R + 2, 0));
    pts.push(at(a, R - 6, 5));
    pts.push(at(a, 120, hw(120)));
    pts.push(at(a, 70, hw(70)));
  }
  // rotate so the path starts at a valley
  return blob(pts, true);
}

function Starfish() {
  const { id } = useFig();
  const d = outline();
  return (
    <Frame w={400} h={392} title="pohled zespodu" row="span 2">
      <path d={d} className="bz6-o bz6-star" />
      <path d={d} fill={pat(id, "dots")} />
      {/* spines along the arm margins */}
      {ARMS.map((a) =>
        [-1, 1].flatMap((s) =>
          Array.from({ length: 9 }, (_, k) => {
            const r = 52 + k * 13;
            const p = at(a, r, s * (hw(r) - 1));
            const q = at(a, r + 3, s * (hw(r) + 4));
            return (
              <path
                key={`${a}${s}${k}`}
                d={`M${f1(p[0])} ${f1(p[1])} L${f1(q[0])} ${f1(q[1])}`}
                className="bz6-spine"
              />
            );
          }),
        ),
      )}
      {/* grooves, radial canals and tube feet */}
      {ARMS.map((a) => {
        const g0 = at(a, 22);
        const g1 = at(a, R - 10);
        return (
          <g key={a}>
            <path
              d={`M${f1(g0[0])} ${f1(g0[1])} L${f1(g1[0])} ${f1(g1[1])}`}
              className="bz6-groove"
            />
            {Array.from({ length: 15 }, (_, k) => {
              const r = 34 + k * 8.6;
              const sc = 1 - (0.45 * (r - 34)) / (R - 34);
              return [-11, -5, 5, 11].map((o) => {
                const p = at(a, r + (Math.abs(o) > 8 ? 4.3 : 0), o * sc);
                return (
                  <circle
                    key={`${k}${o}`}
                    cx={p[0]}
                    cy={p[1]}
                    r={2.3 * sc + 0.5}
                    className="bz6-foot"
                  />
                );
              });
            })}
            <Dashed
              d={`M${f1(at(a, 21)[0])} ${f1(at(a, 21)[1])} L${f1(at(a, R - 14)[0])} ${f1(at(a, R - 14)[1])}`}
              className="bz6-canal"
              delay={0.7}
            />
          </g>
        );
      })}
      {/* ring canal and mouth */}
      <Dashed
        d={`M${C[0] + 21} ${C[1]} A21 21 0 1 1 ${C[0] + 21} ${C[1] - 0.1}`}
        className="bz6-canal"
        delay={0.5}
      />
      <circle cx={C[0]} cy={C[1]} r={11} className="bz6-o bz6-flesh2" />
      {ARMS.map((a) => {
        const p = at(a, 6);
        const q = at(a, 12);
        return (
          <path
            key={a}
            d={`M${f1(p[0])} ${f1(p[1])} L${f1(q[0])} ${f1(q[1])}`}
            className="bz6-o bz6-thin"
          />
        );
      })}
      {/* labels */}
      <Lbl x={60} y={56} tx={C[0] - 7} ty={C[1] - 7} className="bz6-b">
        ústa
      </Lbl>
      <Lbl x={396} y={262} tx={at(-18, 112, 12)[0]} ty={at(-18, 112, 12)[1]} anchor="end" className="bz6-b bz6-lvl-t">
        panožky
      </Lbl>
      <Lbl x={C[0]} y={386} tx={C[0] + 4} ty={C[1] + 21} anchor="middle" className="bz6-sm bz6-blue-t">
        okružní kanálek
      </Lbl>
      <Lbl x={8} y={112} tx={at(198, 96)[0]} ty={at(198, 96)[1]} className="bz6-sm bz6-blue-t">
        paprsčitý kanálek
      </Lbl>
      <Lbl x={392} y={44} tx={at(-90, 120, 21)[0]} ty={at(-90, 120, 21)[1]} anchor="end" className="bz6-sm" sec>
        ostny
      </Lbl>
    </Frame>
  );
}

/** Transverse section of an arm: ampulla squeezes → tube foot stretches and holds on. */
function ArmSection() {
  const { id } = useFig();
  const arm = "M28 150 Q40 70 150 52 Q260 70 272 150 L170 150 Q150 166 130 150Z";
  return (
    <Frame w={300} h={236} title="řez ramenem">
      {/* seabed */}
      <path d="M0 206 H300 V236 H0Z" className="bz6-fill3" />
      <path d="M0 206 H300 V236 H0Z" fill={pat(id, "soil")} />
      <path d="M0 206 H300" className="bz6-o" />
      <path d={arm} className="bz6-o bz6-star" />
      <path d={arm} fill={pat(id, "d")} opacity={0.45} />
      {/* skeletal plates (ossicles) just under the skin */}
      {[0.12, 0.3, 0.5, 0.7, 0.88].flatMap((t) => {
        // point on the dome (two quadratic halves), pulled 12 px towards the canal
        const half = (u: number, x0: number, cx: number) => {
          const v = 1 - u;
          return [v * v * x0 + 2 * v * u * cx + u * u * 150, v * v * 150 + 2 * v * u * 70 + u * u * 52] as P2;
        };
        const pts = t < 0.5 ? [half(t * 2, 28, 40)] : [half((1 - t) * 2, 272, 260)];
        return pts.map(([x, y], i) => {
          const k = 12 / Math.hypot(150 - x, 140 - y);
          const px = x + (150 - x) * k;
          const py = y + (140 - y) * k;
          const ang = (Math.atan2(140 - y, 150 - x) * 180) / Math.PI + 90;
          return (
            <ellipse
              key={`${t}${i}`}
              cx={f1(px)}
              cy={f1(py)}
              rx={9}
              ry={4.5}
              className="bz6-o bz6-thin bz6-bone"
              transform={`rotate(${f1(ang)} ${f1(px)} ${f1(py)})`}
            />
          );
        });
      })}
      {/* radial canal */}
      <circle cx={150} cy={140} r={6.5} className="bz6-o bz6-water" />
      {/* left: ampulla squeezed, foot stretched and attached */}
      <path d="M144 140 Q122 140 112 128" className="bz6-duct" />
      <ellipse cx={104} cy={116} rx={8} ry={12} className="bz6-o bz6-water" />
      <path d="M100 150 L100 200 M112 150 L112 200" className="bz6-o" />
      <rect x={100} y={128} width={12} height={72} className="bz6-water" />
      <path d="M100 150 V200 M112 150 V200" className="bz6-o" />
      <ellipse cx={106} cy={202} rx={11} ry={4} className="bz6-o bz6-lvlmid-f" />
      {/* right: ampulla full, foot short */}
      <path d="M156 140 Q178 140 188 126" className="bz6-duct" />
      <ellipse cx={198} cy={110} rx={15} ry={20} className="bz6-o bz6-water" />
      <rect x={192} y={128} width={12} height={36} className="bz6-water" />
      <path d="M192 150 V164 M204 150 V164" className="bz6-o" />
      <ellipse cx={198} cy={166} rx={10} ry={3.6} className="bz6-o bz6-lvlmid-f" />
      <DrawArrow d="M86 112 Q78 140 92 176" tone="blue" delay={0.5} />
      <Fade delay={0.6}>
        <Eq x={6} y={160} t="voda do" className="bz6-eq-sm bz6-blue-t" />
        <Eq x={6} y={176} t="panožky" className="bz6-eq-sm bz6-blue-t" />
      </Fade>
      <Lbl x={292} y={36} tx={206} ty={98} anchor="end" className="bz6-sm">
        ampulka
      </Lbl>
      <Lbl x={292} y={186} tx={204} ty={160} anchor="end" className="bz6-sm bz6-lvl-t bz6-b">
        panožka
      </Lbl>
      <Lbl x={292} y={226} tx={117} ty={203} anchor="end" className="bz6-sm" sec>
        přísavka
      </Lbl>
      <Lbl x={8} y={30} tx={146} ty={136} className="bz6-sm bz6-blue-t" sec>
        paprsčitý kanálek
      </Lbl>
    </Frame>
  );
}

/** The starfish wraps a mussel, pulls the valves apart and pushes its stomach into the gap. */
function Mussel() {
  const { id } = useFig();
  const left = "M150 206 C108 198 98 128 146 100 L148 106 C114 132 122 190 150 200Z";
  const right = "M150 206 C192 198 202 128 154 100 L152 106 C186 132 178 190 150 200Z";
  return (
    <Frame w={300} h={236} title="hvězdice otevírá mlže">
      <path d="M0 210 H300 V236 H0Z" className="bz6-fill3" />
      <path d="M0 210 H300 V236 H0Z" fill={pat(id, "soil")} />
      <path d="M0 210 H300" className="bz6-o" />
      {/* arms arching over the mussel (side view) */}
      {["M128 64 Q70 80 44 160 Q36 196 22 208", "M172 64 Q230 80 256 160 Q264 196 278 208"].map((d, i) => (
        <g key={i}>
          <path d={d} className="bz6-arm-edge" />
          <path d={d} className="bz6-arm" />
        </g>
      ))}
      <ellipse cx={150} cy={62} rx={42} ry={22} className="bz6-o bz6-star" />
      <ellipse cx={150} cy={62} rx={42} ry={22} fill={pat(id, "dots")} />
      {/* the mussel, shells pulled slightly apart */}
      <path d={left} className="bz6-o bz6-shell-d" />
      <path d={right} className="bz6-o bz6-shell-d" />
      {/* everted stomach entering the gap */}
      <path
        d="M134 80 Q150 92 166 80 Q160 96 154 104 Q156 128 150 150 Q144 128 146 104 Q140 96 134 80Z"
        className="bz6-o bz6-stomach"
      />
      {/* tube feet gripping the valves */}
      {[
        [58, 132, 110, 140],
        [52, 152, 106, 160],
        [48, 172, 110, 180],
        [242, 132, 190, 140],
        [248, 152, 194, 160],
        [252, 172, 190, 180],
      ].map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <path d={`M${x1} ${y1} L${x2} ${y2}`} className="bz6-tube" />
          <ellipse cx={x2} cy={y2} rx={2.4} ry={4} className="bz6-o bz6-thin bz6-lvlmid-f" />
        </g>
      ))}
      <DrawArrow d="M96 196 H62" tone="lvl" delay={0.5} />
      <DrawArrow d="M204 196 H238" tone="lvl" delay={0.5} />
      <Lbl x={292} y={22} tx={156} ty={116} anchor="end" className="bz6-sm bz6-red-t bz6-b">
        vychlípený žaludek
      </Lbl>
      <Lbl x={8} y={34} tx={56} ty={132} className="bz6-sm bz6-lvl-t">
        panožky táhnou
      </Lbl>
      <Lbl x={150} y={228} anchor="middle" className="bz6-sm">
        mlž
      </Lbl>
    </Frame>
  );
}

export default function StarfishFeet() {
  return (
    <Plates label={LABEL} level={4} max={820} cols="1.25fr 1fr" stackBelow={600}>
      <Starfish />
      <ArmSection />
      <Mussel />
    </Plates>
  );
}
