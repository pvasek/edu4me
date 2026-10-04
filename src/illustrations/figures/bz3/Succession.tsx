import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Sukcese na opuštěném poli v pěti obrazech. Na holou zoranou půdu nejdřív přijdou jednoleté plevele, během několika let pole zaroste trávami a vytrvalými bylinami. Po pěti až patnácti letech se objeví keře jako šípek, hloh a trnka. Pak vyrostou pionýrské dřeviny – bříza, osika a vrba – a po padesáti až sto padesáti letech na místě stojí smíšený les s dubem, bukem a habrem, který se už dál výrazně nemění.";

const W = 200;
const H = 140;
const G = 116; // ground

function Ground({ bare = false }: { bare?: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={4} y={G} width={W - 8} height={H - 4 - G} className="bz3-soil-b" />
      <rect x={4} y={G} width={W - 8} height={H - 4 - G} fill={pat(id, "dots")} />
      {bare && <path d={Array.from({ length: 9 }, (_, i) => `M${12 + i * 21} ${G + 3} q8 -5 16 0`).join(" ")} className="bz3-o bz3-thin" />}
      <path d={`M4 ${G} H${W - 4}`} className="bz3-o" />
    </g>
  );
}

function Grass({ x, h = 12 }: { x: number; h?: number }) {
  return <path d={`M${x - 4} ${G} q1 ${-h * 0.6} -3 ${-h} M${x} ${G} q0 ${-h * 0.7} 1 ${-h * 1.15} M${x + 4} ${G} q0 ${-h * 0.6} 4 ${-h * 0.95}`} className="bz3-grass" />;
}

function Herb({ x, h = 18, c = "#f2cf3a" }: { x: number; h?: number; c?: string }) {
  return (
    <g>
      <path d={`M${x} ${G} V${G - h} M${x} ${G - h * 0.5} l-4 -4 M${x} ${G - h * 0.35} l4 -4`} className="bz3-grass" />
      <circle cx={x} cy={G - h - 2} r={2.6} fill={c} className="bz3-o bz3-thin" />
    </g>
  );
}

function Shrub({ x, s = 1, berries = true }: { x: number; s?: number; berries?: boolean }) {
  const { id } = useFig();
  const d = `M${x - 18 * s} ${G} C${x - 26 * s} ${G - 14 * s} ${x - 16 * s} ${G - 30 * s} ${x - 4 * s} ${G - 26 * s} C${x} ${G - 36 * s} ${x + 18 * s} ${G - 32 * s} ${x + 18 * s} ${G - 20 * s} C${x + 28 * s} ${G - 14 * s} ${x + 22 * s} ${G} ${x + 18 * s} ${G}Z`;
  return (
    <g>
      <path d={d} className="bz3-shrub" />
      <path d={d} fill={pat(id, "d")} opacity={0.5} />
      {berries &&
        [
          [-8, -16],
          [6, -22],
          [12, -10],
          [-2, -8],
        ].map(([dx, dy], i) => <circle key={i} cx={x + dx * s} cy={G + dy * s} r={1.8} className="bz3-berry" />)}
    </g>
  );
}

function Birch({ x, h = 54 }: { x: number; h?: number }) {
  const { id } = useFig();
  const crown = `M${x} ${G - h - 22} C${x - 16} ${G - h - 18} ${x - 18} ${G - h + 14} ${x - 4} ${G - h + 22} H${x + 4} C${x + 18} ${G - h + 14} ${x + 16} ${G - h - 18} ${x} ${G - h - 22}Z`;
  return (
    <g>
      <path d={`M${x} ${G} V${G - h}`} className="bz3-birch-o" />
      <path d={`M${x} ${G} V${G - h}`} className="bz3-birch" />
      <path d={`M${x - 2} ${G - 10} h3 M${x} ${G - 22} h3 M${x - 2} ${G - 34} h3 M${x} ${G - 46} h2`} className="bz3-birch-mark" />
      <path d={crown} className="bz3-crown-light" />
      <path d={crown} fill={pat(id, "dots")} />
    </g>
  );
}

