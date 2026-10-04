import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, Liquid, pat, useFig } from "./kit";

const LABEL =
  "Tři typy rozhraní litosférických desek. Na rozbíhavém (divergentním) rozhraní se desky od sebe vzdalují, z pláště vystupuje magma a vzniká středooceánský hřbet s novou kůrou. Na sbíhavém (konvergentním) rozhraní se desky srážejí: těžší oceánská deska se podsouvá pod pevninskou (subdukce), vzniká hlubokomořský příkop a nad ním sopky; když se srazí dvě pevninské desky, kůra se vrásní do vysokých pohoří jako Himálaj. Na transformním rozhraní se desky po zlomu posouvají vedle sebe a vznikají zemětřesení.";

const W = 200;
const H = 150;
const SEA = "#5d93d6";

function Mantle({ top = 112 }: { top?: number }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={4} y={top} width={W - 8} height={H - 4 - top} className="bz3-mantle" />
      <rect x={4} y={top} width={W - 8} height={H - 4 - top} fill={pat(id, "dots")} />
    </g>
  );
}

function Slab({ d, ocean = true }: { d: string; ocean?: boolean }) {
  const { id } = useFig();
  return (
    <g>
      <path d={d} className={ocean ? "bz3-oplate" : "bz3-cplate"} />
      <path d={d} fill={pat(id, ocean ? "d" : "b")} opacity={0.6} />
      <path d={d} className="bz3-o" />
    </g>
  );
}

function T({ x, y, children, a = "middle" }: { x: number; y: number; children: string; a?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={a} className="bz3-lbl bz3-sm bz3-b bz3-halo">
      {children}
    </text>
  );
}

function Divergent() {
  return (
    <Frame w={W} h={H}>
      <Liquid d="M4 40 H196 V92 L4 92Z" color={SEA} opacity={0.25} />
      <Mantle />
      <Slab d="M4 92 L82 92 Q92 76 97 74 L97 112 L4 112Z" />
      <Slab d="M196 92 L118 92 Q108 76 103 74 L103 112 L196 112Z" />
      <path d="M100 146 C96 132 104 122 100 76" className="bz3-magma" />
      <Arrow d="M64 102 H24" tone="lvl" className="bz3-vec" />
      <Arrow d="M136 102 H176" tone="lvl" className="bz3-vec" />
      <Arrow d="M70 136 C80 128 88 124 94 120" tone="acc" />
      <Arrow d="M130 136 C120 128 112 124 106 120" tone="acc" />
      <T x={100} y={30}>hřbet: nová kůra</T>
      <T x={150} y={140}>magma</T>
    </Frame>
  );
}

function Subduction() {
  return (
    <Frame w={W} h={H}>
      <Liquid d="M4 50 H96 L104 80 L4 80Z" color={SEA} opacity={0.25} />
      <Mantle top={118} />
      <Slab d="M4 80 L100 80 Q110 84 120 98 L150 146 L126 146 L104 104 Q98 96 90 96 L4 96Z" />
      <Slab d="M110 70 Q120 52 136 46 L144 34 L152 46 Q170 48 196 52 L196 112 L150 112 L124 82 Q114 74 110 70Z" ocean={false} />
      <path d="M144 34 C140 60 136 80 132 104" className="bz3-magma bz3-magma-thin" />
      <path d="M140 26 q4 -8 0 -16 M148 26 q4 -8 0 -16" className="bz3-smoke" />
      <Arrow d="M30 88 H76" tone="lvl" className="bz3-vec" />
      <T x={98} y={42}>příkop</T>
      <T x={176} y={24}>sopka</T>
      <T x={40} y={140} a="start">subdukce</T>
    </Frame>
  );
}

function Collision() {
  return (
    <Frame w={W} h={H}>
      <Mantle top={120} />
      <Slab d="M4 80 L70 80 Q84 66 92 44 L100 30 L108 44 Q116 66 130 80 L196 80 L196 120 L4 120Z" ocean={false} />
      <path d="M70 80 Q100 54 130 80 M80 96 Q100 74 120 96 M60 104 Q100 88 140 104" className="bz3-o bz3-thin" />
      <path d="M92 44 L96 40 L100 30 L104 40 L108 44" className="bz3-snow" />
      <Arrow d="M14 100 H52" tone="lvl" className="bz3-vec" />
      <Arrow d="M186 100 H148" tone="lvl" className="bz3-vec" />
      <T x={100} y={20}>pohoří (Himálaj)</T>
      <T x={100} y={142}>dvě pevninské desky</T>
    </Frame>
  );
}

function Transform() {
  const { id } = useFig();
  // map view: two blocks sliding past each other along a fault; a road is offset
  return (
    <Frame w={W} h={H}>
      <rect x={14} y={22} width={86} height={110} className="bz3-cplate" />
      <rect x={100} y={22} width={86} height={110} className="bz3-cplate bz3-cplate-2" />
      <rect x={14} y={22} width={172} height={110} fill={pat(id, "b")} opacity={0.45} />
      <rect x={14} y={22} width={172} height={110} className="bz3-o" />
      <path d="M100 22 L98 52 L102 82 L99 132" className="bz3-fault" />
      <path d="M14 70 H100 M100 94 H186" className="bz3-road" />
      <Arrow d="M56 120 V88" tone="lvl" className="bz3-vec" />
      <Arrow d="M144 36 V68" tone="lvl" className="bz3-vec" />
      <T x={100} y={16}>zlom (pohled shora)</T>
      <T x={100} y={146}>posunutá silnice</T>
    </Frame>
  );
}

export default function PlateBoundaries() {
  return (
    <Figure level={8} label={LABEL} interactive max={760}>
      <div className="bz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={220}
          phoneColumns={2}
          steps={[
            {
              title: "Rozbíhavá (divergentní)",
              art: <Divergent />,
              caption: "Desky se vzdalují, magma vyplní mezeru a vzniká nová oceánská kůra.",
            },
            {
              title: "Sbíhavá: podsouvání",
              art: <Subduction />,
              caption: "Těžší oceánská deska se podsouvá pod pevninskou. Vzniká příkop a sopky.",
            },
            {
              title: "Sbíhavá: vznik pohoří",
              art: <Collision />,
              caption: "Srazí se dvě pevninské desky a kůra se vrásní do vysokých pohoří.",
            },
            {
              title: "Transformní",
              art: <Transform />,
              caption: "Desky se posouvají vedle sebe po zlomu. Hrozí silná zemětřesení.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
