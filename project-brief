# Project Brief: Intentional Living OS (working name)

*A personal goal + journaling app with an AI brain. Built for one user (me) first. This document is the source of truth for Claude Code — read it fully before writing any code.*

---

## 1. What this product is

A single app that combines three things that currently live in separate places (Notion, ChatGPT, paper cards):

1. **Goals** — annual goals, broken into monthly goals, milestones, and tasks.
2. **Journaling / check-ins** — a conversational daily or weekly reflection ("How was your week? What did you accomplish? What will you do differently?").
3. **An AI brain** — Claude, with full visibility into all of the above, that helps prioritize tasks, breaks goals into milestones, tracks progress percentages, and builds a memory of who I am over time.

The core problem being solved: today the AI (ChatGPT) can't see my goals, so it guesses. In this app, the AI reads everything directly — no copy-pasting between tools.

**Design philosophy: opinionated brain, unopinionated action layer.** The AI is smart and proactive about *what* matters. The user decides *how* to act on it. Minimal UI, maximum intelligence.

---

## 2. Who's building this

A designer / design systems manager with strong frontend skills (HTML/CSS/JS, some React, Webflow). New to backend development. Claude Code should:

- Explain backend concepts in plain English as it works (what a thing does, not just its jargon name).
- Prefer simple, boring, well-documented tech over clever tech.
- Build in small, reviewable steps. Commit after each working step.

---

## 3. Tech stack (and why, in plain terms)

| Piece | Choice | What it is, plainly |
|---|---|---|
| App framework | **Next.js (React + TypeScript)** | One project that contains both the pages the user sees AND the behind-the-scenes code that talks to the database and to Claude. Since I know React, only the behind-the-scenes half is new. |
| Database | **SQLite** (via Prisma) | The database is just a single file sitting in the project — like one Excel file with several linked tabs. No separate database service to sign up for or pay for. Prisma is the translator that lets our code read/write that file safely. |
| AI brain | **Anthropic API (Claude)** | Our server code sends Claude the user's goals + journal + tasks and gets back prioritization, breakdowns, and reflection responses. |
| Styling | **Tailwind CSS** | Utility classes for styling. Familiar territory. |
| Hosting (later) | **Railway** (Phase 4, not day one) | A service that keeps the app running on the internet so it works from my phone anywhere. Until then, the app runs on my Mac only. |

**Rules:**
- No user accounts / login in v1. Single user. (Add simple password protection only when deployed.)
- No calendar API integrations in v1. Available time is entered manually or pasted in.
- The Anthropic API key lives in a `.env` file (a private settings file that never gets committed to GitHub).

---

## 4. The data structure (the "schema")

Plain-English translation: the *schema* is just the blueprint for the database — a list of the "tabs" in our one-file spreadsheet, what columns each tab has, and how rows in one tab point to rows in another.

Six tables:

### `goals`
The top level. Annual goals AND the dreams/aspirations layer.
- `id`
- `title` — e.g., "Get a new job"
- `description`
- `category` — e.g., Personal, Career, Spiritual, Fatherhood, Health, Financial
- `timeframe` — "annual" | "monthly" | "long-term dream"
- `parent_goal_id` — lets a monthly goal point at the annual goal it serves (a tab pointing at itself)
- `status` — active | completed | paused | dropped
- `target_date` (optional)
- `created_at`, `completed_at`

### `milestones`
The 2–5 big chunks inside a goal.
- `id`
- `goal_id` — which goal this belongs to
- `title` — e.g., "Portfolio site updated"
- `order` — display order
- `status`
- `created_at`, `completed_at`

### `tasks`
The individual to-dos. Can belong to a milestone, directly to a goal, or to nothing (loose tasks like "buy dog food").
- `id`
- `title`
- `milestone_id` (optional)
- `goal_id` (optional)
- `estimated_minutes` (optional) — the AI's rough time estimate
- `status` — todo | done | dropped
- `source` — "user" | "ai" — who created it
- `due_date` (optional)
- `created_at`, `completed_at`

**Progress percentages are computed, not stored:** a milestone's % = done tasks ÷ total tasks in it; a goal's % rolls up from its milestones/tasks. This is just counting — calculate it live, don't save it.

### `journal_entries`
Every check-in conversation gets saved here.
- `id`
- `type` — "daily" | "weekly" | "monthly" | "freeform"
- `transcript` — the full back-and-forth text of the check-in
- `summary` — a short AI-written summary of the entry
- `created_at`

### `memory`
The AI's evolving understanding of the user. Small number of rows, each a plain-text insight.
- `id`
- `category` — "values" | "patterns" | "preferences" | "context"
- `content` — e.g., "Prioritizes presence with daughter over career growth this season"
- `source_entry_id` — which journal entry this came from (optional)
- `updated_at`

After each check-in, the brain may add or update memory rows. This is how it "gets to know me."

