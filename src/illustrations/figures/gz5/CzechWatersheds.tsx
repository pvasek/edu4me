import { GeoMap } from "../../../geo/GeoMap";
import type { P2 } from "./kit";
import { Key, MapFig, MapText, flatPath, llPath, useGeoData, type LL } from "./mapkit";

const LABEL =
  "Mapa Česka se třemi úmořími. Řeky jsou obarvené podle moře, do kterého odtékají: Labe s Vltavou, Ohří a Sázavou do Severního moře, Odra a Lužická Nisa do Baltského moře, Morava s Dyjí, Svratkou a Svitavou přes Dunaj do Černého moře. Přerušovaná čára zjednodušeně ukazuje hlavní evropské rozvodí: vede po Šumavě, Českomoravské vrchovině, ke Králickému Sněžníku, odtud po Jeseníkách přes Moravskou bránu do Beskyd a na sever po Krkonoších a Jizerských horách. Úmoří se stýkají na hoře Klepý (1 145 m) u Králického Sněžníku, zvané Hora tří moří.";

type Sea = "n" | "b" | "c";
/** the sea each named river (Natural Earth, Czech names) finally drains to */
const SEA: Record<string, Sea> = {
  Labe: "n", Vltava: "n", "Ohře": "n", "Sázava": "n", "Úhlava": "n", "Sála": "n", "Spréva": "n",
  Mohan: "n", "Warme Steinach": "n", "Černý Halštrov": "n", "Bílý Halštrov": "n", "Cvikovská Mulda": "n",
  Unstruta: "n",
  Odra: "b", "Lužická Nisa": "b", "Kladská Nisa": "b", Visla: "b", Varta: "b", Bobr: "b", Prosna: "b",
  Dunaj: "c", Morava: "c", Dyje: "c", Svratka: "c", Svitava: "c", Inn: "c", Isara: "c", Traun: "c",
  Waldnaab: "c", "Váh": "c", Hron: "c", Ipel: "c",
};

// the main European watershed, simplified through known ridges and passes [lon, lat]
const KLEPY: LL = [16.84, 50.17];
/** Severní | Černé moře: Šumava → Novohradské hory → Českomoravská vrchovina → Klepý */
const NS_BS: LL[] = [
  [13.84, 48.77], [14.1, 48.66], [14.45, 48.6], [14.85, 48.74], [15.1, 48.98], [15.3, 49.2],
  [15.6, 49.52], [15.85, 49.53], [15.99, 49.6], [16.08, 49.76], [16.25, 49.78], [16.42, 49.83],
  [16.58, 49.96], [16.72, 50.08], KLEPY,
];
/** Baltské | Černé moře: Klepý → Hrubý Jeseník → Oderské vrchy → Moravská brána → Beskydy */
const BA_BS: LL[] = [
  KLEPY, [16.98, 50.14], [17.1, 50.08], [17.15, 50.0], [17.3, 49.88], [17.5, 49.76], [17.56, 49.68],
  [17.78, 49.57], [18.05, 49.5], [18.22, 49.48], [18.42, 49.42],
];
/** Severní | Baltské moře: Klepý → Orlické hory → Broumovsko → Krkonoše → Jizerské hory → Ještěd */
const NS_BA: LL[] = [
  KLEPY, [16.76, 50.12], [16.62, 50.11], [16.56, 50.2], [16.42, 50.3], [16.25, 50.45], [16.1, 50.58],
  [15.95, 50.69], [15.74, 50.74], [15.45, 50.78], [15.22, 50.8], [15.18, 50.71], [14.99, 50.73],
  [14.82, 50.8], [14.66, 50.85],
];

/**
 * Natural Earth's "Svitava" is really the Jihlava (Nové Mlýny → Třebíč → Jihlava) joined to a stray
 * line that runs on west into the Vltava basin; keep only the part east of `lon`.
 */
function eastOf(flat: Float64Array, lon: number): Float64Array {
  const out: number[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    if (flat[i] < lon) break;
    out.push(flat[i], flat[i + 1]);
  }
  return Float64Array.from(out);
}

function RiverKey({ sea }: { sea: Sea }) {
  return <path d="M2 7 Q10 2 17 7 T32 7" className={`gz5-riv gz5-riv-${sea}`} style={{ strokeWidth: 2.6 }} />;
}

export default function CzechWatersheds() {
  const data = useGeoData("czechia");
  return (
    <MapFig
      level={9}
      legend={
        <>
          <Key art={<RiverKey sea="n" />}>Severní moře</Key>
          <Key art={<RiverKey sea="b" />}>Baltské moře</Key>
          <Key art={<RiverKey sea="c" />}>Černé moře</Key>
          <Key art={<path d="M2 7 H32" className="gz5-divide" style={{ strokeWidth: 2 }} />}>rozvodí (zjednodušeně)</Key>
        </>
      }
    >
      <GeoMap
        view="czechia"
        label={LABEL}
        legend={false}
        points={[{ lat: KLEPY[1], lon: KLEPY[0], label: "Klepý 1 145 m", kind: "peak" }]}
      >
        {({ project, u }) => {
          const P = (ll: LL) => project(ll[0], ll[1]) as P2;
          const rivers = (data?.rivers ?? []).filter((r) => r.name && SEA[r.name]);
          const [nx, ny] = P([14.35, 49.75]);
          const [bx, by] = P([18.0, 50.56]);
          const [cx, cy] = P([16.95, 49.05]);
          return (
            <g>
              {rivers.map((r) => (
                <g key={r.name} className={`gz5-riv gz5-riv-${SEA[r.name]}`} style={{ strokeWidth: r.rank <= 5 ? 2.8 : r.rank <= 9 ? 2 : 1.4 }}>
                  {r.parts.map((part, i) => (
                    <path key={i} d={flatPath(project, r.name === "Svitava" ? eastOf(part, 15.5) : part)} />
                  ))}
                </g>
              ))}
              {[NS_BS, BA_BS, NS_BA].map((line, i) => (
                <path key={i} d={llPath(project, line)} className="gz5-divide" />
              ))}
              <MapText x={nx} y={ny} u={u} text={"úmoří\nSeverního moře"} size={15} className="gz5-mt-n" />
              <MapText x={bx} y={by} u={u} text={"úmoří\nBaltského moře"} size={13} className="gz5-mt-ba" />
              <MapText x={cx} y={cy} u={u} text={"úmoří\nČerného moře"} size={14} className="gz5-mt-c" />
            </g>
          );
        }}
      </GeoMap>
    </MapFig>
  );
}
