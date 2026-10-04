import { DrawArrow, Draw, Fade, Figure, f1, useFig } from "./kit";

const LABEL =
  "Datová hranice v Tichém oceánu (zjednodušené schéma bez pobřeží). Vede zhruba po poledníku 180°, ale uhýbá, aby nerozdělila státy a souostroví: kolem ruské Čukotky, amerických Aleut a hlavně daleko na východ kolem Kiribati a Samoy. Západně od hranice je o den víc: když je na Fidži úterý 15. 10., je na Havaji teprve pondělí 14. 10. Kdo ji překročí směrem na západ, přidá si den; kdo na východ, den odečte.";

const W = 520;
const H = 560;
const X0 = 80;
const Y0 = 34;
const KX = 4;
const KY = 3;
const L0 = 140; // 140° v. d.
const LAT0 = 72;
/** lon east-positive and continuous across 180 (e.g. 190 = 170° z. d.) */
const px = (lat: number, lon: number): [number, number] => [X0 + (lon - L0) * KX, Y0 + (LAT0 - lat) * KY];
const BOXW = 90 * KX;
const BOXH = (LAT0 + 55) * KY;

const IDL: [number, number][] = [
  [72, 180],
  [67.5, 191],
  [65.5, 191],
  [52.5, 170],
  [48, 180],
  [5, 180],
  [5, 210],
  [-11, 210],
  [-11, 191],
  [-15, 187.5],
  [-45, 187.5],
  [-51.2, 180],
  [-55, 180],
];

const PLACES: { name: string; lat: number; lon: number; dx: number; dy: number; anchor?: "start" | "end" }[] = [
  { name: "Čukotka", lat: 66.2, lon: 190.2, dx: -8, dy: 4, anchor: "end" },
  { name: "Aleuty", lat: 52.9, lon: 173.2, dx: 8, dy: 16 },
  { name: "Havaj", lat: 21.3, lon: 202.1, dx: 8, dy: -6 },
  { name: "Kiribati", lat: 1.9, lon: 202.6, dx: -8, dy: 4, anchor: "end" },
  { name: "Samoa", lat: -13.8, lon: 188.2, dx: -8, dy: 4, anchor: "end" },
  { name: "Fidži", lat: -18.1, lon: 178.4, dx: -8, dy: 4, anchor: "end" },
  { name: "Nový Zéland", lat: -36.8, lon: 174.8, dx: -8, dy: 4, anchor: "end" },
];

function Calendar({ x, y, day, num, ahead }: { x: number; y: number; day: string; num: string; ahead?: boolean }) {
  return (
    <g>
      <rect x={x - 54} y={y} width={108} height={86} rx={6} className="gz1-fill gz1-o" />
      <rect x={x - 54} y={y} width={108} height={24} rx={6} className={ahead ? "gz1-lvl-f" : "gz1-cal-top"} />
      <path d={`M${x - 54} ${y + 24} H${x + 54}`} className="gz1-o gz1-thin" />
      <text x={x} y={y + 17} textAnchor="middle" className="gz1-cal-day">
        {day}
      </text>
      <text x={x} y={y + 70} textAnchor="middle" className="gz1-cal-num">
        {num}
      </text>
    </g>
  );
}

