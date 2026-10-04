import { StepStrip } from "../../sequence/StepFigure";
import { Draw, Fade, Figure, Frame, Pop, StripBox, f1 } from "./kit";

const LABEL =
  "Jak se měří zeměpisné souřadnice. Zeměpisná šířka φ je úhel ve středu Země mezi rovinou rovníku a spojnicí se středem; měří se od rovníku k severu (s. š.) nebo k jihu (j. š.) od 0° do 90°. Zeměpisná délka λ je úhel mezi nultým poledníkem a poledníkem místa při pohledu nad severním pólem; měří se na východ (v. d.) nebo na západ (z. d.) od 0° do 180°. Praha leží na 50° 05′ s. š. a 14° 25′ v. d.";

const W = 300;
const H = 306;
const C = 150;
const CY = 140;
const R = 106;
const RAD = Math.PI / 180;
const PHI = 50.08;
const LAM = 14.42;

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  // screen angles in degrees (0 = right, positive = clockwise / downwards)
  const p0 = [cx + r * Math.cos(a0 * RAD), cy + r * Math.sin(a0 * RAD)];
  const p1 = [cx + r * Math.cos(a1 * RAD), cy + r * Math.sin(a1 * RAD)];
  const sweep = a1 > a0 ? 1 : 0;
  return `M${f1(p0[0])} ${f1(p0[1])} A${r} ${r} 0 0 ${sweep} ${f1(p1[0])} ${f1(p1[1])}`;
}

/** Section through the Earth along Prague's meridian. */
function Latitude() {
  const px = C + R * Math.cos(PHI * RAD);
  const py = CY - R * Math.sin(PHI * RAD);
  return (
    <Frame w={W} h={H} className="gz1-small">
      <circle cx={C} cy={CY} r={R} className="gz1-sea" />
      <circle cx={C} cy={CY} r={R} className="gz1-o" />
      <path d={`M${C} ${CY - R - 14} V${CY + R + 14}`} className="gz1-axis" />
      <path d={`M${C - R} ${CY} H${C + R}`} className="gz1-equator" />
      {/* Prague's parallel (seen edge-on) */}
      <path d={`M${f1(2 * C - px)} ${f1(py)} H${f1(px)}`} className="gz1-o gz1-thin gz1-dash" />
      <Draw d={`M${C} ${CY} L${f1(px)} ${f1(py)}`} className="gz1-o gz1-lvl-s" delay={0.2} />
      <Draw d={arc(C, CY, 44, 0, -PHI)} className="gz1-o gz1-lvl-s" delay={0.5} />
      <circle cx={C} cy={CY} r={3} className="gz1-dot" />
      <Pop delay={0.7}>
        <circle cx={px} cy={py} r={5.5} className="gz1-lvl-f gz1-o gz1-thin" />
      </Pop>
      <Fade delay={0.8}>
        <text x={C + 50} y={CY - 16} className="gz1-sym-t gz1-tone-lvl">
          φ
        </text>
        <text x={px + 9} y={py - 8} className="gz1-lbl gz1-b">
          P – Praha
        </text>
        <text x={C - R + 4} y={CY + 20} className="gz1-lbl gz1-sm gz1-red-t">
          rovník 0°
        </text>
        <text x={C - 10} y={py + 19} textAnchor="end" className="gz1-lbl gz1-sm">
          50° s. š.
        </text>
        <text x={C + 6} y={CY - R - 4} className="gz1-lbl gz1-sm">
          S
        </text>
        <text x={C + 6} y={CY + R + 14} className="gz1-lbl gz1-sm">
          J
        </text>
        <text x={C + 6} y={CY + 20} className="gz1-lbl gz1-sm gz1-sec">
          střed
        </text>
        <text x={C} y={H - 4} textAnchor="middle" className="gz1-eq gz1-eq-lg">
          φ = 50° 05′ s. š.
        </text>
      </Fade>
    </Frame>
  );
}

/** View from above the North Pole: the angle from the prime meridian. */
function Longitude() {
  const rp = R * Math.cos(PHI * RAD);
  // prime meridian points down; east is anticlockwise seen from above the North Pole
  const a = 90 - LAM;
  const px = C + rp * Math.cos(a * RAD);
  const py = CY + rp * Math.sin(a * RAD);
  return (
    <Frame w={W} h={H} className="gz1-small">
      <circle cx={C} cy={CY} r={R} className="gz1-sea" />
      {[30, 60, 120, 150, 180, 210, 240, 270, 300, 330].map((m) => (
        <path
          key={m}
          d={`M${C} ${CY} L${f1(C + R * Math.cos((90 - m) * RAD))} ${f1(CY + R * Math.sin((90 - m) * RAD))}`}
          className="gz1-grat"
        />
      ))}
      <circle cx={C} cy={CY} r={R} className="gz1-equator" />
      <circle cx={C} cy={CY} r={rp} className="gz1-o gz1-thin gz1-dash" />
      <path d={`M${C} ${CY} V${CY + R + 34}`} className="gz1-pm" />
      <Draw d={`M${C} ${CY} L${f1(C + (R + 34) * Math.cos(a * RAD))} ${f1(CY + (R + 34) * Math.sin(a * RAD))}`} className="gz1-o gz1-lvl-s" delay={0.2} />
      <Draw d={arc(C, CY, R + 22, 90, a)} className="gz1-o gz1-lvl-s" delay={0.5} />
      {/* direction east: anticlockwise */}
      <Draw d={arc(C, CY, R + 16, 40, -10)} className="gz1-arr gz1-arr-ink" arrow="ink" delay={0.6} />
      <circle cx={C} cy={CY} r={4} className="gz1-lvl-f gz1-o gz1-thin" />
      <Pop delay={0.7}>
        <circle cx={px} cy={py} r={5.5} className="gz1-lvl-f gz1-o gz1-thin" />
      </Pop>
      <Fade delay={0.8}>
        <text x={C + 9} y={CY + R + 18} textAnchor="middle" className="gz1-sym-t gz1-tone-lvl" style={{ fontSize: 15 }}>
          λ
        </text>
        <text x={px + 10} y={py + 4} className="gz1-lbl gz1-b gz1-halo-soft">
          P
        </text>
        <text x={C - 8} y={CY - 8} textAnchor="end" className="gz1-lbl gz1-sm gz1-halo-soft">
          severní pól
        </text>
        <text x={C - 8} y={CY + R + 24} textAnchor="end" className="gz1-lbl gz1-sm gz1-lvl-t">
          0° Greenwich
        </text>
        <text x={W - 4} y={CY - 70} textAnchor="end" className="gz1-lbl gz1-sm">
          na východ
        </text>
        <text x={C} y={H - 4} textAnchor="middle" className="gz1-eq gz1-eq-lg">
          λ = 14° 25′ v. d.
        </text>
      </Fade>
    </Frame>
  );
}

export default function LatitudeLongitude() {
  return (
    <Figure level={1} label={LABEL} max={680} interactive boost={false}>
      <StripBox label={LABEL} note="Praha: 50° 05′ s. š., 14° 25′ v. d.">
        <StepStrip
          min={240}
          steps={[
            {
              title: "Zeměpisná šířka φ",
              art: <Latitude />,
              caption: "Úhel od rovníku k severu (s. š.) nebo k jihu (j. š.), od 0° do 90°.",
            },
            {
              title: "Zeměpisná délka λ",
              art: <Longitude />,
              caption: "Úhel od nultého poledníku na východ (v. d.) nebo na západ (z. d.), od 0° do 180°.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
