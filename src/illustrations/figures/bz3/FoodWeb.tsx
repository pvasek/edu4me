import type { ReactNode } from "react";
import { Arrow, DrawArrow, Fade, Figure, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Potravní síť českého lesa. Šipky vedou od potravy ke konzumentovi, tedy ve směru toku energie. Dub je producent: jeho listy žerou housenky a žaludy myši. Housenky loví sýkory a také myši. Sýkory a myši jsou kořistí sovy puštíka, myši loví i liška. Odumřelé listí, mrtvá těla a trus zpracují rozkladači – houby a žížaly – a vrátí živiny do půdy, odkud je znovu čerpají kořeny dubu.";

const W = 420;
const H = 478;
const MR = 31;

function Medal({ x, y, name, role, children, decomp = false }: { x: number; y: number; name: string; role?: string; children: ReactNode; decomp?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={MR} className={decomp ? "bz3-medal bz3-medal-d" : "bz3-medal"} />
      <g transform={`translate(${x} ${y})`}>{children}</g>
      <circle cx={x} cy={y} r={MR} className="bz3-o" />
      <text x={x} y={y + MR + 18} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm bz3-halo">
        {name}
      </text>
      {role && (
        <text x={x} y={y + MR + 34} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t bz3-halo">
          {role}
        </text>
      )}
    </g>
  );
}

function Oak() {
  const { id } = useFig();
  // lobed oak leaf
  const lobes: string[] = [];
  const n = 4;
  for (const s of [-1, 1]) {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const y = 16 - i * 8;
      const w = 6 + Math.sin((i / n) * Math.PI) * 6;
      pts.push(`Q${f1(s * (w + 5))} ${f1(y - 2)} ${f1(s * w * 0.55)} ${f1(y - 5)}`);
    }
    lobes.push(pts.join(" "));
  }
  const leaf = `M0 18 ${lobes[0]} Q0 -26 0 -24 M0 18 ${lobes[1]} Q0 -26 0 -24`;
  return (
    <g transform="translate(-5 2) rotate(-14)">
      <path d={leaf} className="bz3-oak" />
      <path d={leaf} fill={pat(id, "d")} opacity={0.5} />
      <path d="M0 22 V-20" className="bz3-midrib" />
      <g transform="translate(15 10) rotate(20)">
        <ellipse cx={0} cy={4} rx={5} ry={7} className="bz3-acorn" />
        <path d="M-6 0 Q0 -5 6 0 L5 -3 Q0 -7 -5 -3Z" className="bz3-acorn-cup" />
      </g>
    </g>
  );
}

function Caterpillar() {
  return (
    <g>
      {Array.from({ length: 7 }, (_, i) => {
        const a = Math.PI * (0.9 - i * 0.13);
        return <circle key={i} cx={f1(-20 + i * 6.5)} cy={f1(6 - Math.sin(a) * 8)} r={5.2} className="bz3-cat" />;
      })}
      <circle cx={22} cy={0} r={5.6} className="bz3-cat-head" />
      <path d="M24 -5 l3 -4 M20 -5 l1 -5" className="bz3-o bz3-thin" />
    </g>
  );
}

function Mouse() {
  return (
    <g>
      <path d="M-14 10 C-24 12 -26 2 -20 -2" className="bz3-tail" />
      <ellipse cx={-2} cy={4} rx={14} ry={9} className="bz3-mouse" />
      <path d="M8 -2 C14 -6 22 -2 22 4 C20 8 12 10 8 8Z" className="bz3-mouse" />
      <circle cx={10} cy={-6} r={5} className="bz3-mouse bz3-ear" />
      <circle cx={16} cy={1} r={1.3} className="bz3-eye" />
      <path d="M22 4 l5 -1 M22 5 l5 2" className="bz3-o bz3-thin" />
      <path d="M-8 12 l-2 4 M4 12 l1 4" className="bz3-o bz3-thin" />
    </g>
  );
}

