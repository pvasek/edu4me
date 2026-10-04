import { Fade, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Amniotické vajíčko plazů a ptáků v řezu. Na povrchu je pórovitá skořápka, kterou prochází vzduch, ale voda se neodpaří; na tupém konci je vzduchová komůrka. Pod skořápkou je blána chorion, uvnitř bílek se zásobou vody. Zárodek leží v amnionu, váčku s plodovou vodou, takže se vyvíjí jako ve vlastním malém rybníčku. Pod ním je velký žloutkový váček se zásobou živin, který zárodek vyživuje krevními cévami. Alantois je váček na odpadní látky a přes skořápku jím zárodek dýchá.";

function Egg() {
  const { id } = useFig();
  return (
    <>
      {/* shell */}
      <ellipse cx={226} cy={168} rx={152} ry={116} className="bz2-o bz2-eggshell" style={{ strokeWidth: 2.2 }} />
      <ellipse cx={226} cy={168} rx={152} ry={116} fill={pat(id, "dots")} />
      <ellipse cx={226} cy={168} rx={143} ry={107} className="bz2-o bz2-albumen" />
      {/* air cell at the blunt end */}
      <path d="M100 112 Q124 168 100 224 Q84 198 84 168 Q84 138 100 112Z" className="bz2-o bz2-thin bz2-paper-f" />
      {/* chorion just under the shell */}
      <ellipse cx={230} cy={168} rx={136} ry={101} className="bz2-o bz2-thin bz2-dash" fill="none" />
      <Pop delay={0.2}>
        {/* yolk sac with blood vessels */}
        <ellipse cx={232} cy={206} rx={86} ry={58} className="bz2-o bz2-yolk" />
        <ellipse cx={232} cy={206} rx={86} ry={58} fill={pat(id, "d")} opacity={0.5} />
        <path d="M206 162 Q190 196 160 206 M214 166 Q222 210 196 246 M226 166 Q262 194 290 186 M224 168 Q260 226 300 222" className="bz2-vessel" />
      </Pop>
      <Pop delay={0.45}>
        {/* allantois */}
        <path d="M262 92 Q312 70 340 106 Q350 140 312 150 Q282 150 268 128Z" className="bz2-o bz2-allantois" />
        <path d="M262 92 Q312 70 340 106 Q350 140 312 150 Q282 150 268 128Z" fill={pat(id, "b")} opacity={0.6} />
      </Pop>
      <Pop delay={0.7}>
        {/* amnion with the embryo */}
        <ellipse cx={210} cy={124} rx={58} ry={42} className="bz2-o bz2-water" />
        <path
          d="M178 130 Q172 104 192 94 Q212 86 222 100 Q238 96 244 112 Q250 132 232 144 Q218 152 204 146 Q196 156 186 150 Q176 144 178 130Z"
          className="bz2-o bz2-embryo"
        />
        <circle cx={198} cy={106} r={4} className="bz2-ink-f" />
        <path d="M232 144 Q236 152 228 158" className="bz2-o" />
        <path d="M212 148 Q216 160 218 166" className="bz2-vessel" />
      </Pop>
      <Fade delay={0.9}>
        <Lbl x={20} y={24} tx={100} ty={70} className="bz2-b">skořápka</Lbl>
        <Lbl x={6} y={300} tx={94} ty={196} className="bz2-sm">vzduchová komůrka</Lbl>
        <Lbl x={240} y={316} tx={160} ty={262} className="bz2-sm">bílek (voda)</Lbl>
        <Lbl x={350} y={300} tx={340} ty={232} className="bz2-sm" sec>chorion</Lbl>
        <Lbl x={140} y={24} tx={172} ty={92} className="bz2-b">amnion</Lbl>
        <Lbl x={140} y={44} className="bz2-sm bz2-muted-t" sec>plodová voda</Lbl>
        <Lbl x={316} y={30} tx={306} ty={84} className="bz2-b bz2-lvl-t">alantois</Lbl>
        <Lbl x={316} y={50} className="bz2-sm bz2-muted-t" sec>odpad, dýchání</Lbl>
        <Lbl x={436} y={178} tx={240} ty={124} anchor="end" lx={384} ly={172} className="bz2-b">zárodek</Lbl>
        <Lbl x={436} y={262} tx={290} ty={226} anchor="end" lx={392} ly={256} className="bz2-b">žloutek</Lbl>
        <Lbl x={436} y={280} anchor="end" className="bz2-sm bz2-muted-t" sec>živiny</Lbl>
      </Fade>
    </>
  );
}

export default function AmnioticEgg() {
  return (
    <Figure level={5} label={LABEL} w={440} h={330} max={620} replay>
      <Egg />
    </Figure>
  );
}
