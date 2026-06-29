import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { BarSeries, Button, CheckPill, EmptyState, IconButton, ProgressLine, Surface } from "../components/ui";
import { dateLabel, lastDays, today } from "../utils/date";
import { getHabitCompletion, uid } from "../utils/health";

export function Habits({ habits, setHabits }) {
  const [name, setName] = useState("");
  const completion = getHabitCompletion(habits);

  const addHabit = () => {
    if (!name.trim()) return;
    setHabits((items) => [...items, { id: uid(), name: name.trim(), cadence: "Daily", target: 1, completions: {} }]);
    setName("");
  };

  const toggleHabit = (id) => {
    setHabits((items) => items.map((item) => item.id === id ? { ...item, completions: { ...(item.completions || {}), [today()]: !item.completions?.[today()] } } : item));
  };

  const chartData = lastDays(7).map((date) => ({
    label: dateLabel(date, { weekday: "short" }),
    value: habits.filter((habit) => habit.completions?.[date]).length,
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Surface
        title="Daily practice"
        eyebrow="Habits"
        action={
          <div className="flex gap-2">
            <input className="input w-52" value={name} onChange={(event) => setName(event.target.value)} placeholder="New habit" aria-label="Habit name" />
            <Button onClick={addHabit}><Plus className="h-4 w-4" /> Add</Button>
          </div>
        }
      >
        {habits.length === 0 ? (
          <EmptyState title="No habits yet" body="Add one habit that is easy enough to repeat on a difficult day." />
        ) : (
          <div className="grid gap-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900/40">
                <CheckPill checked={Boolean(habit.completions?.[today()])} onClick={() => toggleHabit(habit.id)}>
                  {habit.name}
                </CheckPill>
                <IconButton label={`Delete ${habit.name}`} destructive onClick={() => setHabits((items) => items.filter((item) => item.id !== habit.id))}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </Surface>

      <Surface title="Consistency" eyebrow="Last seven days">
        <ProgressLine value={completion.percent} label="Today complete" detail={`${completion.completed} of ${completion.total} habits finished.`} />
        <div className="mt-8">
          <BarSeries data={chartData} max={Math.max(1, habits.length)} color="#22C55E" />
        </div>
      </Surface>
    </div>
  );
}
