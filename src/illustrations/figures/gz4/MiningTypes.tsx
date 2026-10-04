import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, Lbl, Person, Tree, pat, useFig } from "./kit";

const LABEL =
  "Povrchová a hlubinná těžba v řezu a rekultivace. Při povrchové těžbě leží uhelná sloj mělko: rypadla odkryjí skrývku a odvezou ji na výsypku, lom má schody zvané etáže. Tak se těží hnědé uhlí v Mostecké pánvi. Při hlubinné těžbě vede k hluboké sloji svislá jáma s těžní věží a od ní vodorovné chodby, tak se těžilo černé uhlí na Ostravsku a Karvinsku. Po těžbě přichází rekultivace: zatopením lomu Ležáky vodou z Ohře vzniklo v letech 2008–2014 jezero Most.";

const W = 300;
const H = 184;
const TOP = 52; // ground surface
// open pit: stepped benches down to the seam
const PIT = "M58 52 L74 52 L80 70 L96 70 L102 88 L118 88 L124 106 L206 106 L212 88 L226 88 L232 70 L246 70 L252 52";

function Layers({ seamY, seamH }: { seamY: number; seamH: number }) {
  const { id } = useFig();
  return (
    <>
      <rect x={4} y={TOP} width={W - 8} height={H - TOP - 4} className="gz4-soil" />
      <rect x={4} y={TOP} width={W - 8} height={H - TOP - 4} fill={pat(id, "dots")} opacity={0.6} />
      <rect x={4} y={seamY} width={W - 8} height={seamH} className="gz4-coal" />
      <rect x={4} y={seamY + seamH} width={W - 8} height={H - seamY - seamH - 4} className="gz4-rock" />
      <rect x={4} y={seamY + seamH} width={W - 8} height={H - seamY - seamH - 4} fill={pat(id, "brick")} opacity={0.6} />
      <path d={`M4 ${seamY} H${W - 4} M4 ${seamY + seamH} H${W - 4}`} className="gz4-o gz4-thin" />
    </>
  );
}

function Sky() {
  return <rect x={4} y={4} width={W - 8} height={TOP - 4} className="gz4-mt-sky" />;
}

function Excavator({ x, y }: { x: number; y: number }) {
  // bucket-wheel excavator on a bench
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-14 0 H14 V-6 H-14 Z" className="gz4-coal gz4-o gz4-thin" />
      <path d="M-10 -6 V-16 H8 V-6" className="gz4-mt-machine gz4-o gz4-thin" />
      <path d="M-2 -16 L-30 -4 M-2 -16 L4 -30 L20 -12" className="gz4-o" />
      <circle cx={-32} cy={-2} r={7} className="gz4-mt-machine gz4-o gz4-thin" />
      <path d="M-32 -9 V5 M-39 -2 H-25" className="gz4-o gz4-thin" />
    </g>
  );
}

function OpenPit() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <Sky />
      <Layers seamY={106} seamH={22} />
      {/* the pit itself is air */}
      <path d={`${PIT} Z`} className="gz4-mt-sky" />
      <path d={PIT} className="gz4-o" />
      {/* spoil heap (výsypka) */}
      <path d="M252 52 Q270 26 292 34 V52 Z" className="gz4-soil" />
      <path d="M252 52 Q270 26 292 34 V52 Z" fill={pat(id, "dots")} />
      <path d="M252 52 Q270 26 292 34" className="gz4-o" />
      <path d="M8 52 H58 M252 52 H296" className="gz4-o" />
      <Excavator x={164} y={106} />
      <Lbl x={10} y={22} className="gz4-sm gz4-b">
        etáže lomu
      </Lbl>
      <path d="M70 26 L88 64" className="gz4-lead" />
      <Lbl x={290} y={20} anchor="end" className="gz4-sm">
        výsypka
      </Lbl>
      <Lbl x={10} y={78} className="gz4-sm gz4-b gz4-halo">
        skrývka
      </Lbl>
      <Lbl x={10} y={121} className="gz4-sm gz4-b gz4-light-t">
        sloj
      </Lbl>
      <Lbl x={164} y={148} anchor="middle" className="gz4-sm gz4-halo">
        rypadlo ↑
      </Lbl>
    </Frame>
  );
}

