import { Fade, FadePath, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Druhy oblaků podle výšky. Nízká oblaka do 2 km: sloha (stratus) je šedá souvislá vrstva, ze které nanejvýš mrholí, kupa (cumulus) má plochou základnu a nadýchaný vrchol – oblak pěkného počasí. Střední oblaka ve 2–6 km: vyvýšená kupa (altocumulus) tvoří řady malých obláčků. Vysoká oblaka nad 6 km: řasa (cirrus) jsou tenká vlákna z ledových krystalků. Bouřkový oblak (kumulonimbus) roste od 1 km až k tropopauze v asi 11 km, kde se rozlije do kovadliny; přináší přívalový déšť, kroupy a blesky.";

const W = 520;
const H = 452;
const y = (km: number) => 430 - km * 30;
const AX = 46;

/** a row of rounded puffs along a flat base */
function puffs(x: number, base: number, ws: number[], hs: number[]) {
  let d = `M${x} ${base}`;
  let cx = x;
  ws.forEach((w, i) => {
    d += ` a${w / 2} ${hs[i]} 0 0 1 ${w} 0`;
    cx += w;
  });
  return d + ` Z`;
}

const CB_BODY =
  "M392 400 C380 384 380 362 394 352 C382 330 390 306 408 298 C398 270 408 242 424 232 C416 204 424 176 432 156 C424 142 384 134 338 122 C356 108 420 99 470 99 C498 99 516 101 518 107 C512 116 494 122 478 130 C488 152 494 176 484 196 C500 214 504 246 492 262 C508 280 508 312 494 326 C508 344 506 380 492 400 Z";

function Plate() {
  const { id } = useFig();
  return (
    <>
      <Fade>
        <rect x={AX} y={y(12)} width={W - AX - 4} height={y(0) - y(12)} className="gz3-sky" />
        {[2, 6].map((km) => (
          <path key={km} d={`M${AX} ${y(km)} H372`} className="gz3-o gz3-dash gz3-thin" />
        ))}
        <path d={`M${AX} ${y(11)} H${W - 4}`} className="gz3-o gz3-dot2 gz3-thin" />
        {/* ground with low hills */}
        <path
          d={`M${AX} ${y(0)} Q120 ${y(0.6)} 170 ${y(0.1)} Q220 ${y(0)} 260 ${y(0)} H${W - 4} V${H - 6} H${AX} Z`}
          className="gz3-o gz3-grass"
        />
      </Fade>

      {/* axis */}
      <path d={`M${AX} ${y(0)} V${y(12) - 6}`} className="gz3-o" />
      {[0, 2, 4, 6, 8, 10, 12].map((km) => (
        <g key={km}>
          <path d={`M${AX - 5} ${y(km)} h5`} className="gz3-o gz3-thin" />
          <text x={AX - 8} y={y(km) + 4.5} textAnchor="end" className="gz3-num">
            {km}
          </text>
        </g>
      ))}
      <text x={AX - 8} y={y(12) - 12} textAnchor="end" className="gz3-num">
        km
      </text>

      {/* bands (rotated) */}
      <Fade delay={0.2}>
        {[
          { a: 0, b: 2, t: "nízká" },
          { a: 2, b: 6, t: "střední" },
          { a: 6, b: 12, t: "vysoká" },
        ].map((band) => {
          const m = (y(band.a) + y(band.b)) / 2;
          return (
            <g key={band.t}>
              <path
                d={`M${AX + 10} ${y(band.a) - 4} h-3 V${y(band.b) + 4} h3`}
                className="gz3-o gz3-lvl-s gz3-thin"
              />
              <text
                x={AX + 22}
                y={m}
                textAnchor="middle"
                transform={`rotate(-90 ${AX + 22} ${m})`}
                className="gz3-lbl gz3-b gz3-lvl-t"
              >
                {band.t}
              </text>
            </g>
          );
        })}
      </Fade>

      {/* cirrus – řasa */}
      <Pop delay={0.3}>
        <g className="gz3-cirrus">
          {[0, 1, 2, 3].map((k) => (
            <path
              key={k}
              d={`M${96 + k * 36} ${y(9.2) + (k % 2) * 10} q22 -2 34 -14 q4 -4 10 -4`}
            />
          ))}
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${112 + k * 40} ${y(8.6) + (k % 2) * 6} q18 0 30 -10`} />
          ))}
        </g>
      </Pop>

      {/* altocumulus – vyvýšená kupa */}
      <Pop delay={0.45}>
        {[0, 1, 2, 3, 4].map((k) => (
          <path
            key={k}
            d={puffs(96 + k * 34, y(4.8) + (k % 2) * 6, [10, 12, 8], [6, 9, 5])}
            className="gz3-o gz3-cloud gz3-thin"
          />
        ))}
        {[0, 1, 2, 3].map((k) => (
          <path
            key={k}
            d={puffs(112 + k * 34, y(4.3) + (k % 2) * 5, [9, 11, 8], [5, 8, 5])}
            className="gz3-o gz3-cloud gz3-thin"
          />
        ))}
      </Pop>

      {/* stratus – sloha */}
      <Pop delay={0.55}>
        <path
          d={`M84 ${y(0.95)} Q140 ${y(1.15)} 214 ${y(0.95)} Q222 ${y(0.75)} 210 ${y(0.6)} Q150 ${y(0.5)} 88 ${y(0.6)} Q78 ${y(0.75)} 84 ${y(0.95)} Z`}
          className="gz3-o gz3-cloud-d"
        />
        <path
          d={`M84 ${y(0.95)} Q140 ${y(1.15)} 214 ${y(0.95)} Q222 ${y(0.75)} 210 ${y(0.6)} Q150 ${y(0.5)} 88 ${y(0.6)} Q78 ${y(0.75)} 84 ${y(0.95)} Z`}
          fill={pat(id, "h")}
          className="gz3-nohit"
        />
      </Pop>

      {/* cumulus – kupa */}
      <Pop delay={0.65}>
        <path
          d={`M236 ${y(1.2)} C226 ${y(1.4)} 232 ${y(1.8)} 246 ${y(1.75)} C246 ${y(2.3)} 268 ${y(2.5)} 278 ${y(2.15)} C290 ${y(2.55)} 314 ${y(2.3)} 308 ${y(1.85)} C322 ${y(1.8)} 324 ${y(1.35)} 312 ${y(1.2)} Z`}
          className="gz3-o gz3-cloud"
        />
        <path d={`M240 ${y(1.2)} H310`} className="gz3-o gz3-thin" />
      </Pop>

      {/* cumulonimbus */}
      <Pop delay={0.8}>
                <path d={CB_BODY} className="gz3-o gz3-cloud-d" />
        <path d={CB_BODY} fill={pat(id, "d")} opacity={0.5} className="gz3-nohit" />
        <path d="M384 400 H490" className="gz3-o" />
        {/* rain */}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${394 + i * 11} ${404 + (i % 2) * 4} l-4 ${16 - (i % 3) * 3}`} className="gz3-rain-s" />
        ))}
        <path d="M452 360 l-10 22 h10 l-8 22" className="gz3-bolt" />
      </Pop>
      <FadePath d={`M${AX} ${y(11)} H${W - 4}`} className="gz3-o gz3-thin gz3-dot2" delay={0.2} />

      {/* labels */}
      <Fade delay={1}>
        <Lbl x={100} y={y(9.2) + 40} className="gz3-b">
          řasa
        </Lbl>
        <Lbl x={140} y={y(9.2) + 40} className="gz3-sm">
          (cirrus)
        </Lbl>
        <Lbl x={92} y={y(4.3) + 34} className="gz3-b">
          vyvýšená kupa
        </Lbl>
        <Lbl x={92} y={y(4.3) + 51} className="gz3-sm">
          (altocumulus)
        </Lbl>
        <Lbl x={246} y={y(0.45)} className="gz3-b">
          kupa
        </Lbl>
        <Lbl x={286} y={y(0.45)} className="gz3-sm">
          (cumulus)
        </Lbl>
        <Lbl x={92} y={y(1.25)} className="gz3-b">
          sloha
        </Lbl>
        <Lbl x={140} y={y(1.25)} className="gz3-sm">
          (stratus)
        </Lbl>
        <Lbl x={372} y={y(8.2)} anchor="end" className="gz3-b">
          bouřkový oblak
        </Lbl>
        <Lbl x={372} y={y(8.2) + 17} anchor="end" className="gz3-sm">
          (kumulonimbus)
        </Lbl>
        <Lbl x={372} y={y(8.2) + 34} anchor="end" className="gz3-sm gz3-sec">
          od 1 km až k 11 km
        </Lbl>
        <Lbl x={334} y={y(11) - 14} anchor="end" className="gz3-sm" tx={360} ty={y(11) + 2}>
          kovadlina
        </Lbl>
        <Lbl x={96} y={y(11) - 6} className="gz3-sm gz3-muted-t gz3-sec">
          tropopauza
        </Lbl>
      </Fade>
    </>
  );
}

export default function CloudTypes() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
