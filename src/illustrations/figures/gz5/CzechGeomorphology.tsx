import { GeoMap } from "../../../geo/GeoMap";
import type { P2 } from "./kit";
import { Key, MapFig, MapText, llPath, type LL } from "./mapkit";

const LABEL =
  "Mapa Česka se dvěma hlavními horopisnými jednotkami. Většinu území zabírá Český masiv: staré pohoří vyvrásněné v prvohorách a od té doby obroušené na zaoblené hřbety a plošiny – Krušné hory, Šumava, Brdy, Krkonoše se Sněžkou (1 603 m), Jeseníky, Českomoravská vrchovina a nížina Polabí. Na východě Moravy a ve Slezsku leží mladé Západní Karpaty, vyvrásněné ve třetihorách, s ostřejšími hřbety – Beskydy s Lysou horou (1 323 m), Bílé Karpaty a Chřiby. Přerušovaná čára zjednodušeně ukazuje hranici mezi nimi: od Znojma přes Brno, Prostějov a Moravskou bránu k Ostravě. Dolnomoravský úval na jihu patří k Vídeňské pánvi.";

/** boundary Český masiv | Západní Karpaty, simplified through real places [lon, lat] */
const EDGE: LL[] = [
  [16.02, 48.76], [16.12, 48.88], [16.33, 49.05], [16.58, 49.19], [16.85, 49.3], [17.06, 49.46],
  [17.22, 49.6], [17.48, 49.58], [17.72, 49.6], [17.98, 49.76], [18.18, 49.88], [18.34, 49.95],
];

type Unit = { ll: LL; name: string; side: "m" | "k"; size?: number };
const UNITS: Unit[] = [
  { ll: [13.12, 50.5], name: "Krušné hory", side: "m" },
  { ll: [13.62, 48.98], name: "Šumava", side: "m" },
  { ll: [13.88, 49.7], name: "Brdy", side: "m" },
  { ll: [15.0, 50.18], name: "Polabí", side: "m" },
  { ll: [15.78, 49.58], name: "Českomoravská\nvrchovina", side: "m" },
  { ll: [17.18, 50.12], name: "Jeseníky", side: "m" },
  { ll: [18.3, 49.43], name: "Beskydy", side: "k" },
  { ll: [18.02, 49.1], name: "Bílé\nKarpaty", side: "k", size: 12.5 },
  { ll: [17.28, 49.12], name: "Chřiby", side: "k", size: 12.5 },
  { ll: [16.88, 48.77], name: "Dolnomoravský\núval", side: "k", size: 12 },
];

export default function CzechGeomorphology() {
  return (
    <MapFig
      level={9}
      legend={
        <>
          <Key art={<rect x={4} y={2} width={26} height={10} rx={2} className="gz5-sw-m" />}>Český masiv – staré, zarovnané</Key>
          <Key art={<rect x={4} y={2} width={26} height={10} rx={2} className="gz5-sw-k" />}>Západní Karpaty – mladé, vrásněné</Key>
          <Key art={<path d="M2 7 H32" className="gz5-divide" style={{ strokeWidth: 2 }} />}>hranice (zjednodušeně)</Key>
        </>
      }
      note="Dolnomoravský úval patří k Vídeňské pánvi, ne ke Karpatům."
    >
      <GeoMap
        view="czechia"
        label={LABEL}
        legend={false}
        points={[
          { lat: 50.736, lon: 15.74, label: "Sněžka 1 603 m", kind: "peak" },
          { lat: 49.546, lon: 18.448, kind: "peak" },
        ]}
      >
        {({ project, u }) => {
          const P = (ll: LL) => project(ll[0], ll[1]) as P2;
          const [mx, my] = P([14.05, 49.3]);
          const [kx, ky] = P([18.3, 48.74]);
          return (
            <g>
              <path d={llPath(project, EDGE)} className="gz5-divide" />
              <MapText x={mx} y={my} u={u} text="ČESKÝ MASIV" size={14} className="gz5-mt-caps gz5-mt-m" />
              {/* on a phone the legend names the Carpathians; there is no room for the caps label */}
              {u < 2 && <MapText x={kx} y={ky} u={u} text={"ZÁPADNÍ\nKARPATY"} size={12} className="gz5-mt-caps gz5-mt-k" />}
              {UNITS.map((t) => {
                const [x, y] = P(t.ll);
                return <MapText key={t.name} x={x} y={y} u={u} text={t.name} size={t.size ?? 13.5} className={t.side === "m" ? "gz5-mt-m" : "gz5-mt-k"} />;
              })}
            </g>
          );
        }}
      </GeoMap>
    </MapFig>
  );
}
