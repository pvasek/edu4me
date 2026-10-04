import { DrawArrow, Fade, Figure, Pop } from "./kit";

const LABEL =
  "Hlavní instituce Evropské unie a kdo koho volí. Občané EU volí každých pět let Evropský parlament (720 poslanců, z Česka 21). Vlády 27 členských států vysílají své hlavy států nebo předsedy vlád do Evropské rady, která určuje hlavní směr EU, a své ministry do Rady EU. Evropská rada navrhuje předsedu Evropské komise, Parlament ho volí a schvaluje celou Komisi (27 komisařů, jeden z každého státu). Komise navrhuje zákony a hlídá jejich dodržování; zákon EU schvalují společně Evropský parlament a Rada EU. Soudní dvůr EU v Lucemburku vykládá právo EU a řeší spory.";

const W = 440;
const H = 512;
const COLS = [12, 154, 296];
const CW = 132;
const cx = (i: number) => COLS[i] + CW / 2;

function Box({
  x,
  y,
  w,
  h,
  lvl = false,
  title,
  lines = [],
  ty,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lvl?: boolean;
  title: string[];
  lines?: string[];
  ty?: number;
}) {
  const mid = x + w / 2;
  const t0 = ty ?? y + 23;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={lvl ? "gz5-box-lvl" : "gz5-box"} />
      {title.map((t, i) => (
        <text key={t} x={mid} y={t0 + i * 18} textAnchor="middle" className="gz5-lbl gz5-b">
          {t}
        </text>
      ))}
      {lines.map((t, i) => (
        <text key={t} x={mid} y={t0 + title.length * 18 + 4 + i * 17} textAnchor="middle" className="gz5-lbl gz5-sm">
          {t}
        </text>
      ))}
    </g>
  );
}

const RA = 12; // sources
const RB = 104; // institutions
const RBH = 116;
const RC = 268; // Commission
const RD = 374; // law-making strip
const RE = 446; // Court

function Plate() {
  return (
    <>
      {/* who sends whom */}
      <Pop delay={0.05}>
        <Box x={COLS[0]} y={RA} w={CW} h={50} title={["občané EU"]} lines={["volby po 5 letech"]} ty={RA + 21} />
        <Box x={COLS[1]} y={RA} w={COLS[2] + CW - COLS[1]} h={50} title={["vlády 27 členských států"]} lines={["zvolené v národních volbách"]} ty={RA + 21} />
      </Pop>
      {[0, 1, 2].map((i) => (
        <DrawArrow key={i} d={`M${cx(i)} ${RA + 52} V${RB - 4}`} tone="ink" delay={0.3 + i * 0.1} />
      ))}
      <Fade delay={0.5}>
        <text x={cx(0) + 7} y={RB - 16} className="gz5-lbl gz5-sm gz5-b">
          volí
        </text>
        <text x={cx(1) + 7} y={RB - 16} className="gz5-lbl gz5-sm">
          vysílají
        </text>
        <text x={cx(2) + 7} y={RB - 16} className="gz5-lbl gz5-sm">
          vysílají
        </text>
      </Fade>

      {/* the institutions */}
      <Pop delay={0.55}>
        <Box x={COLS[0]} y={RB} w={CW} h={RBH} lvl title={["Evropský", "parlament"]} lines={["720 poslanců", "(z Česka 21)", "schvaluje zákony"]} />
      </Pop>
      <Pop delay={0.7}>
        <Box x={COLS[1]} y={RB} w={CW} h={RBH} lvl title={["Evropská", "rada"]} lines={["hlavy států", "nebo vlád", "určuje směr EU"]} />
      </Pop>
      <Pop delay={0.85}>
        <Box x={COLS[2]} y={RB} w={CW} h={RBH} lvl title={["Rada EU"]} lines={["ministři", "27 států", "schvaluje zákony"]} ty={RB + 32} />
      </Pop>

      {/* the Commission */}
      <DrawArrow d={`M${cx(1)} ${RB + RBH + 2} V${RC - 4}`} tone="lvl" delay={1.0} />
      <DrawArrow d={`M${cx(0)} ${RB + RBH + 2} V${RC + 22} Q${cx(0)} ${RC + 36} ${cx(0) + 14} ${RC + 36} H${108}`} tone="lvl" delay={1.1} />
      <Fade delay={1.2}>
        <text x={cx(1) + 7} y={RB + RBH + 22} className="gz5-lbl gz5-sm gz5-lvl-t">
          navrhuje předsedu
        </text>
        <text x={cx(0) + 8} y={RB + RBH + 22} className="gz5-lbl gz5-sm gz5-lvl-t gz5-halo">
          volí předsedu,
        </text>
        <text x={cx(0) + 8} y={RB + RBH + 38} className="gz5-lbl gz5-sm gz5-lvl-t gz5-halo">
          schvaluje Komisi
        </text>
      </Fade>
      <Pop delay={1.2}>
        <Box x={112} y={RC} w={216} h={72} lvl title={["Evropská komise"]} lines={["27 komisařů, 1 z každého státu", "navrhuje zákony a hlídá je"]} ty={RC + 22} />
      </Pop>

      {/* how an EU law is made */}
      <Fade delay={1.5}>
        <text x={W / 2} y={RD - 8} textAnchor="middle" className="gz5-lbl gz5-sm gz5-muted-t">
          jak vzniká zákon EU
        </text>
        {[
          { x: 12, w: 112, t: ["Komise", "navrhne"], lvl: false },
          { x: 146, w: 170, t: ["Parlament a Rada EU", "schválí"], lvl: false },
          { x: 338, w: 90, t: ["zákon EU", "platí v EU"], lvl: true },
        ].map((p) => (
          <g key={p.x}>
            <rect x={p.x} y={RD} width={p.w} height={46} rx={12} className={p.lvl ? "gz5-box-lvl" : "gz5-box"} />
            <text x={p.x + p.w / 2} y={RD + 19} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
              {p.t[0]}
            </text>
            <text x={p.x + p.w / 2} y={RD + 36} textAnchor="middle" className="gz5-lbl gz5-sm">
              {p.t[1]}
            </text>
          </g>
        ))}
      </Fade>
      <DrawArrow d={`M126 ${RD + 23} H143`} tone="ink" delay={1.6} />
      <DrawArrow d={`M318 ${RD + 23} H335`} tone="ink" delay={1.7} />

      {/* the Court */}
      <Pop delay={1.8}>
        <Box x={12} y={RE} w={W - 24} h={56} title={["Soudní dvůr EU (Lucemburk)"]} lines={["vykládá právo EU a řeší spory"]} ty={RE + 23} />
      </Pop>
    </>
  );
}

export default function EuInstitutions() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={580} replay>
      <Plate />
    </Figure>
  );
}
