import { DrawArrow, Fade, Figure, Liquid, Rise, pat, useFig } from "./kit";

const LABEL =
  "Proč stoupá hladina oceánu. Mezi lety 1901 a 2018 stoupla průměrná hladina světového oceánu asi o 0,20 m a vzestup se zrychluje: z 1,3 mm za rok (1901–1971) na 3,7 mm za rok (2006–2018), podle IPCC AR6. Hlavní příčiny: tepelná roztažnost – teplejší voda zabírá víc místa; tání horských ledovců a ledových štítů Grónska a Antarktidy, jejichž voda přitéká z pevniny do moře. Tání plovoucího mořského ledu hladinu nezvedá, protože led už vodu vytlačuje. Podíly na vzestupu v letech 1971–2018: tepelná roztažnost 50 %, horské ledovce 22 %, ledové štíty 20 %, voda z pevniny 8 %.";

const W = 460;
const H = 464;

function Coast() {
  const { id } = useFig();
  const old = 112;
  const now = 98;
  return (
    <g>
      <rect x={0} y={0} width={W} height={150} className="gz6-air" />
      <Liquid d={`M0 ${now} H262 L250 150 H0 Z`} color="var(--blue)" opacity={0.28} />
      <path d="M0 150 L230 150 Q262 120 300 90 L360 70 L460 64 V150 Z" className="gz6-land" />
      <path d="M0 150 L230 150 Q262 120 300 90 L360 70 L460 64 V150 Z" fill={pat(id, "d")} opacity={0.5} />
      <path d="M210 150 Q262 120 300 90 L360 70 L460 64" className="gz6-o" />
      {/* house on the shore */}
      <path d="M308 86 V68 L320 58 L332 68 V83" className="gz6-fill gz6-o" />
      <path d={`M0 ${old} H252`} className="gz6-o gz6-dash" />
      <path d={`M0 ${now} H268`} className="gz6-o gz6-blue-s" style={{ strokeWidth: 2 }} />
      <DrawArrow d={`M200 ${old} V${now + 2}`} tone="blue" delay={0.3} />
      <text x={10} y={old + 18} className="gz6-lbl gz6-sm">
        hladina 1900
      </text>
      <text x={10} y={now - 6} className="gz6-lbl gz6-b gz6-blue-t">
        dnes
      </text>
      <text x={210} y={now + 26} className="gz6-lbl gz6-b gz6-blue-t gz6-halo">
        +0,20 m
      </text>
      <Fade delay={0.2}>
        <text x={10} y={24} className="gz6-lbl gz6-b gz6-big">
          1901–2018: +0,20 m
        </text>
        <text x={10} y={44} className="gz6-lbl gz6-sm">
          1,3 mm/rok (1901–1971) → 3,7 mm/rok (2006–2018)
        </text>
        <text x={W - 8} y={144} textAnchor="end" className="gz6-lbl gz6-sm gz6-muted-t">
          převýšeno
        </text>
      </Fade>
    </g>
  );
}

function Panel({ x, title, lines, children, tone }: { x: number; title: string; lines: string[]; children: React.ReactNode; tone: string }) {
  return (
    <g>
      {children}
      <text x={x + 72} y={286} textAnchor="middle" className={`gz6-lbl gz6-b ${tone}`}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 72} y={303 + i * 16} textAnchor="middle" className="gz6-lbl gz6-sm">
          {l}
        </text>
      ))}
    </g>
  );
}

function Beaker() {
  return (
    <g>
      <Liquid d="M36 222 H108 V256 H36 Z" color="var(--bad)" opacity={0.3} />
      <path d="M36 230 H108" className="gz6-o gz6-dash" />
      <path d="M36 222 H108" className="gz6-o gz6-red-s" style={{ strokeWidth: 1.8 }} />
      <path d="M34 186 V258 H110 V186" className="gz6-o" />
      <DrawArrow d="M100 232 V222" tone="red" delay={0.6} />
      {/* thermometer */}
      <rect x={118} y={192} width={8} height={54} rx={4} className="gz6-tag" />
      <rect x={120} y={208} width={4} height={38} style={{ fill: "var(--bad)" }} />
      <circle cx={122} cy={250} r={7} style={{ fill: "var(--bad)", stroke: "var(--edge)", strokeWidth: 1 }} />
      <path d="M58 266 q6 -10 0 -16 q10 6 6 16 M80 266 q6 -10 0 -16 q10 6 6 16" className="gz6-o gz6-acc-s" />
    </g>
  );
}

