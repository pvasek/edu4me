import { useState } from "react";
import { DrawArrow, Fade, Figure, Pop, Toggle, pat, useFig } from "./kit";

const LABEL =
  "Negativní zpětná vazba udržuje stálé vnitřní prostředí. Když se hodnota odchýlí od normy, receptor změnu zachytí, řídicí centrum vyšle signál a efektor vyvolá odpověď, která působí proti změně a vrátí hodnotu k normě. Teplota těla (norma asi 37 °C): při přehřátí zachytí změnu termoreceptory, hypotalamus spustí pocení a rozšíření cév v kůži, teplota klesne; při prochladnutí vyvolá svalový třes a zúžení cév, teplota stoupne. Glukóza v krvi (norma asi 3,9–5,6 mmol/l): po jídle uvolní β-buňky slinivky inzulin a játra se svaly glukózu ukládají jako glykogen; při hladu uvolní α-buňky glukagon a játra glykogen štěpí na glukózu.";

type Mode = "temp" | "glc";
type Box = [string, string?];
interface Loop {
  up: string;
  down: string;
  rec: Box;
  ctr: Box;
  eff: Box;
}
const DATA: Record<Mode, { norm: string; hi: Loop; lo: Loop }> = {
  temp: {
    norm: "37 °C",
    hi: {
      up: "teplota stoupá",
      down: "teplota klesá",
      rec: ["termoreceptory", "v kůži a mozku"],
      ctr: ["hypotalamus", "vyšle signál"],
      eff: ["pocení, rozšíření", "cév v kůži"],
    },
    lo: {
      up: "teplota stoupá",
      down: "teplota klesá",
      rec: ["termoreceptory", "v kůži a mozku"],
      ctr: ["hypotalamus", "vyšle signál"],
      eff: ["svalový třes,", "zúžení cév v kůži"],
    },
  },
  glc: {
    norm: "3,9–5,6 mmol/l",
    hi: {
      up: "glukóza stoupá",
      down: "glukóza klesá",
      rec: ["β-buňky", "slinivky"],
      ctr: ["slinivka", "uvolní inzulin"],
      eff: ["játra a svaly", "ukládají glykogen"],
    },
    lo: {
      up: "glukóza stoupá",
      down: "glukóza klesá",
      rec: ["α-buňky", "slinivky"],
      ctr: ["slinivka", "uvolní glukagon"],
      eff: ["játra štěpí", "glykogen"],
    },
  },
};

const W = 480;
const H = 450;
const BW = 128;
const BH = 64;
const XS = [84, 240, 396];
const ROLES = ["receptor", "řídicí centrum", "efektor"];

function Card({ x, y, role, box, hot }: { x: number; y: number; role: string; box: Box; hot: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={x - BW / 2} y={y} width={BW} height={BH} rx={8} className={`bz4-o ${hot ? "bz4-hot" : "bz4-cold"}`} />
      <rect x={x - BW / 2} y={y} width={BW} height={BH} rx={8} fill={pat(id, "d")} opacity={0.25} />
      <text x={x} y={y + 17} textAnchor="middle" className="bz4-hf-role">
        {role}
      </text>
      <text x={x} y={y + 37} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        {box[0]}
      </text>
      {box[1] && (
        <text x={x} y={y + 55} textAnchor="middle" className="bz4-lbl bz4-sm">
          {box[1]}
        </text>
      )}
    </g>
  );
}

function Half({ loop, top }: { loop: Loop; top: boolean }) {
  const y = top ? 52 : H - 52 - BH - 40;
  const cy = 226;
  const sgn = top ? -1 : 1;
  const yEdge = top ? y + BH : y; // box edge facing the centre
  return (
    <g>
      <text x={W / 2} y={top ? 32 : y + BH + 26} textAnchor="middle" className={`bz4-lbl bz4-b ${top ? "bz4-hf-hi" : "bz4-hf-lo"}`}>
        {top ? "hodnota příliš vysoká" : "hodnota příliš nízká"}
      </text>
      {XS.map((x, i) => (
        <Pop key={i} delay={0.15 + i * 0.25}>
          <Card x={x} y={y} role={ROLES[i]} box={[loop.rec, loop.ctr, loop.eff][i]} hot={top} />
        </Pop>
      ))}
      <DrawArrow d={`M${XS[0] + BW / 2 + 2} ${y + BH / 2} H${XS[1] - BW / 2 - 4}`} delay={0.4} />
      <DrawArrow d={`M${XS[1] + BW / 2 + 2} ${y + BH / 2} H${XS[2] - BW / 2 - 4}`} delay={0.65} />
      {/* stimulus: from the norm out to the receptor */}
      <DrawArrow
        d={`M150 ${cy + sgn * 12} C96 ${cy + sgn * 12} ${XS[0]} ${cy + sgn * 30} ${XS[0]} ${yEdge - sgn * 4}`}
        tone={top ? "red" : "blue"}
        delay={0.1}
      />
      {/* response: from the effector back to the norm */}
      <DrawArrow
        d={`M${XS[2]} ${yEdge - sgn * 2} C${XS[2]} ${cy + sgn * 30} 384 ${cy + sgn * 12} 332 ${cy + sgn * 12}`}
        tone="green"
        delay={0.9}
      />
      <Fade delay={0.3}>
        <text x={XS[0] + 12} y={cy + sgn * 46 + 5} className={`bz4-lbl bz4-sm bz4-b ${top ? "bz4-red-t" : "bz4-blue-t"}`}>
          {top ? loop.up : loop.down}
        </text>
      </Fade>
      <Fade delay={1.1}>
        <text x={XS[2] - 12} y={cy + sgn * 46 + 5} textAnchor="end" className="bz4-lbl bz4-sm bz4-b bz4-good-t">
          {top ? loop.down : loop.up}
        </text>
      </Fade>
    </g>
  );
}

export default function HomeostasisFeedback() {
  const [mode, setMode] = useState<Mode>("temp");
  const d = DATA[mode];
  return (
    <Figure
      level={11}
      label={LABEL}
      w={W}
      h={H}
      max={600}
      boost={false}
      controls={
        <Toggle
          label="Příklad zpětné vazby"
          value={mode}
          onChange={setMode}
          options={[
            { id: "temp", text: "Teplota těla" },
            { id: "glc", text: "Glukóza v krvi" },
          ]}
        />
      }
    >
      <g key={mode}>
        <Half loop={d.hi} top />
        <Half loop={d.lo} top={false} />
        <Pop>
          <ellipse cx={W / 2} cy={226} rx={90} ry={32} className="bz4-o bz4-lvlsoft-f" />
          <text x={W / 2} y={220} textAnchor="middle" className="bz4-lbl bz4-sm">
            normální hodnota
          </text>
          <text x={W / 2} y={242} textAnchor="middle" className="bz4-hf-norm">
            {d.norm}
          </text>
        </Pop>
      </g>
      <text x={W / 2} y={H - 8} textAnchor="middle" className="bz4-lbl bz4-sm">
        odpověď působí proti změně = negativní zpětná vazba
      </text>
    </Figure>
  );
}
