import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, StripBox, f1, geoPath, meridian, ortho, parallel, pat, useFig } from "./kit";

const LABEL =
  "Osvětlení Země o slunovratech. Zemská osa je skloněná o 23,5° od kolmice k rovině oběžné dráhy a míří stále stejným směrem. 21. června je k Slunci přikloněná severní polokoule: Slunce stojí v poledne v nadhlavníku nad obratníkem Raka, za severním polárním kruhem je polární den a za jižním polární noc; na 50° s. š. trvá den asi 16 hodin. 21. prosince je k Slunci přikloněná jižní polokoule: Slunce je v nadhlavníku nad obratníkem Kozoroha, za severním polárním kruhem je polární noc a na 50° s. š. trvá den jen asi 8 hodin.";

const W = 300;
const H = 370;
const C = 146;
const CY = 156;
const R = 108;
const TILT = 23.44;

function Panel({ june }: { june: boolean }) {
  const { id } = useFig();
  const rot = june ? TILT : -TILT;
  const P = ortho(C, CY, R, 0, 0, rot);
  const np = P(90, 0);
  const sp = P(-90, 0);
  // axis extended beyond the poles
  const ax = (np.x - sp.x) / (2 * R);
  const ay = (np.y - sp.y) / (2 * R);
  // 50° N parallel split into day (right of the terminator) and night
  const a = P(50, -90);
  const b = P(50, 90);
  const t = (C - a.x) / (b.x - a.x);
  const m = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  const [l, r] = a.x < b.x ? [a, b] : [b, a];
  const sub = P(june ? TILT : -TILT, 90); // the subsolar point on the right limb
  const lit = june ? "16" : "8";
  const dark = june ? "8" : "16";
  return (
    <Frame w={W} h={H} className="gz1-small">
      <circle cx={C} cy={CY} r={R} className="gz1-sea" />
      {[-60, -30, 30, 60].map((lo) => (
        <path key={lo} d={geoPath(meridian(lo), P)} className="gz1-grat" />
      ))}
      <path d={geoPath(parallel(0), P)} className="gz1-equator" style={{ strokeWidth: 1.4 }} />
      {[TILT, -TILT].map((la) => (
        <path key={la} d={geoPath(parallel(la), P)} className="gz1-trop" />
      ))}
      {[66.56, -66.56].map((la) => (
        <path key={la} d={geoPath(parallel(la), P)} className="gz1-polar" />
      ))}
      {/* night half */}
      <path d={`M${C} ${CY - R} A${R} ${R} 0 0 0 ${C} ${CY + R}Z`} className="gz1-night" />
      <path d={`M${C} ${CY - R} A${R} ${R} 0 0 0 ${C} ${CY + R}Z`} fill={pat(id, "sh")} />
      <circle cx={C} cy={CY} r={R} className="gz1-o" />
      {/* 50° N: day and night part */}
      <path d={`M${f1(l.x)} ${f1(l.y)} L${f1(m.x)} ${f1(m.y)}`} className="gz1-par-night" />
      <path d={`M${f1(m.x)} ${f1(m.y)} L${f1(r.x)} ${f1(r.y)}`} className="gz1-par-day" />
      <path d={`M${f1(C + ax * (R + 22))} ${f1(CY + ay * (R + 22))} L${f1(C - ax * (R + 22))} ${f1(CY - ay * (R + 22))}`} className="gz1-axis" />
      {/* sunlight from the right; one ray meets the surface at right angles */}
      {[-70, 70].map((dy) => (
        <path key={dy} d={`M${W - 4} ${CY + dy} H${f1(C + Math.sqrt(R * R - dy * dy) + 6)}`} className="gz1-ray" markerEnd={`url(#${id}-ah-acc)`} />
      ))}
      <path d={`M${W - 4} ${f1(sub.y)} H${f1(sub.x + 6)}`} className="gz1-ray" style={{ strokeWidth: 2.6 }} markerEnd={`url(#${id}-ah-acc)`} />
      <circle cx={f1(sub.x)} cy={f1(sub.y)} r={4} className="gz1-sun gz1-o gz1-thin" />
      {/* labels */}
      <text x={C} y={22} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b">
        {june ? "polární den" : "polární noc"}
      </text>
      <text x={C} y={CY + R + 34} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b">
        {june ? "polární noc" : "polární den"}
      </text>
      <text x={f1(r.x + 4)} y={f1(r.y + 4)} className="gz1-lbl gz1-sm gz1-b gz1-halo-soft">
        50°
      </text>
      <text x={C} y={H - 30} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b gz1-acc-t">
        {june ? "Slunce kolmo nad obratníkem Raka" : "Slunce kolmo nad obratníkem Kozoroha"}
      </text>
      <text x={C} y={H - 6} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b">
        {`50° s. š.: den ≈ ${lit} h, noc ≈ ${dark} h`}
      </text>
    </Frame>
  );
}

export default function SolsticeLight() {
  return (
    <Figure level={2} label={LABEL} max={720} interactive boost={false}>
      <StripBox label={LABEL} note="Osa je skloněná o 23,5° a míří pořád stejným směrem; Slunce svítí zprava.">
        <StepStrip
          min={240}
          steps={[
            {
              title: "21. června – letní slunovrat",
              art: <Panel june />,
              caption: "K Slunci je přikloněná severní polokoule: u nás nejdelší den v roce.",
            },
            {
              title: "21. prosince – zimní slunovrat",
              art: <Panel june={false} />,
              caption: "K Slunci je přikloněná jižní polokoule: u nás nejkratší den v roce.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
