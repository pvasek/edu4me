import { StepStrip } from "../../sequence/StepFigure";
import {
  Body,
  Fade,
  Figure,
  Frame,
  Lbl,
  Pop,
  f1,
  pat,
  rng,
  useFig,
} from "./kit";

const LABEL =
  "Tři mikroskopy z různých dob. Robert Hooke roku 1665: mikroskop se dvěma čočkami v ozdobném tubusu, osvětlený lampou přes skleněnou kouli s vodou, zvětšení asi 50×; v plátku korku uviděl prázdné komůrky a nazval je buňky. Antoni van Leeuwenhoek kolem roku 1675: malá mosazná destička s jedinou drobnou čočkou, vzorek na hrotu se posouvá šrouby, zvětšení až asi 270×; jako první uviděl bakterie a prvoky. Dnešní školní mikroskop: okulár, objektivy na revolveru, stolek a lampa, zvětšení 40× až 400×.";

const W = 240;
const H = 250;

function Mag({ text }: { text: string }) {
  return (
    <g>
      <rect
        x={W / 2 - 50}
        y={H - 30}
        width={100}
        height={24}
        rx={12}
        className="bz5-tag-lvl"
      />
      <text x={W / 2} y={H - 13} textAnchor="middle" className="bz5-eq">
        {text}
      </text>
    </g>
  );
}

