import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, Qty, Sym, Travel, pat, useFig } from "./kit";

const LABEL =
  "Světelné hodiny a dilatace času, srovnání dvou pohledů. Hodiny v klidu: foton létá svisle mezi dvěma zrcadly vzdálenými L, jeden tik trvá Δt₀ = 2L / c. Tytéž hodiny letí kolem pozorovatele rychlostí v: foton podle něj letí šikmo po delší dráze, ale stejnou rychlostí c. Polovina tiku tvoří pravoúhlý trojúhelník s přeponou c · Δt/2, odvěsnou L a odvěsnou v · Δt/2. Z Pythagorovy věty (c · Δt/2)² = L² + (v · Δt/2)² vyjde Δt = γ · Δt₀, kde Lorentzův faktor γ = 1 / √(1 − v²/c²). Na obrázku je v = 0,625 c, takže γ ≐ 1,28 a tik pohybujících se hodin trvá o 28 % déle.";

const W = 320;
const H = 250;
const TOP = 54;
const BOT = 204;
const C = 150; // px per second of the drawing's photon
const HALF = 120; // horizontal shift during half a tick

function Clock({ x, ghost = false }: { x: number; ghost?: boolean }) {
  const { id } = useFig();
  return (
    <g className={ghost ? "fz4-ghost-clock" : undefined}>
      <path
        d={`M${x - 26} ${TOP - 8} V${BOT + 8} M${x + 26} ${TOP - 8} V${BOT + 8}`}
        className="fz4-o fz4-thin"
      />
      {[TOP - 8, BOT].map((y) => (
        <g key={y}>
          <rect
            x={x - 30}
            y={y}
            width={60}
            height={8}
            rx={2}
            className="fz4-o fz4-mirror"
          />
          <rect
            x={x - 30}
            y={y}
            width={60}
            height={8}
            rx={2}
            fill={pat(id, "d")}
          />
        </g>
      ))}
    </g>
  );
}

function Photon() {
  return (
    <g>
      <circle r={9} className="fz4-photon-glow" />
      <circle r={4.5} className="fz4-photon" />
    </g>
  );
}

function Rest() {
  const x = W / 2;
  const path = `M${x} ${BOT} V${TOP} V${BOT}`;
  return (
    <Frame w={W} h={H}>
      <path d={`M${x} ${BOT} V${TOP}`} className="fz4-photon-path" />
      <Clock x={x} />
      <Travel
        path={path}
        dur={(2 * (BOT - TOP)) / C}
        rest={[x, (TOP + BOT) / 2]}
      >
        <Photon />
      </Travel>
      <path
        d={`M${x - 48} ${TOP} H${x - 40} M${x - 48} ${BOT} H${x - 40} M${x - 44} ${TOP + 2} V${BOT - 2}`}
        className="fz4-o fz4-thin"
      />
      <Sym x={x - 52} y={(TOP + BOT) / 2 + 6} t="L" anchor="end" />
      <Sym x={x + 14} y={(TOP + BOT) / 2 + 6} t="c" anchor="start" tone="acc" />
      <text x={x} y={26} textAnchor="middle" className="fz4-lbl fz4-b">
        zrcadlo
      </text>
      <Qty
        x={x}
        y={H - 10}
        s="Δt_{0} = 2L / c"
        anchor="middle"
        className="fz4-eq-lg"
      />
    </Frame>
  );
}

function Moving() {
  const x0 = 40;
  const x1 = x0 + HALF;
  const x2 = x0 + 2 * HALF;
  const dur = (2 * Math.hypot(HALF, BOT - TOP)) / C;
  const path = `M${x0} ${BOT} L${x1} ${TOP} L${x2} ${BOT}`;
  return (
    <Frame w={W} h={H}>
      <Clock x={x0} ghost />
      <Clock x={x2} ghost />
      {/* half a tick as a right triangle */}
      <path
        d={`M${x0} ${BOT} L${x1} ${BOT} L${x1} ${TOP}`}
        className="fz4-o fz4-thin fz4-dash"
      />
      <path
        d={`M${x1 - 10} ${BOT} V${BOT - 10} H${x1}`}
        className="fz4-o fz4-thin"
      />
      <path d={path} className="fz4-photon-path" />
      <Travel path={`M0 0 H${2 * HALF}`} dur={dur} rest={[HALF, 0]}>
        <Clock x={x0} />
      </Travel>
      <Travel path={path} dur={dur} rest={[x1, TOP]}>
        <Photon />
      </Travel>
      <Arrow d={`M${x1 - 30} 24 H${x1 + 30}`} tone="lvl" className="fz4-vec" />
      <Sym x={x1 + 40} y={30} t="v" tone="lvl" anchor="start" />
      <Qty
        x={x0 + 62}
        y={100}
        s="c Δt / 2"
        anchor="end"
        className="fz4-acc-t fz4-halo"
      />
      <Sym x={x1 + 8} y={(TOP + BOT) / 2 + 30} t="L" anchor="start" />
      <Qty
        x={(x0 + x1) / 2}
        y={BOT + 26}
        s="v Δt / 2"
        anchor="middle"
        className="fz4-lvl-t"
      />
      <Qty
        x={x2 - 4}
        y={H - 10}
        s="Δt"
        v="γ Δt_{0}"
        anchor="middle"
        className="fz4-eq-lg"
      />
    </Frame>
  );
}

export default function LightClock() {
  return (
    <Figure level={12} label={LABEL} max={760} interactive boost={false}>
      <div className="fz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: "Hodiny v klidu",
              art: <Rest />,
              caption:
                "Foton létá svisle mezi zrcadly. Jeden tik trvá Δt₀ = 2L / c.",
            },
            {
              title: "Hodiny v pohybu",
              art: <Moving />,
              caption:
                "Pro pozorovatele letí foton šikmo, delší dráhou, ale stejnou rychlostí c: tik trvá déle.",
            },
          ]}
        />
        <p className="fz4-strip-note">
          (c·Δt/2)² = L² + (v·Δt/2)² ⇒ Δt = γ · Δt₀, γ = 1 / √(1 − v²/c²); zde v
          = 0,625 c, γ ≐ 1,28
        </p>
      </div>
    </Figure>
  );
}
