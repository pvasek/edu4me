import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Draw, Fade, Figure, Frame, Pop, pat, useFig } from "./kit";

const LABEL =
  "Životní cyklus tasemnice bezbranné, animace po krocích. 1. Dospělá tasemnice žije ve střevě člověka, přichycená hlavičkou se čtyřmi přísavkami (háčky tasemnice bezbranná nemá). 2. Zralé články plné vajíček odcházejí se stolicí ven, na pole nebo pastvu. 3. Kráva (u tasemnice dlouhočlenné prase) spolkne vajíčka s trávou, larvy pronikají krví do svalů. 4. Ve svalovině se z larvy stane boubel, váček s hlavičkou budoucí tasemnice. 5. Člověk sní syrové nebo nedostatečně tepelně upravené maso a boubel mu ve střevě vyroste v novou tasemnici. 6. Prevence: maso důkladně tepelně upravit, veterinární kontrola masa, mytí rukou a hygiena.";

const W = 440;
const H = 290;

type K = 0 | 1 | 2 | 3 | 4 | 5;

const ARROWS = [
  { d: "M104 236 Q130 262 158 262", k: 1 }, // human → field
  { d: "M248 258 Q262 250 272 234", k: 2 }, // field → pig
  { d: "M356 176 Q360 140 346 112", k: 3 }, // pig → meat
  { d: "M286 70 Q190 30 112 52", k: 4 }, // meat → human
];

function Human({ hi }: { hi: boolean }) {
  const { id } = useFig();
  const body =
    "M62 74 Q80 68 98 74 L112 80 L124 150 L114 153 L104 102 L104 168 L102 262 L86 262 L82 182 L78 182 L74 262 L58 262 L56 168 L56 102 L46 153 L36 150 L48 80 Z";
  return (
    <g>
      <circle cx={80} cy={50} r={16} className="bz2-o bz2-flesh" />
      <path d={body} className="bz2-o bz2-flesh" />
      <path d={body} fill={pat(id, "b")} opacity={0.6} />
      {/* intestine */}
      <path
        d="M64 112 H96 Q102 118 96 124 H64 Q58 130 64 136 H96 Q102 142 96 148 H64 Q58 154 64 160 H84"
        className="bz2-o bz2-gut"
      />
      {hi && (
        <Draw
          d="M64 112 H96 Q102 118 96 124 H64 Q58 130 64 136 H96 Q102 142 96 148 H64 Q58 154 64 160 H84"
          className="bz2-worm"
        />
      )}
    </g>
  );
}

function Field({ eggs }: { eggs: boolean }) {
  return (
    <g>
      <path d="M150 272 Q205 256 262 272" className="bz2-o bz2-leaf" />
      {[160, 176, 194, 212, 230, 248].map((x, i) => (
        <path key={i} d={`M${x} 270 l-4 -12 M${x} 270 l1 -14 M${x} 270 l5 -11`} className="bz2-o bz2-thin" />
      ))}
      {eggs && (
        <Pop delay={0.4}>
          {[
            [172, 262],
            [186, 266],
            [204, 260],
            [222, 266],
            [238, 262],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3} className="bz2-o bz2-thin bz2-yolk" />
          ))}
          <rect x={190} y={248} width={16} height={9} rx={2} className="bz2-o bz2-fill" />
        </Pop>
      )}
    </g>
  );
}

function Cow({ hi }: { hi: boolean }) {
  const { id } = useFig();
  const body = "M290 186 Q300 176 330 178 L384 176 Q402 178 404 196 L402 226 Q396 236 380 234 L304 234 Q290 232 288 216Z";
  return (
    <g>
      {/* legs */}
      {[296, 312, 376, 390].map((x) => (
        <rect key={x} x={x} y={226} width={9} height={36} rx={3} className="bz2-o bz2-cow" />
      ))}
      <path d={body} className="bz2-o bz2-cow" />
      <path d={body} fill={pat(id, "b")} opacity={0.5} />
      {/* patches */}
      <path d="M332 182 Q350 190 344 206 Q328 210 322 196Z M370 200 Q386 196 390 214 Q376 222 368 212Z" className="bz2-cowpatch" />
      {/* udder */}
      <path d="M360 234 Q366 246 374 234" className="bz2-o bz2-pig" />
      {/* tail */}
      <path d="M402 186 Q414 210 408 238" className="bz2-o" />
      <path d="M404 236 l4 8 l4 -8" className="bz2-o bz2-thin" />
      {/* head */}
      <path d="M294 186 L270 186 Q258 190 258 204 L262 220 Q272 226 280 218 L294 206Z" className="bz2-o bz2-cow" />
      <ellipse cx={264} cy={214} rx={8} ry={7} className="bz2-o bz2-pig" />
      <path d="M284 184 Q288 170 300 168 M276 184 Q270 172 260 172" className="bz2-o" style={{ strokeWidth: 2.4 }} />
      <circle cx={274} cy={196} r={2} className="bz2-ink-f" />
      {hi && (
        <Fade delay={0.6}>
          {[
            [314, 200],
            [340, 220],
            [360, 190],
            [326, 222],
            [384, 216],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={5} ry={3.5} className="bz2-o bz2-thin bz2-cyst" />
          ))}
        </Fade>
      )}
    </g>
  );
}

