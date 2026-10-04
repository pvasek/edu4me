import type { ReactNode } from "react";
import { StepStrip } from "../../sequence/StepFigure";
import { Draw, Fade, Figure, Frame, Pop, f1, useFig } from "./kit";

const LABEL =
  "Větvičky a šišky čtyř českých jehličnanů. Smrk ztepilý: jehlice jednotlivě kolem celé větvičky, čtyřhranné a pichlavé, dlouhé šišky visí dolů a opadávají celé. Jedle bělokorá: ploché tupé jehlice ve dvou řadách, vespod se dvěma bílými proužky, šišky stojí na větvi vzhůru a rozpadají se na šupiny. Borovice lesní: dlouhé jehlice po dvou ve svazečku, malé kuželovité šišky. Modřín opadavý: měkké jehlice ve svazečcích po mnoha na krátkých výhonech, na zimu opadávají; malé vzpřímené šišky zůstávají na větvích.";

const W = 220;
const H = 200;

function Twig({ d }: { d: string }) {
  return <Draw d={d} className="bz5-o bz5-twig" delay={0} />;
}

/** A cone drawn as rows of overlapping scales inside an outline. */
function Cone({
  x,
  y,
  w,
  h,
  rot = 0,
  shape = "long",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  shape?: "long" | "egg" | "pine";
}) {
  const { id } = useFig();
  const out =
    shape === "pine"
      ? `M0 ${-h / 2} C${w * 0.5} ${-h * 0.2} ${w * 0.62} ${h * 0.3} ${w * 0.3} ${h / 2} H${-w * 0.3} C${-w * 0.62} ${h * 0.3} ${-w * 0.5} ${-h * 0.2} 0 ${-h / 2} Z`
      : shape === "egg"
        ? `M0 ${-h / 2} C${w * 0.62} ${-h / 2} ${w * 0.6} ${h / 2} 0 ${h / 2} C${-w * 0.6} ${h / 2} ${-w * 0.62} ${-h / 2} 0 ${-h / 2} Z`
        : `M0 ${-h / 2} C${w * 0.5} ${-h / 2} ${w / 2} ${-h * 0.3} ${w / 2} 0 C${w / 2} ${h * 0.36} ${w * 0.3} ${h / 2} 0 ${h / 2} C${-w * 0.3} ${h / 2} ${-w / 2} ${h * 0.36} ${-w / 2} 0 C${-w / 2} ${-h * 0.3} ${-w * 0.5} ${-h / 2} 0 ${-h / 2} Z`;
  // scales: a rhombic lattice of two spirals, as on a real cone
  const step = shape === "long" ? 9 : 8;
  const lat: string[] = [];
  for (let k = -h; k <= h; k += step) {
    lat.push(`M${f1(-w)} ${f1(k - w * 0.6)} L${f1(w)} ${f1(k + w * 0.6)}`);
    lat.push(`M${f1(-w)} ${f1(k + w * 0.6)} L${f1(w)} ${f1(k - w * 0.6)}`);
  }
  const clip = `${id}-cone-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <clipPath id={clip}>
        <path d={out} />
      </clipPath>
      <path d={out} className="bz5-cone" />
      <g clipPath={`url(#${clip})`}>
        <path d={lat.join(" ")} className="bz5-o bz5-thin" />
      </g>
      <path d={out} className="bz5-o" />
    </g>
  );
}

function Tag({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="bz5-lbl bz5-b bz5-lvl-t">
      {children}
    </text>
  );
}

function Spruce() {
  // needles one by one all round the twig, short and stiff
  const needles: string[] = [];
  for (let i = 0; i < 34; i++) {
    const t = i / 33;
    const x = 12 + t * 196;
    const y = 54 - t * 10;
    const a = (i * 137.5 * Math.PI) / 180;
    const dy = Math.sin(a) * 13;
    const dx = 5 + Math.cos(a) * 4;
    needles.push(`M${f1(x)} ${f1(y)} l${f1(dx)} ${f1(dy)}`);
  }
  return (
    <Frame w={W} h={H}>
      <Twig d="M8 55 Q110 50 212 42" />
      <Draw d={needles.join(" ")} className="bz5-o bz5-needle" delay={0.2} />
      <Pop delay={0.5}>
        <path d="M120 50 V64" className="bz5-o" style={{ strokeWidth: 2 }} />
        <Cone x={120} y={118} w={36} h={110} />
      </Pop>
      <Fade delay={0.7}>
        <Tag x={150} y={110}>
          visí
        </Tag>
        <Tag x={150} y={128}>
          dolů
        </Tag>
        {/* needle section: square */}
        <rect
          x={30}
          y={120}
          width={14}
          height={14}
          transform="rotate(45 37 127)"
          className="bz5-o bz5-needle-f"
        />
        <text x={37} y={160} textAnchor="middle" className="bz5-lbl bz5-sm">
          průřez
        </text>
      </Fade>
    </Frame>
  );
}

