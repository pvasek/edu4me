import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, f1, pat, useFig } from "./kit";

const LABEL =
  "Jihoasijský monzun v řezu od Indického oceánu na jihu k Indii a Himálaji na severu. V létě (červen–září) se pevnina ohřeje víc než oceán, nad Indií vznikne tlaková níže a nad oceánem je vyšší tlak. Vlhký vítr od moře proudí na pevninu od jihozápadu, stoupá, ochlazuje se a u Himálaje přináší vydatné deště – období dešťů. V zimě (listopad–únor) pevnina vychladne víc než oceán, nad Asií je tlaková výše a nad oceánem nižší tlak. Suchý vítr vane od severovýchodu z pevniny na moře a v Indii je období sucha.";

const W = 440;
const H = 240;
const SEA = 196;
const LAND = `M196 ${SEA} C230 196 260 192 290 186 C312 180 324 170 336 150 L352 118 L366 94 L378 72 L390 88 L402 66 L416 92 L430 110 V${H - 12} H196 Z`;

function Base({ hot }: { hot: boolean }) {
  const land = hot ? "Indie: horká pevnina" : "Indie: chladná pevnina";
  const { id } = useFig();
  return (
    <g>
      <rect x={10} y={10} width={W - 20} height={SEA - 10} className="gz3-sky" />
      <rect x={10} y={SEA} width={200} height={H - 12 - SEA} className="gz3-sea" />
      <rect x={10} y={SEA} width={200} height={H - 12 - SEA} fill={pat(id, "h")} opacity={0.6} />
      <path d={LAND} className={`gz3-o ${hot ? "gz3-sand" : "gz3-land"}`} />
      <path d="M366 94 L378 72 L390 88 L402 66 L416 92 L406 88 L398 80 L388 96 L376 84 Z" className="gz3-snow" />
      <path d={`M10 ${SEA} H196`} className="gz3-o" />
      <text x={20} y={H - 20} className="gz3-lbl gz3-sm gz3-blue-t">
        Indický oceán
      </text>
      <text x={222} y={H - 20} className={`gz3-lbl gz3-sm gz3-b ${hot ? "gz3-red-t" : "gz3-blue-t"}`}>
        {land}
      </text>
      <text x={372} y={58} textAnchor="middle" className="gz3-lbl gz3-sm gz3-sec">
        Himálaj
      </text>
      <text x={20} y={30} className="gz3-lbl gz3-sm gz3-muted-t">
        J
      </text>
      <text x={W - 20} y={30} textAnchor="end" className="gz3-lbl gz3-sm gz3-muted-t">
        S
      </text>
    </g>
  );
}

function Letter({ x, y, hi }: { x: number; y: number; hi: boolean }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={`gz3-pres-s gz3-halo ${hi ? "gz3-pres-h" : "gz3-pres-n"}`}>
      {hi ? "H" : "N"}
    </text>
  );
}

function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={11} className="gz3-o gz3-sun" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <path
            key={i}
            d={`M${f1(Math.cos(a) * 15)} ${f1(Math.sin(a) * 15)} L${f1(Math.cos(a) * 20)} ${f1(Math.sin(a) * 20)}`}
            className="gz3-o gz3-thin"
          />
        );
      })}
    </g>
  );
}

function Summer() {
  return (
    <Frame w={W} h={H}>
      <Base hot />
      <Sun x={250} y={40} />
      <path
        d="M246 120 C232 120 230 104 244 100 C242 82 266 76 276 88 C282 70 312 70 316 88 C332 80 352 92 344 106 C358 108 356 124 340 124 Z"
        className="gz3-o gz3-cloud-d"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${254 + i * 10} ${130 + (i % 2) * 4} l-4 ${26 + (i % 3) * 6}`} className="gz3-rain-s" />
      ))}
      <Arrow d="M40 178 C110 176 190 172 236 162" tone="blue" className="gz3-wind" />
      <Arrow d="M300 160 C318 150 324 140 326 120" tone="blue" className="gz3-wind" />
      <Arrow d="M330 40 C260 26 160 26 90 44" tone="muted" className="gz3-dash" />
      <Letter x={110} y={150} hi />
      <Letter x={262} y={178} hi={false} />
      <text x={36} y={166} className="gz3-lbl gz3-sm gz3-b gz3-blue-t">
        vlhký vítr od moře
      </text>
      <text x={110} y={122} textAnchor="middle" className="gz3-lbl gz3-sm">
        chladnější moře
      </text>
      <text x={244} y={146} textAnchor="end" className="gz3-lbl gz3-sm gz3-b gz3-blue-t gz3-halo">
        vydatné deště
      </text>
    </Frame>
  );
}

function Winter() {
  return (
    <Frame w={W} h={H}>
      <Base hot={false} />
      <Sun x={110} y={60} />
      <Arrow d="M330 174 C280 184 200 184 50 180" tone="acc" className="gz3-wind" />
      <Arrow d="M300 60 C304 90 304 120 300 150" tone="acc" className="gz3-wind" />
      <Arrow d="M80 50 C150 32 240 32 290 46" tone="muted" className="gz3-dash" />
      <Letter x={110} y={150} hi={false} />
      <Letter x={262} y={160} hi />
      <text x={40} y={170} className="gz3-lbl gz3-sm gz3-b gz3-acc-t">
        suchý vítr z pevniny
      </text>
      <text x={110} y={122} textAnchor="middle" className="gz3-lbl gz3-sm">
        teplejší moře
      </text>
      <text x={110} y={96} textAnchor="middle" className="gz3-lbl gz3-sm gz3-b">
        jasno, sucho
      </text>
    </Frame>
  );
}

export default function Monsoon() {
  return (
    <Figure label={LABEL} max={900} interactive>
      <div className="gz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={300}
          steps={[
            {
              title: "Letní monzun (červen–září)",
              art: <Summer />,
              caption:
                "Pevnina se ohřeje víc než oceán a nad Indií vznikne tlaková níže. Vlhký vzduch od moře proudí na pevninu, stoupá a vydatně prší: období dešťů.",
            },
            {
              title: "Zimní monzun (listopad–únor)",
              art: <Winter />,
              caption:
                "Pevnina vychladne víc než oceán a nad Asií je tlaková výše. Suchý vítr vane z pevniny na moře: období sucha.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
