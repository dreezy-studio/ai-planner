// Pure functions, no database calls — progress % is always computed live
// from current task state, never stored, so it can't drift out of sync.

export function taskAgeDays(createdAt: Date): number {
  const ms = Date.now() - createdAt.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function formatAge(days: number): string {
  if (days < 1) return "today";
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}

interface ProgressTask {
  state: string;
}

interface ProgressMilestone {
  tasks: ProgressTask[];
}

function completionPercent(tasks: ProgressTask[]): number | null {
  if (tasks.length === 0) return null;
  const done = tasks.filter((t) => t.state === "done").length;
  return Math.round((done / tasks.length) * 100);
}

// A goal's % rolls up from every task under its milestones plus any tasks
// linked to the goal directly (no milestone) — never a stored value.
export function goalProgressPercent(
  milestones: ProgressMilestone[],
  directTasks: ProgressTask[],
): number | null {
  const allTasks = [...directTasks, ...milestones.flatMap((m) => m.tasks)];
  return completionPercent(allTasks);
}
