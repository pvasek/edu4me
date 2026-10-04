import { Draw, Fade, Figure, f1, pat, useFig } from "./kit";
import { DENISOVAN, LAND, LAT0, LAT1, LON0, LON1, NEANDERTAL, ROUTES, SEAS, type LL } from "./worldmap";

const LABEL =
  "Mapa šíření člověka rozumného z Afriky. Druh vznikl v Africe asi před 300 000 lety. Hlavní vlna opustila Afriku asi před 70 000–60 000 lety, do Austrálie dorazila asi před 50 000 lety, do Evropy asi před 45 000 lety, do východní Asie asi před 40 000 lety a přes Beringii do Ameriky před 20 000–15 000 lety. Šrafovaně jsou vyznačena území neandertálců (Evropa, Blízký východ, Střední Asie až po Altaj) a denisovanů (Altaj, Tibet, východní Asie). Křížky označují místa, kde se naši předkové s nimi křížili: s neandertálci na Blízkém východě, s denisovany ve východní a jihovýchodní Asii.";

const W = 620;
const MX = 10;
const MY = 24;
const K = 600 / (LON1 - LON0);
const MH = (LAT0 - LAT1) * K;
const H = MY + MH + 92;

const X = (lon: number) => MX + (lon - LON0) * K;
const Y = (lat: number) => MY + (LAT0 - lat) * K;
const poly = (pts: LL[]) => "M" + pts.map(([lo, la]) => `${f1(X(lo))} ${f1(Y(la))}`).join(" L") + "Z";

/** smooth open path through route points */
function route(pts: LL[]) {
  const P = pts.map(([lo, la]) => [X(lo), Y(la)]);
  let d = `M${f1(P[0][0])} ${f1(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

function Tag({ lon, lat, t, anchor = "middle", cls = "" }: { lon: number; lat: number; t: string; anchor?: "start" | "middle" | "end"; cls?: string }) {
  return (
    <text x={f1(X(lon))} y={f1(Y(lat))} textAnchor={anchor} className={`bz8-date bz8-halo ${cls}`}>
      {t}
    </text>
  );
}

function Cross({ lon, lat }: { lon: number; lat: number }) {
  const x = X(lon);
  const y = Y(lat);
  return (
    <g>
      <circle cx={f1(x)} cy={f1(y)} r={7} className="bz8-fill bz8-o bz8-thin" />
      <path d={`M${f1(x - 3.5)} ${f1(y - 3.5)} l7 7 m0 -7 l-7 7`} className="bz8-o" style={{ strokeWidth: 1.8 }} />
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const clip = `${id}-map`;
  const ly = MY + MH + 30;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x={MX} y={MY} width={600} height={MH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={MX} y={MY} width={600} height={MH} className="bz8-sea" />
        <rect x={MX} y={MY} width={600} height={MH} fill={pat(id, "h")} opacity={0.18} />
        {LAND.map((p, i) => (
          <path key={i} d={poly(p)} className="bz8-land bz8-o bz8-thin" />
        ))}
        {SEAS.map((p, i) => (
          <path key={`s${i}`} d={poly(p)} className="bz8-sea bz8-o bz8-thin" />
        ))}
        {/* archaic humans */}
        <path d={poly(NEANDERTAL)} className="bz8-nea" />
        <path d={poly(NEANDERTAL)} fill={pat(id, "d")} opacity={0.7} className="bz8-nea-h" />
        <path d={poly(NEANDERTAL)} className="bz8-nea-o" />
        <path d={poly(DENISOVAN)} className="bz8-den" />
        <path d={poly(DENISOVAN)} fill={pat(id, "b")} opacity={0.7} />
        <path d={poly(DENISOVAN)} className="bz8-den-o" />
      </g>
      <rect x={MX} y={MY} width={600} height={MH} rx={3} className="bz8-o" />

      {/* Homo sapiens */}
      <circle cx={X(36)} cy={Y(4)} r={6} className="bz8-lvl-f bz8-o bz8-thin" />
      {ROUTES.map((r, i) => (
        <Draw key={i} d={route(r)} className="bz8-route" delay={0.15 + i * 0.25} arrow="lvl" />
      ))}

      <Fade delay={1.2}>
        <Cross lon={44} lat={34} />
        <Cross lon={116} lat={4} />
        <Tag lon={18} lat={2} t="vznik" cls="bz8-b" />
        <Tag lon={18} lat={-8} t="300 tis." cls="bz8-b" />
        <Tag lon={55} lat={14} t="70–60 tis." anchor="start" />
        <Tag lon={-12} lat={46} t="45 tis." />
        <Tag lon={134} lat={-27} t="50 tis." />
        <Tag lon={131} lat={42} t="40 tis." anchor="start" />
        <Tag lon={258} lat={44} t="20–15 tis." />
        <Tag lon={60} lat={51} t="neandertálci" cls="bz8-nea-t" />
        <Tag lon={102} lat={33} t="denisované" cls="bz8-den-t" />
        <Tag lon={185} lat={58} t="Beringie" cls="bz8-sec bz8-muted-t" />
      </Fade>

      {/* legend */}
      <g>
        <path d={`M${MX + 4} ${ly - 5} h34`} className="bz8-route" markerEnd={pat(id, "ah-lvl")} />
        <text x={MX + 46} y={ly} className="bz8-lbl bz8-sm bz8-leg">
          šíření H. sapiens (před tis. let)
        </text>
        <rect x={MX + 330} y={ly - 13} width={30} height={14} className="bz8-nea" />
        <rect x={MX + 330} y={ly - 13} width={30} height={14} fill={pat(id, "d")} className="bz8-nea-o" />
        <text x={MX + 368} y={ly} className="bz8-lbl bz8-sm bz8-leg">
          neandertálci
        </text>
        <rect x={MX + 4} y={ly + 17} width={30} height={14} className="bz8-den" />
        <rect x={MX + 4} y={ly + 17} width={30} height={14} fill={pat(id, "b")} className="bz8-den-o" />
        <text x={MX + 46} y={ly + 30} className="bz8-lbl bz8-sm bz8-leg">
          denisované
        </text>
        <Cross lon={LON0 + (MX + 334 - MX) / K} lat={LAT0 - (ly + 25 - MY) / K} />
        <text x={MX + 368} y={ly + 30} className="bz8-lbl bz8-sm bz8-leg">
          křížení s našimi předky
        </text>
      </g>
    </>
  );
}

export default function HumanMigration() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={760} replay>
      <Plate />
    </Figure>
  );
}