function Oak({ x, s = 1 }: { x: number; s?: number }) {
  const { id } = useFig();
  const top = G - 92 * s;
  const crown = `M${x - 30 * s} ${G - 46 * s} C${x - 44 * s} ${G - 56 * s} ${x - 38 * s} ${top + 6} ${x - 18 * s} ${top + 8} C${x - 12 * s} ${top - 6} ${x + 14 * s} ${top - 6} ${x + 18 * s} ${top + 8} C${x + 40 * s} ${top + 6} ${x + 44 * s} ${G - 56 * s} ${x + 30 * s} ${G - 46 * s}Z`;
  return (
    <g>
      <path d={`M${x - 5 * s} ${G} C${x - 4 * s} ${G - 24 * s} ${x - 3 * s} ${G - 40 * s} ${x - 12 * s} ${G - 52 * s} M${x + 5 * s} ${G} C${x + 4 * s} ${G - 24 * s} ${x + 3 * s} ${G - 40 * s} ${x + 12 * s} ${G - 52 * s}`} className="bz3-o" />
      <path d={`M${x - 5 * s} ${G} C${x - 4 * s} ${G - 24 * s} ${x - 3 * s} ${G - 40 * s} ${x} ${G - 50 * s} C${x + 3 * s} ${G - 40 * s} ${x + 4 * s} ${G - 24 * s} ${x + 5 * s} ${G}Z`} className="bz3-oak-trunk" />
      <path d={crown} className="bz3-crown" />
      <path d={crown} fill={pat(id, "d")} opacity={0.55} />
    </g>
  );
}

function Weeds() {
  const r = rng(4);
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${f1(20 + i * 30 + r() * 10)} ${G} l-3 -9 M${f1(20 + i * 30 + r() * 10)} ${G} l4 -10`} className="bz3-grass" />
      ))}
    </g>
  );
}

const Tag = ({ t }: { t: string }) => (
  <text x={W - 10} y={20} textAnchor="end" className="bz3-lbl bz3-sm bz3-b bz3-lvl-t bz3-halo">
    {t}
  </text>
);

export default function Succession() {
  const frame = (tag: string, body: React.ReactNode, bare = false) => (
    <Frame w={W} h={H}>
      <Ground bare={bare} />
      {body}
      <Tag t={tag} />
    </Frame>
  );
  return (
    <Figure level={8} label={LABEL} interactive max={900}>
      <div className="bz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={170}
          phoneColumns={2}
          steps={[
            {
              title: "Opuštěné pole",
              art: frame("0–2 roky", <Weeds />, true),
              caption: "Na holou půdu přijdou jednoleté plevele.",
            },
            {
              title: "Byliny a trávy",
              art: frame(
                "2–5 let",
                <>
                  {[16, 46, 76, 106, 136, 166, 186].map((x) => (
                    <Grass key={x} x={x} h={14} />
                  ))}
                  <Herb x={30} c="#f2cf3a" />
                  <Herb x={90} h={22} c="#fffaf0" />
                  <Herb x={150} h={16} c="#8a63c9" />
                </>,
              ),
              caption: "Pole zaroste trávami a vytrvalými bylinami.",
            },
            {
              title: "Keře",
              art: frame(
                "5–15 let",
                <>
                  {[16, 70, 130, 186].map((x) => (
                    <Grass key={x} x={x} h={12} />
                  ))}
                  <Shrub x={50} />
                  <Shrub x={140} s={1.2} />
                </>,
              ),
              caption: "Rostou keře: šípek, hloh, trnka.",
            },
            {
              title: "Pionýrské dřeviny",
              art: frame(
                "15–40 let",
                <>
                  <Shrub x={30} s={0.9} berries={false} />
                  <Birch x={80} h={56} />
                  <Birch x={124} h={64} />
                  <Birch x={166} h={48} />
                  <Grass x={100} h={10} />
                </>,
              ),
              caption: "Rychle rostou bříza, osika a vrba.",
            },
            {
              title: "Les",
              art: frame(
                "50–150 let",
                <>
                  <Oak x={58} s={0.85} />
                  <Oak x={140} s={0.92} />
                  <Shrub x={100} s={0.7} berries={false} />
                </>,
              ),
              caption: "Smíšený les s dubem, bukem a habrem.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
