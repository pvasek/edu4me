import { DrawArrow, Fade, Frame, Lbl, Plates, pat, useFig } from "./kit";

const LABEL =
  "Močová soustava zepředu: dvě ledviny tvaru fazole po stranách páteře, do každé přivádí krev ledvinová tepna z srdečnice a odvádí ji ledvinová žíla do duté žíly. Z ledvin vedou močovody do močového měchýře a z něj ven močová trubice. Ledvina v řezu: na povrchu kůra, uvnitř dřeň s ledvinovými pyramidami a ledvinová pánvička, která sbírá moč do močovodu. Nefron: v ledvinovém tělísku se z klubíčka vlásečnic profiltruje primární moč, asi 180 litrů za den; kanálek vrátí do krve skoro všechnu vodu, glukózu a potřebné soli a zbude asi 1,5 litru definitivní moči.";

function Bean({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const { id } = useFig();
  const d = "M0 -44 Q30 -48 34 -10 Q36 24 10 44 Q-16 54 -26 30 Q-18 12 -12 0 Q-18 -12 -26 -30 Q-24 -42 0 -44Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d={d} className="bz2-o bz2-kidney" />
      <path d={d} fill={pat(id, "d")} opacity={0.5} />
    </g>
  );
}

function Overview() {
  const C = 160;
  return (
    <Frame w={320} h={380} row="span 2">
      {/* spine hint */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={C - 8} y={40 + i * 26} width={16} height={20} rx={4} className="bz2-o bz2-thin bz2-bone" opacity={0.6} />
      ))}
      {/* aorta + vena cava */}
      <path d={`M${C + 12} 10 V250 L${C + 40} 300 M${C + 12} 250 L${C - 10} 300`} className="bz2-o" style={{ strokeWidth: 12 }} />
      <path d={`M${C + 12} 10 V250 L${C + 40} 300 M${C + 12} 250 L${C - 10} 300`} className="bz2-tube-oxy" style={{ strokeWidth: 9 }} />
      <path d={`M${C - 16} 10 V250`} className="bz2-o" style={{ strokeWidth: 14 }} />
      <path d={`M${C - 16} 10 V250`} className="bz2-tube-deoxy" style={{ strokeWidth: 11 }} />
      {/* renal vessels */}
      <path d={`M${C + 12} 116 L230 110 M${C + 12} 116 L104 112`} className="bz2-o" style={{ strokeWidth: 6 }} />
      <path d={`M${C + 12} 116 L230 110 M${C + 12} 116 L104 112`} className="bz2-tube-oxy" style={{ strokeWidth: 4 }} />
      <path d={`M${C - 16} 132 L100 132 M${C - 16} 132 L226 130`} className="bz2-o" style={{ strokeWidth: 7 }} />
      <path d={`M${C - 16} 132 L100 132 M${C - 16} 132 L226 130`} className="bz2-tube-deoxy" style={{ strokeWidth: 5 }} />
      {/* kidneys */}
      <Bean x={78} y={122} flip />
      <Bean x={242} y={118} />
      {/* ureters */}
      <path d="M96 150 Q110 230 140 312 M224 146 Q210 230 180 312" className="bz2-o" style={{ strokeWidth: 6 }} />
      <path d="M96 150 Q110 230 140 312 M224 146 Q210 230 180 312" className="bz2-urine-s" style={{ strokeWidth: 3.6 }} />
      {/* bladder + urethra */}
      <path d="M124 306 Q160 290 196 306 Q206 340 178 352 L168 356 V378 H152 V356 L142 352 Q114 340 124 306Z" className="bz2-o bz2-bladder2" />
      <path d="M128 316 Q160 304 192 316" className="bz2-o bz2-thin" />
      <Fade delay={0.4}>
        <Lbl x={6} y={40} tx={60} ty={96} className="bz2-sm bz2-b">ledvina</Lbl>
        <Lbl x={6} y={226} tx={108} ty={210} className="bz2-sm">močovod</Lbl>
        <Lbl x={6} y={300} tx={128} ty={318} className="bz2-sm bz2-b">močový měchýř</Lbl>
        <Lbl x={6} y={374} tx={152} ty={370} className="bz2-sm">močová trubice</Lbl>
        <Lbl x={316} y={30} tx={174} ty={40} anchor="end" lx={260} ly={34} className="bz2-xs bz2-red-t">srdečnice</Lbl>
        <Lbl x={316} y={200} tx={148} ty={200} anchor="end" lx={250} ly={196} className="bz2-xs bz2-blue-t" sec>dutá žíla</Lbl>
        <Lbl x={316} y={78} tx={210} ty={112} anchor="end" lx={290} ly={84} className="bz2-xs" sec>ledvinová tepna</Lbl>
      </Fade>
    </Frame>
  );
}

