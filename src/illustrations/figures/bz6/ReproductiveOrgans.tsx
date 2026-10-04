import { Frame, Lbl, Plates, Travel, pat, useFig, useLive } from "./kit";

const LABEL =
  "Pohlavní soustava ženy a muže jako učebnicové schéma. Žena, pohled zepředu: dva vaječníky, v nichž dozrávají vajíčka, vejcovody s třásnitými konci, které vajíčko zachytí a vedou do dělohy, svalnatá děloha s děložní dutinou, děložní hrdlo a pochva. Muž, pohled z boku v řezu: varle v šourku tvoří spermie, ty dozrávají v nadvarleti a chámovodem putují kolem močového měchýře k semennému váčku a prostatě, kde se k nim přidají tekutiny; ven je vyvádí močová trubice v penisu.";

function Female() {
  const { id } = useFig();
  const live = useLive();
  const uterus =
    "M118 100 C116 78 204 78 202 100 C202 140 186 166 178 184 L174 206 L146 206 L142 184 C134 166 118 140 118 100Z";
  const tubeL = "M122 96 C100 88 82 80 66 88 C52 96 46 110 52 120";
  const tubeR = "M198 96 C220 88 238 80 254 88 C268 96 274 110 268 120";
  const fimb = (x: number, y: number, s: 1 | -1) =>
    [0, 1, 2, 3].map((k) => (
      <path
        key={k}
        d={`M${x} ${y} l${s * (-8 + k * 5)} ${8 + (k % 2) * 3}`}
        className="bz6-fimb"
      />
    ));
  return (
    <Frame w={320} h={296} title="žena – pohled zepředu">
      {/* ovarian ligaments */}
      <path d="M126 112 C110 124 96 130 88 132 M194 112 C210 124 224 130 232 132" className="bz6-o bz6-thin bz6-dash" />
      {/* uterine tubes */}
      {[tubeL, tubeR].map((d) => (
        <g key={d}>
          <path d={d} className="bz6-tube-edge" />
          <path d={d} className="bz6-tube-f" />
        </g>
      ))}
      {fimb(52, 120, 1)}
      {fimb(268, 120, -1)}
      {/* ovaries with follicles */}
      {[70, 250].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={138} rx={20} ry={12} className="bz6-o bz6-ovary" />
          <circle cx={x - 7} cy={136} r={3.2} className="bz6-o bz6-hair bz6-paper-f" />
          <circle cx={x + 6} cy={140} r={4.6} className="bz6-o bz6-hair bz6-paper-f" />
          <circle cx={x + 6} cy={140} r={1.4} className="bz6-egg-dot" />
        </g>
      ))}
      {/* uterus, cavity, cervix, vagina */}
      <path d="M146 206 L140 276 Q160 284 180 276 L174 206Z" className="bz6-o bz6-vagina" />
      <path d="M152 210 L150 274 M168 210 L170 274" className="bz6-o bz6-hair" />
      <path d={uterus} className="bz6-o bz6-uterus" />
      <path d={uterus} fill={pat(id, "d")} opacity={0.4} />
      <path d="M134 102 C150 98 170 98 186 102 L164 168 L156 168Z" className="bz6-o bz6-thin bz6-cavity" />
      <path d="M158 168 L158 206 M162 168 L162 206" className="bz6-o bz6-hair" />
      {/* an egg cell travelling along the left tube towards the uterus */}
      <Travel path="M56 112 C54 98 70 84 90 86 C104 88 114 94 124 98" dur={5} rest={[90, 86]} fade={live}>
        <circle r={4} className="bz6-o bz6-thin bz6-egg" />
      </Travel>
      <Lbl x={8} y={48} tx={88} ty={84} className="bz6-b">
        vejcovod
      </Lbl>
      <Lbl x={8} y={182} tx={64} ty={146} className="bz6-b">
        vaječník
      </Lbl>
      <Lbl x={312} y={48} tx={194} ty={104} anchor="end" className="bz6-b">
        děloha
      </Lbl>
      <Lbl x={312} y={200} tx={174} ty={196} anchor="end" className="bz6-sm">
        děložní hrdlo
      </Lbl>
      <Lbl x={312} y={262} tx={178} ty={250} anchor="end" className="bz6-b">
        pochva
      </Lbl>
    </Frame>
  );
}

