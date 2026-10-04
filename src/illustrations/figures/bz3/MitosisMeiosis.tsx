import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, f1 } from "./kit";

const LABEL =
  "Mitóza a meióza vedle sebe. Mitóza: buňka se dvěma páry chromozomů (2n = 4, od matky červené, od otce modré) zdvojí DNA, chromozomy se seřadí v rovině a rozestoupí, takže vzniknou dvě geneticky stejné diploidní buňky. Meióza: homologní chromozomy se spárují a při crossing-overu si vymění úseky, první dělení oddělí homology a druhé chromatidy. Vzniknou čtyři haploidní buňky (n = 2), každá s jinou kombinací chromozomů – proto jsou sourozenci různí.";

const W = 260;
const H = 410;
const MOM = "#d9603b";
const DAD = "#3f6fb5";
const LONG = 30;
const SHORT = 18;

/** One chromatid: vertical rod centred at (x, y); `tip` recolours the lower end (crossing-over). */
function Rod({ x, y, len, col, tip }: { x: number; y: number; len: number; col: string; tip?: string }) {
  const w = 5.5;
  const top = y - len / 2;
  const t = len * 0.36;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={len} rx={w / 2} fill={col} className="bz3-chrom" />
      {tip && (
        <path
          d={`M${f1(x - w / 2)} ${f1(top + len - t)} H${f1(x + w / 2)} V${f1(top + len - w / 2)} A${w / 2} ${w / 2} 0 0 1 ${f1(x - w / 2)} ${f1(top + len - w / 2)}Z`}
          fill={tip}
          className="bz3-chrom"
        />
      )}
    </g>
  );
}

/** Replicated chromosome: two sister chromatids joined at the centromere. */
function Dup({ x, y, len, col, tip, tip2 }: { x: number; y: number; len: number; col: string; tip?: string; tip2?: string }) {
  return (
    <g>
      <Rod x={x - 3.2} y={y} len={len} col={col} tip={tip} />
      <Rod x={x + 3.2} y={y} len={len} col={col} tip={tip2} />
      <circle cx={x} cy={y - len * 0.08} r={2.6} className="bz3-centro" />
    </g>
  );
}

function Cell({ x, y, r, children, note }: { x: number; y: number; r: number; children?: React.ReactNode; note?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="bz3-cellbg" />
      <circle cx={x} cy={y} r={r} className="bz3-o" />
      {children}
      {note && (
        <text x={x} y={y + r + 15} textAnchor="middle" className="bz3-eq bz3-eq-sm">
          {note}
        </text>
      )}
    </g>
  );
}

function Parent({ y }: { y: number }) {
  return (
    <Cell x={W / 2} y={y} r={38} note="2n = 4">
      <Rod x={W / 2 - 18} y={y} len={LONG} col={MOM} />
      <Rod x={W / 2 - 6} y={y} len={LONG} col={DAD} />
      <Rod x={W / 2 + 7} y={y + 4} len={SHORT} col={MOM} />
      <Rod x={W / 2 + 19} y={y + 4} len={SHORT} col={DAD} />
    </Cell>
  );
}

function Step({ x, y, t }: { x: number; y: number; t: string }) {
  return (
    <text x={x} y={y} className="bz3-lbl bz3-sm bz3-b bz3-lvl-t bz3-halo">
      {t}
    </text>
  );
}

function Mitosis() {
  const cx = W / 2;
  return (
    <Frame w={W} h={H}>
      <Parent y={52} />
      <Arrow d={`M${cx} 108 V128`} tone="lvl" />
      <Step x={cx + 10} y={124} t="zdvojení DNA" />
      <Cell x={cx} y={190} r={50}>
        <path d={`M${cx} 146 L${cx - 26} 190 L${cx} 234 M${cx} 146 L${cx + 26} 190 L${cx} 234`} className="bz3-spindle" />
        <Dup x={cx} y={160} len={LONG * 0.8} col={MOM} />
        <Dup x={cx} y={184} len={LONG * 0.8} col={DAD} />
        <Dup x={cx} y={204} len={SHORT * 0.8} col={MOM} />
        <Dup x={cx} y={222} len={SHORT * 0.8} col={DAD} />
      </Cell>
      <Step x={cx + 54} y={160} t="v rovině" />
      <Arrow d={`M${cx - 30} 246 L${cx - 52} 268`} tone="lvl" />
      <Arrow d={`M${cx + 30} 246 L${cx + 52} 268`} tone="lvl" />
      {[cx - 64, cx + 64].map((x) => (
        <Cell key={x} x={x} y={318} r={40} note="2n = 4">
          <Rod x={x - 17} y={318} len={LONG} col={MOM} />
          <Rod x={x - 6} y={318} len={LONG} col={DAD} />
          <Rod x={x + 6} y={322} len={SHORT} col={MOM} />
          <Rod x={x + 17} y={322} len={SHORT} col={DAD} />
        </Cell>
      ))}
      <text x={cx} y={398} textAnchor="middle" className="bz3-lbl bz3-b">
        2 stejné buňky
      </text>
    </Frame>
  );
}

