import { StepStrip } from "../../sequence/StepFigure";
import { Fade, Figure, Frame, Lbl, StripBox, pat, useFig } from "./kit";

const LABEL =
  "Stavba těla čtyř skupin členovců při pohledu shora. Korýš (rak říční) má tělo z hlavohrudi a zadečku, pět párů nohou včetně klepet, tedy deset nohou, a dva páry tykadel. Pavoukovec (pavouk) má hlavohruď a zadeček, čtyři páry nohou, tedy osm, a žádná tykadla, jen klepítka a makadla. Hmyz (brouk) má tělo ze tří částí: hlava, hruď a zadeček, tři páry nohou, tedy šest, jeden pár tykadel a křídla. Stonožka má hlavu a mnoho stejných článků, na každém jeden pár nohou, a jeden pár tykadel.";

const W = 200;
const H = 254;

const legPair = (x0: number, y0: number, kx: number, ky: number, fx: number, fy: number) =>
  `M${100 - x0} ${y0} L${100 - kx} ${ky} L${100 - fx} ${fy} M${100 + x0} ${y0} L${100 + kx} ${ky} L${100 + fx} ${fy}`;

function Count({ n, sub }: { n: string; sub: string }) {
  return (
    <Fade delay={0.3}>
      <text x={100} y={234} textAnchor="middle" className="bz2-lbl bz2-b bz2-big bz2-lvl-t">
        {n}
      </text>
      <text x={100} y={251} textAnchor="middle" className="bz2-lbl bz2-sm bz2-muted-t">
        {sub}
      </text>
    </Fade>
  );
}