### `checkin_prompts`
The questions the app asks, editable so the ritual can evolve.
- `id`
- `type` — daily | weekly | monthly
- `question` — e.g., "How do you feel about your progress?"
- `order`

**Seed the weekly/monthly prompts with my existing 5-question monthly system:** progress feelings, missing priorities, how outcomes were created, 3 key lessons, next period's commitment.

---

## 5. How the brain works (v1)

The brain only runs when the user opens the app and interacts. No background jobs, no notifications in v1.

Two brain modes, both hitting the Anthropic API from our server code:

**A. Check-in mode (conversational)**
1. User starts a daily/weekly check-in.
2. Server gathers context: active goals + milestones + open tasks + last few journal summaries + all memory rows + today's date.
3. Claude asks the check-in questions one at a time, responds conversationally, and probes when useful.
4. On finish, Claude produces structured output: (a) entry summary, (b) any new/updated memory rows, (c) any suggested new tasks or task completions it heard ("I finished the resume" → mark that task done, with user confirmation), (d) suggested priorities for the next day/week.
5. Server saves all of that to the database. User confirms task changes before they're applied.

**B. Planning mode (on demand)**
- "Break this goal into milestones and tasks" → Claude proposes a breakdown with time estimates; user approves/edits before it's saved.
- "What should I focus on today? I have 2 hours" → Claude reads everything and recommends, with reasoning.

**Structured output rule:** whenever Claude needs to create/update database rows, it must respond in a strict JSON format defined in the code, and the server validates it before saving. (Plain English: the AI fills out a form; the server checks the form before filing it.)

---

## 6. The UI (v1 — deliberately small)

Mobile-first, since it'll mostly be used from a phone. Three screens:

1. **Today / Dashboard** — this week's intentions, top 3 priorities, active goals with progress %, quick-add task box. This is the "glanceable" screen (the Notion-dashboard replacement, and the source for handwritten desk cards).
2. **Check-in** — a chat screen. Big "Start daily check-in" / "Start weekly check-in" buttons. Text input (phone dictation covers voice for v1 — no custom audio recording).
3. **Goals** — the goal tree: goals → milestones → tasks, with checkboxes and progress bars. Add/edit/complete/delete.

Keep it calm and minimal. No gamification visuals beyond progress percentages in v1.

---

## 7. Suggested file structure

```
intentional-os/
├── CLAUDE.md                  ← standing instructions for Claude Code
├── README.md
├── .env                       ← secret keys (never committed)
├── .gitignore
├── prisma/
│   └── schema.prisma          ← the database blueprint
├── app/                       ← Next.js pages + API routes
│   ├── page.tsx               ← Dashboard
│   ├── checkin/page.tsx       ← Check-in chat screen
│   ├── goals/page.tsx         ← Goal tree screen
│   └── api/
│       ├── chat/route.ts      ← the brain: talks to Anthropic API
│       ├── goals/route.ts     ← create/read/update goals
│       ├── tasks/route.ts     ← create/read/update tasks
│       └── journal/route.ts   ← save/read journal entries
├── lib/
│   ├── db.ts                  ← database connection helper
│   ├── brain/
│   │   ├── context.ts         ← gathers goals/tasks/memory into the prompt
│   │   ├── prompts.ts         ← the system prompts for check-in & planning modes
│   │   └── parse.ts           ← validates Claude's JSON output before saving
│   └── progress.ts            ← the % rollup math
└── components/                ← React components (my comfort zone)
```

---

## 8. Build phases — do these in order, one at a time

**Phase 1 — Skeleton + database.** Scaffold Next.js, set up Prisma + SQLite with the schema above, seed my real annual/monthly goals and check-in prompts, build the Goals screen with full add/edit/complete. *Done when: I can manage my real goal tree in the browser.*

**Phase 2 — The brain, check-in mode.** Build the chat screen and the `/api/chat` brain route with full database context. Save journal entries + summaries + memory updates. *Done when: I can do a real weekly check-in and it's smarter than ChatGPT was, because it sees everything.*

**Phase 3 — Planning + dashboard.** Goal-breakdown mode, "what should I focus on" mode, task suggestions from check-ins (with confirmation), and the Dashboard screen with priorities + progress %. *Done when: the app replaces my Notion weekly-planning ritual entirely.*

**Phase 4 — Deploy.** Move to Railway so it works from my phone anywhere. Add a simple password. *Done when: I can check in from anywhere.*

Later (explicitly NOT now): custom voice recording, Apple Reminders/Siri capture, calendar sync, phone widget, notifications/nudges, multi-user.

---

## 9. Working agreement for Claude Code

- Work one phase at a time; within a phase, one feature at a time.
- Before large or structural changes, propose a plan first and wait for approval (use Plan Mode).
- Commit to git after every working step with a clear message.
- When introducing any backend concept for the first time (API route, migration, environment variable, ORM, etc.), add a one-or-two-sentence plain-English explanation of what it does.
- Never commit `.env` or the SQLite database file.
- Keep dependencies minimal — question every new package.
