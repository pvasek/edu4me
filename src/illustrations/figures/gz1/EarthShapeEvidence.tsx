import { StepStrip } from "../../sequence/StepFigure";
import type { GeoData } from "../../../geo/load";
import { Figure, Frame, StripBox, Sun, f1, globeLand, ortho, pat, useFig, useWorld } from "./kit";

const LABEL =
  "Tři důkazy, že Země je koule. Loď mizí za obzorem nejdřív trupem a nakonec stěžněm, protože se mezi ni a pozorovatele vyklene zakřivená hladina moře. Při zatmění Měsíce vrhá Země na Měsíc stín, jehož okraj je vždy obloukem kružnice – kulatý stín v jakékoli poloze vrhá jen koule. Fotografie z vesmíru ukazují Zemi jako kouli.";

const W = 240;
const H = 252;

/** ship with a mast and sails, drawn standing on (0,0), pointing up */
function Ship() {
  return (
    <g>
      <path d="M-16 -8 H16 L11 0 H-11Z" className="gz1-hull gz1-o gz1-thin" />
      <path d="M0 -8 V-40" className="gz1-o" />
      <path d="M1 -38 L14 -14 H1Z M-1 -36 L-12 -14 H-1Z" className="gz1-sail gz1-o gz1-thin" />
    </g>
  );
}

function ShipPanel() {
  const { id } = useFig();
  const H = 286;
  const C: [number, number] = [20, 350];
  const R = 260;
  const E: [number, number] = [20, 46];
  // tangent point of the line of sight
  const dx = E[0] - C[0];
  const dy = E[1] - C[1];
  const d = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx) + Math.acos(R / d);
  const T: [number, number] = [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)];
  const dirx = T[0] - E[0];
  const diry = T[1] - E[1];
  const k = (W - E[0]) / dirx;
  const end: [number, number] = [W, E[1] + diry * k];
  const at = (x: number) => {
    const y = C[1] - Math.sqrt(R * R - (x - C[0]) ** 2);
    const rot = (Math.asin((x - C[0]) / R) * 180) / Math.PI;
    return { y, rot };
  };
  const ships = [86, 192, 214];
  // the part below the line of sight is hidden from the observer
  const SEA = 226;
  const below = `M${f1(T[0])} ${f1(T[1])} L${f1(end[0])} ${f1(end[1])} L${W} ${SEA} L${f1(T[0])} ${SEA}Z`;
  return (
    <Frame w={W} h={H} className="gz1-small">
      <clipPath id={`${id}-hid`}>
        <path d={below} />
      </clipPath>
      <rect x={0} y={0} width={W} height={SEA} className="gz1-air" />
      {ships.map((x) => {
        const s = at(x);
        return (
          <g key={x} transform={`translate(${f1(x)} ${f1(s.y)}) rotate(${f1(s.rot)})`}>
            <g transform="scale(0.75)">
              <Ship />
            </g>
          </g>
        );
      })}
      {/* veil over what the observer cannot see */}
      <path d={below} className="gz1-veil" clipPath={`url(#${id}-hid)`} />
      <path
        d={`M0 ${f1(at(0).y)} A${R} ${R} 0 0 1 ${W} ${f1(at(W).y)} V${SEA} H0Z`}
        className="gz1-sea2"
      />
      <path d={`M0 ${f1(at(0).y)} A${R} ${R} 0 0 1 ${W} ${f1(at(W).y)} V${SEA} H0Z`} fill={pat(id, "h")} />
      <path d={`M0 ${f1(at(0).y)} A${R} ${R} 0 0 1 ${W} ${f1(at(W).y)}`} className="gz1-o" />
      <path d={`M${E[0]} ${E[1]} L${f1(end[0])} ${f1(end[1])}`} className="gz1-sight" />
      {/* observer */}
      <circle cx={E[0]} cy={E[1]} r={5} className="gz1-fill gz1-o gz1-thin" />
      <path d={`M${E[0]} ${E[1] + 5} V${f1(at(E[0]).y)}`} className="gz1-o" />
      <text x={E[0] - 6} y={E[1] - 12} className="gz1-lbl gz1-sm gz1-halo-soft">
        pozorovatel
      </text>
      <text x={W - 6} y={f1(end[1] - 8)} textAnchor="end" className="gz1-lbl gz1-sm gz1-lvl-t gz1-sec">
        pohled
      </text>
      {/* what the observer sees */}
      <g transform="translate(0 236)">
        <clipPath id={`${id}-sky`}>
          <rect x={20} y={0} width={200} height={30} />
        </clipPath>
        <rect x={20} y={0} width={200} height={46} className="gz1-air gz1-o gz1-thin" />
        <rect x={20} y={30} width={200} height={16} className="gz1-sea2" />
        <path d="M20 30 H220" className="gz1-o gz1-thin" />
        <g transform="translate(70 34)">
          <Ship />
        </g>
        <g clipPath={`url(#${id}-sky)`}>
          <g transform="translate(130 40) scale(0.8)">
            <Ship />
          </g>
          <g transform="translate(182 50) scale(0.65)">
            <Ship />
          </g>
        </g>
      </g>
    </Frame>
  );
}

