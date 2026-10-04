import { Draw, Fade, Figure, Head, Pop } from "./kit";

const LABEL =
  "Model jádra a periferie podle Wallersteina, zjednodušeně. Jádro (USA, západní Evropa, Japonsko), semiperiferie (Čína, Brazílie, Indie, Mexiko) a periferie (například Čad, Niger, Haiti). Z periferie a semiperiferie proudí k jádru suroviny a potraviny, levná práce, migranti včetně vzdělaných lidí a zisky firem. Z jádra proudí opačně průmyslové výrobky, technologie a kapitál, tedy investice a půjčky. Jádro bohatne, protože levně nakupuje a draze prodává.";

const W = 480;
const H = 450;

const TIERS = [
  { y: 46, w: 140, name: "JÁDRO", ex: ["USA, Japonsko,", "západní Evropa"], cls: "gz7-lvl-strong" },
  { y: 160, w: 150, name: "SEMIPERIFERIE", ex: ["Čína, Brazílie,", "Indie, Mexiko"], cls: "gz7-lvl-fill" },
  { y: 274, w: 168, name: "PERIFERIE", ex: ["např. Čad, Niger,", "Haiti"], cls: "gz7-cp-per" },
];
const TH = 96;

const UP = ["suroviny", "a potraviny", "", "levná práce", "", "migranti,", "i vzdělaní", "", "zisky firem"];
const DOWN = ["průmyslové", "výrobky", "", "technologie,", "know-how", "", "kapitál:", "investice,", "půjčky"];

export default function CorePeriphery() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={600} replay>
      {TIERS.map((t, i) => (
        <Pop key={i} delay={0.1 + i * 0.12}>
          <rect x={240 - t.w / 2} y={t.y} width={t.w} height={TH} rx={10} className={`${t.cls} gz7-o`} />
          <text x={240} y={t.y + 30} textAnchor="middle" className="gz7-cp-name">
            {t.name}
          </text>
          {t.ex.map((e, k) => (
            <text key={k} x={240} y={t.y + 54 + k * 18} textAnchor="middle" className="gz7-lbl gz7-sm gz7-un-t">
              {e}
            </text>
          ))}
        </Pop>
      ))}
      {/* flows */}
      <Draw d="M146 366 V64" className="gz7-arr gz7-arr-acc gz7-cp-arr" delay={0.5} />
      <Draw d="M334 52 V354" className="gz7-arr gz7-arr-lvl gz7-cp-arr" delay={0.8} />
      <Fade delay={1.2}>
        <Head x={146} y={48} dir={-90} tone="acc" />
        <Head x={334} y={370} dir={90} tone="lvl" />
      </Fade>
      <Fade delay={1.1}>
        <text x={136} y={36} textAnchor="end" className="gz7-lbl gz7-b gz7-acc-t">
          k jádru ↑
        </text>
        {UP.map((t, i) => (
          <text key={i} x={136} y={96 + i * 22} textAnchor="end" className="gz7-lbl gz7-sm">
            {t}
          </text>
        ))}
        <text x={344} y={36} className="gz7-lbl gz7-b gz7-lvl-t">
          ↓ z jádra
        </text>
        {DOWN.map((t, i) => (
          <text key={i} x={344} y={96 + i * 22} className="gz7-lbl gz7-sm">
            {t}
          </text>
        ))}
      </Fade>
      <Fade delay={1.5}>
        <rect x={40} y={390} width={400} height={50} rx={8} className="gz7-tag-lvl" />
        <text x={240} y={410} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b">
          Jádro levně nakupuje a draze prodává, proto bohatne.
        </text>
        <text x={240} y={429} textAnchor="middle" className="gz7-lbl gz7-sm">
          Semiperiferie stojí mezi: jádru slouží, periferii vytěžuje.
        </text>
      </Fade>
    </Figure>
  );
}
