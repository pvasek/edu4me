import { Arrow, Effect, Fade, Figure, Lbl, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Řez lupenitým lišejníkem na kůře stromu. Nahoře svrchní kůra z hustě propletených vláken houby, pod ní vrstva zelených řas, které fotosyntézou vyrábějí cukry, uprostřed dřeň z volných vláken houby, dole spodní kůra a příchytná vlákna, kterými lišejník drží na kůře. Houba dává řasám vodu, minerální látky a úkryt, řasy houbě cukry. Dole tři typy soužití: vzájemně prospěšné (mutualismus, houba a řasa, obě strany +), komenzalismus (lišejník na stromě, + a 0) a parazitismus (klíště a člověk, + a −).";

const W = 440;
const H = 452;
const L = 16;
const R = 262;

function Section() {
  const { id } = useFig();
  const r = rng(9);
  const top = (x: number) => 34 + 4 * Math.sin(x / 22) + 2 * Math.sin(x / 7);
  const topPath: string[] = [];
  for (let x = L; x <= R; x += 4) topPath.push(`${x} ${f1(top(x))}`);
  const outline = `M${topPath.join(" L")} L${R} 190 L${L} 190 Z`;
  // hyphae in the medulla
  const hy: string[] = [];
  for (let i = 0; i < 26; i++) {
    const x = L + 6 + r() * (R - L - 12);
    const y = 104 + r() * 60;
    const a = (r() - 0.5) * 1.6;
    hy.push(`M${f1(x)} ${f1(y)} q${f1(Math.cos(a) * 12)} ${f1(-6 + r() * 12)} ${f1(Math.cos(a) * 26)} ${f1(Math.sin(a) * 18)}`);
  }
  const algae: [number, number][] = [];
  for (let x = L + 10; x < R - 6; x += 15) algae.push([x + r() * 5, 76 + r() * 16]);
  const rh: string[] = [];
  for (let x = L + 20; x < R - 10; x += 38) rh.push(`M${x} 190 C${x - 3} 200 ${x + 4} 208 ${x} 222`);
  return (
    <g>
      {/* bark */}
      <rect x={L - 6} y={220} width={R - L + 12} height={22} className="bz1-cap" />
      <rect x={L - 6} y={220} width={R - L + 12} height={22} fill={pat(id, "dd")} />
      <path d={`M${L - 6} 220 H${R + 6}`} className="bz1-o" />
      <path d={rh.join(" ")} className="bz1-hypha" style={{ strokeWidth: 2, stroke: "var(--ink)" }} />
      <path d={outline} className="bz1-cyto" />
      {/* upper cortex */}
      <path d={`M${topPath.join(" L")} L${R} 58 L${L} 58 Z`} className="bz1-fill2" />
      <path d={`M${topPath.join(" L")} L${R} 58 L${L} 58 Z`} fill={pat(id, "xd")} />
      {/* algal layer */}
      <path d={`M${L} 66 C${L + 30} 60 ${R - 30} 72 ${R} 64 V100 C${R - 40} 104 ${L + 40} 96 ${L} 102 Z`} className="bz1-leaf2" />
      {algae.map(([x, y], i) => (
        <circle key={i} cx={f1(x)} cy={f1(y)} r={5.4} className="bz1-o bz1-thin bz1-chl" />
      ))}
      <path d={hy.join(" ")} className="bz1-hypha" />
      {/* lower cortex */}
      <rect x={L} y={176} width={R - L} height={14} className="bz1-fill2" />
      <rect x={L} y={176} width={R - L} height={14} fill={pat(id, "xd")} />
      <path d={outline} className="bz1-o" style={{ strokeWidth: 1.8 }} />
    </g>
  );
}

const RELS = [
  { name: "mutualismus", note: "oba získávají", a: "houba", b: "řasa", ea: "+", eb: "+", both: true },
  { name: "komenzalismus", note: "druhému nevadí", a: "lišejník", b: "strom", ea: "+", eb: "0", both: false },
  { name: "parazitismus", note: "jeden škodí druhému", a: "klíště", b: "člověk", ea: "+", eb: "−", both: false },
] as const;

export default function LichenSection() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={580} replay>
      <Fade>
        <Section />
      </Fade>
      <Fade delay={0.6}>
        <Lbl x={278} y={36} tx={R - 6} ty={46}>
          {"svrchní kůra\n(vlákna houby)"}
        </Lbl>
        <Lbl x={278} y={92} tx={R - 14} ty={84} className="bz1-b bz1-lvl-t">
          {"řasy\n(fotosyntéza)"}
        </Lbl>
        <Lbl x={278} y={142} tx={R - 20} ty={134}>
          {"dřeň\n(hyfy houby)"}
        </Lbl>
        <Lbl x={278} y={190} tx={R - 4} ty={183} sec>
          spodní kůra
        </Lbl>
        <Lbl x={278} y={216} tx={R - 18} ty={206}>
          příchytná vlákna
        </Lbl>
        <Lbl x={278} y={240} tx={R + 4} ty={234} className="bz1-sm bz1-muted-t" sec>
          kůra stromu
        </Lbl>
      </Fade>
      <Fade delay={0.9}>
        <text x={L + 6} y={20} className="bz1-lbl bz1-sm bz1-muted-t">
          řez lišejníkem
        </text>
      </Fade>
      <Fade delay={1.1}>
        <path d={`M12 262 H${W - 12}`} className="bz1-o bz1-thin bz1-dash" style={{ opacity: 0.5 }} />
        <text x={W / 2} y={288} textAnchor="middle" className="bz1-title">
          Soužití organismů
        </text>
      </Fade>
      {RELS.map((r, i) => {
        const y = 314 + i * 48;
        return (
          <Pop key={r.name} delay={1.3 + i * 0.25}>
            <text x={14} y={y + 2} className="bz1-lbl bz1-b">
              {r.name}
            </text>
            <text x={14} y={y + 21} className="bz1-lbl bz1-sm bz1-muted-t">
              {r.note}
            </text>
            <Effect x={176} y={y - 3} s={r.ea} />
            <text x={192} y={y + 3} className="bz1-lbl bz1-b">
              {r.a}
            </text>
            <Arrow d={`M252 ${y - 3} H${300}`} tone={r.both ? "lvl" : "ink"} both={r.both} />
            <Effect x={322} y={y - 3} s={r.eb} />
            <text x={338} y={y + 3} className="bz1-lbl bz1-b">
              {r.b}
            </text>
          </Pop>
        );
      })}
    </Figure>
  );
}