function Fir() {
  // flat needles in two rows, like a comb; one shown from below
  const needles: ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const x = 18 + i * 12;
    const y = 150 - i * 1.2;
    for (const s of [-1, 1]) {
      needles.push(
        <ellipse
          key={`${i}${s}`}
          cx={f1(x + 3)}
          cy={f1(y + s * 13)}
          rx={2.6}
          ry={12}
          transform={`rotate(${s * 18} ${f1(x + 3)} ${f1(y + s * 13)})`}
          className="bz5-o bz5-thin bz5-needle-f"
        />,
      );
    }
  }
  return (
    <Frame w={W} h={H}>
      <Twig d="M10 151 Q110 146 212 130" />
      <Pop delay={0.15}>{needles}</Pop>
      <Pop delay={0.45}>
        <Cone x={98} y={78} w={34} h={88} />
        {/* a scale falling off */}
        <path
          d="M140 90 q8 -4 12 4 q-6 6 -12 -4 Z"
          className="bz5-o bz5-thin bz5-cone"
        />
        <path
          d="M150 116 q8 -4 12 4 q-6 6 -12 -4 Z"
          className="bz5-o bz5-thin bz5-cone"
        />
      </Pop>
      <Fade delay={0.7}>
        <Tag x={124} y={42}>
          stojí
        </Tag>
        <Tag x={124} y={60}>
          vzhůru
        </Tag>
        {/* the underside of one needle: two white stripes */}
        <g transform="translate(190 64)">
          <rect
            x={-7}
            y={-26}
            width={14}
            height={52}
            rx={7}
            className="bz5-o bz5-needle-f"
          />
          <path d="M-3 -20 V20 M3 -20 V20" className="bz5-stripe-w" />
        </g>
        <text x={190} y={106} textAnchor="middle" className="bz5-lbl bz5-sm">
          zespodu
        </text>
      </Fade>
    </Frame>
  );
}

function Pine() {
  // long needles in pairs from a short sheath
  const pairs: string[] = [];
  for (let i = 0; i < 12; i++) {
    const x = 18 + i * 15;
    const y = 115 - x * 0.15;
    const s = i % 2 ? 1 : -1;
    const L = 52 + (i % 3) * 6;
    // both needles of a pair leave the same sheath and part a little
    pairs.push(
      `M${f1(x)} ${f1(y)} q${f1(L * 0.2)} ${f1(s * L * 0.5)} ${f1(L * 0.32)} ${f1(s * L * 0.92)}`,
    );
    pairs.push(
      `M${f1(x)} ${f1(y)} q${f1(L * 0.36)} ${f1(s * L * 0.45)} ${f1(L * 0.56)} ${f1(s * L * 0.82)}`,
    );
  }
  return (
    <Frame w={W} h={H}>
      <Twig d="M8 116 Q110 106 212 84" />
      <Draw d={pairs.join(" ")} className="bz5-o bz5-needle" delay={0.2} />
      <Pop delay={0.5}>
        <path
          d="M160 98 L166 126"
          className="bz5-o"
          style={{ strokeWidth: 2 }}
        />
        <Cone x={172} y={152} w={36} h={50} rot={-20} shape="pine" />
      </Pop>
      <Fade delay={0.7}>
        {/* one pair enlarged */}
        <g transform="translate(36 166)">
          <path d="M0 0 V-6" className="bz5-o" style={{ strokeWidth: 4 }} />
          <path
            d="M-1 -6 Q-10 -26 -18 -40 M1 -6 Q10 -26 18 -40"
            className="bz5-o bz5-needle"
            style={{ strokeWidth: 2.4 }}
          />
        </g>
        <Tag x={64} y={170}>
          po dvou
        </Tag>
      </Fade>
    </Frame>
  );
}

function Larch() {
  // short shoots with tufts of many soft needles
  const tufts: string[] = [];
  const shoots: [number, number][] = [
    [30, 107],
    [72, 101],
    [162, 84],
    [202, 72],
  ];
  shoots.forEach(([x, y], k) => {
    for (let i = 0; i < 18; i++) {
      const a = -Math.PI * (0.08 + (i / 17) * 0.84) + (k % 2 ? 0.1 : -0.1);
      const L = 16 + ((i * 7) % 5);
      tufts.push(
        `M${x} ${y - 4} l${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L)}`,
      );
    }
  });
  return (
    <Frame w={W} h={H}>
      <Twig d="M8 110 Q110 100 212 72" />
      {shoots.map(([x, y]) => (
        <circle
          key={x}
          cx={x}
          cy={y - 3}
          r={3.4}
          className="bz5-o bz5-twig-f"
        />
      ))}
      <Draw d={tufts.join(" ")} className="bz5-o bz5-needle-soft" delay={0.2} />
      <Pop delay={0.5}>
        <path d="M116 95 V78" className="bz5-o" style={{ strokeWidth: 2 }} />
        <Cone x={116} y={60} w={28} h={36} shape="egg" />
      </Pop>
      <Fade delay={0.7}>
        <Tag x={14} y={150}>
          svazečky
        </Tag>
        <text x={14} y={168} className="bz5-lbl bz5-sm">
          na zimu opadají
        </text>
      </Fade>
    </Frame>
  );
}

export default function Conifers() {
  return (
    <Figure
      level={3}
      label={LABEL}
      max={720}
      interactive
      className="bz5-conifers"
    >
      <div className="bz5-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={260}
          phoneColumns={2}
          steps={[
            {
              title: "Smrk ztepilý",
              art: <Spruce />,
              caption:
                "Jehlice jednotlivě, čtyřhranné, pichlavé. Šišky visí a opadávají celé.",
            },
            {
              title: "Jedle bělokorá",
              art: <Fir />,
              caption:
                "Ploché tupé jehlice, vespod dva bílé proužky. Šišky stojí a rozpadají se.",
            },
            {
              title: "Borovice lesní",
              art: <Pine />,
              caption:
                "Dlouhé jehlice po dvou ve svazečku. Šišky malé, kuželovité.",
            },
            {
              title: "Modřín opadavý",
              art: <Larch />,
              caption:
                "Měkké jehlice ve svazečcích po mnoha, na zimu opadávají.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
