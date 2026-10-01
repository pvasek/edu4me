import { useId } from "react";
import { Draw, Fade, Figure, Pop, Qty, Sym, f1 } from "./kit";

const LABEL =
  "Youngův pokus s dvojštěrbinou. Laser vysílá koherentní světlo, rovinné vlnoplochy dopadají na dvě blízké štěrbiny vzdálené d. Z každé štěrbiny se šíří kruhové vlny, které se za překážkou skládají. Na stínítku ve vzdálenosti l vzniknou střídavě světlé a tmavé proužky: světlý proužek tam, kde je dráhový rozdíl Δl celistvým násobkem vlnové délky (Δl = k · λ), tmavý tam, kde je lichým násobkem poloviny vlnové délky. Uprostřed je maximum nultého řádu k = 0, v bodě P maximum prvního řádu, kde je dráha od dolní štěrbiny o jednu vlnovou délku delší. Vpravo graf intenzity na stínítku.";

const LAM = 14;
const XB = 172; // barrier
const S1: [number, number] = [XB, 130];
const S2: [number, number] = [XB, 190];
const XS = 430; // screen
const RED = "#d9403a";

const dist = (a: [number, number], b: [number, number]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);
const delta = (y: number) => dist(S2, [XS, y]) - dist(S1, [XS, y]);
const inten = (y: number) => Math.cos((Math.PI * delta(y)) / LAM) ** 2;

/** y on the screen where the path difference equals k·λ (bisection). */
function maxAt(k: number) {
  let lo = -200;
  let hi = 520;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (delta(mid) > k * LAM) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export default function DoubleSlit() {
  const clip = "ds" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const P: [number, number] = [XS, maxAt(1)];
  const len = dist(S2, P);
  const Q: [number, number] = [
    S2[0] + ((P[0] - S2[0]) / len) * LAM,
    S2[1] + ((P[1] - S2[1]) / len) * LAM,
  ];
  const ys = Array.from({ length: 141 }, (_, i) => 20 + i * 2);
  const graph =
    "M" + ys.map((y) => `${f1(XS + 12 + 56 * inten(y))} ${y}`).join(" L");
  const orders = [-2, -1, 0, 1, 2]
    .map((k) => ({ k, y: maxAt(k) }))
    .filter((o) => o.y > 24 && o.y < 296);
  return (
    <Figure level={12} w={520} h={336} max={680} label={LABEL}>
      <defs>
        <clipPath id={clip}>
          <rect x={XB + 3} y={14} width={XS - XB - 7} height={292} />
        </clipPath>
      </defs>
      {/* laser and plane waves */}
      <rect
        x={10}
        y={146}
        width={54}
        height={28}
        rx={4}
        className="fz4-o fz4-fill3"
      />
      <circle cx={58} cy={160} r={3} fill={RED} />
      <text x={37} y={136} textAnchor="middle" className="fz4-lbl fz4-b">
        laser
      </text>
      <Fade delay={0.1}>
        <rect
          x={64}
          y={124}
          width={XB - 64}
          height={72}
          fill={RED}
          opacity={0.12}
        />
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M${76 + i * LAM} 126 V194`}
            className="fz4-front-red"
          />
        ))}
      </Fade>
      {/* circular waves behind the slits */}
      <Fade delay={0.4}>
        <g clipPath={`url(#${clip})`}>
          {[S1, S2].map((s, j) =>
            Array.from({ length: 19 }, (_, i) => (
              <circle
                key={`${j}-${i}`}
                cx={s[0]}
                cy={s[1]}
                r={(i + 1) * LAM}
                className="fz4-front-red fz4-front-soft"
              />
            )),
          )}
        </g>
      </Fade>
      {/* barrier with two slits */}
      <path
        d={`M${XB} 20 V${S1[1] - 4} M${XB} ${S1[1] + 4} V${S2[1] - 4} M${XB} ${S2[1] + 4} V300`}
        className="fz4-barrier"
      />
      <text x={XB} y={14} textAnchor="middle" className="fz4-lbl fz4-b">
        dvojštěrbina
      </text>
      <path
        d={`M${XB - 16} ${S1[1]} H${XB - 8} M${XB - 16} ${S2[1]} H${XB - 8} M${XB - 12} ${S1[1] + 2} V${S2[1] - 2}`}
        className="fz4-o fz4-thin"
      />
      <Sym x={XB - 18} y={166} t="d" anchor="end" />
      {/* rays to P and the path difference */}
      <Draw
        d={`M${S1[0]} ${S1[1]} L${P[0]} ${f1(P[1])}`}
        className="fz4-ray-ink"
        delay={0.8}
      />
      <Draw
        d={`M${S2[0]} ${S2[1]} L${P[0]} ${f1(P[1])}`}
        className="fz4-ray-ink"
        delay={0.9}
      />
      <Pop delay={1.4}>
        <path
          d={`M${S2[0]} ${S2[1]} L${f1(Q[0])} ${f1(Q[1])}`}
          className="fz4-dl"
        />
        <path
          d={`M${S1[0]} ${S1[1]} L${f1(Q[0])} ${f1(Q[1])}`}
          className="fz4-o fz4-thin fz4-dash"
        />
      </Pop>
      <Fade delay={1.5}>
        <Qty
          x={XB + 22}
          y={S2[1] + 26}
          s="Δl = λ"
          className="fz4-acc-t fz4-halo"
        />
        <Sym x={P[0] - 10} y={P[1] - 8} t="P" anchor="end" />
      </Fade>
      {/* screen with fringes */}
      <rect x={XS - 4} y={20} width={8} height={280} className="fz4-fill3" />
      <Fade delay={1}>
        {ys.map((y) => (
          <rect
            key={y}
            x={XS - 4}
            y={y}
            width={8}
            height={2.2}
            fill={RED}
            opacity={inten(y)}
          />
        ))}
      </Fade>
      <rect
        x={XS - 4}
        y={20}
        width={8}
        height={280}
        className="fz4-o fz4-thin"
        fill="none"
      />
      <text x={XS} y={14} textAnchor="middle" className="fz4-lbl fz4-b">
        stínítko
      </text>
      {/* intensity */}
      <path d={`M${XS + 12} 22 V298`} className="fz4-o fz4-thin" />
      <Draw d={graph} className="fz4-graph-red" delay={1.1} />
      <Fade delay={1.4}>
        {orders.map((o) => (
          <text
            key={o.k}
            x={XS + 82}
            y={o.y + 5}
            textAnchor="middle"
            className="fz4-eq fz4-eq-sm"
          >
            {`${o.k < 0 ? "−" : ""}${Math.abs(o.k)}`}
          </text>
        ))}
        <Sym x={XS + 82} y={16} t="k" />
      </Fade>
      {/* l */}
      <path
        d={`M${XB} 308 V320 M${XS} 308 V320 M${XB + 2} 314 H${XS - 2}`}
        className="fz4-o fz4-thin"
      />
      <Sym x={(XB + XS) / 2} y={334} t="l" />
      <Pop delay={1.6}>
        <rect
          x={10}
          y={232}
          width={146}
          height={56}
          rx={6}
          className="fz4-tag-lvl"
        />
        <text
          x={83}
          y={254}
          textAnchor="middle"
          className="fz4-lbl fz4-sm fz4-b"
        >
          světlý proužek:
        </text>
        <Qty x={83} y={276} s="Δl = k λ" anchor="middle" />
      </Pop>
    </Figure>
  );
}
