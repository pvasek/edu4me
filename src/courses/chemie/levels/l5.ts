import type { LevelContent, Lesson, Question } from '../../../core/types'

/* ------------------------------------------------------------------ */
/* l5-1 Kyseliny a jejich názvosloví                                   */
/* ------------------------------------------------------------------ */

const l51: Lesson = {
  id: 'l5-1',
  title: 'Kyseliny a jejich názvosloví',
  goals: [
    'Vysvětlit, co je kyselina podle Arrhenia, a zapsat postupnou disociaci vícesytné kyseliny',
    'Pojmenovat bezkyslíkaté i kyslíkaté kyseliny a odvodit jejich vzorce z názvu',
    'Zapsat typické reakce kyselin s kovy, oxidy kovů a uhličitany',
    'Bezpečně ředit kyseliny a vysvětlit, jak vznikají kyselé deště',
  ],
  hook: 'Citron, ocet, cola i tvůj žaludek mají něco společného: kyselinu. Ta v žaludku by pomalu rozpustila i železný hřebík, jiná zase dělá bublinky v limonádě. Jak je poznat a jak se jim říká?',
  sections: [
    {
      title: 'Co dělá kyselinu kyselinou',
      icon: 'lemon',
      blocks: [
        { type: 'p', text: 'Ocet, citron a žaludeční šťávu na první pohled nic nespojuje. Přesto mají všechny kyseliny čtyři společné znaky, podle kterých je poznáš:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'lemon', title: 'Chutnají kysele', text: 'ocet, citron, šťovík… V laboratoři ale nikdy nic neochutnávej!' },
            { icon: 'cabbage', title: 'Mění barvu indikátorů', text: 'výluh z červeného zelí zčervená' },
            { icon: 'gas-cloud', title: 'S neušlechtilými kovy uvolňují vodík', text: 'zinek nebo železo -> bublinky $H2$' },
            { icon: 'bulb', title: 'Vedou elektrický proud', text: 'jejich vodné roztoky obsahují ionty' },
          ],
        },
        {
          type: 'p',
          text: 'Proč se chovají tak podobně? Podle švédského chemika Svante **Arrhenia** ==kyselina je látka, která ve vodě uvolňuje vodíkové kationty $H^+$.== Rozpadu látky na ionty ve vodě se říká **elektrolytická disociace**.',
        },
        { type: 'formula', text: '$HCl -> H^+ + Cl^-$', caption: 'disociace chlorovodíku ve vodě (zjednodušený zápis)' },
        {
          type: 'p',
          text: 'Holý proton $H^+$ ve vodě nevydrží. Okamžitě se naváže na volný elektronový pár kyslíku v molekule vody a vznikne **oxoniový kation** $H3O^+$.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'chlorovodík a voda', items: [{ species: 'HCl', count: 3 }, { species: 'H2O', count: 6 }], state: 'solution' },
            { label: 'kyselina chlorovodíková', items: [{ species: 'H3O+', count: 3 }, { species: 'Cl^-', count: 3 }, { species: 'H2O', count: 3 }], state: 'solution' },
          ],
          arrows: true,
          caption: 'Přesnější zápis je proto $HCl + H2O -> H3O^+ + Cl^-$: každá molekula $HCl$ předá proton molekule vody.',
        },
        { type: 'p', text: 'Jak oxoniový kation vypadá? Porovnej ho s obyčejnou molekulou vody: přibyl jeden vodík a s ním kladný náboj.' },
        { type: 'molecule', molecules: ['H2O', 'H3O+'], labels: ['voda', 'oxoniový kation $H3O^+$'] },
        { type: 'p', text: 'Shrňme si nové pojmy. Poslední z nich, sytnost, hned rozvedeme:' },
        {
          type: 'keyterms',
          items: [
            { term: 'kyselina (podle Arrhenia)', def: 'látka, která ve vodném roztoku uvolňuje kationty $H^+$' },
            { term: 'oxoniový kation', def: '$H3O^+$, molekula vody s navázaným protonem; nositel kyselosti roztoků (a kyselé chuti)' },
            { term: 'elektrolytická disociace', def: 'rozpad látky na ionty působením rozpouštědla (vody)' },
            { term: 'anion kyseliny', def: 'částice, která zbude po odtržení $H^+$, např. $Cl^-$, $NO3^-$, $SO4^2-$' },
            { term: 'sytnost kyseliny', def: 'kolik kationtů $H^+$ může jedna molekula kyseliny odevzdat' },
          ],
        },
        { type: 'h', text: 'Jednosytné a vícesytné kyseliny' },
        {
          type: 'p',
          text: '$HCl$ a $HNO3$ odevzdají jen jeden proton, jsou **jednosytné**. $H2SO4$, $H2CO3$ a $H2S$ jsou **dvojsytné** a $H3PO4$ je **trojsytná**. Vícesytné kyseliny odevzdávají protony **postupně, po jednom**, a v každém kroku vznikne jiný anion.',
        },
        { type: 'p', text: 'V tabulce najdeš běžné kyseliny podle sytnosti a hlavně anionty, které z nich krok za krokem vznikají:' },
        {
          type: 'table',
          headers: ['Kyselina', 'Sytnost', 'Anionty, které postupně vznikají'],
          rows: [
            ['$HCl$', 'jednosytná', '$Cl^-$'],
            ['$HNO3$', 'jednosytná', '$NO3^-$'],
            ['$H2SO4$', 'dvojsytná', '$HSO4^-$, $SO4^2-$'],
            ['$H2CO3$', 'dvojsytná', '$HCO3^-$, $CO3^2-$'],
            ['$H2S$', 'dvojsytná', '$HS^-$, $S^2-$'],
            ['$H3PO4$', 'trojsytná', '$H2PO4^-$, $HPO4^2-$, $PO4^3-$'],
          ],
          caption: 'U kyseliny sírové proběhne 1. stupeň úplně ($H2SO4 -> H^+ + HSO4^-$), 2. stupeň jen částečně ($HSO4^- <=> H^+ + SO4^2-$).',
        },
        { type: 'p', text: 'Jak takové postupné odštěpování zapsat? Nejlépe je to vidět na trojsytné kyselině fosforečné, která má kroky tři.' },
        {
          type: 'example',
          problem: 'Zapiš postupnou disociaci kyseliny fosforečné $H3PO4$.',
          steps: [
            '1. stupeň: $H3PO4 <=> H^+ + H2PO4^-$',
            '2. stupeň: $H2PO4^- <=> H^+ + HPO4^2-$',
            '3. stupeň: $HPO4^2- <=> H^+ + PO4^3-$',
            'S každým krokem roste záporný náboj aniontu o 1. Čím zápornější anion, tím pevněji drží zbylý proton, takže každý další stupeň proběhne v menší míře.',
          ],
          answer: 'Tři stupně a tři různé anionty: $H2PO4^-$, $HPO4^2-$ a $PO4^3-$ (jejich názvy poznáš v lekci 5-5).',
        },
        { type: 'p', text: 'Na modelu je dobře vidět, co z molekuly po třetím kroku zbude:' },
        { type: 'molecule', molecules: ['H3PO4', 'PO4^3-'], labels: ['kyselina fosforečná (trojsytná)', 'fosforečnanový anion $PO4^3-$'], caption: 'Po odtržení všech tří vodíků zbude z $H3PO4$ anion s nábojem 3−.' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Sytnost není počet všech vodíků',
          text: 'U kyslíkatých kyselin se odštěpují jen vodíky vázané na kyslík. Kyselina octová $CH3COOH$ má čtyři vodíky, ale je **jednosytná**: tři vodíky sedí na uhlíku a ty se neodštěpí (podrobně v úrovni 8).',
        },
        { type: 'p', text: 'Teď víš, co dělá kyselinu kyselinou a kolik protonů může odevzdat. Zbývá kyseliny pojmenovat, a začneme těmi nejjednoduššími, bez kyslíku.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který ion vzniká ve vodném roztoku každé kyseliny?',
            options: ['$H3O^+$', '$OH^-$', '$Cl^-$', '$Na^+$'],
            answer: 0,
            explain: 'Kyselina uvolňuje $H^+$, který se ve vodě hned naváže na molekulu vody a vznikne oxoniový kation $H3O^+$. Anion $Cl^-$ vzniká jen z $HCl$.',
          },
        },
      ],
    },
    {
      title: 'Bezkyslíkaté kyseliny',
      icon: 'gas-cloud',
      blocks: [
        {
          type: 'p',
          text: 'Aby se o kyselinách dalo mluvit, potřebují jména. Nejjednodušší kyseliny obsahují jen vodík a jeden nekov. Tyto **bezkyslíkaté kyseliny** jsou vodné roztoky plynů, třeba chlorovodíku $HCl$ nebo fluorovodíku $HF$.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'gas-cloud', title: 'Plyn', text: 'chlorovodík $HCl$' },
            { icon: 'drop', title: 'Rozpustit ve vodě', text: 'vznikne vodný roztok' },
            { icon: 'book', title: 'Název', text: '**kyselina** + chlorovodík + **-ová**' },
            { icon: 'flask', title: 'Kyselina', text: '**kyselina chlorovodíková**' },
          ],
          caption: 'Název bezkyslíkaté kyseliny = kyselina + název vodíkaté sloučeniny + koncovka -ová.',
        },
        { type: 'p', text: 'Kyselina tedy nese jméno plynu, ze kterého vznikla. Takhle vypadají molekuly tří takových plynů:' },
        { type: 'molecule', molecules: ['HCl', 'HF', 'H2S'], labels: ['chlorovodík', 'fluorovodík', 'sulfan'] },
        { type: 'p', text: 'Stejné pravidlo platí pro všechny bezkyslíkaté kyseliny. V tabulce jsou ty nejběžnější i s tím, kde je potkáš:' },
        {
          type: 'table',
          headers: ['Vzorec', 'Plyn', 'Kyselina (vodný roztok)', 'Kde ji potkáš'],
          rows: [
            ['$HF$', 'fluorovodík', 'kyselina fluorovodíková', 'leptání skla'],
            ['$HCl$', 'chlorovodík', 'kyselina chlorovodíková (solná)', 'žaludek, čištění kovů'],
            ['$HBr$', 'bromovodík', 'kyselina bromovodíková', 'chemická výroba'],
            ['$HI$', 'jodovodík', 'kyselina jodovodíková', 'chemická výroba'],
            ['$H2S$', 'sulfan (sirovodík)', 'kyselina sulfanová (sirovodíková)', 'zkažená vejce, sopky'],
            ['$HCN$', 'kyanovodík', 'kyselina kyanovodíková', 'prudký jed'],
          ],
          caption: 'Mezi bezkyslíkaté kyseliny se řadí i $HCN$, přestože obsahuje dva nekovy.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Technická kyselina chlorovodíková (asi 31–33 %) se prodává pod tradičním názvem **kyselina solná**. Oba názvy jsou správně.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Kyselina fluorovodíková je výjimečně zrádná. Proniká kůží, váže vápník z tkání a kostí a bolest se často ozve až za několik hodin. Leptá i sklo, proto se uchovává v plastových lahvích.',
        },
        { type: 'p', text: 'Bezkyslíkatou kyselinu tedy pojmenuješ podle plynu. U kyselin s kyslíkem to tak snadné není, tam o názvu rozhoduje oxidační číslo.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Jak se jmenuje vodný roztok bromovodíku $HBr$?',
            accept: ['kyselina bromovodíková', 'bromovodíková'],
            explain: 'Kyselina + bromovodík + koncovka -ová: kyselina bromovodíková.',
          },
        },
      ],
    },
    {
      title: 'Kyslíkaté kyseliny: od vzorce k názvu',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: 'Většina kyselin z laboratoře i z domácnosti ale kyslík obsahuje. **Kyslíkaté kyseliny** (oxokyseliny) obsahují vodík, kyslík a jeden **centrální atom**, obvykle nekovu. Ve vzorci je pořadí vodík – centrální atom – kyslík: $H2SO4$, $HNO3$, $H3PO4$.',
        },
        { type: 'molecule', molecules: ['H2SO4', 'HNO3', 'H3PO4'], labels: ['kyselina sírová', 'kyselina dusičná', 'kyselina fosforečná'], caption: 'Centrální atom (S, N, P) obklopují kyslíky, vodíky sedí na kyslících.' },
        {
          type: 'p',
          text: 'Koncovka názvu prozradí **oxidační číslo centrálního atomu**. Koncovky znáš z oxidů, jen místo -ý je -á, protože kyselina je „ona“.',
        },
        {
          type: 'table',
          headers: ['Oxidační číslo', 'Koncovka', 'Příklad', 'Vzorec'],
          rows: [
            ['I', '-ná', 'kyselina chlorná', '$HClO$'],
            ['II', '-natá', '(u oxokyselin vzácné)', '–'],
            ['III', '-itá', 'kyselina dusitá', '$HNO2$'],
            ['IV', '-ičitá', 'kyselina siřičitá, uhličitá', '$H2SO3$, $H2CO3$'],
            ['V', '-ičná, -ečná', 'kyselina dusičná, chlorečná', '$HNO3$, $HClO3$'],
            ['VI', '-ová', 'kyselina sírová', '$H2SO4$'],
            ['VII', '-istá', 'kyselina chloristá, manganistá', '$HClO4$, $HMnO4$'],
            ['VIII', '-ičelá', '(vzácné)', '–'],
          ],
        },
        { type: 'p', text: 'Jak tedy ze vzorce poznáš koncovku? Stačí dopočítat oxidační číslo centrálního atomu: vodík má +I, kyslík −II a zbytek musí součet doplnit na nulu.' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'molecule', title: 'Vzorec', text: '$HNO3$' },
            { icon: 'calculator', title: 'Součet oxidačních čísel = 0', text: '$H^{I}$, $O^{-II}$: +1 + x − 6 = 0' },
            { icon: 'atom', title: 'Oxidační číslo', text: 'x = +5, dusík V' },
            { icon: 'book', title: 'Koncovka', text: 'V -> -ičná: **kyselina dusičná**' },
          ],
          caption: 'Od vzorce k názvu: oxidační číslo centrálního atomu dopočítáš tak, aby součet v molekule byl nula.',
        },
        { type: 'p', text: 'Teď totéž s kyselinou, kde má síra méně kyslíků než v kyselině sírové. Pozor, jiný počet kyslíků znamená jiné oxidační číslo, a tedy i jinou koncovku:' },
        {
          type: 'example',
          problem: 'Pojmenuj kyselinu $H2SO3$.',
          steps: [
            'Vodík: 2 · (+1) = +2. Kyslík: 3 · (−2) = −6.',
            '+2 + x − 6 = 0, takže x = +4.',
            'Síra má oxidační číslo IV -> koncovka -ičitá.',
          ],
          answer: '$H2SO3$ je **kyselina siřičitá**.',
        },
        { type: 'p', text: 'Ze vzorce už název odvodíš. V testech se ale častěji ptají obráceně: znáš název a máš napsat vzorec.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj kyselinu $HClO4$.',
            accept: ['kyselina chloristá', 'chloristá'],
            explain: '+1 + x − 8 = 0, chlor má oxidační číslo VII a tomu odpovídá koncovka -istá.',
          },
        },
      ],
    },
    {
      title: 'Od názvu ke vzorci',
      icon: 'pencil',
      blocks: [
        {
          type: 'p',
          text: 'Opačný směr je v testech nejčastější. Máš dva spolehlivé postupy se stejným výsledkem, vyber si ten, který ti sedí víc.',
        },
        { type: 'h', text: 'Postup 1: oxid + voda' },
        { type: 'p', text: 'Kyslíkatá kyselina vzniká, když se oxid nekovu sloučí s vodou. Stačí tedy najít oxid se stejným oxidačním číslem a vodu k němu „přičíst“:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Koncovka', text: '-ová -> síra VI' },
            { icon: 'gas-cloud', title: 'Oxid', text: 'oxid sírový $SO3$' },
            { icon: 'drop', title: 'Přičti vodu', text: '$SO3 + H2O$' },
            { icon: 'flask', title: 'Kyselina', text: '$H2SO4$' },
          ],
          caption: 'Oxid nekovu se stejným oxidačním číslem + $H2O$. Jsou-li všechny počty atomů sudé, vyděl je dvěma.',
        },
        { type: 'p', text: 'U kyseliny sírové vyšel vzorec hned. U dusíku je potřeba ještě jeden krok, protože počty atomů vyjdou zdvojené:' },
        {
          type: 'example',
          problem: 'Odvoď vzorec kyseliny dusičné.',
          steps: [
            'Koncovka -ičná -> dusík má oxidační číslo V, oxid dusičný je $N2O5$.',
            'Sečti atomy v $N2O5 + H2O$: 2 H, 2 N, 6 O.',
            'Všechny počty jsou sudé, vyděl je dvěma: 1 H, 1 N, 3 O.',
            'Vyčíslená rovnice: $N2O5 + H2O -> 2HNO3$.',
          ],
          answer: '$HNO3$',
        },
        { type: 'h', text: 'Postup 2: počítání vodíků a kyslíků' },
        { type: 'p', text: 'Kdo nechce psát oxidy, může vzorec rovnou spočítat. Každý kyslík má −II, takže vodíky a centrální atom musí dát dohromady sudé číslo: liché oxidační číslo proto doplní jeden vodík, sudé dva.' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Oxidační číslo', text: 'urči ho z koncovky' },
            { icon: 'ion-plus', title: 'Počet H', text: '**liché** číslo -> 1 H, **sudé** -> 2 H' },
            { icon: 'calculator', title: 'Počet O', text: '(oxidační číslo + počet H) : 2' },
            { icon: 'check', title: 'Kontrola', text: 'součet oxidačních čísel = 0' },
          ],
        },
        { type: 'p', text: 'Ověřme pravidlo na kyselině chloristé, kde má chlor nejvyšší možné oxidační číslo VII:' },
        {
          type: 'example',
          problem: 'Odvoď vzorec kyseliny chloristé.',
          steps: [
            'Koncovka -istá -> chlor VII. To je liché číslo, takže 1 H.',
            'Počet O = (7 + 1) : 2 = 4.',
            'Kontrola: +1 + 7 + 4 · (−2) = 0.',
          ],
          answer: '$HClO4$',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Výjimka, kterou musíš znát',
          text: 'Podle pravidla by kyselina fosforečná ($P^{V}$) měla vzorec $HPO3$. Běžná kyselina fosforečná z coly nebo z hnojiv má ale tři vodíky: $H3PO4$, přesným názvem **kyselina trihydrogenfosforečná**.',
        },
        { type: 'p', text: 'Odkud se tři vodíky berou? Oxid fosforečný se slučuje se třemi molekulami vody, ne s jednou jako ostatní oxidy:' },
        { type: 'reaction', equation: 'P2O5 + 3H2O -> 2H3PO4', caption: 'oxid fosforečný + tři molekuly vody -> kyselina fosforečná' },
        { type: 'p', text: 'Teď umíš kyseliny pojmenovat oběma směry. Jména ale nejsou všechno, v dalším oddílu uvidíš, s čím kyseliny reagují a co přitom vzniká.' },
        { type: 'game', gameId: 'naming', text: 'Procvič si převody název ↔ vzorec v Názvoslovném trenažéru. Po pár kolech ti kyseliny půjdou samy.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec kyseliny uhličité.',
            accept: ['H2CO3'],
            caseSensitive: true,
            placeholder: 'např. H2SO4',
            explain: 'Uhlík IV je sudé číslo -> 2 H; O = (4 + 2) : 2 = 3. Nebo z oxidu: $CO2 + H2O -> H2CO3$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec kyseliny dusité.',
            accept: ['HNO2'],
            caseSensitive: true,
            placeholder: 'např. H2SO4',
            explain: 'Dusík III je liché číslo -> 1 H; O = (3 + 1) : 2 = 2. Vzorec je $HNO2$.',
          },
        },
      ],
    },
    {
      title: 'Typické reakce kyselin',
      icon: 'test-tube',
      blocks: [
        {
          type: 'p',
          text: 'Na začátku lekce jsme viděli, že kyseliny rozpouštějí kovy. Není to náhoda: všechny kyseliny obsahují v roztoku kationty $H3O^+$, a proto reagují podobně. Produktem je vždy **sůl**, iontová látka z kationtu kovu a aniontu kyseliny (podrobně v lekci 5-5). ==Podle partnera kyseliny poznáš, co vznikne vedle soli.==',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'coin', title: 'kyselina + neušlechtilý kov', text: '-> sůl + vodík $H2$' },
            { icon: 'powder', title: 'kyselina + oxid kovu', text: '-> sůl + voda' },
            { icon: 'soap', title: 'kyselina + hydroxid', text: '-> sůl + voda (neutralizace, lekce 5-4)' },
            { icon: 'mountain', title: 'kyselina + uhličitan', text: '-> sůl + voda + oxid uhličitý $CO2$' },
          ],
        },
        { type: 'p', text: 'Podívejme se na tři z těchto reakcí s kyselinou chlorovodíkovou. Zinek je neušlechtilý kov, takže vedle soli uniká vodík:' },
        { type: 'reaction', equation: 'Zn + 2HCl -> ZnCl2 + H2', caption: 'Zinek se v kyselině chlorovodíkové rozpouští a uniká vodík. Vzniká chlorid zinečnatý.' },
        { type: 'p', text: 'S oxidem kovu je to jinak. Vodík z kyseliny se spojí s kyslíkem z oxidu na vodu, a proto nic nebublá:' },
        { type: 'reaction', equation: 'MgO + 2HCl -> MgCl2 + H2O', caption: 'Bílý oxid hořečnatý se v kyselině rozpustí na chlorid hořečnatý. Plyn nevzniká.' },
        { type: 'p', text: 'Uhličitan zase šumí, protože kromě soli a vody vzniká i oxid uhličitý:' },
        { type: 'reaction', equation: 'CaCO3 + 2HCl -> CaCl2 + H2O + CO2', caption: 'Vápenec šumí: vzniklá kyselina uhličitá se hned rozpadá na vodu a oxid uhličitý.' },
        { type: 'p', text: 'Teď zkus celý postup sám/sama. U hliníku dá vyčíslení víc práce, protože jeho kation má jiný náboj než kation zinku:' },
        {
          type: 'example',
          problem: 'Co vznikne reakcí hliníku s kyselinou chlorovodíkovou? Zapiš vyčíslenou rovnici.',
          steps: [
            'Hliník je neušlechtilý kov, vznikne tedy sůl a vodík.',
            'Hliník tvoří kation $Al^{3+}$, kyselina chlorovodíková dává anion $Cl^-$. Sůl je $AlCl3$, chlorid hlinitý.',
            'Schéma: $Al + HCl -> AlCl3 + H2$. Vpravo jsou 3 chlory, ale vodík v $H2$ jde po dvou.',
            'Nejmenší společný násobek 3 a 2 je 6: $6HCl$, potom $2AlCl3$, $3H2$ a nakonec $2Al$.',
          ],
          answer: '$2Al + 6HCl -> 2AlCl3 + 3H2$',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Ušlechtilé kovy (měď, stříbro, zlato) s kyselinou chlorovodíkovou ani se zředěnou sírovou nereagují (proč, vysvětlí řada reaktivity kovů v úrovni 6). Kyselina dusičná rozpustí i měď, ale místo vodíku uvolní jedovaté oxidy dusíku. Vodík je hořlavý: pracuj s malými množstvími, v brýlích a daleko od plamene.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Vodní kámen z konvice odstraníš octem nebo kyselinou citronovou: uhličitan vápenatý se rozpustí a šumí $CO2$. Stejnou reakcí kyselé deště rozpouštějí vápencové sochy.',
        },
        { type: 'p', text: 'Kyseliny tedy rozpouštějí kovy, oxidy i vápenec. Právě proto s nimi musíme zacházet opatrně, a to je téma posledního oddílu.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Co vzniká reakcí zinku se zředěnou kyselinou sírovou?',
            options: ['$ZnSO4$ a $H2$', '$ZnSO4$ a $H2O$', '$ZnS$ a $H2O$', '$ZnO$ a $SO2$'],
            answer: 0,
            explain: 'Neušlechtilý kov s kyselinou dává sůl a vodík: $Zn + H2SO4 -> ZnSO4 + H2$. Voda by vznikla s oxidem nebo hydroxidem.',
          },
        },
      ],
    },
    {
      title: 'Důležité kyseliny, bezpečnost a kyselé deště',
      icon: 'hazard',
      blocks: [
        {
          type: 'p',
          text: 'Kyselina, která rozpustí zinek nebo vápenec, si poradí i s kůží. Koncentrované kyseliny jsou **žíravé**: poškozují kůži, oči i oblečení. Koncentrovaná kyselina chlorovodíková a dusičná navíc uvolňují dráždivé výpary, proto se s nimi pracuje v **digestoři**.',
        },
        { type: 'p', text: 'Které kyseliny potkáš nejčastěji? Tady je přehled i s tím, čím jsou nebezpečné a k čemu slouží:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'stomach', title: 'chlorovodíková (solná) $HCl$', text: 'bezbarvá, štiplavé výpary, koncentrovaná asi 35 %; žaludeční šťáva, čištění kovů, výroba PVC' },
            { icon: 'battery', title: 'sírová $H2SO4$', text: 'olejovitá, koncentrovaná 96 %, odnímá vodu (zuhelnatí cukr); nejvyráběnější chemikálie světa: autobaterie, hnojiva' },
            { icon: 'explosion', title: 'dusičná $HNO3$', text: 'koncentrovaná asi 65 %, silně oxiduje, barví kůži žlutě; hnojiva, výbušniny, barviva' },
            { icon: 'glass', title: 'fosforečná $H3PO4$', text: 'zředěná je poměrně bezpečná; cola (E338), odrezovače, hnojiva' },
            { icon: 'plastic-bottle', title: 'uhličitá $H2CO3$', text: 'existuje jen ve vodě, rozpadá se na $CO2$ a vodu; sycené nápoje, minerálky' },
            { icon: 'lemon', title: 'octová a citronová', text: 'přírodní organické kyseliny z octa a citronů; jejich vzorce přijdou na řadu v úrovni 8' },
          ],
        },
        { type: 'p', text: 'Nejvíc nehod se stává při ředění koncentrované kyseliny. Správný postup má čtyři kroky a na jejich pořadí záleží:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'goggles', title: 'Brýle a rukavice', text: 'nasaď je dřív, než otevřeš lahev' },
            { icon: 'beaker', title: 'Nejdřív voda', text: 'do kádinky nalij vodu' },
            { icon: 'drop', title: 'Potom kyselina', text: 'lij ji pomalu, za stálého míchání' },
            { icon: 'heat', title: 'Hlídej teplo', text: 'roztok se silně zahřívá' },
          ],
          caption: 'Ředění koncentrované kyseliny krok za krokem',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Nejdřív voda, potom kyselina!',
          text: 'Při ředění koncentrované kyseliny, hlavně sírové, se uvolňuje velké teplo. Kdybys lil vodu do kyseliny, voda by se na povrchu okamžitě vařila a vystříkla i s kyselinou. Proto vždy lij **kyselinu do vody**.',
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'První pomoc',
          text: 'Při potřísnění kyselinou sundej zasažený oděv a oplachuj kůži velkým množstvím vody aspoň 15 minut. Oko vyplachuj proudem vody a hned k lékaři. Neutralizovat kyselinu na kůži zásadou nezkoušej, reakce hřeje a poškození zhorší.',
        },
        { type: 'h', text: 'Kyselé deště' },
        {
          type: 'p',
          text: 'Kyseliny ale nevznikají jen v továrnách, tvoří se i v ovzduší. I úplně čistý déšť je mírně kyselý: rozpouští se v něm $CO2$ ze vzduchu a vzniká slabá kyselina uhličitá ($CO2 + H2O <=> H2CO3$), takže má pH asi 5,6 (co je pH, se dozvíš v lekci 5-3). **Kyselé deště** jsou mnohem kyselejší. Způsobuje je oxid siřičitý $SO2$ ze spalování uhlí, které obsahuje síru, a oxidy dusíku ($NO$, $NO2$) z motorů a elektráren.',
        },
        { type: 'diagram', id: 'acid-rain', caption: 'Od komína a výfuku ke kyselému dešti: $SO2$ z továren a oxidy dusíku z aut se v oblacích mění na kyselinu siřičitou, sírovou a dusičnou (rovnice pod obrázkem). Déšť s pH pod 5,6 poškozuje lesy a okyseluje jezera.' },
        { type: 'p', text: 'Co takový déšť způsobí, když dopadne na zem? Všimni si, že jde hlavně o reakce kyselin, které už znáš z minulého oddílu:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'fish', title: 'Jezera', text: 'okyselená voda hubí ryby a jiné živočichy' },
            { icon: 'tree', title: 'Lesy a půda', text: 'kyselá půda poškozuje kořeny, jehličí žloutne a stromy usychají' },
            { icon: 'mountain', title: 'Vápenec a mramor', text: 'kyselina s uhličitanem: rozpouštějí se sochy i fasády' },
            { icon: 'rust', title: 'Kovové konstrukce', text: 'kyselina s kovem: rychleji rezaví mosty a střechy' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'V 70. a 80. letech 20. století odumřely vlivem kyselých dešťů rozsáhlé lesy v Krušných a Jizerských horách, v „Černém trojúhelníku“ na pomezí Česka, Německa a Polska. V 90. letech se elektrárny odsířily: suspenze vápence zachytí $SO2$ ze spalin a vznikne sádrovec na sádrokarton. Lesy se od té doby vracejí.',
        },
        { type: 'p', text: 'Teď znáš kyseliny od názvu až po jejich vliv na přírodu. V příští lekci přijde jejich protějšek: hydroxidy a zásady, které dokážou kyselinu zneškodnit.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které plyny přispívají ke vzniku kyselých dešťů?',
            options: ['$SO2$', '$NO2$', '$N2$', '$CH4$', '$SO3$'],
            answers: [0, 1, 4],
            explain: 'Oxidy síry a dusíku tvoří s vodou kyseliny siřičitou, sírovou a dusičnou. Dusík $N2$ sám kyselinu netvoří (oxidy dusíku z něj vznikají až za vysoké teploty v motorech) a metan je skleníkový plyn bez kyselých vlastností.',
          },
        },
      ],
    },
  ],
  summary: [
    'Kyselina podle Arrhenia uvolňuje ve vodě kationty $H^+$, které se hned mění na oxoniové kationty $H3O^+$.',
    'Vícesytné kyseliny, jako $H2SO4$ nebo $H3PO4$, odevzdávají protony postupně, po jednom; sytnost udává, kolik protonů může molekula odevzdat.',
    'Bezkyslíkaté kyseliny se jmenují podle vodíkaté sloučeniny, koncovka kyslíkaté kyseliny udává oxidační číslo centrálního atomu: -ná, -natá, -itá, -ičitá, -ičná/-ečná, -ová, -istá, -ičelá.',
    'Vzorec odvodíš z oxidu a vody, nebo počítáním: liché oxidační číslo 1 H, sudé 2 H, počet O = (oxidační číslo + H) : 2; výjimkou je $H3PO4$.',
    'Kyseliny dávají s neušlechtilými kovy sůl a vodík, s oxidy kovů a hydroxidy sůl a vodu a s uhličitany sůl, vodu a $CO2$.',
    'Při ředění vždy platí: nejdřív voda, potom kyselina.',
    'Kyselé deště vznikají hlavně z $SO2$ a oxidů dusíku ze spalování.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Jaké oxidační číslo má síra v kyselině siřičité?',
      options: ['IV', 'VI', 'II', 'III'],
      answer: 0,
      explain: 'Koncovka -ičitá odpovídá oxidačnímu číslu IV: $H2SO3$, 2 + 4 − 6 = 0.',
    },
    {
      kind: 'multi',
      q: 'Které kyseliny jsou vícesytné?',
      options: ['$H2SO4$', '$H3PO4$', '$H2CO3$', '$HNO3$', '$CH3COOH$'],
      answers: [0, 1, 2],
      explain: 'Kyselina sírová a uhličitá jsou dvojsytné, fosforečná trojsytná. $HNO3$ je jednosytná a kyselina octová také, protože odštěpuje jen vodík vázaný na kyslík.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec kyseliny bromičné.',
      accept: ['HBrO3'],
      caseSensitive: true,
      placeholder: 'např. H2SO4',
      explain: 'Koncovka -ičná -> brom V, liché číslo -> 1 H; O = (5 + 1) : 2 = 3. Vzorec je $HBrO3$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec kyseliny manganisté.',
      accept: ['HMnO4'],
      caseSensitive: true,
      placeholder: 'např. H2SO4',
      explain: 'Koncovka -istá -> mangan VII, liché -> 1 H; O = (7 + 1) : 2 = 4. Vzorec je $HMnO4$.',
    },
    {
      kind: 'match',
      q: 'Přiřaď ke vzorci název kyseliny.',
      pairs: [
        ['$H2SO4$', 'kyselina sírová'],
        ['$HNO2$', 'kyselina dusitá'],
        ['$H3PO4$', 'kyselina fosforečná'],
        ['$H2S$', 'kyselina sulfanová'],
        ['$HF$', 'kyselina fluorovodíková'],
      ],
      explain: 'Kyslíkaté kyseliny pojmenuješ podle oxidačního čísla (S VI -ová, N III -itá, P V -ečná), bezkyslíkaté podle vodíkaté sloučeniny.',
    },
    {
      kind: 'tf',
      q: 'Kyselina fosforečná má ve vzorci tři atomy vodíku, přestože podle pravidla o lichém oxidačním čísle bychom čekali jen jeden.',
      answer: true,
      explain: 'Běžná kyselina fosforečná je $H3PO4$ (trihydrogenfosforečná). Je to výjimka, kterou je potřeba si zapamatovat.',
    },
    {
      kind: 'text',
      q: 'Jaký plyn se uvolňuje, když poliješ vodní kámen ($CaCO3$) kyselinou? Napiš vzorec nebo název.',
      accept: ['CO2', 'oxid uhličitý'],
      placeholder: 'např. H2',
      explain: 'Kyselina s uhličitanem dává sůl, vodu a oxid uhličitý: $CaCO3 + 2HCl -> CaCl2 + H2O + CO2$.',
    },
    {
      kind: 'tf',
      q: 'Při ředění koncentrované kyseliny sírové se lije voda do kyseliny.',
      answer: false,
      explain: 'Je to naopak: nejdřív voda, potom kyselina. Kyselina se lije pomalu do vody, jinak by se voda prudce vařila a rozstřikovala.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-2 Hydroxidy a zásady                                             */
/* ------------------------------------------------------------------ */

const l52: Lesson = {
  id: 'l5-2',
  title: 'Hydroxidy a zásady',
  goals: [
    'Pojmenovat hydroxidy a sestavit jejich vzorce',
    'Rozlišit alkálie a nerozpustné hydroxidy a vysvětlit, proč je zásadou i amoniak',
    'Rozdělit oxidy na zásadité, kyselé a amfoterní a zapsat jejich reakce',
    'Zapsat typické reakce zásad a bezpečně pracovat se žíravinami',
  ],
  hook: 'Čistič odpadů dokáže rozpustit chuchvalec vlasů v trubce a z mastnoty udělá mýdlo. Poznej chemický protipól kyselin. A pozor, pro oči je ještě zákeřnější než kyseliny.',
  sections: [
    {
      title: 'Co je hydroxid',
      icon: 'ion-minus',
      blocks: [
        {
          type: 'p',
          text: 'Kyseliny poznáme podle kationtu $H^+$. Jejich protějšek, zásady, má jiný společný znak: hydroxidový anion. **Hydroxidy** jsou sloučeniny kationtu kovu a **hydroxidových aniontů** $OH^-$. Hydroxidový anion je skupina z jednoho kyslíku a jednoho vodíku s nábojem −1.',
        },
        { type: 'molecule', molecules: ['OH-'], labels: ['hydroxidový anion $OH^-$'] },
        {
          type: 'p',
          text: 'Protože $OH^-$ má náboj −1, ==počet skupin OH se rovná oxidačnímu číslu kovu.== Víc skupin patří do **závorky**: $Ca(OH)2$. Název: **hydroxid** + koncovka podle oxidačního čísla kovu jako u oxidů (-ný, -natý, -itý…).',
        },
        { type: 'p', text: 'V tabulce si všimni, že počet skupin OH ve vzorci vždy odpovídá římské číslici v prvním sloupci:' },
        {
          type: 'table',
          headers: ['Oxidační číslo kovu', 'Koncovka', 'Název', 'Vzorec'],
          rows: [
            ['I', '-ný', 'hydroxid sodný', '$NaOH$'],
            ['I', '-ný', 'hydroxid draselný', '$KOH$'],
            ['II', '-natý', 'hydroxid vápenatý', '$Ca(OH)2$'],
            ['II', '-natý', 'hydroxid měďnatý', '$Cu(OH)2$'],
            ['III', '-itý', 'hydroxid hlinitý', '$Al(OH)3$'],
            ['III', '-itý', 'hydroxid železitý', '$Fe(OH)3$'],
          ],
        },
        { type: 'p', text: 'Jak ale napsat vzorec, když znáš jen název? Koncovka prozradí náboj kationtu a ten určí počet skupin OH:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Název', text: 'hydroxid železnatý' },
            { icon: 'ion-plus', title: 'Kation', text: '-natý -> II -> $Fe^{2+}$' },
            { icon: 'ion-minus', title: 'Vyrovnej náboj', text: '+2 potřebuje dva $OH^-$' },
            { icon: 'check', title: 'Vzorec', text: 'OH do závorky s indexem: $Fe(OH)2$' },
          ],
          caption: 'Od názvu ke vzorci hydroxidu.',
        },
        { type: 'p', text: 'Zkusme oba směry najednou, u kovů, které v tabulce nejsou:' },
        {
          type: 'example',
          problem: 'Pojmenuj $Pb(OH)2$ a napiš vzorec hydroxidu chromitého.',
          steps: [
            '$Pb(OH)2$: dvě skupiny $OH^-$ nesou dohromady náboj −2, olovo má tedy oxidační číslo II.',
            'Oxidační číslo II odpovídá koncovce -natý: hydroxid olovnatý.',
            'Chromitý: koncovka -itý znamená oxidační číslo III, kation je $Cr^{3+}$.',
            'Náboj +3 vyrovnají tři anionty $OH^-$ v závorce.',
          ],
          answer: '$Pb(OH)2$ je **hydroxid olovnatý**, hydroxid chromitý je $Cr(OH)3$.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Nejčastější chyba je zapomenutá závorka. Zápis $CaOH2$ by znamenal jeden kyslík a dva vodíky, což je nesmysl. Správně je $Ca(OH)2$: dva kyslíky a dva vodíky.',
        },
        { type: 'p', text: 'Hydroxidy už umíš pojmenovat. Teď nás bude zajímat, co dělají ve vodě, a tam se rozdělí na dvě velmi odlišné skupiny.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec hydroxidu barnatého.',
            accept: ['Ba(OH)2'],
            caseSensitive: true,
            placeholder: 'např. Mg(OH)2',
            explain: 'Barnatý -> $Ba^{2+}$, potřebuje dva $OH^-$: $Ba(OH)2$.',
          },
        },
      ],
    },
    {
      title: 'Alkálie a nerozpustné hydroxidy',
      icon: 'beaker',
      blocks: [
        {
          type: 'p',
          text: 'Pro kyseliny měl Arrhenius jednoduchou definici a pro zásady je zrcadlová. Podle Arrhenia je **zásada** látka, která ve vodě uvolňuje **hydroxidové anionty** $OH^-$. Rozpustné hydroxidy to dělají přímo, disociují na ionty.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'pevný $NaOH$', items: [{ species: 'NaOH', count: 4 }], state: 'solid' },
            { label: 'roztok $NaOH$', items: [{ species: 'Na^+', count: 4 }, { species: 'OH-', count: 4 }, { species: 'H2O', count: 5 }], state: 'solution' },
          ],
          arrows: true,
          caption: '$NaOH -> Na^+ + OH^-$',
        },
        { type: 'p', text: 'Hydroxid kovu s oxidačním číslem II uvolní z každé jednotky vzorce dva anionty $OH^-$:' },
        { type: 'formula', text: '$Ca(OH)2 -> Ca^{2+} + 2OH^-$' },
        {
          type: 'p',
          text: 'V širším smyslu se **zásadou** nazývá každý hydroxid kovu, který s kyselinou dává sůl a vodu, i když se ve vodě nerozpouští. Zásady rozpustné ve vodě se nazývají **alkálie** a jejich roztoky jsou **alkalické**. ==Každá alkálie je zásada, ale ne každá zásada je alkálie.==',
        },
        { type: 'p', text: 'Kde vede hranice mezi alkálií a nerozpustnou zásadou? Podívej se, jak moc se rozpustnost jednotlivých hydroxidů liší:' },
        {
          type: 'table',
          headers: ['Hydroxid', 'Rozpustnost ve vodě (20 °C)', 'Zařazení'],
          rows: [
            ['$NaOH$, $KOH$', 'přes 1 000 g/dm^{3}', 'alkálie'],
            ['$LiOH$', 'asi 130 g/dm^{3}', 'alkálie'],
            ['$Ba(OH)2$', 'asi 39 g/dm^{3}', 'alkálie'],
            ['$Ca(OH)2$', 'asi 1,7 g/dm^{3}', 'málo rozpustná alkálie'],
            ['$Mg(OH)2$', 'asi 0,01 g/dm^{3}', 'prakticky nerozpustný'],
            ['$Cu(OH)2$, $Fe(OH)3$, $Al(OH)3$', 'prakticky nerozpustné', 'nerozpustné zásady'],
          ],
          caption: 'Alkálie jsou hydroxidy alkalických kovů a těžších kovů alkalických zemin. Rozpustnost ve 2. skupině shora dolů roste.',
        },
        { type: 'p', text: 'Rozdíl v rozpustnosti není jen číslo v tabulce. V laboratoři poznáš obě skupiny na první pohled:' },
        {
          type: 'compare',
          columns: [
            { title: 'Alkálie', icon: 'drop', tone: 'a', points: ['rozpouštějí se, roztok má pH > 7', 'fenolftalein barví červenofialově', 'koncentrované roztoky jsou žíravé', 'vznikají např. z alkalického kovu a vody'] },
            { title: 'Nerozpustné hydroxidy', icon: 'powder', tone: 'b', points: ['vznikají jako barevné sraženiny', '$Cu(OH)2$ modrý, $Fe(OH)2$ zelenavý, $Fe(OH)3$ rezavě hnědý, $Al(OH)3$ bílý rosolovitý', 'fenolftalein nezbarví', 'zahřátím se rozkládají na oxid a vodu'] },
          ],
        },
        {
          type: 'p',
          text: 'Nerozpustné hydroxidy se připravují **srážením**: k roztoku soli kovu přikápneš alkálii. Kationty kovu se spojí s $OH^-$ a vypadne sraženina.',
        },
        { type: 'reaction', equation: 'CuSO4 + 2NaOH -> Cu(OH)2 + Na2SO4', caption: 'modrá sraženina hydroxidu měďnatého; iontově $Cu^{2+} + 2OH^- -> Cu(OH)2(s)$. Zahřátím zčerná: $Cu(OH)2 -> CuO + H2O$.' },
        { type: 'p', text: 'Alkálií se tedy srážejí nerozpustné hydroxidy. Samotné alkálie se dají připravit i přímo z kovu:' },
        { type: 'reaction', equation: '2Na + 2H2O -> 2NaOH + H2', caption: 'Alkálie vznikají i z alkalického kovu a vody: sodík + voda -> hydroxid sodný + vodík.' },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Sodík reaguje s vodou prudce, vodík se může vznítit. Pokus patří jen učiteli: kousek velikosti hrášku, velká kádinka vody a ochranný štít.',
        },
        { type: 'p', text: 'Zásady tedy uvolňují $OH^-$ a ty nejrozpustnější z nich jsou alkálie. Existuje ale i zásada, která skupinu OH vůbec nemá.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která látka je alkálie, tedy zásada dobře rozpustná ve vodě?',
            options: ['$KOH$', '$Fe(OH)3$', '$Cu(OH)2$', '$Mg(OH)2$'],
            answer: 0,
            explain: 'Hydroxidy alkalických kovů (Li, Na, K…) jsou ve vodě dobře rozpustné. Hydroxidy železa, mědi a hořčíku jsou nerozpustné zásady: s kyselinou reagují, ale ve vodě se nerozpustí.',
          },
        },
      ],
    },
    {
      title: 'Amoniak: zásada bez OH ve vzorci',
      icon: 'gas-cloud',
      blocks: [
        {
          type: 'p',
          text: '**Amoniak** $NH3$ je bezbarvý plyn štiplavého zápachu. Skupinu OH ve vzorci nemá, a přesto jeho vodný roztok barví fenolftalein fialově. Jak je to možné?',
        },
        { type: 'p', text: 'Odpověď skrývá stavba molekuly. Porovnej amoniak s kationtem, který z něj ve vodě vzniká:' },
        {
          type: 'molecule',
          molecules: ['NH3', 'NH4+'],
          labels: ['amoniak: volný elektronový pár na dusíku', 'amonný kation $NH4^+$'],
        },
        {
          type: 'p',
          text: 'Volný elektronový pár dusíku si „přitáhne“ vodíkový kation z molekuly vody. Vznikne **amonný kation** $NH4^+$ a z vody zbude hydroxidový anion $OH^-$, který dělá roztok zásaditým.',
        },
        { type: 'p', text: 'Pozor, nezreagují všechny molekuly. Na modelu částic vidíš, že většina amoniaku zůstane v roztoku nezměněná:' },
        {
          type: 'particles',
          boxes: [
            { label: 'amoniak ve vodě', items: [{ species: 'NH3', count: 5 }, { species: 'H2O', count: 5 }], state: 'solution' },
            { label: 'rovnováha', items: [{ species: 'NH3', count: 4 }, { species: 'H2O', count: 4 }, { species: 'NH4+', count: 1 }, { species: 'OH-', count: 1 }], state: 'solution', note: 'většina $NH3$ zůstane nezměněná' },
          ],
          arrows: true,
          caption: '$NH3 + H2O <=> NH4^+ + OH^-$. Obousměrná šipka říká, že takto zreaguje jen malá část molekul amoniaku.',
        },
        {
          type: 'p',
          text: 'Roztoku amoniaku se říká **čpavková voda** (hovorově **čpavek**), je v některých čističích oken. Název „hydroxid amonný“ ($NH4OH$) nepoužívej, takové molekuly neexistují.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Na amoniaku je vidět, že Arrheniova definice má své meze. V lekci 5-6 poznáš obecnější Brønstedovu teorii, která si s ním poradí elegantně.',
        },
        { type: 'p', text: 'Zásadou tedy může být i látka, která $OH^-$ vyrobí až z vody. Teď se vrátíme k oxidům a uvidíme, které z nich dávají zásady a které kyseliny.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Amoniak je zásada, přestože ve svém vzorci nemá žádnou skupinu OH.',
            answer: true,
            explain: 'Amoniak přijme od vody kation $H^+$ a v roztoku tak vzniknou anionty $OH^-$.',
          },
        },
      ],
    },
    {
      title: 'Zásadité, kyselé a amfoterní oxidy',
      icon: 'periodic-table',
      blocks: [
        {
          type: 'p',
          text: 'Hydroxidy i kyseliny často vznikají z oxidů a vody. Podle toho, co z oxidu vznikne, oxidy dělíme. Oxidy kovů, hlavně alkalických kovů a kovů alkalických zemin, jsou **zásadité oxidy**: s vodou dávají hydroxid a s kyselinou sůl a vodu. Oxidy nekovů jsou naopak **kyselé oxidy**: s vodou dávají kyseliny (lekce 5-1).',
        },
        { type: 'p', text: 'Typický zásaditý oxid je oxid sodný. S vodou z něj vznikne alkálie:' },
        { type: 'reaction', equation: 'Na2O + H2O -> 2NaOH', caption: 'oxid sodný + voda -> hydroxid sodný' },
        { type: 'p', text: 'Nejznámější zásaditý oxid ale najdeš na každé stavbě. Pálené vápno prochází celým cyklem reakcí a vrací se zpět do vápence:' },
        { type: 'diagram', id: 'limestone-cycle', caption: 'Vápenný cyklus: pálením vápence $CaCO3$ vzniká **pálené vápno** $CaO$, typický zásaditý oxid. S vodou reaguje bouřlivě a hodně se zahřeje (**hašení vápna**), vznikne **hašené vápno** $Ca(OH)2$. Malta z něj tvrdne tak, že pohlcuje oxid uhličitý ze vzduchu, a vzniká zpět vápenec.' },
        { type: 'p', text: 'Druhý znak zásaditého oxidu je reakce s kyselinou. Tady je stejná jako u hydroxidu, vznikne sůl a voda:' },
        { type: 'reaction', equation: 'CaO + 2HCl -> CaCl2 + H2O', caption: 'Zásaditý oxid + kyselina -> sůl + voda. S kyselinou reagují i oxidy, které se ve vodě nerozpouštějí, třeba $CuO$.' },
        {
          type: 'p',
          text: '**Amfoterní** oxidy a hydroxidy (z řeckého *amfoteros*, obojí) reagují s kyselinami i se zásadami. Typické jsou sloučeniny hliníku a zinku: $Al2O3$, $Al(OH)3$, $ZnO$ a $Zn(OH)2$.',
        },
        { type: 'p', text: 'Jak může jedna látka reagovat s kyselinou i se zásadou? Na hydroxidu hlinitém vidíš obě role vedle sebe:' },
        {
          type: 'compare',
          columns: [
            { title: '$Al(OH)3$ jako zásada', icon: 'lemon', tone: 'a', points: ['s kyselinou dává sůl a vodu', '$Al(OH)3 + 3HCl -> AlCl3 + 3H2O$'] },
            { title: '$Al(OH)3$ jako kyselina', icon: 'soap', tone: 'b', points: ['v roztoku $NaOH$ se rozpustí', '$Al(OH)3 + NaOH -> Na[Al(OH)4]$', 'vznikne tetrahydroxidohlinitan sodný'] },
          ],
          caption: 'Bílá sraženina $Al(OH)3$ zmizí v kyselině i v nadbytku hydroxidu sodného.',
        },
        { type: 'p', text: 'Zásaditý, amfoterní, nebo kyselý? Napoví periodická tabulka. Projdi oxidy 3. periody zleva doprava:' },
        {
          type: 'table',
          headers: ['Oxid', 'Charakter', 'S vodou vznikne'],
          rows: [
            ['$Na2O$', 'zásaditý', '$NaOH$'],
            ['$MgO$', 'zásaditý', '$Mg(OH)2$ (málo)'],
            ['$Al2O3$', 'amfoterní', 'nereaguje, nerozpustný'],
            ['$SiO2$', 'kyselý', 'nereaguje, nerozpustný'],
            ['$P4O10$', 'kyselý', '$H3PO4$'],
            ['$SO3$', 'kyselý', '$H2SO4$'],
            ['$Cl2O7$', 'kyselý', '$HClO4$'],
          ],
          caption: 'Oxidy prvků 3. periody: zleva doprava roste nekovový charakter a oxidy přecházejí od zásaditých přes amfoterní ke kyselým. **Neutrální oxidy** $CO$, $NO$ a $N2O$ nereagují s kyselinami ani se zásadami.',
        },
        { type: 'p', text: 'Teď pravidlo použij: podle polohy prvku urči charakter oxidu a napiš reakci, která ho prozradí.' },
        {
          type: 'example',
          problem: 'Rozhodni, jak se chovají $K2O$, $SO2$ a $ZnO$, a pro každý zapiš jednu typickou reakci.',
          steps: [
            '$K2O$ je oxid alkalického kovu, tedy zásaditý: $K2O + H2O -> 2KOH$.',
            '$SO2$ je oxid nekovu, tedy kyselý: $SO2 + H2O -> H2SO3$ (kyselina siřičitá).',
            '$ZnO$ je amfoterní. S kyselinou: $ZnO + 2HCl -> ZnCl2 + H2O$. Rozpustí se ale i v roztoku $NaOH$.',
          ],
          answer: '$K2O$ zásaditý, $SO2$ kyselý, $ZnO$ amfoterní.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Kov -> zásaditý oxid, nekov -> kyselý oxid, hliník a zinek -> amfoterní. Pozor na výjimky: kovy ve vysokém oxidačním čísle tvoří kyselé oxidy, třeba $Mn2O7$ nebo $CrO3$. Proto existují kyselina manganistá a chromová.',
        },
        { type: 'p', text: 'Teď víš, odkud zásady pocházejí. V dalším oddílu se podíváme, s čím reagují.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který hydroxid se rozpustí v kyselině chlorovodíkové i v roztoku hydroxidu sodného?',
            options: ['$Al(OH)3$', '$Mg(OH)2$', '$Ca(OH)2$', '$KOH$'],
            answer: 0,
            explain: 'Hydroxid hlinitý je amfoterní: s $HCl$ dá $AlCl3$ a vodu, s $NaOH$ rozpustný $Na[Al(OH)4]$. Ostatní hydroxidy jsou čistě zásadité.',
          },
        },
      ],
    },
    {
      title: 'Typické reakce zásad',
      icon: 'flask',
      blocks: [
        {
          type: 'p',
          text: 'U kyselin jsme měli seznam typických reakcí a zásady mají podobný. Alkálie reagují podobně, protože všechny obsahují v roztoku anion $OH^-$. ==Zapamatuj si čtyři typické partnery zásad.==',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'lemon', title: 'zásada + kyselina', text: '-> sůl + voda (neutralizace, lekce 5-4)' },
            { icon: 'gas-cloud', title: 'zásada + kyselý oxid', text: '-> sůl + voda, např. s $CO2$ nebo $SO2$' },
            { icon: 'fertilizer', title: 'zásada + amonná sůl', text: '-> za tepla uniká amoniak $NH3$' },
            { icon: 'test-tube', title: 'alkálie + roztok soli kovu', text: '-> sraženina nerozpustného hydroxidu' },
          ],
        },
        { type: 'p', text: 'Projdi si všechny partnery na konkrétních rovnicích. Nejdůležitější je reakce s kyselinou, které se věnuje celá lekce 5-4:' },
        { type: 'reaction', equation: 'NaOH + HCl -> NaCl + H2O', caption: 'neutralizace: hydroxid sodný + kyselina chlorovodíková -> chlorid sodný + voda' },
        { type: 'p', text: 'Kyselý oxid se chová jako kyselina, i když v něm žádný vodík není. Vzniká opět sůl a voda:' },
        { type: 'reaction', equation: '2NaOH + CO2 -> Na2CO3 + H2O', caption: 'Proto se $NaOH$ skladuje dobře uzavřený: pohlcuje $CO2$ ze vzduchu a mění se na uhličitan.' },
        { type: 'p', text: 'S hydroxidem vápenatým vzniká nerozpustný uhličitan, a proto je reakce dobře vidět:' },
        { type: 'reaction', equation: 'Ca(OH)2 + CO2 -> CaCO3 + H2O', caption: 'Čirá **vápenná voda** (roztok $Ca(OH)2$) se zakalí bílým $CaCO3$, když do ní brčkem vydechuješ. Tak se dokazuje oxid uhličitý.' },
        { type: 'p', text: 'Reakci s amonnou solí prozradí čich: zásada z ní vytlačí plynný amoniak.' },
        { type: 'reaction', equation: 'NH4Cl + NaOH -> NaCl + NH3 + H2O', caption: 'Za tepla uniká štiplavý amoniak a navlhčený červený lakmusový papírek nad zkumavkou zmodrá. Tak se dokazují amonné soli.' },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Amonná hnojiva se nesmějí sypat na pole zároveň s páleným nebo hašeným vápnem. Zásada by z nich uvolnila amoniak a dusík by z půdy unikl do vzduchu.',
        },
        { type: 'p', text: 'Z rovnice reakce s $CO2$ můžeš i počítat, stejně jako v lekci 4-6:' },
        {
          type: 'example',
          problem: 'Kolik gramů $NaOH$ zachytí 2,2 g $CO2$, pokud vzniká uhličitan sodný?',
          steps: [
            'Rovnice: $2NaOH + CO2 -> Na2CO3 + H2O$, poměr $n(NaOH) : n(CO2)$ = 2 : 1.',
            '$n(CO2)$ = 2,2 g : 44 g/mol = 0,050 mol.',
            '$n(NaOH)$ = 2 · 0,050 mol = 0,10 mol.',
            '$m(NaOH)$ = 0,10 mol · 40 g/mol = 4,0 g.',
          ],
          answer: 'Zachytí ho 4,0 g $NaOH$.',
        },
        { type: 'p', text: 'Reakce zásad tedy známe. Zbývá podívat se, kde se hydroxidy používají a proč s nimi musíš být ještě opatrnější než s kyselinami.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Co ucítíš, když zahřeješ síran amonný s hydroxidem vápenatým?',
            options: ['štiplavý amoniak', 'dusivý chlor', 'sulfan (zkažená vejce)', 'nic, reakce neproběhne'],
            answer: 0,
            explain: 'Zásada uvolní z amonné soli amoniak: $(NH4)2SO4 + Ca(OH)2 -> CaSO4 + 2NH3 + 2H2O$.',
          },
        },
      ],
    },
    {
      title: 'Hydroxidy v praxi a bezpečnost',
      icon: 'goggles',
      blocks: [
        { type: 'p', text: 'Hydroxidy nejsou jen laboratorní chemikálie. Některé máš doma, aniž bys o tom věděl/a – tady jsou ty nejběžnější i s tím, k čemu slouží:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'soap', title: '$NaOH$, louh sodný', text: 'výroba mýdla, čističe odpadů, papír, výroba hliníku' },
            { icon: 'battery', title: '$KOH$, louh draselný', text: 'tekutá (mazlavá) mýdla, elektrolyt alkalických baterií' },
            { icon: 'powder', title: '$Ca(OH)2$, hašené vápno', text: 'malta, vápenné nátěry, úprava kyselých půd' },
            { icon: 'pill', title: '$Mg(OH)2$, hořečnaté mléko', text: 'lék proti pálení žáhy' },
            { icon: 'fertilizer', title: '$NH3(aq)$, čpavková voda', text: 'čističe skla; amoniak je surovina pro hnojiva' },
          ],
        },
        {
          type: 'p',
          text: '**Mýdlo** vzniká varem tuku s hydroxidem sodným nebo draselným (podrobně v úrovni 9). Totéž se děje v ucpaném odpadu: čistič s $NaOH$ promění mastnotu v rozpustné mýdlo a rozloží i vlasy.',
        },
        {
          type: 'p',
          text: 'Koncentrované roztoky hydroxidů jsou **žíravé**. Na kůži nejdřív působí jako kluzké mýdlo, a právě proto člověk poleptání snadno podcení.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zásady jsou pro oči horší než kyseliny',
          text: 'Kyselina bílkoviny na povrchu srazí a vytvoří jakousi bariéru. Zásada tkáň rozpouští a proniká hlouběji. Zásada v oku může během několika minut natrvalo poškodit rohovku, proto jsou ochranné brýle při práci s $NaOH$ povinné.',
        },
        { type: 'p', text: 'Jak žíravinu poznáš na obalu? Podle výstražného symbolu:' },
        { type: 'diagram', id: 'lab-safety', caption: 'Výstražné symboly GHS. Hydroxid sodný nese symbol žíraviny (GHS05) – klepni na něj. Najdeš ho i na obalu čističe odpadů.' },
        { type: 'p', text: 'Ze symbolu žíraviny plynou konkrétní pravidla pro práci s hydroxidy:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'goggles', title: 'Brýle a rukavice', text: 'při práci s hydroxidy vždy' },
            { icon: 'powder', title: 'Pevný $NaOH$ jen lžičkou', text: 'bílé pecičky nebo šupinky neber do ruky' },
            { icon: 'heat', title: 'Rozpouštěj po malých dávkách', text: 'roztok se silně zahřívá, $NaOH$ přidávej do vody' },
            { icon: 'flask', title: 'Nádobu vždy zavírej', text: '$NaOH$ pohlcuje vzdušnou vlhkost i oxid uhličitý' },
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'První pomoc',
          text: 'Zasažené místo oplachuj proudem vody aspoň 15 minut, oko ještě déle, a vyhledej lékaře. Žádný ocet ani citron na kůži nelij.',
        },
        { type: 'p', text: 'Teď už rozeznáš kyseliny i zásady a víš, jak s nimi bezpečně pracovat. V příští lekci se naučíš změřit, jak moc je roztok kyselý nebo zásaditý: poznáš stupnici pH.' },
        { type: 'game', gameId: 'swipe', text: 'Zahraj si Pravda, nebo lež? a otestuj, jestli rozeznáš fakta o kyselinách a zásadách od mýtů.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď hydroxid k jeho typickému použití.',
            pairs: [
              ['$NaOH$', 'výroba mýdla a čistič odpadů'],
              ['$Ca(OH)2$', 'malta a vápno na zdi'],
              ['$KOH$', 'elektrolyt v alkalických bateriích'],
              ['$Mg(OH)2$', 'lék na pálení žáhy'],
            ],
            explain: 'Louh sodný zmýdelňuje tuky, hašené vápno tvrdne s $CO2$, $KOH$ vede proud v bateriích a slabě rozpustný $Mg(OH)2$ jemně neutralizuje žaludeční kyselinu.',
          },
        },
      ],
    },
  ],
  summary: [
    'Hydroxid tvoří kation kovu a tolik aniontů $OH^-$, kolik je oxidační číslo kovu; koncovky jsou jako u oxidů: $Ca(OH)2$ je hydroxid vápenatý.',
    'Zásada podle Arrhenia uvolňuje ve vodě anionty $OH^-$; rozpustné zásady ($NaOH$, $KOH$, $Ba(OH)2$) se nazývají alkálie, ostatní hydroxidy vznikají jako nerozpustné sraženiny.',
    'Amoniak je zásada, protože přijme $H^+$ od vody a vzniknou $NH4^+$ a $OH^-$.',
    'Oxidy kovů jsou zásadité, oxidy nekovů kyselé; amfoterní $Al2O3$, $Al(OH)3$ a $ZnO$ reagují s kyselinami i se zásadami.',
    'Zásady reagují s kyselinami, s kyselými oxidy jako $CO2$ a $SO2$ a z amonných solí za tepla uvolňují amoniak.',
    'Louh sodný slouží k výrobě mýdla a v čističích odpadů, hašené vápno $Ca(OH)2$ ve stavebnictví.',
    'Hydroxidy jsou žíravé a pro oči velmi nebezpečné, ochranné brýle jsou nutnost.',
  ],
  quiz: [
    {
      kind: 'text',
      q: 'Napiš vzorec hydroxidu měďnatého.',
      accept: ['Cu(OH)2'],
      caseSensitive: true,
      placeholder: 'např. Mg(OH)2',
      explain: 'Měďnatý -> $Cu^{2+}$, dva anionty $OH^-$ v závorce: $Cu(OH)2$.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj $Fe(OH)3$.',
      accept: ['hydroxid železitý'],
      explain: 'Tři skupiny OH -> železo má oxidační číslo III, koncovka -itý.',
    },
    {
      kind: 'choice',
      q: 'Co vznikne reakcí draslíku s vodou?',
      options: ['$KOH$ a $H2$', '$K2O$ a $H2$', '$KOH$ a $O2$', '$KH$ a $O2$'],
      answer: 0,
      explain: 'Alkalický kov s vodou tvoří hydroxid a vodík: $2K + 2H2O -> 2KOH + H2$.',
    },
    {
      kind: 'tf',
      q: 'Hydroxid měďnatý se dobře rozpouští ve vodě, je to tedy alkálie.',
      answer: false,
      explain: '$Cu(OH)2$ je nerozpustný, z roztoku se vylučuje jako modrá sraženina. S kyselinou reaguje, je to tedy zásada, ale ne alkálie.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k běžnému názvu vzorec.',
      pairs: [
        ['pálené vápno', '$CaO$'],
        ['hašené vápno', '$Ca(OH)2$'],
        ['vápenec', '$CaCO3$'],
        ['louh sodný', '$NaOH$'],
      ],
      explain: 'Pálením vápence $CaCO3$ vzniká pálené vápno $CaO$, jeho hašením vodou hašené vápno $Ca(OH)2$.',
    },
    {
      kind: 'multi',
      q: 'Které oxidy jsou zásadité?',
      options: ['$Na2O$', '$CaO$', '$K2O$', '$SO3$', '$CO2$'],
      answers: [0, 1, 2],
      explain: 'Oxidy alkalických kovů a kovů alkalických zemin dávají s vodou hydroxidy. $SO3$ a $CO2$ jsou oxidy nekovů, tedy kyselé.',
    },
    {
      kind: 'tf',
      q: 'Vydechovaný vzduch zakalí vápennou vodu, protože $CO2$ s ní vytvoří nerozpustný $CaCO3$.',
      answer: true,
      explain: '$Ca(OH)2 + CO2 -> CaCO3 + H2O$. Bílý uhličitan vápenatý roztok zakalí.',
    },
    {
      kind: 'number',
      q: 'Kolik gramů $NaOH$ zachytí 3,2 g $SO2$, jestliže vzniká siřičitan sodný $Na2SO3$? (M(SO2) = 64 g/mol, M(NaOH) = 40 g/mol)',
      answer: 4,
      tolerance: 0.05,
      unit: 'g',
      explain: '$2NaOH + SO2 -> Na2SO3 + H2O$. $n(SO2)$ = 3,2 : 64 = 0,050 mol, $n(NaOH)$ = 0,10 mol, $m$ = 0,10 · 40 = 4,0 g.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-3 pH a indikátory                                                */
/* ------------------------------------------------------------------ */

const l53: Lesson = {
  id: 'l5-3',
  title: 'pH a indikátory',
  goals: [
    'Popsat autoprotolýzu vody a použít iontový součin vody',
    'Spočítat pH a pOH roztoků silných kyselin a zásad, i dvojsytných a zředěných',
    'Z pH zpětně určit koncentraci $H3O^+$ a zařadit běžné látky na stupnici pH',
    'Vybrat vhodný indikátor podle jeho barevného přechodu',
  ],
  hook: 'Na šampónu stojí „pH 5,5“, v bazénu se pH měří každý den a tvoje krev si drží pH 7,4 s přesností na desetiny. Co to číslo vlastně znamená a jak se počítá?',
  sections: [
    {
      title: 'I čistá voda obsahuje ionty',
      icon: 'drop',
      blocks: [
        {
          type: 'p',
          text: 'Než začneme počítat pH, musíme se podívat na samotnou vodu. Čistá voda vede proud jen nepatrně, obsahuje tedy trochu iontů. Molekuly vody si totiž občas předají vodíkový kation: vznikne oxoniový kation a hydroxidový anion. Říká se tomu **autoprotolýza vody**.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'čistá voda', items: [{ species: 'H2O', count: 8 }], state: 'liquid' },
            { label: 'po předání protonu', items: [{ species: 'H2O', count: 6 }, { species: 'H3O+', count: 1 }, { species: 'OH-', count: 1 }], state: 'liquid', note: 've skutečnosti jen asi 1 z 500 milionů molekul' },
          ],
          arrows: true,
          caption: 'Autoprotolýza $H2O + H2O <=> H3O^+ + OH^-$: dvě molekuly vody si předají proton.',
        },
        { type: 'p', text: 'Oba ionty, které při tom vznikají, už znáš: oxoniový kation z kyselin a hydroxidový anion ze zásad.' },
        { type: 'molecule', molecules: ['H3O+', 'OH-'], labels: ['oxoniový kation', 'hydroxidový anion'] },
        {
          type: 'p',
          text: '$[H3O^+]$ značí molární koncentraci oxoniových kationtů v mol/dm^{3} (totéž $c$ jako v lekci 4-5). V čisté vodě při 25 °C je $[H3O^+] = [OH^-] = 10^{-7}$ mol/dm^{3}.',
        },
        { type: 'p', text: 'Vynásob obě koncentrace v čisté vodě: 10^{-7} · 10^{-7} = 10^{-14}. Právě tento součin je klíčem k celé lekci:' },
        { type: 'formula', text: '$[H3O^+]·[OH^-] = 1,0·10^{-14}$', caption: '**iontový součin vody** $K_{v}$ při 25 °C (proč platí, vysvětlí rovnováhy v úrovni 6)' },
        {
          type: 'p',
          text: '==Iontový součin vody platí v každém vodném roztoku.== Když přidáš kyselinu, $[H3O^+]$ vzroste a $[OH^-]$ musí klesnout tak, aby jejich součin zůstal stejný. Oba ionty jsou přítomné vždy, mění se jen jejich poměr.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'kyselý roztok', icon: 'lemon', tone: 'a', points: ['$[H3O^+] > [OH^-]$'] },
            { title: 'neutrální roztok', icon: 'drop', tone: 'b', points: ['$[H3O^+] = [OH^-]$'] },
            { title: 'zásaditý roztok', icon: 'soap', tone: 'c', points: ['$[H3O^+] < [OH^-]$'] },
          ],
        },
        { type: 'p', text: 'Z jedné koncentrace teď dopočítáš druhou. Psát pořád mocniny deseti je ale nepohodlné, a proto chemici zavedli jedno jednoduché číslo: pH.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'V roztoku je $[H3O^+]$ = 10^{-3} mol/dm^{3}. Jaká je $[OH^-]$?',
            options: ['10^{-11} mol/dm^{3}', '10^{-3} mol/dm^{3}', '10^{-7} mol/dm^{3}', '10^{-17} mol/dm^{3}'],
            answer: 0,
            explain: '$[OH^-]$ = 10^{-14} : 10^{-3} = 10^{-11} mol/dm^{3}. Součin obou koncentrací musí být 10^{-14}.',
          },
        },
      ],
    },
    {
      title: 'Co je pH',
      icon: 'calculator',
      blocks: [
        {
          type: 'p',
          text: 'Psát koncentrace jako 0,0000001 mol/dm^{3} je nepraktické. Dánský chemik Søren **Sørensen** proto v roce 1909 zavedl **pH**: záporně vzatý dekadický logaritmus koncentrace oxoniových kationtů.',
        },
        { type: 'formula', text: '$pH = −log[H3O^+]$', caption: 'a naopak $[H3O^+] = 10^{−pH}$' },
        {
          type: 'p',
          text: 'Logaritmu se neboj, pro mocniny deseti je to snadné: ==pH je exponent koncentrace $H3O^+$ s opačným znaménkem.== Když $[H3O^+]$ = 10^{-3} mol/dm^{3}, je pH = 3.',
        },
        {
          type: 'diagram',
          id: 'ph-scale',
          props: { marks: [] },
          caption: 'pH < 7: roztok je **kyselý**. pH = 7: **neutrální** (při 25 °C). pH > 7: **zásaditý**.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Pokles pH o 1 znamená **desetkrát** vyšší koncentraci $H3O^+$. Roztok s pH 2 je tedy desetkrát kyselejší než roztok s pH 3 a stokrát kyselejší než roztok s pH 4.',
        },
        {
          type: 'p',
          text: 'U **silných kyselin**, jako je $HCl$ nebo $HNO3$, se ve zředěném roztoku rozštěpí všechny molekuly, takže $[H3O^+]$ se rovná koncentraci kyseliny. (Silné a slabé kyseliny podrobně v lekci 5-6.)',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'zředěná $HCl$', items: [{ species: 'H3O+', count: 4 }, { species: 'Cl^-', count: 4 }, { species: 'H2O', count: 6 }], state: 'solution', note: 'žádná celá molekula $HCl$' },
          ],
          caption: 'Silná kyselina: kolik molekul kyseliny, tolik kationtů $H3O^+$.',
        },
        { type: 'p', text: 'Teď už pH spočítáme. Začni roztokem, jehož koncentrace je celá mocnina deseti, tam stačí přečíst exponent:' },
        {
          type: 'example',
          problem: 'Jaké pH má kyselina chlorovodíková o koncentraci 0,01 mol/dm^{3}?',
          steps: [
            '$HCl$ je silná kyselina, disociuje úplně: z každé molekuly vznikne jeden $H3O^+$.',
            '$[H3O^+]$ = $c(HCl)$ = 0,01 mol/dm^{3} = 10^{-2} mol/dm^{3}.',
            'pH = −log 10^{-2} = 2.',
          ],
          answer: 'pH = 2',
        },
        { type: 'p', text: 'Koncentrace ale většinou celou mocninou deseti není. Pak logaritmus spočítá kalkulačka:' },
        {
          type: 'example',
          problem: 'Jaké pH má kyselina chlorovodíková o koncentraci 0,05 mol/dm^{3}?',
          steps: [
            '$[H3O^+]$ = 0,05 mol/dm^{3}.',
            'To není celá mocnina deseti, použij kalkulačku: log 0,05 = −1,30.',
            'pH = −(−1,30) = 1,30.',
          ],
          answer: 'pH ≐ 1,3',
        },
        { type: 'p', text: 'Postup jde i obrátit: z naměřeného pH zjistíš, kolik je v roztoku $H3O^+$.' },
        {
          type: 'example',
          title: 'Zpětný výpočet',
          problem: 'Ocet má pH 2,9. Jaká je v něm koncentrace oxoniových kationtů?',
          steps: [
            'Z definice pH plyne $[H3O^+] = 10^{−pH}$.',
            '$[H3O^+]$ = 10^{−2,9} mol/dm^{3}; na kalkulačce 10^{x} s x = −2,9.',
            '10^{−2,9} ≐ 0,0013 = 1,3·10^{-3}.',
          ],
          answer: '$[H3O^+]$ ≐ 1,3·10^{-3} mol/dm^{3}',
        },
        { type: 'p', text: 'pH kyselin už spočítáš. V roztoku zásady ale převažují $OH^-$ a s nimi se počítá trochu jinak.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké pH má roztok kyseliny dusičné $HNO3$ o koncentraci 0,001 mol/dm^{3}?',
            answer: 3,
            tolerance: 0.05,
            explain: '$HNO3$ je silná kyselina: $[H3O^+]$ = 0,001 = 10^{-3} mol/dm^{3}, takže pH = 3.',
          },
        },
      ],
    },
    {
      title: 'pOH a zásadité roztoky',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'Z koncentrace zásady přímo známe $[OH^-]$, ne $[H3O^+]$. U zásad je proto pohodlnější začít u hydroxidových aniontů. Podobně jako pH se definuje **pOH**:',
        },
        { type: 'formula', text: '$pOH = −log[OH^-]$' },
        { type: 'p', text: 'Jak se z pOH dostaneme k pH? Součin $[H3O^+]·[OH^-]$ je vždy 10^{-14}, takže součet obou exponentů s opačným znaménkem dá vždy 14:' },
        { type: 'formula', text: '$pH + pOH = 14$', caption: 'plyne z iontového součinu vody; platí ve vodných roztocích při 25 °C' },
        { type: 'p', text: 'Výpočet pH zásady má tedy vždy stejné tři kroky a kontrolu na konci:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'soap', title: '$[OH^-]$', text: 'z koncentrace zásady (u $Ca(OH)2$ a $Ba(OH)2$ dvakrát víc)' },
            { icon: 'calculator', title: 'pOH', text: '= −log $[OH^-]$' },
            { icon: 'balance-scale', title: 'pH', text: '= 14 − pOH' },
            { icon: 'check', title: 'Kontrola', text: 'zásaditý roztok má pH > 7' },
          ],
          caption: 'Výpočet pH roztoku silné zásady.',
        },
        { type: 'p', text: 'Vyzkoušej postup na nejběžnější silné zásadě:' },
        {
          type: 'example',
          problem: 'Jaké pH má roztok hydroxidu sodného o koncentraci 0,001 mol/dm^{3}?',
          steps: [
            '$NaOH$ je silná zásada, disociuje úplně: $[OH^-]$ = 0,001 mol/dm^{3} = 10^{-3} mol/dm^{3}.',
            'pOH = −log 10^{-3} = 3.',
            'pH = 14 − pOH = 14 − 3 = 11.',
          ],
          answer: 'pH = 11',
        },
        { type: 'p', text: 'U hydroxidů kovů s oxidačním číslem II pozor: z jedné jednotky vzorce vzniknou dva anionty $OH^-$.' },
        {
          type: 'particles',
          boxes: [
            { label: 'roztok $Ca(OH)2$', items: [{ species: 'Ca^{2+}', count: 2 }, { species: 'OH-', count: 4 }, { species: 'H2O', count: 5 }], state: 'solution', note: 'z každé jednotky dva $OH^-$' },
          ],
          caption: '$Ca(OH)2 -> Ca^{2+} + 2OH^-$: koncentrace $OH^-$ je dvojnásobná.',
        },
        { type: 'p', text: 'Tenhle dvojnásobek musíš započítat hned v prvním kroku výpočtu:' },
        {
          type: 'example',
          problem: 'Jaké pH má roztok hydroxidu vápenatého o koncentraci 0,005 mol/dm^{3}?',
          steps: [
            'Z každé vzorcové jednotky $Ca(OH)2$ vzniknou dva anionty $OH^-$.',
            '$[OH^-]$ = 2 · 0,005 mol/dm^{3} = 0,01 mol/dm^{3} = 10^{-2} mol/dm^{3}.',
            'pOH = 2, pH = 14 − 2 = 12.',
          ],
          answer: 'pH = 12',
        },
        { type: 'p', text: 'A když koncentrace nevyjde jako mocnina deseti? Postup je stejný, jen logaritmus spočítá kalkulačka:' },
        {
          type: 'example',
          problem: 'Jaké pH má roztok $KOH$ o koncentraci 0,04 mol/dm^{3}?',
          steps: [
            '$[OH^-]$ = 0,04 mol/dm^{3}.',
            'pOH = −log 0,04 = 1,40.',
            'pH = 14 − 1,40 = 12,60.',
          ],
          answer: 'pH ≐ 12,6',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Typická chyba: u zásady spočítáš pOH a zapomeneš ho převést na pH. Zkontroluj se selským rozumem: zásaditý roztok musí mít pH **větší** než 7.',
        },
        { type: 'p', text: 'Silné kyseliny i zásady už zvládneš. Zbývají dvě situace, které v úlohách potkáš často: kyselina se dvěma protony a ředění.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké pH má roztok hydroxidu draselného o koncentraci 0,01 mol/dm^{3}?',
            answer: 12,
            tolerance: 0.05,
            explain: '$[OH^-]$ = 10^{-2} mol/dm^{3}, pOH = 2, pH = 14 − 2 = 12.',
          },
        },
      ],
    },
    {
      title: 'Dvojsytné kyseliny a ředění',
      icon: 'droplets',
      blocks: [
        {
          type: 'p',
          text: 'Zatím dala každá molekula kyseliny jeden $H3O^+$. Dvojsytná kyselina sírová ale může odevzdat dva protony (lekce 5-1). Ve zředěném roztoku proto ve školních úlohách počítáme s tím, že odevzdá oba: ==$[H3O^+] = 2·c(H2SO4)$.==',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'zředěná $H2SO4$', items: [{ species: 'H3O+', count: 4 }, { species: 'SO4^2-', count: 2 }, { species: 'H2O', count: 5 }], state: 'solution', note: 'z každé molekuly dva $H3O^+$' },
          ],
          caption: 'Zjednodušeně: $H2SO4 + 2H2O -> 2H3O^+ + SO4^2-$.',
        },
        { type: 'p', text: 'Dvojnásobek se do výpočtu promítne stejně jako u $Ca(OH)2$, jen tentokrát u $H3O^+$:' },
        {
          type: 'example',
          problem: 'Jaké pH má kyselina sírová o koncentraci 0,005 mol/dm^{3}?',
          steps: [
            'Kyselina sírová je dvojsytná: z jedné molekuly vzniknou dva $H3O^+$.',
            '$[H3O^+]$ = 2 · 0,005 mol/dm^{3} = 0,01 mol/dm^{3} = 10^{-2} mol/dm^{3}.',
            'pH = −log 10^{-2} = 2.',
          ],
          answer: 'pH = 2',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Přesněji: druhý proton odchází jen částečně (lekce 5-1), takže skutečné pH kyseliny sírové o koncentraci 0,005 mol/dm^{3} je asi 2,1. Pro odhady a školní úlohy ale počítej s oběma protony.',
        },
        { type: 'h', text: 'Co udělá s pH ředění' },
        {
          type: 'p',
          text: 'Když roztok silné kyseliny zředíš, látkové množství $H3O^+$ se nezmění, jen se rozdělí do většího objemu. Novou koncentraci spočítáš jako v lekci 4-5: $c_{1}·V_{1} = c_{2}·V_{2}$. Desetinásobné zředění silné kyseliny zvýší pH o 1, u silné zásady ho o 1 sníží.',
        },
        { type: 'diagram', id: 'dilution', caption: 'Při ředění zůstává látkové množství rozpuštěné látky stejné, zvětší se jen objem. Proto koncentrace klesne a pH se posune k 7.' },
        { type: 'p', text: 'Spočítejme, co udělá stonásobné zředění. Nejdřív z pH zjistíme koncentraci, protože vzorec pro ředění pracuje s koncentracemi, ne s pH:' },
        {
          type: 'example',
          problem: 'Pipetou odměříš 10,0 cm^{3} kyseliny chlorovodíkové o pH 1 a v odměrné baňce ji doplníš vodou na 1,00 dm^{3}. Jaké pH má zředěný roztok?',
          steps: [
            'pH 1 znamená $[H3O^+]$ = 10^{-1} = 0,1 mol/dm^{3}.',
            '$c_{2}$ = $c_{1}·V_{1}$ : $V_{2}$ = 0,1 mol/dm^{3} · 0,0100 dm^{3} : 1,00 dm^{3} = 0,001 mol/dm^{3}.',
            'pH = −log 10^{-3} = 3. Stonásobné zředění zvýšilo pH o dvě jednotky.',
          ],
          answer: 'pH = 3',
        },
        { type: 'p', text: 'U zásady funguje ředění zrcadlově. Počítat musíš přes $[OH^-]$, protože právě ta se ředěním zmenšuje:' },
        {
          type: 'example',
          problem: 'Roztok $NaOH$ má pH 12. Jaké pH bude mít, když ho zředíš na desetinásobný objem?',
          steps: [
            'pOH = 14 − 12 = 2, takže $[OH^-]$ = 10^{-2} mol/dm^{3}.',
            'Po desetinásobném zředění je $[OH^-]$ = 10^{-3} mol/dm^{3}, pOH = 3.',
            'pH = 14 − 3 = 11.',
          ],
          answer: 'pH = 11: zředěná zásada se k 7 blíží shora.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Ředěním se kyselina nikdy nestane zásaditou. Když kyselinu s pH 5 zředíš tisíckrát, nevyjde pH 8, ale číslo těsně pod 7: i čistá voda sama obsahuje 10^{-7} mol/dm^{3} $H3O^+$.',
        },
        { type: 'p', text: 'Teď spočítáš pH běžných školních roztoků. Kam na stupnici ale patří ocet, mýdlo nebo krev?' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké pH má kyselina sírová o koncentraci 0,05 mol/dm^{3}? Předpokládej, že odevzdá oba protony.',
            answer: 1,
            tolerance: 0.05,
            explain: '$[H3O^+]$ = 2 · 0,05 = 0,1 mol/dm^{3} = 10^{-1} mol/dm^{3}, takže pH = 1.',
          },
        },
      ],
    },
    {
      title: 'Stupnice pH kolem nás',
      icon: 'chart',
      blocks: [
        {
          type: 'p',
          text: 'Spočítaná čísla dostanou smysl, až je porovnáš se skutečnými látkami. Stupnice pH běžně sahá od 0 do 14. Podívej se, kam patří látky, které znáš z domova.',
        },
        {
          type: 'diagram',
          id: 'ph-scale',
          props: {
            marks: [
              { ph: 1.5, label: 'žaludeční šťáva' },
              { ph: 2.3, label: 'citronová šťáva' },
              { ph: 2.9, label: 'ocet' },
              { ph: 5, label: 'černá káva' },
              { ph: 5.6, label: 'čistý déšť' },
              { ph: 7, label: 'čistá voda' },
              { ph: 7.4, label: 'krev' },
              { ph: 8.3, label: 'roztok jedlé sody' },
              { ph: 10, label: 'mýdlo' },
              { ph: 11.5, label: 'čpavek' },
              { ph: 13.5, label: 'čistič odpadů' },
            ],
          },
          caption: 'Každý dílek stupnice znamená desetinásobnou změnu koncentrace $H3O^+$.',
        },
        { type: 'p', text: 'Pro tvoje tělo nejsou tato čísla jen teorie. Některá pH se musí držet v úzkém rozmezí, jinak něco přestane fungovat:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'blood', title: 'Krev: pH 7,35–7,45', text: 'pod 7,35 lékaři mluví o acidóze, jde o vážný stav' },
            { icon: 'stomach', title: 'Žaludek: pH 1–2', text: 'kyselina rozkládá potravu a ničí bakterie' },
            { icon: 'soap', title: 'Kůže: pH asi 5,5', text: 'proto se kosmetika chlubí pH „šetrným k pokožce“' },
            { icon: 'swimming-pool', title: 'Bazén: pH 7,2–7,6', text: 'jinak nefunguje dezinfekce a voda dráždí oči' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Existují i roztoky s pH menším než 0 nebo větším než 14. Třeba koncentrovaná kyselina chlorovodíková má pH záporné. Stupnice 0–14 je jen praktický rozsah pro běžné roztoky.',
        },
        { type: 'p', text: 'pH tedy umíme spočítat i zařadit. Jak ho ale v laboratoři rychle zjistit bez výpočtu? K tomu slouží indikátory.' },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď od nejkyselejší po nejzásaditější.',
            items: ['žaludeční šťáva', 'ocet', 'čistá voda', 'roztok jedlé sody', 'čistič odpadů'],
            explain: 'pH asi 1,5 < 2,9 < 7 < 8,3 < 13,5. Čím nižší pH, tím kyselejší roztok.',
          },
        },
      ],
    },
    {
      title: 'Indikátory',
      icon: 'cabbage',
      blocks: [
        {
          type: 'p',
          text: 'Už v lekci 5-1 jsme viděli, že výluh z červeného zelí v kyselině zčervená. **Acidobazické indikátory** jsou barviva, která mění barvu podle pH. Každý má svůj **barevný přechod**, tedy rozmezí pH, ve kterém barvu mění.',
        },
        {
          type: 'p',
          text: 'Indikátor je sám slabá kyselina. Její molekula $HInd$ má jinou barvu než anion $Ind^-$, který vznikne odtržením protonu. V kyselém roztoku převažuje $HInd$, v zásaditém $Ind^-$, a v barevném přechodu jsou obě formy zastoupené podobně.',
        },
        { type: 'formula', text: '$HInd <=> H^+ + Ind^-$', caption: 'kyselá forma (jedna barva) ⇌ zásaditá forma (druhá barva)' },
        { type: 'p', text: 'Každý indikátor má tedy dvě barvy a každý je střídá při jiném pH. Porovnej nejběžnější indikátory:' },
        { type: 'diagram', id: 'indicator-colors', caption: 'Barvy lakmusu, fenolftaleinu, methyloranže, univerzálního indikátoru a výluhu z červeného zelí v kyselém, neutrálním a zásaditém roztoku.' },
        { type: 'p', text: 'Pro práci v laboratoři potřebuješ přesná čísla: v jakém rozmezí pH každý indikátor barvu mění.' },
        {
          type: 'table',
          headers: ['Indikátor', 'Přechod (pH)', 'Kyselá barva', 'Zásaditá barva'],
          rows: [
            ['methyloranž', '3,1–4,4', 'červená', 'žlutá'],
            ['methylčerveň', '4,4–6,2', 'červená', 'žlutá'],
            ['lakmus', 'asi 4,5–8,3', 'červená', 'modrá'],
            ['bromthymolová modř', '6,0–7,6', 'žlutá', 'modrá'],
            ['fenolftalein', '8,2–10,0', 'bezbarvá', 'červenofialová'],
            ['thymolftalein', '9,3–10,5', 'bezbarvá', 'modrá'],
          ],
          caption: 'Pod dolní hranicí přechodu má indikátor „kyselou“ barvu, nad horní hranicí „zásaditou“. Uvnitř přechodu vidíš směs obou barev, třeba oranžovou u methyloranže.',
        },
        { type: 'p', text: 'Pozor, jeden indikátor řekne jen to, jestli je pH pod přechodem, nebo nad ním. Spojením dvou indikátorů ale rozmezí zúžíš:' },
        {
          type: 'example',
          problem: 'Vzorek barví methyloranž žlutě a bromthymolovou modř žlutě. V jakém rozmezí je jeho pH?',
          steps: [
            'Methyloranž je žlutá až nad pH 4,4, takže pH > 4,4.',
            'Bromthymolová modř je žlutá jen pod pH 6,0, takže pH < 6,0.',
            'Obě podmínky musí platit zároveň.',
          ],
          answer: 'pH je asi mezi 4,4 a 6,0: roztok je slabě kyselý.',
        },
        {
          type: 'p',
          text: '**Univerzální indikátor** je směs několika indikátorů: papírkem jím nasáklým určíš pH zhruba na jednotku přesně (při pH 7 je zelený). Přesněji se pH měří elektronickým **pH metrem**.',
        },
        { type: 'p', text: 'Nejjednodušší indikátor si ale vyrobíš doma, z červeného zelí:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'cabbage', title: 'Výluh ze zelí', text: 'listy červeného zelí zalij horkou vodou, po 15 minutách sceď; fialová barviva jsou **antokyany**' },
            { icon: 'lemon', title: 'Sklenička s octem', text: 'výluh zčervená' },
            { icon: 'glass', title: 'Sklenička s vodou', text: 'zůstane fialová' },
            { icon: 'powder', title: 'Lžička jedlé sody', text: 'zmodrá až zezelená' },
          ],
          caption: 'Domácí pokus: indikátor z červeného zelí. S horkou vodou buď opatrný.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Antokyany ze zelí mají celou duhu: v silně kyselém prostředí jsou červené, ve slabě kyselém růžovofialové, v neutrálním fialové, ve slabě zásaditém modré a v silně zásaditém zelené až žluté.',
        },
        { type: 'p', text: 'Teď umíš pH spočítat, odhadnout i změřit. V příští lekci dáš kyselinu a zásadu dohromady: navzájem se zneutralizují a indikátor ti ukáže, kdy přesně.' },
        { type: 'game', gameId: 'ph-lab', text: 'V pH laboratoři přikapáváš kyselinu a zásadu a sleduješ, jak se krok za krokem mění barva univerzálního indikátoru.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Do roztoku přikápneš fenolftalein a roztok zůstane bezbarvý. Co můžeš s jistotou říct?',
            options: ['pH je menší než asi 8,2.', 'Roztok je kyselý.', 'Roztok je neutrální.', 'pH je větší než 10.'],
            answer: 0,
            explain: 'Fenolftalein je bezbarvý v celém rozmezí pod pH 8,2: v kyselém, neutrálním i slabě zásaditém roztoku. Víc z něj nevyčteš.',
          },
        },
      ],
    },
  ],
  summary: [
    'Autoprotolýzou vody vznikají ionty $H3O^+$ a $OH^-$; iontový součin vody je $[H3O^+]·[OH^-] = 10^{-14}$ (při 25 °C).',
    'pH = −log $[H3O^+]$ a naopak $[H3O^+]$ = 10^{−pH}; kyselé roztoky mají pH < 7, zásadité pH > 7.',
    'U silných zásad spočítej pOH = −log $[OH^-]$ a potom pH = 14 − pOH; u $Ca(OH)2$ a $Ba(OH)2$ je $[OH^-]$ dvojnásobek koncentrace zásady.',
    'U zředěné kyseliny sírové počítáme s $[H3O^+]$ = 2·c, protože je dvojsytná.',
    'Desetinásobné zředění silné kyseliny zvýší pH o 1, u silné zásady ho o 1 sníží; ředěním se pH jen blíží k 7.',
    'Změna pH o 1 znamená desetinásobnou změnu koncentrace $H3O^+$.',
    'Indikátory mění barvu v určitém rozmezí pH: methyloranž 3,1–4,4, bromthymolová modř 6,0–7,6, fenolftalein 8,2–10,0.',
  ],
  quiz: [
    {
      kind: 'number',
      q: 'Jaké pH má kyselina chlorovodíková o koncentraci 0,0001 mol/dm^{3}?',
      answer: 4,
      tolerance: 0.05,
      explain: '$[H3O^+]$ = 10^{-4} mol/dm^{3}, takže pH = 4.',
    },
    {
      kind: 'number',
      q: 'Jaké pH má roztok hydroxidu sodného o koncentraci 0,1 mol/dm^{3}?',
      answer: 13,
      tolerance: 0.05,
      explain: '$[OH^-]$ = 10^{-1} mol/dm^{3}, pOH = 1, pH = 14 − 1 = 13.',
    },
    {
      kind: 'tf',
      q: 'Roztok s pH 3 má stokrát vyšší koncentraci $H3O^+$ než roztok s pH 5.',
      answer: true,
      explain: 'Rozdíl dvou jednotek pH znamená 10 · 10 = 100násobný rozdíl koncentrace.',
    },
    {
      kind: 'tf',
      q: 'V kyselém roztoku nejsou žádné hydroxidové anionty $OH^-$.',
      answer: false,
      explain: 'Anionty $OH^-$ jsou ve vodném roztoku vždy, jen je jich v kyselém roztoku méně než $H3O^+$. Součin koncentrací je 10^{-14}.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k indikátoru v daném prostředí jeho barvu.',
      pairs: [
        ['lakmus v zásaditém roztoku', 'modrá'],
        ['fenolftalein v zásaditém roztoku', 'červenofialová'],
        ['methyloranž v zásaditém roztoku', 'žlutá'],
        ['univerzální indikátor při pH 1', 'červená'],
      ],
      explain: 'Lakmus v zásadách zmodrá, fenolftalein zfialoví, methyloranž zežloutne a univerzální indikátor je v silně kyselém prostředí červený.',
    },
    {
      kind: 'tf',
      q: 'Když kyselinu s pH 5 zředíš vodou tisíckrát, bude mít pH 8.',
      answer: false,
      explain: 'Ředěním se pH kyseliny jen blíží k 7 a nikdy ho nepřekročí. I čistá voda obsahuje 10^{-7} mol/dm^{3} $H3O^+$.',
    },
    {
      kind: 'number',
      q: 'Jaké pH má kyselina sírová o koncentraci 0,0005 mol/dm^{3}? Předpokládej, že odevzdá oba protony.',
      answer: 3,
      tolerance: 0.05,
      explain: '$[H3O^+]$ = 2 · 0,0005 = 0,001 mol/dm^{3} = 10^{-3} mol/dm^{3}, takže pH = 3.',
    },
    {
      kind: 'choice',
      q: 'Jaká je $[OH^-]$ v roztoku s pH 9?',
      options: ['10^{-5} mol/dm^{3}', '10^{-9} mol/dm^{3}', '10^{-7} mol/dm^{3}', '9 mol/dm^{3}'],
      answer: 0,
      explain: 'pOH = 14 − 9 = 5, takže $[OH^-]$ = 10^{-5} mol/dm^{3}. Hodnota 10^{-9} je $[H3O^+]$.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-4 Neutralizace a titrace                                         */
/* ------------------------------------------------------------------ */

const l54: Lesson = {
  id: 'l5-4',
  title: 'Neutralizace a titrace',
  goals: [
    'Zapsat neutralizaci molekulovou i iontovou rovnicí',
    'Popsat postup acidobazické titrace a rozlišit bod ekvivalence a konec titrace',
    'Spočítat koncentraci kyseliny nebo zásady z titrace při poměru 1 : 1 i 1 : 2',
    'Vysvětlit tvar titrační křivky a podle něj vybrat indikátor',
  ],
  hook: 'Pálí tě žáha? Tableta z lékárny ji zažene za pár minut. Stejná reakce pomáhá zemědělcům na polích i chemikům v laboratoři, kteří díky ní určí koncentraci roztoku s přesností na kapku.',
  sections: [
    {
      title: 'Kyselina + zásada = sůl + voda',
      icon: 'beaker',
      blocks: [
        {
          type: 'p',
          text: 'Kyseliny a zásady jsme zatím zkoumali každou zvlášť. Co se stane, když je slijeme dohromady? **Neutralizace** je reakce kyseliny se zásadou (hydroxidem), při které vzniká **sůl** a **voda**. Kyselina a zásada se navzájem „vyruší“ a roztok přestane být kyselý i zásaditý.',
        },
        { type: 'diagram', id: 'neutralization', caption: 'Kyselina chlorovodíková + hydroxid sodný -> chlorid sodný + voda: kationty $H3O^+$ z kyseliny předají proton aniontům $OH^-$ ze zásady a vznikne voda. Ionty $Na^+$ a $Cl^-$ zůstanou v roztoku jako sůl.' },
        { type: 'p', text: 'Na každou molekulu $HCl$ stačí jeden $NaOH$. Dvojsytná kyselina sírová má ale dva protony, a potřebuje tedy dvojnásobek zásady:' },
        { type: 'reaction', equation: 'H2SO4 + 2NaOH -> Na2SO4 + 2H2O', caption: 'dvojsytná kyselina sírová potřebuje dva $NaOH$' },
        {
          type: 'p',
          text: 'Rozepiš látky, které jsou v roztoku rozštěpené na ionty, a uvidíš, co se doopravdy děje:',
        },
        { type: 'formula', text: '$H^+ + Cl^- + Na^+ + OH^- -> Na^+ + Cl^- + H2O$' },
        {
          type: 'p',
          text: 'Ionty $Na^+$ a $Cl^-$ jsou na obou stranách beze změny, jsou to **ionty-diváci** (anglicky *spectator ions*). Když je škrtneš, zbude ==iontová rovnice neutralizace, stejná pro všechny silné kyseliny a zásady==:',
        },
        { type: 'formula', text: '$H^+ + OH^- -> H2O$', caption: 'přesněji $H3O^+ + OH^- -> 2H2O$' },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Neutralizace je **exotermní**, uvolňuje teplo. U silné kyseliny a silné zásady je to vždy asi 57 kJ na každý mol vzniklé vody, protože pokaždé probíhá stejná reakce $H^+ + OH^- -> H2O$. O reakčním teple víc v úrovni 6.',
        },
        { type: 'p', text: 'Teď víš, co se při neutralizaci doopravdy děje. Stejná reakce ti ale pomáhá i mimo laboratoř, třeba když tě pálí žáha.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Neutralizací $HNO3$ hydroxidem draselným $KOH$ vzniká voda a sůl. Napiš vzorec té soli.',
            accept: ['KNO3'],
            caseSensitive: true,
            placeholder: 'např. NaCl',
            explain: '$HNO3 + KOH -> KNO3 + H2O$. Vzniká dusičnan draselný.',
          },
        },
      ],
    },
    {
      title: 'Neutralizace v každodenním životě',
      icon: 'pill',
      blocks: [
        {
          type: 'p',
          text: 'Vraťme se k tabletě z úvodu lekce. Kyselina chlorovodíková ze žaludku v jícnu pálí: to je **pálení žáhy**. **Antacida**, léky proti překyselení, obsahují slabě rozpustné zásady, které nadbytek kyseliny zneutralizují.',
        },
        { type: 'reaction', equation: 'Mg(OH)2 + 2HCl -> MgCl2 + 2H2O', caption: 'hydroxid hořečnatý neutralizuje žaludeční kyselinu' },
        { type: 'p', text: 'Stejně funguje i druhá běžná zásada v tabletách. Kation $Al^{3+}$ má ale náboj 3+, takže potřebuje tři molekuly kyseliny:' },
        { type: 'reaction', equation: 'Al(OH)3 + 3HCl -> AlCl3 + 3H2O', caption: 'hydroxid hlinitý dělá totéž' },
        { type: 'p', text: 'Neutralizace by sice proběhla i s hydroxidem sodným, ale u léku hodně záleží na tom, jak rozpustná a silná zásada je. Porovnej obě možnosti:' },
        {
          type: 'compare',
          columns: [
            { title: 'Antacida', icon: 'pill', tone: 'good', points: ['málo rozpustné hydroxidy ($Mg(OH)2$, $Al(OH)3$) nebo uhličitany', 'působí mírně', 'reagují jen tam, kde je kyselina'] },
            { title: '$NaOH$', icon: 'warning', tone: 'bad', points: ['dobře rozpustný a žíravý', 'poleptal by ústa i jícen', 'jako lék nepoužitelný'] },
          ],
          caption: 'Proč se pálení žáhy neléčí hydroxidem sodným.',
        },
        {
          type: 'p',
          text: 'Neutralizovat se dá i celé pole. **Vápnění půdy**: kyselé půdy, třeba pod smrkovými lesy nebo po kyselých deštích, se posypávají mletým vápencem $CaCO3$ nebo hašeným vápnem. Vápenec reaguje s kyselinou za vzniku oxidu uhličitého:',
        },
        { type: 'formula', text: '$CaCO3 + 2H^+ -> Ca^{2+} + H2O + CO2$', caption: 'Stejně vápenec zachytí kyselý $SO2$ při odsíření spalin (lekce 5-1).' },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Když je někdo „kyselý“, zkus mu nabídnout trochu zásady. U lidí to funguje hůř než u roztoků, ale chemicky je to čistá neutralizace.',
        },
        { type: 'p', text: 'Neutralizace tedy pomáhá žaludku i půdě. V laboratoři ji chemici používají ještě jinak: k přesnému měření koncentrace.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která látka se hodí jako lék proti pálení žáhy?',
            options: ['$Mg(OH)2$', '$NaOH$', '$HCl$', '$NaCl$'],
            answer: 0,
            explain: 'Hydroxid hořečnatý je málo rozpustná, mírná zásada, která zneutralizuje žaludeční kyselinu. $NaOH$ je žíravý, $HCl$ je kyselina a $NaCl$ s kyselinou nereaguje.',
          },
        },
      ],
    },
    {
      title: 'Titrace: pomůcky a postup',
      icon: 'burette',
      blocks: [
        {
          type: 'p',
          text: 'Kyselina a zásada spolu reagují v přesném poměru podle rovnice. Když tedy víš, kolik zásady se spotřebovalo, víš i, kolik bylo kyseliny. **Titrace** (odměrná analýza) je metoda, jak zjistit neznámou koncentraci roztoku. K přesně odměřenému objemu vzorku postupně přidáváš roztok o známé koncentraci, dokud spolu přesně nezreagují.',
        },
        { type: 'p', text: 'Celé to stojí na přesném odměřování objemů. K tomu slouží čtyři pomůcky:' },
        {
          type: 'flipcards',
          cards: [
            { art: 'burette', title: 'byreta', text: 'dlouhá kalibrovaná trubice s kohoutem; přikapává se z ní odměrný roztok a odečítá se jeho spotřeba s přesností na 0,05 cm^{3}' },
            { art: 'pipette', title: 'pipeta', text: 'odměří přesný objem vzorku, třeba 20,00 cm^{3}; plní se nástavcem, nikdy ústy' },
            { art: 'erlenmeyer-flask', title: 'titrační baňka', text: 'kuželová baňka, ve které je vzorek s indikátorem; tvar dovoluje kroužit roztokem bez vystříknutí' },
            { art: 'wash-bottle', title: 'střička', text: 'destilovanou vodou jí opláchneš kapky ze stěn baňky do roztoku' },
          ],
          caption: 'Klepni na kartu a přečti si, k čemu pomůcka slouží.',
        },
        { type: 'p', text: 'Kromě pomůcek potřebuješ i několik pojmů. Pozor hlavně na poslední dva, snadno se pletou:' },
        {
          type: 'keyterms',
          items: [
            { term: 'odměrný (standardní) roztok', def: 'roztok o přesně známé koncentraci, kterým titruješ, třeba $NaOH$ o koncentraci 0,1000 mol/dm^{3}' },
            { term: 'standardizace', def: 'přesné zjištění koncentrace odměrného roztoku titrací přesně navážené čisté látky' },
            { term: 'bod ekvivalence', def: 'teoretický okamžik, kdy kyselina a zásada zreagovaly přesně v poměru podle rovnice' },
            { term: 'konec titrace', def: 'okamžik, kdy indikátor změní barvu a ty přestaneš titrovat' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Proč prostě nenavážit $NaOH$? Jeho pecičky pohlcují vodu i $CO2$ ze vzduchu, takže navážka nikdy není přesná. Roztok $NaOH$ se proto **standardizuje** titrací přesně navážené kyseliny šťavelové. Kyselina chlorovodíková se zase standardizuje na bezvodém uhličitanu sodném.',
        },
        { type: 'p', text: 'Když máš roztoky i pomůcky připravené, titrace probíhá vždy ve stejném pořadí kroků:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'burette', title: 'Připrav byretu', text: 'vypláchni ji odměrným roztokem, naplň, vypusť bublinu pod kohoutem a odečti počáteční objem' },
            { icon: 'pipette', title: 'Odměř vzorek', text: 'pipetou vypláchnutou vzorkem do titrační baňky' },
            { icon: 'drop', title: 'Přidej indikátor', text: '2–3 kapky' },
            { icon: 'speed', title: 'Orientační titrace', text: 'rychle zjistíš, kolik zhruba spotřebuješ' },
            { icon: 'flask', title: 'Přesná titrace', text: 'kousek před koncem přidávej po kapkách a baňkou krouži' },
            { icon: 'magnifier', title: 'Konec titrace', text: 'barva se trvale změní; odečti konečný objem, rozdíl je spotřeba' },
            { icon: 'arrow-cycle', title: 'Opakuj', text: 'dokud se dvě spotřeby neliší o víc než 0,10 cm^{3}; ty zprůměruj' },
          ],
        },
        { type: 'p', text: 'Spotřeba je jen tak přesná, jak přesně odečteš objem. Hladina v úzké trubici je prohnutá, a proto se čte u menisku:' },
        { type: 'diagram', id: 'meniscus', caption: 'Stejně jako v odměrném válci na obrázku odečítáš objem i v byretě: u spodního okraje menisku, s okem v jeho úrovni.' },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Titrační baňku stačí vypláchnout destilovanou vodou. Voda navíc nevadí, látkové množství kyseliny v baňce se tím nezmění. Byretu a pipetu ale vyplachuješ roztokem, který do nich plníš, jinak by ho zbylá voda zředila.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Pipetuje se vždy **pipetovacím nástavcem (balonkem)**, nikdy ústy. A když plníš byretu hydroxidem, měj nasazené brýle a byretu plň pod úrovní očí, kapka zásady v oku je vážný problém.',
        },
        { type: 'p', text: 'Spotřebu z byrety už umíš změřit. Teď z ní spočítáme koncentraci vzorku.' },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď kroky titrace.',
            items: [
              'Naplnit byretu odměrným roztokem a odečíst počáteční objem',
              'Odměřit pipetou vzorek do titrační baňky',
              'Přidat několik kapek indikátoru',
              'Přikapávat roztok z byrety, dokud se trvale nezmění barva',
              'Odečíst spotřebu a spočítat koncentraci',
            ],
            explain: 'Nejdřív připravíš byretu a vzorek, pak přidáš indikátor, titruješ do změny barvy a nakonec počítáš.',
          },
        },
      ],
    },
    {
      title: 'Výpočet z titrace: poměr 1 : 1',
      icon: 'calculator',
      blocks: [
        {
          type: 'p',
          text: 'V bodě ekvivalence platí poměr z chemické rovnice. Postup znáš z lekce 4-6 a má vždy čtyři kroky:',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Rovnice', text: 'vyčísli ji a přečti poměr látek' },
            { icon: 'burette', title: '$n$ odměrného roztoku', text: '$n = c·V$ ze spotřeby v byretě' },
            { icon: 'balance-scale', title: 'Přepočet poměrem', text: '$n$ látky ve vzorku' },
            { icon: 'flask', title: '$c$ vzorku', text: '$c = n/V$ (objem vzorku z pipety)' },
          ],
        },
        { type: 'p', text: 'Ve druhém i čtvrtém kroku se opakuje stejný vztah mezi látkovým množstvím, koncentrací a objemem:' },
        { type: 'formula', text: '$n = c·V$', caption: 'objem dosazuj v dm^{3}: 1 cm^{3} = 0,001 dm^{3}' },
        { type: 'p', text: 'Projdi všechny čtyři kroky na nejjednodušší titraci: kyselina chlorovodíková a hydroxid sodný.' },
        {
          type: 'example',
          problem: 'Na titraci 20,0 cm^{3} kyseliny chlorovodíkové se spotřebovalo 15,0 cm^{3} roztoku $NaOH$ o koncentraci 0,100 mol/dm^{3}. Jaká je koncentrace kyseliny?',
          steps: [
            'Rovnice: $HCl + NaOH -> NaCl + H2O$, poměr 1 : 1.',
            '$n(NaOH)$ = 0,100 mol/dm^{3} · 0,0150 dm^{3} = 0,00150 mol.',
            '$n(HCl)$ = $n(NaOH)$ = 0,00150 mol.',
            '$c(HCl)$ = 0,00150 mol : 0,0200 dm^{3} = 0,0750 mol/dm^{3}.',
          ],
          answer: '$c(HCl)$ = 0,075 mol/dm^{3}',
        },
        { type: 'p', text: 'Ve skutečné laboratoři titruješ několikrát a spotřeby se trochu liší. Které z nich do výpočtu patří?' },
        {
          type: 'example',
          title: 'Průměr ze souhlasných titrací',
          problem: 'Titrace 20,00 cm^{3} roztoku $NaOH$ kyselinou chlorovodíkovou o koncentraci 0,1000 mol/dm^{3} dala spotřeby 18,60 cm^{3} (orientační), 18,15 cm^{3} a 18,25 cm^{3}. Jaká je koncentrace $NaOH$?',
          steps: [
            'Orientační titrace se od ostatních liší o víc než 0,10 cm^{3}, do průměru ji nezapočítáš.',
            'Průměr souhlasných spotřeb: (18,15 + 18,25) : 2 = 18,20 cm^{3} = 0,01820 dm^{3}.',
            '$n(HCl)$ = 0,1000 mol/dm^{3} · 0,01820 dm^{3} = 1,820·10^{-3} mol = $n(NaOH)$ (poměr 1 : 1).',
            '$c(NaOH)$ = 1,820·10^{-3} mol : 0,02000 dm^{3} = 0,0910 mol/dm^{3}.',
          ],
          answer: '$c(NaOH)$ = 0,0910 mol/dm^{3}',
        },
        { type: 'p', text: 'Titrace odpoví i na praktickou otázku: kolik kyseliny je v octu z kuchyně? Ocet je na titraci příliš koncentrovaný, a proto ho nejdřív zředíme:' },
        {
          type: 'example',
          title: 'Kolik kyseliny je v octu?',
          problem: 'Odpipetuješ 10,0 cm^{3} octa a v odměrné baňce ho doplníš vodou na 100,0 cm^{3}. Na 10,0 cm^{3} zředěného roztoku se spotřebuje 13,4 cm^{3} $NaOH$ o koncentraci 0,100 mol/dm^{3}. Jaká je koncentrace kyseliny octové v octu?',
          steps: [
            'Rovnice: $CH3COOH + NaOH -> CH3COONa + H2O$, poměr 1 : 1.',
            '$n(NaOH)$ = 0,100 mol/dm^{3} · 0,0134 dm^{3} = 1,34·10^{-3} mol = $n(CH3COOH)$ v 10,0 cm^{3} zředěného roztoku.',
            '$c$(zředěný) = 1,34·10^{-3} mol : 0,0100 dm^{3} = 0,134 mol/dm^{3}.',
            'Ocet jsi zředil/a desetkrát, takže $c$(ocet) = 10 · 0,134 mol/dm^{3} = 1,34 mol/dm^{3}.',
            'Pro zajímavost: 1,34 mol/dm^{3} · 60 g/mol ≐ 80 g kyseliny v 1 dm^{3}, to odpovídá běžnému 8% octu.',
          ],
          answer: '$c(CH3COOH)$ = 1,34 mol/dm^{3}',
        },
        { type: 'p', text: 'S poměrem 1 : 1 už počítat umíš. Kyselina sírová nebo hydroxid vápenatý ale reagují v jiném poměru, a to výpočet mění.' },
        { type: 'game', gameId: 'titration', text: 'Vyzkoušej si titraci nanečisto: v minihře Titrace přikapáváš z byrety a ze spotřeby spočítáš koncentraci.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Na 25,0 cm^{3} roztoku $NaOH$ se spotřebovalo 20,0 cm^{3} $HCl$ o koncentraci 0,125 mol/dm^{3}. Jaká je koncentrace $NaOH$?',
            answer: 0.1,
            tolerance: 0.002,
            unit: 'mol/dm³',
            explain: '$n(HCl)$ = 0,125 · 0,0200 = 0,00250 mol = $n(NaOH)$; $c$ = 0,00250 : 0,0250 = 0,100 mol/dm^{3}.',
          },
        },
      ],
    },
    {
      title: 'Výpočet z titrace: poměr 1 : 2',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'Zatím reagovala jedna molekula kyseliny vždy s jednou jednotkou zásady. Dvojsytná kyselina sírová ale potřebuje na každou molekulu dva $OH^-$. Hydroxid vápenatý nebo barnatý zase potřebuje dvě molekuly $HCl$. ==Poměr z rovnice je tu 1 : 2 a nesmíš ho přehlédnout.==',
        },
        { type: 'reaction', equation: 'Ca(OH)2 + 2HCl -> CaCl2 + 2H2O', caption: 'na jednu vzorcovou jednotku $Ca(OH)2$ připadají dvě molekuly $HCl$' },
        { type: 'p', text: 'Začneme kyselinou sírovou s hydroxidem sodným. Rozhoduje třetí krok: látkové množství $NaOH$ dělíme dvěma, protože kyseliny je podle rovnice poloviční množství.' },
        {
          type: 'example',
          problem: 'Na titraci 10,0 cm^{3} kyseliny sírové se spotřebovalo 25,0 cm^{3} $NaOH$ o koncentraci 0,200 mol/dm^{3}. Jaká je koncentrace kyseliny?',
          steps: [
            'Rovnice: $H2SO4 + 2NaOH -> Na2SO4 + 2H2O$, poměr $n(H2SO4) : n(NaOH)$ = 1 : 2.',
            '$n(NaOH)$ = 0,200 mol/dm^{3} · 0,0250 dm^{3} = 0,00500 mol.',
            '$n(H2SO4)$ = 0,00500 mol : 2 = 0,00250 mol.',
            '$c(H2SO4)$ = 0,00250 mol : 0,0100 dm^{3} = 0,250 mol/dm^{3}.',
          ],
          answer: '$c(H2SO4)$ = 0,25 mol/dm^{3}',
        },
        { type: 'p', text: 'Teď obrácená situace z rovnice nahoře: na jednu jednotku $Ca(OH)2$ připadají dvě molekuly $HCl$. Dvěma tedy tentokrát dělíme $n(HCl)$:' },
        {
          type: 'example',
          problem: 'Na 50,0 cm^{3} vápenné vody se spotřebovalo 23,0 cm^{3} kyseliny chlorovodíkové o koncentraci 0,100 mol/dm^{3}. Jaká je koncentrace $Ca(OH)2$?',
          steps: [
            'Rovnice: $Ca(OH)2 + 2HCl -> CaCl2 + 2H2O$, tedy $n(Ca(OH)2)$ = $n(HCl)$ : 2.',
            '$n(HCl)$ = 0,100 mol/dm^{3} · 0,0230 dm^{3} = 2,30·10^{-3} mol.',
            '$n(Ca(OH)2)$ = 2,30·10^{-3} mol : 2 = 1,15·10^{-3} mol.',
            '$c(Ca(OH)2)$ = 1,15·10^{-3} mol : 0,0500 dm^{3} = 0,0230 mol/dm^{3}.',
          ],
          answer: '$c(Ca(OH)2)$ = 0,023 mol/dm^{3}, to je asi 1,7 g v 1 dm^{3}: nasycená vápenná voda.',
        },
        { type: 'p', text: 'Někdy neznáš koncentraci, ale objem: kolik kyseliny máš na neutralizaci připravit. Postup je stejný, jen poslední krok počítá $V = n/c$.' },
        {
          type: 'example',
          title: 'Hledáš objem',
          problem: 'Kolik cm^{3} kyseliny sírové o koncentraci 0,050 mol/dm^{3} zneutralizuje 20,0 cm^{3} $NaOH$ o koncentraci 0,120 mol/dm^{3}?',
          steps: [
            '$n(NaOH)$ = 0,120 mol/dm^{3} · 0,0200 dm^{3} = 2,40·10^{-3} mol.',
            '$n(H2SO4)$ = 2,40·10^{-3} mol : 2 = 1,20·10^{-3} mol.',
            '$V(H2SO4)$ = $n/c$ = 1,20·10^{-3} mol : 0,050 mol/dm^{3} = 0,0240 dm^{3}.',
          ],
          answer: '$V$ = 24,0 cm^{3}',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Rychlý vzorec $c_{1}·V_{1} = c_{2}·V_{2}$ platí jen pro poměr 1 : 1. U kyseliny sírové nebo $Ca(OH)2$ vždy počítej přes látková množství a poměr z rovnice.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Kontrola: napiš si pod rovnici poměr, třeba $n(H2SO4) : n(NaOH)$ = 1 : 2. Látka s větším koeficientem musí mít i větší látkové množství. Když ti vyjde naopak, dělil/a jsi místo násobení.',
        },
        { type: 'p', text: 'Koncentraci z titrace teď spočítáš pro oba poměry. Zbývá otázka, proč tolik záleží na volbě indikátoru. Odpověď dá titrační křivka.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Na 25,0 cm^{3} kyseliny sírové se spotřebovalo 20,0 cm^{3} $NaOH$ o koncentraci 0,250 mol/dm^{3}. Jaká je koncentrace kyseliny sírové?',
            answer: 0.1,
            tolerance: 0.002,
            unit: 'mol/dm³',
            explain: '$n(NaOH)$ = 0,250 · 0,0200 = 5,00·10^{-3} mol, $n(H2SO4)$ = 2,50·10^{-3} mol, $c$ = 2,50·10^{-3} : 0,0250 = 0,100 mol/dm^{3}.',
          },
        },
      ],
    },
    {
      title: 'Titrační křivky a volba indikátoru',
      icon: 'chart',
      blocks: [
        {
          type: 'p',
          text: 'Titraci jsme zatím sledovali jen podle barvy indikátoru. Když během titrace měříš pH a vyneseš ho do grafu proti objemu přidaného odměrného roztoku, dostaneš **titrační křivku**.',
        },
        {
          type: 'diagram',
          id: 'titration-curve',
          props: { kind: 'strong-strong' },
          caption: 'Titrace silné kyseliny silnou zásadou: v okolí bodu ekvivalence vyskočí pH zhruba ze 4 na 10.',
        },
        { type: 'p', text: 'Na křivce rozlišíš tři úseky a mezi nimi jeden klíčový bod. Každý říká, co se v baňce zrovna děje:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'lemon', title: 'Začátek', text: 'pH je nízké a roste pomalu, přidaná zásada se hned spotřebuje' },
            { icon: 'speed', title: 'Skok pH', text: 'kolem bodu ekvivalence stačí kapka a pH se změní o několik jednotek' },
            { icon: 'drop', title: 'Bod ekvivalence', text: 'u silné kyseliny a silné zásady pH = 7, v baňce je jen roztok soli (třeba $NaCl$)' },
            { icon: 'soap', title: 'Za bodem ekvivalence', text: 'nadbytek zásady, pH se ustálí vysoko' },
          ],
        },
        {
          type: 'p',
          text: 'U **slabé kyseliny**, třeba octové, odevzdá proton jen malá část molekul (podrobně v lekci 5-6). Její křivka proto začíná výš, skok pH je kratší a bod ekvivalence leží v zásadité oblasti, u kyseliny octové asi při pH 8,7. V baňce je totiž roztok octanu sodného a ten je slabě zásaditý.',
        },
        {
          type: 'diagram',
          id: 'titration-curve',
          props: { kind: 'weak-strong' },
          caption: 'Kyselina octová titrovaná hydroxidem sodným: barevné pásy ukazují, že do skoku pH padne fenolftalein, ale ne methyloranž.',
        },
        { type: 'p', text: 'Postav obě křivky vedle sebe. Všimni si, že se liší hlavně začátkem a polohou skoku, tedy právě tam, kde na indikátoru záleží:' },
        {
          type: 'compare',
          columns: [
            { title: 'Silná kyselina + silná zásada', icon: 'lightning', tone: 'a', points: ['$HCl$ + $NaOH$', 'začátek asi pH 1', 'skok asi od 4 do 10', 'bod ekvivalence při pH 7'] },
            { title: 'Slabá kyselina + silná zásada', icon: 'equilibrium', tone: 'b', points: ['$CH3COOH$ + $NaOH$', 'začátek asi pH 2,9', 'skok asi od 7,5 do 10', 'bod ekvivalence asi při pH 8,7'] },
          ],
          caption: 'Obě křivky pro kyselinu a zásadu o koncentraci 0,1 mol/dm^{3}. Za bodem ekvivalence jsou stejné, rozhoduje už jen nadbytek $NaOH$.',
        },
        {
          type: 'p',
          text: '==Indikátor musí měnit barvu uvnitř skoku pH.== Pak se **konec titrace** (změna barvy) od **bodu ekvivalence** (poměr podle rovnice) liší nejvýš o kapku.',
        },
        { type: 'p', text: 'Podle toho, kde skok leží, vybereš indikátor pro každý typ titrace:' },
        {
          type: 'table',
          headers: ['Titrace', 'pH v bodě ekvivalence', 'Vhodný indikátor'],
          rows: [
            ['silná kyselina + silná zásada ($HCl$ + $NaOH$)', '7', 'fenolftalein i methyloranž'],
            ['slabá kyselina + silná zásada ($CH3COOH$ + $NaOH$)', 'asi 8,7', 'fenolftalein'],
            ['silná kyselina + slabá zásada ($HCl$ + $NH3$)', 'asi 5,3', 'methyloranž nebo methylčerveň'],
            ['slabá kyselina + slabá zásada', 'bez ostrého skoku', 's indikátorem se titrovat nedá'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Kdybys kyselinu octovou titroval/a na methyloranž, změnila by barvu už zhruba ve třetině titrace. Konec titrace by byl daleko před bodem ekvivalence a vypočtená koncentrace úplně špatně.',
        },
        { type: 'p', text: 'Teď umíš titraci provést, spočítat i správně zvolit indikátor. Po neutralizaci ale v baňce vždy zůstane sůl, a solím a jejich názvům patří příští lekce.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který indikátor zvolíš pro titraci roztoku amoniaku kyselinou chlorovodíkovou?',
            options: ['methyloranž (3,1–4,4)', 'fenolftalein (8,2–10,0)', 'thymolftalein (9,3–10,5)'],
            answer: 0,
            explain: 'Amoniak je slabá zásada, v bodě ekvivalence je kyselý roztok $NH4Cl$ (pH asi 5,3) a skok leží v kyselé oblasti. Barvu v něm mění methyloranž.',
          },
        },
      ],
    },
  ],
  summary: [
    'Neutralizace: kyselina + hydroxid -> sůl + voda; iontová rovnice pro silné kyseliny a zásady je $H^+ + OH^- -> H2O$ a uvolní asi 57 kJ na mol vody.',
    'Antacida s $Mg(OH)2$ nebo $Al(OH)3$ a vápnění půdy jsou neutralizace v praxi.',
    'Při titraci přidáváš z byrety odměrný roztok o přesně známé (standardizované) koncentraci k pipetou odměřenému vzorku, dokud indikátor nezmění barvu.',
    'Bod ekvivalence je dán poměrem z rovnice, konec titrace změnou barvy indikátoru; dobrý indikátor je od sebe odchýlí nejvýš o kapku.',
    'Výpočet: $n = c·V$ odměrného roztoku, přepočet poměrem z rovnice (1 : 1 nebo 1 : 2), $c = n/V$ vzorku.',
    'Titrační křivka silné kyseliny se silnou zásadou má skok asi od 4 do 10 a bod ekvivalence při pH 7, u slabé kyseliny leží bod ekvivalence v zásadité oblasti.',
    'Indikátor musí měnit barvu uvnitř skoku pH: pro slabou kyselinu fenolftalein, pro slabou zásadu methyloranž.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Co vzniká neutralizací kyseliny sírové hydroxidem draselným?',
      options: ['$K2SO4$ a $H2O$', '$KSO4$ a $H2O$', '$K2SO4$ a $H2$', '$K2S$ a $H2O$'],
      answer: 0,
      explain: '$H2SO4 + 2KOH -> K2SO4 + 2H2O$. Síranový anion $SO4^2-$ potřebuje dva kationty $K^+$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec soli, která vzniká neutralizací kyseliny chlorovodíkové hydroxidem vápenatým.',
      accept: ['CaCl2'],
      caseSensitive: true,
      placeholder: 'např. NaCl',
      explain: '$2HCl + Ca(OH)2 -> CaCl2 + 2H2O$. Vzniká chlorid vápenatý.',
    },
    {
      kind: 'tf',
      q: 'Při neutralizaci se teplo spotřebovává, takže se roztok ochladí.',
      answer: false,
      explain: 'Neutralizace je exotermní, roztok se zahřívá. U silných kyselin a zásad se uvolní asi 57 kJ na mol vody.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k pomůcce nebo pojmu jeho úlohu při titraci.',
      pairs: [
        ['byreta', 'přikapává se z ní odměrný roztok'],
        ['pipeta', 'odměří přesný objem vzorku'],
        ['odměrný roztok', 'má přesně známou koncentraci'],
        ['konec titrace', 'indikátor změní barvu'],
      ],
      explain: 'Byreta dávkuje a měří spotřebu, pipeta odměřuje vzorek, odměrný roztok má standardizovanou koncentraci a konec titrace ohlásí indikátor.',
    },
    {
      kind: 'number',
      q: 'Na 20,0 cm^{3} kyseliny chlorovodíkové se spotřebovalo 12,5 cm^{3} $NaOH$ o koncentraci 0,160 mol/dm^{3}. Jaká je koncentrace $HCl$?',
      answer: 0.1,
      tolerance: 0.002,
      unit: 'mol/dm³',
      explain: '$n(NaOH)$ = 0,160 · 0,0125 = 0,00200 mol = $n(HCl)$; $c$ = 0,00200 : 0,0200 = 0,100 mol/dm^{3}.',
    },
    {
      kind: 'number',
      q: 'Kolik cm^{3} roztoku $NaOH$ o koncentraci 0,100 mol/dm^{3} spotřebuješ na neutralizaci 10,0 cm^{3} kyseliny sírové o koncentraci 0,050 mol/dm^{3}?',
      answer: 10,
      tolerance: 0.1,
      unit: 'cm³',
      explain: '$n(H2SO4)$ = 0,050 · 0,0100 = 0,00050 mol; $NaOH$ je potřeba dvakrát víc, 0,00100 mol; $V$ = 0,00100 : 0,100 = 0,0100 dm^{3} = 10 cm^{3}.',
    },
    {
      kind: 'choice',
      q: 'Který indikátor zvolíš pro titraci kyseliny octové hydroxidem sodným?',
      options: ['fenolftalein (8,2–10,0)', 'methyloranž (3,1–4,4)', 'bromthymolová modř (6,0–7,6)'],
      answer: 0,
      explain: 'Bod ekvivalence slabé kyseliny se silnou zásadou leží asi při pH 8,7 a skok je v zásadité oblasti. Barvu v něm mění fenolftalein.',
    },
    {
      kind: 'tf',
      q: 'Rychlý vzorec $c_{1}·V_{1} = c_{2}·V_{2}$ platí i pro titraci kyseliny sírové hydroxidem sodným.',
      answer: false,
      explain: 'Kyselina sírová reaguje s $NaOH$ v poměru 1 : 2, takže je nutné počítat přes látková množství a poměr z rovnice.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-5 Soli a jejich názvosloví                                       */
/* ------------------------------------------------------------------ */

const l55: Lesson = {
  id: 'l5-5',
  title: 'Soli a jejich názvosloví',
  goals: [
    'Uvést způsoby přípravy solí a zapsat je rovnicemi',
    'Pojmenovat soli kyslíkatých kyselin, hydrogensoli a hydráty a sestavit jejich vzorce',
    'Podle pravidel rozpustnosti předpovědět sraženinu a zapsat její vznik iontovou rovnicí',
    'Vyjmenovat důležité soli z běžného života a jejich použití',
  ],
  hook: 'Sůl na talíři je jen jedna z tisíců solí. Křída, sádra, jedlá soda, hnojivo na zahradě i modrá skalice ve vinici jsou taky soli. Zvládneš je všechny pojmenovat?',
  sections: [
    {
      title: 'Co je sůl a jak ji připravit',
      icon: 'salt',
      blocks: [
        {
          type: 'p',
          text: 'Po každé neutralizaci v minulé lekci zůstala v baňce sůl. **Soli** jsou iontové sloučeniny z **kationtu kovu** (nebo amonného kationtu $NH4^+$) a **aniontu kyseliny**. Můžeš si je představit jako kyselinu, ve které vodík nahradil kov.',
        },
        { type: 'p', text: 'Neutralizace ale není jediná cesta. V laboratoři k soli vedou čtyři:' },
        { type: 'diagram', id: 'salt-preparation', caption: 'Čtyři laboratorní cesty k soli: kyselina + neušlechtilý kov (unikají bublinky vodíku), kyselina + hydroxid (neutralizace), kyselina + uhličitan (šumí oxid uhličitý) a srážení roztoků dvou solí (vzniká bílá sraženina).' },
        { type: 'p', text: 'Sůl se dá připravit i úplně bez kyseliny, přímo z prvků:' },
        { type: 'reaction', equation: '2Na + Cl2 -> 2NaCl', caption: 'Další cesta – kov + nekov: přímá syntéza soli z prvků.' },
        {
          type: 'p',
          text: 'Typické reakce kyselin s kovy, oxidy, hydroxidy a uhličitany už znáš z lekce 5-1. Při přípravě soli v laboratoři jde hlavně o to, **kterou cestu zvolit**, abys dostal/a čistou sůl. Rozhoduje, jestli je sůl rozpustná.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Rozpustná sůl, např. $CuSO4$', icon: 'crystal', tone: 'a', points: ['kyselina + **nadbytek** nerozpustného oxidu, hydroxidu nebo uhličitanu', 'nezreagovaný zbytek odfiltruješ', 'filtrát zahustíš a necháš krystalizovat'] },
            { title: 'Sůl $Na^+$, $K^+$, $NH4^+$', icon: 'burette', tone: 'b', points: ['kyselina + alkálie', 'obě látky jsou rozpustné, nadbytek nejde odfiltrovat', 'přesný poměr najdeš titrací (lekce 5-4), pak odpaříš'] },
            { title: 'Nerozpustná sůl, např. $BaSO4$', icon: 'test-tube', tone: 'c', points: ['srážení dvou rozpustných solí', 'sraženinu odfiltruješ', 'promyješ vodou a vysušíš'] },
          ],
          caption: 'Jak zvolit cestu k soli',
        },
        { type: 'p', text: 'Projdi si celý postup pro rozpustnou sůl z prvního sloupce, modrou skalici. Všimni si, proč se přidává nadbytek oxidu:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'heat', title: 'Zahřej kyselinu', text: 'zředěnou $H2SO4$ v kádince mírně ohřej' },
            { icon: 'powder', title: 'Přidávej $CuO$', text: 'po lžičkách, až se černý prášek přestane rozpouštět' },
            { icon: 'funnel', title: 'Filtruj', text: 'nadbytečný $CuO$ zůstane na filtru, modrý filtrát projde' },
            { icon: 'burner', title: 'Zahusti', text: 'odpař část vody na odpařovací misce' },
            { icon: 'crystal', title: 'Krystalizuj', text: 'po ochlazení vyrostou modré krystaly $CuSO4·5H2O$' },
          ],
          caption: 'Příprava modré skalice: $CuO + H2SO4 -> CuSO4 + H2O$. Nadbytek oxidu zajistí, že v roztoku nezůstane žádná kyselina.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Při zahušťování nech roztok odpařit jen částečně a pracuj v brýlích: horký roztok prská. Síran měďnatý je zdraví škodlivý a jedovatý pro vodní organismy, zbytky nelij do odpadu.',
        },
        { type: 'p', text: 'Teď víš, jak sůl připravit. Aby ses v solích vyznal/a, potřebuješ jim ale umět říkat jménem.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jak nejlépe připravíš čistý nerozpustný síran barnatý?',
            options: [
              'smícháním roztoků $BaCl2$ a $Na2SO4$ a odfiltrováním sraženiny',
              'odpařením roztoku chloridu barnatého do sucha',
              'rozpuštěním $BaCO3$ v kyselině sírové a krystalizací filtrátu',
              'zahříváním pevného $BaCl2$ se sírou',
            ],
            answer: 0,
            explain: 'Nerozpustné soli se připravují srážením: $BaCl2 + Na2SO4 -> BaSO4(s) + 2NaCl$. Sraženinu odfiltruješ, promyješ a vysušíš. $BaCO3$ by se v kyselině sírové obalil nerozpustným $BaSO4$ a reakce by se zastavila.',
          },
        },
      ],
    },
    {
      title: 'Názvosloví solí kyslíkatých kyselin',
      icon: 'book',
      blocks: [
        {
          type: 'p',
          text: 'Solí je obrovské množství, ale jejich názvy se tvoří podle jednoho pravidla. Název soli = **podstatné jméno podle aniontu** + **přídavné jméno podle kationtu**. Soli bezkyslíkatých kyselin znáš z lekce 3-6 (chlorid sodný). U kyslíkatých kyselin se koncovka změní takto:',
        },
        {
          type: 'table',
          headers: ['Kyselina', 'Oxidační číslo', 'Anion', 'Název aniontu'],
          rows: [
            ['chlorná $HClO$', 'I', '$ClO^-$', 'chlor**nan**'],
            ['dusitá $HNO2$', 'III', '$NO2^-$', 'dusi**tan**'],
            ['siřičitá $H2SO3$', 'IV', '$SO3^2-$', 'siřiči**tan**'],
            ['uhličitá $H2CO3$', 'IV', '$CO3^2-$', 'uhliči**tan**'],
            ['dusičná $HNO3$', 'V', '$NO3^-$', 'dusič**nan**'],
            ['fosforečná $H3PO4$', 'V', '$PO4^3-$', 'fosforeč**nan**'],
            ['sírová $H2SO4$', 'VI', '$SO4^2-$', 'sír**an**'],
            ['chloristá $HClO4$', 'VII', '$ClO4^-$', 'chloris**tan**'],
            ['manganistá $HMnO4$', 'VII', '$MnO4^-$', 'manganis**tan**'],
          ],
        },
        { type: 'p', text: 'V názvu aniontu se tedy skrývá kyselina, ze které pochází. Jak nejčastější anionty vypadají a jaký mají náboj, ukazuje model:' },
        {
          type: 'molecule',
          molecules: ['NO3-', 'SO4^2-', 'CO3^2-', 'PO4^3-'],
          labels: ['dusičnan $NO3^-$', 'síran $SO4^2-$', 'uhličitan $CO3^2-$', 'fosforečnan $PO4^3-$'],
          caption: 'Nejčastější víceatomové anionty. ==Náboj aniontu se rovná počtu vodíků, které kyselina odevzdala.==',
        },
        { type: 'p', text: 'Náboj aniontu tedy zjistíš z kyseliny. Stačí ho vyrovnat nábojem kationtu, a máš vzorec soli:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'flask', title: 'Kyselina', text: 'dusičnan -> kyselina dusičná $HNO3$' },
            { icon: 'ion-minus', title: 'Anion', text: 'odtrhni $H^+$: zbude $NO3^-$' },
            { icon: 'ion-plus', title: 'Kation', text: 'vápenatý -> $Ca^{2+}$' },
            { icon: 'balance-scale', title: 'Vyrovnej náboje', text: '+2 potřebuje dva $NO3^-$, víceatomový anion do závorky' },
            { icon: 'salt', title: 'Sůl', text: '$Ca(NO3)2$, dusičnan vápenatý' },
          ],
          caption: 'Od kyseliny přes anion k soli.',
        },
        { type: 'p', text: 'Často jdeš obráceně, od vzorce k názvu. Oxidační číslo kovu pak musíš dopočítat z náboje aniontů:' },
        {
          type: 'example',
          problem: 'Pojmenuj $Fe2(SO4)3$.',
          steps: [
            'Anion $SO4^2-$ je síran (z kyseliny sírové).',
            'Tři sírany nesou dohromady náboj 3 · (−2) = −6.',
            'Dva atomy železa tedy mají dohromady +6, každý +3: $Fe^{III}$ -> železitý.',
          ],
          answer: '$Fe2(SO4)3$ je **síran železitý**.',
        },
        { type: 'p', text: 'A teď zase od názvu ke vzorci, u soli, kde se náboje kationtu a aniontu liší:' },
        {
          type: 'example',
          problem: 'Napiš vzorec fosforečnanu vápenatého.',
          steps: [
            'Kyselina $H3PO4$ odevzdá tři $H^+$, anion je $PO4^3-$.',
            'Kation je $Ca^{2+}$. Nejmenší společný násobek nábojů 2 a 3 je 6.',
            '3 · (+2) = +6 a 2 · (−3) = −6, náboje se vyrovnají.',
          ],
          answer: '$Ca3(PO4)2$',
        },
        { type: 'p', text: 'Soli kyselin, které odevzdaly všechny vodíky, už pojmenuješ. Vícesytná kyselina ale může odevzdat jen část vodíků, a pak vznikne zvláštní druh soli.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec uhličitanu sodného.',
            accept: ['Na2CO3'],
            caseSensitive: true,
            placeholder: 'např. K2SO4',
            explain: 'Uhličitan $CO3^2-$ (z $H2CO3$) a dva kationty $Na^+$: $Na2CO3$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj $KClO$.',
            accept: ['chlornan draselný'],
            explain: '$ClO^-$ pochází z kyseliny chlorné (Cl I), anion je chlornan; draslík je draselný.',
          },
        },
      ],
    },
    {
      title: 'Hydrogensoli',
      icon: 'ion-minus',
      blocks: [
        {
          type: 'p',
          text: 'Vícesytná kyselina odevzdává protony postupně, po jednom (lekce 5-1). Když si anion kyseliny část vodíků ponechá, vznikne **hydrogensůl** (předpona **hydrogen-** nebo **dihydrogen-**). Každý ponechaný vodík zmenší záporný náboj aniontu o 1.',
        },
        { type: 'p', text: 'Na kyselině uhličité jsou vidět všechny tři stupně: kyselina, anion s jedním vodíkem a anion bez vodíku.' },
        { type: 'molecule', molecules: ['H2CO3', 'HCO3-', 'CO3^2-'], labels: ['kyselina uhličitá', 'hydrogenuhličitan', 'uhličitan'] },
        { type: 'p', text: 'Stejné pravidlo platí pro všechny vícesytné kyseliny. U kyseliny fosforečné vzniknou dokonce tři různé anionty:' },
        {
          type: 'table',
          headers: ['Anion', 'Náboj', 'Název aniontu', 'Příklad soli'],
          rows: [
            ['$HCO3^-$', '−1', 'hydrogenuhličitan', '$NaHCO3$, hydrogenuhličitan sodný'],
            ['$HSO4^-$', '−1', 'hydrogensíran', '$KHSO4$, hydrogensíran draselný'],
            ['$H2PO4^-$', '−1', 'dihydrogenfosforečnan', '$Ca(H2PO4)2$, dihydrogenfosforečnan vápenatý'],
            ['$HPO4^2-$', '−2', 'hydrogenfosforečnan', '$CaHPO4$, hydrogenfosforečnan vápenatý'],
            ['$PO4^3-$', '−3', 'fosforečnan', '$Na3PO4$, fosforečnan sodný'],
          ],
        },
        { type: 'p', text: 'Při psaní vzorce hydrogensoli rozhoduje náboj aniontu a ten ti prozradí počet vodíků v názvu:' },
        {
          type: 'example',
          problem: 'Napiš vzorec dihydrogenfosforečnanu sodného.',
          steps: [
            'Kyselina $H3PO4$ odevzdá jen jeden $H^+$ a dva si ponechá: $H2PO4^-$.',
            'Sodný znamená $Na^+$. Náboje +1 a −1 se vyrovnají v poměru 1 : 1.',
          ],
          answer: '$NaH2PO4$',
        },
        { type: 'p', text: 'Opačný směr: ze vzorce poznáš, kolik vodíků si anion ponechal.' },
        {
          type: 'example',
          problem: 'Pojmenuj $Mg(HCO3)2$.',
          steps: [
            'Anion $HCO3^-$ vznikl z kyseliny uhličité, která si ponechala jeden vodík: hydrogenuhličitan.',
            'Dva anionty s nábojem −1 vyrovnává $Mg^{2+}$: hořečnatý.',
          ],
          answer: '**hydrogenuhličitan hořečnatý**',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Hydrogenuhličitan sodný je **jedlá soda**. Při pečení se rozkládá a v kypřicím prášku navíc reaguje s kyselou složkou. Bublinky $CO2$ nakypří těsto.',
        },
        { type: 'p', text: 'Jak se jedlá soda teplem rozkládá, ukazuje rovnice:' },
        { type: 'reaction', equation: '2NaHCO3 -> Na2CO3 + H2O + CO2', caption: 'rozklad jedlé sody teplem' },
        { type: 'p', text: 'Hydrogensoli si tedy ponechávají vodík. Jiné soli zase vážou v krystalu celé molekuly vody.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec hydrogenuhličitanu vápenatého.',
            accept: ['Ca(HCO3)2'],
            caseSensitive: true,
            placeholder: 'např. Mg(HCO3)2',
            explain: '$Ca^{2+}$ potřebuje dva anionty $HCO3^-$: $Ca(HCO3)2$. Tahle sůl je rozpuštěná v tvrdé vodě a při varu z ní vzniká vodní kámen.',
          },
        },
      ],
    },
    {
      title: 'Hydráty: krystaly s vodou',
      icon: 'crystal',
      blocks: [
        {
          type: 'p',
          text: 'Modrá skalice z prvního oddílu má ve vzorci tečku a pět molekul vody. Některé soli totiž krystalizují s pevně vázanou **krystalovou vodou**, říkáme jim **hydráty**. Ve vzorci se voda připojuje tečkou: $CuSO4·5H2O$ je **pentahydrát síranu měďnatého** (předpona + hydrát + název soli ve 2. pádě).',
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'Řecké předpony',
          text: 'mono- (1), di- (2), tri- (3), tetra- (4), penta- (5), hexa- (6), hepta- (7), okta- (8), nona- (9), deka- (10); pro půl molekuly vody hemi-.',
        },
        { type: 'p', text: 'Krystalová voda není vlhkost na povrchu, ale součást krystalu. Podívej se, jak jsou molekuly vody rozmístěné mezi ionty:' },
        {
          type: 'particles',
          boxes: [
            { label: 'krystal $CuSO4·5H2O$', items: [{ species: 'Cu^{2+}', count: 2 }, { species: 'SO4^2-', count: 2 }, { species: 'H2O', count: 10 }], state: 'solid', note: 'molekuly vody jsou pevně vázané v krystalu' },
          ],
          caption: 'Na každou vzorcovou jednotku $CuSO4$ připadá pět molekul krystalové vody.',
        },
        { type: 'p', text: 'Hydrátů je hodně a mnohé znáš pod běžnými názvy. Všimni si, že sádrovec a pálená sádra se liší jen množstvím vody:' },
        {
          type: 'table',
          headers: ['Vzorec', 'Název', 'Běžný název'],
          rows: [
            ['$CuSO4·5H2O$', 'pentahydrát síranu měďnatého', 'modrá skalice'],
            ['$FeSO4·7H2O$', 'heptahydrát síranu železnatého', 'zelená skalice'],
            ['$CaSO4·2H2O$', 'dihydrát síranu vápenatého', 'sádrovec'],
            ['$CaSO4·½H2O$', 'hemihydrát síranu vápenatého', 'pálená sádra'],
            ['$Na2CO3·10H2O$', 'dekahydrát uhličitanu sodného', 'krystalová soda'],
          ],
        },
        { type: 'p', text: 'Pozor při výpočtech: krystalová voda patří k hmotnosti hydrátu, takže ji do molární hmotnosti musíš započítat.' },
        {
          type: 'example',
          problem: 'Jaká je molární hmotnost modré skalice $CuSO4·5H2O$?',
          steps: [
            '$M(CuSO4)$ = 63,5 + 32 + 4 · 16 = 159,5 g/mol.',
            '$M(5H2O)$ = 5 · 18 g/mol = 90 g/mol.',
            'Sečti: 159,5 g/mol + 90 g/mol = 249,5 g/mol.',
          ],
          answer: '$M(CuSO4·5H2O)$ = 249,5 g/mol',
        },
        { type: 'p', text: 'Krystalovou vodu jde ze soli i vyhnat. Stačí modrou skalici zahřát:' },
        { type: 'reaction', equation: 'CuSO4·5H2O -> CuSO4 + 5H2O', caption: 'zahřátím ztratí modrá skalice krystalovou vodu a zbělá' },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Bílý bezvodý $CuSO4$ po kápnutí vody zase zmodrá, a proto slouží jako důkaz vody. Podobně tuhne sádra: pálená sádra přijme vodu a změní se zpět na tvrdý sádrovec.',
        },
        { type: 'p', text: 'Hydráty už pojmenuješ i spočítáš. Teď se podíváme, co se se solemi děje ve vodě: některé se rozpustí a jiné vytvoří sraženinu.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj $Na2SO4·10H2O$.',
            accept: ['dekahydrát síranu sodného'],
            explain: 'Deset molekul vody = deka-, sůl $Na2SO4$ je síran sodný, ve 2. pádě síranu sodného. Říká se mu Glauberova sůl.',
          },
        },
      ],
    },
    {
      title: 'Rozpustnost solí a srážení',
      icon: 'test-tube',
      blocks: [
        {
          type: 'p',
          text: 'Už při přípravě solí rozhodovalo, jestli je sůl rozpustná. Některé soli se ve vodě rozpouštějí výborně, jiné skoro vůbec. Když smícháš roztoky dvou solí a ionty se mohou spojit do nerozpustné soli, vyloučí se **sraženina**.',
        },
        { type: 'p', text: 'Kterou sůl čekat jako sraženinu, poznáš podle několika pravidel. Nejjistější vodítko jsou ionty, jejichž soli se rozpouštějí vždy:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Rozpustné',
              icon: 'drop',
              tone: 'good',
              points: [
                'všechny soli $Na^+$, $K^+$, $NH4^+$',
                'všechny dusičnany $NO3^-$',
                'chloridy, bromidy a jodidy (kromě solí $Ag^+$ a $Pb^{2+}$; $PbCl2$ se rozpouští málo)',
                'většina síranů $SO4^2-$ (kromě $BaSO4$, $PbSO4$, málo $CaSO4$)',
              ],
            },
            {
              title: 'Většinou nerozpustné',
              icon: 'powder',
              tone: 'bad',
              points: [
                'uhličitany $CO3^2-$ a fosforečnany $PO4^3-$ (kromě solí $Na^+$, $K^+$, $NH4^+$)',
                'hydroxidy $OH^-$ (kromě $NaOH$, $KOH$, $Ba(OH)2$, málo $Ca(OH)2$)',
                'sulfidy $S^2-$ (kromě solí $Na^+$, $K^+$, $NH4^+$)',
              ],
            },
          ],
          caption: 'Pravidla rozpustnosti ve vodě',
        },
        { type: 'p', text: 'Podle pravidel je $BaSO4$ nerozpustný. Co se tedy stane, když smícháš roztoky $BaCl2$ a $Na2SO4$? Sleduj jednotlivé ionty:' },
        {
          type: 'particles',
          boxes: [
            { label: 'hned po smíchání $BaCl2$ a $Na2SO4$', items: [{ species: 'Ba^{2+}', count: 2 }, { species: 'Cl^-', count: 4 }, { species: 'Na^+', count: 4 }, { species: 'SO4^2-', count: 2 }], state: 'solution' },
            { label: 'po chvíli', items: [{ species: 'BaSO4', count: 2 }, { species: 'Na^+', count: 4 }, { species: 'Cl^-', count: 4 }], state: 'solution', note: 'bílá sraženina $BaSO4$ klesá ke dnu' },
          ],
          arrows: true,
          caption: 'Ionty $Na^+$ a $Cl^-$ zůstaly v roztoku beze změny, jsou to **ionty-diváci**. Doopravdy se spojily jen $Ba^{2+}$ a $SO4^2-$.',
        },
        {
          type: 'p',
          text: 'Molekulová rovnice srážení tedy neukazuje, co se skutečně děje. Proto se srážení zapisuje **iontovou rovnicí**, ve které ionty-diváky vynecháš.',
        },
        { type: 'p', text: 'Iontovou rovnici napíšeš ve čtyřech krocích:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Molekulová rovnice', text: 'vyčísli ji, sraženinu označ $(s)$' },
            { icon: 'ion-plus', title: 'Rozepiš na ionty', text: 'rozpustné soli zapiš jako ionty, sraženinu ne' },
            { icon: 'cross', title: 'Škrtni diváky', text: 'ionty, které jsou na obou stranách beze změny' },
            { icon: 'check', title: 'Iontová rovnice', text: 'zkontroluj počty atomů i součet nábojů' },
          ],
          caption: 'Jak napsat iontovou rovnici srážení',
        },
        { type: 'p', text: 'Vyzkoušej postup na dusičnanu olovnatém a jodidu draselném. Nejdřív musíš podle pravidel rozhodnout, která sůl je nerozpustná:' },
        {
          type: 'example',
          problem: 'Zapiš iontovou rovnici reakce roztoků dusičnanu olovnatého a jodidu draselného.',
          steps: [
            'Molekulová rovnice: $Pb(NO3)2 + 2KI -> PbI2(s) + 2KNO3$. Jodid olovnatý je nerozpustný, dusičnan draselný rozpustný.',
            'Rozepsání na ionty: $Pb^{2+} + 2NO3^- + 2K^+ + 2I^- -> PbI2(s) + 2K^+ + 2NO3^-$.',
            'Ionty-diváci $K^+$ a $NO3^-$ jsou na obou stranách, škrtni je.',
            'Kontrola: vlevo 1 Pb, 2 I a náboj +2 − 2 = 0; vpravo neutrální $PbI2$.',
          ],
          answer: '$Pb^{2+} + 2I^- -> PbI2(s)$: vznikne sytě žlutá sraženina jodidu olovnatého.',
        },
        { type: 'p', text: 'Výsledná iontová rovnice platí pro jakoukoli dvojici rozpustné olovnaté soli a rozpustného jodidu:' },
        { type: 'reaction', equation: 'Pb^2+ + 2I^- -> PbI2', caption: 'žlutá sraženina jodidu olovnatého; ze stejného důvodu vzniká s jakýmkoli rozpustným jodidem a olovnatou solí' },
        { type: 'p', text: 'Stejně stručně se zapisuje i srážení chloridu stříbrného, kterým se dokazují chloridy:' },
        { type: 'reaction', equation: 'Ag^+ + Cl^- -> AgCl', caption: 'bílá sraženina chloridu stříbrného: iontová rovnice pro $AgNO3 + NaCl$ i pro $AgNO3 + HCl$ (důkaz chloridů, úroveň 7)' },
        {
          type: 'callout',
          variant: 'remember',
          text: '==Iontová rovnice ukazuje jen ionty, které se opravdu spojí.== Proto má reakce $BaCl2$ s $Na2SO4$ i reakce $Ba(NO3)2$ s $K2SO4$ stejnou iontovou rovnici $Ba^{2+} + SO4^2- -> BaSO4(s)$.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Sloučeniny olova a rozpustné sloučeniny barya jsou jedovaté. Pokusy s nimi dělej jen v malých množstvích, v rukavicích, a zbytky patří do sběrné nádoby na těžké kovy.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Přesto pacienti před rentgenem pijí „baryovou kaši“ se síranem barnatým. Je tak nerozpustný, že se v těle téměř nevstřebá, a přitom dobře pohlcuje rentgenové záření.',
        },
        { type: 'p', text: 'Teď předpovíš, kdy vznikne sraženina, a zapíšeš to iontovou rovnicí. Na závěr se podíváme, které soli potkáš doma, na zahradě i v lékárně.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která iontová rovnice vystihuje, co se stane po smíchání roztoků $CuSO4$ a $NaOH$?',
            options: [
              '$Cu^{2+} + 2OH^- -> Cu(OH)2(s)$',
              '$2Na^+ + SO4^2- -> Na2SO4(s)$',
              '$Cu^{2+} + SO4^2- -> CuSO4(s)$',
              '$Na^+ + OH^- -> NaOH(s)$',
            ],
            answer: 0,
            explain: 'Nerozpustný je jen hydroxid měďnatý (modrá sraženina). Sodné soli jsou rozpustné, takže $Na^+$ a $SO4^2-$ jsou ionty-diváci.',
          },
        },
      ],
    },
    {
      title: 'Soli kolem nás',
      icon: 'magnifier',
      blocks: [
        { type: 'p', text: 'Na začátku lekce zaznělo, že sůl na talíři je jen jedna z mnoha. Tady jsou soli, které potkáš nejčastěji, i s názvy podle pravidel z této lekce:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: 'chlorid sodný $NaCl$', text: 'kuchyňská sůl, posyp silnic, fyziologický roztok (0,9 %)' },
            { icon: 'mountain', title: 'uhličitan vápenatý $CaCO3$', text: 'vápenec, mramor, křída, vodní kámen, skořápky' },
            { icon: 'bread', title: 'hydrogenuhličitan sodný $NaHCO3$', text: 'jedlá soda, kypřicí prášek, šumivé tablety' },
            { icon: 'bone', title: 'hemihydrát síranu vápenatého $CaSO4·½H2O$', text: 'sádra, sádrové obvazy a odlitky' },
            { icon: 'leaf', title: 'pentahydrát síranu měďnatého $CuSO4·5H2O$', text: 'postřik proti plísním ve vinicích, hubení řas' },
            { icon: 'soap', title: 'chlornan sodný $NaClO$', text: 'bělicí a dezinfekční prostředky na WC' },
            { icon: 'drop', title: 'manganistan draselný $KMnO4$', text: 'dezinfekce („hypermangan“)' },
            { icon: 'hazard', title: 'dusitan sodný $NaNO2$', text: 'složka rychlosoli na maso (E250), ve větším množství jedovatý' },
          ],
        },
        {
          type: 'p',
          text: '**Průmyslová hnojiva** (NPK) dodávají rostlinám dusík, fosfor a draslík. Obsahují třeba dusičnan amonný $NH4NO3$, síran amonný $(NH4)2SO4$, $Ca(H2PO4)2$ nebo $KCl$.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Nikdy nemíchej čisticí prostředek s chlornanem sodným s kyselým čističem na WC ani s octem! Uvolní se jedovatý chlor.',
        },
        { type: 'p', text: 'Proč je ta směs tak nebezpečná? Chlornan reaguje s kyselinou za vzniku chloru:' },
        { type: 'reaction', equation: 'NaClO + 2HCl -> NaCl + Cl2 + H2O', caption: 'chlornan + kyselina -> jedovatý plynný chlor' },
        { type: 'p', text: 'Teď znáš soli od přípravy až po název. V příští lekci se na kyseliny a zásady podíváš znovu a obecněji: podle Brønsteda jde vždy o předání protonu.' },
        { type: 'game', gameId: 'naming', text: 'Soli jsou v Názvoslovném trenažéru královská disciplína. Zkus kolo se solemi kyslíkatých kyselin a hydráty.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k běžnému názvu vzorec.',
            pairs: [
              ['modrá skalice', '$CuSO4·5H2O$'],
              ['jedlá soda', '$NaHCO3$'],
              ['vápenec', '$CaCO3$'],
              ['hypermangan', '$KMnO4$'],
              ['sádrovec', '$CaSO4·2H2O$'],
            ],
            explain: 'Modrá skalice je pentahydrát síranu měďnatého, jedlá soda hydrogenuhličitan sodný, vápenec uhličitan vápenatý, hypermangan manganistan draselný a sádrovec dihydrát síranu vápenatého.',
          },
        },
      ],
    },
  ],
  summary: [
    'Soli vznikají reakcí kyseliny s hydroxidem, kovem, oxidem kovu nebo uhličitanem, srážením a přímou syntézou z prvků; rozpustnou sůl připravíš z kyseliny a nadbytku nerozpustného oxidu, nerozpustnou srážením.',
    'Anionty kyslíkatých kyselin: -ná -> -nan, -itá -> -itan, -ičitá -> -ičitan, -ičná/-ečná -> -ičnan/-ečnan, -ová -> -an, -istá -> -istan.',
    'Náboj aniontu se rovná počtu odevzdaných vodíků: $NO3^-$, $SO4^2-$, $PO4^3-$.',
    'Hydrogensoli si ponechávají vodík: $NaHCO3$ je hydrogenuhličitan sodný, $NaH2PO4$ dihydrogenfosforečnan sodný.',
    'Hydráty obsahují krystalovou vodu: $CuSO4·5H2O$ je pentahydrát síranu měďnatého.',
    'Sodné, draselné a amonné soli a všechny dusičnany jsou rozpustné; $AgCl$, $PbI2$, $BaSO4$ a $CaCO3$ ne.',
    'Srážení zapisuješ iontovou rovnicí bez iontů-diváků, např. $Ba^{2+} + SO4^2- -> BaSO4(s)$.',
  ],
  quiz: [
    {
      kind: 'text',
      q: 'Napiš vzorec síranu hlinitého.',
      accept: ['Al2(SO4)3'],
      caseSensitive: true,
      placeholder: 'např. Fe2(SO4)3',
      explain: '$Al^{3+}$ a $SO4^2-$: nejmenší společný násobek je 6, tedy 2 $Al^{3+}$ a 3 $SO4^2-$: $Al2(SO4)3$.',
    },
    {
      kind: 'multi',
      q: 'Které soli jsou ve vodě dobře rozpustné?',
      options: ['$KNO3$', '$(NH4)2SO4$', '$AgCl$', '$CaCO3$', '$Na3PO4$'],
      answers: [0, 1, 4],
      explain: 'Soli draslíku, sodíku a amonné soli jsou rozpustné. $AgCl$ a $CaCO3$ patří k výjimkám, které tvoří sraženiny.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj $K2HPO4$.',
      accept: ['hydrogenfosforečnan draselný'],
      explain: 'Anion $HPO4^2-$ si ponechal jeden vodík z $H3PO4$: hydrogenfosforečnan. Dva $K^+$ vyrovnají náboj −2.',
    },
    {
      kind: 'choice',
      q: 'Jak se jmenuje $Mg(ClO4)2$?',
      options: ['chloristan hořečnatý', 'chlorečnan hořečnatý', 'chlornan hořečnatý', 'chlorid hořečnatý'],
      answer: 0,
      explain: 'V $ClO4^-$ má chlor oxidační číslo VII (x − 8 = −1), anion je chloristan.',
    },
    {
      kind: 'tf',
      q: 'Všechny dusičnany jsou ve vodě rozpustné.',
      answer: true,
      explain: 'Dusičnany patří spolu se solemi sodíku, draslíku a amonnými solemi mezi vždy rozpustné.',
    },
    {
      kind: 'tf',
      q: 'Když smícháš roztoky $NaCl$ a $KNO3$, vznikne sraženina.',
      answer: false,
      explain: 'Možné kombinace $NaNO3$ a $KCl$ jsou obě rozpustné, všechny ionty jsou diváci a zůstanou v roztoku.',
    },
    {
      kind: 'number',
      q: 'Jaká je molární hmotnost sádrovce $CaSO4·2H2O$?',
      answer: 172,
      unit: 'g/mol',
      explain: '40 + 32 + 4 · 16 + 2 · 18 = 136 + 36 = 172 g/mol.',
    },
    {
      kind: 'order',
      q: 'Seřaď anionty podle rostoucího oxidačního čísla chloru.',
      items: ['chlorid', 'chlornan', 'chloritan', 'chlorečnan', 'chloristan'],
      explain: 'Chlorid −I, chlornan I, chloritan III, chlorečnan V, chloristan VII.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-6 Teorie kyselin a zásad podle Brønsteda                         */
/* ------------------------------------------------------------------ */

const l56: Lesson = {
  id: 'l5-6',
  title: 'Teorie kyselin a zásad podle Brønsteda',
  goals: [
    'Určit v reakci Brønstedovu kyselinu a zásadu a najít konjugované páry',
    'Vysvětlit, co je amfoterní látka, na příkladu vody a $HCO3^-$',
    'Rozlišit silné a slabé kyseliny a zásady a spočítat stupeň disociace',
    'Předpovědět pH roztoku soli a rozpoznat Lewisovu kyselinu a zásadu',
  ],
  hook: 'Postav otevřenou láhev čpavku vedle láhve kyseliny chlorovodíkové a nad hrdly se objeví bílý dým. Žádná voda, žádné $OH^-$, a přece reakce kyseliny se zásadou. Arrhenius by tu byl v koncích.',
  sections: [
    {
      title: 'Kyselina dává, zásada bere',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Arrheniova teorie funguje jen ve vodě a amoniak vysvětluje špatně. V roce 1923 proto Dán Johannes **Brønsted** a Angličan Thomas **Lowry** nezávisle navrhli obecnější definici založenou na předávání **protonu** $H^+$.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Arrhenius', icon: 'drop', tone: 'a', points: ['kyselina uvolňuje ve vodě $H^+$', 'zásada uvolňuje ve vodě $OH^-$', 'platí jen ve vodných roztocích', 'amoniak vysvětlí jen s obtížemi'] },
            { title: 'Brønsted a Lowry', icon: 'ion-plus', tone: 'b', points: ['kyselina je **donor protonu**', 'zásada je **akceptor protonu**', 'funguje i bez vody, třeba mezi plyny', 'amoniak je zásada, protože přijme $H^+$'] },
          ],
        },
        { type: 'p', text: 'Nová definice tedy sleduje jediné: kdo proton odevzdá a kdo ho přijme. Shrňme si pojmy, které z toho plynou:' },
        {
          type: 'keyterms',
          items: [
            { term: 'Brønstedova kyselina', def: '**donor protonu**: částice, která $H^+$ odevzdá' },
            { term: 'Brønstedova zásada', def: '**akceptor protonu**: částice, která $H^+$ přijme; potřebuje k tomu volný elektronový pár' },
            { term: 'acidobazická reakce', def: 'přenos protonu z kyseliny na zásadu' },
          ],
        },
        { type: 'p', text: 'Podívej se, jak to vypadá v reakci, kterou znáš z lekce 5-1:' },
        { type: 'formula', text: '$HCl + H2O -> H3O^+ + Cl^-$', caption: '$HCl$ je kyselina (odevzdá $H^+$), voda je tady zásada (přijme ho).' },
        { type: 'p', text: 'A teď amoniak z lekce 5-2. Pozor na vodu: tentokrát proton odevzdává, takže hraje opačnou roli než před chvílí.' },
        { type: 'formula', text: '$NH3 + H2O <=> NH4^+ + OH^-$', caption: 'Tady je naopak voda kyselinou a amoniak zásadou.' },
        {
          type: 'p',
          text: 'A bílý dým z úvodu? Plynný chlorovodík předá proton plynnému amoniaku a vznikne jemný prášek chloridu amonného. Voda ani hydroxidové anionty k tomu nejsou potřeba. (Pokus patří do digestoře: výpary obou koncentrovaných roztoků leptají sliznice.)',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'páry nad hrdly lahví', items: [{ species: 'HCl', count: 3 }, { species: 'NH3', count: 3 }], state: 'gas' },
            { label: 'bílý dým', items: [{ species: 'NH4Cl', count: 3 }], state: 'solid', note: 'drobné krystalky $NH4Cl$' },
          ],
          arrows: true,
          caption: '$HCl(g) + NH3(g) -> NH4Cl(s)$: proton přeskočí z $HCl$ na $NH3$ přímo v plynné fázi.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '==Kyselinou nebo zásadou látka není sama o sobě.== Rozhoduje, co v dané reakci dělá: jestli proton odevzdá, nebo přijme.',
        },
        { type: 'p', text: 'Kyselinu a zásadu teď poznáš podle toho, co dělají s protonem. Zajímavé je, co z kyseliny zbude, když proton odevzdá.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která částice je v reakci $HNO3 + H2O -> H3O^+ + NO3^-$ Brønstedovou zásadou?',
            options: ['$H2O$', '$HNO3$', '$H3O^+$'],
            answer: 0,
            explain: 'Voda přijme proton od kyseliny dusičné a stane se z ní $H3O^+$. Přijímat proton je úloha zásady.',
          },
        },
      ],
    },
    {
      title: 'Konjugované páry',
      icon: 'equilibrium',
      blocks: [
        {
          type: 'p',
          text: 'Když kyselina odevzdá proton, to, co z ní zbude, ho může zase přijmout: zbytek kyseliny je tedy zásada. Kyselina a zásada, které se liší právě o jeden proton, tvoří **konjugovaný pár**.',
        },
        { type: 'formula', text: '$HA <=> A^- + H^+$', caption: 'kyselina $HA$ a její konjugovaná zásada $A^-$' },
        { type: 'p', text: 'Na modelech porovnej dvě takové dvojice. Kyselina se od své zásady liší jediným vodíkem a jedním kladným nábojem:' },
        {
          type: 'molecule',
          molecules: ['NH4+', 'NH3', 'H3O+', 'H2O'],
          labels: ['kyselina $NH4^+$', 'konjugovaná zásada $NH3$', 'kyselina $H3O^+$', 'konjugovaná zásada $H2O$'],
          caption: 'Dva konjugované páry: kyselina má vždy o jeden proton víc než její zásada.',
        },
        { type: 'p', text: 'Stejně najdeš konjugovanou zásadu ke kterékoli kyselině: stačí odebrat jeden $H^+$. Všimni si vody, která se v tabulce objeví dvakrát:' },
        {
          type: 'table',
          headers: ['Kyselina', 'odevzdá', 'Konjugovaná zásada'],
          rows: [
            ['$HCl$', '$H^+$ ->', '$Cl^-$'],
            ['$H2SO4$', '$H^+$ ->', '$HSO4^-$'],
            ['$H3O^+$', '$H^+$ ->', '$H2O$'],
            ['$H2O$', '$H^+$ ->', '$OH^-$'],
            ['$NH4^+$', '$H^+$ ->', '$NH3$'],
            ['$HCO3^-$', '$H^+$ ->', '$CO3^2-$'],
          ],
        },
        { type: 'p', text: 'V každé acidobazické reakci jsou konjugované páry dva, protože proton jedna částice ztratí a druhá získá. Najdeme je v reakci amoniaku s vodou:' },
        {
          type: 'example',
          problem: 'Najdi konjugované páry v reakci $NH3 + H2O <=> NH4^+ + OH^-$.',
          steps: [
            '$NH3$ přijme proton a stane se z něj $NH4^+$: pár $NH4^+$/$NH3$.',
            'Voda proton odevzdá a zbude $OH^-$: pár $H2O$/$OH^-$.',
            'Pár zapisuj vždy v pořadí kyselina/zásada.',
          ],
          answer: 'Konjugované páry jsou $NH4^+$/$NH3$ a $H2O$/$OH^-$.',
        },
        { type: 'p', text: 'Kyselina a její konjugovaná zásada spolu souvisí i silou. Porovnej silnou a slabou kyselinu:' },
        {
          type: 'compare',
          columns: [
            { title: '$HCl$: silná kyselina', icon: 'lightning', tone: 'a', points: ['odevzdává $H^+$ velmi ochotně', 'její konjugovaná zásada $Cl^-$ proton skoro vůbec nepřijímá'] },
            { title: '$NH4^+$: slabá kyselina', icon: 'equilibrium', tone: 'b', points: ['odevzdává $H^+$ neochotně', 'její konjugovaná zásada $NH3$ proton ochotně přijímá'] },
          ],
          caption: 'Čím silnější kyselina, tím slabší je její konjugovaná zásada.',
        },
        { type: 'p', text: 'Konjugované páry už najdeš. Teď se podíváme na látky, které v jedné reakci proton přijímají a v jiné ho odevzdávají.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď ke kyselině její konjugovanou zásadu.',
            pairs: [
              ['$HNO3$', '$NO3^-$'],
              ['$H2PO4^-$', '$HPO4^2-$'],
              ['$NH4^+$', '$NH3$'],
              ['$H3O^+$', '$H2O$'],
            ],
            explain: 'Konjugovaná zásada má vždy o jeden proton méně, a proto i o jeden kladný náboj méně.',
          },
        },
      ],
    },
    {
      title: 'Amfoterní látky',
      icon: 'arrow-cycle',
      blocks: [
        {
          type: 'p',
          text: 'Voda se v tabulce konjugovaných párů objevila dvakrát, jednou jako kyselina a jednou jako zásada. Některé částice totiž umějí proton odevzdat i přijmout, podle toho, s kým se potkají. Říká se jim **amfoterní látky** neboli **amfolyty**. Nejdůležitějším amfolytem je voda.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Voda jako zásada', icon: 'ion-plus', tone: 'a', points: ['s chlorovodíkem proton přijme', '$H2O + HCl -> H3O^+ + Cl^-$'] },
            { title: 'Voda jako kyselina', icon: 'ion-minus', tone: 'b', points: ['s amoniakem proton odevzdá', '$H2O + NH3 <=> OH^- + NH4^+$'] },
            { title: 'Obojí najednou', icon: 'drop', tone: 'c', points: ['sama se sebou: autoprotolýza (lekce 5-3)', '$H2O + H2O <=> H3O^+ + OH^-$'] },
          ],
        },
        {
          type: 'p',
          text: 'Dalším amfolytem je **hydrogenuhličitanový anion** $HCO3^-$ z jedlé sody:',
        },
        {
          type: 'molecule',
          molecules: ['H2CO3', 'HCO3-', 'CO3^2-'],
          labels: ['$H2CO3$: $HCO3^-$ přijal proton', 'amfolyt $HCO3^-$', '$CO3^2-$: $HCO3^-$ odevzdal proton'],
        },
        { type: 'p', text: 'Kterou roli $HCO3^-$ zahraje, záleží na partnerovi. S kyselinou se chová jako zásada:' },
        {
          type: 'formula',
          text: '$HCO3^- + H3O^+ -> H2CO3 + H2O$',
          caption: 'jako zásada přijme proton; vzniklá $H2CO3$ se rozpadá na $CO2$ a vodu',
        },
        { type: 'p', text: 'Se zásadou je to naopak, $HCO3^-$ proton odevzdá:' },
        { type: 'formula', text: '$HCO3^- + OH^- -> CO3^2- + H2O$', caption: 'jako kyselina proton odevzdá' },
        {
          type: 'p',
          text: 'Amfoterní jsou i některé hydroxidy a oxidy, například $Al(OH)3$ nebo $ZnO$ z lekce 5-2. Rozpustí se v kyselině i v roztoku hydroxidu sodného.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Hydrogenuhličitan v krvi funguje jako tlumič: zachytí nadbytečnou kyselinu i zásadu, a proto pH krve kolísá jen o setiny. Takovým soustavám se říká pufry a podrobně je probereme v úrovni 6.',
        },
        { type: 'p', text: 'Teď víš, že role kyseliny nebo zásady závisí na partnerovi. Kyseliny se ale liší i tím, jak ochotně proton odevzdávají.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které částice jsou amfoterní?',
            options: ['$H2O$', '$HCO3^-$', '$H2PO4^-$', '$Cl^-$', '$Na^+$'],
            answers: [0, 1, 2],
            explain: 'Voda, $HCO3^-$ i $H2PO4^-$ mají proton, který mohou odevzdat, a zároveň mohou další proton přijmout. $Cl^-$ proton prakticky nepřijímá a $Na^+$ nemá žádný.',
          },
        },
      ],
    },
    {
      title: 'Silné a slabé kyseliny a zásady',
      icon: 'lightning',
      blocks: [
        {
          type: 'p',
          text: 'Už v lekcích 5-3 a 5-4 se kyselina octová chovala jinak než chlorovodíková. Proč? **Silné kyseliny** odevzdají vodě proton prakticky ze všech molekul, disociují úplně. **Slabé kyseliny** disociují jen z malé části a většina molekul zůstane celá, proto v rovnici píšeme obousměrnou šipku.',
        },
        {
          type: 'particles',
          boxes: [
            { label: '$HCl$: silná', items: [{ species: 'H3O+', count: 5 }, { species: 'Cl^-', count: 5 }, { species: 'H2O', count: 4 }], state: 'solution', note: 'disociováno 100 %' },
            { label: 'kyselina octová: slabá', items: [{ species: 'acetic-acid', count: 5 }, { species: 'H3O+', count: 1 }, { species: 'CH3COO^-', count: 1 }, { species: 'H2O', count: 4 }], state: 'solution', note: 'většina molekul zůstane celá' },
          ],
          caption: 'Stejná koncentrace kyseliny, ale úplně jiný počet kationtů $H3O^+$.',
        },
        { type: 'p', text: 'Rovnice disociace slabé kyseliny proto musí ukázat, že reakce neproběhne úplně:' },
        {
          type: 'formula',
          text: '$CH3COOH + H2O <=> CH3COO^- + H3O^+$',
          caption: 'Kyselina octová je slabá, proto obousměrná šipka. Jak velká část molekul se rozštěpí, spočítáš v příkladu níže.',
        },
        { type: 'p', text: 'Které kyseliny a zásady jsou silné? Je jich jen pár, a proto se vyplatí je znát nazpaměť:' },
        {
          type: 'compare',
          columns: [
            { title: 'Silné', icon: 'lightning', tone: 'a', points: ['disociují úplně, šipka ->', 'kyseliny: $HCl$, $HBr$, $HI$, $HNO3$, $H2SO4$, $HClO4$', 'zásady: $NaOH$, $KOH$, $Ca(OH)2$, $Ba(OH)2$'] },
            { title: 'Slabé', icon: 'equilibrium', tone: 'b', points: ['disociují částečně, šipka <=>', 'kyseliny: $CH3COOH$, $H2CO3$, $H2S$, $HF$, $HNO2$', 'zásada: $NH3$'] },
          ],
          caption: 'Slabá neznamená neškodná: $HF$ je slabá kyselina, a přesto patří k nejnebezpečnějším.',
        },
        {
          type: 'p',
          text: 'Jak velká část elektrolytu se rozštěpila na ionty, udává **stupeň disociace** $α$: podíl disociovaných molekul ze všech rozpuštěných. Nabývá hodnot od 0 do 1 a často se uvádí v procentech.',
        },
        { type: 'formula', text: '$α = [H3O^+] / c(HA)$', caption: 'pro slabou kyselinu $HA$ rozpuštěnou ve vodě' },
        { type: 'p', text: 'Stupeň disociace ukáže, jak velký je rozdíl mezi slabou a silnou kyselinou. Porovnejme kyselinu octovou s chlorovodíkovou o stejné koncentraci:' },
        {
          type: 'example',
          problem: 'Kyselina octová o koncentraci 0,10 mol/dm^{3} má $[H3O^+]$ = 1,3·10^{-3} mol/dm^{3}. Urči stupeň disociace a pH a porovnej je s kyselinou chlorovodíkovou stejné koncentrace.',
          steps: [
            'α = 0,0013 mol/dm^{3} : 0,10 mol/dm^{3} = 0,013, tedy 1,3 %.',
            'pH = −log 0,0013 ≐ 2,9.',
            'Kyselina chlorovodíková o koncentraci 0,10 mol/dm^{3} je disociovaná úplně (α = 1), $[H3O^+]$ = 0,10 mol/dm^{3} a pH = 1.',
          ],
          answer: 'α = 1,3 %, pH ≐ 2,9 (kyselina chlorovodíková: pH 1)',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Silná není totéž co koncentrovaná',
          text: '**Síla** kyseliny říká, jak ochotně odevzdává proton. **Koncentrace** říká, kolik kyseliny je v roztoku. Velmi zředěná $HCl$ je pořád silná kyselina, octová esence pořád slabá. Přesněji sílu vyjadřuje disociační konstanta, tu poznáš v úrovni 6.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Teď už víš, proč má slabá kyselina jinou titrační křivku (lekce 5-4): na začátku je v roztoku málo $H3O^+$, takže křivka začíná výš, a vzniklý octan sodný posune bod ekvivalence do zásadité oblasti.',
        },
        { type: 'p', text: 'Sílu kyseliny teď umíš posoudit i vyjádřit číslem. Využijeme ji k předpovědi, jaké pH bude mít roztok soli.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Kyselina octová o koncentraci 0,1 mol/dm^{3} má stejné pH jako kyselina chlorovodíková o stejné koncentraci.',
            answer: false,
            explain: 'Kyselina octová je slabá, disociuje jen asi z 1,3 %, a má pH kolem 2,9. Kyselina chlorovodíková disociuje úplně a má pH 1.',
          },
        },
      ],
    },
    {
      title: 'Hydrolýza solí',
      icon: 'test-tube',
      blocks: [
        {
          type: 'p',
          text: 'Konjugované páry vysvětlí i jednu záhadu. Roztok soli totiž nemusí být neutrální! Jedlá soda barví univerzální indikátor zelenomodře a hnojivo s chloridem amonným okyseluje půdu. Za to může **hydrolýza solí**, reakce iontů soli s vodou.',
        },
        {
          type: 'diagram',
          id: 'ph-scale',
          props: {
            marks: [
              { ph: 5.1, label: 'chlorid amonný' },
              { ph: 7, label: 'chlorid sodný' },
              { ph: 8.3, label: 'jedlá soda' },
              { ph: 11.6, label: 'soda' },
            ],
          },
          caption: 'Roztoky solí o koncentraci 0,1 mol/dm^{3}: kyselé, neutrální i zásadité.',
        },
        {
          type: 'p',
          text: 'Rozhoduje, z jak silné kyseliny a zásady sůl vznikla. Anion slabé kyseliny je konjugovaná zásada a bere vodě protony; kation slabé zásady, třeba $NH4^+$, protony vodě předává.',
        },
        {
          type: 'table',
          headers: ['Sůl', 'Vznikla z', 'Reakce s vodou', 'Roztok'],
          rows: [
            ['$NaCl$', 'silné kyseliny a silné zásady', 'ionty s vodou nereagují', 'neutrální, pH 7'],
            ['$Na2CO3$', 'slabé kyseliny a silné zásady', '$CO3^2- + H2O <=> HCO3^- + OH^-$', 'zásaditý, pH > 7'],
            ['$CH3COONa$', 'slabé kyseliny a silné zásady', '$CH3COO^- + H2O <=> CH3COOH + OH^-$', 'zásaditý, pH > 7'],
            ['$NH4Cl$', 'silné kyseliny a slabé zásady', '$NH4^+ + H2O <=> NH3 + H3O^+$', 'kyselý, pH < 7'],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          text: '==Roztok soli se chová podle silnějšího z „rodičů“.== Silná kyselina + slabá zásada -> kyselý roztok. Slabá kyselina + silná zásada -> zásaditý roztok. Obojí silné -> neutrální.',
        },
        { type: 'p', text: 'Hydrolýza není jen teorie, využíváš ji při praní i na zahradě:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'soap', title: 'Soda $Na2CO3$ na praní', text: 'její zásaditý roztok pomáhá rozpouštět mastnotu' },
            { icon: 'fertilizer', title: 'Amonná hnojiva', text: 'kationty $NH4^+$ půdu postupně okyselují' },
          ],
        },
        { type: 'p', text: 'Teď předpovíš, jestli bude roztok soli kyselý, nebo zásaditý. Zbývá poslední, nejobecnější pohled na kyseliny a zásady, který se obejde i bez protonu.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jaký bude roztok uhličitanu draselného $K2CO3$?',
            options: ['zásaditý', 'kyselý', 'neutrální'],
            answer: 0,
            explain: '$K2CO3$ vznikl ze slabé kyseliny uhličité a silné zásady $KOH$. Anion $CO3^2-$ bere vodě protony a vznikají $OH^-$.',
          },
        },
      ],
    },
    {
      title: 'Lewisovy kyseliny a zásady',
      icon: 'electron',
      blocks: [
        {
          type: 'p',
          text: 'Ještě obecnější pohled nabídl ve stejném roce 1923 Američan Gilbert N. **Lewis**. Nesleduje proton, ale **elektronový pár**.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'Lewisova kyselina', def: 'akceptor elektronového páru: částice s volným orbitalem, např. $H^+$, $BF3$, $AlCl3$ nebo kationty kovů' },
            { term: 'Lewisova zásada', def: 'donor elektronového páru: částice s volným elektronovým párem, např. $NH3$, $H2O$, $OH^-$, $Cl^-$' },
          ],
        },
        { type: 'p', text: 'Nejznámějším příkladem je reakce fluoridu boritého s amoniakem. Porovnej obě molekuly: $NH3$ má volný elektronový pár, $BF3$ má volné místo, kam ho přijmout.' },
        {
          type: 'molecule',
          molecules: ['BF3', 'NH3'],
          labels: ['$BF3$: přijme pár (Lewisova kyselina)', '$NH3$: poskytne pár (Lewisova zásada)'],
        },
        { type: 'p', text: 'Když se obě molekuly setkají, volný pár dusíku se naváže na bor:' },
        {
          type: 'structure',
          art: '    F     H\n    |     |\nF — B ←── N — H\n    |     |\n    F     H',
          caption: '$BF3 + NH3 -> F3B–NH3$: bor má v $BF3$ kolem sebe jen šest valenčních elektronů a volný pár dusíku přijme. Vznikne koordinační vazba (lekce 3-2), šipka ukazuje od dárce páru k příjemci.',
        },
        {
          type: 'p',
          text: 'Žádný proton se tu nepředává, a přesto jde o reakci kyseliny se zásadou. Každá Brønstedova zásada je zároveň Lewisovou zásadou: proton přijímá právě volným elektronovým párem. Opačně to neplatí, $BF3$ žádný proton nemá.',
        },
        {
          type: 'p',
          text: '==Typickými Lewisovými kyselinami jsou kationty kovů.== Mají volné orbitaly, do kterých přijímají elektronové páry molekul vody, amoniaku nebo aniontů. Vznikají **komplexy**: kation kovu obklopený navázanými částicemi (podrobně v úrovni 7).',
        },
        { type: 'reaction', equation: 'Cu^2+ + 4NH3 -> [Cu(NH3)4]^2+', caption: 'Světle modrý roztok měďnaté soli s nadbytkem amoniaku tmavě zmodrá: vzniká tetraamminměďnatý kation. $Cu^{2+}$ je Lewisova kyselina, $NH3$ Lewisova zásada.' },
        { type: 'p', text: 'Stejně reaguje amoniak i s kationtem stříbra. Najdi v reakci kyselinu a zásadu sám/sama:' },
        {
          type: 'example',
          problem: 'Urči Lewisovu kyselinu a zásadu v reakci $Ag^+ + 2NH3 -> [Ag(NH3)2]^+$.',
          steps: [
            'Amoniak má na dusíku volný elektronový pár a poskytne ho: je to Lewisova zásada.',
            'Kation $Ag^+$ pár přijme do volného orbitalu a vznikne koordinační vazba: je to Lewisova kyselina.',
            'Proton se nepředává, podle Brønsteda by to acidobazická reakce nebyla.',
          ],
          answer: '$Ag^+$ je Lewisova kyselina, $NH3$ Lewisova zásada.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Proč je roztok $AlCl3$ nebo $FeCl3$ kyselý? Malý kation s velkým nábojem váže molekuly vody jako Lewisova kyselina a přitahuje jejich elektrony tak silně, že se z vody snáz odštěpí proton: $[Al(H2O)6]^{3+} + H2O <=> [Al(OH)(H2O)5]^{2+} + H3O^+$. I to je hydrolýza, jen z pohledu kationtu.',
        },
        { type: 'p', text: 'Teď můžeme všechny tři teorie postavit vedle sebe. Všimni si, že každá další zahrnuje i tu předchozí:' },
        {
          type: 'compare',
          columns: [
            { title: 'Arrhenius', icon: 'drop', tone: 'a', points: ['kyselina uvolní ve vodě $H^+$', 'zásada uvolní ve vodě $OH^-$'] },
            { title: 'Brønsted', icon: 'ion-plus', tone: 'b', points: ['kyselina je donor protonu', 'zásada je akceptor protonu'] },
            { title: 'Lewis', icon: 'electron', tone: 'c', points: ['kyselina je akceptor elektronového páru', 'zásada je donor elektronového páru'] },
          ],
          caption: 'Tři teorie, každá širší než ta předchozí.',
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Arrhenius, Brønsted, Lewis: na výpočty pH ti bohatě stačí Brønsted. Lewise ale potkáš u komplexů kovů v úrovni 7 i u organických reakcí v úrovni 8, tak si ho zapamatuj.',
        },
        { type: 'p', text: 'Teď znáš kyseliny a zásady ze tří pohledů. V další úrovni přijdou redoxní reakce, kde se místo protonů předávají elektrony, a ke slabým kyselinám se pak vrátíš i s výpočty.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které částice mohou vystupovat jako Lewisovy kyseliny?',
            options: ['$BF3$', '$Fe^{3+}$', '$H^+$', '$NH3$', '$OH^-$'],
            answers: [0, 1, 2],
            explain: '$BF3$, kationty kovů i $H^+$ mají volný orbital a elektronový pár přijmou. $NH3$ a $OH^-$ mají volné elektronové páry, jsou to Lewisovy zásady.',
          },
        },
      ],
    },
  ],
  summary: [
    'Podle Brønsteda je kyselina donor protonu a zásada akceptor protonu.',
    'Kyselina a zásada, které se liší o jeden proton, tvoří konjugovaný pár, např. $NH4^+$/$NH3$.',
    'Amfoterní látky, jako voda nebo $HCO3^-$, mohou proton odevzdat i přijmout.',
    'Silné kyseliny a zásady disociují úplně, slabé jen částečně; míru udává stupeň disociace α.',
    'Hydrolýzou solí je roztok $Na2CO3$ zásaditý, $NH4Cl$ kyselý a $NaCl$ neutrální.',
    'Lewisova kyselina ($BF3$, $H^+$, kationty kovů jako $Cu^{2+}$) přijímá elektronový pár, Lewisova zásada ($NH3$, $H2O$) ho poskytuje a vzniká koordinační vazba.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Jaká je konjugovaná zásada kyseliny sírové $H2SO4$?',
      options: ['$HSO4^-$', '$SO4^2-$', '$H3SO4^+$', '$SO3$'],
      answer: 0,
      explain: 'Konjugovaná zásada má o jeden proton méně: $H2SO4 -> HSO4^- + H^+$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec konjugované kyseliny amoniaku i s nábojem (náboj napiš za vzorec, třeba H3O+).',
      accept: ['NH4+', 'NH4^+', 'NH4^{+}'],
      caseSensitive: true,
      placeholder: 'např. H3O+',
      explain: 'Amoniak přijme proton a vznikne amonný kation $NH4^+$.',
    },
    {
      kind: 'tf',
      q: 'Voda může být Brønstedovou kyselinou i zásadou.',
      answer: true,
      explain: 'Voda je amfolyt: s $HCl$ proton přijímá, s $NH3$ ho odevzdává.',
    },
    {
      kind: 'tf',
      q: 'Zředěná kyselina chlorovodíková je slabá kyselina.',
      answer: false,
      explain: 'Síla nezávisí na koncentraci. $HCl$ disociuje úplně i ve zředěném roztoku, je to silná kyselina.',
    },
    {
      kind: 'number',
      q: 'Slabá kyselina o koncentraci 0,20 mol/dm^{3} má $[H3O^+]$ = 0,0020 mol/dm^{3}. Jaký je její stupeň disociace v procentech?',
      answer: 1,
      tolerance: 0.05,
      unit: '%',
      explain: 'α = 0,0020 : 0,20 = 0,010, tedy 1 %.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k soli, jaký bude její vodný roztok.',
      pairs: [
        ['$NaCl$', 'neutrální'],
        ['$NH4Cl$', 'kyselý'],
        ['$Na2CO3$', 'zásaditý'],
      ],
      explain: '$NaCl$ je sůl silné kyseliny a silné zásady, $NH4^+$ předává vodě protony a $CO3^2-$ je od vody bere.',
    },
    {
      kind: 'multi',
      q: 'Ve kterých reakcích vystupuje voda jako Brønstedova kyselina?',
      options: [
        '$NH3 + H2O <=> NH4^+ + OH^-$',
        '$CO3^2- + H2O <=> HCO3^- + OH^-$',
        '$HCl + H2O -> H3O^+ + Cl^-$',
        '$NH4^+ + H2O <=> NH3 + H3O^+$',
      ],
      answers: [0, 1],
      explain: 'Kde z vody vzniká $OH^-$, voda proton odevzdala, byla tedy kyselinou. Kde vzniká $H3O^+$, proton přijala jako zásada.',
    },
    {
      kind: 'choice',
      q: 'Ve které reakci se nepředává proton, a přesto jde podle Lewise o reakci kyseliny se zásadou?',
      options: [
        '$BF3 + NH3 -> F3BNH3$',
        '$HCl + H2O -> H3O^+ + Cl^-$',
        '$NH3 + H2O <=> NH4^+ + OH^-$',
        '$HCO3^- + OH^- -> CO3^2- + H2O$',
      ],
      answer: 0,
      explain: 'Dusík amoniaku poskytne volný elektronový pár boru v $BF3$ a vznikne koordinační vazba. Ve zbylých reakcích přechází proton, jsou to i Brønstedovy acidobazické reakce.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Závěrečná výzva                                                     */
/* ------------------------------------------------------------------ */

const boss: Question[] = [
  {
    kind: 'text',
    q: 'Napiš vzorec kyseliny jodisté.',
    accept: ['HIO4'],
    caseSensitive: true,
    placeholder: 'např. HClO4',
    explain: 'Koncovka -istá -> jod VII, liché číslo -> 1 H; O = (7 + 1) : 2 = 4. Vzorec je $HIO4$.',
  },
  {
    kind: 'multi',
    q: 'Při kterých reakcích se uvolňuje plyn?',
    options: [
      'zinek + kyselina chlorovodíková',
      'uhličitan sodný + kyselina sírová',
      'oxid hořečnatý + kyselina dusičná',
      'chlorid amonný + hydroxid sodný za tepla',
      'hydroxid draselný + kyselina chlorovodíková',
    ],
    answers: [0, 1, 3],
    explain: 'Kov s kyselinou uvolní vodík, uhličitan s kyselinou $CO2$ a zásada z amonné soli amoniak. Oxid kovu a hydroxid dávají s kyselinou jen sůl a vodu.',
  },
  {
    kind: 'match',
    q: 'Přiřaď k oxidu jeho acidobazický charakter.',
    pairs: [
      ['$Na2O$', 'zásaditý oxid'],
      ['$Al2O3$', 'amfoterní oxid'],
      ['$SO3$', 'kyselý oxid'],
      ['$CO$', 'neutrální oxid'],
    ],
    explain: 'Oxid alkalického kovu dává s vodou hydroxid, $Al2O3$ reaguje s kyselinami i zásadami, $SO3$ dává kyselinu sírovou a $CO$ nereaguje ani s kyselinami, ani se zásadami.',
  },
  {
    kind: 'number',
    q: 'Kyselinu sírovou o koncentraci 0,025 mol/dm^{3} zředíš vodou na pětinásobný objem. Jaké pH má zředěný roztok? Předpokládej, že kyselina odevzdá oba protony.',
    answer: 2,
    tolerance: 0.05,
    explain: 'Po zředění je $c(H2SO4)$ = 0,025 : 5 = 0,005 mol/dm^{3}, $[H3O^+]$ = 2 · 0,005 = 0,01 mol/dm^{3}, pH = 2.',
  },
  {
    kind: 'number',
    q: 'Kolik gramů $NaOH$ potřebuješ na přípravu 500 cm^{3} roztoku o pH 12? (M(NaOH) = 40 g/mol)',
    answer: 0.2,
    tolerance: 0.005,
    unit: 'g',
    explain: 'pH 12 -> pOH 2 -> $[OH^-]$ = 0,01 mol/dm^{3}. $n$ = 0,01 · 0,500 = 0,005 mol, $m$ = 0,005 · 40 = 0,2 g.',
  },
  {
    kind: 'number',
    q: 'Smícháš 50 cm^{3} $HCl$ o koncentraci 0,10 mol/dm^{3} a 40 cm^{3} $NaOH$ o koncentraci 0,10 mol/dm^{3}. Jaké pH má výsledný roztok?',
    answer: 1.95,
    tolerance: 0.05,
    explain: '$n(HCl)$ = 0,0050 mol, $n(NaOH)$ = 0,0040 mol. Zbude 0,0010 mol $HCl$ v 0,090 dm^{3}: $[H3O^+]$ = 0,011 mol/dm^{3}, pH = −log 0,011 ≐ 1,95.',
  },
  {
    kind: 'number',
    q: 'Na 25,0 cm^{3} roztoku $Ba(OH)2$ se spotřebovalo 30,0 cm^{3} $HCl$ o koncentraci 0,100 mol/dm^{3}. Jaká je koncentrace $Ba(OH)2$?',
    answer: 0.06,
    tolerance: 0.001,
    unit: 'mol/dm³',
    explain: '$Ba(OH)2 + 2HCl -> BaCl2 + 2H2O$. $n(HCl)$ = 0,00300 mol, $n(Ba(OH)2)$ = 0,00150 mol, $c$ = 0,00150 : 0,0250 = 0,060 mol/dm^{3}.',
  },
  {
    kind: 'choice',
    q: 'Titruješ kyselinu octovou hydroxidem sodným a omylem použiješ methyloranž. Jak dopadne vypočtená koncentrace kyseliny?',
    options: [
      'vyjde mnohem menší, než je skutečná',
      'vyjde správně, na indikátoru nezáleží',
      'vyjde větší, než je skutečná',
      'nevyjde nic, methyloranž barvu vůbec nezmění',
    ],
    answer: 0,
    explain: 'Methyloranž změní barvu už při pH 3,1–4,4, dlouho před bodem ekvivalence (asi pH 8,7). Spotřeba $NaOH$ je proto příliš malá a vypočtená koncentrace také.',
  },
  {
    kind: 'text',
    q: 'Napiš vzorec hydrogensíranu amonného.',
    accept: ['NH4HSO4'],
    caseSensitive: true,
    placeholder: 'např. KHSO4',
    explain: 'Kation $NH4^+$ a anion $HSO4^-$ mají náboje +1 a −1, spojí se 1 : 1: $NH4HSO4$.',
  },
  {
    kind: 'multi',
    q: 'Které dvojice roztoků dají po smíchání sraženinu?',
    options: ['$AgNO3$ + $CaCl2$', '$Ba(NO3)2$ + $Na2SO4$', '$NaCl$ + $KNO3$', '$KOH$ + $NaNO3$', '$Na2CO3$ + $CaCl2$'],
    answers: [0, 1, 4],
    explain: 'Iontové rovnice: $Ag^+ + Cl^- -> AgCl(s)$, $Ba^{2+} + SO4^2- -> BaSO4(s)$ a $Ca^{2+} + CO3^2- -> CaCO3(s)$. Ve zbylých dvojicích jsou všechny ionty diváci.',
  },
  {
    kind: 'order',
    q: 'Seřaď roztoky o stejné koncentraci 0,1 mol/dm^{3} od nejnižšího pH po nejvyšší.',
    items: ['$HCl$', '$CH3COOH$', '$NH4Cl$', '$NaCl$', '$Na2CO3$', '$NaOH$'],
    explain: 'Silná kyselina (pH 1) < slabá kyselina (asi 2,9) < kyselá sůl (asi 5,1) < neutrální sůl (7) < zásaditá sůl (asi 11,6) < silná zásada (13).',
  },
  {
    kind: 'tf',
    q: 'Roztok chloridu hlinitého je kyselý, protože kation $Al^{3+}$ jako Lewisova kyselina váže molekuly vody a usnadní odštěpení protonu z nich.',
    answer: true,
    explain: 'Hydratovaný kation $[Al(H2O)6]^{3+}$ odevzdává proton vodě: $[Al(H2O)6]^{3+} + H2O <=> [Al(OH)(H2O)5]^{2+} + H3O^+$. Proto má roztok $AlCl3$ pH pod 7.',
  },
]

const level: LevelContent = {
  lessons: {
    'l5-1': l51,
    'l5-2': l52,
    'l5-3': l53,
    'l5-4': l54,
    'l5-5': l55,
    'l5-6': l56,
  },
  boss,
}

export default level
