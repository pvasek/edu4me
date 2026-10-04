import { Arrow, Draw, Fade, FadePath, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Říční soustava na mapě. Řeka začíná pramenem a hlavní tok teče až k ústí do moře. Přitékají do něj přítoky – levý a pravý podle toho, z které strany přitékají, když se díváme po proudu; místo, kde se dva toky stékají, je soutok. Celé území, ze kterého voda odtéká do jedné řeky, je její povodí (vybarvené). Povodí ohraničuje rozvodí – čára po hřbetech kopců, která odděluje vodu tekoucí do různých řek; za rozvodím teče voda do sousedního povodí.";

const W = 520;
const H = 420;

const SEA = "M300 412 C360 394 420 368 446 356 C474 342 494 318 512 296 V412 Z";
const DIVIDE =
  "M352 398 C300 380 200 382 140 360 C100 340 92 280 100 220 C104 160 96 90 130 54 C170 24 260 22 330 26 C400 30 460 40 484 90 C500 140 486 200 476 240 C470 280 484 300 490 322";
const BASIN = DIVIDE + " C474 342 460 350 446 356 C420 368 380 388 352 398 Z";
const MAIN =
  "M150 72 C170 110 190 140 230 180 C250 200 280 222 320 244 C350 262 370 290 400 318 C420 336 436 348 446 356";
const LEFT = "M420 60 C400 100 380 130 340 150 C300 170 270 190 251 197";
const RIGHT = "M130 330 C180 320 240 318 300 300 C324 292 340 276 350 264";
const SMALL = [
  "M212 46 C206 80 202 110 197 146",
  "M118 236 C146 256 168 284 190 318",
  "M470 120 C440 130 410 130 384 131",
  "M300 52 C306 80 318 110 332 154",
];
const NEIGHBOUR = "M80 150 C64 196 44 236 12 282";

function Plate() {
  const { id } = useFig();
  return (
    <>
      <Fade>
        <rect x={8} y={8} width={W - 16} height={H - 16} rx={6} className="gz3-land" />
        <path d={BASIN} className="gz3-basin" />
        <path d={BASIN} fill={pat(id, "d")} opacity={0.35} />
        <path d={SEA} className="gz3-sea" />
        <path d={SEA} fill={pat(id, "h")} opacity={0.6} />
        <path d="M300 412 C360 394 420 368 446 356 C474 342 494 318 512 296" className="gz3-o" />
      </Fade>

      {/* the watershed */}
      <FadePath d={DIVIDE} className="gz3-divide" delay={0.2} />

      {/* rivers */}
      {SMALL.map((d, i) => (
        <Draw key={i} d={d} className="gz3-river gz3-river-s" delay={0.6 + i * 0.05} />
      ))}
      <Draw d={LEFT} className="gz3-river" delay={0.5} />
      <Draw d={RIGHT} className="gz3-river" delay={0.5} />
      <Draw d={MAIN} className="gz3-river gz3-river-main" delay={0.3} />
      <Draw d={NEIGHBOUR} className="gz3-river" delay={0.6} />
      <Arrow d="M372 286 L388 304" tone="blue" />
      <Arrow d="M50 222 L36 246" tone="blue" />

      <Pop delay={1}>
        <circle cx={150} cy={72} r={5} className="gz3-o gz3-water" />
        <circle cx={251} cy={197} r={5} className="gz3-o gz3-fill" />
        <circle cx={350} cy={264} r={5} className="gz3-o gz3-fill" />
      </Pop>

      <Fade delay={1.1}>
        <text x={200} y={268} textAnchor="middle" className="gz3-lbl gz3-b gz3-big gz3-lvl-t">
          povodí
        </text>
        <Lbl x={92} y={98} anchor="end" tx={146} ty={74} className="gz3-b">
          pramen
        </Lbl>
        <Lbl x={210} y={226} anchor="end" tx={247} ty={201} className="gz3-b">
          soutok
        </Lbl>
        <Lbl x={330} y={226} className="gz3-b gz3-blue-t">
          hlavní tok
        </Lbl>
        <Lbl x={432} y={184} anchor="end" className="gz3-b">
          levý přítok
        </Lbl>
        <Lbl x={156} y={350} className="gz3-b">
          pravý přítok
        </Lbl>
        <Lbl x={406} y={392} anchor="end" tx={444} ty={358} className="gz3-b gz3-halo">
          ústí
        </Lbl>
        <text x={500} y={402} textAnchor="end" className="gz3-lbl gz3-blue-t">
          moře
        </text>
        <Lbl x={262} y={18} anchor="end" tx={300} ty={25} className="gz3-b gz3-violet-t">
          rozvodí
        </Lbl>
        <text x={16} y={124} className="gz3-lbl gz3-sm gz3-muted-t">
          sousední
        </text>
        <text x={16} y={140} className="gz3-lbl gz3-sm gz3-muted-t">
          povodí
        </text>
      </Fade>
    </>
  );
}

export default function RiverBasin() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
