import { DrawArrow, Fade, Figure, Pop, f1, pat, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Odlesňování Amazonie. Při pohledu shora tvoří vykácený les vzor rybí kosti: od hlavní silnice odbočují boční cesty a podél nich lidé kácejí a vypalují les. Na vykácených pruzích vznikají pastviny pro dobytek, které zabírají většinu odlesněné plochy, a později sójová pole. Sled: deštný les, těžba dřeva a vypálení, pastvina, sójové pole, až nakonec vyčerpaná degradovaná půda, kterou eroze odnáší.";

const STEPS = [
  { k: "forest", t: "deštný les", s: "" },
  { k: "fire", t: "těžba a vypálení", s: "podél cest" },
  { k: "cow", t: "pastvina pro dobytek", s: "zabírá většinu" },
  { k: "soy", t: "sójové pole", s: "krmivo na vývoz" },
  { k: "bare", t: "degradovaná půda", s: "živiny a ornice mizí" },
] as const;

function Aerial({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const { id } = useFig();
  const R = rng(5);
  const my = y + h * 0.5;
  const road = `M${x} ${f1(my + 8)} Q${f1(x + w * 0.5)} ${f1(my - 10)} ${x + w} ${f1(my + 4)}`;
  const roadY = (xx: number) => {
    const t = (xx - x) / w;
    return (1 - t) * (1 - t) * (my + 8) + 2 * (1 - t) * t * (my - 10) + t * t * (my + 4);
  };
  const sides: { x: number; y0: number; y1: number; old: boolean }[] = [];
  for (let xx = x + 28; xx < x + w - 14; xx += 44) {
    const ry = roadY(xx);
    const up = 50 + R() * (h * 0.5 - 62);
    const dn = 46 + R() * (h * 0.5 - 60);
    sides.push({ x: xx, y0: Math.max(y + 18, ry - up), y1: Math.min(y + h - 10, ry + dn), old: R() < 0.5 });
  }
  const trees = Array.from({ length: Math.round((w * h) / 150) }, () => [x + 4 + R() * (w - 8), y + 4 + R() * (h - 8), 3 + R() * 2.4]);
  const cleared = (px: number, py: number) =>
    Math.abs(py - roadY(px)) < 20 || sides.some((s) => Math.abs(px - s.x) < 9 && py > s.y0 - 4 && py < s.y1 + 4);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className="gz4-forest" />
      {trees
        .filter(([tx, ty]) => !cleared(tx, ty))
        .map(([tx, ty, r], i) => (
          <circle key={i} cx={f1(tx)} cy={f1(ty)} r={f1(r)} className="gz4-forest-d gz4-df-crown" />
        ))}
      {/* cleared strips along the roads: pasture, older parts soy */}
      <path d={`M${x} ${f1(my - 12)} Q${f1(x + w * 0.5)} ${f1(my - 30)} ${x + w} ${f1(my - 16)} L${x + w} ${f1(my + 24)} Q${f1(x + w * 0.5)} ${f1(my + 10)} ${x} ${f1(my + 28)} Z`} className="gz4-df-pasture" />
      {sides.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 8} y={s.y0} width={16} height={s.y1 - s.y0} className="gz4-df-pasture" />
          {s.old && (
            <>
              <rect x={s.x - 7} y={roadY(s.x) + 12} width={14} height={(s.y1 - roadY(s.x)) * 0.5} className="gz4-field" />
              <rect x={s.x - 7} y={roadY(s.x) + 12} width={14} height={(s.y1 - roadY(s.x)) * 0.5} fill={pat(id, "v")} />
            </>
          )}
        </g>
      ))}
      {/* roads */}
      {sides.map((s, i) => (
        <path key={i} d={`M${s.x} ${f1(s.y0)} V${f1(s.y1)}`} className="gz4-df-track" />
      ))}
      <path d={road} className="gz4-df-road" />
      {/* smoke from fires at the forest edge */}
      {sides.slice(1, 6).map((s, i) =>
        i % 2 ? null : (
          <g key={i}>
            <circle cx={s.x} cy={s.y0 - 3} r={3.2} className="gz4-df-fire" />
            <path d={`M${s.x} ${s.y0 - 6} q5 -6 1 -12 q-4 -6 3 -11`} className="gz4-o gz4-thin gz4-faint" />
          </g>
        ),
      )}
      <rect x={x} y={y} width={w} height={h} rx={8} className="gz4-o" />
      <text x={x + 10} y={f1(my + 44)} className="gz4-lbl gz4-sm gz4-b gz4-halo">
        silnice
      </text>
    </g>
  );
}