function Glacier() {
  const { id } = useFig();
  return (
    <g>
      <Liquid d="M152 236 H226 V262 H152 Z" color="var(--blue)" opacity={0.28} />
      <path d="M226 262 V214 L248 190 L272 182 L296 190 V262 Z" className="gz6-rock gz6-o" />
      <path d="M232 210 Q244 188 272 180 Q290 184 296 188 V204 Q270 198 252 206 Q240 214 232 210 Z" className="gz6-ice gz6-o" />
      <path d="M232 210 Q244 188 272 180 Q290 184 296 188 V204 Q270 198 252 206 Q240 214 232 210 Z" fill={pat(id, "hi")} />
      <DrawArrow d="M240 214 Q232 228 218 238" tone="blue" delay={0.8} />
      <path d="M152 244 H226" className="gz6-o gz6-dash" />
      <path d="M152 236 H226" className="gz6-o gz6-blue-s" style={{ strokeWidth: 1.8 }} />
      <DrawArrow d="M168 246 V236" tone="blue" delay={0.9} />
      <path d="M152 262 H300" className="gz6-o" />
    </g>
  );
}

function SeaIce() {
  return (
    <g>
      {[318, 384].map((gx, k) => (
        <g key={gx}>
          <Liquid d={`M${gx} 224 H${gx + 50} V258 H${gx} Z`} color="var(--blue)" opacity={0.28} />
          <path d={`M${gx} 224 H${gx + 50}`} className="gz6-o gz6-blue-s" style={{ strokeWidth: 1.8 }} />
          <path d={`M${gx - 2} 196 V260 H${gx + 52} V196`} className="gz6-o" />
          {k === 0 && <rect x={gx + 14} y={214} width={20} height={16} rx={2} className="gz6-ice gz6-o" />}
        </g>
      ))}
      <DrawArrow d="M372 210 H382" delay={1.0} />
      <text x={377} y={200} textAnchor="middle" className="gz6-lbl gz6-sm">
        roztaje
      </text>
      <text x={409} y={218} textAnchor="middle" className="gz6-eq gz6-eq-sm gz6-tone-blue">
        stejně
      </text>
    </g>
  );
}

const SHARES: [string, number, string][] = [
  ["tepelná roztažnost 50 %", 50, "gz6-hd-lw"],
  ["ledovce 22 %", 22, "gz6-hd-back"],
  ["štíty 20 %", 20, "gz6-hd-sun"],
  ["8 %", 8, "gz6-hd-heat"],
];

function Shares() {
  let x = 10;
  const BW = W - 20;
  return (
    <g>
      <text x={10} y={372} className="gz6-lbl gz6-b">
        podíl na vzestupu 1971–2018 (IPCC AR6)
      </text>
      {SHARES.map(([t, p, cls], i) => {
        const w = (BW * p) / 100;
        const x0 = x;
        x += w;
        return (
          <Rise key={t} delay={1.1 + i * 0.12}>
            <rect x={x0} y={382} width={w} height={28} className={`gz6-o ${cls}`} style={{ strokeWidth: 1 }} />
            <text x={x0 + w / 2} y={401} textAnchor="middle" className="gz6-eq gz6-eq-sm">
              {t}
            </text>
          </Rise>
        );
      })}
      <text x={10} y={432} className="gz6-lbl gz6-sm">
        ledovce = horské ledovce; štíty = Grónsko a Antarktida;
      </text>
      <text x={10} y={449} className="gz6-lbl gz6-sm">
        8 % = voda z pevniny (hlavně čerpaná podzemní voda)
      </text>
    </g>
  );
}

function Plate() {
  return (
    <>
      <Coast />
      <Panel x={0} title="tepelná roztažnost" lines={["teplejší voda", "zabírá víc místa"]} tone="gz6-red-t">
        <Beaker />
      </Panel>
      <Panel x={154} title="led z pevniny" lines={["ledovce a štíty", "přidají vodu do moře"]} tone="gz6-lvl-t">
        <Glacier />
      </Panel>
      <Panel x={308} title="mořský led ne" lines={["plovoucí led už vodu", "vytlačuje: hladina stejná"]} tone="gz6-muted-t">
        <SeaIce />
      </Panel>
      <Shares />
    </>
  );
}

export default function SeaLevelCauses() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} boost={false} replay>
      <Plate />
    </Figure>
  );
}
