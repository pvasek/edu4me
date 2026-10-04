import { Arrow, Draw, Fade, Figure, Pop, f1, pat, useFig, useLive } from "./kit";
import { House, T } from "./land";

const LABEL =
  "Zemětřesení v řezu zemskou kůrou. Na zlomu se dva bloky horniny zaklesnou, napětí roste, až se náhle posunou. Místo v hloubce, kde posun začal, je ohnisko neboli hypocentrum. Přímo nad ním na povrchu leží epicentrum, kde bývají otřesy nejsilnější. Z ohniska se do všech stran šíří seismické vlny. Seismická stanice je zaznamená seismografem: na seismogramu přijdou nejdřív rychlé vlny P, po nich vlny S a nakonec nejsilnější povrchové vlny.";

const W = 480;
const H = 470;
const S = 124; // surface
const G = 330; // bottom of the section
const FX = 250; // focus
const FY = 256;
// fault: from the surface down through the focus
const fault = (y: number) => FX + ((y - FY) * 62) / (FY - S);

/** seismogram: quiet → P → S → surface waves → decay */
function trace(x0: number, x1: number, y: number) {
  const pts: string[] = [];
  const n = 260;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    let a = 0.4 * Math.sin(i * 2.7);
    if (t > 0.16) a += 4 * Math.exp(-(t - 0.16) * 18) * Math.sin(i * 2.1);
    if (t > 0.36) a += 9 * Math.exp(-(t - 0.36) * 12) * Math.sin(i * 1.6);
    if (t > 0.56) a += 19 * Math.exp(-((t - 0.6) ** 2) * 60) * Math.sin(i * 0.9);
    pts.push(`${f1(x)} ${f1(y - a)}`);
  }
  return "M" + pts.join(" L");
}

function Waves() {
  const live = useLive();
  const rs = [34, 70, 106, 142, 178];
  return (
    <g>
      {rs.map((r, i) => (
        <circle key={r} cx={FX} cy={FY} r={r} className="gz2-wave" style={{ opacity: 1 - i * 0.14 }}>
          {live && (
            <>
              <animate attributeName="r" values={`${r};${r + 36}`} dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values={`${1 - i * 0.14};${0.86 - i * 0.14}`} dur="1.6s" repeatCount="indefinite" />
            </>
          )}
        </circle>
      ))}
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const clip = `${id}-crust`;
  const ix = 24;
  const iy = 372;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x={10} y={S} width={W - 20} height={G - S} />
        </clipPath>
      </defs>
      {/* crust: two blocks on either side of the fault */}
      <rect x={10} y={S} width={W - 20} height={G - S} className="gz2-crust" />
      <rect x={10} y={S} width={W - 20} height={G - S} fill={pat(id, "d")} opacity={0.35} />
      <g clipPath={`url(#${clip})`}>
        {[168, 214, 262, 304].map((y, i) => (
          <path key={y} d={`M10 ${y + (i % 2 ? 4 : -2)} H${f1(fault(y) - 1)} M${f1(fault(y) + 1)} ${y + (i % 2 ? -10 : -14)} H${W - 10}`} className="gz2-o gz2-thin" style={{ opacity: 0.3 }} />
        ))}
        <Waves />
      </g>
      <path d={`M10 ${S} H${W - 10} V${G} H10Z`} className="gz2-o" />
      <Draw d={`M${f1(fault(S))} ${S} L${f1(fault(G))} ${G}`} className="gz2-fault" delay={0.1} />
      {/* opposite motion on the two sides of the fault */}
      <Arrow d={`M${f1(fault(214) - 13)} 214 L${f1(fault(170) - 13)} 170`} tone="red" />
      <Arrow d={`M${f1(fault(282) + 13)} 282 L${f1(fault(326) + 13)} 326`} tone="red" />

      {/* focus → epicentre */}
      <path d={`M${FX} ${S} V${FY}`} className="gz2-o gz2-thin gz2-dash" />
      <Pop delay={0.4}>
        <path
          d={`M${FX} ${FY - 11} L${FX + 3.4} ${FY - 3.6} L${FX + 11} ${FY - 3.4} L${FX + 5} ${FY + 2} L${FX + 7} ${FY + 10} L${FX} ${FY + 5.6} L${FX - 7} ${FY + 10} L${FX - 5} ${FY + 2} L${FX - 11} ${FY - 3.4} L${FX - 3.4} ${FY - 3.6}Z`}
          className="gz2-quake gz2-o"
        />
      </Pop>
      <Pop delay={0.7}>
        <circle cx={FX} cy={S} r={7} className="gz2-lvl-f gz2-o" />
        <circle cx={FX} cy={S} r={2.2} className="gz2-fill" />
      </Pop>

      {/* surface: houses around the epicentre, station further away */}
      {[
        [196, -4],
        [218, 3],
        [282, -6],
        [306, 2],
        [124, 0],
        [94, 0],
      ].map(([x, t]) => (
        <House key={x} x={x} y={S} s={1.15} tilt={t} />
      ))}
      <g transform={`translate(424 ${S})`}>
        <path d="M-17 0 V-20 H17 V0Z" className="gz2-fill gz2-o" />
        <path d="M-17 -20 L0 -30 L17 -20" className="gz2-o" />
        <path d="M-9 -6 H9 M-9 -6 l3 -4 l3 7 l3 -9 l3 6 l3 -2" className="gz2-trace" />
        <path d="M8 -30 V-44 M4 -44 H12" className="gz2-o gz2-thin" />
      </g>

      <Fade delay={0.8}>
        <T x={FX} y={S - 46} cls="gz2-b gz2-lvl-t">epicentrum</T>
        <path d={`M${FX} ${S - 40} V${S - 10}`} className="gz2-lead" />
        <T x={FX + 18} y={FY + 6} a="start" cls="gz2-b gz2-red-t">ohnisko</T>
        <T x={FX + 18} y={FY + 24} a="start" cls="gz2-sm">(hypocentrum)</T>
        <T x={FX + 8} y={(S + FY) / 2 - 4} a="start" cls="gz2-sm">hloubka</T>
        <T x={FX + 8} y={(S + FY) / 2 + 12} a="start" cls="gz2-sm">ohniska</T>
        <T x={fault(S) - 6} y={S + 22} a="end" cls="gz2-red-t">zlom</T>
        <T x={384} y={176} cls="gz2-lvl-t">seismické vlny</T>
        <T x={424} y={S - 52} cls="gz2-sm">seismická stanice</T>
      </Fade>

      {/* seismogram */}
      <g>
        <rect x={ix - 8} y={iy - 26} width={W - 2 * ix + 16} height={92} rx={6} className="gz2-tag" />
        <text x={ix} y={iy - 8} className="gz2-lbl gz2-sm gz2-b">
          záznam seismografu (seismogram)
        </text>
        <path d={`M${ix} ${iy + 30} H${W - ix}`} className="gz2-grid" />
        <Draw d={trace(ix, W - ix, iy + 30)} className="gz2-trace" delay={0.9} />
        <Fade delay={1.6}>
          <T x={ix + (W - 2 * ix) * 0.16} y={iy + 60} cls="gz2-sm gz2-b">P</T>
          <T x={ix + (W - 2 * ix) * 0.36} y={iy + 60} cls="gz2-sm gz2-b">S</T>
          <T x={ix + (W - 2 * ix) * 0.66} y={iy + 60} cls="gz2-sm gz2-b">povrchové vlny</T>
          <T x={W - ix} y={iy - 8} a="end" cls="gz2-sm gz2-muted-t">čas →</T>
        </Fade>
      </g>
    </>
  );
}

export default function EarthquakeFocus() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
