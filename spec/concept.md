# Concept

## Vision

**Q & Why** (formerly edu4me) is a free, playful learning web app for Czech teenagers. It takes one school subject at a time and turns it into a journey: short lessons, instant practice, mini-games and visible progress. Learners should come back because it is fun, and leave understanding the subject better than they did from school alone.

Chemistry is the first course. Physics, biology and mathematics are planned and already appear on the home screen as "Připravujeme".

## Audience

- **Primary:** students aged 14–18 (ZŠ 8.–9. třída, gymnázium, SŠ) who want to understand chemistry, catch up, or prepare for the maturita or a university entrance exam.
- **Secondary:** curious adults, parents helping with homework, teachers looking for class activities.
- Language: **Czech only** (UI and content).
- Devices: phone first (most use happens on phones), and it must be comfortable on a desktop.

## Learning principles

1. **Small steps.** Lessons of 12–19 minutes, split into 3–6 short sections. One idea per paragraph.
2. **Read in one go, then practise.** A lesson is one scrolling, picture-heavy page (section nav + reading progress), followed by one quiz that covers every section. Few clicks, no wall of text: visuals carry most of the explanation.
3. **Retrieval practice.** A quiz at the end of every lesson, a level test at the end of every level, and games that draw on the questions of all unlocked levels.
4. **Spiral curriculum.** Topics come back at a deeper level (e.g. acids in level 5 → Ka and buffers in level 6), following the Czech ZŠ → gymnázium progression.
5. **Concrete before abstract.** Every lesson starts from something the learner has seen: a kitchen, a phone battery, a swimming pool.
6. **Immediate, kind feedback.** Every answer is explained. Mistakes are normal and never punished beyond "try again".
7. **Visible progress.** XP, ranks, streaks, badges and the element album make effort visible.
8. **Free navigation.** Levels are recommended in order, but nothing is locked: a learner preparing for a test can jump straight to what they need.

## Structure of a course

```
Course (Chemie)
└── Level (9) ─ colour, element symbol, stage in school system
    ├── Lesson (6 per level) ─ intro → sections with checks → summary → quiz → results
    ├── Závěrečná výzva (level test, 10–12 questions, ≥ 70 % passes)
    └── Mini-games linked to the level
```

Why 9 levels with 6–8 lessons: 9 levels map cleanly onto the stages of the Czech curriculum (ZŠ basics → gymnázium general, inorganic, organic and biochemistry). A learner sees the whole map on one screen; levels that carry more pre-university content (physical, organic and biochemistry) get 7–8 lessons instead of overloading 6. At ~16 minutes per lesson the course is ~17 hours of lessons plus games and tests: realistic for a school year of occasional use, or a summer of daily use.

## Multi-course design

Everything course-specific lives in `src/courses/<id>/`; everything else is shared:

- the content model (`src/core/types.ts`): lessons, blocks, questions,
- the lesson player, quiz runner, course overview, progress store, badges and theme,
- the game shell (every game gets intro, results, XP and stars for free).

A new course needs an outline (`index.ts`), level content files, optional course-specific diagrams and games, and a spec folder in `spec/courses/<id>/`. See [architecture.md](architecture.md).

## Non-goals (for now)

- Accounts, a server or a teacher dashboard. Progress is local and can be exported/imported as a file.
- Tracking or analytics. The app makes no third-party requests.
- Replacing school: Q & Why explains and trains; it doesn't grade.
