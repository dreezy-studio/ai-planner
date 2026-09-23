import { prisma } from "@/lib/db";
import { formatAge, goalProgressPercent, taskAgeDays } from "@/lib/progress";

const AREA_ORDER = ["Personal", "Work", "Dreezy", "Home"] as const;

// This page reads the database on every request — never pre-render it at
// build time (the build container has no database to query against).
export const dynamic = "force-dynamic";

export default async function Home() {
  const [weeklyEntry, anchors, readyTasks, goals] = await Promise.all([
    prisma.journalEntry.findFirst({
      where: { type: "weekly" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.anchor.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.findMany({
      where: { state: "ready" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.goal.findMany({
      where: { status: "active" },
      include: {
        milestones: { include: { tasks: true } },
        tasks: { where: { milestoneId: null } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const tasksByArea = new Map<string, typeof readyTasks>();
  for (const task of readyTasks) {
    const list = tasksByArea.get(task.area) ?? [];
    list.push(task);
    tasksByArea.set(task.area, list);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900">
      <main className="mx-auto flex max-w-md flex-col gap-10">
        <section className="text-center">
          {weeklyEntry?.summary && (
            <p className="text-xl font-medium tracking-tight">{weeklyEntry.summary}</p>
          )}
          {anchors.length > 0 && (
            <ul className="mt-3 space-y-1">
              {anchors.map((anchor) => (
                <li key={anchor.id} className="text-sm italic text-zinc-500">
                  &ldquo;{anchor.content}&rdquo;
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Ready
          </h2>
          {AREA_ORDER.filter((area) => tasksByArea.has(area)).map((area) => (
            <div key={area}>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">{area}</h3>
              <ul className="space-y-1.5">
                {tasksByArea.get(area)!.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2 shadow-sm"
                  >
                    <span className="text-sm text-zinc-800">
                      {task.priority === "high" && (
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500 align-middle" />
                      )}
                      {task.title}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {formatAge(taskAgeDays(task.createdAt))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Goals
          </h2>
          <ul className="space-y-2">
            {goals.map((goal) => {
              const percent = goalProgressPercent(goal.milestones, goal.tasks);
              return (
                <li key={goal.id} className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-zinc-800">{goal.title}</span>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {percent === null ? "—" : `${percent}%`}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-zinc-400"
                      style={{ width: `${percent ?? 0}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