function Tit() {
  return (
    <g>
      <path d="M-18 6 L-26 12 L-24 4Z" className="bz3-tit-back" />
      <path d="M-18 4 C-14 -8 4 -10 10 -4 C14 4 8 16 -4 16 C-12 16 -18 10 -18 4Z" className="bz3-tit-belly" />
      <path d="M-18 4 C-14 -8 -4 -10 2 -8 C-4 -2 -10 6 -18 8Z" className="bz3-tit-back" />
      <circle cx={8} cy={-8} r={8} className="bz3-tit-head" />
      <path d="M6 -6 C9 -9 13 -7 13 -4 C10 -2 7 -3 6 -6Z" className="bz3-tit-cheek" />
      <path d="M4 0 C3 6 0 12 -2 16" className="bz3-tit-stripe" />
      <path d="M15 -8 l5 1 l-5 2Z" className="bz3-beak" />
      <circle cx={10} cy={-10} r={1.2} className="bz3-eye-l" />
      <path d="M-2 16 l-2 6 M2 16 l1 6" className="bz3-o bz3-thin" />
    </g>
  );
}

function Owl() {
  const { id } = useFig();
  return (
    <g>
      <path d="M-16 22 C-22 4 -18 -20 0 -22 C18 -20 22 4 16 22Z" className="bz3-owl" />
      <path d="M-16 22 C-22 4 -18 -20 0 -22 C18 -20 22 4 16 22Z" fill={pat(id, "b")} opacity={0.45} />
      <path d="M-13 -6 C-14 -18 -2 -18 0 -10 C2 -18 14 -18 13 -6 C12 2 2 2 0 -2 C-2 2 -12 2 -13 -6Z" className="bz3-owl-face" />
      <circle cx={-6} cy={-8} r={3.4} className="bz3-eye" />
      <circle cx={6} cy={-8} r={3.4} className="bz3-eye" />
      <path d="M-1.5 -4 L0 1 L1.5 -4Z" className="bz3-beak" />
      <path d="M-6 8 l2 3 M0 10 l2 3 M6 8 l2 3 M-3 15 l2 3 M4 15 l2 3" className="bz3-o bz3-thin" />
    </g>
  );
}

function Fox() {
  return (
    <g>
      <path d="M-20 -18 L-12 -2 L-4 -8Z M20 -18 L12 -2 L4 -8Z" className="bz3-fox" />
      <path d="M-17 -12 L-12 -4 L-8 -8Z M17 -12 L12 -4 L8 -8Z" className="bz3-fox-in" />
      <path d="M-16 -6 C-12 -10 12 -10 16 -6 C18 4 8 14 0 22 C-8 14 -18 4 -16 -6Z" className="bz3-fox" />
      <path d="M-15 0 C-10 4 -6 10 0 22 C6 10 10 4 15 0 C10 8 4 10 0 10 C-4 10 -10 8 -15 0Z" className="bz3-fox-white" />
      <circle cx={-6} cy={-1} r={1.6} className="bz3-eye" />
      <circle cx={6} cy={-1} r={1.6} className="bz3-eye" />
      <circle cx={0} cy={19} r={2.4} className="bz3-eye" />
    </g>
  );
}

function Fungus() {
  const { id } = useFig();
  return (
    <g>
      <path d="M-7 20 C-9 10 -8 2 -6 -2 H6 C8 2 9 10 7 20Z" className="bz3-stipe" />
      <path d="M-22 -2 C-22 -18 22 -18 22 -2Z" className="bz3-cap" />
      <path d="M-22 -2 C-22 -18 22 -18 22 -2Z" fill={pat(id, "d")} opacity={0.4} />
      <path d="M-14 20 C-6 16 6 16 16 20" className="bz3-hypha bz3-hypha-dark" />
    </g>
  );
}

function Worm() {
  return (
    <g>
      <path d="M-22 8 C-14 -6 -4 16 4 2 C10 -8 16 -4 22 -10" className="bz3-worm" />
      <path d="M-14 2 l2 3 M-6 8 l3 1 M2 6 l3 -1 M10 -4 l2 3" className="bz3-worm-ring" />
    </g>
  );
}