function EclipsePanel() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H} className="gz1-small">
      <rect x={0} y={0} width={W} height={H} className="gz1-space" />
      <Sun x={22} y={74} r={20} rays={false} />
      {/* the Earth's shadow cone */}
      <path d="M100 52 L232 66 L232 82 L100 96Z" className="gz1-umbra" />
      <circle cx={100} cy={74} r={22} className="gz1-sea gz1-o gz1-thin" />
      <circle cx={214} cy={70} r={9} className="gz1-moon gz1-o gz1-thin" />
      <text x={100} y={118} textAnchor="middle" className="gz1-lbl gz1-sm gz1-light-t">
        Země
      </text>
      <text x={22} y={118} textAnchor="middle" className="gz1-lbl gz1-sm gz1-light-t">
        Slunce
      </text>
      <text x={214} y={100} textAnchor="middle" className="gz1-lbl gz1-sm gz1-light-t">
        Měsíc
      </text>
      {/* the Moon seen from the Earth during the eclipse */}
      <clipPath id={`${id}-moon`}>
        <circle cx={120} cy={186} r={44} />
      </clipPath>
      <circle cx={120} cy={186} r={44} className="gz1-moon" />
      <circle cx={52} cy={164} r={76} className="gz1-eclipse" clipPath={`url(#${id}-moon)`} />
      <circle cx={120} cy={186} r={44} className="gz1-o gz1-thin" style={{ stroke: "#e9dfc6" }} />
      <path d="M100 52 L232 66 M100 96 L232 82" className="gz1-o gz1-thin" style={{ stroke: "#e9dfc6", opacity: 0.4 }} />
      <text x={186} y={204} className="gz1-lbl gz1-sm gz1-light-t">
        okraj
      </text>
      <text x={186} y={222} className="gz1-lbl gz1-sm gz1-light-t">
        stínu
      </text>
      <text x={186} y={240} className="gz1-lbl gz1-sm gz1-light-t">
        = oblouk
      </text>
    </Frame>
  );
}

function SpacePanel({ world }: { world?: GeoData }) {
  const { id } = useFig();
  const P = ortho(120, 122, 94, 12, 18);
  const land = world ? globeLand(world, P, 120, 122, 94) : "";
  return (
    <Frame w={W} h={H} className="gz1-small">
      <rect x={0} y={0} width={W} height={H} className="gz1-space" />
      {[
        [20, 30],
        [200, 24],
        [36, 200],
        [214, 180],
        [180, 230],
        [60, 120],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.2} style={{ fill: "#e9dfc6" }} />
      ))}
      <circle cx={120} cy={122} r={94} className="gz1-ocean-ph" />
      {land && <path d={land} className="gz1-land-ph" fillRule="nonzero" />}
      {/* cloud bands */}
      <path
        d="M58 70 c14 -8 30 2 40 -4 M118 92 c12 -6 26 -2 36 -8 M40 150 c18 -6 30 4 50 -2 M150 140 c10 -2 18 4 30 0 M96 192 c16 -6 30 4 48 -4"
        className="gz1-cloud"
      />
      {/* night side */}
      <path d="M120 28 A94 94 0 0 1 120 216 A60 94 0 0 0 120 28Z" className="gz1-night" />
      <path d="M120 28 A94 94 0 0 1 120 216 A60 94 0 0 0 120 28Z" fill={pat(id, "sh")} />
      <circle cx={120} cy={122} r={94} className="gz1-o" style={{ stroke: "#e9dfc6" }} />
    </Frame>
  );
}

export default function EarthShapeEvidence() {
  const world = useWorld();
  return (
    <Figure level={2} label={LABEL} max={780} interactive boost={false}>
      <StripBox label={LABEL}>
        <StepStrip
          min={190}
          steps={[
            {
              title: "Loď za obzorem",
              art: <ShipPanel />,
              caption: "Nejdřív zmizí trup, nakonec stěžeň: hladina je vyklenutá.",
            },
            {
              title: "Zatmění Měsíce",
              art: <EclipsePanel />,
              caption: "Stín Země na Měsíci má vždy okraj ve tvaru oblouku.",
            },
            {
              title: "Pohled z vesmíru",
              art: <SpacePanel world={world} />,
              caption: "Fotografie z družic a kosmických lodí ukazují kouli.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