/** Hooke's cork: empty, box-like cells (only the walls are left). */
function Cork({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig();
  const R = rng(3);
  const cells: string[] = [];
  for (let row = -4; row <= 4; row++) {
    for (let col = -4; col <= 4; col++) {
      const x = cx + col * 11 + (row % 2) * 5.5 + (R() - 0.5) * 1.6;
      const y = cy + row * 8;
      cells.push(`M${f1(x - 5)} ${f1(y - 3.6)} h10 v7.2 h-10 Z`);
    }
  }
  return (
    <g>
      <clipPath id={`${id}-cork`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} className="bz5-cork-bg" />
      <g clipPath={`url(#${id}-cork)`}>
        <path d={cells.join(" ")} className="bz5-o bz5-cork-cell" />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="bz5-o"
        style={{ strokeWidth: 2 }}
      />
    </g>
  );
}

function Hooke() {
  const { id } = useFig();
  const TX = 92; // tube axis
  return (
    <Frame w={W} h={H}>
      <Fade>
        {/* foot and pillar */}
        <Body
          d="M14 206 Q14 196 60 196 Q106 196 106 206 Q106 214 60 214 Q14 214 14 206 Z"
          fill="bz5-brass"
          hatch="d"
        />
        <Body d="M28 196 V40 H36 V196 Z" fill="bz5-brass" hatch="v" />
        <path d="M36 92 H78" className="bz5-o" style={{ strokeWidth: 3 }} />
        <circle cx={32} cy={92} r={5} className="bz5-o bz5-brass" />
        {/* tube of tooled leather with gilt rings */}
        <Body
          d={`M${TX - 15} 54 H${TX + 15} L${TX + 13} 150 H${TX - 13} Z`}
          fill="bz5-leather"
          hatch="b"
        />
        <path
          d={`M${TX - 15} 70 H${TX + 15} M${TX - 14.5} 86 H${TX + 14.5} M${TX - 14} 112 H${TX + 14} M${TX - 13.4} 136 H${TX + 13.4}`}
          className="bz5-o bz5-gilt"
          style={{ strokeWidth: 2 }}
        />
        <Body
          d={`M${TX - 10} 30 H${TX + 10} V54 H${TX - 10} Z`}
          fill="bz5-leather"
        />
        <rect
          x={TX - 12}
          y={26}
          width={24}
          height={6}
          rx={2}
          className="bz5-o bz5-brass"
        />
        <Body
          d={`M${TX - 13} 150 H${TX + 13} L${TX + 6} 170 H${TX - 6} Z`}
          fill="bz5-brass"
          hatch="d"
        />
        {/* specimen on a pin */}
        <path
          d={`M${TX} 196 V184`}
          className="bz5-o"
          style={{ strokeWidth: 1.6 }}
        />
        <rect
          x={TX - 6}
          y={180}
          width={12}
          height={4}
          className="bz5-o bz5-cork-bg"
        />
        {/* oil lamp and water globe that focus the light */}
        <Body
          d="M150 196 Q150 184 166 184 Q182 184 182 196 Z"
          fill="bz5-brass"
          hatch="d"
        />
        <path d="M166 184 V176" className="bz5-o" />
        <path
          d="M166 176 Q160 168 166 158 Q172 168 166 176 Z"
          className="bz5-flame"
        />
        <circle cx={140} cy={150} r={16} className="bz5-glass bz5-o" />
        <circle cx={140} cy={150} r={16} fill={pat(id, "h")} opacity={0.5} />
        <path d="M140 166 V184 M128 196 H152" className="bz5-o bz5-thin" />
      </Fade>
      <path
        d="M162 166 L152 158 M127 158 L98 180"
        className="bz5-o bz5-lvl-s bz5-dash"
        style={{ strokeWidth: 1.6 }}
      />
      <Pop delay={0.4}>
        <Cork cx={196} cy={44} r={36} />
      </Pop>
      <Fade delay={0.6}>
        <Lbl x={8} y={24} tx={TX - 10} ty={32} className="bz5-sm">
          okulár
        </Lbl>
        <Lbl x={130} y={124} tx={TX + 8} ty={162} className="bz5-sm">
          objektiv
        </Lbl>
        <text
          x={196}
          y={96}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b"
        >
          korek
        </text>
      </Fade>
      <Mag text="asi 50×" />
    </Frame>
  );
}

/** What Leeuwenhoek saw in plaque from his teeth. */
function Animalcules({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig();
  return (
    <g>
      <clipPath id={`${id}-an`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} className="bz5-water" />
      <g clipPath={`url(#${id}-an)`} className="bz5-o bz5-thin">
        <rect
          x={cx - 22}
          y={cy - 18}
          width={16}
          height={5}
          rx={2.5}
          className="bz5-bact"
        />
        <rect
          x={cx + 4}
          y={cy - 22}
          width={13}
          height={5}
          rx={2.5}
          className="bz5-bact"
          transform={`rotate(30 ${cx + 10} ${cy - 20})`}
        />
        <path d={`M${cx - 20} ${cy + 6} q4 -6 8 0 t8 0 t8 0`} />
        <circle cx={cx + 14} cy={cy + 2} r={3} className="bz5-bact" />
        <circle cx={cx + 20} cy={cy + 6} r={3} className="bz5-bact" />
        <circle cx={cx + 8} cy={cy + 8} r={3} className="bz5-bact" />
        <path
          d={`M${cx - 8} ${cy + 18} q6 -4 12 0 q-6 6 -12 0 Z`}
          className="bz5-cyto"
        />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="bz5-o"
        style={{ strokeWidth: 2 }}
      />
    </g>
  );
}

function Leeuwenhoek() {
  const { id } = useFig();
  const LX = 84; // lens
  const LY = 62;
  return (
    <Frame w={W} h={H}>
      <g transform="translate(16 0)">
        <Fade>
          {/* the brass plate (two riveted plates, about 5 cm tall) */}
          <Body
            d="M52 30 Q52 22 60 22 H108 Q116 22 116 30 V170 Q116 178 108 178 H60 Q52 178 52 170 Z"
            fill="bz5-brass"
            hatch="d"
          />
          {[
            [60, 30],
            [108, 30],
            [60, 170],
            [108, 170],
            [84, 120],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={2.4}
              className="bz5-o bz5-thin bz5-fill3"
            />
          ))}
          {/* screw that lifts the specimen holder */}
          <path
            d="M100 178 V214"
            className="bz5-o"
            style={{ strokeWidth: 3 }}
          />
          <path
            d="M97 184 L103 187 M97 190 L103 193 M97 196 L103 199 M97 202 L103 205"
            className="bz5-o bz5-thin"
          />
          <rect
            x={90}
            y={212}
            width={20}
            height={9}
            rx={3}
            className="bz5-o bz5-brass"
          />
          {/* holder with the pin, behind the plate */}
          <path d="M116 78 H136 V92 H116" className="bz5-o bz5-brass" />
          <path d="M136 85 H152" className="bz5-o" style={{ strokeWidth: 3 }} />
          <circle cx={156} cy={85} r={6} className="bz5-o bz5-brass" />
          <path
            d="M116 70 L94 64"
            className="bz5-o"
            style={{ strokeWidth: 1.6 }}
          />
          <circle cx={92} cy={63.5} r={2.6} className="bz5-lvl-f" />
        </Fade>
        <Pop delay={0.2}>
          <circle cx={LX} cy={LY} r={7} className="bz5-o bz5-fill3" />
          <circle
            cx={LX}
            cy={LY}
            r={3.6}
            className="bz5-glass bz5-o bz5-thin"
          />
          <circle cx={LX} cy={LY} r={3.6} fill={pat(id, "hi")} />
        </Pop>
      </g>
      <Pop delay={0.4}>
        <Animalcules cx={200} cy={168} r={32} />
      </Pop>
      <Fade delay={0.6}>
        <Lbl x={146} y={36} tx={LX + 22} ty={LY - 4} className="bz5-sm bz5-b">
          {"čočka\nasi 1 mm"}
        </Lbl>
        <Lbl x={4} y={110} tx={106} ty={66} className="bz5-sm">
          {"hrot se\nvzorkem"}
        </Lbl>
        <Lbl x={8} y={206} tx={108} ty={214} className="bz5-sm">
          šroub
        </Lbl>
        <text
          x={200}
          y={124}
          textAnchor="middle"
          className="bz5-lbl bz5-sm bz5-b"
        >
          zubní povlak
        </text>
      </Fade>
      <Mag text="až 270×" />
    </Frame>
  );
}

function Modern() {
  const { id } = useFig();
  const AX = 100;
  return (
    <Frame w={W} h={H}>
      <Fade>
        <Body
          d="M150 196 C166 160 170 126 166 96 C164 78 158 64 150 54 L164 46 C176 62 182 82 184 102 C186 132 180 166 168 196 Z"
          fill="bz5-fill2"
          hatch="d"
        />
        <Body d="M46 212 L54 196 H176 L186 212 Z" fill="bz5-fill3" hatch="d" />
        <rect
          x={AX - 12}
          y={186}
          width={24}
          height={10}
          rx={2}
          className="bz5-o bz5-fill"
        />
        <ellipse
          cx={AX}
          cy={186}
          rx={10}
          ry={2.6}
          className="bz5-o bz5-glass"
        />
        <Body d="M44 132 H160 V140 H44 Z" fill="bz5-fill2" hatch="b" />
        <rect
          x={74}
          y={128}
          width={52}
          height={4}
          className="bz5-o bz5-glass"
        />
        <Body
          d={`M${AX - 9} 142 H${AX + 9} L${AX + 7} 156 H${AX - 7} Z`}
          fill="bz5-fill"
          hatch="v"
        />
        <Body
          d={`M${AX - 12} 46 H150 L164 50 L150 58 V64 H${AX - 12} Z`}
          fill="bz5-fill2"
          hatch="d"
        />
        <Body
          d={`M${AX - 9} 16 H${AX + 9} V46 H${AX - 9} Z`}
          fill="bz5-fill"
          hatch="v"
        />
        <rect
          x={AX - 11}
          y={10}
          width={22}
          height={7}
          rx={2}
          className="bz5-o bz5-fill3"
        />
        <Body
          d={`M${AX - 20} 64 H${AX + 20} L${AX + 15} 74 H${AX - 15} Z`}
          fill="bz5-fill3"
          hatch="b"
        />
        <Body
          d={`M${AX - 6} 74 H${AX + 6} V96 L${AX + 4} 102 H${AX - 4} L${AX - 6} 96 Z`}
          fill="bz5-fill"
        />
        <path
          d={`M${AX - 6} 82 H${AX + 6}`}
          className="bz5-o bz5-lvl-s"
          style={{ strokeWidth: 2.2 }}
        />
        <g transform={`rotate(24 ${AX - 12} 72)`}>
          <Body
            d={`M${AX - 17} 72 H${AX - 7} V88 L${AX - 9} 92 H${AX - 15} L${AX - 17} 88 Z`}
            fill="bz5-fill"
          />
        </g>
        <g transform={`rotate(-24 ${AX + 12} 72)`}>
          <Body
            d={`M${AX + 7} 72 H${AX + 17} V90 L${AX + 15} 94 H${AX + 9} L${AX + 7} 90 Z`}
            fill="bz5-fill"
          />
        </g>
        <circle cx={176} cy={150} r={11} className="bz5-o bz5-fill2" />
        <circle cx={176} cy={150} r={11} fill={pat(id, "x")} />
        <circle cx={176} cy={174} r={6} className="bz5-o bz5-fill3" />
      </Fade>
      <path
        d={`M${AX} 182 V158 M${AX} 140 V104`}
        className="bz5-o bz5-lvl-s bz5-dash"
        style={{ strokeWidth: 1.6 }}
      />
      <Fade delay={0.5}>
        <Lbl x={8} y={26} tx={AX - 9} ty={26} className="bz5-sm bz5-b">
          okulár
        </Lbl>
        <Lbl x={8} y={96} tx={AX - 6} ty={90} className="bz5-sm bz5-b">
          objektiv
        </Lbl>
        <Lbl x={8} y={170} tx={AX - 12} ty={190} className="bz5-sm">
          lampa
        </Lbl>
        <Lbl x={196} y={124} tx={182} ty={144} className="bz5-sm" sec>
          šrouby
        </Lbl>
      </Fade>
      <Mag text="40× až 400×" />
    </Frame>
  );
}

export default function MicroscopeHistory() {
  return (
    <Figure level={1} label={LABEL} max={760} interactive className="bz5-hist">
      <div className="bz5-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={180}
          steps={[
            {
              title: "Robert Hooke, 1665",
              art: <Hooke />,
              caption:
                "Dvě čočky v tubusu. V korku uviděl prázdné komůrky a nazval je buňky.",
            },
            {
              title: "Leeuwenhoek, kolem 1675",
              art: <Leeuwenhoek />,
              caption:
                "Jediná drobná čočka v destičce. Jako první uviděl bakterie a prvoky.",
            },
            {
              title: "Školní mikroskop dnes",
              art: <Modern />,
              caption:
                "Okulár a objektiv za sebou, vlastní lampa a jemné zaostřování.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
