import { Draw, DrawArrow, Fade, Figure, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Tři druhy seismických vln a seismogram. Vlny P (primární) jsou podélné: částice kmitají ve směru šíření, střídá se zhuštění a zředění; jsou nejrychlejší (v zemské kůře asi 6 km/s) a projdou pevnou látkou i kapalinou. Vlny S (sekundární) jsou příčné: částice kmitají kolmo na směr šíření; jsou pomalejší (asi 3,5 km/s) a kapalinou, například vnějším jádrem, neprojdou. Povrchové vlny běží po povrchu, jsou nejpomalejší, ale mají největší výchylky, a proto působí největší škody. Na seismogramu stanice přijdou nejdřív vlny P, pak S a nakonec povrchové; z rozdílu příchodu S a P (zde 16 s, každá sekunda odpovídá asi 8 km) se určí vzdálenost ohniska, zde asi 130 km.";

const W = 460;
const H = 512;
const PX = 214; // picture column
const PW = 238;

function RowText({ y, title, lines, tone }: { y: number; title: string; lines: string[]; tone: string }) {
  return (
    <g>
      <text x={8} y={y} className={`gz6-lbl gz6-b gz6-big ${tone}`}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={8} y={y + 19 + i * 17} className="gz6-lbl gz6-sm">
          {l}
        </text>
      ))}
    </g>
  );
}

function PWave({ top }: { top: number }) {
  const xs: number[] = [];
  for (let i = 0; i <= 21; i++) {
    const x0 = PX + 4 + i * 11;
    xs.push(x0 + 8.5 * Math.sin((2 * Math.PI * (x0 - PX)) / 78));
  }
  return (
    <g>
      <rect x={PX} y={top} width={PW} height={58} className="gz6-rock" opacity={0.6} />
      {xs.map((x, i) => (
        <path key={i} d={`M${f1(x)} ${top + 4} V${top + 54}`} className="gz6-o gz6-thin" />
      ))}
      <rect x={PX} y={top} width={PW} height={58} className="gz6-o" fill="none" />
      <Fade delay={0.4}>
        <text x={PX + 43} y={top + 72} textAnchor="middle" className="gz6-lbl gz6-sm">
          zhuštění
        </text>
        <text x={PX + 156} y={top + 72} textAnchor="middle" className="gz6-lbl gz6-sm">
          zředění
        </text>
      </Fade>
      <DrawArrow d={`M${PX + PW - 44} ${top + 72} h40`} delay={0.3} />
      <DrawArrow d={`M${PX + 103} ${top + 29} h28`} tone="red" both delay={0.5} className="gz6-vec" />
    </g>
  );
}

function SWave({ top }: { top: number }) {
  const cols: number[] = [];
  for (let x = PX + 6; x <= PX + PW - 6; x += 12) cols.push(x);
  const dyAt = (x: number) => 7 * Math.sin((2 * Math.PI * (x - PX)) / 80);
  const rows = [top + 14, top + 29, top + 44];
  return (
    <g>
      <rect x={PX} y={top} width={PW} height={58} className="gz6-rock" opacity={0.6} />
      {rows.map((ry) => {
        let d = "";
        for (let x = PX + 2; x <= PX + PW - 2; x += 4) d += `${d ? "L" : "M"}${x} ${f1(ry + dyAt(x))} `;
        return <path key={ry} d={d} className="gz6-o gz6-thin" />;
      })}
      {cols.map((x) => (
        <path key={x} d={`M${x} ${f1(rows[0] + dyAt(x) - 6)} V${f1(rows[2] + dyAt(x) + 6)}`} className="gz6-o gz6-thin gz6-faint" />
      ))}
      <rect x={PX} y={top} width={PW} height={58} className="gz6-o" fill="none" />
      <DrawArrow d={`M${PX + 124} ${top + 18} v24`} tone="red" both delay={0.7} className="gz6-vec" />
      <DrawArrow d={`M${PX + PW - 64} ${top + 72} h52`} delay={0.6} />
    </g>
  );
}

function Surface({ top }: { top: number }) {
  const { id } = useFig();
  const sy = (x: number) => top + 18 + 7 * Math.sin((2 * Math.PI * (x - PX)) / 92);
  let d = "";
  for (let x = PX; x <= PX + PW; x += 4) d += `${d ? "L" : "M"}${x} ${f1(sy(x))} `;
  const body = `${d} L${PX + PW} ${top + 58} H${PX} Z`;
  const hx = PX + 46;
  const tilt = (Math.atan2(sy(hx + 6) - sy(hx - 6), 12) * 180) / Math.PI;
  return (
    <g>
      <path d={body} className="gz6-soil" />
      <path d={body} fill={pat(id, "d")} opacity={0.6} />
      <path d={d} className="gz6-o" />
      <path d={`M${PX} ${top + 58} H${PX + PW}`} className="gz6-o gz6-thin" />
      {/* a house riding the wave */}
      <g transform={`translate(${hx} ${f1(sy(hx))}) rotate(${f1(tilt)})`}>
        <path d="M-9 0 V-13 L0 -21 L9 -13 V0 Z" className="gz6-fill gz6-o gz6-thin" />
        <rect x={-3} y={-8} width={6} height={8} className="gz6-o gz6-thin" fill="none" />
      </g>
      {/* rolling particle motion */}
      <ellipse cx={PX + 128} cy={top + 34} rx={11} ry={8} className="gz6-o gz6-red-s" fill="none" style={{ strokeWidth: 1.6 }} />
      <path d={`M${PX + 139} ${top + 33} l-3 -6 M${PX + 139} ${top + 33} l4 -5`} className="gz6-o gz6-red-s" style={{ strokeWidth: 1.6 }} />
      <DrawArrow d={`M${PX + PW - 64} ${top + 72} h52`} delay={0.9} />
    </g>
  );
}

