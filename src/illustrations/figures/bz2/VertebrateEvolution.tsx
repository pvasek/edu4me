import { Draw, Fade, Figure, Pop, pat, useFig } from "./kit";

const LABEL =
  "Vývoj obratlovců jako rodokmen s klíčovými novinkami. Nejdříve ryby, asi před 420 miliony let, s čelistmi a ploutvemi. Z ryb vznikli obojživelníci, asi před 370 miliony let, s končetinami místo ploutví, takže mohli vylézt na souš. Z nich plazi, asi před 320 miliony let, s vejcem s blanami (amniotickým), které nevyschne a nepotřebuje vodu. Z plazů se oddělili savci, asi před 200 miliony let, se srstí a mlékem, a ptáci, asi před 150 miliony let, s peřím.";

const W = 400;
const ROWS = [
  { y: 56, name: "Ryby", nov: "čelisti, ploutve", age: "před 420 mil. let", art: "fish" },
  { y: 136, name: "Obojživelníci", nov: "končetiny – na souš", age: "před 370 mil. let", art: "newt" },
  { y: 216, name: "Plazi", nov: "vejce s blanami", age: "před 320 mil. let", art: "lizard" },
  { y: 296, name: "Savci", nov: "srst, mléko", age: "před 200 mil. let", art: "mouse" },
  { y: 376, name: "Ptáci", nov: "peří", age: "před 150 mil. let", art: "bird" },
] as const;

function Fish() {
  const { id } = useFig();
  const d = "M-34 0 Q-14 -18 14 -10 L30 -18 L28 0 L30 18 L14 10 Q-14 18 -34 0Z";
  return (
    <g>
      <path d={d} className="bz2-o bz2-water" />
      <path d={d} fill={pat(id, "d")} />
      <path d="M-6 -14 L2 -24 L8 -12 M-6 14 L0 22 L6 12" className="bz2-o bz2-thin" />
      <circle cx={-24} cy={-3} r={2.2} className="bz2-ink-f" />
      <path d="M-16 -8 Q-12 0 -16 8" className="bz2-o bz2-thin" />
    </g>
  );
}
function Newt() {
  const { id } = useFig();
  const d = "M-36 0 Q-32 -10 -18 -9 L14 -7 Q30 -6 42 -12 Q36 2 14 6 L-18 8 Q-32 8 -36 0Z";
  return (
    <g>
      <path d="M-14 6 L-20 18 M-10 6 L-4 18 M10 5 L4 18 M14 5 L20 17" className="bz2-o" style={{ strokeWidth: 2.2 }} />
      <path d={d} className="bz2-o bz2-leaf" />
      <path d={d} fill={pat(id, "d")} />
      <circle cx={-29} cy={-3} r={2} className="bz2-ink-f" />
    </g>
  );
}
function Lizard() {
  const { id } = useFig();
  const d = "M-40 -2 Q-34 -10 -22 -8 L12 -8 Q34 -8 46 4 Q30 0 12 6 L-22 6 Q-34 6 -40 -2Z";
  return (
    <g>
      <path d="M-16 4 L-24 14 L-30 14 M-12 4 L-6 14 L0 14 M8 5 L2 15 L-4 15 M12 5 L18 15 L24 15" className="bz2-o" style={{ strokeWidth: 2 }} />
      <path d={d} className="bz2-o bz2-leaf2" />
      <path d={d} fill={pat(id, "x")} />
      <circle cx={-32} cy={-4} r={1.8} className="bz2-ink-f" />
    </g>
  );
}
function Mouse() {
  const { id } = useFig();
  const d = "M-30 4 Q-28 -8 -14 -14 Q8 -22 24 -6 Q30 6 20 10 L-20 10 Q-30 10 -30 4Z";
  return (
    <g>
      <path d="M24 4 Q44 6 50 -6" className="bz2-o" />
      <path d={d} className="bz2-o bz2-fill3" />
      <path d={d} fill={pat(id, "v")} opacity={0.7} />
      <circle cx={-14} cy={-14} r={6} className="bz2-o bz2-fill3" />
      <circle cx={-24} cy={-2} r={1.8} className="bz2-ink-f" />
      <path d="M-30 4 l-6 -2 M-30 5 l-6 2" className="bz2-o bz2-hair" />
      <path d="M-12 10 v6 M12 10 v6" className="bz2-o" />
    </g>
  );
}
function Bird() {
  const { id } = useFig();
  return (
    <g>
      <path d="M-4 -2 Q10 -30 34 -30 Q22 -20 18 -4Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M-4 -2 Q10 -30 34 -30 Q22 -20 18 -4Z" fill={pat(id, "b")} />
      <path d="M-26 -6 Q-22 -16 -12 -14 Q4 -10 20 -2 L38 4 L22 6 Q0 12 -16 6 Q-24 2 -26 -6Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M-26 -8 L-34 -6 L-26 -4" className="bz2-o bz2-gold" />
      <circle cx={-19} cy={-9} r={1.8} className="bz2-ink-f" />
      <path d="M-4 8 v8 M4 8 v8" className="bz2-o bz2-thin" />
    </g>
  );
}

const ART = { fish: Fish, newt: Newt, lizard: Lizard, mouse: Mouse, bird: Bird };

export default function VertebrateEvolution() {
  const TX = 36; // trunk
  const BX = 104; // silhouettes
  return (
    <Figure level={5} label={LABEL} w={W} h={444} max={540} replay>
      {/* trunk: ryby → obojživelníci → plazi → (savci, ptáci) */}
      <Draw d={`M${TX} 20 V376`} className="bz2-o bz2-lvl-s" style={{ strokeWidth: 3 }} />
      {ROWS.map((r, i) => {
        const A = ART[r.art];
        return (
          <g key={r.name}>
            <Draw d={`M${TX} ${r.y} H${BX - 46}`} className="bz2-o bz2-lvl-s" style={{ strokeWidth: 3 }} delay={0.2 + i * 0.15} />
            {/* the innovation mark on the branch */}
            <Pop delay={0.5 + i * 0.15}>
              <rect x={TX + 10} y={r.y - 7} width={6} height={14} rx={1.5} className="bz2-o bz2-lvl-f" />
            </Pop>
            <Pop delay={0.4 + i * 0.15}>
              <g transform={`translate(${BX + 6} ${r.y}) scale(1.25)`}>
                <A />
              </g>
            </Pop>
            <Fade delay={0.5 + i * 0.15}>
              <text x={BX + 74} y={r.y - 10} className="bz2-lbl bz2-b bz2-big">{r.name}</text>
              <text x={BX + 74} y={r.y + 13} className="bz2-lbl bz2-sm bz2-b bz2-lvl-t">+ {r.nov}</text>
              <text x={BX + 74} y={r.y + 34} className="bz2-lbl bz2-xs bz2-muted-t">{r.age}</text>
            </Fade>
          </g>
        );
      })}
      <circle cx={TX} cy={20} r={4} className="bz2-o bz2-lvl-f" />
      <text x={TX + 10} y={16} className="bz2-lbl bz2-sm bz2-muted-t">předek</text>
      <text x={TX - 6} y={438} className="bz2-lbl bz2-xs bz2-muted-t">
        ▮ = novinka, která se objevila u této skupiny
      </text>
    </Figure>
  );
}
