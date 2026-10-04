import { Figure, Fade, Lbl, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Půdní profil v řezu. Nahoře leží opad z listí a jehličí. Pod ním tmavý humusový horizont neboli ornice, nejbohatší na život: žížaly, houbová vlákna, larvy hmyzu, kořeny a miliardy bakterií, které rozkládají odumřelé zbytky na humus. Níže je světlejší podorničí s jílem a minerály, kam sahají už jen hluboké kořeny. Pod ním zvětralá matečná hornina z úlomků a nakonec pevná matečná hornina, skalní podloží, ze kterého půda zvětráváním vzniká.";

const W = 400;
const H = 470;
const X0 = 16;
const X1 = 206;

const HZ = [
  { y0: 46, y1: 66, cls: "bz3-soil-o", name: "opad", sub: "listí, jehličí" },
  { y0: 66, y1: 160, cls: "bz3-soil-a", name: "humus (ornice)", sub: "tmavá, plná života" },
  { y0: 160, y1: 268, cls: "bz3-soil-b", name: "podorničí", sub: "jíl a minerály" },
  { y0: 268, y1: 360, cls: "bz3-soil-c", name: "zvětralá hornina", sub: "úlomky podloží" },
  { y0: 360, y1: 456, cls: "bz3-soil-r", name: "matečná hornina", sub: "pevné skalní podloží" },
];

function Plate() {
  const { id } = useFig();
  const r = rng(5);
  const edge = (y: number, k: number) => {
    let d = `M${X0} ${y}`;
    for (let x = X0 + 19; x <= X1; x += 19) d += ` L${x} ${f1(y + Math.sin(x / 17 + k) * 3)}`;
    return d;
  };
  const band = (h: (typeof HZ)[number], k: number) => {
    const b = k < HZ.length - 1 ? h.y1 + 5 : h.y1;
    return `${edge(h.y0, k)} L${X1} ${b} L${X0} ${b}Z`;
  };
  // stones in C, cracks in R
  const stones = Array.from({ length: 16 }, () => [X0 + 10 + r() * (X1 - X0 - 20), 278 + r() * 74, 6 + r() * 9] as const);
  const roots = [
    "M60 44 C58 70 66 96 58 130 C54 150 60 170 56 196",
    "M60 80 C46 92 38 104 34 120",
    "M60 104 C74 114 80 128 84 142",
    "M58 150 C46 160 44 176 40 186",
    "M150 44 C152 66 146 90 150 116 C152 132 148 146 150 160",
    "M150 84 C162 94 168 104 172 118",
    "M150 110 C138 120 132 130 130 142",
  ];
  return (
    <>
      {HZ.map((h, i) => (
        <g key={h.name}>
          <path d={band(h, i)} className={h.cls} />
          <path
            d={band(h, i)}
            fill={pat(id, i === 1 ? "dots" : i === 2 ? "d" : i === 4 ? "x" : "b")}
            opacity={i === 1 ? 0.9 : 0.4}
          />
          <path d={edge(h.y0, i)} className="bz3-o bz3-thin" />
        </g>
      ))}
      <rect x={X0} y={46} width={X1 - X0} height={456 - 46} className="bz3-o" fill="none" />
      {/* litter */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx={X0 + 10 + i * 15.5}
          cy={54 + (i % 3) * 3}
          rx={7}
          ry={2.6}
          transform={`rotate(${(i * 37) % 50 - 25} ${X0 + 10 + i * 15.5} ${54 + (i % 3) * 3})`}
          className="bz3-litter"
        />
      ))}
      {/* stones and bedrock cracks */}
      {stones.map(([x, y, s], i) => (
        <path
          key={i}
          d={`M${f1(x - s)} ${f1(y)} L${f1(x - s * 0.4)} ${f1(y - s * 0.8)} L${f1(x + s * 0.7)} ${f1(y - s * 0.6)} L${f1(x + s)} ${f1(y + s * 0.3)} L${f1(x + s * 0.2)} ${f1(y + s * 0.8)} L${f1(x - s * 0.7)} ${f1(y + s * 0.6)}Z`}
          className="bz3-stone"
        />
      ))}
      <path d="M40 372 L54 396 L48 420 M120 364 L112 392 L126 418 L118 450 M176 380 L188 404 M90 430 L104 446" className="bz3-crack" />
      {/* grass and a small plant on top */}
      <path d="M20 46 l3 -10 l3 10 M34 46 l2 -8 l3 8 M88 46 l3 -9 l2 9 M110 46 l2 -10 l3 10 M170 46 l3 -9 l2 9 M190 46 l2 -8 l3 8" className="bz3-grass" />
      <Pop delay={0.2}>
        <g>
          <path d="M60 46 V20 M150 46 V24" className="bz3-stem" />
          <path d="M60 30 C48 24 46 14 52 10 C58 14 62 22 60 30Z M60 26 C70 18 74 10 70 6 C64 10 60 18 60 26Z" className="bz3-leaf-s" />
          <path d="M150 30 C140 22 140 14 144 12 C150 16 152 24 150 30Z M150 28 C160 22 164 14 160 10 C154 14 150 20 150 28Z" className="bz3-leaf-s" />
        </g>
      </Pop>
      {/* roots */}
      <g>
        {roots.map((d, i) => (
          <path key={i} d={d} className="bz3-root" />
        ))}
      </g>
      {/* organisms */}
      <Pop delay={0.5}>
        {/* earthworm */}
        <path d="M96 128 C104 120 114 136 122 128 C130 120 138 134 146 126" className="bz3-worm" />
        <path d="M100 126 l0 4 M108 126 l0 5 M116 130 l0 4 M126 126 l0 4 M134 126 l0 5" className="bz3-worm-ring" />
        {/* fungal hyphae */}
        <path d="M120 80 l10 8 l-4 10 M130 88 l12 -2 l6 8 M142 86 l4 -10 M126 98 l8 6" className="bz3-hypha" />
        {/* beetle larva (grub) */}
        <path d="M88 220 C80 210 88 198 100 200 C112 202 116 214 108 222" className="bz3-grub" />
        <circle cx={109} cy={222} r={4} className="bz3-grub-head" />
        {/* springtails */}
        <path d="M74 96 l6 -1 M76 100 l5 1" className="bz3-o bz3-thin" />
      </Pop>
      <Fade delay={0.8}>
        <Lbl x={X0 + 6} y={112} tx={78} ty={98} className="bz3-sm bz3-b bz3-halo">
          chvostoskok
        </Lbl>
        <Lbl x={X1 - 6} y={150} tx={130} ty={128} anchor="end" className="bz3-sm bz3-b bz3-halo">
          žížala
        </Lbl>
        <Lbl x={X1 - 6} y={78} tx={138} ty={88} anchor="end" className="bz3-sm bz3-b bz3-halo">
          houby
        </Lbl>
        <Lbl x={X1 - 6} y={244} tx={104} ty={210} anchor="end" className="bz3-sm bz3-b bz3-halo">
          larva brouka
        </Lbl>
        <Lbl x={X0 + 6} y={186} tx={46} ty={178} anchor="start" ly={176} lx={60} className="bz3-sm bz3-b bz3-halo">
          kořeny
        </Lbl>
      </Fade>
      {/* horizon labels with brackets */}
      {HZ.map((h, i) => {
        const mid = (h.y0 + h.y1) / 2;
        const small = h.y1 - h.y0 < 40;
        return (
          <Fade key={h.name} delay={0.3 + i * 0.15}>
            <path d={`M${X1 + 8} ${h.y0 + 2} h5 V${h.y1 - 2} h-5`} className="bz3-o bz3-thin" />
            <text x={X1 + 20} y={small ? mid + 5 : mid - 3} className="bz3-lbl bz3-b">
              {h.name}
              {small && <tspan className="bz3-sm bz3-nob"> · {h.sub}</tspan>}
            </text>
            {!small && (
              <text x={X1 + 20} y={mid + 16} className="bz3-lbl bz3-sm">
                {h.sub}
              </text>
            )}
          </Fade>
        );
      })}
    </>
  );
}

export default function SoilProfile() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={540}>
      <Plate />
    </Figure>
  );
}
