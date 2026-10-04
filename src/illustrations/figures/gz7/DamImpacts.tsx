import { Draw, Effect, Fade, Figure, Lbl, Pop, useFig, pat } from "./kit";

const LABEL =
  "Velká přehrada v řezu údolím a její dopady. Přínosy: elektřina z vodní elektrárny, zásoba vody a ochrana před povodněmi, voda na zavlažování polí. Škody: nádrž zatopí vesnice a údolí a lidé se musí vystěhovat, za hrází se usazují naplaveniny, ryby neproplují proti proudu, po proudu teče méně vody a bahna, delta ustupuje a se sousedními státy po proudu vznikají spory o vodu, jako u Nilu.";

const W = 520;
const H = 420;

const BED = "M0 132 L40 150 L120 206 L200 258 L284 292 L336 302 L420 310 L520 318";
const GROUND = `${BED} V${H} H0 Z`;
const WATER = "M40 150 H284 V292 L200 258 L120 206 Z";
const SED = "M52 158 L120 206 L200 258 L284 292 V284 L200 249 L130 200 L80 166 Z";

function Fish({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-10 0 q8 -8 18 0 q-10 8 -18 0 z M8 0 l7 -5 v10 z" className="gz7-fish gz7-o gz7-thin" />
      <circle cx={-5} cy={-1} r={1} className="gz7-dot" />
    </g>
  );
}

export default function DamImpacts() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={660} replay>
      <Plate />
    </Figure>
  );
}

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* ground and reservoir */}
      <path d={GROUND} className="gz7-dam-ground gz7-o" />
      <path d={GROUND} fill={pat(id, "dots")} className="gz7-nohit" />
      <path d={WATER} className="gz7-water" />
      <path d={WATER} fill={pat(id, "h")} className="gz7-nohit" opacity={0.6} />
      <path d={SED} className="gz7-sed gz7-o gz7-thin" />
      <path d={SED} fill={pat(id, "dd")} className="gz7-nohit" />
      <path d="M40 150 H284" className="gz7-o gz7-thin" />
      {/* flooded village on the old valley floor */}
      <g className="gz7-ghost">
        {[162, 178, 196].map((x, i) => (
          <path key={i} d={`M${x - 6} ${226 + i * 9} v-10 l6 -6 6 6 v10 z`} className="gz7-paper-fill gz7-o gz7-thin" />
        ))}
        <path d="M206 250 v-16 l4 -14 4 14 v16 z" className="gz7-paper-fill gz7-o gz7-thin" />
      </g>
      {/* dam */}
      <path d="M284 134 H300 L338 304 H284 Z" className="gz7-dam gz7-o" />
      <path d="M284 134 H300 L338 304 H284 Z" fill={pat(id, "x")} className="gz7-nohit" opacity={0.6} />
      {/* power house, river downstream */}
      <rect x={338} y={284} width={26} height={20} className="gz7-paper-fill gz7-o gz7-thin" />
      <path d="M338 304 Q380 312 420 312 T520 318" className="gz7-river" />
      {/* pylons and power line */}
      {[372, 440, 500].map((x) => (
        <path key={x} d={`M${x - 8} 284 L${x} 214 L${x + 8} 284 M${x - 10} 224 H${x + 10} M${x - 6} 240 H${x + 6}`} className="gz7-o gz7-thin" />
      ))}
      <Draw d="M352 284 Q362 230 372 216 Q406 232 440 216 Q470 232 500 216" className="gz7-wire" delay={0.3} />
      {/* irrigation canal and fields */}
      <path d="M296 150 C330 158 360 172 396 172 H516" className="gz7-canal" />
      {[404, 440, 476].map((x) => (
        <rect key={x} x={x} y={150} width={30} height={14} className="gz7-field gz7-o gz7-thin" />
      ))}
      {/* fish blocked */}
      <Fish x={358} y={268} />
      <path d="M342 260 l10 10 m0 -10 l-10 10" className="gz7-x" />
      {/* border downstream */}
      <path d="M498 300 V414" className="gz7-border gz7-border-thin" />
      <text x={515} y={410} transform="rotate(-90 515 410)" className="gz7-lbl gz7-sm gz7-red-t">
        hranice
      </text>

      {/* ---- effects */}
      <Pop delay={0.4}>
        <Effect x={18} y={24} s="+" r={10} />
        <text x={34} y={30} className="gz7-lbl gz7-b">
          zásoba vody, tlumí povodně
        </text>
        <path d="M120 38 V146" className="gz7-lead" />
        <circle cx={120} cy={148} r={2} className="gz7-dot" />
      </Pop>
      <Pop delay={0.55}>
        <Effect x={368} y={194} s="+" r={10} />
        <text x={384} y={200} className="gz7-lbl gz7-b gz7-halo">
          elektřina
        </text>
      </Pop>
      <Pop delay={0.7}>
        <Effect x={368} y={124} s="+" r={10} />
        <text x={384} y={130} className="gz7-lbl gz7-b">
          zavlažování
        </text>
      </Pop>
      <Pop delay={0.85}>
        <Effect x={18} y={330} s="−" r={10} />
        <Lbl x={34} y={336} tx={186} ty={234} className="gz7-b gz7-halo-g">
          zatopené vesnice, lidé se stěhují
        </Lbl>
      </Pop>
      <Pop delay={1}>
        <Effect x={18} y={372} s="−" r={10} />
        <Lbl x={34} y={378} tx={250} ty={276} className="gz7-b gz7-halo-g">
          za hrází se usazuje bahno
        </Lbl>
      </Pop>
      <Pop delay={1.15}>
        <Effect x={354} y={330} s="−" r={10} />
        <text x={370} y={336} className="gz7-lbl gz7-b gz7-halo-g">
          ryby neproplují
        </text>
      </Pop>
      <Fade delay={1.3}>
        <Effect x={354} y={366} s="−" r={10} />
        <text x={370} y={372} className="gz7-lbl gz7-b gz7-halo-g">
          po proudu méně
        </text>
        <text x={370} y={390} className="gz7-lbl gz7-b gz7-halo-g">
          vody a bahna,
        </text>
        <text x={370} y={408} className="gz7-lbl gz7-sm gz7-halo-g">
          spory se sousedy
        </text>
      </Fade>
    </>
  );
}
