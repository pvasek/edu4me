import { Fade, Figure, Lbl, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Živočišná eukaryotní buňka tak, jak ji ukazuje elektronový mikroskop. Uprostřed je jádro s dvojitou jadernou membránou s póry a s tmavým jadérkem. Na jádro navazuje drsné endoplazmatické retikulum posázené ribozomy, které vyrábí bílkoviny, a hladké ER bez ribozomů, které tvoří lipidy. Golgiho aparát ze zploštělých váčků bílkoviny upravuje a balí do měchýřků. Lyzozom obsahuje trávicí enzymy, mitochondrie s dvojitou membránou a kristami vyrábějí ATP. V cytoplazmě jsou volné ribozomy a cytoskelet z vláken a mikrotubulů, celé to obaluje cytoplazmatická membrána.";

const W = 440;
const H = 420;
const NX = 186;
const NY = 186;
const NR = 52;

const cellPath =
  "M220 40 C300 38 344 96 344 168 C346 236 350 300 312 352 C276 398 176 400 132 360 C96 326 92 262 98 200 C102 120 140 42 220 40Z";

function Mito({ x, y, rot }: { x: number; y: number; rot: number }) {
  const { id } = useFig();
  let cr = "M-22 0";
  for (let i = 0; i < 7; i++) cr += ` L${-19 + i * 6} ${i % 2 ? 7 : -7}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse cx={0} cy={0} rx={28} ry={13} className="bz3-mito" />
      <ellipse cx={0} cy={0} rx={28} ry={13} fill={pat(id, "d")} opacity={0.35} />
      <ellipse cx={0} cy={0} rx={24.5} ry={9.8} className="bz3-mito-in" />
      <path d={cr} className="bz3-cristae" />
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const r = rng(21);
  // rough ER: concentric cisternae around the nucleus (upper right), studded with ribosomes
  const er = [64, 73, 82].map((rad) => {
    const a0 = -100;
    const a1 = 10;
    const p = (a: number, rr: number) => [NX + Math.cos((a * Math.PI) / 180) * rr, NY + Math.sin((a * Math.PI) / 180) * rr];
    const [x0, y0] = p(a0, rad);
    const [x1, y1] = p(a1, rad);
    const [x2, y2] = p(a1, rad + 4);
    const [x3, y3] = p(a0, rad + 4);
    const d = `M${f1(x0)} ${f1(y0)} A${rad} ${rad} 0 0 1 ${f1(x1)} ${f1(y1)} A2 2 0 0 1 ${f1(x2)} ${f1(y2)} A${rad + 4} ${rad + 4} 0 0 0 ${f1(x3)} ${f1(y3)} A2 2 0 0 1 ${f1(x0)} ${f1(y0)}Z`;
    const dots: [number, number][] = [];
    for (let a = a0 + 4; a < a1; a += 7) {
      dots.push(p(a, rad + 6.5) as [number, number]);
      dots.push(p(a + 3.5, rad - 2.5) as [number, number]);
    }
    return { d, dots };
  });
  const golgi = [0, 1, 2, 3, 4].map((i) => {
    const y = 236 + i * 9;
    const w = 34 - Math.abs(i - 2) * 4;
    return `M${292 - w} ${y + 6} Q292 ${y - 8} ${292 + w} ${y + 6} Q292 ${y - 2} ${292 - w} ${y + 6}Z`;
  });
  const freeRibo = Array.from({ length: 34 }, () => {
    for (;;) {
      const x = 110 + r() * 225;
      const y = 60 + r() * 320;
      const dn = Math.hypot(x - NX, y - NY);
      if (dn < NR + 40) continue;
      if (x > 250 && x < 335 && y > 225 && y < 290) continue;
      if (((x - 220) / 116) ** 2 + ((y - 220) / 170) ** 2 > 0.82) continue;
      return [x, y];
    }
  });
  const pores = [20, 80, 140, 200, 260, 320];
  return (
    <>
      {/* cell */}
      <path d={cellPath} className="bz3-cyto" />
      <path d={cellPath} fill={pat(id, "dots")} opacity={0.5} />
      <path d={cellPath} className="bz3-membrane" />
      <path d={cellPath} className="bz3-membrane-in" />

      {/* cytoskeleton: microtubules from the centrosome, actin under the membrane */}
      <Fade delay={0.2}>
        <path
          d="M244 252 L120 214 M244 252 L150 336 M244 252 L330 196 M244 252 L300 360 M244 252 L214 380 M244 252 L332 300"
          className="bz3-mt"
        />
        <g transform="translate(244 252)">
          <rect x={-8} y={-3} width={10} height={6} rx={1.5} className="bz3-centriole" />
          <rect x={2} y={-1} width={6} height={10} rx={1.5} className="bz3-centriole" />
        </g>
      </Fade>

      {/* nucleus */}
      <Pop delay={0.1}>
        <circle cx={NX} cy={NY} r={NR} className="bz3-nucleus" />
        <circle cx={NX} cy={NY} r={NR} fill={pat(id, "dots")} />
        <circle cx={NX} cy={NY} r={NR} className="bz3-env" />
        <circle cx={NX} cy={NY} r={NR - 4} className="bz3-env" />
        {pores.map((a) => {
          const c = Math.cos((a * Math.PI) / 180);
          const s = Math.sin((a * Math.PI) / 180);
          return <line key={a} x1={NX + c * (NR - 5)} y1={NY + s * (NR - 5)} x2={NX + c * (NR + 1)} y2={NY + s * (NR + 1)} className="bz3-pore" />;
        })}
        <circle cx={NX - 10} cy={NY + 4} r={16} className="bz3-nucleolus" />
        <circle cx={NX - 10} cy={NY + 4} r={16} fill={pat(id, "xd")} />
        <path d={`M${NX + 14} ${NY - 24} q6 4 2 10 M${NX + 22} ${NY + 16} q-6 6 -12 2 M${NX - 26} ${NY - 22} q4 6 10 4`} className="bz3-chromatin" />
      </Pop>

      {/* rough ER */}
      <Pop delay={0.35}>
        {er.map((e, i) => (
          <g key={i}>
            <path d={e.d} className="bz3-er" />
            {e.dots.map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={1.7} className="bz3-ribo" />
            ))}
          </g>
        ))}
      </Pop>

      {/* smooth ER */}
      <Pop delay={0.5}>
        <path d="M118 262 C130 248 146 266 158 252 C170 238 184 258 196 246 M122 278 C136 266 150 284 164 272 C176 262 188 276 200 266 M128 294 C142 284 156 298 170 290" className="bz3-ser" />
      </Pop>

      {/* Golgi + vesicles */}
      <Pop delay={0.65}>
        {golgi.map((d, i) => (
          <path key={i} d={d} className="bz3-golgi" />
        ))}
        {[
          [262, 230, 4],
          [326, 232, 4.5],
          [320, 292, 5],
          [334, 318, 5.5],
          [258, 290, 4],
        ].map(([x, y, rr], i) => (
          <circle key={i} cx={x} cy={y} r={rr} className="bz3-vesicle" />
        ))}
      </Pop>

      {/* lysosome */}
      <Pop delay={0.8}>
        <circle cx={232} cy={326} r={13} className="bz3-lyso" />
        <circle cx={232} cy={326} r={13} fill={pat(id, "dots")} />
      </Pop>

      {/* mitochondria */}
      <Pop delay={0.9}>
        <Mito x={140} y={322} rot={-25} />
        <Mito x={296} y={136} rot={58} />
        <Mito x={150} y={92} rot={-35} />
      </Pop>

      {/* free ribosomes */}
      <Fade delay={1}>
        {freeRibo.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.7} className="bz3-ribo" />
        ))}
      </Fade>

      {/* labels */}
      <Fade delay={1.2}>
        <Lbl x={6} y={70} tx={136} ty={96} className="bz3-sm bz3-b">mitochondrie</Lbl>
        <Lbl x={6} y={130} tx={150} ty={160} className="bz3-sm bz3-b">jádro</Lbl>
        <Lbl x={6} y={176} tx={172} ty={190} className="bz3-sm bz3-b">jadérko</Lbl>
        <Lbl x={6} y={226} tx={114} ty={210} className="bz3-sm bz3-b">cytoskelet</Lbl>
        <Lbl x={6} y={276} tx={124} ty={272} className="bz3-sm bz3-b">hladké ER</Lbl>
        <Lbl x={6} y={378} tx={118} ty={344} className="bz3-sm bz3-b">membrána</Lbl>
        <Lbl x={W - 6} y={60} tx={240} ty={124} anchor="end" className="bz3-sm bz3-b">drsné ER</Lbl>
        <Lbl x={W - 6} y={196} tx={262} ty={175} anchor="end" className="bz3-sm bz3-b">ribozomy</Lbl>
        <Lbl x={W - 6} y={246} tx={318} ty={250} anchor="end" className="bz3-sm bz3-b">Golgiho aparát</Lbl>
        <Lbl x={W - 6} y={296} tx={326} ty={293} anchor="end" className="bz3-sm bz3-b">měchýřek</Lbl>
        <Lbl x={W - 6} y={344} tx={244} ty={330} anchor="end" className="bz3-sm bz3-b">lyzozom</Lbl>
        <Lbl x={W - 6} y={392} tx={246} ty={254} anchor="end" lx={350} ly={380} className="bz3-sm bz3-b">centrozom</Lbl>
      </Fade>
    </>
  );
}

export default function OrganellesDetail() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={600}>
      <Plate />
    </Figure>
  );
}
