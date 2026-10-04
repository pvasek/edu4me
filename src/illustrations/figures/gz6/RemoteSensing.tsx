import { Draw, Fade, Figure, Note, pat, useFig } from "./kit";

const LABEL =
  "Jak vidí družice. Sluneční světlo dopadá na zemský povrch a různé povrchy ho odrážejí různě; družice (například Sentinel-2 se 13 spektrálními pásmy a pixelem až 10 m) měří odraz v několika pásmech. Voda odráží málo v červeném pásmu (asi 3 %) a téměř nic v blízkém infračerveném (asi 1 %). Zdravá vegetace odráží málo červeného světla (asi 5 %, chlorofyl ho pohlcuje), ale hodně blízkého infračerveného (asi 45 %). Holá půda odráží v obou pásmech podobně (asi 25 a 30 %), město také (asi 20 a 22 %). Na snímku v nepravých barvách se blízké infračervené pásmo zobrazí červeně, takže vegetace svítí červeně a voda je tmavá. Z rozdílu pásem se počítá vegetační index NDVI = (NIR − R) / (NIR + R): vegetace asi 0,8, holá půda asi 0,1, voda pod nulou.";

const W = 460;
const H = 540;
const GY = 214; // ground top

type Surf = { key: string; name: string; x: number; r: number; nir: number };
const SURF: Surf[] = [
  { key: "water", name: "voda", x: 70, r: 3, nir: 1 },
  { key: "veg", name: "vegetace", x: 180, r: 5, nir: 45 },
  { key: "soil", name: "holá půda", x: 290, r: 25, nir: 30 },
  { key: "town", name: "město", x: 400, r: 20, nir: 22 },
];
const K = 0.32;

function Ground() {
  const { id } = useFig();
  return (
    <g>
      {/* water */}
      <rect x={14} y={GY} width={112} height={28} className="gz6-sea-deep" />
      <rect x={14} y={GY} width={112} height={28} fill={pat(id, "h")} />
      {/* vegetation */}
      <rect x={126} y={GY} width={110} height={28} className="gz6-grass" />
      {[134, 148, 162, 176, 190, 204, 218].map((x, i) => (
        <path key={x} d={`M${x + 6} ${GY} V${GY - 10 - (i % 2) * 4}`} className="gz6-o gz6-thin" />
      ))}
      {[134, 148, 162, 176, 190, 204, 218].map((x, i) => (
        <circle key={x} cx={x + 6} cy={GY - 14 - (i % 2) * 4} r={7} className="gz6-veg gz6-o gz6-thin" />
      ))}
      {/* bare soil */}
      <rect x={236} y={GY} width={110} height={28} className="gz6-soil" />
      <rect x={236} y={GY} width={110} height={28} fill={pat(id, "dots")} />
      {/* town */}
      <rect x={346} y={GY} width={100} height={28} className="gz6-rock" />
      {[352, 372, 392, 414].map((x, i) => (
        <rect key={x} x={x} y={GY - 12 - (i % 2) * 8} width={16} height={12 + (i % 2) * 8} className="gz6-fill gz6-o gz6-thin" />
      ))}
      <path d={`M14 ${GY} H446 M14 ${GY + 28} H446`} className="gz6-o" />
      {SURF.map((s) => (
        <text key={s.key} x={s.x} y={GY + 46} textAnchor="middle" className="gz6-lbl gz6-b">
          {s.name}
        </text>
      ))}
    </g>
  );
}

function Satellite({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-46} y={-7} width={30} height={14} className="gz6-lvl-fill gz6-o gz6-thin" />
      <rect x={16} y={-7} width={30} height={14} className="gz6-lvl-fill gz6-o gz6-thin" />
      <path d="M-46 0 H-16 M16 0 H46 M-36 -7 V7 M-26 -7 V7 M26 -7 V7 M36 -7 V7" className="gz6-o gz6-thin" />
      <rect x={-12} y={-12} width={24} height={24} rx={3} className="gz6-fill gz6-o" />
      <path d="M-5 12 L-8 18 H8 L5 12" className="gz6-o gz6-thin" />
    </g>
  );
}

