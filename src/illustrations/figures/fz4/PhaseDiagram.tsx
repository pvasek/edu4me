import { Axes, Draw, Fade, Figure, Pop } from "./kit";

const LABEL =
  "Fázový diagram vody (osy nejsou v měřítku). Vodorovně teplota t ve stupních Celsia, svisle tlak p. Tři křivky dělí rovinu na oblasti ledu, kapalné vody a páry: sublimační křivka, křivka syté páry a křivka tání, která se kvůli anomálii vody mírně naklání doleva. Křivky se potkávají v trojném bodě při 0,01 °C a 611 Pa, kde jsou v rovnováze všechna tři skupenství. Křivka syté páry končí v kritickém bodě při 374 °C a 22,1 MPa, nad ním je nadkritická tekutina. Při normálním tlaku 101,3 kPa led taje při 0 °C a voda vře při 100 °C.";

const O = [84, 300] as const;
const TP = [160, 236] as const; // triple point
const CP = [384, 72] as const; // critical point
const P1 = 170; // 101,3 kPa
const MELT = [148, 30] as const; // top of the melting curve
const meltX = (y: number) =>
  TP[0] + ((MELT[0] - TP[0]) * (TP[1] - y)) / (TP[1] - MELT[1]);
const BOIL = [278, P1] as const;

const VAP = `M${TP[0]} ${TP[1]} C${TP[0] + 50} ${TP[1] - 14} ${BOIL[0] - 30} ${BOIL[1] + 26} ${BOIL[0]} ${BOIL[1]} C${BOIL[0] + 32} ${BOIL[1] - 28} ${CP[0] - 34} ${CP[1] + 38} ${CP[0]} ${CP[1]}`;
const SUB = `M${O[0] + 6} ${O[1] - 4} C${O[0] + 32} ${O[1] - 14} ${TP[0] - 24} ${TP[1] + 20} ${TP[0]} ${TP[1]}`;
const MLT = `M${TP[0]} ${TP[1]} L${MELT[0]} ${MELT[1]}`;

export default function PhaseDiagram() {
  const mx = meltX(P1);
  return (
    <Figure level={10} w={440} h={344} max={600} label={LABEL}>
      <Axes x={O[0]} y={O[1]} w={344} h={282} xl="" yl="p" />
      <Fade delay={0.4}>
        <text x={436} y={O[1] + 40} textAnchor="end" className="fz4-sym-t">
          t <tspan className="fz4-up">(°C)</tspan>
        </text>
      </Fade>
      {/* regions */}
      <Fade delay={0.9}>
        <text
          x={122}
          y={100}
          textAnchor="middle"
          className="fz4-lbl fz4-big fz4-b fz4-blue-t"
        >
          led
        </text>
        <text
          x={122}
          y={118}
          textAnchor="middle"
          className="fz4-lbl fz4-sm fz4-sec"
        >
          pevná látka
        </text>
        <text
          x={226}
          y={104}
          textAnchor="middle"
          className="fz4-lbl fz4-big fz4-b fz4-lvl-t"
        >
          voda
        </text>
        <text
          x={226}
          y={122}
          textAnchor="middle"
          className="fz4-lbl fz4-sm fz4-sec"
        >
          kapalina
        </text>
        <text
          x={352}
          y={252}
          textAnchor="middle"
          className="fz4-lbl fz4-big fz4-b fz4-muted-t"
        >
          pára
        </text>
        <text
          x={352}
          y={270}
          textAnchor="middle"
          className="fz4-lbl fz4-sm fz4-sec"
        >
          plyn
        </text>
        <text
          x={436}
          y={26}
          textAnchor="end"
          className="fz4-lbl fz4-sm fz4-sec"
        >
          nadkritická tekutina
        </text>
      </Fade>
      {/* normal pressure */}
      <Fade delay={0.6}>
        <path
          d={`M${O[0]} ${P1} H${O[0] + 336}`}
          className="fz4-o fz4-thin fz4-dash"
        />
        <path
          d={`M${TP[0]} ${TP[1]} H${O[0]} M${TP[0]} ${TP[1]} V${O[1]} M${CP[0]} ${CP[1]} H${O[0]} M${CP[0]} ${CP[1]} V${O[1]} M${BOIL[0]} ${P1} V${O[1]}`}
          className="fz4-o fz4-thin fz4-dot2"
        />
        <path
          d={`M${CP[0]} ${CP[1]} H${O[0] + 340} M${CP[0]} ${CP[1]} V24`}
          className="fz4-o fz4-thin fz4-dash fz4-sec"
        />
        <text x={O[0] - 6} y={TP[1] + 4} textAnchor="end" className="fz4-num">
          611 Pa
        </text>
        <text x={O[0] - 6} y={P1 + 4} textAnchor="end" className="fz4-num">
          101,3 kPa
        </text>
        <text x={O[0] - 6} y={CP[1] + 4} textAnchor="end" className="fz4-num">
          22,1 MPa
        </text>
        <text
          x={TP[0] - 2}
          y={O[1] + 18}
          textAnchor="middle"
          className="fz4-num"
        >
          0
        </text>
        <text x={BOIL[0]} y={O[1] + 18} textAnchor="middle" className="fz4-num">
          100
        </text>
        <text x={CP[0]} y={O[1] + 18} textAnchor="middle" className="fz4-num">
          374
        </text>
      </Fade>
      <Draw d={SUB} className="fz4-curve fz4-curve-lvl" delay={0.1} />
      <Draw d={VAP} className="fz4-curve fz4-curve-lvl" delay={0.3} />
      <Draw d={MLT} className="fz4-curve fz4-curve-lvl" delay={0.5} />
      <Pop delay={1.2}>
        <circle cx={TP[0]} cy={TP[1]} r={5} className="fz4-pt" />
        <circle cx={CP[0]} cy={CP[1]} r={5} className="fz4-pt" />
        <circle cx={mx} cy={P1} r={4} className="fz4-pt2" />
        <circle cx={BOIL[0]} cy={P1} r={4} className="fz4-pt2" />
      </Pop>
      <Fade delay={1.4}>
        <text x={TP[0] + 12} y={TP[1] + 22} className="fz4-lbl fz4-b">
          trojný bod
        </text>
        <text x={TP[0] + 12} y={TP[1] + 40} className="fz4-eq fz4-eq-sm">
          0,01 °C; 611 Pa
        </text>
        <text x={432} y={CP[1] + 56} textAnchor="end" className="fz4-lbl fz4-b">
          kritický bod
        </text>
        <text
          x={432}
          y={CP[1] + 74}
          textAnchor="end"
          className="fz4-eq fz4-eq-sm"
        >
          374 °C; 22,1 MPa
        </text>
        <text
          x={mx - 8}
          y={P1 - 8}
          textAnchor="end"
          className="fz4-lbl fz4-sm fz4-b"
        >
          tání 0 °C
        </text>
        <text x={BOIL[0] + 8} y={P1 + 20} className="fz4-lbl fz4-sm fz4-b">
          var 100 °C
        </text>
        <text
          x={MELT[0] + 8}
          y={MELT[1] + 18}
          className="fz4-lbl fz4-sm fz4-sec"
        >
          křivka tání se naklání doleva
        </text>
      </Fade>
    </Figure>
  );
}
