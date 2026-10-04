import { Fade, Figure, Arrow, f1, useClock, useFig, pat } from "./kit";

const LABEL =
  "Sarkomera, nejmenší stažitelná jednotka svalového vlákna, v uvolněném a ve staženém stavu. Sarkomeru ohraničují dvě Z-linie, od nich vybíhají ke středu tenká vlákna aktinu, uprostřed leží tlustá vlákna myozinu. Tmavý A-proužek odpovídá délce myozinu, světlý I-proužek obsahuje jen aktin a H-zóna uprostřed jen myozin. Při stahu (za přítomnosti Ca²⁺ a ATP) myozinové hlavy táhnou aktin ke středu: vlákna se po sobě posouvají, nezkracují se. Z-linie se přiblíží, I-proužek a H-zóna se zúží, A-proužek zůstává stejně dlouhý.";

const W = 500;
const H = 500;
const CX = 250;
const ACT = 120; // actin length from a Z-line
const MYO = 90; // half-length of myozin
const L0 = 172; // relaxed half-sarcomere
const L1 = 126; // contracted

function Sarc({ y, L, id }: { y: number; L: number; id: string }) {
  const zl = CX - L;
  const zr = CX + L;
  const zig = (x: number) =>
    `M${x} ${y - 40} l5 8 l-10 8 l10 8 l-10 8 l10 8 l-10 8 l10 8 l-10 8 l5 8`;
  const myoRows = [-18, 0, 18];
  const actRows = [-27, -9, 9, 27];
  return (
    <g>
      {/* A band shading */}
      <rect x={CX - MYO} y={y - 38} width={2 * MYO} height={76} className="bz4-sa-aband" />
      <rect x={CX - MYO} y={y - 38} width={2 * MYO} height={76} fill={pat(id, "d")} opacity={0.35} />
      {/* actin: from each Z-line inwards, and a stub of the neighbour outside */}
      {actRows.map((dy) => (
        <g key={dy}>
          <path d={`M${f1(zl - 36)} ${y + dy} H${f1(zl + ACT)}`} className="bz4-sa-actin" />
          <path d={`M${f1(zr + 36)} ${y + dy} H${f1(zr - ACT)}`} className="bz4-sa-actin" />
        </g>
      ))}
      {/* myozin with heads */}
      {myoRows.map((dy) => (
        <g key={dy}>
          <path d={`M${CX - MYO} ${y + dy} H${CX + MYO}`} className="bz4-sa-myo" />
          {Array.from({ length: 7 }, (_, i) => {
            const x = CX - MYO + 8 + i * 10;
            const x2 = CX + MYO - 8 - i * 10;
            return (
              <g key={i}>
                <path d={`M${x} ${y + dy - 3} l-5 -5 M${x} ${y + dy + 3} l-5 5`} className="bz4-sa-head" />
                <path d={`M${x2} ${y + dy - 3} l5 -5 M${x2} ${y + dy + 3} l5 5`} className="bz4-sa-head" />
              </g>
            );
          })}
        </g>
      ))}
      <path d={`M${CX} ${y - 34} V${y + 34}`} className="bz4-sa-m" />
      <path d={zig(zl)} className="bz4-sa-z" />
      <path d={zig(zr)} className="bz4-sa-z" />
    </g>
  );
}

function Bands({ y, L, below = false }: { y: number; L: number; below?: boolean }) {
  const zl = CX - L;
  const zr = CX + L;
  const hz = Math.max(0, L - ACT); // half of the H zone
  const s = below ? 1 : -1;
  const br = (x0: number, x1: number, yy: number, t: string, cls = "") => (
    <g>
      <path d={`M${f1(x0)} ${yy - s * 5} V${yy} H${f1(x1)} V${yy - s * 5}`} className="bz4-sa-br" />
      <text x={(x0 + x1) / 2} y={yy + (below ? 17 : -6)} textAnchor="middle" className={`bz4-lbl bz4-sm ${cls}`}>
        {t}
      </text>
    </g>
  );
  return (
    <g>
      {br(CX - MYO, CX + MYO, y + s * 50, "A-proužek", "bz4-b")}
      {br(zl, CX - MYO, y + s * 50, "I")}
      {br(CX + MYO, zr, y + s * 50, "I")}
      {hz > 4 && br(CX - hz, CX + hz, y + s * 82, "H-zóna")}
      {br(zl, zr, y + s * 114, "sarkomera")}
    </g>
  );
}

export default function Sarcomere() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={640} replay>
      <Inner />
    </Figure>
  );
}

function Inner() {
  const { id } = useFig();
  const t = useClock(2.2);
  const k = Math.min(1, Math.max(0, (t - 0.5) / 1.4));
  const ease = k * k * (3 - 2 * k);
  const L = L0 + (L1 - L0) * ease;
  const Y0 = 160;
  const Y1 = 344;
  return (
    <g>
      <text x={14} y={30} className="bz4-lbl bz4-b">uvolněná</text>
      <Bands y={Y0} L={L0} />
      <Sarc y={Y0} L={L0} id={id} />
      <line x1={14} x2={W - 14} y1={(Y0 + Y1) / 2 + 2} y2={(Y0 + Y1) / 2 + 2} className="bz4-lead bz4-dash" />
      <text x={14} y={Y1 - 52} className="bz4-lbl bz4-b bz4-lvl-t">stažená</text>
      <Sarc y={Y1} L={L} id={id} />
      <Bands y={Y1} L={L} below />
      <Fade delay={0.3}>
        <text x={W - 14} y={Y0 + 70} textAnchor="end" className="bz4-lbl bz4-sm">
          <tspan className="bz4-sa-key-a">━</tspan> aktin
        </text>
        <text x={14} y={Y0 + 70} className="bz4-lbl bz4-sm">
          <tspan className="bz4-sa-key-m">━</tspan> myozin
        </text>
        <text x={CX + L0 + 18} y={Y0 + 4} className="bz4-lbl bz4-sm bz4-b">Z</text>
        <text x={CX - L0 - 18} y={Y0 + 4} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">Z</text>
      </Fade>
      {k > 0.05 && (
        <g>
          <Arrow d={`M${CX - L - 30} ${Y1 - 46} H${CX - L + 4}`} tone="lvl" />
          <Arrow d={`M${CX + L + 30} ${Y1 - 46} H${CX + L - 4}`} tone="lvl" />
        </g>
      )}
      <text x={W / 2} y={H - 8} textAnchor="middle" className="bz4-lbl bz4-sm">
        Ca²⁺ + ATP: hlavy myozinu táhnou aktin ke středu, vlákna se nezkracují
      </text>
    </g>
  );
}
