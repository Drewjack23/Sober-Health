import { ArrowRight, Droplets, Flame, Moon, PenLine, Route } from "lucide-react";
import { Button, Metric, ProgressLine, Surface } from "../components/ui";
import { getBestStreak, getDailyBrief, getHabitCompletion, getTodayScore } from "../utils/health";

export function Today({ data, setActive }) {
  const score = getTodayScore(data);
  const bestStreak = getBestStreak(data.trackers);
  const habit = getHabitCompletion(data.habits);
  const latestMood = data.moods.at(-1)?.mood;
  const brief = getDailyBrief(data);

  return (
    <div className="grid gap-6">
      <section className="daily-brief">
        <div>
          <p className="eyebrow">Daily brief</p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">A quieter way to keep your health visible.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-muted dark:text-slate-300">{brief}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => setActive("mind")}>Log check-in</Button>
            <Button variant="secondary" onClick={() => setActive("habits")}>Review habits</Button>
          </div>
        </div>

        <div className="score-card">
          <p className="text-sm font-medium text-ink-muted dark:text-slate-300">Today’s readiness</p>
          <p className="mt-2 text-7xl font-semibold tracking-tight">{score}</p>
          <ProgressLine label="Daily foundation" value={score} detail="Based on water, sleep, habits, and mood." />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Sobriety" value={`${bestStreak}d`} detail="Best active streak" tone="green" />
        <Metric label="Mood" value={latestMood ? `${latestMood}/10` : "Not logged"} detail="Latest check-in" tone="teal" />
        <Metric label="Water" value={`${data.health.water}/${data.health.waterGoal}`} detail="Cups today" tone="blue" />
        <Metric label="Habits" value={`${habit.completed}/${habit.total}`} detail="Completed today" tone="gold" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Surface title="Today’s focus" eyebrow="Next best actions">
          <div className="grid gap-3">
            <FocusRow icon={Droplets} title="Hydrate deliberately" body={`${Math.max(data.health.waterGoal - data.health.water, 0)} cups left toward your goal.`} />
            <FocusRow icon={Route} title="Move gently" body={`${data.health.exercise} minutes logged. Add a short walk if your body wants it.`} />
            <FocusRow icon={PenLine} title="Write one honest line" body={data.journals.length ? "Your reflection history is building." : "A brief note is enough to start a pattern."} />
          </div>
        </Surface>

        <Surface title="Quick paths" eyebrow="No clutter">
          <div className="grid gap-2">
            {[
              ["sobriety", "Protect streaks", Flame],
              ["body", "Log body metrics", Moon],
              ["profile", "View progress", ArrowRight],
            ].map(([id, label, Icon]) => (
              <button key={id} className="quick-link" onClick={() => setActive(id)}>
                <span className="flex items-center gap-3"><Icon className="h-4 w-4" /> {label}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function FocusRow({ icon: Icon, title, body }) {
  return (
    <div className="focus-row">
      <span className="focus-icon"><Icon className="h-4 w-4" /></span>
      <span>
        <span className="block font-semibold text-ink dark:text-white">{title}</span>
        <span className="text-sm leading-6 text-ink-muted dark:text-slate-300">{body}</span>
      </span>
    </div>
  );
}
