import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, Person, Pop, pat, useFig } from "./kit";

const LABEL =
  "Formy vlády a státní uspořádání ve čtyřech schématech. Monarchie: v čele státu je panovník, který trůn dědí, například Spojené království. Republika: hlavu státu, prezidenta, volí lidé nebo parlament na omezenou dobu, například Česko. Unitární stát: jedna vláda a jeden parlament pro celé území, kraje zákony nevydávají, například Česko. Federace: spolkové státy či země mají vlastní parlamenty a zákony a spojuje je společná federální vláda, například Německo a USA.";

const W = 200;
const H = 170;

function Crown({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-16 6 L-18 -12 L-8 -2 L0 -16 L8 -2 L18 -12 L16 6 Z" className="gz4-sf-gold gz4-o" />
      <path d="M-16 6 H16 V11 H-16 Z" className="gz4-sf-gold gz4-o gz4-thin" />
      {[-18, 0, 18].map((cx) => (
        <circle key={cx} cx={cx} cy={cx === 0 ? -17 : -13} r={2.4} className="gz4-sf-gem" />
      ))}
    </g>
  );
}

/** A generic (not real) country outline, split into regions. */
const LAND =
  "M30 52 C48 34 92 30 120 38 C150 46 176 44 182 70 C190 98 172 128 140 138 C110 148 70 146 46 128 C22 110 16 72 30 52 Z";
const REG = "M100 36 L96 92 L44 126 M96 92 L176 104 M96 92 L150 46";

function Monarchy() {
  return (
    <Frame w={W} h={H}>
      <Pop delay={0.1}>
        <Crown x={100} y={34} s={1.3} />
      </Pop>
      {/* throne + monarch */}
      <path d="M80 112 V64 H120 V112" className="gz4-sf-throne gz4-o" />
      <Person x={100} y={108} s={1.9} />
      <path d="M70 112 H130" className="gz4-o" />
      {/* inheritance */}
      <DrawArrow d="M132 92 Q156 96 160 120" tone="lvl" delay={0.4} />
      <Person x={164} y={150} s={1.3} />
      <text x={100} y={162} textAnchor="end" className="gz4-lbl gz4-b gz4-lvl-t">
        trůn se dědí
      </text>
    </Frame>
  );
}

function Republic() {
  return (
    <Frame w={W} h={H}>
      {/* voters */}
      {[20, 38, 56].map((x, i) => (
        <Person key={x} x={x} y={150 - (i % 2) * 4} s={1.2} />
      ))}
      {/* ballot box */}
      <path d="M70 150 V120 H110 V150 Z" className="gz4-fill gz4-o" />
      <path d="M82 120 h16" className="gz4-o" style={{ strokeWidth: 3 }} />
      <path d="M86 116 V102 H96 V116" className="gz4-fill gz4-o gz4-thin" />
      <path d="M89 106 l2 3 l4 -5" className="gz4-o gz4-thin" />
      <DrawArrow d="M112 126 Q140 120 146 84" tone="lvl" delay={0.3} />
      {/* president with sash */}
      <Person x={152} y={76} s={2} />
      <path d="M147 52 L157 62" className="gz4-sf-sash" />
      <text x={150} y={20} textAnchor="middle" className="gz4-lbl gz4-b">
        prezident
      </text>
      <text x={174} y={100} textAnchor="middle" className="gz4-lbl gz4-lvl-t gz4-b">
        na 5 let
      </text>
      <text x={60} y={96} textAnchor="middle" className="gz4-lbl">
        volby
      </text>
    </Frame>
  );
}

function Unitary() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <path d={LAND} className="gz4-lvl-fill" />
      <path d={LAND} fill={pat(id, "d")} opacity={0.5} />
      <path d={REG} className="gz4-o gz4-thin gz4-dash" />
      <path d={LAND} className="gz4-o" />
      {/* one centre that governs all regions */}
      {[
        [56, 64],
        [140, 72],
        [130, 122],
        [62, 112],
      ].map(([x, y], i) => (
        <DrawArrow key={i} d={`M100 92 L${x} ${y}`} tone="ink" delay={0.2 + i * 0.1} />
      ))}
      <Star x={100} y={92} r={10} />
      <text x={100} y={162} textAnchor="middle" className="gz4-lbl gz4-b">
        jedna vláda
      </text>
    </Frame>
  );
}

function Federal() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <path d={LAND} className="gz4-sf-fed" />
      <path d={LAND} fill={pat(id, "b")} opacity={0.5} />
      <path d={REG} className="gz4-o" />
      <path d={LAND} className="gz4-o" style={{ strokeWidth: 2 }} />
      {/* each member state has its own parliament */}
      {[
        [60, 70],
        [140, 72],
        [136, 120],
        [70, 116],
      ].map(([x, y], i) => (
        <Pop key={i} delay={0.15 + i * 0.1}>
          <Dome x={x} y={y} />
        </Pop>
      ))}
      <Star x={100} y={96} r={10} />
      <text x={100} y={162} textAnchor="middle" className="gz4-lbl gz4-b">
        vlastní zákony
      </text>
    </Frame>
  );
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`;
  });
  return <path d={`M${pts.join(" L")} Z`} className="gz4-sf-gold gz4-o gz4-thin" />;
}

/** Small parliament building: dome and columns. */
function Dome({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-11 8 H11 M-10 8 V0 M-5 8 V0 M0 8 V0 M5 8 V0 M10 8 V0 M-12 0 H12" className="gz4-o gz4-thin" />
      <path d="M-7 -1 A7 7 0 0 1 7 -1 Z" className="gz4-fill gz4-o gz4-thin" />
      <path d="M0 -8 V-12" className="gz4-o gz4-thin" />
    </g>
  );
}

export default function StateForms() {
  return (
    <Figure level={5} label={LABEL} max={900} interactive>
      <div className="gz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={240}
          phoneColumns={2}
          steps={[
            { title: "Monarchie", art: <Monarchy />, caption: "Panovník trůn dědí. Spojené království, Španělsko." },
            { title: "Republika", art: <Republic />, caption: "Prezidenta volí lidé nebo parlament. Česko." },
            { title: "Unitární stát", art: <Unitary />, caption: "Kraje jen spravují, zákony vydává stát. Česko." },
            { title: "Federace", art: <Federal />, caption: "Spolkové země a státy mají vlastní parlamenty. Německo, USA." },
          ]}
        />
        <p className="gz4-strip-note">
          1–2: forma vlády (kdo je v čele státu) · 3–4: státní uspořádání (jak se dělí moc mezi centrum a části státu)
        </p>
      </div>
    </Figure>
  );
}