// seismogram
const SX0 = 44;
const SX1 = 452;
const SY = 404;
const TMAX = 80;
const sx = (t: number) => SX0 + ((SX1 - SX0) * t) / TMAX;
const TP = 22;
const TS = 38;
const TR = 45;

function trace() {
  const R = rng(11);
  let d = "";
  for (let t = 0; t <= TMAX; t += 0.12) {
    let a = (R() - 0.5) * 1.6;
    if (t > TP) a += 7 * Math.exp(-(t - TP) / 6) * Math.sin(2 * Math.PI * 1.6 * (t - TP));
    if (t > TS) a += 17 * Math.exp(-(t - TS) / 7) * Math.sin(2 * Math.PI * 0.9 * (t - TS));
    if (t > TR) a += 40 * Math.min(1, (t - TR) / 4) * Math.exp(-(t - TR) / 12) * Math.sin(2 * Math.PI * 0.32 * (t - TR));
    a = Math.max(-46, Math.min(46, a));
    d += `${d ? "L" : "M"}${f1(sx(t))} ${f1(SY - a)} `;
  }
  return d;
}
const TRACE = trace();

function Seismogram() {
  return (
    <g>
      <text x={8} y={326} className="gz6-lbl gz6-b gz6-big">
        seismogram
      </text>
      <text x={8} y={344} className="gz6-lbl gz6-sm">
        záznam stanice ≈ 130 km od ohniska
      </text>
      <path d={`M${SX0} 352 V458 H${SX1}`} className="gz6-o" />
      <path d={`M${SX0} ${SY} H${SX1}`} className="gz6-grid" />
      {[0, 20, 40, 60, 80].map((t) => (
        <g key={t}>
          <path d={`M${f1(sx(t))} 458 v5`} className="gz6-o gz6-thin" />
          <text x={sx(t) + (t === 80 ? 6 : 0)} y={476} textAnchor={t === 80 ? "end" : "middle"} className="gz6-num" style={{ fontSize: 11 }}>
            {t === 80 ? "80 s" : t}
          </text>
        </g>
      ))}
      <Draw d={TRACE} className="gz6-curve gz6-curve-lvl" delay={0.6} style={{ strokeWidth: 1.3 }} />
      <Fade delay={1.6}>
        {(
          [
            [TP, "P"],
            [TS, "S"],
            [TR, "povrchové"],
          ] as [number, string][]
        ).map(([t, s]) => (
          <g key={s}>
            <path d={`M${f1(sx(t))} 356 V458`} className="gz6-o gz6-thin gz6-dash gz6-red-s" />
            <text x={sx(t) + (s === "povrchové" ? 4 : 0)} y={368} textAnchor={s === "povrchové" ? "start" : "middle"} className="gz6-eq gz6-b gz6-tone-red gz6-halo">
              {s}
            </text>
          </g>
        ))}
        <DrawArrow d={`M${f1(sx(TP))} 446 H${f1(sx(TS))}`} both delay={1.7} />
      </Fade>
      <Fade delay={1.9}>
        <text x={8} y={H - 18} className="gz6-lbl gz6-b">
          S − P = 16 s → ohnisko ≈ 130 km daleko
        </text>
        <text x={8} y={H - 2} className="gz6-lbl gz6-sm">
          každá sekunda rozdílu ≈ 8 km; ze tří stanic se určí epicentrum
        </text>
      </Fade>
    </g>
  );
}

function Plate() {
  return (
    <>
      <RowText y={24} title="vlny P" lines={["podélné, nejrychlejší", "≈ 6 km/s v zemské kůře", "projdou i kapalinou"]} tone="gz6-lvl-t" />
      <PWave top={10} />
      <RowText y={124} title="vlny S" lines={["příčné, pomalejší", "≈ 3,5 km/s", "kapalinou neprojdou"]} tone="gz6-lvl-t" />
      <SWave top={110} />
      <RowText y={224} title="povrchové vlny" lines={["po povrchu, nejpomalejší", "největší výchylky", "→ největší škody"]} tone="gz6-red-t" />
      <Surface top={210} />
      <Fade delay={0.2}>
        <text x={PX + PW} y={294} textAnchor="end" className="gz6-lbl gz6-sm gz6-muted-t">
          šipka: směr šíření · červeně: pohyb částic
        </text>
      </Fade>
      <Seismogram />
    </>
  );
}

export default function SeismicWaves() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} boost={false} replay>
      <Plate />
    </Figure>
  );
}
