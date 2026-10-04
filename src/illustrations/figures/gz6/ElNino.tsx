import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Fade, Figure, Frame, pat, useFig, useLive } from "./kit";

const LABEL =
  "Řez rovníkovým Tichým oceánem od Indonésie a Austrálie na západě po Peru na východě, normální stav a El Niño. Normálně vanou silné pasáty od východu k západu a ženou teplou povrchovou vodu (asi 29 °C) k Indonésii; tam vzduch stoupá, tvoří se oblaka a vydatně prší. U Peru vystupuje z hloubky studená voda bohatá na živiny (upwelling), termoklina je mělko a vzduch nad studeným mořem klesá, takže je tam sucho. Při El Niñu pasáty zeslábnou, teplá voda se přelije na východ, termoklina se vyrovná a upwelling u Peru slábne: déšť a záplavy se přesunou do Peru, v Indonésii a Austrálii nastává sucho a požáry.";

const W = 440;
const H = 262;
const SEA = 128;
const BOT = 246;

function Rain({ x, n = 6 }: { x: number; n?: number }) {
  const live = useLive();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <path
          key={i}
          d={`M${x - 26 + i * 10} ${70 + (i % 2) * 8} l-3 10 M${x - 30 + i * 10} ${94 + (i % 2) * 6} l-3 10`}
          className={`gz6-arr gz6-arr-blue ${live ? "gz6-fall" : ""}`}
          style={{ strokeWidth: 1.3, animationDelay: `${(i % 3) * -0.6}s`, ["--fall" as string]: "10px" }}
        />
      ))}
    </g>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-40 14 Q-52 12 -48 2 Q-44 -8 -32 -6 Q-28 -22 -10 -18 Q2 -30 18 -20 Q34 -24 38 -8 Q52 -6 48 6 Q46 14 36 14 Z"
      className="gz6-cloud gz6-o"
    />
  );
}

