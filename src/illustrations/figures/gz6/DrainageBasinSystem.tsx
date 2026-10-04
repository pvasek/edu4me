import { DrawArrow, Fade, Figure, f1, pat, useFig, useLive } from "./kit";

const LABEL =
  "Povodí jako systém v řezu svahem k řece. Vstupem jsou srážky. Část vody zachytí koruny stromů (intercepce), část se vypaří nebo ji rostliny vydýchají (evapotranspirace – výstup). Voda, která dopadne na zem, se vsakuje do půdy (infiltrace) a dál prosakuje do horniny (perkolace). V půdě teče po svahu podpovrchový odtok, pod hladinou podzemní vody podzemní odtok; když půda vodu nestačí pojmout, stéká po povrchu povrchový odtok. Všechny tyto toky se sejdou v řece a odcházejí z povodí jako odtok korytem.";

const W = 460;
const H = 404;
/** ground surface on the slope (x ≤ 350) */
const S = (x: number) => 140 + 100 * Math.pow(Math.max(0, x) / 350, 1.6);
/** water table */
const WT = (x: number) => 294 - 28 * Math.pow(x / 368, 2);
const SOIL = 44;

const along = (f: (x: number) => number, x0: number, x1: number, dy = 0, n = 24) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    d += `${i ? "L" : "M"}${f1(x)} ${f1(f(x) + dy)} `;
  }
  return d;
};
/** angle of the slope at x (degrees) */
const slope = (f: (x: number) => number, x: number) =>
  (Math.atan2(f(x + 4) - f(x - 4), 8) * 180) / Math.PI;

