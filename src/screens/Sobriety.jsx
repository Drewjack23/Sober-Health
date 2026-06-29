import { Award, Flame, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, EmptyState, IconButton, Metric, ProgressLine, Surface, cx } from "../components/ui";
import { dateLabel, daysBetween, today } from "../utils/date";
import { uid } from "../utils/health";

export function Sobriety({ trackers, setTrackers }) {
  const [name, setName] = useState("");

  const addTracker = () => {
    if (!name.trim()) return;
    setTrackers((items) => [...items, { id: uid(), name: name.trim(), resetAt: today(), relapses: [], milestones: [7, 14, 30, 60, 90, 180, 365] }]);
    setName("");
  };

  const resetToday = (id) => {
    setTrackers((items) => items.map((item) => item.id === id ? { ...item, resetAt: today(), relapses: [...(item.relapses || []), { date: today(), note: "Reset logged" }] } : item));
  };

  return (
    <div className="grid gap-6">
      <Surface
        title="Recovery timelines"
        eyebrow="Sobriety"
        action={
          <div className="flex flex-wrap gap-2">
            <input className="input w-52" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alcohol, nicotine..." aria-label="Tracker name" />
            <Button onClick={addTracker}><Plus className="h-4 w-4" /> Add</Button>
          </div>
        }
      >
        {trackers.length === 0 ? (
          <EmptyState title="Start with one timeline" body="Create a tracker for the behavior you are protecting. You can edit dates later." />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {trackers.map((item) => <SobrietyCard key={item.id} item={item} setTrackers={setTrackers} onReset={() => resetToday(item.id)} />)}
          </div>
        )}
      </Surface>
    </div>
  );
}

function SobrietyCard({ item, setTrackers, onReset }) {
  const streak = daysBetween(item.resetAt);
  const nextMilestone = (item.milestones || [7, 14, 30, 60, 90]).find((day) => day > streak) || 365;
  const relapses = item.relapses || [];

  return (
    <article className="timeline-card">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <input
            className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none"
            value={item.name}
            onChange={(event) => setTrackers((items) => items.map((next) => next.id === item.id ? { ...next, name: event.target.value } : next))}
            aria-label={`Rename ${item.name}`}
          />
          <p className="mt-1 text-sm text-ink-subtle dark:text-slate-400">Since {dateLabel(item.resetAt)}</p>
        </div>
        <IconButton label={`Delete ${item.name}`} destructive onClick={() => setTrackers((items) => items.filter((next) => next.id !== item.id))}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="Current streak" value={`${streak}d`} detail="Protected time" tone="green" />
        <Metric label="Resets" value={relapses.length} detail="Logged without judgment" tone="red" />
      </div>

      <div className="mt-5">
        <ProgressLine value={(streak / nextMilestone) * 100} label={`${nextMilestone}-day milestone`} detail={`${Math.max(nextMilestone - streak, 0)} days remaining`} />
      </div>

      <CalendarStrip resetAt={item.resetAt} relapseDates={relapses.map((entry) => entry.date)} />

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="danger" onClick={onReset}><RefreshCcw className="h-4 w-4" /> Reset today</Button>
        <input className="input w-auto" type="date" value={item.resetAt} onChange={(event) => setTrackers((items) => items.map((next) => next.id === item.id ? { ...next, resetAt: event.target.value } : next))} aria-label={`Set ${item.name} date`} />
      </div>
    </article>
  );
}

function CalendarStrip({ resetAt, relapseDates }) {
  const cells = Array.from({ length: 84 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (83 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, clean: key >= resetAt, relapse: relapseDates.includes(key) };
  });

  return (
    <div className="mt-5">
      <div className="grid grid-cols-12 gap-1" aria-label="Last twelve weeks">
        {cells.map((cell) => (
          <span key={cell.key} title={cell.key} className={cx("h-2 rounded-full", cell.relapse ? "bg-brand-red" : cell.clean ? "bg-brand-green" : "bg-slate-200 dark:bg-slate-700")} />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-subtle dark:text-slate-400">Last 12 weeks</p>
    </div>
  );
}