function Panel({ nino }: { nino: boolean }) {
  const { id } = useFig();
  // thermocline: deep in the west, shallow in the east (normal) / nearly flat (El Niño)
  const thermo = nino ? `M44 186 C150 182 290 176 396 168` : `M44 208 C150 200 300 160 386 129`;
  const warmBody = nino
    ? `M44 ${SEA} H396 V168 C290 176 150 182 44 186 Z`
    : `M44 ${SEA} H386 C300 160 150 200 44 208 Z`;
  const riseX = nino ? 320 : 96;
  const sinkX = nino ? 96 : 352;
  return (
    <>
      <rect x={0} y={0} width={W} height={SEA} className="gz6-air" />
      {/* ocean */}
      <rect x={44} y={SEA} width={352} height={BOT - SEA} className="gz6-cold" />
      <path d={warmBody} className="gz6-warm" />
      <rect x={44} y={SEA} width={352} height={BOT - SEA} fill={pat(id, "h")} opacity={0.6} />
      <path d={thermo} className="gz6-o gz6-dash" style={{ strokeWidth: 1.6 }} />
      <path d={`M44 ${SEA} H396`} className="gz6-o" />
      {/* land: Indonesia / Australia (west), South America with the Andes (east) */}
      <path d={`M0 ${BOT} V${SEA - 8} Q20 ${SEA - 16} 46 ${SEA - 4} L44 ${BOT} Z`} className="gz6-land gz6-o" />
      <path d={`M396 ${BOT} L396 ${SEA - 2} Q404 ${SEA - 10} 412 ${SEA - 22} L424 ${SEA - 62} L432 ${SEA - 40} L440 ${SEA - 50} V${BOT} Z`} className="gz6-land gz6-o" />
      <path d={`M0 ${BOT} H${W}`} className="gz6-o gz6-thin" />

      {/* Walker circulation */}
      <Fade delay={0.1}>
        <Cloud x={riseX} y={48} s={nino ? 0.95 : 1.05} />
        <Rain x={riseX} />
      </Fade>
      <DrawArrow d={`M${riseX} 104 V64`} tone="ink" delay={0.3} />
      <DrawArrow d={nino ? `M${riseX - 40} 22 H${sinkX + 10}` : `M${riseX + 44} 22 H${sinkX - 10}`} tone="ink" delay={0.5} />
      <DrawArrow d={`M${sinkX} 32 V96`} tone="ink" delay={0.7} />
      {/* trade winds at the surface */}
      {nino ? (
        <>
          <DrawArrow d="M390 116 H352" tone="lvl" delay={0.9} />
          <DrawArrow d="M128 116 H180" tone="lvl" delay={1.0} />
        </>
      ) : (
        <>
          <DrawArrow d="M374 114 H150" tone="lvl" delay={0.9} className="gz6-vec" />
        </>
      )}
      <Fade delay={1.1}>
        <text x={nino ? 240 : 262} y={nino ? 112 : 106} textAnchor="middle" className="gz6-lbl gz6-b gz6-lvl-t gz6-halo">
          {nino ? "slabé pasáty" : "silné pasáty"}
        </text>
        <text x={sinkX} y={70} textAnchor="middle" className="gz6-lbl gz6-sm gz6-halo" transform={`translate(${sinkX < 200 ? 26 : -30} 0)`}>
          sucho
        </text>
        <text x={riseX + 36} y={92} textAnchor="start" className="gz6-lbl gz6-sm gz6-blue-t gz6-halo">
          déšť
        </text>
      </Fade>

      {/* upwelling */}
      {nino ? (
        <DrawArrow d="M386 200 V180" tone="blue" delay={1.2} />
      ) : (
        <>
          <DrawArrow d="M386 232 C386 200 386 170 384 140" tone="blue" delay={1.2} className="gz6-vec" />
          <DrawArrow d="M366 236 C368 200 370 176 366 150" tone="blue" delay={1.3} />
        </>
      )}
      <Fade delay={1.3}>
        <text x={nino ? 220 : 132} y={nino ? 152 : 160} textAnchor="middle" className="gz6-lbl gz6-b">
          {nino ? "teplá voda až k Peru" : "teplá voda ≈ 29 °C"}
        </text>
        <text x={nino ? 200 : 214} y={nino ? 224 : 228} textAnchor="middle" className="gz6-lbl gz6-b gz6-blue-t">
          studená voda
        </text>
        <text x={58} y={BOT - 6} className="gz6-lbl gz6-sm">
          termoklina
        </text>
        <path d={nino ? "M80 232 L92 188" : "M80 232 L90 207"} className="gz6-lead" />
      </Fade>
      <Fade delay={1.5}>
        {!nino && (
          <text x={360} y={BOT - 6} textAnchor="end" className="gz6-lbl gz6-sm gz6-blue-t gz6-halo">
            upwelling
          </text>
        )}
      </Fade>
      {/* place names */}
      <text x={2} y={SEA - 30} className="gz6-lbl gz6-sm gz6-b">
        Indonésie,
      </text>
      <text x={2} y={SEA - 14} className="gz6-lbl gz6-sm gz6-b">
        Austrálie
      </text>
      <text x={W - 2} y={SEA - 72} textAnchor="end" className="gz6-lbl gz6-sm gz6-b">
        Peru
      </text>
      <text x={W / 2} y={BOT + 14} textAnchor="middle" className="gz6-lbl gz6-sm gz6-muted-t">
        západ ← rovníkový Tichý oceán → východ
      </text>
    </>
  );
}

export default function ElNino() {
  return (
    <Figure label={LABEL} interactive max={760}>
      <div role="img" aria-label={LABEL}>
        <StepStrip
          min={300}
          steps={[
            {
              title: "Normální stav",
              caption:
                "Silné pasáty ženou teplou vodu na západ: u Indonésie prší, u Peru vystupuje studená voda bohatá na živiny.",
              art: (
                <Frame w={W} h={H} className="gz6-xl">
                  <Panel nino={false} />
                </Frame>
              ),
            },
            {
              title: "El Niño",
              caption:
                "Pasáty zeslábnou a teplá voda se přelije na východ: v Peru prší a ubývá ryb, Indonésii a Austrálii sužuje sucho.",
              art: (
                <Frame w={W} h={H} className="gz6-xl">
                  <Panel nino />
                </Frame>
              ),
            },
          ]}
        />
      </div>
    </Figure>
  );
}
