import { DrawArrow, Figure, Rise, useCompact } from "./kit";

const LABEL =
  "Hierarchie sídel jako pyramida. Dole je samota a vesnice: takových sídel je nejvíc, jsou malá a mají málo služeb. Výš je město, velkoměsto (nad 100 000 obyvatel, například Brno), metropole (Praha) a nahoře megalopole, souvislý pás velkoměst jako Boston–Washington. Čím výš, tím méně sídel, ale tím jsou větší a nabízejí víc služeb, například univerzitu, divadlo, ministerstva nebo mezinárodní letiště.";

interface Tier {
  name: string;
  ex: string;
  srv: string;
  /** narrow layout: example and services in shorter lines */
  nx: string[];
}

const TIERS: Tier[] = [
  {
    name: "megalopole",
    ex: "pás velkoměst Boston–Washington",
    srv: "světové centrum financí a obchodu",
    nx: ["Boston–Washington", "světové finance, obchod"],
  },
  {
    name: "metropole",
    ex: "Praha (≐ 1,4 mil. obyv.), Paříž",
    srv: "vláda, mezinárodní letiště, centrály firem",
    nx: ["Praha, Paříž", "vláda, velké letiště"],
  },
  {
    name: "velkoměsto",
    ex: "nad 100 000 obyv.: Brno, Ostrava",
    srv: "univerzita, divadlo, velká nemocnice",
    nx: ["Brno, Ostrava", "univerzita, divadlo"],
  },
  {
    name: "město",
    ex: "Písek, Třebíč",
    srv: "střední škola, nemocnice, úřady",
    nx: ["Písek, Třebíč", "střední škola, nemocnice"],
  },
  {
    name: "vesnice",
    ex: "desítky až stovky obyvatel",
    srv: "obchod, hospoda, někdy základní škola",
    nx: ["stovky obyvatel", "obchod, hospoda"],
  },
  {
    name: "samota",
    ex: "hájovna, mlýn, statek",
    srv: "žádné služby",
    nx: ["hájovna, statek", "žádné služby"],
  },
];

export default function SettlementHierarchy() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 400 : 660;
  const top = 46;
  const th = n ? 54 : 50; // tier height
  const H = top + th * TIERS.length + 28;
  // pyramid geometry
  const cx = n ? 112 : 196;
  const half = n ? 86 : 140; // half width at the base
  const py0 = top;
  const py1 = top + th * TIERS.length;
  const k = th * (n ? 3 : 2.2); // keeps the apex wide enough for its name
  const hw = (y: number) => (half * (y - py0 + k)) / (py1 - py0 + k);
  const tx = n ? 212 : 352;
  return (
    <Figure level={5} label={LABEL} w={W} h={H} max={700} compact={compact} boost={false} replay>
      {/* axis arrows */}
      <DrawArrow d={`M14 ${py1} V${py0 + 4}`} tone="lvl" delay={0.1} />
      <text
        x={0}
        y={0}
        transform={`translate(30 ${(py0 + py1) / 2}) rotate(-90)`}
        textAnchor="middle"
        className="gz4-lbl gz4-sm gz4-lvl-t"
      >
        větší sídla, víc služeb ↑
      </text>
      <text x={tx} y={26} className="gz4-lbl gz4-b">
        {n ? "příklad · služby" : "příklad · nabídka služeb"}
      </text>
      <text x={cx} y={26} textAnchor="middle" className="gz4-lbl gz4-sm gz4-muted-t">
        nejméně sídel
      </text>
      <text x={cx} y={py1 + 20} textAnchor="middle" className="gz4-lbl gz4-sm gz4-muted-t">
        nejvíc sídel
      </text>

      {TIERS.map((t, i) => {
        const y0 = py0 + i * th;
        const y1 = y0 + th;
        const a = hw(y0);
        const b = hw(y1);
        const d = `M${cx - a} ${y0} H${cx + a} L${cx + b} ${y1} H${cx - b} Z`;
        return (
          <Rise key={t.name} delay={0.15 + (TIERS.length - 1 - i) * 0.12}>
            <path d={d} className={`gz4-sh-t${i}`} />
            <path d={d} className="gz4-o gz4-thin" />
            <text
              x={cx}
              y={y0 + th / 2 + 5.5}
              textAnchor="middle"
              className={`gz4-lbl gz4-b ${i < 2 ? "gz4-light-t" : ""}`}
              style={i === 0 ? { fontSize: n ? 13.5 : 15.5 } : undefined}
            >
              {t.name}
            </text>
            <path d={`M${cx + (a + b) / 2 + 6} ${y0 + th / 2} H${tx - 8}`} className="gz4-lead gz4-dot2" />
            {n ? (
              <>
                <text x={tx} y={y0 + th / 2 - 4} className="gz4-lbl gz4-sm gz4-b">
                  {t.nx[0]}
                </text>
                <text x={tx} y={y0 + th / 2 + 15} className="gz4-lbl gz4-sm">
                  {t.nx[1]}
                </text>
              </>
            ) : (
              <>
                <text x={tx} y={y0 + th / 2 - 3} className="gz4-lbl gz4-b">
                  {t.ex}
                </text>
                <text x={tx} y={y0 + th / 2 + 16} className="gz4-lbl gz4-sm">
                  {t.srv}
                </text>
              </>
            )}
          </Rise>
        );
      })}
    </Figure>
  );
}
