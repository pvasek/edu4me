import { DrawArrow, Fade, FadeArrow, Figure, Lbl, Pop, f1 } from "./kit";

const LABEL =
  "Tlaková výše a tlaková níže. Nahoře pohled shora jako na mapě: izobary jsou čáry spojující místa se stejným tlakem vzduchu v hektopascalech. V tlakové výši H (anticyklóně) je uprostřed tlak 1 030 hPa, v tlakové níži N (cykloně) 995 hPa. Vítr vane z výše do níže, ale otáčení Země ho na severní polokouli stáčí doprava: z výše proudí ven po směru hodinových ručiček, do níže se stáčí proti směru hodinových ručiček. Dole řez: ve výši vzduch klesá, otepluje se, oblaka se rozpouštějí a je jasno; v níži vzduch stoupá, ochlazuje se, vodní pára kondenzuje v oblaka a prší.";

const W = 520;
const H = 580;
const HC: [number, number] = [130, 168];
const NC: [number, number] = [384, 168];
const RINGS = [28, 58, 89, 118];
const HV = ["1030", "1025", "1020", "1015"];
const NV = ["995", "1000", "1005", "1010"];

/** a slightly irregular closed isobar */
function ring(c: [number, number], r: number, ph: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const rr = r * (1 + 0.05 * Math.sin(2 * a + ph) + 0.03 * Math.sin(3 * a + ph * 2));
    pts.push(`${f1(c[0] + Math.cos(a) * rr)} ${f1(c[1] + Math.sin(a) * rr * 0.92)}`);
  }
  return "M" + pts.join(" L") + "Z";
}

/** spiral arrow around a centre: from radius r0 to r1 while the angle turns by `turn` (screen radians) */
function spiral(c: [number, number], a0: number, turn: number, r0: number, r1: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const a = a0 + turn * t;
    const r = r0 + (r1 - r0) * t;
    pts.push(`${f1(c[0] + Math.cos(a) * r)} ${f1(c[1] + Math.sin(a) * r * 0.92)}`);
  }
  return "M" + pts.join(" L");
}

function Plan() {
  return (
    <g>
      <Fade>
        <rect x={6} y={30} width={W - 12} height={290} rx={8} className="gz3-land" />
        {RINGS.map((r, i) => (
          <g key={r}>
            <path d={ring(HC, r, 0.7 + i)} className="gz3-isobar" />
            <path d={ring(NC, r, 2.1 + i)} className="gz3-isobar" />
          </g>
        ))}
        {RINGS.map((r, i) => (
          <g key={r}>
            <text x={f1(HC[0] + Math.cos(2.28) * r)} y={f1(HC[1] + Math.sin(2.28) * r * 0.92 + 4)} textAnchor="middle" className="gz3-num gz3-iso-t gz3-halo">
              {HV[i]}
            </text>
            <text x={f1(NC[0] + Math.cos(0.86) * r)} y={f1(NC[1] + Math.sin(0.86) * r * 0.92 + 4)} textAnchor="middle" className="gz3-num gz3-iso-t gz3-halo">
              {NV[i]}
            </text>
          </g>
        ))}
      </Fade>
      <Pop delay={0.2}>
        <text x={HC[0]} y={HC[1] + 10} textAnchor="middle" className="gz3-pres gz3-pres-h">
          H
        </text>
        <text x={NC[0]} y={NC[1] + 10} textAnchor="middle" className="gz3-pres gz3-pres-n">
          N
        </text>
      </Pop>
      {/* winds: out of the high clockwise, into the low anticlockwise */}
      {[0, 1, 2, 3].map((k) => (
        <DrawArrow
          key={`h${k}`}
          d={spiral(HC, -0.5 + (k * Math.PI) / 2, 0.85, 36, 104)}
          tone="lvl"
          className="gz3-wind"
          delay={0.4 + k * 0.08}
        />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <DrawArrow
          key={`n${k}`}
          d={spiral(NC, Math.PI + 0.55 + (k * Math.PI) / 2, -0.85, 110, 40)}
          tone="lvl"
          className="gz3-wind"
          delay={0.6 + k * 0.08}
        />
      ))}
      <Fade delay={0.9}>
        <text x={HC[0]} y={22} textAnchor="middle" className="gz3-lbl gz3-b gz3-big">
          tlaková výše<tspan className="gz3-sub"> (anticyklóna)</tspan>
        </text>
        <text x={NC[0]} y={22} textAnchor="middle" className="gz3-lbl gz3-b gz3-big">
          tlaková níže<tspan className="gz3-sub"> (cyklóna)</tspan>
        </text>
        <Lbl x={257} y={58} anchor="middle" className="gz3-sm" tx={232} ty={98}>
          izobary (hPa)
        </Lbl>
        <text x={W / 2} y={312} textAnchor="middle" className="gz3-lbl gz3-sm gz3-lvl-t">
          rotace Země stáčí vítr doprava (severní polokoule)
        </text>
      </Fade>
    </g>
  );
}