function Tile({ x, y, fake }: { x: number; y: number; fake: boolean }) {
  const c = fake
    ? { field: "#e48a7a", forest: "#b8322a", water: "#18213a", soil: "#c9b7a0", town: "#86aebf", road: "#d9e3e8" }
    : { field: "#9dba6e", forest: "#3d6a3a", water: "#2f5f90", soil: "#b48c5c", town: "#9b9b9b", road: "#e3e0d6" };
  const w = 190;
  const h = 150;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} fill={c.field} />
      <path d="M0 0 H70 Q60 40 74 70 Q40 84 0 76 Z" fill={c.forest} />
      <path d="M128 96 H190 V150 H112 Q118 120 128 96 Z" fill={c.forest} />
      <rect x={96} y={14} width={50} height={36} fill={c.soil} />
      <rect x={20} y={104} width={44} height={30} fill={c.soil} />
      {/* town */}
      <rect x={150} y={8} width={34} height={56} fill={c.town} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M150 ${16 + i * 14} H184`} stroke={c.road} strokeWidth={1.4} />
      ))}
      <path d="M167 8 V64" stroke={c.road} strokeWidth={1.4} />
      {/* river */}
      <path d="M-2 92 C40 88 60 120 96 112 S150 70 192 82" fill="none" stroke={c.water} strokeWidth={9} />
      <rect width={w} height={h} className="gz6-o" fill="none" />
    </g>
  );
}

function Plate() {
  return (
    <>
      {/* sun and satellite */}
      <circle cx={34} cy={36} r={16} className="gz6-sun gz6-o" />
      <text x={58} y={30} className="gz6-lbl gz6-b">
        Slunce
      </text>
      <text x={58} y={48} className="gz6-lbl gz6-sm">
        odraz v % dopadajícího světla
      </text>
      <Satellite x={360} y={36} />
      <text x={W - 6} y={70} textAnchor="end" className="gz6-lbl gz6-sm">
        Sentinel-2: 13 pásem, pixel až 10 m
      </text>
      {SURF.map((s, i) => (
        <path key={s.key} d={`M${34 + 10} ${36 + 12} L${s.x - 24} ${GY - 18}`} className="gz6-o gz6-thin" style={{ stroke: "var(--yellow)", strokeWidth: 1.3, opacity: 0.75 - i * 0.1, strokeDasharray: "6 4" }} />
      ))}

      {/* reflected bands */}
      {SURF.map((s, i) => (
        <g key={s.key}>
          <Draw d={`M${s.x - 6} ${GY - 22} V128`} className="gz6-st gz6-st-lw" delay={0.2 + i * 0.15} style={{ strokeWidth: Math.max(1.4, s.r * K), stroke: "var(--bad)" }} />
          <Draw d={`M${s.x + 10} ${GY - 22} V128`} className="gz6-st" delay={0.3 + i * 0.15} style={{ strokeWidth: Math.max(1.4, s.nir * K), stroke: "var(--violet)" }} />
          <Fade delay={0.9 + i * 0.1}>
            {(
              [
                [s.x - 6, s.r, "var(--bad)"],
                [s.x + 10, s.nir, "var(--violet)"],
              ] as [number, number, string][]
            ).map(([hx, v, col]) => {
              const hw = Math.max(1.4, v * K) / 2 + 4;
              return <path key={hx} d={`M${hx - hw} 130 L${hx} 119 L${hx + hw} 130 Z`} style={{ fill: col }} />;
            })}
            <text x={s.x - 8} y={112} textAnchor="end" className="gz6-num gz6-b gz6-halo" style={{ fill: "var(--bad)", fontSize: 12 }}>
              {s.r} %
            </text>
            <text x={s.x + 12} y={112} textAnchor="start" className="gz6-num gz6-b gz6-halo" style={{ fill: "var(--violet)", fontSize: 12 }}>
              {s.nir} %
            </text>
          </Fade>
        </g>
      ))}
      <Ground />

      {/* legend */}
      <Fade delay={1.2}>
        <path d="M14 90 h18" style={{ stroke: "var(--bad)", strokeWidth: 6 }} />
        <text x={38} y={95} className="gz6-lbl gz6-sm gz6-halo">
          červené pásmo (R)
        </text>
        <path d="M160 90 h18" style={{ stroke: "var(--violet)", strokeWidth: 6 }} />
        <text x={184} y={95} className="gz6-lbl gz6-sm gz6-halo">
          blízké infračervené (NIR) – oko ho nevidí
        </text>
      </Fade>

      {/* images */}
      <text x={20} y={300} className="gz6-lbl gz6-b">
        přirozené barvy
      </text>
      <text x={250} y={300} className="gz6-lbl gz6-b">
        nepravé barvy: NIR jako červená
      </text>
      <Tile x={20} y={310} fake={false} />
      <Tile x={250} y={310} fake />
      <Fade delay={1.4}>
        <text x={345} y={478} textAnchor="middle" className="gz6-lbl gz6-sm">
          vegetace svítí červeně, voda je tmavá
        </text>
      </Fade>

      <Note x={20} y={490} w={W - 40} h={42} lvl>
        <text x={34} y={508} className="gz6-eq gz6-b">
          NDVI = (NIR − R) / (NIR + R)
        </text>
        <text x={34} y={525} className="gz6-eq gz6-eq-sm">
          vegetace ≈ 0,8 · holá půda ≈ 0,1 · voda pod 0
        </text>
      </Note>
    </>
  );
}

export default function RemoteSensing() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} boost={false} replay>
      <Plate />
    </Figure>
  );
}

