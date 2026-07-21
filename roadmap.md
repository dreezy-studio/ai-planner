# AI Planner — Living Roadmap (v1.1)

*Single source of truth for what gets built when. New ideas get slotted here — MVP only grows if something else moves out. Lives in the repo next to the project brief.*

**Last updated: July 20, 2026**

---

## Product principles (the constants)

1. **Journaling is the engine.** Talking is the input; everything else derives from it.
2. **Opinionated brain, unopinionated action layer.** The AI is smart about what matters; the user chooses how to act.
3. **Privacy is structural, not policy.** Raw journals stay on-device; the model sees only the distilled layer; analytics see metadata, never content.
4. **Distillation quality is the core competency.** Personalization comes from the memory layer we build, not from the model seeing more raw data.
5. **Track data from day one, build dashboards later.** You can't backtrack data.
6. **Goal hierarchy (ranked, guard the order):** (1) improve Austin's life and planning, (2) learn AI-era product building, (3) share with people he cares about, (4) optional future monetization — a door kept open, never the driver. Scope and pace answer to #1, not #4.
7. **Voice is the primary input; manual editing is the fallback.** Train the user to talk.
8. **The interface is a rhythm, not a layout.** One surface whose content is decided by time and session state, not navigation.
9. **Core interaction pattern:** talk → AI proposes structured changes → Catch-Up-style confirmation (bulk approve/edit) → progress feedback. All AI writes pass through human confirmation. Trust via the loop, not a settings page.

---

## Phase 0 — Brain prototyping (NOW, in Claude Project, no code)

- [x] Project brief + architecture addendum drafted
- [x] Three-zone paper card format designed and in live use
- [ ] AI Planner project created with knowledge docs
- [ ] GitHub repo populated; repo connected to project knowledge via GitHub sync
- [ ] Real 2026 goals filled into goals.md (from Notion screenshots)
- [ ] Energy Map confirmed (draft exists)
- [ ] Daily/weekly planning running in project with structured output
- [ ] Weekly 5-min brain-spec review habit
- [ ] Manual time-block experiment: weekly planning outputs proposed blocks; track whether Austin follows them (evidence for Phase 3/4 auto-timeblocking)
- [ ] ChatGPT export mined for Memory additions (computer session)
- [ ] Meeting-transcript mode tested in real use

## Phase 1 — MVP build (when build time opens; est. 4–8 Claude Code sessions over 3–5 wks part-time)

**Goal: replaces the Notion planning ritual for one user (Austin).**

- Next.js + SQLite + Prisma skeleton
- FULL five-phase schema from day one (schema-ahead policy): goals, milestones, tasks (with state: backlog|ready|done|dropped; source: user|ai|meeting|import; priority), journal_entries (is_private, raw_stored_locally), memory, checkin_prompts, habits, habit_logs, anchors, preferences, feedback_log, events
- Goals screen: goal tree, progress % rollups (computed, not stored)
- Check-in chat screen: session types (morning brief / daily reflection / weekly / monthly), phone dictation for voice
- Brain API route: full-context prompting, structured JSON output, validated before saving
- **Catch-Up confirmation screen**: all AI-proposed changes rendered for bulk approve/edit; progress bars animate on confirm
- **Now Card dashboard**: single suggested next task + reasoning + done/skip actions. Full task list lives in planning views only, never the daily surface.
- WIP-capped weekly planning (backlog → ready promotion)
- Event tracking wired in, no dashboard: checkin started/completed, type, word counts, task/goal/milestone/habit events, session opens. North-star metric: planning-session adherence.
- CSV task import/export
- Deploy to Railway + simple password

## Phase 2 — Trust & shaping (single-user, maybe first testers; est. ~1 month part-time)

- Preference layer: in-chat feedback → proposed rule → confirm → persists
- Memory transparency screen: view/edit/delete everything the AI knows
- Anchors: AI-distilled reminders surfaced on dashboard; propose/retire flow
- Private entries honored end-to-end
- Habit tracking via conversation (end-of-day capture, no button-pushing); streak awareness; habit-fit questioning
- Adaptive WIP caps from trailing completion rate (+1 at 2 clean weeks; –1 below 60%; floor 2)
- Celebration moments on clearing committed sets; bonus-task offers
- Meeting transcript upload → proposed tasks → confirm
- .ics calendar upload/paste as availability context
- Browsable backlog view (secondary surface)
- Time/state-aware surface (rhythm UI v1)
- Local-only storage of raw transcripts begins (device zone honored literally)

## Phase 3 — First outside users

