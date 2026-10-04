import { useId, type ReactNode } from "react";
import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, Lbl, StripBox } from "./kit";
import { SHAPES } from "./shapes";

const LABEL =
  "Tvary států a jejich důsledky, skutečné obrysy z Natural Earth. Kompaktní stát (Polsko): hranice jsou od středu všude zhruba stejně daleko, správa i obrana jsou snadné. Protáhlý stát (Chile): přes 4 000 km dlouhý a v průměru jen kolem 180 km široký, sever a jih se těžko propojují. Fragmentovaný stát (Indonésie): tisíce ostrovů, drahá doprava a správa, sklon k odtržení. Perforovaný stát (Jihoafrická republika): uvnitř leží jiný stát, Lesotho. Stát s výběžkem (Thajsko): úzký výběžek na Malajský poloostrov.";

const W = 220;
const H = 222;
const BOX = { x: 10, y: 8, w: 200, h: 182 };

type Key = keyof typeof SHAPES;

function Panel({
  k,
  bar,
  children,
}: {
  k: Key;
  /** scale bar length in km */
  bar: number;
  children?: (o: { x: number; y: number }) => ReactNode;
}) {
  const s = SHAPES[k];
  const clip = "gz7c" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ox = BOX.x + (BOX.w - s.w) / 2;
  const oy = BOX.y + (BOX.h - s.h) / 2;
  const len = bar / s.km;
  const hole = "hole" in s ? s.hole : undefined;
  return (
    <Frame w={W} h={H} className="gz7-small">
      <defs>
        <clipPath id={clip}>
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={6} />
        </clipPath>
      </defs>
      <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={6} className="gz7-sea" />
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(${ox} ${oy})`}>
          <path d={s.others} className="gz7-other gz7-o gz7-thin" />
          <path d={s.main} className="gz7-state gz7-o gz7-shape" />
          {hole && <path d={hole} className="gz7-state3 gz7-o gz7-thin" />}
        </g>
      </g>
      <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={6} className="gz7-o gz7-thin" fill="none" />
      {children?.({ x: ox, y: oy })}
      {/* scale bar */}
      <path d={`M${BOX.x + 4} ${H - 12} h${len.toFixed(1)} M${BOX.x + 4} ${H - 16} v8 M${(BOX.x + 4 + len).toFixed(1)} ${H - 16} v8`} className="gz7-scale" />
      <text x={BOX.x + 10 + len} y={H - 7} className="gz7-scale-t">
        {bar.toLocaleString("cs-CZ").replace(/\s/g, " ")} km
      </text>
    </Frame>
  );
}

const P = (k: Key, n: string) => {
  const pts = SHAPES[k].pts as Record<string, readonly number[]>;
  return pts[n];
};

export default function StateShapes() {
  return (
    <Figure level={11} label={LABEL} max={860} interactive boost={false}>
      <StripBox label={LABEL} note="Obrysy: Natural Earth (1 : 50 000 000); každý stát v jiném měřítku – viz měřítko pod ním.">
        <StepStrip
          min={180}
          phoneColumns={2}
          steps={[
            {
              title: "Kompaktní – Polsko",
              art: (
                <Panel k="pol" bar={200}>
                  {({ x, y }) => (
                    <text x={x + P("pol", "label")[0]} y={y + P("pol", "label")[1]} textAnchor="middle" className="gz7-lbl gz7-b gz7-halo">
                      Polsko
                    </text>
                  )}
                </Panel>
              ),
              caption: "Hranice jsou od středu všude zhruba stejně daleko: snadná správa, doprava i obrana.",
            },
            {
              title: "Protáhlý – Chile",
              art: (
                <Panel k="chl" bar={1000}>
                  {({ x, y }) => (
                    <Lbl x={x + 70} y={y + 60} tx={x + P("chl", "a")[0]} ty={y + P("chl", "a")[1]} className="gz7-b gz7-halo">
                      Chile
                    </Lbl>
                  )}
                </Panel>
              ),
              caption: "Asi 4 300 km dlouhé, v průměru jen kolem 180 km široké: sever a jih se těžko propojují.",
            },
            {
              title: "Fragmentovaný – Indonésie",
              art: (
                <Panel k="idn" bar={1000}>
                  {({ y }) => (
                    <text x={110} y={y + SHAPES.idn.h + 28} textAnchor="middle" className="gz7-lbl gz7-b">
                      Indonésie
                    </text>
                  )}
                </Panel>
              ),
              caption: "Přes 17 000 ostrovů: drahá doprava i správa, sklon k odtržení (Východní Timor je samostatný od roku 2002).",
            },
            {
              title: "Perforovaný – JAR",
              art: (
                <Panel k="zaf" bar={500}>
                  {({ x, y }) => (
                    <>
                      <text x={x + P("zaf", "label")[0]} y={y + P("zaf", "label")[1]} textAnchor="middle" className="gz7-lbl gz7-b gz7-halo">
                        JAR
                      </text>
                      <Lbl x={x + 150} y={y + 150} tx={x + P("zaf", "lso")[0]} ty={y + P("zaf", "lso")[1]} anchor="middle" className="gz7-sm gz7-b gz7-teal-t gz7-halo">
                        Lesotho
                      </Lbl>
                    </>
                  )}
                </Panel>
              ),
              caption: "Uvnitř leží jiný stát: Lesotho je ze všech stran obklopené JAR a závisí na ní (práce, doprava, prodej vody).",
            },
            {
              title: "S výběžkem – Thajsko",
              art: (
                <Panel k="tha" bar={500}>
                  {({ x, y }) => (
                    <>
                      <text x={x + P("tha", "label")[0]} y={y + P("tha", "label")[1]} textAnchor="middle" className="gz7-lbl gz7-b gz7-halo">
                        Thajsko
                      </text>
                      <Lbl x={16} y={y + 150} tx={x + P("tha", "neck")[0] + 2} ty={y + P("tha", "neck")[1]} className="gz7-sm gz7-b gz7-lvl-t gz7-halo">
                        výběžek
                      </Lbl>
                    </>
                  )}
                </Panel>
              ),
              caption: "Výběžek na Malajský poloostrov dává přístup ke dvěma mořím, ale je daleko od Bangkoku; na jihu působí separatisté.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