function Section() {
  const G = 540;
  return (
    <g>
      <Fade delay={0.2}>
        <rect x={6} y={344} width={W - 12} height={G - 344} className="gz3-sky" />
        <rect x={6} y={G} width={W - 12} height={14} className="gz3-grass" />
        <path d={`M6 ${G} H${W - 6}`} className="gz3-o" />
        <text x={14} y={362} className="gz3-lbl gz3-sm gz3-muted-t">
          řez
        </text>
      </Fade>
      {/* sun over the high */}
      <Pop delay={0.5}>
        <g transform={`translate(58 396)`}>
          <circle r={14} className="gz3-o gz3-sun" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <path
                key={i}
                d={`M${f1(Math.cos(a) * 19)} ${f1(Math.sin(a) * 19)} L${f1(Math.cos(a) * 25)} ${f1(Math.sin(a) * 25)}`}
                className="gz3-o gz3-thin"
              />
            );
          })}
        </g>
      </Pop>
      {/* cloud and rain over the low */}
      <Pop delay={0.7}>
        <path
          d="M338 410 C324 410 322 392 338 390 C336 372 360 366 370 378 C376 360 404 360 408 378 C424 370 444 384 434 398 C448 400 446 414 432 414 Z"
          className="gz3-o gz3-cloud-d"
        />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${344 + i * 13} ${420 + (i % 2) * 5} l-4 14`} className="gz3-rain-s" />
        ))}
      </Pop>
      {/* sinking air in the high, rising in the low */}
      <DrawArrow d={`M${HC[0]} 372 V${G - 36}`} tone="lvl" className="gz3-vec" delay={0.4} />
      <DrawArrow d={`M${HC[0] - 10} ${G - 14} H${HC[0] - 90}`} tone="lvl" className="gz3-wind" delay={0.8} />
      <DrawArrow d={`M${HC[0] + 10} ${G - 14} H${NC[0] - 18}`} tone="lvl" className="gz3-wind" delay={0.8} />
      <DrawArrow d={`M${NC[0] + 100} ${G - 14} H${NC[0] + 18}`} tone="lvl" className="gz3-wind" delay={0.8} />
      <DrawArrow d={`M${NC[0]} ${G - 34} V438`} tone="lvl" className="gz3-vec" delay={1.1} />
      <FadeArrow d={`M${NC[0] - 36} 378 C${NC[0] - 90} 352 ${HC[0] + 90} 352 ${HC[0] + 22} 372`} tone="muted" className="gz3-dash" delay={1.3} />
      <Fade delay={1.1}>
        <text x={HC[0] + 12} y={430} className="gz3-lbl gz3-b">
          vzduch klesá
        </text>
        <text x={HC[0] + 12} y={447} className="gz3-lbl gz3-sm">
          ohřívá se → jasno
        </text>
        <text x={NC[0] - 12} y={470} textAnchor="end" className="gz3-lbl gz3-b">
          vzduch stoupá
        </text>
        <text x={NC[0] - 12} y={487} textAnchor="end" className="gz3-lbl gz3-sm">
          chladne → oblaka, déšť
        </text>
        <text x={(HC[0] + NC[0]) / 2} y={G - 22} textAnchor="middle" className="gz3-lbl gz3-sm gz3-lvl-t">
          vítr vane z výše do níže
        </text>
        <text x={HC[0]} y={G + 32} textAnchor="middle" className="gz3-pres-s gz3-pres-h">
          H
        </text>
        <text x={NC[0]} y={G + 32} textAnchor="middle" className="gz3-pres-s gz3-pres-n">
          N
        </text>
      </Fade>
    </g>
  );
}

export default function PressureWind() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plan />
      <Section />
    </Figure>
  );
}
