import { useId } from "react";
import { Draw, DrawArrow, Fade, Figure, Lbl, Pop, f1, pat, useCompact, useFig } from "./kit";
import { projector, type LL } from "./world";

const LABEL =
  "Mapa světa s hlavními litosférickými deskami: Pacifická, Severoamerická, Jihoamerická, Euroasijská, Africká, Indoaustralská a Antarktická, a menší deska Nazca. Šipky ukazují, kam se desky posouvají, rychlostí několika centimetrů za rok. Rozbíhavé hranice jsou podmořské hřbety, například Středoatlantský hřbet, který vystupuje nad hladinu na Islandu. Sbíhavé hranice tvoří hlubokomořské příkopy a pohoří: pod Andy se podsouvá deska Nazca, Himálaj vznikl srážkou Indie s Asií. Transformní hranicí je zlom San Andreas v Kalifornii.";

type Kind = "r" | "s" | "t";
/** Plate boundaries (coarse). Convergent lines run so that the overriding plate lies on their left. */
const BOUNDS: { k: Kind; pts: LL[] }[] = [
  // Mid-Atlantic Ridge, Iceland on it
  { k: "r", pts: [[-4, 76], [-8, 71], [-14, 68], [-17, 66.4], [-20, 64], [-27, 61], [-31, 56], [-30, 52], [-28, 47], [-33, 40], [-37, 35], [-43, 28], [-46, 22], [-45, 16], [-44, 11], [-37, 6], [-25, 1], [-15, -1], [-13, -8], [-14, -15], [-13, -22], [-13, -30], [-15, -38], [-17, -45], [-12, -51], [-1, -54]] },
  // SW Indian, Central Indian ridges, Gulf of Aden and the Red Sea
  { k: "r", pts: [[-1, -54], [10, -53], [25, -47], [35, -44], [45, -38], [55, -32], [65, -27], [70, -25], [67, -16], [66, -8], [68, 0], [62, 6], [57, 13], [51, 13], [44, 12.5], [40, 16], [37, 21], [34, 27]] },
  // SE Indian and Pacific–Antarctic ridges
  { k: "r", pts: [[70, -25], [78, -32], [88, -40], [100, -46], [115, -49], [130, -50], [140, -52], [150, -56], [160, -60], [170, -63], [180, -64]] },
  { k: "r", pts: [[-180, -64], [-170, -65], [-150, -62], [-130, -57], [-115, -50], [-112, -40], [-111, -30], [-112, -20], [-108, -10], [-105, 0], [-104, 10], [-106, 18], [-108, 22]] },
  // Chile Rise, Galápagos rift, East African rift
  { k: "r", pts: [[-111, -35], [-95, -38], [-80, -43], [-75, -46]] },
  { k: "r", pts: [[-104, 2], [-95, 2], [-85, 1.5]] },
  { k: "r", pts: [[39, 12], [40, 8], [37, 3], [36, -3], [35, -9], [35, -15]] },
  // San Andreas and other transforms
  { k: "t", pts: [[-108, 22], [-110, 25], [-113, 29], [-115, 32], [-118, 34], [-121, 36], [-124, 40]] },
  { k: "t", pts: [[-87, 16], [-78, 19.5], [-68, 19], [-61, 18]] },
  { k: "t", pts: [[-83, 9], [-75, 11], [-62, 11]] },
  { k: "t", pts: [[66, 25], [67, 30], [70, 33], [72, 35]] },
  // subduction: Andes, Central America, Cascadia, Lesser Antilles
  { k: "s", pts: [[-79, 4], [-81, -2], [-81, -7], [-77, -14], [-72, -19], [-71, -25], [-72, -32], [-74, -38], [-75, -46]] },
  { k: "s", pts: [[-105, 19.5], [-101, 17], [-95, 15], [-90, 12.5], [-84, 8]] },
  { k: "s", pts: [[-127, 50], [-125, 45], [-124.5, 41]] },
  { k: "s", pts: [[-61, 11], [-59.5, 14], [-61, 18]] },
  // Mariana – Japan – Kuril – Aleutians
  { k: "s", pts: [[138, 9], [144, 12], [147, 17], [146, 24], [142, 29], [142, 34], [144, 39], [146, 43], [151, 46], [157, 50], [162, 54], [168, 54], [180, 51]] },
  { k: "s", pts: [[-180, 51], [-170, 51.5], [-160, 54], [-150, 57], [-145, 59.5]] },
  // Sunda arc, Tonga–Kermadec
  { k: "s", pts: [[93, 18], [93, 12], [94, 6], [96, 2], [99, -3], [103, -7], [108, -10], [115, -11], [120, -11], [125, -10]] },
  { k: "s", pts: [[-179, -35], [-177, -28], [-174, -20], [-173, -15]] },
  { k: "s", pts: [[178, -40], [180, -36]] },
  // collisions: Africa/Arabia/India against Eurasia
  { k: "s", pts: [[-10, 36], [-2, 36], [5, 37], [12, 37.5], [16, 38.5], [20, 36.5], [25, 34.8], [29, 35.5], [34, 36.5], [36, 37.5], [42, 37.5], [46, 35], [50, 31], [56, 27], [60, 26], [66, 25]] },
  { k: "s", pts: [[72, 35], [76, 34], [80, 31], [85, 28], [90, 27.5], [95, 28], [97, 26], [95, 22], [93, 18]] },
];

