import { Draw, DrawArrow, Fade, Figure, Pop, f1 } from "./kit";

const LABEL =
  "Disociační křivka hemoglobinu: nasycení hemoglobinu kyslíkem v procentech podle parciálního tlaku kyslíku v kilopascalech. Křivka má tvar písmene S. V plicích (asi 13 kPa) je hemoglobin nasycen z 97 %, v tkáních v klidu (asi 5 kPa) jen asi ze 72 %, takže cestou odevzdá asi čtvrtinu kyslíku. Bohrův posun: kde je víc oxidu uhličitého, nižší pH a vyšší teplota – v pracujícím svalu – se křivka posune doprava; hemoglobin pak při stejném tlaku drží méně kyslíku (asi 57 %) a tkáním ho odevzdá víc.";

const W = 480;
const H = 380;
const OX = 66;
const OY = 314;
const GW = 384;
const GH = 262;
const PMAX = 14;
const X = (p: number) => OX + (p / PMAX) * GW;
const Y = (s: number) => OY - (s / 100) * GH;
const hill = (p: number, p50: number, n = 2.7) =>
  (100 * Math.pow(p, n)) / (Math.pow(p, n) + Math.pow(p50, n));
const curve = (p50: number) => {
  const pts: string[] = [];
  for (let p = 0; p <= PMAX + 0.001; p += 0.1) pts.push(`${f1(X(p))} ${f1(Y(hill(p, p50)))}`);
  return "M" + pts.join(" L");
};
const P50 = 3.5;
const P50B = 4.5;
const LUNG = 13;
const TISS = 5;

const cz = (n: number) => String(n).replace(".", ",");

export default function OxygenDissociation() {
  const sL = hill(LUNG, P50);
  const sT = hill(TISS, P50);
  const sTB = hill(TISS, P50B);
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={620} replay>
      {/* grid */}
      <g className="bz4-grid">
        {[25, 50, 75, 100].map((s) => (
          <line key={s} x1={OX} x2={OX + GW} y1={Y(s)} y2={Y(s)} />
        ))}
        {[2, 4, 6, 8, 10, 12, 14].map((p) => (
          <line key={p} x1={X(p)} x2={X(p)} y1={OY} y2={OY - GH} />
        ))}
      </g>
      {/* lungs and tissues */}
      <rect x={X(11.5)} y={OY - GH} width={X(14) - X(11.5)} height={GH} className="bz4-ox-lung" />
      <rect x={X(2.5)} y={OY - GH} width={X(6) - X(2.5)} height={GH} className="bz4-ox-tiss" />
      <text x={X(12.75)} y={OY - GH - 8} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        plíce
      </text>
      <text x={X(4.25)} y={OY - GH - 8} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        tkáně
      </text>
      {/* axes */}
      <DrawArrow d={`M${OX} ${OY} H${OX + GW + 14}`} className="bz4-axis" />
      <DrawArrow d={`M${OX} ${OY} V${OY - GH - 18}`} className="bz4-axis" />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((p) => (
        <g key={p}>
          <line x1={X(p)} x2={X(p)} y1={OY} y2={OY + 5} className="bz4-o bz4-thin" />
          <text x={X(p)} y={OY + 20} textAnchor="middle" className="bz4-num">
            {p}
          </text>
        </g>
      ))}
      {[0, 25, 50, 75, 100].map((s) => (
        <g key={s}>
          <line x1={OX - 5} x2={OX} y1={Y(s)} y2={Y(s)} className="bz4-o bz4-thin" />
          <text x={OX - 9} y={Y(s) + 4.5} textAnchor="end" className="bz4-num">
            {s}
          </text>
        </g>
      ))}
      <text x={OX + GW} y={OY + 44} textAnchor="end" className="bz4-lbl bz4-sm">
        parciální tlak O<tspan className="bz4-sub" dy={4}>2</tspan>
        <tspan dy={-4}> (kPa)</tspan>
      </text>
      <text
        x={18}
        y={OY - GH / 2}
        textAnchor="middle"
        transform={`rotate(-90 18 ${OY - GH / 2})`}
        className="bz4-lbl bz4-sm"
      >
        nasycení hemoglobinu O<tspan className="bz4-sub" dy={4}>2</tspan>
        <tspan dy={-4}> (%)</tspan>
      </text>

      {/* curves */}
      <Draw d={curve(P50B)} className="bz4-curve bz4-ox-bohr" delay={0.9} />
      <Draw d={curve(P50)} className="bz4-curve bz4-curve-lvl" delay={0.2} />

      {/* readings */}
      <Fade delay={1.3}>
        <line x1={X(TISS)} x2={X(TISS)} y1={OY} y2={Y(sT)} className="bz4-lead bz4-dash" />
        <line x1={X(LUNG)} x2={X(LUNG)} y1={OY} y2={Y(sL)} className="bz4-lead bz4-dash" />
        <line x1={X(TISS)} x2={X(LUNG)} y1={Y(sL)} y2={Y(sL)} className="bz4-lead bz4-dash" />
        <text x={X(TISS) + 4} y={OY - 8} className="bz4-num bz4-ox-small">
          {cz(TISS)}
        </text>
        <text x={X(LUNG) - 4} y={OY - 8} textAnchor="end" className="bz4-num bz4-ox-small">
          {cz(LUNG)}
        </text>
        {/* released in tissues */}
        <path d={`M${X(TISS) + 14} ${Y(sL)} V${Y(sT)}`} className="bz4-ox-bracket" />
        <line x1={X(TISS) + 16} y1={(Y(sL) + Y(sT)) / 2} x2={X(7.2)} y2={Y(66)} className="bz4-lead" />
        <text x={X(7.3)} y={Y(66) + 12} className="bz4-lbl bz4-sm bz4-b bz4-lvl-t">
          tkáním odevzdá ≈ ¼ O<tspan className="bz4-sub" dy={4}>2</tspan>
        </text>
      </Fade>
      <Pop delay={1.4}>
        <circle cx={X(LUNG)} cy={Y(sL)} r={5} className="bz4-pt" />
        <circle cx={X(TISS)} cy={Y(sT)} r={5} className="bz4-pt" />
        <circle cx={X(TISS)} cy={Y(sTB)} r={5} className="bz4-ox-pt2" />
      </Pop>
      <Fade delay={1.5}>
        <text x={X(LUNG) - 6} y={Y(84)} textAnchor="end" className="bz4-num">
          {Math.round(sL)} %
        </text>
        <text x={X(TISS) - 8} y={Y(sT) - 6} textAnchor="end" className="bz4-num">
          {Math.round(sT)} %
        </text>
        <text x={X(TISS) + 9} y={Y(sTB) + 18} className="bz4-num bz4-ox-bohr-t">
          {Math.round(sTB)} %
        </text>
        <text x={X(8.2)} y={Y(38)} className="bz4-lbl bz4-b bz4-ox-bohr-t">
          Bohrův posun
        </text>
        <text x={X(8.2)} y={Y(38) + 18} className="bz4-lbl bz4-sm">
          více CO<tspan className="bz4-sub" dy={4}>2</tspan>
          <tspan dy={-4}>, nižší pH,</tspan>
        </text>
        <text x={X(8.2)} y={Y(38) + 36} className="bz4-lbl bz4-sm">
          vyšší teplota
        </text>
        <DrawArrow d={`M${X(3.1)} ${Y(42)} H${X(4.3)}`} tone="acc" delay={1.6} />
      </Fade>
    </Figure>
  );
}
