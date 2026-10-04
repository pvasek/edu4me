import { useMemo } from "react";
import { StepStrip } from "../../sequence/StepFigure";
import type { GeoData } from "../../../geo/load";
import { makeProjection, type ProjectionKind } from "../../../geo/project";
import { Figure, Frame, StripBox, f1, useWorld } from "./kit";

const LABEL =
  "Grónsko a Afrika na dvou mapách světa z dat Natural Earth. Na Mercatorově mapě, která zvětšuje území směrem k pólům, vypadá Grónsko skoro stejně velké jako Afrika. Na plochojevné mapě (zobrazení Equal Earth), která zachovává poměry ploch, je vidět skutečnost: Grónsko má rozlohu asi 2,2 milionu km², Afrika asi 30,4 milionu km², je tedy asi 14krát větší.";

/** African states (Natural Earth ADM0_A3) */
const AFRICA = new Set(
  "DZA AGO BEN BWA BFA BDI CPV CMR CAF TCD COM COD COG CIV DJI EGY GNQ ERI SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR LBY MDG MWI MLI MRT MUS MAR MOZ NAM NER NGA RWA STP SEN SYC SLE SOM SOL ZAF SDS SDN TZA TGO TUN UGA ZMB ZWE SAH".split(" "),
);

const W = 320;
const S_LAT = -58; // south edge (Antarctica left out)
const N_LAT = 84;

interface Frame2 {
  kind: ProjectionKind;
  h: number;
  /** lon/lat → svg */
  xy: (lon: number, lat: number) => [number, number];
}

function frameOf(kind: ProjectionKind): Frame2 {
  const p = makeProjection({ kind, lon0: 0 });
  const [xr] = p.forward(180, 0);
  const yTop = p.forward(0, N_LAT)[1];
  const yBot = p.forward(0, S_LAT)[1];
  const pad = 6;
  const k = (W - 2 * pad) / (2 * xr);
  const h = (yTop - yBot) * k + 2 * pad;
  return {
    kind,
    h,
    xy: (lon, lat) => {
      const [x, y] = p.forward(lon, Math.max(S_LAT - 2, Math.min(N_LAT, lat)));
      return [W / 2 + x * k, pad + (yTop - y) * k];
    },
  };
}

function ringPath(fr: Frame2, ring: Float64Array) {
  let d = "";
  for (let i = 0; i < ring.length; i += 2) {
    const [x, y] = fr.xy(ring[i], ring[i + 1]);
    d += `${i ? "L" : "M"}${f1(x)} ${f1(y)}`;
  }
  return d + "Z";
}

function WorldMap({ kind, data }: { kind: ProjectionKind; data?: GeoData }) {
  const fr = useMemo(() => frameOf(kind), [kind]);
  const paths = useMemo(() => {
    if (!data) return null;
    let land = "";
    let grl = "";
    let afr = "";
    for (const [code, sh] of data.countries) {
      if (code === "ATA") continue;
      const d = sh.rings.map((r) => ringPath(fr, r)).join("");
      if (code === "GRL") grl += d;
      else if (AFRICA.has(code)) afr += d;
      else land += d;
    }
    return { land, grl, afr };
  }, [data, fr]);
  const H = Math.ceil(fr.h);
  // the outline of the map (sea)
  let sea = "";
  for (let lat = S_LAT; lat <= N_LAT; lat += 2) {
    const [x, y] = fr.xy(-180, lat);
    sea += `${sea ? "L" : "M"}${f1(x)} ${f1(y)}`;
  }
  for (let lat = N_LAT; lat >= S_LAT; lat -= 2) {
    const [x, y] = fr.xy(180, lat);
    sea += `L${f1(x)} ${f1(y)}`;
  }
  sea += "Z";
  const grid: string[] = [];
  for (let lat = -40; lat <= 80; lat += 20) {
    const [x0, y] = fr.xy(-180, lat);
    const [x1] = fr.xy(180, lat);
    if (kind === "mercator") grid.push(`M${f1(x0)} ${f1(y)} H${f1(x1)}`);
    else {
      let d = "";
      for (let lon = -180; lon <= 180; lon += 10) {
        const [x, yy] = fr.xy(lon, lat);
        d += `${d ? "L" : "M"}${f1(x)} ${f1(yy)}`;
      }
      grid.push(d);
    }
  }
  const g = fr.xy(-41, 74);
  const a = fr.xy(20, 4);
  const merc = kind === "mercator";
  return (
    <Frame w={W} h={H + 4} className="gz1-small">
      <path d={sea} className="gz1-sea" />
      {grid.map((d, i) => (
        <path key={i} d={d} className="gz1-grat" style={{ opacity: 0.35 }} />
      ))}
      {paths && (
        <g>
          <path d={paths.land} className="gz1-worldland" fillRule="evenodd" />
          <path d={paths.afr} className="gz1-afr" fillRule="evenodd" />
          <path d={paths.grl} className="gz1-grl" fillRule="evenodd" />
        </g>
      )}
      <path d={sea} className="gz1-o gz1-thin" />
      <text x={f1(g[0] + (merc ? 0 : -24))} y={f1(g[1] + (merc ? 6 : 12))} textAnchor={merc ? "middle" : "end"} className="gz1-lbl gz1-b gz1-sm gz1-halo">
        Grónsko
      </text>
      <text x={f1(a[0])} y={f1(a[1] + 4)} textAnchor="middle" className="gz1-lbl gz1-b gz1-sm gz1-halo">
        Afrika
      </text>
    </Frame>
  );
}

export default function MercatorSizes() {
  const data = useWorld();
  return (
    <Figure level={1} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL} note="Skutečné rozlohy: Grónsko 2,2 mil. km², Afrika 30,4 mil. km² – Afrika je asi 14× větší.">
        <StepStrip
          min={250}
          steps={[
            {
              title: "Mercatorovo zobrazení",
              art: <WorldMap kind="mercator" data={data} />,
              caption: "Úhly a tvary zachová, ale k pólům plochy zvětšuje: Grónsko vypadá velké jako Afrika.",
            },
            {
              title: "Plochojevné zobrazení",
              art: <WorldMap kind="equal-earth" data={data} />,
              caption: "Plochy jsou ve správném poměru: Grónsko je proti Africe malé.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
