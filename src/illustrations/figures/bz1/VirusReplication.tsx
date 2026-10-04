import { motion } from "motion/react";
import { StepFilm } from "../../sequence/StepFigure";
import { Draw, Fade, Figure, Frame, Lbl, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Jak se množí virus, na příkladu bakteriofága, viru napadajícího bakterie, v pěti krocích. 1 přichycení: virus dosedne vlákny na povrch bakterie. 2 vstříknutí: virus vstříkne do buňky svou nukleovou kyselinu, prázdná kapsida zůstane venku. 3 kopírování: buňka podle cizího návodu vyrábí kopie virové nukleové kyseliny a bílkoviny kapsidy, vlastní DNA bakterie se rozpadá. 4 skládání: z dílů se složí desítky nových virů. 5 rozpad: buňka praskne a nové viry se uvolní a napadají další buňky.";

const W = 360;
const H = 250;
const CELL = "M80 112 H280 Q330 112 330 165 Q330 218 280 218 H80 Q30 218 30 165 Q30 112 80 112 Z";

/** A bacteriophage with its feet at (x, y). */
function Phage({ x, y, s = 1, empty = false, rot = 0 }: { x: number; y: number; s?: number; empty?: boolean; rot?: number }) {
  const { id } = useFig();
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    return `${f1(Math.cos(a) * 14)} ${f1(-48 + Math.sin(a) * 14)}`;
  }).join(" L");
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})`}>
      <path d="M-4 -8 L-14 -2 L-18 2 M4 -8 L14 -2 L18 2 M-2 -8 L-7 0 M2 -8 L7 0" className="bz1-o" style={{ strokeWidth: 1.3 }} />
      <rect x={-3.5} y={-34} width={7} height={24} className="bz1-o bz1-fill2" />
      <path d="M-3.5 -28 H3.5 M-3.5 -22 H3.5 M-3.5 -16 H3.5" className="bz1-o bz1-thin" />
      <rect x={-8} y={-11} width={16} height={4} rx={1} className="bz1-o bz1-fill3" />
      <path d={`M${hex}Z`} className={`bz1-o ${empty ? "bz1-fill" : "bz1-virus"}`} />
      {!empty && <path d={`M${hex}Z`} fill={pat(id, "d")} opacity={0.6} />}
      {!empty && <path d="M-6 -50 q3 -5 6 0 t6 0" className="bz1-rna" style={{ strokeWidth: 1.4 }} />}
    </g>
  );
}

function Cell({ broken = false, dna = "whole" }: { broken?: boolean; dna?: "whole" | "cut" | "none" }) {
  const { id } = useFig();
  return (
    <g>
      <path d={CELL} className="bz1-bact" />
      <path d={CELL} fill={pat(id, "dots")} opacity={0.5} />
      <path d={CELL} className="bz1-o" style={{ strokeWidth: 3.2, strokeDasharray: broken ? "26 14" : undefined }} />
      <path d={CELL} className="bz1-o bz1-thin" transform="translate(180 165) scale(0.965) translate(-180 -165)" style={{ strokeDasharray: broken ? "20 20" : undefined }} />
      {dna === "whole" && (
        <path d="M150 170 C150 150 175 146 190 152 C210 158 214 176 200 184 C186 192 160 194 154 182 C150 176 160 166 172 168" className="bz1-dna" />
      )}
      {dna === "cut" && (
        <path d="M150 170 C150 150 175 146 190 152 C210 158 214 176 200 184 C186 192 160 194 154 182" className="bz1-dna" style={{ strokeDasharray: "6 7", opacity: 0.6 }} />
      )}
    </g>
  );
}

const fall = {
  hidden: { y: -40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
} as const;

function S1() {
  return (
    <Frame w={W} h={H}>
      <Cell />
      <motion.g variants={fall}>
        <Phage x={180} y={110} />
      </motion.g>
      <Fade delay={0.6}>
        <Lbl x={232} y={46} tx={196} ty={62} className="bz1-b">
          {"virus\n(bakteriofág)"}
        </Lbl>
        <Lbl x={44} y={86} tx={70} ty={118}>
          bakterie
        </Lbl>
        <Lbl x={250} y={204} tx={208} ty={176} className="bz1-sm" sec>
          DNA bakterie
        </Lbl>
      </Fade>
    </Frame>
  );
}

function S2() {
  return (
    <Frame w={W} h={H}>
      <Cell />
      <Phage x={180} y={110} empty />
      <Draw d="M180 112 C178 128 196 132 192 146 C188 160 160 150 150 136 C142 126 120 128 118 142" className="bz1-rna" delay={0} />
      <Fade delay={0.8}>
        <Lbl x={44} y={86} tx={122} ty={140} className="bz1-b bz1-red-t">
          {"nukleová kyselina\nviru"}
        </Lbl>
        <Lbl x={232} y={46} tx={194} ty={62}>
          {"prázdná kapsida\nzůstane venku"}
        </Lbl>
      </Fade>
    </Frame>
  );
}

const SQUIGGLES: [number, number, number][] = [
  [70, 150, 10],
  [100, 190, -20],
  [240, 140, 15],
  [270, 190, -10],
  [130, 136, 30],
  [228, 196, 5],
];

function S3() {
  return (
    <Frame w={W} h={H}>
      <Cell dna="cut" />
      <Phage x={180} y={110} empty />
      {SQUIGGLES.map(([x, y, r], i) => (
        <Pop key={i} delay={0.1 + i * 0.1}>
          <path d={`M${x - 14} ${y} q4 -6 8 0 t8 0 t8 0`} transform={`rotate(${r} ${x} ${y})`} className="bz1-rna" />
        </Pop>
      ))}
      {(
        [
          [96, 132],
          [292, 160],
          [210, 136],
          [60, 186],
        ] as const
      ).map(([x, y], i) => (
        <Pop key={`h${i}`} delay={0.5 + i * 0.1}>
          <g transform={`translate(${x} ${y + 24}) scale(0.5)`}>
            <path
              d={`M${Array.from({ length: 6 }, (_, k) => {
                const a = (k * Math.PI) / 3 + Math.PI / 6;
                return `${f1(Math.cos(a) * 14)} ${f1(-48 + Math.sin(a) * 14)}`;
              }).join(" L")}Z`}
              className="bz1-o bz1-virus"
            />
          </g>
          <rect x={x + 22} y={y - 6} width={4} height={13} className="bz1-o bz1-thin bz1-fill2" />
        </Pop>
      ))}
      <Fade delay={0.9}>
        <text x={180} y={242} textAnchor="middle" className="bz1-lbl bz1-sm bz1-b bz1-red-t">
          buňka vyrábí díly viru
        </text>
      </Fade>
    </Frame>
  );
}

const NEW: [number, number, number][] = [
  [72, 160, -10],
  [104, 196, 8],
  [134, 156, -4],
  [160, 204, 12],
  [196, 160, 6],
  [226, 204, -8],
  [256, 158, 10],
  [290, 198, -6],
];

function S4() {
  return (
    <Frame w={W} h={H}>
      <Cell dna="none" />
      <Phage x={180} y={110} empty />
      {NEW.map(([x, y, r], i) => (
        <Pop key={i} delay={0.1 + i * 0.1}>
          <Phage x={x} y={y} s={0.55} rot={r} />
        </Pop>
      ))}
      <Fade delay={1}>
        <text x={180} y={242} textAnchor="middle" className="bz1-lbl bz1-sm bz1-b">
          nové viry se skládají
        </text>
      </Fade>
    </Frame>
  );
}

function S5() {
  return (
    <Frame w={W} h={H}>
      <g className="bz1-faint">
        <Cell broken dna="none" />
      </g>
      {NEW.map(([x, y, r], i) => {
        const dx = (x - 180) * 0.55;
        const dy = (y - 172) * 1.1 + (i % 2 ? 6 : -10);
        return (
          <motion.g
            key={i}
            variants={{
              hidden: { x: 0, y: 0 },
              show: { x: dx, y: dy, transition: { duration: 1, ease: "easeOut" } },
            }}
          >
            <Phage x={x} y={y} s={0.55} rot={r + dx * 0.3} />
          </motion.g>
        );
      })}
      <Fade delay={0.8}>
        <text x={180} y={36} textAnchor="middle" className="bz1-lbl bz1-b">
          buňka praskne
        </text>
        <text x={180} y={56} textAnchor="middle" className="bz1-lbl bz1-sm">
          nové viry napadají další buňky
        </text>
      </Fade>
    </Frame>
  );
}

export default function VirusReplication() {
  return (
    <Figure level={2} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          { title: "Přichycení", caption: "Virus dosedne na bakterii a přichytí se na místa na jejím povrchu, která mu pasují.", art: <S1 /> },
          { title: "Vstříknutí", caption: "Do buňky vstříkne jen svou nukleovou kyselinu, návod na nové viry.", art: <S2 /> },
          { title: "Kopírování", caption: "Buňka poslechne cizí návod: kopíruje ho a vyrábí díly kapsidy.", art: <S3 /> },
          { title: "Skládání", caption: "Z dílů se uvnitř buňky složí desítky nových virů.", art: <S4 /> },
          { title: "Rozpad buňky", caption: "Buňka praskne, viry se uvolní a napadají další buňky.", art: <S5 /> },
        ]}
      />
    </Figure>
  );
}
