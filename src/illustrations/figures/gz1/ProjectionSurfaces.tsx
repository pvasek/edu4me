import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, StripBox, f1, geoPath, meridian, ortho, parallel } from "./kit";

const LABEL =
  "Tři zobrazovací plochy, na které se přenáší zeměpisná síť z glóbu. Válcové zobrazení: válec se dotýká glóbu na rovníku, poledníky i rovnoběžky jsou na mapě přímky, které se kříží v pravých úhlech. Kuželové zobrazení: kužel se dotýká glóbu na jedné rovnoběžce, poledníky se sbíhají jako paprsky a rovnoběžky jsou oblouky. Azimutální (rovinné) zobrazení: rovina se dotýká glóbu v jednom bodě, např. na pólu, poledníky jsou paprsky a rovnoběžky soustředné kružnice.";

const W = 220;
const H = 300;
const GY = 92;
const GR = 50;

function GlobeSmall({ cy = GY }: { cy?: number }) {
  const P = ortho(110, cy, GR, 18, 0);
  return (
    <g>
      <circle cx={110} cy={cy} r={GR} className="gz1-sea" />
      {[-60, 0, 60, 120].map((m) => (
        <path key={m} d={geoPath(meridian(m), P)} className="gz1-grat" />
      ))}
      {[-45, 0, 45].map((p) => (
        <path key={p} d={geoPath(parallel(p), P)} className="gz1-grat" />
      ))}
      <circle cx={110} cy={cy} r={GR} className="gz1-o" />
    </g>
  );
}

function Cylinder() {
  const xs = Array.from({ length: 9 }, (_, i) => 30 + i * 20);
  const ys = [-56, -38, -18, 0, 18, 38, 56];
  return (
    <Frame w={W} h={H} className="gz1-small">
      <GlobeSmall />
      <path d={`M60 22 V162 M160 22 V162`} className="gz1-o" />
      <ellipse cx={110} cy={22} rx={50} ry={15} className="gz1-surf gz1-o gz1-thin" />
      <path d="M60 162 A50 15 0 0 0 160 162" className="gz1-o" />
      <rect x={60} y={22} width={100} height={140} className="gz1-surf" />
      <ellipse cx={110} cy={GY} rx={50} ry={15.5} className="gz1-touch" />
      <DrawArrow d="M110 172 V188" tone="lvl" />
      <rect x={30} y={196} width={160} height={100} className="gz1-mapbg gz1-o gz1-thin" />
      {xs.map((x) => (
        <path key={x} d={`M${x} 196 V296`} className="gz1-grat" />
      ))}
      {ys.map((y) => (
        <path key={y} d={`M30 ${246 + y * 0.82} H190`} className={y === 0 ? "gz1-touch-l" : "gz1-grat"} />
      ))}
    </Frame>
  );
}

function Cone() {
  // cone tangent to the globe along 45° (seen from the side)
  const ax = 110;
  const ay = GY - GR * Math.SQRT2; // apex
  const by = 152;
  const half = by - ay;
  return (
    <Frame w={W} h={H} className="gz1-small">
      <GlobeSmall />
      <path d={`M${ax} ${f1(ay)} L${f1(ax - half)} ${by} M${ax} ${f1(ay)} L${f1(ax + half)} ${by}`} className="gz1-o" />
      <path d={`M${f1(ax - half)} ${by} A${f1(half)} 15 0 0 0 ${f1(ax + half)} ${by}`} className="gz1-o" />
      <path d={`M${ax} ${f1(ay)} L${f1(ax - half)} ${by} A${f1(half)} 15 0 0 0 ${f1(ax + half)} ${by}Z`} className="gz1-surf" />
      <ellipse cx={110} cy={f1(GY - 33.6)} rx={f1(GR * Math.SQRT1_2)} ry={10.9} className="gz1-touch" />
      <DrawArrow d="M110 172 V188" tone="lvl" />
      {/* the unrolled cone: fan of meridians, arcs of parallels */}
      {(() => {
        const cx = 110;
        const cy = 168;
        const rad = (a: number) => (a * Math.PI) / 180;
        const arcs = [56, 80, 104, 128];
        return (
          <g>
            {[-40, -26, -13, 0, 13, 26, 40].map((a) => (
              <path
                key={a}
                d={`M${f1(cx + 40 * Math.sin(rad(a)))} ${f1(cy + 40 * Math.cos(rad(a)))} L${f1(cx + 128 * Math.sin(rad(a)))} ${f1(cy + 128 * Math.cos(rad(a)))}`}
                className="gz1-grat"
              />
            ))}
            {arcs.map((r) => (
              <path
                key={r}
                d={`M${f1(cx - r * Math.sin(rad(40)))} ${f1(cy + r * Math.cos(rad(40)))} A${r} ${r} 0 0 0 ${f1(cx + r * Math.sin(rad(40)))} ${f1(cy + r * Math.cos(rad(40)))}`}
                className={r === 80 ? "gz1-touch-l" : "gz1-grat"}
              />
            ))}
          </g>
        );
      })()}
    </Frame>
  );
}

function Plane() {
  return (
    <Frame w={W} h={H} className="gz1-small">
      <GlobeSmall cy={GY + 8} />
      <path d={`M24 ${GY - GR + 20} L64 ${GY - GR - 4} H196 L156 ${GY - GR + 20}Z`} className="gz1-surf gz1-o gz1-thin" />
      <circle cx={110} cy={GY + 8 - 47.6} r={4} className="gz1-lvl-f gz1-o gz1-thin" />
      <DrawArrow d="M110 172 V188" tone="lvl" />
      {[18, 36, 54].map((r) => (
        <circle key={r} cx={110} cy={246} r={r} className="gz1-grat" />
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <path key={i} d={`M110 246 L${f1(110 + 54 * Math.cos(a))} ${f1(246 + 54 * Math.sin(a))}`} className="gz1-grat" />;
      })}
      <circle cx={110} cy={246} r={4} className="gz1-lvl-f gz1-o gz1-thin" />
    </Frame>
  );
}

export default function ProjectionSurfaces() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL} note="Barevně: kde se plocha dotýká glóbu – tam mapa nezkresluje.">
        <StepStrip
          min={180}
          phoneColumns={2}
          steps={[
            { title: "Válcové", art: <Cylinder />, caption: "Dotyk na rovníku; síť z pravoúhlých přímek." },
            { title: "Kuželové", art: <Cone />, caption: "Dotyk na rovnoběžce; poledníky se sbíhají." },
            { title: "Azimutální", art: <Plane />, caption: "Dotyk v bodě (pól); kružnice a paprsky." },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
