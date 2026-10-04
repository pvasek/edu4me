import { Fade, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Kolik je na Zemi vody a jaká je. Ze všeho množství, asi 1,4 miliardy km³, je 97 % slaná voda v oceánech a mořích a jen 3 % voda sladká. Ze sladké vody je asi 69 % zamrzlé v ledovcích a sněhu, asi 30 % je voda podzemní a jen asi 1 % je povrchová voda v jezerech, řekách a bažinách, vlhkost v půdě, pára ve vzduchu a voda v organismech. Kdyby se všechna voda vešla do litrové lahve, sladké by bylo 30 ml a povrchové jen asi 0,3 ml – pár kapek. Údaje USGS.";

const W = 500;
const H = 430;
const X0 = 20;
const X1 = 480;
const span = X1 - X0;

function Seg({ x, w, y, h, cls, hatch }: { x: number; w: number; y: number; h: number; cls: string; hatch?: string }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className={cls} />
      {hatch && <rect x={x} y={y} width={w} height={h} fill={pat(id, hatch)} opacity={0.6} />}
      <rect x={x} y={y} width={w} height={h} className="gz3-o gz3-thin" fill="none" />
    </g>
  );
}

function Bottle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path
        d={`M${x - 6} ${y - 70} h12 v10 q12 6 12 20 v48 q0 6 -6 6 h-24 q-6 0 -6 -6 v-48 q0 -14 12 -20 Z`}
        className="gz3-o gz3-glass"
      />
      <path d={`M${x - 15} ${y - 44} h30 v52 q0 4 -4 4 h-22 q-4 0 -4 -4 Z`} className="gz3-sea" />
      <path d={`M${x - 15} ${y - 44} h30`} className="gz3-o gz3-thin" />
    </g>
  );
}

function Plate() {
  const sea = span * 0.97;
  const ice = span * 0.69;
  const gw = span * 0.3;
  return (
    <>
      {/* all water */}
      <Fade>
        <text x={X0} y={28} className="gz3-lbl gz3-b">
          všechna voda na Zemi ≈ 1,4 mld. km³
        </text>
      </Fade>
      <Pop delay={0.1}>
        <Seg x={X0} w={sea} y={40} h={44} cls="gz3-sea" hatch="h" />
        <Seg x={X0 + sea} w={span - sea} y={40} h={44} cls="gz3-water-fresh" />
      </Pop>
      <Fade delay={0.3}>
        <text x={X0 + 14} y={67} className="gz3-lbl gz3-b gz3-halo">
          slaná voda: oceány a moře
        </text>
        <text x={X0 + sea - 12} y={67} textAnchor="end" className="gz3-eq gz3-eq-lg gz3-halo">
          97 %
        </text>
        <Lbl x={X1 - 6} y={106} anchor="end" className="gz3-b gz3-lvl-t">
          sladká voda 3 %
        </Lbl>
      </Fade>

      {/* zoom into the fresh water */}
      <Fade delay={0.5}>
        <path d={`M${X0 + sea} 84 L${X0} 150 H${X1} L${X1} 84 Z`} className="gz3-zoom" />
      </Fade>
      <Pop delay={0.6}>
        <Seg x={X0} w={ice} y={150} h={44} cls="gz3-ice" hatch="b" />
        <Seg x={X0 + ice} w={gw} y={150} h={44} cls="gz3-clay" hatch="dots" />
        <Seg x={X0 + ice + gw} w={span - ice - gw} y={150} h={44} cls="gz3-water" />
      </Pop>
      <Fade delay={0.8}>
        <text x={X0 + 12} y={177} className="gz3-lbl gz3-b gz3-halo">
          ledovce a sníh
        </text>
        <text x={X0 + ice - 10} y={177} textAnchor="end" className="gz3-eq gz3-eq-lg gz3-halo">
          ≈ 69 %
        </text>
        <text x={X0 + ice + gw / 2} y={170} textAnchor="middle" className="gz3-lbl gz3-sm gz3-b gz3-halo">
          podzemní voda
        </text>
        <text x={X0 + ice + gw / 2} y={187} textAnchor="middle" className="gz3-eq gz3-halo">
          ≈ 30 %
        </text>
        <Lbl x={X1 - 6} y={216} anchor="end" className="gz3-b gz3-blue-t">
          povrchová voda ≈ 1 %
        </Lbl>
      </Fade>

      {/* zoom into the surface water */}
      <Fade delay={1}>
        <path d={`M${X0 + ice + gw} 194 L${X0 + 60} 226 H${X1} L${X1} 194 Z`} className="gz3-zoom" />
        <rect x={X0 + 60} y={226} width={X1 - X0 - 60} height={40} rx={6} className="gz3-tag" />
        <text x={(X0 + 60 + X1) / 2} y={251} textAnchor="middle" className="gz3-lbl gz3-sm">
          jezera · bažiny · půda · vzduch · řeky · organismy
        </text>
      </Fade>

      {/* the one-litre comparison */}
      <Fade delay={1.2}>
        <path d={`M${X0} 292 H${X1}`} className="gz3-o gz3-thin gz3-dash" />
        <text x={X0} y={316} className="gz3-lbl gz3-sm gz3-muted-t">
          kdyby se všechna voda vešla do litrové lahve:
        </text>
        <Bottle x={70} y={396} />
        <text x={70} y={424} textAnchor="middle" className="gz3-eq">
          1 l
        </text>
        <path d="M150 352 h26 l-3 50 h-20 Z" className="gz3-o gz3-glass" />
        <path d="M154.5 384 h17.1 l-1.1 18 h-14.8 Z" className="gz3-water" />
        <text x={163} y={424} textAnchor="middle" className="gz3-eq">
          30 ml sladké
        </text>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${300 + k * 14} ${388 - (k % 2) * 6} q-5 7 0 10 q5 -3 0 -10 Z`} className="gz3-o gz3-water gz3-thin" />
        ))}
        <text x={314} y={424} textAnchor="middle" className="gz3-eq">
          0,3 ml povrchové
        </text>
        <text x={344} y={396} className="gz3-lbl gz3-sm">
          pár kapek!
        </text>
        <text x={X1} y={424} textAnchor="end" className="gz3-lbl gz3-sm gz3-muted-t gz3-sec">
          údaje: USGS
        </text>
      </Fade>
    </>
  );
}

export default function WaterDistribution() {
  return (
    <Figure label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
