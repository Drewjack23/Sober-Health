import { Droplets, Dumbbell, Plus, Salad } from "lucide-react";
import { useState } from "react";
import { Button, Metric, NumberInput, Sparkline, Surface } from "../components/ui";
import { recipes } from "../data/defaults";
import { today } from "../utils/date";

export function Body({ health, setHealth, weights, setWeights, heightFt, setHeightFt, heightIn, setHeightIn, weight, setWeight, bmi, bmiCategory }) {
  const [newWeight, setNewWeight] = useState("");

  const updateHealth = (patch) => {
    setHealth((next) => ({
      ...next,
      ...patch,
      history: [
        ...next.history.filter((item) => item.date !== today()),
        {
          date: today(),
          water: patch.water ?? next.water,
          sleep: patch.sleep ?? next.sleep,
          exercise: patch.exercise ?? next.exercise,
          energy: patch.energy ?? next.energy,
        },
      ],
    }));
  };

  const addWeight = () => {
    const parsed = Number(newWeight);
    if (!parsed) return;
    setWeights((items) => [...items.filter((row) => row.date !== today()), { date: today(), weight: parsed }].sort((a, b) => a.date.localeCompare(b.date)));
    setWeight(parsed);
    setNewWeight("");
  };

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Water" value={`${health.water}/${health.waterGoal}`} detail="Cups today" tone="blue" />
        <Metric label="Sleep" value={`${health.sleep}h`} detail="Last night" tone="teal" />
        <Metric label="Exercise" value={`${health.exercise}m`} detail="Movement logged" tone="green" />
        <Metric label="BMI" value={bmi ? bmi.toFixed(1) : "--"} detail={bmiCategory || "Add stats"} tone="neutral" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Surface title="Body log" eyebrow="Daily inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Water cups" value={health.water} onChange={(water) => updateHealth({ water })} />
            <NumberInput label="Water goal" value={health.waterGoal} onChange={(waterGoal) => updateHealth({ waterGoal })} />
            <NumberInput label="Sleep hours" value={health.sleep} onChange={(sleep) => updateHealth({ sleep })} step="0.5" />
            <NumberInput label="Exercise minutes" value={health.exercise} onChange={(exercise) => updateHealth({ exercise })} />
          </div>
          <label className="mt-4 flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 px-3 dark:border-slate-700">
            <input type="checkbox" className="h-5 w-5 accent-brand-green" checked={health.medication} onChange={(event) => updateHealth({ medication: event.target.checked })} />
            <span className="font-medium">Medication taken</span>
          </label>
          <input className="input mt-3" value={health.nutrition} onChange={(event) => updateHealth({ nutrition: event.target.value })} aria-label="Nutrition note" />
        </Surface>

        <Surface title="Weight and vitals" eyebrow="Trend">
          <div className="grid gap-3 sm:grid-cols-3">
            <NumberInput label="Height ft" value={heightFt} onChange={setHeightFt} />
            <NumberInput label="Height in" value={heightIn} onChange={setHeightIn} />
            <NumberInput label="Weight lb" value={weight} onChange={setWeight} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="input w-36" type="number" value={newWeight} onChange={(event) => setNewWeight(event.target.value)} placeholder="Weight" aria-label="New weight" />
            <Button onClick={addWeight}><Plus className="h-4 w-4" /> Log weight</Button>
          </div>
          <div className="mt-5">
            <Sparkline data={weights} dataKey="weight" color="#3B82F6" height={180} />
          </div>
        </Surface>
      </div>

      <Surface title="Steady meals" eyebrow="Nutrition ideas">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="quiet-card">
              <Salad className="h-5 w-5 text-brand-teal" />
              <h3 className="mt-3 text-lg font-semibold">{recipe.title}</h3>
              <p className="mt-1 text-sm text-ink-muted dark:text-slate-300">{recipe.calories} kcal • {recipe.protein}g protein</p>
              <p className="mt-3 text-sm leading-6 text-ink-subtle dark:text-slate-400">{recipe.note}</p>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}
