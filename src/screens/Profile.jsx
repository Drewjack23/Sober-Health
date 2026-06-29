import { Award, CheckCircle2, Flame, PenLine, Target, Waves } from "lucide-react";
import { Metric, NumberInput, Surface } from "../components/ui";
import { getBestStreak } from "../utils/health";

export function Profile({ trackers, moods, journals, habits, weightGoal, setWeightGoal }) {
  const bestStreak = getBestStreak(trackers);
  const habitWins = habits.reduce((sum, habit) => sum + Object.values(habit.completions || {}).filter(Boolean).length, 0);
  const badges = [
    { label: "First check-in", earned: moods.length > 0, icon: Waves },
    { label: "One week protected", earned: bestStreak >= 7, icon: Flame },
    { label: "Reflection rhythm", earned: journals.length >= 3, icon: PenLine },
    { label: "Habit foundation", earned: habitWins >= 10, icon: CheckCircle2 },
  ];

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Best streak" value={`${bestStreak}d`} detail="Across active timelines" tone="green" />
        <Metric label="Mood logs" value={moods.length} detail="Check-ins saved" tone="teal" />
        <Metric label="Journal entries" value={journals.length} detail="Private reflections" tone="blue" />
        <Metric label="Habit wins" value={habitWins} detail="Total completions" tone="gold" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Surface title="Achievements" eyebrow="Progress">
          <div className="grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className={badge.earned ? "badge badge-earned" : "badge"}>
                  <Icon className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">{badge.label}</p>
                    <p className="text-sm text-ink-subtle dark:text-slate-400">{badge.earned ? "Earned" : "In progress"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface title="Personal goals" eyebrow="Direction">
          <NumberInput label="Weight goal" value={weightGoal || ""} onChange={setWeightGoal} />
          <div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/50">
            <Target className="h-5 w-5 text-brand-blue" />
            <p className="mt-3 text-lg font-semibold leading-7">Small promises become visible progress.</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted dark:text-slate-300">Use this space to keep goals practical and measurable.</p>
          </div>
        </Surface>
      </div>
    </div>
  );
}