- Accounts + auth
- Onboarding = goals-intake interview conducted by the brain (any format: screenshots, voice, text)
- Adaptive planning modes — output format driven by preference layer + observed behavior, NOT persona presets (loose: 3 gentle priorities / structured: full blocks + daily 15-min recalibration / hybrid: prioritized pick-list). Optional short intake form seeds the starting mode.
- Peak-hours logic: learn productive windows, serve hard tasks there, prompt user to protect them
- Energy-pattern learning: learned availability vs stated; velocity forecasting from task history ("to hit this milestone by X, you need Y/week")
- Designer analytics dashboard (reads events table; metadata only)
- Feedback pipeline to designer: opt-in, content-free
- Prompt-protection rules: agent refuses to disclose system instructions; extraction attempts logged
- Notifications / unprompted brain (server-scheduled nudges)

## Phase 4+ — Differentiators

- Local LLM distillation: on-device summarization so raw entries never touch the cloud
- Auto-timeblocking with calendar write-access — pending Phase 0 manual-blocks evidence
- Life Wrapped: monthly/quarterly/yearly recap — goals achieved, habits transformed, values lived, intention words of the year, stated-values vs actual-time gaps. Celebration + next-period goal seeding.
- Companion View: narrow always-visible panel (browser tab first; phone widget; someday Outlook add-in) — intention, active anchor, next task, habit checks, built-in Pomodoro/focus timer
- Custom voice capture UX
- Real integrations: Google/Outlook calendar sync, Apple Reminders/Siri capture
- App store distribution (only when earned)
- Multi-user polish, pricing, positioning

---

## Analytics plan (metadata only — never journal content)

Tracked from Phase 1 in own `events` table (event, timestamp, session id; no text content):
- Engagement: sessions opened, check-ins started vs completed, type, **planning-session adherence streaks (north star)**
- Depth: entry word counts, session length (does more context → better outcomes?)
- Outcomes: tasks created/completed by source, goals/milestones completed, habit adherence, WIP cap history
- Product: feature usage, preference rules created, feedback submitted, timer usage

Dashboard UI: Phase 3. Privacy rules: no journal text, no memory content, no goal titles in analytics. Feedback text is the single exception, opt-in per submission.

---

## Decision Log

- **Schema-ahead, surfaces-behind (standing policy):** data structures ship in Phase 1 for the full five-phase vision (cheap early, expensive to retrofit); features ship only on evidence (cheap anytime, expensive to guess wrong). Rationale: AI compressed build cost, not the cost of being wrong; solo builder's scarce resource is focus.
- **Roles:** this chat = PM + thinking partner + architecture; Claude Code = repo hands + build; Claude Project = the brain lab where journaling happens. Repo is the source of truth; project knowledge syncs FROM repo via GitHub integration.
- **DECISION NEEDED protocol:** anything with long-term infrastructure consequences gets flagged explicitly with options + lift estimates before spec changes. No silent choices on consequential items.
- **Economics posture:** rent model intelligence via API (never train own model). Est. $1–5/user/mo model cost at heavy use; ~$5–20/mo hosting total at small scale; web-first, no app store until earned. Unit economics viable if monetization ever activates; not a current constraint.
- **Retention thesis:** the ritual is the retention mechanism (evidence: Austin's Notion adherence ~60-70% vs near-100% with conversational AI). Onboarding = goals-intake interview; first-session felt value > gamification. Gamification decorates, never substitutes.
- **Personas are design fiction, not architecture:** adaptivity via preference layer + observed behavior serves all planning styles; no fixed persona profiles.
- **Passive activity tracking (Timely-style): parked with privacy asterisk** — only ever local + opt-in if ever built; voluntary Pomodoro timers preferred as the clean data source.
- **Paper card is the v0 companion UI** — physical constraint = natural WIP limit; keep the tactile step; app generates card content, never replaces the ritual.

## Open Decisions

- (none blocking) Pending inputs: Notion goal screenshots → goals.md; Energy Map draft → Austin's corrections.

---

## Parking lot

- Time-blocking view / built-in calendar
- Time tracking layer (toggl-like): passive log of focused time per task, exportable, hourly-rate insights for freelancers
- Handwritten desk-card generator (print/format weekly card)
- Community / shared accountability features

---

## Phase estimates & costs (rough, honest)

- Phase 0: ~4 weeks @ 90 min/wk — gated by Austin's learning rate, not build speed
- Phase 1: 4–8 Claude Code sessions, 3–5 weeks part-time (or ~2 focused weekends)
- Phase 2: ~1 month part-time iteration
- Running costs at single-user scale: API pennies per check-in; ~$5–20/mo hosting when deployed
- ~20 friendly testers: roughly $50–100/mo all-in

## How this document works

1. New idea in chat → Claude drafts the entry + suggests a phase.
2. Placement rule: does it serve the current phase's goal? If not, it waits.
3. Updates flow: chat → Claude Code commits → GitHub sync in project. Repo is truth; chats are scratchpad.
