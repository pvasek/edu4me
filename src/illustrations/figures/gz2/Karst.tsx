import { Draw, Fade, Figure, pat, useFig, useLive } from "./kit";
import { T, Tree } from "./land";

const LABEL =
  "Krasová krajina v řezu na příkladu Moravského krasu. Potok přitéká z nepropustných hornin a v ponoru zmizí pod zem do vápence. Voda s oxidem uhličitým vápenec rozpouští, a tak vznikají závrty na povrchu, podzemní chodby a jeskyně. Kde se strop jeskyně propadl, vznikla propast – například Macocha, hluboká 138,7 m, na jejímž dně teče podzemní říčka Punkva. V jeskyních z kapající vody vyrůstají krápníky: stalaktity visí ze stropu, stalagmity rostou ze dna a když se spojí, vznikne stalagnát. Podzemní řeka znovu vychází na povrch ve vyvěračce.";

const W = 500;
const H = 372;
const RV = 290; // underground river level

const SURF =
  "M4 74 L60 78 L106 84 Q116 86 122 94 L128 102 L134 94 Q142 86 160 86 L176 87 Q186 89 192 104 Q198 110 204 104 Q210 89 220 87 L250 86 L304 86 L420 86 Q428 90 430 120 L436 252 Q438 274 446 282 L496 282";
const LAND = SURF + " L496 368 L4 368Z";
const NONKARST = "M4 70 L110 70 Q118 140 100 220 Q84 300 96 368 L4 368Z";
const MACOCHA = "M250 86 Q260 92 262 120 L264 250 Q264 280 270 294 L294 294 Q302 280 300 250 L298 120 Q298 94 304 86Z";
const CAVE = "M326 294 L322 262 Q318 220 340 210 Q370 198 398 206 Q420 214 418 250 L416 294Z";
const RIVER = `M126 100 Q132 140 146 180 Q160 240 196 ${RV - 2} L270 ${RV} L320 ${RV} L416 ${RV} L438 ${RV - 4} L450 ${RV - 8}`;
const STREAM = "M8 72 Q60 76 104 84 Q118 88 126 100";

function Krapniky() {
  // stalactites (from the ceiling), stalagmites (from the floor), one column
  return (
    <g className="gz2-krap gz2-o gz2-thin">
      <path d="M340 213 L344 236 L348 212Z" />
      <path d="M352 208 L355 228 L359 207Z" />
      <path d="M392 205 L395 226 L399 206Z" />
      <path d="M406 210 L409 238 L413 212Z" />
      <path d="M338 286 L342 266 L346 286Z" />
      <path d="M350 286 L353 272 L357 286Z" />
      <path d="M400 286 L404 268 L408 286Z" />
      {/* stalagnát */}
      <path d="M368 202 Q371 224 372 240 Q370 262 364 286 H384 Q378 262 376 240 Q377 224 380 202Z" />
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const live = useLive();
  const clip = `${id}-land`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d={LAND} />
        </clipPath>
      </defs>
      <path d={LAND} className="gz2-lime" />
      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={60} width={W} height={H} fill={pat(id, "brick")} opacity={0.7} />
        <path d={NONKARST} className="gz2-shale" />
        <path d={NONKARST} fill={pat(id, "h")} />
        <path d={NONKARST} className="gz2-o gz2-thin" />
        {/* soil and grass strip */}
        <path d={SURF} className="gz2-o" style={{ strokeWidth: 5, stroke: "var(--gz2-grass-line)" }} />
      </g>
      {/* hollows: the abyss, the cave */}
      <path d={MACOCHA} className="gz2-hollow" />
      <path d={MACOCHA} className="gz2-o" />
      <path d={CAVE} className="gz2-hollow" />
      <path d={CAVE} className="gz2-o" />
      <Krapniky />
      <path d={LAND} className="gz2-o" />
      {/* water */}
      <Draw d={STREAM} className="gz2-river" style={{ strokeWidth: 4 }} />
      <Draw d={RIVER} className="gz2-river" style={{ strokeWidth: 8 }} delay={0.4} />
      {live && (
        <path d={STREAM + " " + RIVER.replace(/^M126 100/, "")} className="gz2-flow gz2-flowline" />
      )}
      <path d="M450 282 Q470 280 496 281" className="gz2-river" style={{ strokeWidth: 4 }} />
      {[30, 70, 160, 226, 340, 380, 404].map((x, i) => (
        <Tree key={x} x={x} y={x < 110 ? 76 - x * 0.06 : 86} s={0.8} conifer={i % 2 === 0} />
      ))}

      <Fade delay={0.9}>
        <T x={8} y={22} a="start" cls="gz2-b gz2-lvl-t">Moravský kras</T>
        <T x={128} y={52} cls="gz2-b">ponor</T>
        <path d="M128 58 V92" className="gz2-lead" />
        <T x={198} y={68} cls="gz2-sm">závrt</T>
        <T x={280} y={34} cls="gz2-b">propast Macocha</T>
        <T x={280} y={52} cls="gz2-sm">hloubka 138,7 m</T>
        <path d="M312 120 h10 M312 286 h10 M317 120 V286" className="gz2-o gz2-thin" />
        <T x={370} y={182} cls="gz2-b">jeskyně</T>
        <T x={496} y={262} a="end" cls="gz2-b gz2-blue-t">vyvěračka</T>
        <T x={196} y={RV + 26} cls="gz2-sm gz2-blue-t">podzemní říčka Punkva</T>
        <T x={180} y={150} a="start" cls="gz2-sm gz2-sec">vápenec</T>
        <T x={50} y={130} cls="gz2-sm gz2-sec">nepropustné</T>
        <T x={50} y={146} cls="gz2-sm gz2-sec">horniny</T>
        {/* speleothems */}
        <T x={300} y={330} a="end" cls="gz2-sm">stalaktit</T>
        <path d="M302 326 L344 236" className="gz2-lead" />
        <T x={364} y={348} a="end" cls="gz2-sm">stalagnát</T>
        <path d="M366 344 L373 268" className="gz2-lead" />
        <T x={428} y={330} a="start" cls="gz2-sm">stalagmit</T>
        <path d="M426 326 L405 272" className="gz2-lead" />
      </Fade>
    </>
  );
}

export default function Karst() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={660} replay>
      <Plate />
    </Figure>
  );
}
