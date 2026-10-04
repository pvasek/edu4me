import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, Lbl, f1, pat, useFig } from "./kit";

const LABEL =
  "Arktida a Antarktida v řezu ve stejném měřítku. Arktida je zamrzlý oceán: Severní ledový oceán hluboký kolem 4 km pokrývá jen tenký mořský led silný 1 až 4 m a kolem leží pevniny Eurasie, Severní Ameriky a Grónsko. Severní pól leží na plovoucím ledu nad mořem. Antarktida je světadíl pokrytý ledovcovým štítem silným průměrně asi 2 km a místy přes 4 km, kolem ní je Jižní oceán. Jižní pól leží na ledu ve výšce 2 835 m n. m.";

const W = 320;
const H = 200;
const SEA = 98;
const KM = 17; // px per km (vertical exaggeration)
const ky = (km: number) => SEA - km * KM;

function Ocean({ x0, x1, bottom }: { x0: number; x1: number; bottom: string }) {
  const { id } = useFig();
  const d = `M${x0} ${SEA} H${x1} ${bottom} Z`;
  return (
    <>
      <path d={d} className="gz4-sea-d" />
      <path d={d} fill={pat(id, "h")} opacity={0.5} />
    </>
  );
}

function Arctic() {
  const { id } = useFig();
  // land and seabed: Eurasia (left), the deep basin under the pole (~4 km), Greenland (right)
  const bed = `M4 ${ky(0.3)} L40 ${ky(0.25)} L54 ${SEA} L60 ${ky(-0.3)} Q80 ${ky(-2)} 110 ${ky(-3.8)} Q160 ${ky(-4.4)} 210 ${ky(-3.9)} Q240 ${ky(-2.5)} 262 ${ky(-0.4)} L270 ${SEA} L276 ${ky(0.4)} L${W - 4} ${ky(0.4)}`;
  const rock = `${bed} V${H - 4} H4 Z`;
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={SEA - 4} className="gz4-mt-sky" />
      <Ocean x0={4} x1={W - 4} bottom={`V${H - 4} H4`} />
      <path d={rock} className="gz4-rock" />
      <path d={rock} fill={pat(id, "d")} opacity={0.5} />
      <path d={`M4 ${ky(0.3)} L40 ${ky(0.25)} L54 ${SEA} H4 Z`} className="gz4-grass" />
      <path d={bed} className="gz4-o" />
      {/* Greenland ice sheet (≈ 3 km) */}
      <path d={`M276 ${ky(0.4)} Q286 ${ky(2.4)} ${W - 4} ${ky(3)} V${ky(0.4)} Z`} className="gz4-ice gz4-o gz4-thin" />
      {/* thin floating sea ice (drawn thicker than real) */}
      <rect x={60} y={SEA - 2} width={206} height={5} className="gz4-snow gz4-o gz4-thin" />
      <path d={`M${W / 2 - 4} ${SEA - 3} V${SEA - 30}`} className="gz4-o" />
      <path d={`M${W / 2 - 4} ${SEA - 30} l14 4 l-14 4`} className="gz4-pc-flag gz4-o gz4-thin" />
      <Lbl x={W / 2 + 14} y={SEA - 36} className="gz4-sm gz4-b">
        severní pól
      </Lbl>
      <Lbl x={W / 2} y={SEA + 22} anchor="middle" className="gz4-sm gz4-b gz4-light-t">
        mořský led 1–4 m
      </Lbl>
      <Lbl x={W / 2} y={ky(-2.6)} anchor="middle" className="gz4-sm gz4-light-t">
        Severní ledový oceán
      </Lbl>
      <Lbl x={W / 2} y={ky(-2.6) + 16} anchor="middle" className="gz4-sm gz4-light-t">
        ≈ 4 km hluboký
      </Lbl>
      <Lbl x={8} y={SEA - 22} className="gz4-sm">
        Eurasie
      </Lbl>
      <Lbl x={W - 8} y={22} anchor="end" className="gz4-sm">
        Grónsko
      </Lbl>
    </Frame>
  );
}