function Meat({ cysts }: { cysts: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <path d="M296 60 Q322 40 360 50 Q392 60 386 86 Q376 110 334 106 Q298 102 294 82Z" className="bz2-o bz2-meat" />
      <path d="M296 60 Q322 40 360 50 Q392 60 386 86 Q376 110 334 106 Q298 102 294 82Z" fill={pat(id, "d")} opacity={0.6} />
      <path d="M310 64 Q340 56 372 66 M306 82 Q338 74 378 84" className="bz2-o bz2-thin" />
      {cysts &&
        [
          [316, 72],
          [346, 64],
          [364, 78],
          [334, 92],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={6} ry={4} className="bz2-o bz2-thin bz2-cyst" />
        ))}
    </g>
  );
}

/** Inset in the middle of the scene. */
function Inset({ k }: { k: K }) {
  const { id } = useFig();
  const box = (
    <rect x={120} y={78} width={146} height={152} rx={10} className="bz2-tag" />
  );
  if (k === 0)
    return (
      <Pop delay={0.3}>
        {box}
        {/* scolex: hooks crown + 4 suckers, neck, first segments */}
        <circle cx={230} cy={124} r={22} className="bz2-o bz2-fill2" />
        <circle cx={220} cy={118} r={6} className="bz2-o bz2-lvlmid-f" />
        <circle cx={240} cy={118} r={6} className="bz2-o bz2-lvlmid-f" />
        <circle cx={220} cy={132} r={6} className="bz2-o bz2-lvlmid-f" />
        <circle cx={240} cy={132} r={6} className="bz2-o bz2-lvlmid-f" />
        <path d="M222 144 L224 180 H236 L238 144" className="bz2-o bz2-fill2" />
        <rect x={220} y={180} width={20} height={10} className="bz2-o bz2-fill2" />
        <rect x={218} y={190} width={24} height={12} className="bz2-o bz2-fill2" />
        <rect x={216} y={202} width={28} height={14} className="bz2-o bz2-fill2" />
        <text x={128} y={100} className="bz2-lbl bz2-b bz2-xs">hlavička</text>
        <text x={128} y={160} className="bz2-lbl bz2-xs">přísavky</text>
        <line x1={170} y1={148} x2={214} y2={134} className="bz2-lead" />
        <text x={128} y={210} className="bz2-lbl bz2-xs">články</text>
        <line x1={170} y1={204} x2={214} y2={204} className="bz2-lead" />
      </Pop>
    );
  if (k === 1)
    return (
      <Pop delay={0.3}>
        {box}
        <rect x={156} y={92} width={82} height={100} rx={6} className="bz2-o bz2-fill2" />
        <rect x={156} y={92} width={82} height={100} rx={6} fill={pat(id, "dots")} />
        {Array.from({ length: 20 }, (_, i) => (
          <circle
            key={i}
            cx={166 + (i % 5) * 15}
            cy={106 + Math.floor(i / 5) * 22 + ((i * 7) % 3) * 3}
            r={4}
            className="bz2-o bz2-thin bz2-yolk"
          />
        ))}
        <text x={197} y={214} textAnchor="middle" className="bz2-lbl bz2-b bz2-xs">
          článek s vajíčky
        </text>
      </Pop>
    );
  if (k === 2)
    return (
      <Fade delay={0.3}>
        <text x={250} y={150} textAnchor="end" className="bz2-lbl bz2-b bz2-sm">larvy krví</text>
        <text x={250} y={168} textAnchor="end" className="bz2-lbl bz2-sm">do svalů</text>
        <line x1={254} y1={158} x2={312} y2={198} className="bz2-lead" />
      </Fade>
    );
  if (k === 3)
    return (
      <Pop delay={0.3}>
        {box}
        {/* muscle fibres with one bladder worm */}
        {[104, 122, 140, 158, 176, 194].map((y) => (
          <path key={y} d={`M136 ${y} Q197 ${y - 6} 258 ${y}`} className="bz2-o bz2-thin bz2-meat-l" />
        ))}
        <ellipse cx={197} cy={150} rx={32} ry={24} className="bz2-o bz2-cyst" />
        <path d="M197 132 Q185 140 189 154 Q197 164 205 154 Q209 140 197 132Z" className="bz2-o bz2-fill2" />
        <circle cx={193} cy={146} r={2.6} className="bz2-o bz2-hair bz2-lvlmid-f" />
        <circle cx={201} cy={146} r={2.6} className="bz2-o bz2-hair bz2-lvlmid-f" />
        <text x={197} y={218} textAnchor="middle" className="bz2-lbl bz2-b bz2-sm">
          boubel (asi 1 cm)
        </text>
      </Pop>
    );
  if (k === 4)
    return (
      <Fade delay={0.3}>
        <text x={206} y={30} textAnchor="middle" className="bz2-lbl bz2-b bz2-lvl-t">
          syrové maso
        </text>
      </Fade>
    );
  return (
    <Pop delay={0.2}>
      <rect x={92} y={74} width={256} height={150} rx={10} className="bz2-tag-lvl" />
      <text x={220} y={98} textAnchor="middle" className="bz2-up bz2-lvl-t" style={{ fontSize: 12 }}>
        prevence
      </text>
      {["maso dobře propéct", "veterinární kontrola", "mýt si ruce", "hygiena, záchody"].map((t, i) => (
        <g key={t}>
          <path
            d={`M108 ${120 + i * 26} l5 5 l9 -11`}
            className="bz2-o bz2-good-s"
            style={{ strokeWidth: 2.4 }}
          />
          <text x={128} y={127 + i * 26} className="bz2-lbl bz2-b bz2-sm">
            {t}
          </text>
        </g>
      ))}
    </Pop>
  );
}