function DeepMine() {
  return (
    <Frame w={W} h={H}>
      <Sky />
      <Layers seamY={150} seamH={14} />
      <path d={`M4 ${TOP} H${W - 4}`} className="gz4-o" />
      {/* headframe over the shaft */}
      <path d="M70 52 L80 14 L90 52 M74 36 H86 M76 26 H84" className="gz4-o" />
      <circle cx={80} cy={14} r={5} className="gz4-fill gz4-o gz4-thin" />
      <path d="M96 52 V34 H128 V52" className="gz4-city gz4-o gz4-thin" />
      {/* shaft and galleries */}
      <rect x={74} y={52} width={12} height={112} className="gz4-mt-sky gz4-o gz4-thin" />
      <path d="M86 150 H262 V164 H86" className="gz4-mt-sky" />
      <path d="M86 150 H262 V164 H86" className="gz4-o gz4-thin" />
      <path d="M86 100 H150 V110 H86" className="gz4-mt-sky gz4-o gz4-thin" />
      <rect x={76} y={112} width={8} height={10} className="gz4-mt-machine gz4-o gz4-thin" />
      <Person x={200} y={164} s={0.75} />
      <Person x={226} y={164} s={0.75} />
      <Lbl x={100} y={26} className="gz4-sm gz4-b">
        těžní věž
      </Lbl>
      <Lbl x={160} y={86} className="gz4-sm gz4-halo" tx={88} ty={84}>
        jáma
      </Lbl>
      <Lbl x={156} y={109} className="gz4-sm gz4-halo">
        chodba
      </Lbl>
      <Lbl x={290} y={144} anchor="end" className="gz4-sm gz4-b gz4-halo">
        sloj stovky m hluboko
      </Lbl>
    </Frame>
  );
}

function Reclaimed() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H}>
      <Sky />
      <Layers seamY={150} seamH={0} />
      {/* the old pit, now a lake */}
      <path d={`${PIT} Z`} className="gz4-mt-sky" />
      <path d="M77.3 62 H248.7 L246 70 L232 70 L226 88 L212 88 L206 106 L124 106 L118 88 L102 88 L96 70 L80 70 Z" className="gz4-sea" />
      <path d="M77.3 62 H248.7 L246 70 L232 70 L226 88 L212 88 L206 106 L124 106 L118 88 L102 88 L96 70 L80 70 Z" fill={pat(id, "h")} opacity={0.6} />
      <path d={PIT} className="gz4-o" />
      <path d="M77.3 62 H248.7" className="gz4-mt-water" />
      {/* reforested heap */}
      <path d="M252 52 Q270 26 292 34 V52 Z" className="gz4-grass" />
      <path d="M252 52 Q270 26 292 34" className="gz4-o" />
      <path d="M8 52 H58 M252 52 H296" className="gz4-o" />
      {[264, 276, 286].map((x, i) => (
        <Tree key={x} x={x} y={44 - i * 3} s={0.7} />
      ))}
      {[16, 30, 44].map((x) => (
        <Tree key={x} x={x} y={52} s={0.8} />
      ))}
      {/* sailboat */}
      <path d="M150 62 h22 l-4 5 h-14 Z" className="gz4-fill gz4-o gz4-thin" />
      <path d="M161 60 V36 L176 58 Z" className="gz4-fill gz4-o gz4-thin" />
      <Lbl x={165} y={88} anchor="middle" className="gz4-b">
        jezero Most
      </Lbl>
      <Lbl x={165} y={126} anchor="middle" className="gz4-sm gz4-halo">
        hloubka až 75 m
      </Lbl>
      <Lbl x={290} y={20} anchor="end" className="gz4-sm">
        zalesněná výsypka
      </Lbl>
    </Frame>
  );
}

export default function MiningTypes() {
  return (
    <Figure level={6} label={LABEL} max={1000} interactive boost={false}>
      <div className="gz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={270}
          steps={[
            {
              title: "Povrchová těžba",
              art: <OpenPit />,
              caption: "Sloj je mělko: skrývka se odveze na výsypku. Hnědé uhlí v Mostecké pánvi.",
            },
            {
              title: "Hlubinná těžba",
              art: <DeepMine />,
              caption: "K hluboké sloji vede jáma a chodby. Černé uhlí na Ostravsku a Karvinsku.",
            },
            {
              title: "Rekultivace",
              art: <Reclaimed />,
              caption: "Lom Ležáky zatopila v letech 2008–2014 voda z Ohře: vzniklo jezero Most (≐ 3 km²).",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
