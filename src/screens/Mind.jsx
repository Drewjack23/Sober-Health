import { PenLine, Save, Waves } from "lucide-react";
import { useState } from "react";
import { Button, EmptyState, Field, Sparkline, Surface } from "../components/ui";
import { journalPrompts } from "../data/defaults";
import { dateLabel, today } from "../utils/date";
import { uid } from "../utils/health";

export function Mind({ moods, setMoods, journals, setJournals, health, setHealth }) {
  const [mood, setMood] = useState(moods.at(-1)?.mood || 7);
  const [entry, setEntry] = useState("");
  const [tags, setTags] = useState("calm, honest");
  const prompt = journalPrompts[journals.length % journalPrompts.length];

  const saveMood = () => {
    setMoods((items) => [...items.filter((item) => item.date !== today()), { date: today(), mood, stress: health.stress, anxiety: health.anxiety, energy: health.energy }]);
  };

  const saveJournal = () => {
    if (!entry.trim()) return;
    setJournals((items) => [
      {
        id: uid(),
        date: today(),
        prompt,
        body: entry.trim(),
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      },
      ...items,
    ]);
    setEntry("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Surface title="Check in" eyebrow="Mind">
        <div className="grid gap-5">
          <Range label="Mood" value={mood} onChange={setMood} />
          <Range label="Stress" value={health.stress} onChange={(stress) => setHealth((next) => ({ ...next, stress }))} />
          <Range label="Energy" value={health.energy} onChange={(energy) => setHealth((next) => ({ ...next, energy }))} />
          <Range label="Anxiety" value={health.anxiety} onChange={(anxiety) => setHealth((next) => ({ ...next, anxiety }))} />
          <Button onClick={saveMood}><Waves className="h-4 w-4" /> Save check-in</Button>
        </div>
      </Surface>

      <div className="grid gap-6">
        <Surface title="Mood pattern" eyebrow="Last entries">
          <Sparkline data={moods.slice(-14)} dataKey="mood" color="#14B8A6" height={170} />
        </Surface>

        <Surface title="Private journal" eyebrow="Reflection">
          <p className="mb-3 text-lg font-medium leading-7 text-ink dark:text-white">{prompt}</p>
          <textarea className="input min-h-36 w-full resize-y leading-7" value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="Write a few honest sentences..." aria-label="Journal entry" />
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="input flex-1" value={tags} onChange={(event) => setTags(event.target.value)} aria-label="Emotion tags" />
            <Button onClick={saveJournal}><Save className="h-4 w-4" /> Save</Button>
          </div>
        </Surface>

        <Surface title="Recent reflections" eyebrow="History">
          {journals.length === 0 ? (
            <EmptyState title="No reflections yet" body="Short entries count. The goal is noticing, not writing perfectly." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {journals.slice(0, 4).map((item) => (
                <article key={item.id} className="quiet-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle dark:text-slate-400">{dateLabel(item.date)}</p>
                  <p className="mt-2 line-clamp-4 leading-7 text-ink-muted dark:text-slate-200">{item.body}</p>
                  <div className="mt-3 flex flex-wrap gap-1">{item.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}</div>
                </article>
              ))}
            </div>
          )}
        </Surface>
      </div>
    </div>
  );
}

function Range({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="mt-1 flex items-center gap-4">
        <input className="range" type="range" min="0" max="10" value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <span className="w-12 text-right text-sm font-semibold">{value}/10</span>
      </div>
    </Field>
  );
}
