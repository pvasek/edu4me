import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, Liquid, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Jak vzniká zkamenělina, ve stepech. Ryba uhyne a klesne na dno jezera. Měkké části se rozloží a kostru rychle zasypou vrstvy bahna a písku, takže se k ní nedostane kyslík ani mrchožrouti. Pod tlakem dalších vrstev se usazeniny mění v horninu a voda s rozpuštěnými minerály postupně nahradí kosti kamenem. Pohyby zemské kůry pak vrstvy vyzdvihnou, déšť a řeky obrušují povrch, až eroze zkamenělinu odkryje a paleontolog ji najde ve skalní stěně.";

const W = 360;
const H = 240;
const BOTTOM = 236;
const WATER = "#5d93d6";
const ROCK = ["#d9c9a3", "#c7ae84", "#e2d4b0", "#b99b6e", "#d1bc92", "#ab8c62", "#ccb487", "#bfa274"];

/** Horizontal sediment layers from `top` down to the bottom, `n` layers, gently wavy. */
function Strata({ top, n, x0 = 6, x1 = W - 6, start = 0 }: { top: number; n: number; x0?: number; x1?: number; start?: number }) {
  const { id } = useFig();
  const h = (BOTTOM - top) / n;
  const edge = (y: number, k: number) => {
    let d = `M${x0} ${f1(y)}`;
    for (let x = x0 + 20; x <= x1; x += 20) d += ` L${x} ${f1(y + Math.sin(x / 31 + k) * 1.6)}`;
    return d;
  };
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const y = top + i * h;
        const col = ROCK[(start + n - 1 - i) % ROCK.length];
        return (
          <g key={i}>
            <path d={`${edge(y, i)} L${x1} ${f1(y + h)} L${x0} ${f1(y + h)}Z`} fill={col} />
            <path d={`${edge(y, i)} L${x1} ${f1(y + h)} L${x0} ${f1(y + h)}Z`} fill={pat(id, i % 2 ? "dots" : "h")} opacity={0.6} />
            <path d={edge(y, i)} className="bz3-o bz3-thin" />
          </g>
        );
      })}
    </g>
  );
}

function Fish({ x, y, dead = true }: { x: number; y: number; dead?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-34 0 C-24 -14 10 -15 24 -2 L38 -12 L36 0 L38 12 L24 2 C10 15 -24 14 -34 0Z" className="bz3-fish" />
      <path d="M-8 -11 C-4 -18 6 -18 10 -10 M-6 10 Q0 15 6 10" className="bz3-o bz3-thin" />
      <path d="M-22 -8 Q-18 0 -22 8" className="bz3-o bz3-thin" />
      {dead ? (
        <path d="M-29 -4 l4 4 M-25 -4 l-4 4" className="bz3-o bz3-thin" />
      ) : (
        <circle cx={-27} cy={-2} r={1.6} className="bz3-dot" />
      )}
    </g>
  );
}

function Skeleton({ x, y, stone = false }: { x: number; y: number; stone?: boolean }) {
  const ribs: string[] = [];
  for (let i = 0; i < 9; i++) {
    const rx = -16 + i * 4.4;
    const hgt = 10 - Math.abs(i - 3) * 0.9;
    ribs.push(`M${f1(rx)} 0 Q${f1(rx + 2)} ${f1(-hgt * 0.6)} ${f1(rx + 3)} ${f1(-hgt)} M${f1(rx)} 0 Q${f1(rx + 2)} ${f1(hgt * 0.6)} ${f1(rx + 3)} ${f1(hgt)}`);
  }
  return (
    <g transform={`translate(${x} ${y})`} className={stone ? "bz3-bone-stone" : "bz3-bone"}>
      <path d="M-30 -7 C-36 -6 -38 4 -32 7 L-22 5 L-22 -5Z" className="bz3-bone-f" />
      <path d="M-22 0 H26" />
      <path d={ribs.join(" ")} />
      <path d="M26 0 L36 -9 M26 0 L36 9 M28 0 L36 -3 M28 0 L36 3" />
      <circle cx={-29} cy={-1} r={2} className="bz3-bone-eye" />
    </g>
  );
}

function Water({ top, bottom }: { top: number; bottom: number }) {
  return (
    <g>
      <Liquid d={`M6 ${top} H${W - 6} V${bottom} H6Z`} color={WATER} opacity={0.28} />
      <path d={`M6 ${top} H${W - 6}`} className="bz3-o" />
    </g>
  );
}

function Tag({ x, y, children, anchor = "start" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="bz3-lbl bz3-sm bz3-b bz3-halo">
      {children}
    </text>
  );
}

function F1() {
  return (
    <Frame w={W} h={H}>
      <Water top={26} bottom={176} />
      <Strata top={176} n={3} />
      <Pop delay={0.1}>
        <g>
          <Fish x={180} y={166} />
        </g>
      </Pop>
      <Arrow d="M180 70 V140" tone="ink" dashed />
      <Tag x={18} y={50}>jezero</Tag>
      <Tag x={196} y={100}>ryba klesne na dno</Tag>
    </Frame>
  );
}

function F2() {
  return (
    <Frame w={W} h={H}>
      <Water top={26} bottom={140} />
      <Strata top={140} n={5} />
      <Skeleton x={180} y={166} />
      <Pop delay={0.2}>
        <g>
          {[100, 150, 210, 260].map((x, i) => (
            <path key={x} d={`M${x} 60 v${50 + (i % 2) * 10}`} className="bz3-settle" />
          ))}
        </g>
      </Pop>
      <Tag x={18} y={50}>usazování bahna a písku</Tag>
      <Tag x={W - 12} y={204} anchor="end">kostra pod vrstvami</Tag>
    </Frame>
  );
}

