import type { ReactNode } from "react";
import { Draw, DrawArrow, Fade, Figure, Tree, f1, pat, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Řez Afrikou od severu k jihu podél zhruba 18° v. d., přes Libyi, Čad, Středoafrickou republiku a Kongo. Na severu je Sahara se srážkami pod 100 mm za rok, pak Sahel s 200 až 600 mm a krátkým obdobím dešťů, savana s 600 až 1 500 mm a u rovníku tropický deštný les s víc než 1 500 mm. Déšť přináší pás tropických dešťů (ITCZ), který se během roku posouvá: v červenci je nejseverněji a zalévá Sahel, v lednu je u rovníku a na severu je sucho.";

// zones by latitude (° N)
const ZONES = [
  { t: "Sahara", n: "Sahara", a: 25, b: 17, rain: "< 100 mm", season: "skoro neprší" },
  { t: "Sahel", n: "Sahel", a: 17, b: 12, rain: "200–600 mm", season: "2–4 měsíce" },
  { t: "savana", n: "savana", a: 12, b: 4, rain: "600–1 500 mm", season: "5–8 měsíců" },
  { t: "deštný les", n: "les", a: 4, b: 0, rain: "> 1 500 mm", season: "celý rok" },
];
// approximate annual rainfall along the transect (mm)
const RAIN: [number, number][] = [
  [25, 5], [21, 10], [18, 20], [16, 150], [14, 350], [12, 600], [9, 1000], [6, 1300], [4, 1500], [2, 1650], [0, 1800],
];

export default function SahelTransect() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 420 : 680;
  return (
    <Figure level={7} label={LABEL} w={W} h={n ? 352 : 336} max={720} compact={compact} boost={false} replay>
      <Plate W={W} n={n} />
    </Figure>
  );
}

