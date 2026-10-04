import { Draw, DrawArrow, Fade, Figure, Pop, Sun, pat, useFig } from "./kit";

const LABEL =
  "Určení světových stran bez buzoly v Česku. Díváme se k jihu. Slunce vychází zhruba na východě, v poledne stojí nejvýš nad obzorem přesně na jihu a zapadá zhruba na západě. Stín svislé tyče v poledne ukazuje k severu. Pozor: mech na kmeni stromu roste tam, kde je vlhko a stín, ne vždy na severní straně, takže podle něj sever spolehlivě neurčíme.";

const W = 560;
const H = 470;
const HZ = 262; // horizon

function Plate() {
  const { id, narrow } = useFig();
  return (
    <>
      {/* sky and ground */}
      <rect x={0} y={0} width={W} height={HZ} className="gz1-air" />
      <path d={`M0 ${HZ} H${W} V${H} H0Z`} className="gz1-meadow" />
      <path d={`M0 ${HZ} C80 250 140 256 200 ${HZ} S330 248 400 258 S520 252 560 ${HZ}`} className="gz1-o gz1-thin" />
      {/* the Sun's path across the southern sky */}
      <Draw d={`M60 ${HZ} C120 40 440 40 500 ${HZ}`} className="gz1-o gz1-dash gz1-sunpath" delay={0.1} />
      <Pop delay={0.3}>
        <Sun x={78} y={226} r={13} />
      </Pop>
      <Pop delay={0.6}>
        <Sun x={280} y={98} r={19} />
      </Pop>
      <Pop delay={0.9}>
        <Sun x={482} y={226} r={13} />
      </Pop>
      {/* compass letters on the horizon */}
      {[
        [60, "V"],
        [280, "J"],
        [500, "Z"],
      ].map(([x, k]) => (
        <g key={k}>
          <path d={`M${x} ${HZ - 6} V${HZ + 6}`} className="gz1-o" />
          <text x={x} y={HZ + 26} textAnchor="middle" className="gz1-dir gz1-dir-main">
            {k}
          </text>
        </g>
      ))}
      <Fade delay={1.0}>
        <text x={74} y={194} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b">
          východ
        </text>
        <text x={486} y={194} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b">
          západ
        </text>
        <text x={280} y={42} textAnchor="middle" className="gz1-lbl gz1-b">
          v poledne: na jihu, nejvýš
        </text>
      </Fade>

      {/* the stick and its noon shadow (towards the viewer = north) */}
      <path d="M280 372 L268 446 L292 446Z" className="gz1-shadow" />
      <path d="M280 372 L268 446 L292 446Z" fill={pat(id, "sh")} />
      <path d="M280 300 V372" className="gz1-stick" />
      <DrawArrow d="M250 384 V444" tone="lvl" delay={1.2} />
      <Fade delay={1.3}>
        <text x={240} y={414} textAnchor="end" className="gz1-lbl gz1-b gz1-lvl-t">
          stín v poledne
        </text>
        <text x={240} y={434} textAnchor="end" className="gz1-lbl gz1-b gz1-lvl-t">
          ukazuje k severu
        </text>
        <text x={280} y={H - 4} textAnchor="middle" className="gz1-dir gz1-dir-main gz1-lvl-t">
          S
        </text>
      </Fade>

      {/* tree with moss: an unreliable sign */}
      <path d="M502 360 L496 448 H530 L522 360Z" className="gz1-bark gz1-o gz1-thin" />
      <ellipse cx={512} cy={334} rx={42} ry={36} className="gz1-forest gz1-o gz1-thin" />
      <path d="M502 392 q6 -10 10 0 q4 -8 8 2 v34 q-9 6 -18 0Z" className="gz1-moss" />
      <Fade delay={1.5}>
        <g transform="translate(472 412)">
          <circle r={12} className="gz1-tag" style={{ stroke: "var(--bad)", strokeWidth: 1.8 }} />
          <text y={6} textAnchor="middle" className="gz1-dir gz1-dir-main gz1-red-t">
            ?
          </text>
        </g>
        <text x={318} y={400} className="gz1-lbl gz1-sm">
          {narrow ? "mech: kde je" : "mech roste tam,"}
        </text>
        <text x={318} y={418} className="gz1-lbl gz1-sm">
          {narrow ? "vlhko a stín –" : "kde je vlhko a stín –"}
        </text>
        <text x={318} y={436} className="gz1-lbl gz1-sm gz1-red-t gz1-b">
          {narrow ? "sever neurčí" : "sever podle něj neurčíš"}
        </text>
      </Fade>
    </>
  );
}

export default function OrientationSun() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
