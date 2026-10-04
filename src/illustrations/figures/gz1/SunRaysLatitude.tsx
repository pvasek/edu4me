import { Draw, Fade, Figure, Globe, Sun, f1, geoPath, meridian, ortho, parallel } from "./kit";

const LABEL =
  "Stejně široký svazek slunečních paprsků dopadá na rovník a na 60° severní šířky (v době rovnodennosti v poledne). Na rovníku dopadají paprsky kolmo, pod úhlem 90°, a jejich energie se soustředí na malou plochu – je tam teplo. Na 60° s. š. dopadají šikmo, pod úhlem 30°, a stejná energie se rozloží na asi dvakrát větší plochu – je tam chladněji. Proto je u pólů zima a u rovníku horko.";

const W = 540;
const H = 448;
const CX = 196;
const CY = 230;
const R = 170;
const RAD = Math.PI / 180;
const BW = 24; // width of each bundle

/** latitude where a horizontal ray at height y meets the sunlit limb */
const latAt = (y: number) => Math.asin((CY - y) / R) / RAD;
const limb = (lat: number): [number, number] => [CX + R * Math.cos(lat * RAD), CY - R * Math.sin(lat * RAD)];

function Bundle({ yc, cls, delay }: { yc: number; cls: string; delay: number }) {
  const y0 = yc - BW / 2;
  const y1 = yc + BW / 2;
  const a0 = latAt(y0);
  const a1 = latAt(y1);
  const p0 = limb(a0);
  const p1 = limb(a1);
  return (
    <g>
      <path d={`M${W - 70} ${f1(y0)} L${f1(p0[0])} ${f1(p0[1])} A${R} ${R} 0 0 1 ${f1(p1[0])} ${f1(p1[1])} L${W - 70} ${f1(y1)}Z`} className={`${cls}-f`} />
      {[y0, yc, y1].map((y, i) => {
        const p = limb(latAt(y));
        return <Draw key={i} d={`M${W - 70} ${f1(y)} L${f1(p[0] + 2)} ${f1(p[1])}`} className="gz1-ray" delay={delay + i * 0.08} />;
      })}
      <path d={`M${f1(p0[0])} ${f1(p0[1])} A${R} ${R} 0 0 1 ${f1(p1[0])} ${f1(p1[1])}`} className={`${cls}-s`} />
    </g>
  );
}

export default function SunRaysLatitude() {
  const P = ortho(CX, CY, R, 0, -60);
  const yEq = CY;
  const y60 = CY - R * Math.sin(60 * RAD);
  const p60 = limb(60);
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={620} replay>
      <Globe cx={CX} cy={CY} r={R} />
      {[-150, -120, -90, -60, -30, 0].map((m) => (
        <path key={m} d={geoPath(meridian(m), P)} className="gz1-grat" />
      ))}
      {[-60, -30, 30, 60].map((p) => (
        <path key={p} d={geoPath(parallel(p), P)} className="gz1-grat" />
      ))}
      <path d={`M${CX - R} ${CY} H${CX + R}`} className="gz1-equator" />
      <path d={`M${CX} ${CY - R - 14} V${CY + R + 14}`} className="gz1-axis" />
      <Sun x={W - 34} y={CY - 70} r={22} />
      <Bundle yc={y60} cls="gz1-cold" delay={0.3} />
      <Bundle yc={yEq} cls="gz1-hot" delay={0.1} />
      {/* the local horizon at 60° N and the 30° angle */}
      <path
        d={`M${f1(p60[0] - 40 * Math.sin(60 * RAD))} ${f1(p60[1] - 40 * Math.cos(60 * RAD))} L${f1(p60[0] + 60 * Math.sin(60 * RAD))} ${f1(p60[1] + 60 * Math.cos(60 * RAD))}`}
        className="gz1-o gz1-thin gz1-dash"
      />
      <Fade delay={0.9}>
        <text x={252} y={y60 - 40} className="gz1-lbl gz1-b gz1-blue-t">
          60° s. š.: šikmo (30°)
        </text>
        <text x={252} y={y60 - 21} className="gz1-lbl gz1-sm gz1-blue-t">
          asi 2× větší plocha → chladno
        </text>
        <text x={CX + R + 16} y={yEq + 40} className="gz1-lbl gz1-b gz1-red-t">
          rovník: kolmo (90°)
        </text>
        <text x={CX + R + 16} y={yEq + 58} className="gz1-lbl gz1-sm gz1-red-t">
          malá plocha → teplo
        </text>
        <text x={CX - R + 8} y={CY - 6} className="gz1-lbl gz1-sm gz1-red-t">
          rovník
        </text>
        <text x={W / 2} y={H - 10} textAnchor="middle" className="gz1-lbl gz1-sm">
          stejně široký svazek paprsků = stejné množství energie
        </text>
      </Fade>
    </Figure>
  );
}
