import { Draw, DrawArrow, Fade, FadePath, Figure, Lbl, pat, useFig } from "./kit";

const LABEL =
  "Údolní ledovec shora a v podélném řezu. Ve dvou karech nahoře, nad sněžnou čárou, leží akumulační oblast: přibývá tu víc sněhu, než stačí roztát, sníh se mění ve firn a led. Led pomalu teče údolím dolů a obě větve se spojí v jeden ledovcový jazyk. Pod sněžnou čárou je ablační oblast, kde víc ledu roztaje, než přibude. Kde led teče přes nerovnosti, praská a vznikají trhliny. Ledovec nese úlomky hornin: podél okrajů tvoří boční morény, kde se dvě větve spojí, vzniká uprostřed střední moréna, a před čelem ledovce leží valová čelní moréna. Z čela vytéká tavná voda jako ledovcový potok.";

const W = 520;
const H = 500;

const ICE =
  "M40 76 C34 30 128 12 150 50 C160 72 166 92 178 112 L200 124 L224 106 C238 88 250 66 262 48 C276 16 366 14 372 52 C376 80 366 104 352 126 C344 146 342 164 356 196 C370 226 396 256 424 284 C440 304 436 330 410 338 C384 344 360 334 348 316 C330 290 306 262 280 240 C250 216 214 192 170 166 C130 144 96 128 72 112 C54 100 44 90 40 76 Z";
const MEDIAL = "M200 126 C222 160 252 192 290 222 C324 250 352 282 378 330";
const LAT_L = "M60 104 C100 132 150 156 190 180 C240 210 290 246 320 280 C334 298 346 316 352 322";
const LAT_R = "M362 112 C352 140 346 168 360 200 C376 232 400 260 424 286";
const TERMINAL = "M336 324 C350 366 424 372 446 330 C452 316 450 302 444 292";
const STREAM = "M398 344 C406 356 430 358 452 360 C474 362 488 358 508 364";
const SNOW = "M28 150 C120 140 300 132 420 136";
const CREV = ["M232 176 q12 4 18 14", "M246 168 q12 4 18 14", "M262 202 q12 4 16 14", "M300 238 q12 4 14 14", "M318 254 q10 4 12 14", "M322 160 q-6 6 -4 16"];

function Plate() {
  const { id } = useFig();
  return (
    <>
      <Fade>
        <rect x={8} y={8} width={W - 16} height={364} rx={6} className="gz3-rock" />
        <rect x={8} y={8} width={W - 16} height={364} rx={6} fill={pat(id, "d")} opacity={0.5} />
        <path d={ICE} className="gz3-ice" />
        <path d={ICE} fill={pat(id, "b")} opacity={0.35} />
        <path d={ICE} className="gz3-o" />
      </Fade>
      {CREV.map((d, i) => (
        <Draw key={i} d={d} className="gz3-o gz3-crevasse" delay={0.3} />
      ))}
      <FadePath d={LAT_L} className="gz3-moraine" delay={0.4} />
      <FadePath d={LAT_R} className="gz3-moraine" delay={0.4} />
      <FadePath d={MEDIAL} className="gz3-moraine" delay={0.5} />
      <FadePath d={TERMINAL} className="gz3-moraine gz3-moraine-t" delay={0.6} />
      <Draw d={STREAM} className="gz3-river" delay={0.8} />
      <FadePath d={SNOW} className="gz3-snowline" delay={0.6} />
      {/* ice flow */}
      {["M96 64 C110 80 120 96 140 116", "M320 52 C316 80 300 100 280 116", "M300 182 C322 204 342 232 364 266"].map((d, i) => (
        <DrawArrow key={i} d={d} tone="lvl" className="gz3-wind" delay={0.9 + i * 0.1} />
      ))}

      <Fade delay={1.1}>
        <text x={206} y={58} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo">
          akumulační
        </text>
        <text x={206} y={75} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo">
          oblast
        </text>
        <text x={424} y={132} className="gz3-lbl gz3-b gz3-blue-t gz3-halo">
          sněžná čára
        </text>
        <Lbl x={20} y={232} tx={250} ty={214} className="gz3-b gz3-halo">
          ablační oblast
        </Lbl>
        <Lbl x={20} y={186} tx={120} ty={140} className="gz3-sm gz3-halo">
          boční moréna
        </Lbl>
        <Lbl x={20} y={290} tx={334} ty={262} className="gz3-sm gz3-halo">
          střední moréna
        </Lbl>
        <Lbl x={400} y={210} tx={334} ty={176} className="gz3-sm gz3-halo">
          trhliny
        </Lbl>
        <Lbl x={210} y={340} anchor="end" tx={352} ty={358} className="gz3-sm gz3-halo">
          čelní moréna
        </Lbl>
        <Lbl x={506} y={350} anchor="end" className="gz3-sm gz3-blue-t gz3-halo">
          tavná voda
        </Lbl>
        <text x={92} y={36} textAnchor="middle" className="gz3-lbl gz3-sm gz3-sec gz3-halo">
          kar
        </text>
      </Fade>

      {/* profile */}
      <Fade delay={0.4}>
        <text x={14} y={386} className="gz3-lbl gz3-sm gz3-muted-t">
          podélný řez
        </text>
        <path d="M20 408 C120 420 220 450 330 470 L470 486 V492 H20 Z" className="gz3-rock" />
        <path d="M20 408 C120 420 220 450 330 470 L470 486" className="gz3-o" />
        <path d="M20 408 C30 398 60 396 120 404 C200 416 260 434 330 458 C340 462 346 466 352 474 C340 466 300 462 220 446 C160 432 100 418 20 408 Z" className="gz3-o gz3-ice" />
        <path d="M206 400 V466" className="gz3-snowline" />
        <text x={110} y={392} textAnchor="middle" className="gz3-lbl gz3-sm gz3-b gz3-lvl-t">
          + sníh
        </text>
        <text x={300} y={430} textAnchor="middle" className="gz3-lbl gz3-sm gz3-b gz3-red-t">
          − tání
        </text>
        <path d="M60 404 C120 410 200 424 280 446" className="gz3-arr gz3-arr-lvl gz3-dash" />
      </Fade>
    </>
  );
}

export default function GlacierParts() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