function Plate({ W, n }: { W: number; n: boolean }) {
  const { id } = useFig();
  const L = n ? 40 : 56;
  const R = W - 12;
  const x = (lat: number) => L + ((25 - lat) / 25) * (R - L);
  const GT = 36;
  const GB = 98;
  const gy = (mm: number) => GB - (mm / 2000) * (GB - GT);
  const GROUND = 240;
  const rand = rng(11);

  // rainfall as a smooth area
  const pts = RAIN.map(([lat, mm]) => [x(lat), gy(mm)] as [number, number]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  const area = `${d} L${f1(x(0))} ${GB} L${f1(x(25))} ${GB} Z`;

  // vegetation
  const veg: ReactNode[] = [];
  // dunes
  const dunes = `M${x(25)} ${GROUND} Q${x(23.5)} ${GROUND - 22} ${x(22)} ${GROUND} Q${x(20.5)} ${GROUND - 16} ${x(19)} ${GROUND} Q${x(18)} ${GROUND - 10} ${x(17)} ${GROUND} Z`;
  for (let lat = 16.6; lat > 12; lat -= n ? 1.6 : 1.1) {
    veg.push(<path key={`g${lat}`} d={`M${f1(x(lat))} ${GROUND} l-3 -6 M${f1(x(lat))} ${GROUND} l0 -8 M${f1(x(lat))} ${GROUND} l3 -6`} className="gz4-o gz4-thin" />);
  }
  veg.push(<Tree key="a1" x={x(15.6)} y={GROUND} s={1.1} kind="acacia" />);
  veg.push(<Tree key="a2" x={x(13.2)} y={GROUND} s={1.3} kind="acacia" />);
  for (let lat = 11.8; lat > 4.2; lat -= n ? 0.75 : 0.5) {
    veg.push(<path key={`s${lat}`} d={`M${f1(x(lat))} ${GROUND} q1 -14 5 -20 M${f1(x(lat))} ${GROUND} q-1 -13 -5 -17`} className="gz4-leafline" style={{ strokeWidth: 1.1 }} />);
  }
  [10.5, 8, 5.6].forEach((lat, i) => veg.push(<Tree key={`sv${i}`} x={x(lat)} y={GROUND} s={1.7 + (i % 2) * 0.4} kind="acacia" />));
  // rainforest: dense, tall crowns
  for (let lat = 3.8; lat > 0.1; lat -= n ? 0.42 : 0.3) {
    const s = 2 + rand() * 0.9;
    veg.push(<Tree key={`r${lat}`} x={x(lat)} y={GROUND} s={s} />);
  }

  const itcz = (lat: number, label: string, y: number, delay: number, dashed = false) => (
    <Fade delay={delay}>
      <g opacity={dashed ? 0.75 : 1}>
        <path
          d={`M${f1(x(lat) - 22)} ${y} q-2 -12 10 -12 q4 -10 16 -6 q10 -6 16 4 q10 0 8 14 Z`}
          className="gz4-st-cloud gz4-o gz4-thin"
        />
        {[-14, -4, 6, 16].map((dx) => (
          <path key={dx} d={`M${f1(x(lat) + dx)} ${y + 5} l-3 14`} className="gz4-st-rain" />
        ))}
        <text x={f1(x(lat))} y={y - 26} textAnchor="middle" className="gz4-lbl gz4-sm gz4-b gz4-blue-t gz4-halo">
          {label}
        </text>
      </g>
    </Fade>
  );

  return (
    <>
      {/* rainfall graph */}
      {[0, 1000, 2000].map((mm) => (
        <g key={mm}>
          <path d={`M${L} ${gy(mm)} H${R}`} className="gz4-grid" />
          <text x={L - 6} y={gy(mm) + 4.5} textAnchor="end" className="gz4-num">
            {mm === 2000 ? "2 000" : mm === 1000 ? "1 000" : "0"}
          </text>
        </g>
      ))}
      <text x={L} y={22} className="gz4-lbl gz4-sm gz4-b">
        {n ? "srážky za rok (mm, ≈)" : "průměrné srážky za rok (mm, přibližně)"}
      </text>
      <path d={area} className="gz4-blue-fill" opacity={0.7} />
      <path d={area} fill={pat(id, "v")} opacity={0.4} />
      <Draw d={d} className="gz4-curve gz4-st-line" delay={0.1} />

      {/* zone separators */}
      {ZONES.slice(1).map((z) => (
        <path key={z.t} d={`M${f1(x(z.a))} ${GT - 6} V${GROUND + 44}`} className="gz4-grid" />
      ))}

      {/* landscape */}
      <rect x={L} y={GROUND} width={R - L} height={10} className="gz4-soil" />
      <path d={dunes} className="gz4-sand gz4-o gz4-thin" />
      <rect x={x(17)} y={GROUND - 1} width={x(12) - x(17)} height={11} className="gz4-sand" opacity={0.6} />
      <rect x={x(12)} y={GROUND - 1} width={x(4) - x(12)} height={11} className="gz4-grass-d" opacity={0.7} />
      <rect x={x(4)} y={GROUND - 1} width={x(0) - x(4)} height={11} className="gz4-forest" opacity={0.6} />
      <path d={`M${L} ${GROUND} H${R}`} className="gz4-o" />
      {veg}

      {/* ITCZ: July over the Sahel, January near the equator */}
      {itcz(13, "ITCZ v červenci", 150, 0.7)}
      {itcz(1.5, "ITCZ v lednu", 150, 0.9, true)}
      <DrawArrow d={`M${f1(x(10.4))} 140 H${f1(x(4.4))}`} tone="blue" delay={1.1} both />

      {/* zone names */}
      {ZONES.map((z) => {
        const cx = (x(z.a) + x(z.b)) / 2;
        return (
          <g key={z.t}>
            <text x={f1(cx)} y={GROUND + 28} textAnchor="middle" className="gz4-lbl gz4-b">
              {n ? z.n : z.t}
            </text>
            <text x={f1(cx)} y={GROUND + 46} textAnchor="middle" className="gz4-lbl gz4-sm gz4-muted-t">
              {n ? z.rain.replace(" mm", "") : z.season}
            </text>
          </g>
        );
      })}

      {/* latitude axis */}
      <path d={`M${L} ${GROUND + 58} H${R}`} className="gz4-o gz4-thin" />
      {[25, 20, 15, 10, 5, 0].map((lat) => (
        <g key={lat}>
          <path d={`M${f1(x(lat))} ${GROUND + 54} v8`} className="gz4-o gz4-thin" />
          <text x={f1(x(lat))} y={GROUND + 78} textAnchor={lat === 25 ? "start" : lat === 0 ? "end" : "middle"} className="gz4-num">
            {`${lat}°`}
          </text>
        </g>
      ))}
      <text x={L} y={GROUND + 94} className="gz4-lbl gz4-sm gz4-muted-t">
        {n ? "s. š. (0° = rovník) · sever ← → jih" : "s. š. (0° = rovník) · řez podél ≈ 18° v. d.: Libye, Čad, Středoafrická rep., Kongo"}
      </text>
    </>
  );
}