function Crayfish() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H} className="bz2-small">
      {/* antennae: 1 long + 1 short pair */}
      <path d="M94 50 Q60 30 20 34 M106 50 Q140 30 180 34" className="bz2-o bz2-thin" />
      <path d="M96 50 Q88 36 80 30 M104 50 Q112 36 120 30" className="bz2-o bz2-thin" />
      {/* claws (1st pair) */}
      <path d={legPair(10, 66, 34, 56, 46, 40)} className="bz2-o" style={{ strokeWidth: 3 }} />
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M${100 + s * 46} 42 Q${100 + s * 62} 20 ${100 + s * 50} 8 Q${100 + s * 44} 18 ${100 + s * 46} 26 Q${100 + s * 36} 18 ${100 + s * 36} 8 Q${100 + s * 30} 28 ${100 + s * 46} 42Z`}
          className="bz2-o bz2-chitin"
        />
      ))}
      {/* 4 walking pairs */}
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={legPair(14, 76 + k * 9, 36, 72 + k * 12, 48, 86 + k * 16)}
          className="bz2-o"
          style={{ strokeWidth: 1.8 }}
        />
      ))}
      {/* cephalothorax */}
      <path d="M100 44 Q120 48 122 80 Q122 116 100 122 Q78 116 78 80 Q80 48 100 44Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M100 44 Q120 48 122 80 Q122 116 100 122 Q78 116 78 80 Q80 48 100 44Z" fill={pat(id, "d")} />
      {/* abdomen segments + tail fan */}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={84 + k * 1.2} y={122 + k * 11} width={32 - k * 2.4} height={11} rx={3} className="bz2-o bz2-chitin" />
      ))}
      <path d="M100 188 L82 208 Q100 214 118 208Z M100 188 L90 210 M100 188 L110 210" className="bz2-o bz2-chitin" />
      <Lbl x={196} y={132} tx={118} ty={100} anchor="end" lx={150} ly={118} className="bz2-sm">hlavohruď</Lbl>
      <Lbl x={196} y={176} tx={114} ty={160} anchor="end" lx={130} ly={166} className="bz2-sm">zadeček</Lbl>
      <Lbl x={2} y={150} tx={52} ty={40} lx={24} ly={136} className="bz2-sm" sec>klepeta</Lbl>
      <Count n="10 nohou" sub="2 páry tykadel" />
    </Frame>
  );
}

function Spider() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H} className="bz2-small">
      {/* 4 pairs of legs from the cephalothorax */}
      {[
        [8, 66, 40, 34, 62, 14],
        [10, 74, 46, 56, 80, 50],
        [10, 82, 46, 96, 78, 116],
        [8, 90, 40, 124, 60, 168],
      ].map(([a, b, c, d, e, f], k) => (
        <path key={k} d={legPair(a, b, c, d, e, f)} className="bz2-o" style={{ strokeWidth: 2 }} />
      ))}
      {/* pedipalps + chelicerae */}
      <path d="M94 56 Q86 44 82 38 M106 56 Q114 44 118 38" className="bz2-o" style={{ strokeWidth: 2.2 }} />
      <path d="M96 56 L96 48 M104 56 L104 48" className="bz2-o" style={{ strokeWidth: 3 }} />
      {/* cephalothorax + abdomen */}
      <ellipse cx={100} cy={76} rx={20} ry={23} className="bz2-o bz2-lvlmid-f" />
      <ellipse cx={100} cy={76} rx={20} ry={23} fill={pat(id, "d")} />
      {[-6, -2, 2, 6].map((dx) => (
        <circle key={dx} cx={100 + dx} cy={62} r={1.6} className="bz2-ink-f" />
      ))}
      <ellipse cx={100} cy={140} rx={30} ry={40} className="bz2-o bz2-chitin" />
      <ellipse cx={100} cy={140} rx={30} ry={40} fill={pat(id, "b")} />
      <path d="M96 180 L94 188 M104 180 L106 188" className="bz2-o" />
      <Lbl x={198} y={102} tx={118} ty={80} anchor="end" lx={160} ly={88} className="bz2-sm">hlavohruď</Lbl>
      <Lbl x={198} y={198} tx={124} ty={160} anchor="end" lx={150} ly={184} className="bz2-sm">zadeček</Lbl>
      <Lbl x={2} y={22} tx={84} ty={42} className="bz2-sm" sec>makadla</Lbl>
      <Count n="8 nohou" sub="bez tykadel" />
    </Frame>
  );
}

function Insect() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H} className="bz2-small">
      {/* 3 pairs of legs from the thorax */}
      <path d={legPair(12, 82, 40, 70, 56, 52)} className="bz2-o" style={{ strokeWidth: 2 }} />
      <path d={legPair(14, 94, 46, 100, 62, 92)} className="bz2-o" style={{ strokeWidth: 2 }} />
      <path d={legPair(14, 104, 44, 130, 58, 166)} className="bz2-o" style={{ strokeWidth: 2 }} />
      {/* antennae */}
      <path d="M94 42 Q80 24 66 18 M106 42 Q120 24 134 18" className="bz2-o" />
      {/* head */}
      <ellipse cx={100} cy={50} rx={13} ry={11} className="bz2-o bz2-chitin" />
      {/* thorax */}
      <path d="M82 64 Q100 56 118 64 L120 104 Q100 110 80 104Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M82 64 Q100 56 118 64 L120 104 Q100 110 80 104Z" fill={pat(id, "d")} />
      {/* abdomen under the wing covers (elytra) */}
      <path d="M100 104 L100 196 Q74 192 72 152 Q72 118 80 104Z" className="bz2-o bz2-chitin" />
      <path d="M100 104 L100 196 Q126 192 128 152 Q128 118 120 104Z" className="bz2-o bz2-chitin" />
      <path d="M100 104 L100 196 Q74 192 72 152 Q72 118 80 104Z" fill={pat(id, "b")} />
      <path d="M100 104 L100 196 Q126 192 128 152 Q128 118 120 104Z" fill={pat(id, "b")} />
      <Lbl x={150} y={50} tx={113} ty={50} className="bz2-sm">hlava</Lbl>
      <Lbl x={150} y={84} tx={118} ty={84} className="bz2-sm">hruď</Lbl>
      <Lbl x={198} y={206} tx={116} ty={170} anchor="end" lx={150} ly={192} className="bz2-sm">zadeček</Lbl>
      <Lbl x={2} y={206} tx={80} ty={170} lx={30} ly={192} className="bz2-sm" sec>krovky</Lbl>
      <Count n="6 nohou" sub="1 pár tykadel" />
    </Frame>
  );
}

function Centipede() {
  const segs = 13;
  return (
    <Frame w={W} h={H} className="bz2-small">
      {/* antennae */}
      <path d="M95 24 Q80 10 64 8 M105 24 Q120 10 136 8" className="bz2-o" />
      {Array.from({ length: segs }, (_, k) => {
        const y = 40 + k * 12.5;
        return (
          <g key={k}>
            <path
              d={legPair(12, y + 6, 30, y + 2, 40, y + 12)}
              className="bz2-o"
              style={{ strokeWidth: 1.6 }}
            />
            <rect x={86} y={y} width={28} height={12} rx={3} className={`bz2-o ${k % 2 ? "bz2-chitin" : "bz2-lvlmid-f"}`} />
          </g>
        );
      })}
      {/* head with poison claws */}
      <path d="M88 38 L86 30 Q100 18 114 30 L112 38Z" className="bz2-o bz2-chitin" />
      <path d="M90 38 Q84 44 92 48 M110 38 Q116 44 108 48" className="bz2-o" style={{ strokeWidth: 2 }} />
      <Lbl x={150} y={30} tx={113} ty={30} className="bz2-sm">hlava</Lbl>
      <Lbl x={198} y={150} tx={114} ty={115} anchor="end" lx={170} ly={136} className="bz2-sm">článek</Lbl>
      <Count n="1 pár / článek" sub="1 pár tykadel" />
    </Frame>
  );
}

export default function ArthropodGroups() {
  return (
    <Figure level={4} label={LABEL} max={860} interactive boost={false}>
      <StripBox
        label={LABEL}
        note="Všichni členovci mají článkované nohy a vnější kostru z chitinu; liší se počtem částí těla, nohou a tykadel."
      >
        <StepStrip
          min={140}
          phoneColumns={2}
          steps={[
            { title: "Korýš – rak", art: <Crayfish />, caption: "Hlavohruď a zadeček, 5 párů nohou (první jsou klepeta)." },
            { title: "Pavoukovec – pavouk", art: <Spider />, caption: "Hlavohruď a zadeček, 4 páry nohou, žádná tykadla." },
            { title: "Hmyz – brouk", art: <Insect />, caption: "Hlava, hruď, zadeček; 3 páry nohou na hrudi." },
            { title: "Stonožka", art: <Centipede />, caption: "Hlava a mnoho stejných článků, na každém pár nohou." },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
