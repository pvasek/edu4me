import type { ReactNode } from "react";
import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Pop, pat, useFig, type P2 } from "./kit";
import { T, poly } from "./land";

const LABEL =
  "Jak ledovec mění údolí, animace po krocích v blokdiagramu. 1. Řeka v horách se zařezává do dna a vytváří úzké údolí tvaru V. 2. V ledové době údolí vyplní ledovec; v jeho horní části vyhloubí kar, jazyk ledovce obrušuje dno i svahy a po stranách nese boční morény. 3. Po ústupu ledovce zůstane široké údolí tvaru U se strmými svahy. V karu leží pleso, z vyššího bočního, visutého údolí padá vodopád a napříč údolím leží čelní moréna z nahrnutého kamení, za ní jezero. 4. Když údolí u pobřeží zaplaví moře, vznikne fjord, například Sognefjord v Norsku, dlouhý 205 km a hluboký až 1 308 m.";

const W = 440;
const H = 296;
const BASE = 286;
const FL: P2 = [80, 120];
const FR: P2 = [360, 120];
const BL: P2 = [170, 58];
const BR: P2 = [270, 58];

const V_FRONT: P2[] = [[20, 150], FL, [150, 178], [214, 250], [226, 250], [290, 178], FR, [420, 150]];
const U_FRONT: P2[] = [[20, 150], FL, [132, 140], [150, 196], [168, 236], [196, 252], [244, 252], [272, 236], [290, 196], [308, 140], FR, [420, 150]];

function Mountains() {
  const { id } = useFig();
  const d = "M6 128 L40 70 L70 92 L110 34 L140 62 L170 24 L196 48 L220 18 L246 46 L272 22 L300 60 L332 30 L370 88 L404 60 L434 120 L434 160 L6 160Z";
  return (
    <g>
      <path d={d} className="gz2-rock" />
      <path d={d} fill={pat(id, "b")} opacity={0.35} />
      <path d={d} className="gz2-o gz2-thin" />
      {/* snow caps */}
      <path d="M100 52 L110 34 L118 46 Z M160 42 L170 24 L180 40Z M210 36 L220 18 L232 34Z M262 40 L272 22 L282 36Z M322 48 L332 30 L342 46Z" className="gz2-snow gz2-o gz2-thin" />
    </g>
  );
}

/** valley walls (seen from above) and the cut face in front */
function Valley({ u }: { u: boolean }) {
  const { id } = useFig();
  const front = u ? U_FRONT : V_FRONT;
  const fl: P2 = u ? [196, 252] : [214, 250];
  const fr: P2 = u ? [244, 252] : [226, 250];
  const bl: P2 = u ? [204, 98] : [216, 100];
  const br: P2 = u ? [236, 98] : [224, 100];
  const at = (q: P2) => front.findIndex((p) => p[0] === q[0] && p[1] === q[1]);
  const left = [...front.slice(at(FL), at(fl) + 1), bl, BL];
  const right = [BR, br, ...front.slice(at(fr), at(FR) + 1)];
  const face = poly([...front, [420, BASE], [20, BASE]]);
  return (
    <g>
      {/* the plateau around the valley */}
      <path d={poly([[20, 150], FL, BL, [110, 92], [6, 128]])} className="gz2-grass gz2-o gz2-thin" />
      <path d={poly([[420, 150], FR, BR, [330, 92], [434, 122]])} className="gz2-grass gz2-o gz2-thin" />
      <path d={poly(left)} className="gz2-slope-l" />
      <path d={poly(left)} fill={pat(id, "d")} opacity={0.3} />
      <path d={poly(left)} className="gz2-o gz2-thin" />
      <path d={poly(right)} className="gz2-slope-r" />
      <path d={poly(right)} fill={pat(id, "b")} opacity={0.25} />
      <path d={poly(right)} className="gz2-o gz2-thin" />
      {u && <path d={poly([fl, fr, br, bl])} className="gz2-grass gz2-o gz2-thin" />}
      {/* the cirque at the head */}
      <path d={`M${BL[0]} ${BL[1]} Q182 ${u ? 92 : 80} ${u ? 204 : 216} ${u ? 98 : 100} L${u ? 236 : 224} ${u ? 98 : 100} Q258 ${u ? 92 : 80} ${BR[0]} ${BR[1]}`} className="gz2-o gz2-thin" />
      <path d={face} className="gz2-crust" />
      <path d={face} fill={pat(id, "d")} opacity={0.4} />
      <path d={face} className="gz2-o" />
    </g>
  );
}

function Stage({ u, children }: { u: boolean; children?: ReactNode }) {
  return (
    <Frame w={W} h={H}>
      <Mountains />
      <Valley u={u} />
      {children}
    </Frame>
  );
}

function River({ u }: { u: boolean }) {
  return <path d={u ? "M220 186 Q216 220 220 250" : "M220 100 Q222 170 218 210 Q220 236 220 250"} className="gz2-river" style={{ strokeWidth: 3 }} />;
}

