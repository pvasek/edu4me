import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, f1, pat, useFig, type P2 } from "./kit";
import { T, poly } from "./land";

const LABEL =
  "Vrásy a zlomy v blokdiagramu. Když vnitřní síly vrstvy hornin stlačují z boků, vrstvy se zprohýbají do vrás: vyklenutá část vrásy je antiklinála (sedlo), prohnutá synklinála (koryto); tak vznikla vrásová pohoří jako Alpy nebo Himálaj. Když síly zemskou kůru roztahují, popraská na kry podél zlomů: vyzdvižená kra je hrásť, poklesnutá kra mezi zlomy je příkopová propadlina, například Hornorýnský prolom mezi Vogézami a Schwarzwaldem nebo u nás Oherský příkop pod Krušnými horami.";

const W = 300;
const H = 220;
const DX = 26; // depth of the block diagram
const DY = -18;
const L = 30;
const R = 250;
const B = 198;
const LAYERS = ["gz2-sed", "gz2-lime", "gz2-rock", "gz2-sand", "gz2-rock2"];

function Folds() {
  return (
    <Frame w={W} h={H}>
      <FoldsArt />
    </Frame>
  );
}

function FoldsArt() {
  const { id } = useFig();
  const top = (x: number, k: number) => 84 + k * 22 - 26 * Math.cos((2 * Math.PI * (x - 95)) / 220);
  const curve = (k: number) => {
    const pts: P2[] = [];
    for (let x = L; x <= R; x += 5) pts.push([x, top(x, k)]);
    return pts;
  };
  const back = (pts: P2[]) => pts.map(([x, y]) => [x + DX, y + DY] as P2);
  const c0 = curve(0);
  return (
    <>
      {/* top face (the folded land surface) */}
      <path d={poly([...c0, ...back(c0).reverse()])} className="gz2-grass gz2-o gz2-thin" />
      {/* right side face */}
      <path d={poly([[R, top(R, 0)], [R + DX, top(R, 0) + DY], [R + DX, B + DY], [R, B]])} className="gz2-rock gz2-o gz2-thin" />
      <path d={poly([[R, top(R, 0)], [R + DX, top(R, 0) + DY], [R + DX, B + DY], [R, B]])} fill={pat(id, "d")} opacity={0.4} />
      {/* front face: the folded strata */}
      {LAYERS.map((cls, k) => {
        const a = curve(k);
        return <path key={k} d={poly([...a, [R, B], [L, B]])} className={cls} />;
      })}
      {LAYERS.map((_, k) => (
        <path key={`o${k}`} d={poly(curve(k), false)} className="gz2-o gz2-thin" />
      ))}
      <path d={poly([...c0, [R, B], [L, B]])} fill={pat(id, "dots")} opacity={0.4} />
      <path d={poly([...c0, [R, B], [L, B]])} className="gz2-o" />
      {/* axial lines */}
      <path d={`M95 ${top(95, 0)} V${B}`} className="gz2-o gz2-thin gz2-dash" />
      <path d={`M205 ${top(205, 0)} V${B}`} className="gz2-o gz2-thin gz2-dash" />
      <Arrow d={`M4 140 H${L - 4}`} tone="red" className="gz2-vec" />
      <Arrow d={`M${W - 2} 140 H${R + DX + 6}`} tone="red" className="gz2-vec" />
      <T x={95} y={34} cls="gz2-b">antiklinála</T>
      <T x={95} y={50} cls="gz2-sm">(sedlo)</T>
      <T x={205} y={70} cls="gz2-b">synklinála</T>
      <T x={205} y={86} cls="gz2-sm">(koryto)</T>
      <T x={16} y={128} a="start" cls="gz2-sm gz2-b gz2-red-t">tlak</T>
      <T x={W - 4} y={128} a="end" cls="gz2-sm gz2-b gz2-red-t">tlak</T>
    </>
  );
}

function Faults() {
  return (
    <Frame w={W} h={H}>
      <FaultsArt />
    </Frame>
  );
}

