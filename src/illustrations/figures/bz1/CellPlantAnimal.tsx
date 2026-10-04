import { StepStrip } from "../../sequence/StepFigure";
import { Body, Chloro, Figure, Frame, Lbl, Mito, Nucleus, f1, pat, useFig } from "./kit";

const LABEL =
  "Živočišná a rostlinná buňka vedle sebe. Obě mají cytoplazmatickou membránu, cytoplazmu, jádro s jadérkem a mitochondrie, ve kterých se uvolňuje energie. Jen rostlinná buňka má navíc pevnou buněčnou stěnu, zelené chloroplasty, ve kterých probíhá fotosyntéza, a velkou vakuolu s buněčnou šťávou, která odtlačí jádro ke straně. Živočišná buňka stěnu nemá, a proto může měnit tvar.";

const W = 340;
const H = 262;

function PlantCell() {
  const { id } = useFig();
  const wall =
    "M28 22 H194 Q206 22 206 34 V236 Q206 248 194 248 H28 Q16 248 16 236 V34 Q16 22 28 22 Z M32 30 Q24 30 24 38 V232 Q24 240 32 240 H190 Q198 240 198 232 V38 Q198 30 190 30 Z";
  const vac =
    "M64 66 C64 52 84 50 112 51 C148 52 170 50 174 68 C180 98 178 148 172 170 C166 190 140 192 110 191 C82 190 64 182 64 152 Z";
  return (
    <Frame w={W} h={H}>
      <rect x={24} y={30} width={174} height={210} rx={8} className="bz1-cyto" />
      <rect x={24} y={30} width={174} height={210} rx={8} fill={pat(id, "dots")} opacity={0.5} />
      <Body d={wall} fill="bz1-wall" hatch="d" style={{ fillRule: "evenodd" }} />
      <rect x={29} y={35} width={164} height={200} rx={6} className="bz1-o bz1-thin" />
      <Body d={vac} fill="bz1-vac" hatch="h" />
      {(
        [
          [44, 74, 90],
          [44, 124, 90],
          [44, 170, 80],
          [98, 42, 0],
          [148, 42, 0],
          [184, 92, 90],
          [184, 140, 95],
        ] as const
      ).map(([x, y, r]) => (
        <Chloro key={`${x}-${y}`} x={x} y={y} rot={r} rx={11.5} ry={6.2} />
      ))}
      <Nucleus x={72} y={214} r={22} ry={16} />
      <Mito x={128} y={218} rx={13} ry={6.5} rot={-8} />
      <Mito x={172} y={214} rx={12} ry={6.5} rot={20} />
      <circle cx={108} cy={226} r={2} className="bz1-ribo" />
      <circle cx={150} cy={230} r={2} className="bz1-ribo" />
      <Lbl x={214} y={36} tx={203} ty={52} className="bz1-b bz1-lvl-t">
        {"buněčná\nstěna"}
      </Lbl>
      <Lbl x={214} y={86} tx={193} ty={72}>
        membrána
      </Lbl>
      <Lbl x={214} y={114} tx={168} ty={112} className="bz1-b bz1-lvl-t">
        vakuola
      </Lbl>
      <Lbl x={214} y={146} tx={190} ty={140} className="bz1-b bz1-lvl-t">
        chloroplast
      </Lbl>
      <Lbl x={214} y={180} tx={176} ty={190}>
        cytoplazma
      </Lbl>
      <Lbl x={214} y={212} tx={184} ty={214}>
        mitochondrie
      </Lbl>
      <Lbl x={214} y={244} tx={90} ty={218}>
        jádro
      </Lbl>
    </Frame>
  );
}

/** Wobbly closed outline around (cx, cy). */
function blob(cx: number, cy: number, r: number, k: (a: number) => number) {
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r + k(a);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.92] as const;
  });
  const mid = (i: number) => {
    const a = pts[i % n];
    const b = pts[(i + 1) % n];
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const;
  };
  let d = `M${f1(mid(0)[0])} ${f1(mid(0)[1])}`;
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n];
    const m = mid(i);
    d += ` Q${f1(p[0])} ${f1(p[1])} ${f1(m[0])} ${f1(m[1])}`;
  }
  return d + "Z";
}

function AnimalCell() {
  const { id } = useFig();
  const d = blob(104, 134, 88, (a) => 2.5 * Math.sin(3 * a) + 3 * Math.cos(5 * a + 1));
  return (
    <Frame w={W} h={H}>
      <path d={d} className="bz1-cyto" />
      <path d={d} fill={pat(id, "dots")} opacity={0.5} />
      <path d={d} className="bz1-o" style={{ strokeWidth: 2 }} />
      <Nucleus x={98} y={128} r={30} ry={26} />
      <Mito x={50} y={92} rot={35} />
      <Mito x={146} y={74} rot={-20} />
      <Mito x={58} y={186} rot={-30} />
      <Mito x={150} y={190} rot={15} />
      <Mito x={170} y={134} rot={84} rx={14} />
      {(
        [
          [78, 66],
          [120, 196],
          [40, 140],
          [154, 108],
          [96, 176],
        ] as const
      ).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} className="bz1-o bz1-thin bz1-vac" />
      ))}
      {Array.from({ length: 14 }, (_, i) => {
        const a = i * 2.4;
        const r = 44 + ((i * 13) % 30);
        return (
          <circle key={i} cx={f1(104 + Math.cos(a) * r)} cy={f1(134 + Math.sin(a) * r * 0.9)} r={1.8} className="bz1-ribo" />
        );
      })}
      <Lbl x={214} y={50} tx={170} ty={74}>
        membrána
      </Lbl>
      <Lbl x={214} y={112} tx={122} ty={118}>
        jádro
      </Lbl>
      <Lbl x={214} y={162} tx={176} ty={164}>
        cytoplazma
      </Lbl>
      <Lbl x={214} y={210} tx={162} ty={194}>
        mitochondrie
      </Lbl>
    </Frame>
  );
}

export default function CellPlantAnimal() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive>
      <div className="bz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={280}
          steps={[
            {
              title: "Živočišná buňka",
              art: <AnimalCell />,
              caption: "Nemá buněčnou stěnu, a proto může měnit tvar. Nemá ani chloroplasty.",
            },
            {
              title: "Rostlinná buňka",
              art: <PlantCell />,
              caption: "Navíc má buněčnou stěnu, chloroplasty a velkou vakuolu.",
            },
          ]}
        />
        <p className="bz1-strip-note">
          Společné: membrána, cytoplazma, jádro, mitochondrie.{" "}
          <span style={{ color: "var(--lvl-ink)" }}>Jen u rostlin: stěna, chloroplasty, velká vakuola.</span>
        </p>
      </div>
    </Figure>
  );
}
