import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Pop, pat, rng, useFig } from "./kit";
import { Animal } from "./animals";

const LABEL =
  "Alopatrická speciace, animace po krocích. 1. Jedna populace pěnkav žije na souvislém území, ptáci se mezi sebou volně kříží a geny se mísí. 2. Bariéra – například mořská úžina nebo pohoří – populaci rozdělí, tok genů mezi oběma částmi se zastaví. 3. Každá část se vyvíjí jinak: v suché krajině se semeny zvýhodní přírodní výběr silné zobáky, ve vlhké s hmyzem tenké; přidávají se jiné mutace a náhodný genetický drift. 4. Když bariéra zmizí a ptáci se znovu setkají, už se nekříží – vznikla reprodukční izolace a z jedné populace jsou dva druhy.";

const W = 440;
const H = 240;
const GROUND = 196;
const MID = 220;

type Kind = "same" | "split" | "diverged" | "meet";

const BIRDS = (() => {
  const r = rng(17);
  return Array.from({ length: 14 }, (_, i) => {
    const left = i % 2 === 0;
    const x = left ? 30 + r() * 150 : 262 + r() * 150;
    const y = 60 + r() * 110;
    return { x, y, left, flip: r() > 0.5 };
  });
})();

function Land({ kind }: { kind: Kind }) {
  const { id } = useFig();
  const div = kind === "diverged" || kind === "meet";
  return (
    <g>
      {/* two halves of the territory: same at first, dry vs. humid later */}
      <rect x={6} y={30} width={MID - 6} height={GROUND - 30} rx={8} className={div ? "bz4-sp-dry" : "bz4-sp-land"} />
      <rect x={MID} y={30} width={W - 6 - MID} height={GROUND - 30} rx={8} className={div ? "bz4-sp-wet" : "bz4-sp-land"} />
      <rect x={6} y={30} width={W - 12} height={GROUND - 30} rx={8} fill={pat(id, "dots")} opacity={0.6} />
      {div && (
        <g>
          {/* seeds (left) and insects (right) */}
          {[
            [40, 186],
            [92, 182],
            [150, 188],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={4} ry={2.6} className="bz4-o bz4-thin bz4-sp-seed" />
          ))}
          {[
            [300, 46],
            [372, 58],
            [410, 40],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={3.5} ry={2} className="bz4-sp-bug" />
              <path d={`M${x - 2} ${y - 1} l-3 -4 M${x + 2} ${y - 1} l3 -4`} className="bz4-o bz4-thin" />
            </g>
          ))}
        </g>
      )}
      {(kind === "split" || kind === "diverged") && (
        <g>
          <path
            d={`M${MID - 18} 30 C${MID - 8} 80 ${MID - 24} 130 ${MID - 14} ${GROUND} H${MID + 16} C${MID + 26} 130 ${MID + 8} 80 ${MID + 18} 30Z`}
            className="bz4-sp-sea"
          />
          <path d={`M${MID - 18} 30 C${MID - 8} 80 ${MID - 24} 130 ${MID - 14} ${GROUND} M${MID + 18} 30 C${MID + 8} 80 ${MID + 26} 130 ${MID + 16} ${GROUND}`} className="bz4-o" />
          <path d={`M${MID - 6} 60 q4 -4 8 0 t8 0 M${MID - 10} 110 q4 -4 8 0 t8 0 M${MID - 6} 160 q4 -4 8 0 t8 0`} className="bz4-sp-wave" />
        </g>
      )}
    </g>
  );
}

function Birds({ kind }: { kind: Kind }) {
  return (
    <g>
      {BIRDS.map((b, i) => {
        const div = kind === "diverged" || kind === "meet";
        // when the populations meet again some birds of each species cross over
        const swap = kind === "meet" && i % 4 === 0;
        const x = swap ? (b.left ? b.x + 230 : b.x - 230) : b.x;
        const tone = !div ? "bz4-sp-a" : b.left ? "bz4-sp-l" : "bz4-sp-r";
        const beak = !div ? undefined : b.left ? "thick" : "thin";
        return (
          <Animal key={i} kind="pinkava" x={x} y={b.y} s={0.72} flip={b.flip} tone={tone} beak={beak} />
        );
      })}
    </g>
  );
}