const STEPS = [
  {
    title: "Říční údolí tvaru V",
    caption: "Řeka v horách se zařezává do dna (hloubková eroze); svahy se sesouvají a údolí má tvar V.",
    art: (
      <Stage u={false}>
        <River u={false} />
        <Fade delay={0.3}>
          <T x={120} y={226} cls="gz2-b">údolí tvaru V</T>
          <T x={246} y={150} a="start" cls="gz2-sm gz2-blue-t">řeka</T>
          <path d="M244 146 L222 160" className="gz2-lead" />
        </Fade>
      </Stage>
    ),
  },
  {
    title: "Ledovec vyplní údolí",
    caption: "Ledovec vyhloubí v horní části kar; jeho jazyk obrušuje dno i svahy a po stranách nese boční morény.",
    art: (
      <Stage u>
        <path d={poly(V_FRONT.slice(2, 6), false)} className="gz2-o gz2-thin gz2-dash" />
        <Pop delay={0.1}>
          <path d={poly([[140, 162], [300, 162], [252, 70], [188, 70]])} className="gz2-ice gz2-o" />
          <path d={poly([[140, 162], [150, 196], [168, 236], [196, 252], [244, 252], [272, 236], [290, 196], [300, 162]])} className="gz2-ice gz2-o" />
          <path d="M176 120 Q220 128 264 120 M162 142 Q220 150 280 142 M194 92 Q220 98 246 92" className="gz2-o gz2-thin gz2-faint" />
          <path d="M142 160 L190 72 M298 160 L250 72" className="gz2-moraine" />
        </Pop>
        <Arrow d="M220 84 V136" tone="blue" className="gz2-vec" />
        <Fade delay={0.3}>
          <T x={220} y={14} cls="gz2-b">kar</T>
          <path d="M220 20 V72" className="gz2-lead" />
          <T x={220} y={212} cls="gz2-b gz2-blue-t">ledovec</T>
          <T x={318} y={176} a="start" cls="gz2-sm">boční moréna</T>
          <path d="M316 172 L292 150" className="gz2-lead" />
        </Fade>
      </Stage>
    ),
  },
  {
    title: "Údolí tvaru U",
    caption: "Po ústupu ledovce zůstane široké údolí tvaru U; v karu leží pleso, z visutého údolí padá vodopád, napříč leží čelní moréna.",
    art: (
      <Stage u>
        <River u />
        <ellipse cx={220} cy={92} rx={14} ry={4} className="gz2-water gz2-o gz2-thin" />
        <ellipse cx={220} cy={164} rx={14} ry={5} className="gz2-water gz2-o gz2-thin" />
        <path d="M200 182 Q220 170 240 182" className="gz2-moraine" style={{ strokeWidth: 7 }} />
        {/* hanging valley and waterfall */}
        <path d="M352 96 L330 104 L300 132 L312 136 L340 112 L372 102Z" className="gz2-slope-l gz2-o gz2-thin" />
        <path d="M362 99 Q330 112 304 134" className="gz2-river" style={{ strokeWidth: 2 }} />
        <path d="M302 134 Q294 180 262 232" className="gz2-river gz2-dash" style={{ strokeWidth: 2.4 }} />
        <Fade delay={0.3}>
          <T x={220} y={14} cls="gz2-b">kar s plesem</T>
          <path d="M220 20 V86" className="gz2-lead" />
          <T x={120} y={226} cls="gz2-b">údolí tvaru U</T>
          <T x={376} y={98} cls="gz2-sm">visuté údolí</T>
          <path d="M350 104 L318 122" className="gz2-lead" />
          <T x={346} y={196} a="start" cls="gz2-sm gz2-blue-t">vodopád</T>
          <path d="M344 192 L290 186" className="gz2-lead" />
          <T x={90} y={176} a="start" cls="gz2-sm">čelní moréna</T>
          <path d="M184 172 L204 178" className="gz2-lead" />
        </Fade>
      </Stage>
    ),
  },
  {
    title: "Fjord",
    caption: "Když údolí u pobřeží zaplaví moře, vznikne fjord: úzký, dlouhý a hluboký záliv se strmými stěnami.",
    art: (
      <Stage u>
        <ellipse cx={220} cy={92} rx={14} ry={4} className="gz2-water gz2-o gz2-thin" />
        <Pop delay={0.1}>
          <path d={poly([[154, 204], [286, 204], [234, 128], [206, 128]])} className="gz2-sea gz2-o gz2-thin" />
          <path d={poly([[154, 204], [168, 236], [196, 252], [244, 252], [272, 236], [286, 204]])} className="gz2-sea2 gz2-o gz2-thin" />
        </Pop>
        <Fade delay={0.3}>
          <T x={220} y={186} cls="gz2-b gz2-blue-t">fjord</T>
          <T x={220} y={14} cls="gz2-sm">Sognefjord (Norsko): 205 km, hloubka až 1 308 m</T>
        </Fade>
      </Stage>
    ),
  },
];

export default function GlacialValley() {
  return (
    <Figure level={3} label={LABEL} max={640} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