function Rain() {
  const live = useLive();
  const xs = [34, 54, 74, 94, 114, 134, 154, 174, 196, 218, 240];
  return (
    <g>
      {xs.map((x, i) => {
        const top = 60 + (i % 3) * 6;
        const bottom = x > 176 && x < 246 ? 92 : S(x) - 8;
        return (
          <path
            key={x}
            d={`M${x} ${top} l-3 10 M${x - 6} ${f1(top + 24 + (i % 2) * 8)} l-3 10 ${bottom - top > 70 ? `M${x - 12} ${f1(top + 54)} l-3 10` : ""}`}
            className={`gz6-arr gz6-arr-blue ${live ? "gz6-fall" : ""}`}
            style={{ strokeWidth: 1.4, animationDelay: `${(i % 4) * -0.5}s`, ["--fall" as string]: "14px" }}
          />
        );
      })}
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const live = useLive();
  const surf = along(S, 0, 350);
  const soilBody = `${surf} L350 ${S(350) + SOIL} ${along(S, 350, 0, SOIL).replace(/^M/, "L")} Z`;
  const channel = "M350 240 Q356 270 368 274 H410 Q420 266 424 244 L460 238";
  const bankSoil = "M424 244 L460 238 V282 L432 284 Q426 270 424 244 Z";
  const wtPath = along(WT, 0, 368);
  const sat = `${wtPath} L460 262 V${H - 30} H0 Z`;
  const tf = 18; // throughflow depth below surface
  return (
    <>
      {/* rock, saturated zone, soil */}
      <rect x={0} y={130} width={W} height={H - 160} className="gz6-rock" />
      <rect x={0} y={130} width={W} height={H - 160} fill={pat(id, "b")} opacity={0.5} />
      <path d={sat} className="gz6-sea" opacity={0.8} />
      <path d={sat} fill={pat(id, "dots")} />
      <path d={soilBody} className="gz6-soil" />
      <path d={soilBody} fill={pat(id, "d")} opacity={0.6} />
      <path d={bankSoil} className="gz6-soil" />
      {/* air above the ground */}
      <path d={`${surf} ${channel.replace(/^M350 240/, "")} V0 H0 Z`} className="gz6-air" />
      {/* river water in the channel */}
      <path d="M354 256 Q358 272 368 274 H410 Q419 268 421 256 Z" className="gz6-sea-deep" />
      <path d={`M368 ${f1(WT(368))} L460 262`} className="gz6-o gz6-thin gz6-dash gz6-blue-s" />
      <path d={wtPath} className="gz6-o gz6-thin gz6-dash gz6-blue-s" />
      <path d={`${surf} ${channel.replace(/^M350 240/, "")}`} className="gz6-o" />
      <path d={`M0 ${H - 30} H${W}`} className="gz6-o gz6-thin" />

      {/* cloud and rain */}
      <Rain />
      <path
        d="M24 56 Q10 56 12 44 Q14 32 30 34 Q34 16 56 20 Q70 6 92 16 Q112 8 124 24 Q146 22 148 38 Q164 42 156 54 Q152 58 140 58 Z"
        className="gz6-cloud gz6-o"
      />
      {/* tree */}
      <path d={`M210 ${f1(S(210))} V128`} className="gz6-o" style={{ strokeWidth: 3 }} />
      <path
        d="M182 122 Q176 104 192 98 Q196 84 212 88 Q228 82 236 96 Q248 104 240 118 Q238 132 222 132 Q210 138 198 132 Q184 134 182 122 Z"
        className="gz6-veg gz6-o"
      />
      <path d="M186 116 q12 -8 22 0 M206 104 q12 -6 24 2 M198 124 q12 -4 26 0" className="gz6-o gz6-thin gz6-faint" />

      {/* labels of zones */}
      <text x={8} y={S(8) + 26} className="gz6-lbl gz6-sm">
        půda
      </text>
      <text x={8} y={244} className="gz6-lbl gz6-sm">
        hornina
      </text>
      <text x={8} y={WT(8) + 22} className="gz6-lbl gz6-sm gz6-blue-t">
        hladina podzemní vody
      </text>
      <path d={`M8 ${f1(WT(8) + 8)} l8 -6 l8 6`} className="gz6-o gz6-thin gz6-blue-s" />

      {/* flows */}
      <Fade delay={0.1}>
        <text x={166} y={42} className="gz6-lbl gz6-b gz6-blue-t">
          srážky
        </text>
        <text x={166} y={58} className="gz6-eq gz6-eq-sm gz6-tone-blue" style={{ letterSpacing: 0.6 }}>
          VSTUP
        </text>
      </Fade>
      <Fade delay={0.4}>
        <text x={250} y={108} className="gz6-lbl gz6-b gz6-halo">
          intercepce
        </text>
        <path d="M248 104 L238 108" className="gz6-lead" />
      </Fade>

      <DrawArrow d="M232 90 q8 -10 2 -20 t4 -22" tone="acc" delay={0.6} />
      <DrawArrow d="M392 252 q8 -12 2 -24 t4 -24 t2 -22 t4 -24" tone="acc" delay={0.7} />
      <Fade delay={0.8}>
        <text x={W - 10} y={30} textAnchor="end" className="gz6-lbl gz6-b gz6-acc-t">
          evapotranspirace
        </text>
        <text x={W - 10} y={46} textAnchor="end" className="gz6-eq gz6-eq-sm gz6-tone-acc" style={{ letterSpacing: 0.6 }}>
          VÝSTUP
        </text>
      </Fade>

      <DrawArrow d={`M70 ${f1(S(70) - 12)} V${f1(S(70) + 24)}`} tone="blue" delay={0.5} />
      <Fade delay={0.6}>
        <text x={78} y={S(70) + 22} className="gz6-lbl gz6-b gz6-halo">
          infiltrace
        </text>
      </Fade>
      <DrawArrow d={`M118 ${f1(S(118) + SOIL - 8)} V${f1(S(118) + SOIL + 34)}`} tone="blue" delay={0.8} />
      <Fade delay={0.9}>
        <text x={126} y={S(118) + SOIL + 28} className="gz6-lbl gz6-b gz6-halo">
          perkolace
        </text>
      </Fade>

      {/* surface runoff above the surface */}
      <DrawArrow d={along(S, 236, 344, -7, 12)} tone="blue" delay={1.0} />
      <Fade delay={1.1}>
        <text
          className="gz6-lbl gz6-b gz6-halo"
          transform={`translate(246 ${f1(S(246) - 18)}) rotate(${f1(slope(S, 290))})`}
        >
          povrchový odtok
        </text>
      </Fade>
      {/* throughflow in the soil */}
      <DrawArrow d={along(S, 160, 346, 9, 16)} tone="blue" delay={1.2} />
      <Fade delay={1.3}>
        <text
          className="gz6-lbl gz6-b gz6-sm gz6-halo"
          transform={`translate(176 ${f1(S(176) + tf + 14)}) rotate(${f1(slope(S, 236))})`}
        >
          podpovrchový odtok
        </text>
      </Fade>
      {/* groundwater flow */}
      <DrawArrow d={along(WT, 150, 362, 22, 12)} tone="blue" delay={1.4} />
      <Fade delay={1.5}>
        <text x={158} y={WT(158) + 42} className="gz6-lbl gz6-b gz6-halo">
          podzemní odtok
        </text>
      </Fade>
      {/* channel flow */}
      <Fade delay={1.5}>
        <path d="M370 268 h40" className={`gz6-arr gz6-arr-blue ${live ? "gz6-flow" : ""}`} />
      </Fade>
      <Fade delay={1.6}>
        <text x={W - 8} y={306} textAnchor="end" className="gz6-lbl gz6-b gz6-halo">
          odtok korytem
        </text>
        <text x={W - 8} y={322} textAnchor="end" className="gz6-eq gz6-eq-sm gz6-tone-acc gz6-halo" style={{ letterSpacing: 0.6 }}>
          VÝSTUP
        </text>
        <path d="M410 292 L398 276" className="gz6-lead" />
      </Fade>

      <Fade delay={1.8}>
        <text x={W / 2} y={H - 8} textAnchor="middle" className="gz6-lbl gz6-sm">
          zásoby: koruny stromů · půdní vláha · podzemní voda · koryto
        </text>
      </Fade>
    </>
  );
}

export default function DrainageBasinSystem() {
  return (
    <Figure label={LABEL} w={W} h={H} max={640} boost={false} replay>
      <Plate />
    </Figure>
  );
}
