# Gamification

Motivation mechanics are there to make effort visible, not to create compulsion. No timers that punish, no lives, no paywalls.

## XP (zkušenostní body)

| Action | XP |
|---|---|
| Finish a lesson for the first time | 30 + 5 per correct quiz answer |
| Repeat a lesson | 10 + 5 per answer above your previous best |
| Pass a level test (≥ 70 %) for the first time | 100 |
| Pass a level test again | 10 |
| Fail a level test | 2 per correct answer |
| Finish a game round | 10 + 40 × (score / max) |

Implementation: `XP` constants in `src/core/progress.ts`.

## Ranks (hodnosti)

The rank rises with XP; rank *n* → *n + 1* costs 100 + 50·(n − 1) XP. Titles: Zvědavec, Pozorovatel, Laborant, Mladý chemik, Analytik, Syntetik, Badatel, Chemik, Vědec, Profesor, Nobelista. The rank number is shown in the round avatar in the header.

## Streak (série)

Any XP-earning activity on a calendar day counts. Consecutive days increase the streak; missing a day resets it to 1 on the next activity. The header shows the flame with the current streak; the profile shows a 28-day activity heat map.

## Stars

Lessons, level tests and games show 1–3 stars: ≥ 90 % → 3, ≥ 60 % → 2, > 0 → 1.

## Badges (odznaky)

26 badges in `src/core/badges.ts`:
- progress: První pokus, Laborant (10 lessons), Chemik (30), Profesor (all lessons, counted from the course outline);
- mastery: Bez chyby (a perfect quiz), Ostrostřelec (10 perfect quizzes), Tři hvězdy (3 stars in a game);
- habit: Rozjezd (3-day streak), Týden v laborce (7), Věčný plamen (30);
- XP: Tisícovka (1 000), Reaktor (5 000);
- games: Hráč (5 different games), Herní maniak (all 14);
- album: Sběratel (20 elements), Kurátor (50), Mendělejev (all 118);
- one badge per level test (Pán látek … Biochemik).

New badges pop up as a toast.

## Element album (album prvků)

The periodic table as a sticker album. Learners collect an element when they:
- finish a lesson that shows the element in an `elements` block,
- pass a level test (the level's symbol element: H, He, Li, … F),
- find or use it in a game (`collected` in the game result).

Empty cells are dashed outlines; collected ones light up in their category colour. Tapping a cell shows details. Collecting all 118 is the long-term goal ("Mendělejev" badge).

## Mascot: Atomík

A friendly atom with orbiting electrons and a face with six moods (happy, think, wow, sad, cheer, sleep). Atomík greets on the home page, opens every lesson with a hook question, comments in `mascot` callouts, and reacts to results. It never scolds.

## Ideas for later

- Weekly challenges ("Tento týden: 3 hry z periodické tabulky").
- Spaced-repetition review ("Opakování": questions you got wrong come back after 1, 3 and 7 days).
- Seasonal events (Mendělejevův den 8. 2., Den Země).
- Optional friend leagues if accounts are ever added.
