import { DrawArrow, Fade, Figure, Pop, f1 } from "./kit";

const LABEL =
  "Krajinná sféra jako průnik šesti dílčích sfér Země: litosféry (horniny), atmosféry (vzduch), hydrosféry (voda), pedosféry (půda), biosféry (rostliny a živočichové) a socioekonomické sféry (lidé a jejich činnost). Všechny se v krajině překrývají a ovlivňují. Příklad vazby: opadané listí stromů (biosféra) se v půdě rozkládá na humus (pedosféra).";

const W = 520;
const H = 476;
const CX = 260;
const CY = 216;
const D = 84; // distance of each sphere's centre from the middle
const R = 96;

type Sphere = { name: string; sub: string; fill: string; icon: string };
const SPHERES: Sphere[] = [
  { name: "atmosféra", sub: "vzduch", fill: "gz1-sp-air", icon: "cloud" },
  { name: "hydrosféra", sub: "voda", fill: "gz1-sp-water", icon: "wave" },
  { name: "biosféra", sub: "život", fill: "gz1-sp-bio", icon: "tree" },
  { name: "pedosféra", sub: "půda", fill: "gz1-sp-soil", icon: "soil" },
  { name: "litosféra", sub: "horniny", fill: "gz1-sp-rock", icon: "rock" },
  { name: "socioekonomická", sub: "lidé a jejich činnost", fill: "gz1-sp-human", icon: "house" },
];

const ang = (i: number) => ((-90 + i * 60) * Math.PI) / 180;

function Icon({ k, x, y }: { k: string; x: number; y: number }) {
  const t = `translate(${f1(x)} ${f1(y)})`;
  switch (k) {
    case "cloud":
      return (
        <path
          transform={t}
          d="M-14 6 a7 7 0 0 1 1 -13 a9 9 0 0 1 17 -2 a7 7 0 0 1 11 9 a6 6 0 0 1 -2 6 Z"
          className="gz1-o gz1-thin gz1-fill"
        />
      );
    case "wave":
      return (
        <path
          transform={t}
          d="M-16 -4 q4 -5 8 0 t8 0 t8 0 t8 0 M-16 4 q4 -5 8 0 t8 0 t8 0 t8 0"
          className="gz1-o"
          style={{ stroke: "var(--blue)" }}
        />
      );
    case "tree":
      return (
        <g transform={t}>
          <path d="M0 10 V-2" className="gz1-o" />
          <circle cx={0} cy={-8} r={9} className="gz1-o gz1-thin gz1-forest" />
        </g>
      );
    case "soil":
      return (
        <g transform={t}>
          <path d="M-16 -6 h32 M-16 1 h32 M-16 8 h32" className="gz1-o gz1-thin" />
          <path d="M-6 -6 q-2 6 1 12 M5 -6 q3 5 0 10" className="gz1-o gz1-thin" style={{ stroke: "var(--green)" }} />
        </g>
      );
    case "rock":
      return (
        <path
          transform={t}
          d="M-17 9 L-8 -7 L-2 0 L5 -11 L17 9 Z M-8 -7 l3 6 M5 -11 l-2 9"
          className="gz1-o gz1-thin gz1-rock"
        />
      );
    default:
      return (
        <g transform={t}>
          <path d="M-12 10 V-2 L-3 -10 L6 -2 V10 Z" className="gz1-o gz1-thin gz1-house" />
          <path d="M6 10 V-6 h10 V10 Z M9 -2 h4 M9 3 h4" className="gz1-o gz1-thin gz1-fill" />
        </g>
      );
  }
}

export default function GeoSpheres() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={560} replay>
      {SPHERES.map((s, i) => {
        const x = CX + D * Math.cos(ang(i));
        const y = CY + D * Math.sin(ang(i));
        return (
          <Pop key={s.name} delay={0.1 + i * 0.12}>
            <circle cx={f1(x)} cy={f1(y)} r={R} className={`${s.fill} gz1-sp`} />
            <circle cx={f1(x)} cy={f1(y)} r={R} className="gz1-o gz1-thin" />
          </Pop>
        );
      })}
      {SPHERES.map((s, i) => {
        const x = CX + (D + 52) * Math.cos(ang(i));
        const y = CY + (D + 52) * Math.sin(ang(i));
        return (
          <Fade key={s.name} delay={0.5 + i * 0.12}>
            <Icon k={s.icon} x={x} y={y - 26} />
            <text x={f1(x)} y={f1(y + 4)} textAnchor="middle" className="gz1-lbl gz1-b gz1-halo-soft">
              {s.name}
            </text>
            <text x={f1(x)} y={f1(y + 21)} textAnchor="middle" className="gz1-lbl gz1-sm gz1-halo-soft">
              {i === 5 ? "sféra" : s.sub}
            </text>
          </Fade>
        );
      })}
      <Pop delay={1.1}>
        <circle cx={CX} cy={CY} r={40} className="gz1-tag-lvl" />
        <text x={CX} y={CY - 3} textAnchor="middle" className="gz1-lbl gz1-b gz1-lvl-t gz1-sm">
          krajinná
        </text>
        <text x={CX} y={CY + 14} textAnchor="middle" className="gz1-lbl gz1-b gz1-lvl-t gz1-sm">
          sféra
        </text>
      </Pop>
      {/* one link between two spheres: biosféra (lower right) → pedosféra (bottom) */}
      <DrawArrow d={`M${CX + 131} ${CY + 134} Q${CX + 112} ${CY + 176} ${CX + 58} ${CY + 184}`} tone="lvl" delay={1.4} />
      <Fade delay={1.6}>
        <text x={CX + 150} y={CY + 196} textAnchor="middle" className="gz1-lbl gz1-sm gz1-lvl-t">
          listí → humus
        </text>
      </Fade>
      <Fade delay={1.7}>
        <text x={W / 2} y={H - 24} textAnchor="middle" className="gz1-lbl gz1-sm">
          Příklad vazby: opadané listí (biosféra) se rozkládá
        </text>
        <text x={W / 2} y={H - 6} textAnchor="middle" className="gz1-lbl gz1-sm">
          na humus, který obohacuje půdu (pedosféra).
        </text>
      </Fade>
    </Figure>
  );
}