function Caption({ a, b, cls = "" }: { a: string; b?: string; cls?: string }) {
  return (
    <g>
      <text x={W / 2} y={GROUND + 22} textAnchor="middle" className={`bz4-lbl bz4-sm bz4-b ${cls}`}>
        {a}
      </text>
      {b && (
        <text x={W / 2} y={GROUND + 38} textAnchor="middle" className="bz4-lbl bz4-sm">
          {b}
        </text>
      )}
    </g>
  );
}

function One() {
  return (
    <Frame w={W} h={H}>
      <Land kind="same" />
      <Birds kind="same" />
      <Fade delay={0.3}>
        <Arrow d="M150 110 H290" tone="lvl" both dashed />
        <text x={W / 2} y={22} textAnchor="middle" className="bz4-lbl bz4-sm bz4-lvl-t bz4-b">
          geny se volně mísí
        </text>
      </Fade>
      <Caption a="jedna populace" />
    </Frame>
  );
}

function Split() {
  return (
    <Frame w={W} h={H}>
      <Land kind="split" />
      <Birds kind="same" />
      <Pop delay={0.3}>
        <path d={`M${MID - 9} 13 l18 18 M${MID + 9} 13 l-18 18`} className="bz4-lo-x" />
      </Pop>
      <text x={MID - 22} y={22} textAnchor="end" className="bz4-lbl bz4-sm bz4-b bz4-blue-t">
        mořská úžina
      </text>
      <Caption a="bariéra rozdělí populaci" b="geny se už nemísí" />
    </Frame>
  );
}

function Diverge() {
  return (
    <Frame w={W} h={H}>
      <Land kind="diverged" />
      <Birds kind="diverged" />
      <Fade delay={0.2}>
        <text x={12} y={22} className="bz4-lbl bz4-sm bz4-b">sucho, semena: silný zobák</text>
        <text x={W - 12} y={22} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">vlhko, hmyz: tenký</text>
      </Fade>
      <Caption a="každá část se vyvíjí jinak" b="přírodní výběr, mutace, genetický drift" />
    </Frame>
  );
}

function Meet() {
  return (
    <Frame w={W} h={H}>
      <Land kind="meet" />
      <Birds kind="meet" />
      <Pop delay={0.3}>
        <g transform={`translate(${MID} 108)`}>
          <circle r={20} className="bz4-o bz4-fill" />
          <path d="M0 8 C-14 -2 -10 -14 0 -6 C10 -14 14 -2 0 8Z" className="bz4-sp-heart" />
          <path d="M-14 -14 L14 14" className="bz4-lo-x" />
        </g>
      </Pop>
      <text x={W / 2} y={22} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        bariéra zmizela, ptáci se potkávají
      </text>
      <Caption a="nekříží se: dva druhy" b="reprodukční izolace" cls="bz4-lvl-t" />
    </Frame>
  );
}

const STEPS = [
  { title: "Jedna populace", caption: "Ptáci se volně kříží, geny celé populace se mísí.", art: <One /> },
  { title: "Bariéra", caption: "Úžina nebo pohoří rozdělí populaci na dvě části. Tok genů se zastaví.", art: <Split /> },
  {
    title: "Rozdílný vývoj",
    caption: "Jiné prostředí zvýhodní jiné znaky. Přibývají odlišné mutace a působí náhoda (drift).",
    art: <Diverge />,
  },
  {
    title: "Dva druhy",
    caption: "Když se populace znovu setkají, už se nekříží: vznikla reprodukční izolace.",
    art: <Meet />,
  },
];

export default function Speciation() {
  return (
    <Figure level={12} label={LABEL} max={620} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