function F3() {
  return (
    <Frame w={W} h={H}>
      <Water top={26} bottom={64} />
      <Strata top={64} n={9} />
      <Skeleton x={180} y={196} stone />
      <Pop delay={0.2}>
        <g>
          {[150, 182, 214].map((x) => (
            <g key={x}>
              <Arrow d={`M${x} 150 V176`} tone="blue" />
              <circle cx={x - 5} cy={160} r={1.6} className="bz3-mineral" />
              <circle cx={x + 5} cy={168} r={1.6} className="bz3-mineral" />
            </g>
          ))}
        </g>
      </Pop>
      <Arrow d="M40 72 V120" tone="ink" />
      <Arrow d="M320 72 V120" tone="ink" />
      <Tag x={52} y={104}>tlak vrstev</Tag>
      <Tag x={W - 52} y={140} anchor="end">voda s minerály</Tag>
      <Tag x={18} y={230}>usazená hornina</Tag>
    </Frame>
  );
}

/** Raised, tilted strata cut by a valley; `cut` deepens the valley until it reaches the fossil. */
function Uplifted({ cut, found = false }: { cut: number; found?: boolean }) {
  const { id } = useFig();
  const surface = `M6 ${70} C70 64 120 70 ${150 - cut * 0.3} ${86 + cut * 0.5} C${170} ${110 + cut} ${200} ${110 + cut} ${226 + cut * 0.2} ${92 + cut * 0.4} C260 72 300 60 ${W - 6} 58`;
  const land = `${surface} L${W - 6} ${BOTTOM} L6 ${BOTTOM}Z`;
  return (
    <g>
      <clipPath id={`${id}-land`}>
        <path d={land} />
      </clipPath>
      <g clipPath={`url(#${id}-land)`}>
        <g transform={`rotate(-8 180 160) translate(0 -18)`}>
          <Strata top={40} n={11} x0={-40} x1={W + 40} />
          {!found && <Skeleton x={190} y={196} stone />}
        </g>
      </g>
      <path d={surface} className="bz3-o" />
      {found && (
        <g>
          <ellipse cx={188} cy={163} rx={46} ry={17} className="bz3-find" />
          <g transform="rotate(-4 188 163)">
            <Skeleton x={188} y={163} stone />
          </g>
        </g>
      )}
      {/* grass tufts */}
      <path d="M30 68 l2 -6 l2 6 M60 66 l2 -6 l2 6 M290 61 l2 -6 l2 6 M330 59 l2 -6 l2 6" className="bz3-o bz3-thin" />
    </g>
  );
}

function F4() {
  return (
    <Frame w={W} h={H}>
      <Uplifted cut={0} />
      <Arrow d="M30 220 V176" tone="lvl" className="bz3-vec" />
      <Arrow d="M330 220 V176" tone="lvl" className="bz3-vec" />
      <Pop delay={0.2}>
        <g>
          {[160, 180, 200, 220].map((x, i) => (
            <path key={x} d={`M${x} ${14 + (i % 2) * 6} l-4 12`} className="bz3-rain" />
          ))}
          <path d="M150 30 C150 18 170 12 180 20 C190 8 214 14 212 28Z" className="bz3-cloud" />
        </g>
      </Pop>
      <Tag x={44} y={200}>zdvih</Tag>
      <Tag x={W - 12} y={40} anchor="end">eroze</Tag>
    </Frame>
  );
}

function F5() {
  return (
    <Frame w={W} h={H}>
      <Uplifted cut={56} found />
      <Pop delay={0.2}>
        <g transform="translate(262 112)">
          {/* paleontologist with a hammer */}
          <circle cx={0} cy={-34} r={7} className="bz3-person" />
          <path d="M0 -27 V2 M0 2 L-8 26 M0 2 L8 26 M0 -20 L-14 -8 L-24 -14" className="bz3-person-l" />
          <path d="M-24 -14 L-30 -22 M-34 -20 L-26 -26" className="bz3-person-l" />
        </g>
      </Pop>
      <Tag x={18} y={30}>eroze odkryla zkamenělinu</Tag>
    </Frame>
  );
}

export default function FossilFormation() {
  return (
    <Figure level={7} label={LABEL} interactive max={620}>
      <StepFilm
        label={LABEL}
        steps={[
          { title: "Organismus uhyne", art: <F1 />, caption: "Mrtvá ryba klesne na dno jezera nebo moře, kde je málo kyslíku." },
          {
            title: "Zasypou ho usazeniny",
            art: <F2 />,
            caption: "Měkké části se rozloží. Kostru rychle zasype bahno a písek, a tak ji nesežerou mrchožrouti.",
          },
          {
            title: "Minerály nahradí kosti",
            art: <F3 />,
            caption: "Tlak dalších vrstev mění usazeniny v horninu. Voda s minerály pomalu nahradí kosti kamenem.",
          },
          {
            title: "Zdvih a eroze",
            art: <F4 />,
            caption: "Pohyby zemské kůry vrstvy vyzdvihnou a nakloní. Déšť a řeky začnou obrušovat povrch.",
          },
          {
            title: "Nález",
            art: <F5 />,
            caption: "Eroze zkamenělinu odkryje. Paleontolog ji pak opatrně vyjme ze skály.",
          },
        ]}
      />
    </Figure>
  );
}