function Antarctic() {
  const { id } = useFig();
  // bedrock under the ice: partly below sea level (West Antarctica)
  const BR: [number, number][] = [
    [64, -0.6], [82, -0.1], [100, 0.4], [120, 0.5], [140, 0.1], [160, -0.4], [184, -0.9], [208, -1.1], [230, -0.3], [252, -0.5],
  ];
  const br = BR.map(([x, km]) => `${x} ${f1(ky(km))}`);
  const seabed = `M4 ${f1(ky(-3.6))} Q40 ${f1(ky(-3.4))} 56 ${f1(ky(-1.2))} L${br.join(" L")} L262 ${f1(ky(-1.2))} Q280 ${f1(ky(-3.4))} ${W - 4} ${f1(ky(-3.6))}`;
  const rock = `${seabed} V${H - 4} H4 Z`;
  // ice sheet: dome ≈ 4 km, the pole lower on its flank at 2 835 m; floating ice shelves at both coasts
  const ice = `M42 ${SEA - 2} L64 ${SEA - 3} Q78 ${f1(ky(2))} 110 ${f1(ky(3.4))} Q130 ${f1(ky(3.9))} 160 ${f1(ky(3))} Q200 ${f1(ky(2.3))} 248 ${f1(ky(0.3))} L274 ${SEA - 2} V${SEA + 5} H254 L${[...br].reverse().join(" L")} L60 ${SEA + 5} H42 Z`;
  return (
    <Frame w={W} h={H}>
      <rect x={4} y={4} width={W - 8} height={SEA - 4} className="gz4-mt-sky" />
      <Ocean x0={4} x1={W - 4} bottom={`V${H - 4} H4`} />
      <path d={rock} className="gz4-rock" />
      <path d={rock} fill={pat(id, "d")} opacity={0.5} />
      <path d={seabed} className="gz4-o" />
      <path d={ice} className="gz4-ice" />
      <path d={ice} fill={pat(id, "b")} opacity={0.35} />
      <path d={ice} className="gz4-o" />
      {/* the pole */}
      <path d={`M170 ${f1(ky(2.81))} V${f1(ky(2.81) - 24)}`} className="gz4-o" />
      <path d={`M170 ${f1(ky(2.81) - 24)} l14 4 l-14 4`} className="gz4-pc-flag gz4-o gz4-thin" />
      <Lbl x={188} y={ky(2.81) - 24} className="gz4-sm gz4-b">
        jižní pól 2 835 m
      </Lbl>
      <Lbl x={W / 2} y={ky(1.6)} anchor="middle" className="gz4-sm gz4-b">
        ledovcový štít
      </Lbl>
      <Lbl x={W / 2} y={ky(1.6) + 16} anchor="middle" className="gz4-sm">
        ≈ 2 km, místy přes 4 km
      </Lbl>
      <Lbl x={W / 2} y={ky(-2.4)} anchor="middle" className="gz4-sm gz4-b gz4-halo">
        skalní podloží
      </Lbl>
      <Lbl x={8} y={SEA + 20} className="gz4-sm gz4-light-t">
        Jižní
      </Lbl>
      <Lbl x={8} y={SEA + 35} className="gz4-sm gz4-light-t">
        oceán
      </Lbl>
      <Lbl x={8} y={SEA - 34} className="gz4-sm" tx={50} ty={SEA - 2}>
        šelfový ledovec
      </Lbl>
    </Frame>
  );
}

export default function PolarCompare() {
  return (
    <Figure level={7} label={LABEL} max={900} interactive boost={false}>
      <div className="gz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={280}
          steps={[
            { title: "Arktida: zamrzlý oceán", art: <Arctic />, caption: "Tenký mořský led plave na oceánu, kolem leží pevniny." },
            { title: "Antarktida: zaledněný světadíl", art: <Antarctic />, caption: "Silný ledovcový štít leží na pevnině, kolem je oceán." },
          ]}
        />
        <p className="gz4-strip-note">Oba řezy ve stejném měřítku, výšky a hloubky jsou zveličené.</p>
      </div>
    </Figure>
  );
}
