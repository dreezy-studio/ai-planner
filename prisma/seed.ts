// Loads Austin's real goals/tasks/habits/anchors/memory into the database.
// Run with: npx prisma db seed  (wipes and re-inserts everything below — safe
// to re-run, but never point this at the production DATABASE_URL casually).
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

// Approximate dates Austin gave for long-standing tasks, so their on-page
// "age" is real from day one instead of showing "just created."
const dates = {
  childSupportProof: new Date("2026-06-15"),
  bathrooms: new Date("2026-09-21"),
  cellarRust: new Date("2026-06-15"),
  garageLeds: new Date("2026-06-15"),
  rockChip: new Date("2026-08-15"),
  carPaint: new Date("2026-08-15"),
  // This Week's ready tasks without a named date — dated to the week itself.
  thisWeek: new Date("2026-07-19"),
  // Backlog tasks with no other date signal.
  backlogDefault: new Date("2026-07-01"),
};

async function main() {
  // Wipe in dependency order so re-running this script is safe.
  await prisma.event.deleteMany();
  await prisma.feedbackLog.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.anchor.deleteMany();
  await prisma.memory.deleteMany();
  await prisma.checkinPrompt.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.goal.deleteMany();

  // ---------------------------------------------------------------------
  // Goals + milestones (2026 Annual Goals — the 5 confirmed ACTIVE ones;
  // Career/Health/Financial/Fatherhood are unconfirmed placeholders in
  // goals.md and are intentionally skipped until Austin confirms them).
  // ---------------------------------------------------------------------

  await prisma.goal.create({
    data: {
      title: "Spiritual Growth",
      description:
        "Improve my state of being through lasting daily spiritual practice — meditation, yoga, prayer, song, affirmations. Learn and stretch through discipline and self-love.",
      category: "Spiritual",
      timeframe: "annual",
      status: "active",
      milestones: {
        create: [
          { title: "Schedule that empowers daily practice (7:30am wake anchor)", order: 1, status: "active" },
          { title: "Present-moment awareness — reflect on where I'm at, use tools to shift daily", order: 2, status: "active" },
          { title: "Track what draws me closer to God; release what doesn't", order: 3, status: "active" },
          { title: "Expand toolkit and continue learning (chakras, merkabah, etc.)", order: 4, status: "active" },
        ],
      },
      habits: {
        create: [
          { title: "Meditation", cadence: "daily", status: "active" },
          { title: "Yoga (Five Rites)", cadence: "daily", status: "active" },
          { title: "Affirmations (Violet Flame)", cadence: "daily", status: "active" },
          { title: "Prayer & song", cadence: "daily", status: "active" },
          { title: "Time in nature", cadence: "weekly", status: "active" },
          { title: "Alone time to ponder/meditate", cadence: "weekly", status: "active" },
        ],
      },
      tasks: {
        create: [
          { title: "Read three spiritual books", area: "Personal", state: "backlog", source: "user", createdAt: dates.backlogDefault },
        ],
      },
    },
  });

  await prisma.goal.create({
    data: {
      title: "Take Bold Action",
      description:
        "Recognize ways of being that don't work and boldly shift. Stay conscious of where I'm at; love myself enough to face life head-on.",
      category: "Personal",
      timeframe: "annual",
      status: "active",
      milestones: {
        create: [
          { title: "Regular accountability reflection — when in the grungies: how am I creating this, what deserves to shift?", order: 1, status: "active" },
          { title: "Know my grounded state — what it feels like, what fruits it creates, what I must let go of to keep it", order: 2, status: "active" },
          { title: "Uncover uncommitted roots; write about them; build new beliefs", order: 3, status: "active" },
        ],
      },
    },
  });

  const likeMindedPeople = await prisma.goal.create({
    data: {
      title: "Surround Myself With Like-Minded People",
      description: "Find aligned people, expand my circle, build a tribe of loved ones.",
      category: "Personal",
      timeframe: "annual",
      status: "active",
      milestones: {
        create: [
          { title: "Consistent 1-on-1 connection with like-minded friends (text → call → lunch → group activities)", order: 1, status: "active" },
          { title: "Regular presence at gatherings — target 2x/month; intentionally meet 2-3 new people each", order: 2, status: "active" },
          { title: "Become a creator of gatherings — seasonal activities, meaningful events (camping, lake time)", order: 3, status: "active" },
        ],
      },
      tasks: {
        create: [
          {
            title: "Write down names of people I'd like to connect with",
            area: "Personal",
            state: "done",
            source: "user",
            createdAt: new Date("2026-07-01"),
            completedAt: new Date("2026-07-10"),
          },
          {
            title: "Plan Uinta trip",
            area: "Personal",
            state: "ready",
            source: "user",
            createdAt: dates.thisWeek,
          },
        ],
      },
    },
  });

  const journalReflect = await prisma.goal.create({
    data: {
      title: "Journal & Reflect",
      description: "Journal regularly. Get thoughts out. Spirit writings. Gratitude and growth focus.",
      category: "Personal",
      timeframe: "annual",
      status: "active",
      milestones: {
        create: [
          { title: "Consistent daily/weekly check-in rhythm in AI Planner project", order: 1, status: "active" },
          { title: "Spirit writings as recurring practice", order: 2, status: "active" },
        ],
      },
    },
  });

  const spiritWritingsMilestone = await prisma.milestone.findFirstOrThrow({
    where: { goalId: journalReflect.id, title: "Spirit writings as recurring practice" },
  });

  await prisma.task.create({
    data: {
      title: "Spirit writings practice",
      area: "Personal",
      state: "backlog",
      source: "user",
      goalId: journalReflect.id,
      milestoneId: spiritWritingsMilestone.id,
      createdAt: dates.backlogDefault,
    },
  });

  const planAndExecute = await prisma.goal.create({
    data: {
      title: "Plan and Execute",
      description: "This goal has become the AI Planner itself: building and living the planning system.",
      category: "Personal",
      timeframe: "annual",
      status: "active",
      milestones: {
        create: [
          // Marked "PAUSED until time opens" in goals.md, but this build session
          // is that time opening — reflecting the real current state, not the stale doc text.
          { title: "Phase 1 build (repo, database, Goals screen)", order: 2, status: "active" },
          { title: "Phase 2 build (brain wired into app)", order: 3, status: "paused" },
          { title: "Daily driver — fully replaces Notion ritual", order: 4, status: "paused" },
        ],
      },
    },
  });

  await prisma.milestone.create({
    data: {
      goalId: planAndExecute.id,
      title: "Brain prototyped, tested in daily use via Claude Project",
      order: 1,
      status: "active",
      tasks: {
        create: [
          { title: "Repo populated + project knowledge synced", area: "Dreezy", state: "done", source: "user", createdAt: new Date("2026-07-20"), completedAt: new Date("2026-07-20") },
          { title: "Real 2026 goals translated into goals.md", area: "Dreezy", state: "done", source: "user", createdAt: new Date("2026-07-20"), completedAt: new Date("2026-07-20") },
          { title: "Energy Map corrected by Austin", area: "Dreezy", state: "ready", source: "user", createdAt: new Date("2026-08-01") },
          { title: "2+ weeks of real check-ins", area: "Dreezy", state: "ready", source: "user", createdAt: new Date("2026-08-01") },
          { title: "Mine ChatGPT export for memory (computer session)", area: "Dreezy", state: "backlog", source: "user", createdAt: dates.backlogDefault },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------
  // Loose tasks — This Week's ready lists + Backlog, from goals.md.
  // ---------------------------------------------------------------------

  await prisma.task.createMany({
    data: [
      // Personal (ready)
      { title: "Relationship inventory", area: "Personal", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "Sprinklers", area: "Personal", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "Child support proof", area: "Personal", state: "ready", source: "user", createdAt: dates.childSupportProof },
      { title: "Bathrooms", area: "Personal", state: "ready", source: "user", createdAt: dates.bathrooms },
      { title: "Rock chip", area: "Personal", state: "ready", source: "user", createdAt: dates.rockChip },
      { title: "Car paint", area: "Personal", state: "ready", source: "user", createdAt: dates.carPaint },

      // Work / Aon (ready)
      { title: "Audit testing", area: "Work", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "ADO intake form", area: "Work", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "Expense report", area: "Work", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "Q3 goals", area: "Work", state: "ready", source: "user", createdAt: dates.thisWeek },

      // Dreezy Studio / Projects
      { title: "MatchRox invoice", area: "Dreezy", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "Resume", area: "Dreezy", state: "ready", source: "user", createdAt: dates.thisWeek },
      { title: "Claude files to Git", area: "Dreezy", state: "done", source: "user", createdAt: dates.thisWeek, completedAt: dates.thisWeek },
      { title: "Upload goals", area: "Dreezy", state: "done", source: "user", createdAt: dates.thisWeek, completedAt: dates.thisWeek },

      // Home (ready) — full detail folded into the title, same as goals.md
      {
        title:
          "Toilet fix [both] — phantom refills every ~15 min. Fill valve already replaced; likely flapper/flush-valve seal leaking into bowl. Buy flapper (~$10), swap (~20 min); if refills persist, check flush valve seat.",
        area: "Home",
        state: "ready",
        source: "user",
        priority: "high",
        createdAt: dates.thisWeek,
      },

      // Backlog
      { title: "Home project list (needs breakdown session)", area: "Home", state: "backlog", source: "user", createdAt: dates.backlogDefault },
      { title: "Cellar rust", area: "Home", state: "backlog", source: "user", createdAt: dates.cellarRust },
      { title: "Garage LEDs", area: "Home", state: "backlog", source: "user", createdAt: dates.garageLeds },
    ],
  });

  // ---------------------------------------------------------------------
  // Anchors (both currently active, per brain-instructions.md's max-2 rule)
  // ---------------------------------------------------------------------

  await prisma.anchor.createMany({
    data: [
      { content: "It's okay to say no", status: "active" },
      { content: "If it creates chaos or drains me, it needs a boundary", status: "active" },
    ],
  });

  // ---------------------------------------------------------------------
  // Weekly journal entry — the dashboard reads the most recent type:"weekly"
  // entry's `summary` as this week's intention (see architecture decision
  // in the build-session plan: no dedicated intention table this session).
  // ---------------------------------------------------------------------

  await prisma.journalEntry.create({
    data: {
      type: "weekly",
      summary: "I AM Disciplined & Open",
      transcript:
        "Weekly planning for 07/19–07/25. Reflected on the prior week, set the WIP-capped ready list per area, chose the weekly intention, confirmed both active anchors, produced the three-zone card.",
      createdAt: dates.thisWeek,
    },
  });

  // ---------------------------------------------------------------------
  // Checkin prompts — the 5-question monthly system from project-brief.md.
  // ---------------------------------------------------------------------

  await prisma.checkinPrompt.createMany({
    data: [
      { type: "monthly", question: "How do you feel about your progress?", order: 1 },
      { type: "monthly", question: "What priorities got missed?", order: 2 },
      { type: "monthly", question: "How did you create your outcomes?", order: 3 },
      { type: "monthly", question: "What are three key lessons?", order: 4 },
      { type: "monthly", question: "What's your commitment for next month?", order: 5 },
    ],
  });

  // ---------------------------------------------------------------------
  // Memory — distilled from memory.md.
  // ---------------------------------------------------------------------

  await prisma.memory.createMany({
    data: [
      { category: "context", content: "Personal mission: build a life of freedom, presence, and meaning by becoming an intentional father, creating systems that help people live better, growing spiritually, and using career as leverage rather than identity." },
      { category: "context", content: "Core values, in order: Presence, Freedom, Spiritual Growth, Fatherhood, Continuous Growth." },
      { category: "context", content: "Father first. Daughter Scarlett is the highest real-world priority. Dog: Teddy." },
      { category: "context", content: "Season of stability and planting seeds — not maximizing growth (mid-2026)." },
      { category: "context", content: "Keeping corporate role (design systems manager at Aon) deliberately for stability and time with Scarlett." },
      { category: "context", content: "Freelancing (Dreezy Studio) intentionally phasing down; product building is the seed." },
      { category: "context", content: "Navigating co-parenting after Christina's move to Ogden (~1 hr away). Custody roughly 50/50: Scarlett with Austin Tuesdays and Wednesdays plus every other weekend." },
      { category: "context", content: "Longer-term where-to-live decision tied to Scarlett's schooling timeline — open thread." },
      { category: "context", content: "AI Planner product build is Austin's primary personal project." },
      { category: "context", content: "Making service-tier ceilings explicit in client work before emotional investment begins (lesson from a difficult Framer project)." },
      { category: "context", content: "Designer / design systems manager (Aon, 100+ designers, leading AI adoption including Claude Code and Opus)." },
      { category: "context", content: "Daily grounding: yoga, meditation as receptive listening, affirmations. Spirituality rooted in God, outside organized religion." },
      { category: "context", content: "Journaling and intention-setting are established habits: daily reflections, weekly planning, monthly planning." },
      { category: "patterns", content: "In-the-moment decisions without pre-set limits consistently produce outcomes he regrets. Pre-commitment works; improvisation around temptation doesn't." },
      { category: "patterns", content: "Transitioning away from party-oriented social scene toward friendships built around nature, kids, creativity, and growth." },
      { category: "patterns", content: "Voice-first, low-friction workflows stick; tedious manual systems (deep Notion upkeep) decay." },
      { category: "patterns", content: "Writes weekly tasks on physical paper cards — tactile step matters, should be preserved not replaced." },
      { category: "patterns", content: "When talking to AI for planning: near-100% session adherence. Notion planning: ~60-70% adherence. The ritual is the retention mechanism." },
      { category: "patterns", content: "Tasks that sit 3+ weeks often carry emotional weight, not just time cost. Curiosity not shame." },
      { category: "preferences", content: "Wants clarity, efficiency, structured breakdowns with tradeoffs and next steps." },
      { category: "preferences", content: "Strong frontend (React, Webflow, Framer); new to backend — explain backend concepts in plain English always." },
      { category: "preferences", content: "Enjoys time outdoors with Scarlett and Teddy: camping, fishing, paddleboarding, disc golf, hiking." },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