function Meiosis() {
  const cx = W / 2;
  const Q = [34, 98, 162, 226];
  return (
    <Frame w={W} h={H}>
      <Parent y={52} />
      <Arrow d={`M${cx} 108 V118`} tone="lvl" />
      {/* paired homologues with crossing-over */}
      <Cell x={cx} y={162} r={40}>
        <Dup x={cx - 19} y={158} len={LONG} col={MOM} tip2={DAD} />
        <Dup x={cx - 6} y={158} len={LONG} col={DAD} tip={MOM} />
        <Dup x={cx + 10} y={162} len={SHORT} col={MOM} />
        <Dup x={cx + 23} y={162} len={SHORT} col={DAD} />
        
      </Cell>
      <Step x={cx + 46} y={152} t="crossing-" />
      <Step x={cx + 46} y={168} t="over" />
      <Arrow d={`M${cx - 30} 196 L${cx - 46} 212`} tone="lvl" />
      <Arrow d={`M${cx + 30} 196 L${cx + 46} 212`} tone="lvl" />
      <Step x={6} y={206} t="1. dělení" />
      {/* after meiosis I: homologues separated, still two chromatids */}
      <Cell x={cx - 64} y={244} r={30}>
        <Dup x={cx - 72} y={242} len={LONG} col={MOM} tip2={DAD} />
        <Dup x={cx - 54} y={246} len={SHORT} col={DAD} />
      </Cell>
      <Cell x={cx + 64} y={244} r={30}>
        <Dup x={cx + 56} y={242} len={LONG} col={DAD} tip={MOM} />
        <Dup x={cx + 74} y={246} len={SHORT} col={MOM} />
      </Cell>
      <Arrow d={`M${Q[0] + 30} 276 L${Q[0] + 8} 296`} tone="lvl" />
      <Arrow d={`M${Q[1] - 18} 276 L${Q[1] - 8} 296`} tone="lvl" />
      <Arrow d={`M${Q[2] + 18} 276 L${Q[2] + 8} 296`} tone="lvl" />
      <Arrow d={`M${Q[3] - 30} 276 L${Q[3] - 8} 296`} tone="lvl" />
      <Step x={cx - 30} y={290} t="2. dělení" />
      {/* four haploid cells, all different */}
      {[
        [MOM, undefined, DAD],
        [MOM, DAD, DAD],
        [DAD, MOM, MOM],
        [DAD, undefined, MOM],
      ].map(([longCol, tip, shortCol], i) => (
        <Cell key={i} x={Q[i]} y={326} r={26} note="n = 2">
          <Rod x={Q[i] - 6} y={326} len={LONG} col={longCol as string} tip={tip as string | undefined} />
          <Rod x={Q[i] + 7} y={330} len={SHORT} col={shortCol as string} />
        </Cell>
      ))}
      <text x={cx} y={398} textAnchor="middle" className="bz3-lbl bz3-b">
        4 různé buňky
      </text>
    </Frame>
  );
}

export default function MitosisMeiosis() {
  return (
    <Figure level={9} label={LABEL} interactive max={720}>
      <div className="bz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={240}
          steps={[
            {
              title: "Mitóza",
              art: <Mitosis />,
              caption: "Jedno dělení: 2 geneticky stejné diploidní buňky (růst, obnova tkání).",
            },
            {
              title: "Meióza",
              art: <Meiosis />,
              caption: "Dvě dělení: 4 haploidní buňky, každá jiná díky crossing-overu (pohlavní buňky).",
            },
          ]}
        />
        <p className="bz3-strip-note">červeně chromozomy od matky, modře od otce</p>
      </div>
    </Figure>
  );
}
