import { GeoMap } from "../../../geo/GeoMap";
import type { MapHighlight, MapPoint, MapRoute } from "../../../core/types";
import "./gz4.css";

const LABEL =
  "Cesta chytrého telefonu kolem světa na mapě. Suroviny: kobalt z Demokratické republiky Kongo, měď a lithium z Chile. Součástky, například čipy a displeje, vyrábí Japonsko, Jižní Korea a Tchaj-wan. Telefony se skládají hlavně v Číně a v Indii. Navrhují se a prodávají hlavně v USA a v Evropě, kam hotové telefony letí letadlem.";

const HIGHLIGHT: MapHighlight[] = [
  { codes: ["COD", "CHL"], tone: "a", label: "suroviny: kobalt, měď, lithium" },
  { codes: ["JPN", "KOR", "TWN"], tone: "b", label: "součástky: čipy, displeje" },
  { codes: ["CHN", "IND"], tone: "c", label: "montáž telefonů" },
  {
    codes: ["USA", "DEU", "FRA", "GBR", "ITA", "ESP", "NLD", "BEL", "AUT", "CZE", "POL", "SWE", "IRL"],
    tone: "d",
    label: "návrh, značka a prodej",
  },
];

const P = {
  kongo: { lat: -11.7, lon: 27.5 },
  chile: { lat: -23.5, lon: -68.3 },
  tokio: { lat: 35.7, lon: 139.7 },
  soul: { lat: 37.6, lon: 127 },
  sencen: { lat: 22.5, lon: 114.1 },
  cennaj: { lat: 13, lon: 80 },
  kalifornie: { lat: 37.3, lon: -122 },
  praha: { lat: 50.1, lon: 14.4 },
};

const POINTS: MapPoint[] = [
  { ...P.kongo, label: "kobalt", kind: "place" },
  { ...P.chile, label: "lithium, měď", kind: "place" },
  { ...P.sencen, label: "Šen-čen", kind: "city" },
  { ...P.kalifornie, label: "Kalifornie", kind: "place" },
];

const ROUTES: MapRoute[] = [
  // raw materials by sea
  { points: [P.kongo, { lat: -6.8, lon: 39.3 }, { lat: 5, lon: 78 }, { lat: 5.5, lon: 95.5 }, { lat: 1.3, lon: 104 }, P.sencen], tone: "a", arrow: true },
  { points: [P.chile, { lat: -23.6, lon: -70.6 }, P.sencen], tone: "a", arrow: true },
  // components
  { points: [P.tokio, P.sencen], tone: "b", arrow: true },
  { points: [P.soul, P.sencen], tone: "b", arrow: true },
  // finished phones, mostly by air
  { points: [P.sencen, P.kalifornie], tone: "c", arrow: true, style: "dashed" },
  { points: [P.sencen, P.praha], tone: "c", arrow: true, style: "dashed" },
  { points: [P.cennaj, P.praha], tone: "c", arrow: true, style: "dashed" },
];

export default function SupplyChain() {
  return (
    <div className="gz4 gz4-l6">
      <GeoMap view="world" label={LABEL} highlight={HIGHLIGHT} points={POINTS} routes={ROUTES} />
      <p className="gz4-strip-note">
        plné šipky: suroviny a součástky do montáže · čárkované: hotové telefony k zákazníkům
      </p>
    </div>
  );
}