type Plate = { name: string; at: LL; mv?: [number, number]; sec?: boolean; short?: string };
const PLATES: Plate[] = [
  { name: "Pacifická", at: [-150, -4], mv: [-1, -0.55] },
  { name: "Severoamerická", short: "Severoamer.", at: [-100, 52], mv: [-1, 0.25] },
  { name: "Jihoamerická", short: "Jihoamer.", at: [-52, -12], mv: [-1, 0.05] },
  { name: "Euroasijská", at: [98, 60], mv: [1, 0.25] },
  { name: "Africká", at: [16, 4], mv: [0.55, -0.85] },
  { name: "Indoaustralská", short: "Indoaustral.", at: [88, -22], mv: [0.3, -1] },
  { name: "Antarktická", at: [60, -60] },
  { name: "Nazca", at: [-96, -16], mv: [1, 0] },
  { name: "Karibská", at: [-74, 15], sec: true },
  { name: "Arabská", at: [46, 22], sec: true },
  { name: "Filipínská", at: [131, 18], sec: true },
];

/** Teeth (small triangles) on the left side of a screen polyline, every `gap` px. */
function teeth(pts: [number, number][], gap: number, size: number) {
  const out: string[] = [];
  let carry = gap / 2;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, y1 - y0);
    if (!len) continue;
    const ux = (x1 - x0) / len;
    const uy = (y1 - y0) / len;
    // left normal on screen (y down)
    const nx = uy;
    const ny = -ux;
    let s = carry;
    while (s < len) {
      const cx = x0 + ux * s;
      const cy = y0 + uy * s;
      const b = size * 0.6;
      out.push(
        `M${f1(cx - ux * b)} ${f1(cy - uy * b)} L${f1(cx + nx * size)} ${f1(cy + ny * size)} L${f1(cx + ux * b)} ${f1(cy + uy * b)}Z`,
      );
      s += gap;
    }
    carry = s - len;
  }
  return out.join(" ");
}

export default function WorldPlates() {
  const compact = useCompact(460);
  return (
    <Figure level={8} label={LABEL} w={640} h={compact.narrow ? 344 : 302} max={760} compact={compact} boost>
      <Map narrow={compact.narrow} />
    </Figure>
  );
}

