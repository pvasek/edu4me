import { ChemText, Draw, DrawArrow, Eq, Fade, Figure, Pop, Travel } from './kit'

// enthalpy levels drawn to scale (kJ/mol → px)
const K = 0.64
const H0 = 74
const yOf = (h: number) => H0 - h * K
const Y_C = yOf(0)
const Y_CO = yOf(-110.5)
const Y_CO2 = yOf(-393.5)

export default function HessCycle() {
  const route = `M262 ${Y_C} V${Y_CO} H400 V${Y_CO2}`
  return (
    <Figure
      level={6}
      w={460}
      h={452}
      max={600}
      label="Hessův zákon na spalování uhlíku, hladiny entalpie v měřítku. Cesta 1: C + O2 → CO2 přímo, ΔH1 = −393,5 kJ/mol. Cesta 2 přes oxid uhelnatý: C + ½ O2 → CO, ΔH = −110,5 kJ/mol, potom CO + ½ O2 → CO2, ΔH2 = −283,0 kJ/mol. Obě cesty mají stejnou celkovou změnu entalpie, proto ΔH = ΔH1 − ΔH2 = −110,5 kJ/mol."
    >
      {/* axis */}
      <DrawArrow d={`M40 ${Y_CO2 + 22} V26`} tone="ink" />
      <Fade delay={0.3}>
        <text x={30} y={32} textAnchor="end" className="f67-lbl f67-b f67-big">
          H
        </text>

      </Fade>

      {/* levels */}
      <Draw d={`M60 ${Y_C} H430`} className="f67-o f67-thick" delay={0.2} />
      <Draw d={`M232 ${Y_CO} H430`} className="f67-o f67-thick" delay={0.35} />
      <Draw d={`M60 ${Y_CO2} H430`} className="f67-o f67-thick" delay={0.5} />
      <Fade delay={0.4}>
        <Eq x={64} y={Y_C - 10} t="C(s) + O_{2}(g)" className="f67-eq-lg" />
        <Eq x={426} y={Y_CO - 10} t="CO(g) + ½ O_{2}(g)" anchor="end" className="f67-eq-lg" />
        <Eq x={64} y={Y_CO2 + 22} t="CO_{2}(g)" className="f67-eq-lg" />
        <text x={426} y={Y_C - 10} textAnchor="end" className="f67-num f67-muted-t f67-sec">
          0
        </text>
        <text x={426} y={Y_CO2 + 22} textAnchor="end" className="f67-num f67-muted-t">
          −393,5 kJ/mol
        </text>
      </Fade>

      {/* route 1: straight down */}
      <DrawArrow d={`M120 ${Y_C + 4} V${Y_CO2 - 4}`} tone="ink" delay={0.9} className="f67-wide" />
      <Fade delay={1.3}>
        <text x={132} y={(Y_C + Y_CO2) / 2 - 12} className="f67-cap">
          cesta 1
        </text>
        <text x={132} y={(Y_C + Y_CO2) / 2 + 10} className="f67-lbl f67-b">
          <ChemText text="ΔH_{1} = −393,5" />
        </text>
        <text x={132} y={(Y_C + Y_CO2) / 2 + 28} className="f67-lbl f67-sm">
          kJ/mol
        </text>
      </Fade>

      {/* route 2: via CO */}
      <DrawArrow d={`M262 ${Y_C + 4} V${Y_CO - 4}`} tone="lvl" delay={1.6} className="f67-wide" />
      <DrawArrow d={`M400 ${Y_CO + 4} V${Y_CO2 - 4}`} tone="lvl" delay={2.1} className="f67-wide" />
      <Fade delay={1.9}>
        <text x={254} y={(Y_C + Y_CO) / 2 - 2} textAnchor="end" className="f67-lbl f67-b f67-lvl-t">
          ΔH = ?
        </text>
        <text x={392} y={(Y_CO + Y_CO2) / 2 - 4} textAnchor="end" className="f67-lbl f67-b f67-lvl-t">
          <ChemText text="ΔH_{2} = −283,0" />
        </text>
        <text x={392} y={(Y_CO + Y_CO2) / 2 + 14} textAnchor="end" className="f67-lbl f67-sm">
          kJ/mol
        </text>
        <text x={392} y={(Y_CO + Y_CO2) / 2 - 26} textAnchor="end" className="f67-cap f67-lvl-t">
          cesta 2
        </text>
      </Fade>
      <Fade delay={3.2}>
        <text x={254} y={(Y_C + Y_CO) / 2 + 18} textAnchor="end" className="f67-lbl f67-b f67-lvl-t">
          = −110,5 kJ/mol
        </text>
      </Fade>
      <Travel path={route} dur={4} rest={[262, Y_C]}>
        <circle r={5} className="f67-lvl-f f67-o f67-thin" />
      </Travel>

      {/* result */}
      <Pop delay={2.8}>
        <rect x={20} y={Y_CO2 + 40} width={420} height={78} rx={6} className="f67-tag-lvl" />
        <text x={230} y={Y_CO2 + 60} textAnchor="middle" className="f67-cap f67-lvl-t">
          obě cesty mají stejné ΔH
        </text>
        <Eq x={230} y={Y_CO2 + 84} t="ΔH_{1} = ΔH + ΔH_{2}" anchor="middle" className="f67-eq-lg" />
        <Eq x={230} y={Y_CO2 + 106} t="ΔH = −393,5 − (−283,0) = −110,5 kJ/mol" anchor="middle" className="f67-eq-lg" />
      </Pop>
    </Figure>
  )
}