function Plate() {
  const { narrow } = useFig();
  const line = IDL.map(([la, lo], i) => `${i ? "L" : "M"}${f1(px(la, lo)[0])} ${f1(px(la, lo)[1])}`).join("");
  const by = Y0 + BOXH;
  return (
    <>
      <rect x={X0} y={Y0} width={BOXW} height={BOXH} className="gz1-sea gz1-o gz1-thin" />
      {[150, 165, 180, 195, 210, 225].map((lo) => (
        <path key={lo} d={`M${px(0, lo)[0]} ${Y0} V${by}`} className={lo === 180 ? "gz1-o gz1-thin" : "gz1-grat"} />
      ))}
      {[60, 30, 0, -30].map((la) => (
        <path key={la} d={`M${X0} ${px(la, 0)[1]} H${X0 + BOXW}`} className="gz1-grat" />
      ))}
      {[
        [150, "150° v. d."],
        [180, "180°"],
        [210, "150° z. d."],
      ].map(([lo, t]) => (
        <text key={t} x={px(0, lo as number)[0]} y={Y0 - 8} textAnchor="middle" className="gz1-num">
          {t}
        </text>
      ))}
      {[
        [60, "60° s. š."],
        [30, "30° s. š."],
        [0, "0°"],
        [-30, "30° j. š."],
      ].map(([la, t]) => (
        <text key={t} x={X0 - 6} y={px(la as number, 0)[1] + 4} textAnchor="end" className="gz1-num">
          {t}
        </text>
      ))}
      {/* the two dates */}
      <path d={`${line} L${X0} ${by} L${X0} ${Y0}Z`} className="gz1-ahead" />
      <Draw d={line} className="gz1-idl" delay={0.2} />
      {PLACES.map((p) => {
        const [x, y] = px(p.lat, p.lon);
        return (
          <g key={p.name}>
            <circle cx={f1(x)} cy={f1(y)} r={3.6} className="gz1-o gz1-thin" style={{ fill: "var(--ink)" }} />
            <text x={f1(x + p.dx)} y={f1(y + p.dy)} textAnchor={p.anchor ?? "start"} className="gz1-lbl gz1-sm gz1-b gz1-halo">
              {p.name}
            </text>
          </g>
        );
      })}
      <Fade delay={0.8}>
        <text x={px(0, 160)[0]} y={px(42, 0)[1]} textAnchor="middle" className="gz1-lbl gz1-b gz1-lvl-t gz1-halo">
          západně: o den víc
        </text>
        <text x={px(0, 212)[0]} y={px(42, 0)[1]} textAnchor="middle" className="gz1-lbl gz1-b gz1-halo">
          {narrow ? "východně" : "východně: o den míň"}
        </text>
        <text x={px(0, 196)[0]} y={px(-44, 0)[1]} className="gz1-lbl gz1-sm gz1-red-t gz1-halo">
          datová hranice
        </text>
      </Fade>
      {/* calendars and crossing rules */}
      <Fade delay={1.0}>
        <Calendar x={X0 + 74} y={by + 18} day="úterý" num="15. 10." ahead />
        <Calendar x={X0 + BOXW - 74} y={by + 18} day="pondělí" num="14. 10." />
        <text x={X0 + 74} y={by + 128} textAnchor="middle" className="gz1-lbl gz1-sm">
          např. Fidži
        </text>
        <text x={X0 + BOXW - 74} y={by + 128} textAnchor="middle" className="gz1-lbl gz1-sm">
          např. Havaj
        </text>
        <text x={X0 + BOXW / 2} y={by + 30} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b gz1-lvl-t">
          na západ
        </text>
        <DrawArrow d={`M${X0 + BOXW / 2 + 28} ${by + 40} H${X0 + BOXW / 2 - 28}`} tone="lvl" delay={1.1} />
        <text x={X0 + BOXW / 2} y={by + 60} textAnchor="middle" className="gz1-lbl gz1-b gz1-lvl-t">
          +1 den
        </text>
        <text x={X0 + BOXW / 2} y={by + 86} textAnchor="middle" className="gz1-lbl gz1-sm gz1-b">
          na východ
        </text>
        <DrawArrow d={`M${X0 + BOXW / 2 - 28} ${by + 96} H${X0 + BOXW / 2 + 28}`} tone="ink" delay={1.2} />
        <text x={X0 + BOXW / 2} y={by + 116} textAnchor="middle" className="gz1-lbl gz1-b">
          −1 den
        </text>
      </Fade>
    </>
  );
}

export default function DateLine() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