function Scene({ k }: { k: K }) {
  return (
    <Frame w={W} h={H}>
      {ARROWS.map((a) => (
        <Arrow
          key={a.d}
          d={a.d}
          tone={a.k === k || (k === 5 && a.k === 4) ? "lvl" : "muted"}
          className={a.k === k ? "bz2-thick" : ""}
          dashed={a.k !== k}
        />
      ))}
      <g opacity={k === 5 ? 0.3 : 1}>
        <Human hi={k === 0 || k === 4 || k === 1} />
        <Field eggs={k === 1 || k === 2} />
        <g transform="translate(14 0)">
          <Cow hi={k === 2 || k === 3} />
        </g>
        <Meat cysts={k >= 3} />
        <text x={80} y={282} textAnchor="middle" className="bz2-lbl bz2-b">člověk</text>
        <text x={360} y={282} textAnchor="middle" className="bz2-lbl bz2-b">kráva</text>
        <text x={392} y={100} className="bz2-lbl bz2-sm">maso</text>
      </g>
      <Inset k={k} />
    </Frame>
  );
}

const STEPS = [
  {
    title: "Tasemnice ve střevě člověka",
    caption: "Dospělá tasemnice (až několik metrů) se drží hlavičkou s přísavkami a vstřebává natrávenou potravu celým povrchem.",
  },
  {
    title: "Články s vajíčky ven",
    caption: "Zralé články na konci těla jsou plné vajíček a odcházejí se stolicí na pole či pastvu.",
  },
  {
    title: "Kráva spolkne vajíčka",
    caption: "Mezihostitel – kráva (u tasemnice dlouhočlenné prase) – spolkne vajíčka s trávou; larvy pronikají krví do svalů.",
  },
  {
    title: "Boubel ve svalovině",
    caption: "Ve svalu se larva změní v boubel – váček s vchlípenou hlavičkou budoucí tasemnice.",
  },
  {
    title: "Člověk sní syrové maso",
    caption: "Ze syrového nebo málo tepelně upraveného masa se boubel ve střevě uchytí a vyroste v novou tasemnici.",
  },
  {
    title: "Jak se chránit",
    caption: "Tepelná úprava boubele zničí; veterinární kontrola a hygiena přeruší cyklus na obou koncích.",
  },
];

export default function TapewormCycle() {
  return (
    <Figure level={4} label={LABEL} max={620} interactive>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s, k) => ({ ...s, art: <Scene k={k as K} /> }))}
      />
    </Figure>
  );
}
