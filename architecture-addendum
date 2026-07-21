# Project Brief Addendum — Privacy Architecture, Habits, and Import/Export

*Companion to intentional-os-project-brief.md. These are design decisions locked in early so the infrastructure supports them, even though most are built after the MVP.*

---

## 1. Privacy architecture ("the safe")

**Core principle: privacy is controlled by storage and routing, not by the model.** An LLM must read text to reason about it, so the design controls what is stored where and what is ever sent to a model.

### The three data zones

**Zone 1 — Device only (the safe).**
Raw journal audio and raw transcripts. Stored locally on the user's device. Never uploaded to any server, never sent to any cloud model. Entries can also be explicitly marked **Private**, which locks them to this zone permanently regardless of type.

**Zone 2 — The working layer (synced, model-visible).**
The distilled material the brain actually reasons over: entry summaries, memory insights, goals, milestones, tasks, habits, priorities. This is what gets sent to the LLM during check-ins and planning. It is deliberately the refined layer, not the raw confessional.

**Zone 3 — Nothing else.** No analytics on journal content, no third-party data sharing. The privacy page should be short enough to actually read.

### How raw becomes distilled

After a journaling session, a distillation step produces the Zone 2 summary + memory updates from the Zone 1 raw entry. Roadmap for where that step runs:

- **v1:** the cloud model performs distillation transiently during the check-in conversation (the raw text passes through the model in the moment but only the distilled output is stored server-side).
- **v2+:** a local model on the device performs distillation, so raw entries never touch the cloud at all. This is the long-term differentiator: "your raw journal never leaves your device."

### User-facing promises (must stay true at every phase)

1. Raw recordings and transcripts are stored only on your device.
2. Anything marked Private is never sent to any AI model.
3. You can see exactly what the brain knows about you (the memory layer is user-visible and editable).
4. Export everything, delete everything, anytime.

---

## 2. Habits (schema now, feature later)

Habits are recurring commitments that serve goals. The brain's job is not just tracking them but noticing adherence patterns and bringing them into check-in conversations — including questioning whether a habit is the right habit.

### Two new tables

**`habits`**
- `id`
- `title` — e.g., "Morning grounding practice"
- `goal_id` (optional) — the goal this habit serves
- `cadence` — daily | weekdays | weekly | custom
- `status` — active | paused | retired
- `created_at`

**`habit_logs`**
- `id`
- `habit_id`
- `date`
- `done` — true/false
- `note` (optional)

### Brain behaviors (prompt logic, built in Phase 3+)

- Ask about habit adherence naturally inside daily/weekly check-ins; log answers.
- Notice broken streaks and raise them with curiosity, not judgment: what's getting in the way?
- Periodically evaluate fit: should this habit be easier, different, or retired for the season?
- Connect habits to goal progress in reflections ("your gym habit is the engine behind the health goal — it held 5 of 7 days").

---

## 3. Import / export (v1-cheap integration substitutes)

No third-party API integrations in v1. Instead:

- **Task import/export via CSV** — a plain spreadsheet file with columns: title, area, goal, priority, due_date, estimated_minutes, status. Lets existing task lists come in from anywhere and everything leave anytime (also serves privacy promise #4).
- **Calendar via .ics paste/upload** — the user exports a calendar file from Outlook/Google/Apple (a standard plain-text format every calendar app produces) or simply pastes their week as text. The brain reads it as availability context for prioritization. No live sync.
- **Meeting transcripts via paste/upload** — processed by the brain's transcript mode: extract the user's own action items, tag by area, link to goals, flag conflicts with priorities, output as proposed task changes for confirmation. Tasks created this way get `source: "meeting"`.

Real integrations (Google/Outlook calendar sync, Apple Reminders, Notion) are v3+, added only if the manual paths prove annoying in daily use.

---

## 4. Schema changes to the main brief

- `tasks.source` values are now: "user" | "ai" | "meeting" | "import"
- `journal_entries` gains: `is_private` (true/false) and `raw_stored_locally` (true/false)
- Add `habits` and `habit_logs` tables as defined above
- `tasks` gains: `priority` — high | medium | low (optional)

---

## 5. User-shapeable agent (preference layer)

Three instruction layers, applied in order:
1. **Product constitution** — immutable product rules. Not overridable by users.
2. **User preferences** — plain-text rules created via in-chat feedback. Agent proposes the rule, user confirms, then it applies to all future sessions. User can view/edit/delete all rules.
3. **Session conversation.**

New table `preferences`: id, content, created_from (chat | settings), created_at, active.
New table `feedback_log`: id, feedback_text, resulting_preference_id (optional), created_at, share_with_developer (true/false, default asks).
Feedback analytics never include journal or memory content.

## 6. Anchors

AI-distilled reminders/affirmations that emerge from journaling (e.g., "If it creates chaos or drains me, it needs a boundary"). Not tasks, not habits — surfaced, not tracked.

New table `anchors`: id, content, source_entry_id (optional), status (active | retired), created_at.
Max ~2 active at once. Brain proposes candidates after resonant check-ins; user confirms; retired anchors are kept, not deleted.

## 7. Task states and WIP system

- tasks.state: backlog | ready | done | dropped. Weekly planning promotes backlog → ready under per-area WIP caps.
- WIP caps adapt to trailing completion rate (see brain-instructions.md).
- Events table logs cap history for velocity learning.

## 8. Analytics events (Phase 1, no UI)

New table `events`: id, event_name, session_id, created_at, numeric_value (optional). No text content ever. See roadmap.md analytics plan for the tracked event list and privacy rules.