function FaultsArt() {
  const { id } = useFig();
  const T0 = 70; // top of the horsts
  const T1 = 116; // top of the graben
  // faults dip towards the graben (normal faults)
  const f1x = (y: number) => 112 + ((y - T0) * 22) / (B - T0);
  const f2x = (y: number) => 192 - ((y - T0) * 22) / (B - T0);
  const blocks: { pts: P2[]; top: number; shift: number }[] = [
    { pts: [[L, T0], [f1x(T0), T0], [f1x(B), B], [L, B]], top: T0, shift: 0 },
    { pts: [[f1x(T1), T1], [f2x(T1), T1], [f2x(B), B], [f1x(B), B]], top: T1, shift: T1 - T0 },
    { pts: [[f2x(T0), T0], [R, T0], [R, B], [f2x(B), B]], top: T0, shift: 0 },
  ];
  const strata = [96, 122, 148, 174];
  return (
    <>
      {/* top faces */}
      {blocks.map((b, i) => {
        const [a, c] = [b.pts[0], b.pts[1]];
        return <path key={i} d={poly([a, c, [c[0] + DX, c[1] + DY], [a[0] + DX, a[1] + DY]])} className="gz2-grass gz2-o gz2-thin" />;
      })}
      {/* fault scarps above the graben */}
      <path d={poly([[f1x(T0), T0], [f1x(T0) + DX, T0 + DY], [f1x(T1) + DX, T1 + DY], [f1x(T1), T1]])} className="gz2-rock2 gz2-o gz2-thin" />
      <path d={poly([[f2x(T0), T0], [f2x(T0) + DX, T0 + DY], [f2x(T1) + DX, T1 + DY], [f2x(T1), T1]])} className="gz2-rock gz2-o gz2-thin" />
      {/* right side face */}
      <path d={poly([[R, T0], [R + DX, T0 + DY], [R + DX, B + DY], [R, B]])} className="gz2-rock gz2-o gz2-thin" />
      <path d={poly([[R, T0], [R + DX, T0 + DY], [R + DX, B + DY], [R, B]])} fill={pat(id, "d")} opacity={0.4} />
      {/* front faces with offset strata */}
      {blocks.map((b, i) => {
        const clip = `${id}-blk${i}`;
        const xs = b.pts.map((p) => p[0]);
        return (
          <g key={i}>
            <defs>
              <clipPath id={clip}>
                <path d={poly(b.pts)} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clip})`}>
              <rect x={Math.min(...xs)} y={b.top} width={Math.max(...xs) - Math.min(...xs)} height={B - b.top} className={LAYERS[0]} />
              {strata.map((y, k) => (
                <rect key={y} x={Math.min(...xs)} y={y + b.shift} width={Math.max(...xs) - Math.min(...xs)} height={B} className={LAYERS[(k + 1) % LAYERS.length]} />
              ))}
              {strata.map((y) => (
                <path key={`l${y}`} d={`M${f1(Math.min(...xs))} ${y + b.shift} H${f1(Math.max(...xs))}`} className="gz2-o gz2-thin" />
              ))}
            </g>
            <path d={poly(b.pts)} fill={pat(id, "dots")} opacity={0.4} />
            <path d={poly(b.pts)} className="gz2-o" />
          </g>
        );
      })}
      <path d={`M${f1x(T0)} ${T0} L${f1x(B)} ${B} M${f2x(T0)} ${T0} L${f2x(B)} ${B}`} className="gz2-fault" />
      <Arrow d={`M152 ${T1 + 18} v26`} tone="red" />
      <Arrow d={`M${L + 4} 150 H4`} tone="red" className="gz2-vec" />
      <Arrow d={`M${R + DX - 4} 150 H${W - 2}`} tone="red" className="gz2-vec" />
      <T x={70} y={42} cls="gz2-b">hrásť</T>
      <T x={232} y={42} cls="gz2-b">hrásť</T>
      <T x={152} y={22} cls="gz2-b">příkopová</T>
      <T x={152} y={38} cls="gz2-b">propadlina</T>
      <path d="M152 44 V96" className="gz2-lead" />
      <T x={f1x(B) - 8} y={B + 14} a="end" cls="gz2-sm gz2-red-t">zlom</T>
      <T x={f2x(B) + 8} y={B + 14} a="start" cls="gz2-sm gz2-red-t">zlom</T>
      <T x={8} y={138} a="start" cls="gz2-sm gz2-b gz2-red-t">tah</T>
      <T x={W - 4} y={138} a="end" cls="gz2-sm gz2-b gz2-red-t">tah</T>
    </>
  );
}

export default function FoldingFaulting() {
  return (
    <Figure level={3} label={LABEL} max={760} interactive>
      <div className="gz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={280}
          steps={[
            {
              title: "Tlak: vrásy",
              art: <Folds />,
              caption: "Stlačené vrstvy se zprohýbají: nahoru antiklinála, dolů synklinála. Tak vznikly Alpy i Himálaj.",
            },
            {
              title: "Tah: zlomy a kry",
              art: <Faults />,
              caption: "Roztahovaná kůra popraská na kry: hrásť se zvedne, příkopová propadlina poklesne (Oherský příkop pod Krušnými horami).",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