const P = {
  dub: [130, 404],
  housenka: [56, 290],
  mys: [220, 276],
  sykora: [56, 162],
  sova: [124, 58],
  liska: [250, 58],
  houby: [360, 290],
  zizala: [360, 404],
} as const;

/** arrow from food a to eater b, stopping at the medallion rims */
function feed(a: readonly [number, number], b: readonly [number, number], bend = 0) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy);
  const ux = dx / L;
  const uy = dy / L;
  const s = [a[0] + ux * (MR + 4), a[1] + uy * (MR + 4)];
  // arrows that come up from below stop under the target's name label
  const t = uy < -0.3 ? Math.min((MR + 26) / -uy, MR + 60) : MR + 6;
  const e = [b[0] - ux * t, b[1] - uy * t];
  const c = [(s[0] + e[0]) / 2 - uy * bend, (s[1] + e[1]) / 2 + ux * bend];
  return `M${f1(s[0])} ${f1(s[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(e[0])} ${f1(e[1])}`;
}

export default function FoodWeb() {
  const links: [keyof typeof P, keyof typeof P, number][] = [
    ["dub", "housenka", 0],
    ["dub", "mys", 0],
    ["housenka", "sykora", 0],
    ["housenka", "mys", 0],
    ["sykora", "sova", 0],
    ["mys", "sova", 0],
    ["mys", "liska", 0],
  ];
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={560} replay>
      {links.map(([a, b, bend], i) => (
        <DrawArrow key={`${a}${b}`} d={feed(P[a], P[b], bend)} tone="lvl" delay={0.7 + i * 0.1} className="bz3-arr-w" />
      ))}
      {/* decomposers loop */}
      <Fade delay={1.5}>
        <Arrow d={feed(P.dub, P.zizala, 0)} tone="muted" dashed className="bz3-arr-w" />
        <Arrow d={`M${P.houby[0] - 34} ${P.houby[1] + 44} C300 360 240 380 ${P.dub[0] + 36} ${P.dub[1] - 12}`} tone="muted" dashed className="bz3-arr-w" />
        <text x={250} y={398} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t bz3-halo">
          opad
        </text>
        <text x={262} y={350} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t bz3-halo">
          živiny do půdy
        </text>
        <rect x={318} y={224} width={86} height={236} rx={10} className="bz3-decomp-box" />
        <text x={361} y={218} textAnchor="middle" className="bz3-lbl bz3-sm bz3-b">
          rozkladači
        </text>
      </Fade>
      <Pop delay={0.05}>
        <Medal x={P.dub[0]} y={P.dub[1]} name="dub letní" role="producent">
          <Oak />
        </Medal>
      </Pop>
      <Pop delay={0.15}>
        <Medal x={P.housenka[0]} y={P.housenka[1]} name="housenka">
          <Caterpillar />
        </Medal>
      </Pop>
      <Pop delay={0.2}>
        <Medal x={P.mys[0]} y={P.mys[1]} name="myš">
          <Mouse />
        </Medal>
      </Pop>
      <Pop delay={0.3}>
        <Medal x={P.sykora[0]} y={P.sykora[1]} name="sýkora">
          <Tit />
        </Medal>
      </Pop>
      <Pop delay={0.4}>
        <Medal x={P.sova[0]} y={P.sova[1]} name="sova (puštík)">
          <Owl />
        </Medal>
      </Pop>
      <Pop delay={0.45}>
        <Medal x={P.liska[0]} y={P.liska[1]} name="liška">
          <Fox />
        </Medal>
      </Pop>
      <Pop delay={0.5}>
        <Medal x={P.houby[0]} y={P.houby[1]} name="houby" decomp>
          <Fungus />
        </Medal>
      </Pop>
      <Pop delay={0.55}>
        <Medal x={P.zizala[0]} y={P.zizala[1]} name="žížala" decomp>
          <Worm />
        </Medal>
      </Pop>
      <Fade delay={1.6}>
        <text x={W - 14} y={30} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          šipka: od potravy
        </text>
        <text x={W - 14} y={48} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          ke konzumentovi
        </text>
      </Fade>
    </Figure>
  );
}