function Section() {
  const { id } = useFig();
  const outer = "M60 30 Q140 10 180 60 Q200 100 186 150 Q170 196 110 200 Q50 200 40 150 Q66 128 92 112 Q66 96 40 80 Q38 40 60 30Z";
  const pyr = [
    [70, 46, 100, 80],
    [122, 36, 120, 82],
    [168, 74, 134, 100],
    [172, 140, 134, 124],
    [118, 186, 118, 140],
    [66, 172, 98, 136],
  ];
  return (
    <Frame w={280} h={220} title="ledvina v řezu">
      <path d={outer} className="bz2-o bz2-kidney" />
      <path d="M68 44 Q140 30 168 66 Q184 100 172 144 Q160 180 112 184 Q66 184 58 150 Q78 130 100 114 Q78 98 58 80 Q58 54 68 44Z" className="bz2-o bz2-thin bz2-medulla" />
      {pyr.map(([x1, y1, x2, y2], i) => {
        const dx = y2 - y1;
        const dy = -(x2 - x1);
        const L = Math.hypot(dx, dy) || 1;
        const kx = (dx / L) * 13;
        const ky = (dy / L) * 13;
        return (
          <path
            key={i}
            d={`M${x1 + kx} ${y1 + ky} L${x2} ${y2} L${x1 - kx} ${y1 - ky}Z`}
            className="bz2-o bz2-thin bz2-pyramid"
          />
        );
      })}
      <path d="M96 100 Q120 96 136 106 Q140 116 136 126 Q120 134 96 128 Q84 114 96 100Z" className="bz2-o bz2-urine-f" />
      <path d="M92 114 Q60 116 30 130 Q16 150 12 208" className="bz2-o" style={{ strokeWidth: 7 }} />
      <path d="M92 114 Q60 116 30 130 Q16 150 12 208" className="bz2-urine-s" style={{ strokeWidth: 4.4 }} />
      <path d={outer} fill={pat(id, "dots")} opacity={0.4} />
      <Lbl x={276} y={30} tx={178} ty={56} anchor="end" lx={236} ly={36} className="bz2-sm bz2-b">kůra</Lbl>
      <Lbl x={276} y={104} tx={156} ty={110} anchor="end" lx={226} ly={104} className="bz2-sm">dřeň</Lbl>
      <Lbl x={276} y={176} tx={134} ty={124} anchor="end" lx={232} ly={170} className="bz2-sm">pánvička</Lbl>
      <Lbl x={30} y={216} tx={18} ty={186} className="bz2-xs" sec>do močovodu</Lbl>
    </Frame>
  );
}

function Nephron() {
  return (
    <Frame w={280} h={230} title="nefron">
      {/* glomerulus in the capsule */}
      <circle cx={60} cy={70} r={34} className="bz2-o bz2-capsule" />
      <path d="M38 56 q8 -14 18 -2 q10 12 18 -2 q8 -10 6 10 q-4 14 -16 6 q-10 -10 -18 4 q-8 10 -10 -6" className="bz2-o bz2-glom" />
      <path d="M8 40 L38 56 M8 84 L36 76" className="bz2-o bz2-glomv" />
      {/* tubule */}
      <path d="M86 88 Q120 110 120 140 Q122 196 150 200 Q176 200 176 140 Q178 92 210 90 Q240 92 240 130 L240 214" className="bz2-o bz2-tubule" />
      {/* arrows */}
      <DrawArrow d="M48 82 Q60 90 82 92" tone="ink" delay={0.4} />
      <DrawArrow d="M150 150 Q140 120 116 104" tone="blue" delay={0.7} />
      <DrawArrow d="M204 122 Q196 104 214 70" tone="blue" delay={0.9} />
      <Lbl x={8} y={130} className="bz2-sm bz2-b">filtrace</Lbl>
      <Lbl x={8} y={148} className="bz2-xs">primární moč</Lbl>
      <Lbl x={8} y={166} className="bz2-xs bz2-lvl-t bz2-b">≈ 180 l / den</Lbl>
      <Lbl x={150} y={24} className="bz2-sm bz2-blue-t bz2-b">zpět do krve:</Lbl>
      <Lbl x={150} y={42} className="bz2-xs">voda, glukóza, soli</Lbl>
      <Lbl x={274} y={204} anchor="end" className="bz2-xs bz2-lvl-t bz2-b">≈ 1,5 l moči</Lbl>
      <Lbl x={4} y={22} tx={56} ty={38} className="bz2-xs bz2-b">ledvinové tělísko</Lbl>
    </Frame>
  );
}

export default function UrinarySystem() {
  return (
    <Plates label={LABEL} level={6} max={760} cols="1.1fr 1fr" stackBelow={600}>
      <Overview />
      <Section />
      <Nephron />
    </Plates>
  );
}