function Male() {
  const { id } = useFig();
  const penis = "M164 166 C140 176 118 204 106 240";
  return (
    <Frame w={340} h={312} title="muž – pohled z boku v řezu">
      {/* pubic bone for orientation */}
      <ellipse cx={128} cy={128} rx={11} ry={24} transform="rotate(-18 128 128)" className="bz6-o bz6-bone" />
      <ellipse cx={128} cy={128} rx={11} ry={24} transform="rotate(-18 128 128)" fill={pat(id, "x")} opacity={0.5} />
      {/* bladder */}
      <ellipse cx={188} cy={92} rx={40} ry={34} className="bz6-o bz6-bladder" />
      <ellipse cx={188} cy={92} rx={40} ry={34} fill={pat(id, "h")} opacity={0.5} />
      {/* seminal vesicle and prostate */}
      <path
        d="M226 96 C242 92 250 108 244 120 C252 128 244 140 232 138 C222 142 212 136 214 128 C206 118 214 102 226 96Z"
        className="bz6-o bz6-vesicle"
      />
      <ellipse cx={186} cy={142} rx={21} ry={14} className="bz6-o bz6-prostate" />
      {/* scrotum, testis, epididymis */}
      <ellipse cx={178} cy={252} rx={33} ry={36} className="bz6-o bz6-scrotum" />
      <ellipse cx={176} cy={256} rx={16} ry={21} className="bz6-o bz6-testis" />
      <ellipse cx={176} cy={256} rx={16} ry={21} fill={pat(id, "b")} opacity={0.4} />
      <path d="M186 232 C202 238 204 268 186 278" className="bz6-epid" />
      {/* vas deferens: from the epididymis up in front of the pubic bone, over the bladder, down behind it */}
      <path
        d="M190 232 C178 206 122 198 110 168 C100 130 116 62 158 50 C196 38 238 50 236 84 C236 106 220 122 202 136"
        className="bz6-vas"
      />
      {/* penis with the urethra inside */}
      <path d={penis} className="bz6-penis-edge" />
      <path d={penis} className="bz6-penis" />
      <ellipse cx={102} cy={252} rx={14} ry={12} transform="rotate(-30 102 252)" className="bz6-o bz6-glans" />
      {/* urethra: bladder → prostate → penis */}
      <path d="M186 124 L186 150 C186 162 176 166 164 168 C140 176 118 204 104 246" className="bz6-urethra" />
      <Lbl x={332} y={26} tx={206} ty={64} anchor="end" className="bz6-b">
        močový měchýř
      </Lbl>
      <Lbl x={8} y={34} tx={128} ty={58} className="bz6-b bz6-lvl-t">
        chámovod
      </Lbl>
      <Lbl x={332} y={158} tx={240} ty={134} anchor="end" className="bz6-sm">
        semenný váček
      </Lbl>
      <Lbl x={332} y={194} tx={200} ty={150} anchor="end" className="bz6-sm">
        prostata
      </Lbl>
      <Lbl x={8} y={120} tx={118} ty={130} className="bz6-sm" sec>
        stydká kost
      </Lbl>
      <Lbl x={8} y={170} tx={130} ty={184} className="bz6-sm">
        močová trubice
      </Lbl>
      <Lbl x={8} y={222} tx={114} ty={224} className="bz6-b">
        penis
      </Lbl>
      <Lbl x={332} y={232} tx={200} ty={252} anchor="end" className="bz6-sm">
        nadvarle
      </Lbl>
      <Lbl x={332} y={276} tx={180} ty={262} anchor="end" className="bz6-b">
        varle
      </Lbl>
      <Lbl x={8} y={296} tx={158} ty={282} className="bz6-sm">
        šourek
      </Lbl>
    </Frame>
  );
}

export default function ReproductiveOrgans() {
  return (
    <Plates label={LABEL} level={6} max={780} cols="1fr 1fr" stackBelow={600}>
      <Female />
      <Male />
    </Plates>
  );
}
