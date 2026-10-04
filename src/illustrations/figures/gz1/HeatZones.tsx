import { Draw, Fade, Figure, f1, geoPath, meridian, ortho, useFig } from "./kit";

const LABEL =
  "Teplotní pásy Země. Obratníky Raka a Kozoroha (23° 26′ s. š. a j. š.) ohraničují tropický (horký) pás, kde Slunce aspoň jednou v roce stojí v poledne v nadhlavníku. Mezi obratníky a polárními kruhy (66° 34′ s. š. a j. š.) leží severní a jižní mírný pás se střídáním ročních období. Za polárními kruhy jsou severní a jižní polární (studený) pás s polárním dnem a polární nocí.";

const W = 600;
const H = 440;
const CX = 200;
const CY = 220;
const R = 170;
const RAD = Math.PI / 180;
const TROP = 23.44;
const POL = 66.56;
const yOf = (lat: number) => CY - R * Math.sin(lat * RAD);
const half = (lat: number) => R * Math.cos(lat * RAD);

const BANDS: [number, number, string][] = [
  [POL, 90, "gz1-z-polar"],
  [TROP, POL, "gz1-z-temp"],
  [-TROP, TROP, "gz1-z-trop"],
  [-POL, -TROP, "gz1-z-temp"],
  [-90, -POL, "gz1-z-polar"],
];

const LINES: [number, string, string][] = [
  [POL, "severní polární kruh 66° 34′", "gz1-polar"],
  [TROP, "obratník Raka 23° 26′", "gz1-trop"],
  [0, "rovník 0°", "gz1-equator"],
  [-TROP, "obratník Kozoroha 23° 26′", "gz1-trop"],
  [-POL, "jižní polární kruh 66° 34′", "gz1-polar"],
];

function Plate() {
  const { id } = useFig();
  const P = ortho(CX, CY, R, 0, 20);
  return (
    <>
      <clipPath id={`${id}-globe`}>
        <circle cx={CX} cy={CY} r={R} />
      </clipPath>
      <g clipPath={`url(#${id}-globe)`}>
        {BANDS.map(([a, b, cls]) => (
          <rect key={a} x={CX - R} y={f1(yOf(b))} width={2 * R} height={f1(yOf(a) - yOf(b))} className={cls} />
        ))}
      </g>
      {[-60, -30, 0, 30, 60].map((m) => (
        <path key={m} d={geoPath(meridian(m), P)} className="gz1-grat" />
      ))}
      {LINES.map(([lat, , cls], i) => (
        <Draw key={lat} d={`M${f1(CX - half(lat))} ${f1(yOf(lat))} H${f1(CX + half(lat))}`} className={cls} delay={0.1 + i * 0.1} />
      ))}
      <circle cx={CX} cy={CY} r={R} className="gz1-o" />
      <path d={`M${CX} ${CY - R - 16} V${CY + R + 16}`} className="gz1-axis" />
      {/* line names on the right, with leaders */}
      <Fade delay={0.7}>
        {LINES.map(([lat, name], i) => {
          const y = yOf(lat);
          const ty = [CY - 160, CY - 76, CY + 4, CY + 84, CY + 166][i];
          return (
            <g key={lat}>
              <path d={`M${f1(CX + half(lat) + 3)} ${f1(y)} L${CX + R + 22} ${ty - 5} H${CX + R + 30}`} className="gz1-lead" />
              <text x={CX + R + 34} y={ty} className={`gz1-lbl gz1-sm ${lat === 0 ? "gz1-red-t" : ""}`}>
                {name}
              </text>
            </g>
          );
        })}
      </Fade>
      {/* zone names */}
      <Fade delay={1.0}>
        <text x={CX} y={f1((yOf(TROP) + yOf(POL)) / 2 + 6)} textAnchor="middle" className="gz1-lbl gz1-b gz1-big gz1-halo-soft">
          severní mírný pás
        </text>
        <text x={CX} y={CY - 14} textAnchor="middle" className="gz1-lbl gz1-b gz1-big gz1-halo-soft">
          tropický pás
        </text>
        <text x={CX} y={f1((yOf(-TROP) + yOf(-POL)) / 2 + 6)} textAnchor="middle" className="gz1-lbl gz1-b gz1-big gz1-halo-soft">
          jižní mírný pás
        </text>
        <text x={CX - 30} y={CY - R - 8} textAnchor="end" className="gz1-lbl gz1-b gz1-blue-t">
          severní polární pás
        </text>
        <text x={CX - 30} y={CY + R + 22} textAnchor="end" className="gz1-lbl gz1-b gz1-blue-t">
          jižní polární pás
        </text>
      </Fade>
    </>
  );
}

export default function HeatZones() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={660} replay>
      <Plate />
    </Figure>
  );
}