function Map({ narrow }: { narrow: boolean }) {
  const { id } = useFig();
  const clip = "bz7wp" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const W = 640;
  const pr = projector(0, 4, W);
  const MH = pr.h;
  const P = (ll: LL) => pr.p(ll[0], ll[1]);
  const scr = (pts: LL[]) => pts.map((q) => P(q));
  const tooth = narrow ? 7 : 5.2;
  const gap = narrow ? 15 : 12;
  const lineD = (pts: LL[]) => pr.line(pts);
  // callouts
  const ice = P([-18.5, 64.8]);
  const him = P([86, 28.5]);
  const and = P([-70.5, -24]);
  const mar = P([-13.5, -26]);
  const sa = P([-119, 35]);
  const legendY = MH + (narrow ? 26 : 22);
  const items: { k: Kind | "m"; t: string }[] = [
    { k: "r", t: "rozbíhavá (hřbet)" },
    { k: "s", t: "sbíhavá (příkop, pohoří)" },
    { k: "t", t: "transformní (zlom)" },
    { k: "m", t: "pohyb desky" },
  ];
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={4} width={W} height={MH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={4} width={W} height={MH} className="bz7-ocean" />
        <path d={pr.land} className="bz7-land" />
        <path d={pr.land} fill={pat(id, "dots")} opacity={0.45} />
        <path d={pr.land} className="bz7-o bz7-thin" fill="none" />
        {/* boundaries */}
        {BOUNDS.map((b, i) =>
          b.k === "r" ? (
            <g key={i}>
              <Draw d={lineD(b.pts)} className="bz7-ridge-o" delay={0.1 + (i % 4) * 0.08} />
              <Draw d={lineD(b.pts)} className="bz7-ridge" delay={0.1 + (i % 4) * 0.08} />
            </g>
          ) : b.k === "t" ? (
            <Draw key={i} d={lineD(b.pts)} className="bz7-transform" delay={0.3} />
          ) : (
            <g key={i}>
              <Draw d={lineD(b.pts)} className="bz7-trench" delay={0.2 + (i % 4) * 0.08} />
              <Fade delay={0.9}>
                <path d={teeth(scr(b.pts), gap, tooth)} className="bz7-teeth" />
              </Fade>
            </g>
          ),
        )}
      </g>
      <rect x={0} y={4} width={W} height={MH} className="bz7-o bz7-thin" fill="none" />

      {/* plates and their motion */}
      {PLATES.map((p, i) => {
        const [x, y] = P(p.at);
        const name = narrow && p.short ? p.short : p.name;
        return (
          <Pop key={p.name} delay={0.8 + i * 0.05} className={p.sec ? "bz7-sec" : undefined}>
            <text x={x} y={y} textAnchor="middle" className={`bz7-lbl bz7-b bz7-plate bz7-halo ${p.sec ? "bz7-sm" : ""}`}>
              {name}
            </text>
            {p.mv && (
              <DrawArrow
                d={`M${f1(x - p.mv[0] * 15)} ${f1(y + 10 - p.mv[1] * 15)} L${f1(x + p.mv[0] * 15)} ${f1(y + 10 + p.mv[1] * 15)}`}
                tone="blue"
                className="bz7-move"
                delay={1.3}
              />
            )}
          </Pop>
        );
      })}

      {/* callouts */}
      <Fade delay={1.5}>
        <Lbl x={ice[0] + 30} y={ice[1] - 12} tx={ice[0]} ty={ice[1]} className="bz7-halo">
          Island
        </Lbl>
        <Lbl x={him[0] - 6} y={him[1] - 26} tx={him[0]} ty={him[1]} anchor="middle" className="bz7-halo">
          Himálaj
        </Lbl>
        <Lbl x={and[0] + 26} y={and[1] + 30} tx={and[0]} ty={and[1]} anchor="start" className="bz7-halo">
          Andy
        </Lbl>
        <Lbl x={mar[0] + 14} y={mar[1] + 34} tx={mar[0]} ty={mar[1]} anchor="start" className="bz7-halo bz7-sm">
          Středoatlantský hřbet
        </Lbl>
        <Lbl x={8} y={sa[1] + 26} tx={sa[0]} ty={sa[1]} anchor="start" className="bz7-halo bz7-sm" sec>
          zlom San Andreas
        </Lbl>
      </Fade>

      {/* legend */}
      <Fade delay={0.4}>
        {items.map((it, i) => {
          const col = narrow ? i % 2 : i;
          const row = narrow ? Math.floor(i / 2) : 0;
          const x = narrow ? 8 + col * 322 : 6 + [0, 150, 340, 510][i];
          const y = legendY + row * 34;
          const sample = `M${x} ${y - 5} H${x + 26}`;
          return (
            <g key={it.t}>
              {it.k === "r" && (
                <>
                  <path d={sample} className="bz7-ridge-o" />
                  <path d={sample} className="bz7-ridge" />
                </>
              )}
              {it.k === "t" && <path d={sample} className="bz7-transform" />}
              {it.k === "s" && (
                <>
                  <path d={sample} className="bz7-trench" />
                  <path d={teeth([[x, y - 5], [x + 26, y - 5]], gap, tooth)} className="bz7-teeth" />
                </>
              )}
              {it.k === "m" && <DrawArrow d={`M${x} ${y - 5} H${x + 26}`} tone="blue" className="bz7-move" />}
              <text x={x + 32} y={y} className="bz7-lbl bz7-sm">
                {narrow ? it.t.replace(/ \(.*\)/, "") : it.t}
              </text>
            </g>
          );
        })}
      </Fade>
    </g>
  );
}
