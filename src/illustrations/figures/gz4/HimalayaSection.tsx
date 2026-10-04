import { DrawArrow, Fade, Figure, Rise, f1, pat, useCompact, useFig } from "./kit";

const LABEL =
  "Řez srážkou Indie s Asií od jihu k severu. Indická deska se posouvá k severu asi o 5 cm za rok a podsouvá se pod euroasijskou desku. Zemská kůra se tím vrásní a zdvojuje: vyrostl Himálaj s Mount Everestem (8 849 m) a za ním Tibetská náhorní plošina ve výšce kolem 4 500 m. Jižně leží Gangská nížina. Srážka začala asi před 50 miliony let a hory rostou dodnes.";

const W = 680;
const H = 352;
// elevation: sea level at y = 140, 10 px per km (vertical exaggeration)
const SEA = 140;
const ey = (km: number) => SEA - km * 10;

const TOPO: [number, number][] = [
  [12, 0.2], [190, 0.3], [212, 0.8], [226, 0.5], [244, 1.4], [262, 1.1], [286, 3], [304, 2.4], [326, 6.2], [338, 5.4], [352, 8.85],
  [366, 6.8], [378, 7.6], [396, 5.6], [420, 5.0], [470, 4.7], [520, 5.0], [570, 4.6], [620, 4.9], [668, 4.7],
];
const topo = TOPO.map(([x, km]) => `${x} ${f1(ey(km))}`).join(" L");
// the boundary between the plates (Indian plate dips under Eurasia)
const FAULT = `M220 ${f1(ey(0.4))} C300 150 420 190 668 236`;
const MOHO_IN = "M12 214 C220 220 420 270 668 320";

export default function HimalayaSection() {
  const compact = useCompact();
  const n = compact.narrow;
  return (
    <Figure level={7} label={LABEL} w={n ? 460 : W} h={H} x0={n ? 196 : 0} max={720} compact={compact} replay>
      <Plate n={n} />
    </Figure>
  );
}

function Plate({ n }: { n: boolean }) {
  const { id } = useFig();
  const xl = n ? 200 : 12; // left edge of the visible area
  const surface = `M12 ${f1(ey(0.2))} L${topo}`;
  // Eurasian crust: between the surface (from the fault outcrop) and the fault
  const eur = `M220 ${f1(ey(0.4))} L${TOPO.filter(([x]) => x > 226).map(([x, km]) => `${x} ${f1(ey(km))}`).join(" L")} L668 236 C420 190 300 150 220 ${f1(ey(0.4))} Z`;
  // Indian crust: from the plain down to its Moho, under the fault
  const ind = `M12 ${f1(ey(0.2))} L190 ${f1(ey(0.3))} L212 ${f1(ey(0.8))} L220 ${f1(ey(0.4))} C300 150 420 190 668 236 L668 320 C420 270 220 220 12 214 Z`;
  // folds in the Himalaya
  const folds = [0, 1, 2, 3].map(
    (i) => `M${250 + i * 10} ${f1(ey(0.5) - i * 2)} Q${300 + i * 6} ${f1(ey(5) - i * 6)} ${360 + i * 4} ${f1(ey(4.5) + 30 - i * 4)}`,
  );
  return (
    <>
      {/* sky and mantle */}
      <rect x={xl - 8} y={0} width={680 - xl + 8} height={H} className="gz4-mt-sky" />
      <path d={`M12 214 C220 220 420 270 668 320 L668 ${H - 4} H12 Z`} className="gz4-mantle" />
      <path d={`M12 214 C220 220 420 270 668 320 L668 ${H - 4} H12 Z`} fill={pat(id, "dots")} opacity={0.5} />
      <path d={ind} className="gz4-crust" />
      <path d={ind} fill={pat(id, "d")} opacity={0.5} />
      <Rise delay={0.2}>
        <path d={eur} className="gz4-crust2" />
        <path d={eur} fill={pat(id, "b")} opacity={0.5} />
        {folds.map((d, i) => (
          <path key={i} d={d} className="gz4-o gz4-thin" style={{ opacity: 0.55 }} />
        ))}
        {/* snow caps */}
        <path d={`M318 ${f1(ey(5.4))} L326 ${f1(ey(6.2))} L338 ${f1(ey(5.4))} L352 ${f1(ey(8.85))} L366 ${f1(ey(6.8))} L378 ${f1(ey(7.6))} L388 ${f1(ey(6.4))} L370 ${f1(ey(6.4))} L352 ${f1(ey(7.2))} Z`} className="gz4-snow gz4-o gz4-thin" />
        <path d={surface} className="gz4-o" />
      </Rise>
      <path d={MOHO_IN} className="gz4-o" />
      <path d={FAULT} className="gz4-o" style={{ strokeWidth: 2 }} />

      {/* motion: India pushes north and dives under Eurasia */}
      <DrawArrow d="M60 176 H180" tone="lvl" className="gz4-vec" delay={0.4} />
      <DrawArrow d="M300 192 Q390 214 470 236" tone="lvl" delay={0.8} />
      {[338, 352, 366].map((x, i) => (
        <DrawArrow key={x} d={`M${x} ${f1(ey(9.6))} V${f1(ey(11.4))}`} tone="red" delay={1 + i * 0.1} />
      ))}

      <Fade delay={0.6}>
        <text x={n ? 206 : 22} y={n ? 204 : 166} className="gz4-lbl gz4-b gz4-big">
          indická deska
        </text>
        {!n && (
          <text x={60} y={196} className="gz4-lbl gz4-sm gz4-lvl-t gz4-b">
            ≈ 5 cm za rok k severu
          </text>
        )}
        {n && (
          <text x={206} y={222} className="gz4-lbl gz4-sm gz4-lvl-t gz4-b">
            ≈ 5 cm/rok k severu
          </text>
        )}
        <text x={650} y={176} textAnchor="end" className="gz4-lbl gz4-b gz4-big">
          euroasijská deska
        </text>
        <text x={n ? 420 : 300} y={n ? 300 : 280} className="gz4-lbl gz4-b gz4-muted-t">
          zemský plášť
        </text>
        <text x={480} y={226} textAnchor="end" className="gz4-lbl gz4-sm gz4-halo">
          podsouvání
        </text>
        {/* surface names */}
        {!n && (
          <text x={100} y={ey(0.3) - 10} textAnchor="middle" className="gz4-lbl gz4-sm gz4-b">
            Gangská nížina
          </text>
        )}
        <text x={352} y={14} textAnchor="middle" className="gz4-lbl gz4-b">
          Himálaj · Mount Everest 8 849 m
        </text>
        <text x={560} y={ey(5) - 12} textAnchor="middle" className="gz4-lbl gz4-sm gz4-b">
          Tibetská náhorní plošina
        </text>
        <text x={560} y={ey(5) + 18} textAnchor="middle" className="gz4-lbl gz4-sm">
          ≈ 4 500 m n. m.
        </text>
        <text x={n ? 206 : 22} y={H - 12} className="gz4-lbl gz4-sm gz4-muted-t">
          {n ? "J ← → S · výšky zveličeny" : "jih ← → sever · srážka začala před ≈ 50 mil. let · výšky zveličeny"}
        </text>
      </Fade>
    </>
  );
}
