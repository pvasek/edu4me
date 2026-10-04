import { Draw, Fade, Figure, f1, pat, useFig } from "./kit";

const LABEL =
  "Kopec a jeho vrstevnice. Nahoře kopec v řezu podél čáry A–B: vodorovné řezy po 20 m (420, 440, 460, 480 a 500 m n. m.) a vrchol 512 m n. m. Svislé čáry promítají místa, kde řez protíná svah, dolů na mapu, kde z nich vzniknou vrstevnice – čáry spojující místa se stejnou nadmořskou výškou. Na strmém levém svahu jsou vrstevnice hustě u sebe, na mírném pravém svahu daleko od sebe.";

const W = 540;
const H = 582;
const XA = 60;
const XB = 500;
const XP = 220; // summit
const TOP = 112; // m above the base 400 m
const SL = 62; // left (steep) half-width scale, px
const SR = 152; // right (gentle) half-width scale, px
const SY = 66; // across the line, px (map)
const BASE = 236; // y of 400 m in the profile
const K = 1.55; // px per metre (vertical)
const MAPY = 400; // y of the line A–B on the map
const LEVELS = [20, 40, 60, 80, 100];

const hAt = (x: number) => TOP * Math.exp(-(((x - XP) / (x < XP ? SL : SR)) ** 2));
const yAt = (x: number) => BASE - hAt(x) * K;
const kOf = (L: number) => Math.sqrt(Math.log(TOP / L));

function profile() {
  let d = `M${XA} ${BASE}`;
  for (let x = XA; x <= XB; x += 4) d += ` L${x} ${f1(yAt(x))}`;
  return d + ` L${XB} ${BASE}`;
}

/** one contour on the map: two half-ellipses (steep left, gentle right) round the summit */
function contour(L: number) {
  const k = kOf(L);
  const rl = SL * k;
  const rr = SR * k;
  const ry = SY * k;
  return `M${XP} ${f1(MAPY - ry)} A${f1(rr)} ${f1(ry)} 0 0 1 ${XP} ${f1(MAPY + ry)} A${f1(rl)} ${f1(ry)} 0 0 1 ${XP} ${f1(MAPY - ry)}Z`;
}

/** the same level as a ring on the hill seen slightly from above (front half solid) */
function ring(L: number, front: boolean) {
  const k = kOf(L);
  const xl = XP - SL * k;
  const xr = XP + SR * k;
  const y = BASE - L * K;
  const ry = SY * k * 0.18;
  const cx = XP;
  // two quarter arcs on each side, as for the map contour
  return front
    ? `M${f1(xl)} ${f1(y)} A${f1(cx - xl)} ${f1(ry)} 0 0 0 ${cx} ${f1(y + ry)} A${f1(xr - cx)} ${f1(ry)} 0 0 0 ${f1(xr)} ${f1(y)}`
    : `M${f1(xl)} ${f1(y)} A${f1(cx - xl)} ${f1(ry)} 0 0 1 ${cx} ${f1(y - ry)} A${f1(xr - cx)} ${f1(ry)} 0 0 1 ${f1(xr)} ${f1(y)}`;
}

function Plate() {
  const { id, narrow } = useFig();
  const hill = profile();
  return (
    <>
      {/* ---------------- the hill (section along A–B) */}
      <path d={hill} className="gz1-meadow" />
      <path d={hill} fill={pat(id, "d")} />
      <Draw d={hill} className="gz1-o" />
      {LEVELS.map((L, i) => (
        <g key={L}>
          <path d={`M${XA - 14} ${f1(BASE - L * K)} H${XB}`} className="gz1-level" />
          <path d={ring(L, false)} className="gz1-contour gz1-faint gz1-dash" />
          <Draw d={ring(L, true)} className="gz1-contour" delay={0.3 + i * 0.1} />
          <text x={XA - 18} y={f1(BASE - L * K + 4)} textAnchor="end" className="gz1-ctr-t">
            {400 + L}
          </text>
        </g>
      ))}
      <path d={`M${XA - 14} ${BASE} H${XB}`} className="gz1-o gz1-thin" />
      <text x={XA - 18} y={BASE + 4} textAnchor="end" className="gz1-ctr-t">
        400
      </text>
      <text x={XA - 18} y={BASE - TOP * K - 18} textAnchor="end" className="gz1-ctr-t">
        m n. m.
      </text>

      <rect x={XA - 30} y={MAPY - 132} width={XB - XA + 50} height={264} className="gz1-mapbg gz1-o gz1-thin" />
      {/* ---------------- projections down to the map */}
      {LEVELS.map((L) => {
        const k = kOf(L);
        const y = BASE - L * K;
        return [XP - SL * k, XP + SR * k].map((x, j) => (
          <path key={`${L}-${j}`} d={`M${f1(x)} ${f1(y)} V${MAPY}`} className="gz1-proj" />
        ));
      })}

      {/* ---------------- the contour map */}
      {LEVELS.map((L, i) => (
        <Draw key={L} d={contour(L)} className={`gz1-contour ${L % 100 === 0 ? "gz1-contour-b" : ""}`} delay={0.8 + i * 0.1} />
      ))}
      {LEVELS.map((L) => {
        const k = kOf(L);
        const a = (38 * Math.PI) / 180;
        const x = XP + SR * k * Math.cos(a);
        const y = MAPY + SY * k * Math.sin(a);
        return (
          <text key={L} x={f1(x)} y={f1(y + 4)} textAnchor="middle" className="gz1-ctr-t gz1-halo">
            {400 + L}
          </text>
        );
      })}
      <path d={`M${XA} ${MAPY} H${XB}`} className="gz1-o gz1-thin gz1-dash" />
      <path d={`M${XP} ${MAPY - 7} L${XP + 7} ${MAPY + 5} L${XP - 7} ${MAPY + 5}Z`} style={{ fill: "var(--ink)" }} />
      <text x={XP} y={MAPY - 12} textAnchor="middle" className="gz1-num gz1-halo">
        512
      </text>
      <text x={XA - 6} y={MAPY + 5} textAnchor="end" className="gz1-lbl gz1-b">
        A
      </text>
      <text x={XB + 6} y={MAPY + 5} className="gz1-lbl gz1-b">
        B
      </text>

      <Fade delay={1.3}>
        <text x={XP + 14} y={f1(BASE - TOP * K - 4)} className="gz1-lbl gz1-b">
          vrchol 512 m n. m.
        </text>
        <text x={W / 2 + 10} y={22} textAnchor="middle" className="gz1-lbl gz1-sm gz1-muted-t">
          řez kopcem podél čáry A–B (profil)
        </text>
        <text x={XA - 26} y={MAPY + 156} className="gz1-lbl gz1-sm gz1-lvl-t">
          {narrow ? "strmý svah: hustě" : "strmý svah: vrstevnice hustě"}
        </text>
        <text x={XB + 18} y={MAPY + 156} textAnchor="end" className="gz1-lbl gz1-sm gz1-lvl-t">
          {narrow ? "mírný svah: řídce" : "mírný svah: vrstevnice řídce"}
        </text>
        <text x={W / 2 + 10} y={H - 6} textAnchor="middle" className="gz1-lbl gz1-sm gz1-muted-t">
          interval vrstevnic 20 m
        </text>
      </Fade>
    </>
  );
}

export default function ContourHill() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