function Glyph({ k }: { k: (typeof STEPS)[number]["k"] }) {
  switch (k) {
    case "forest":
      return (
        <>
          {[-9, 0, 9].map((dx, i) => (
            <circle key={dx} cx={dx} cy={i === 1 ? -4 : 0} r={7} className="gz4-forest-d gz4-o gz4-thin" />
          ))}
          <path d="M0 3 V12" className="gz4-o gz4-thin" />
        </>
      );
    case "fire":
      return (
        <>
          <path d="M-8 12 q-4 -12 4 -20 q0 8 4 6 q-2 -8 6 -14 q4 14 2 28 Z" className="gz4-fs-fire gz4-o gz4-thin" />
          <path d="M-14 12 H14" className="gz4-o gz4-thin" />
        </>
      );
    case "cow":
      return (
        <g transform="scale(1.2)">
          <path d="M-7 -6 V0 M-3 -6 V0 M4 -6 V0 M7 -6 V0" transform="translate(0 8)" className="gz4-o gz4-thin" />
          <path d="M-10 -6 Q-12 -15 -2 -15 Q8 -16 10 -10 L14 -13 L16 -9 L12 -7 Q10 -5 6 -5 H-8 Z" transform="translate(0 8)" className="gz4-fs-cow gz4-o gz4-thin" />
        </g>
      );
    case "soy":
      return (
        <>
          {[-10, -3, 4, 11].map((dx) => (
            <path key={dx} d={`M${dx} 12 V-6 M${dx} -2 l-4 -4 M${dx} 2 l4 -4 M${dx} -6 l-3 -4`} className="gz4-leafline" style={{ strokeWidth: 1.2 }} />
          ))}
          <path d="M-14 12 H14" className="gz4-o gz4-thin" />
        </>
      );
    case "bare":
      return (
        <>
          <path d="M-15 12 V2 Q0 -2 15 4 V12 Z" className="gz4-soil gz4-o gz4-thin" />
          <path d="M-8 4 l3 4 l-2 4 M4 3 l-2 5 l3 4" className="gz4-o gz4-thin" />
        </>
      );
  }
}

function Chain({ x, y, gap }: { x: number; y: number; gap: number }) {
  return (
    <>
      {STEPS.map((s, i) => {
        const yy = y + i * gap;
        return (
          <g key={s.k}>
            <Pop delay={0.3 + i * 0.15}>
              <rect x={x} y={yy - 20} width={44} height={40} rx={8} className={i === 0 ? "gz4-box" : i === STEPS.length - 1 ? "gz4-box-lvl" : "gz4-box"} />
              <g transform={`translate(${x + 22} ${yy})`}>
                <Glyph k={s.k} />
              </g>
            </Pop>
            <Fade delay={0.4 + i * 0.15}>
              <text x={x + 56} y={yy + (s.s ? -2 : 5)} className="gz4-lbl gz4-b">
                {s.t}
              </text>
              {s.s && (
                <text x={x + 56} y={yy + 16} className="gz4-lbl gz4-sm gz4-muted-t">
                  {s.s}
                </text>
              )}
            </Fade>
            {i < STEPS.length - 1 && (
              <DrawArrow d={`M${x + 22} ${yy + 22} V${yy + gap - 22}`} tone="lvl" delay={0.45 + i * 0.15} />
            )}
          </g>
        );
      })}
    </>
  );
}

export default function Deforestation() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 400 : 680;
  const H = n ? 300 + 5 * 58 + 6 : 380;
  return (
    <Figure level={7} label={LABEL} w={W} h={H} max={720} compact={compact} boost={false} replay>
      <Inner n={n} W={W} />
    </Figure>
  );
}

function Inner({ n, W }: { n: boolean; W: number }) {
  return n ? (
    <>
      <Aerial x={6} y={30} w={W - 12} h={250} />
      <text x={8} y={20} className="gz4-lbl gz4-b">
        pohled shora: „rybí kost“
      </text>
      <Chain x={10} y={326} gap={58} />
    </>
  ) : (
    <>
      <text x={10} y={22} className="gz4-lbl gz4-b">
        pohled shora: vzor „rybí kosti“
      </text>
      <Aerial x={8} y={34} w={390} h={334} />
      <Chain x={428} y={58} gap={74} />
    </>
  );
}
