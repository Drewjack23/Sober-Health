import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Upload, Download, Calendar, LineChart, Salad, HeartPulse, Scale, TimerReset, Sun, Moon, ListChecks, CalendarDays, Target } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// ===== Utilities =====
function classNames(...xs) { return xs.filter(Boolean).join(" "); }
function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (typeof initialValue === "function" ? initialValue() : initialValue);
    } catch {
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}
function uid() { try { return crypto.randomUUID(); } catch { return 'id-' + Math.random().toString(36).slice(2); } }
const fmtDate = (d) => new Date(d).toISOString().slice(0,10);
const daysBetween = (from, to=new Date()) => {
  const a = new Date(fmtDate(from));
  const b = new Date(fmtDate(to));
  return Math.max(0, Math.round((b - a) / (1000*60*60*24)));
};
const clamp = (x, a=0, b=100) => Math.max(a, Math.min(b, x));

// Build calendar cells (pure, testable)
function buildCalendarCells(resetAt, spanDays = 84) {
  const start = new Date();
  const cells = Array.from({ length: spanDays }, (_, i) => {
    const d = new Date(); d.setDate(start.getDate() - (spanDays - 1 - i));
    const clean = d >= new Date(fmtDate(resetAt));
    return { date: fmtDate(d), clean };
  });
  return cells;
}

// Create a blank weekly meal plan (pure, testable)
function createBlankPlan(days, meals) {
  const out = {};
  for (const d of days) {
    out[d] = {};
    for (const m of meals) out[d][m] = null;
  }
  return out;
}

// ===== Theme =====
function useTheme() {
  const [theme, setTheme] = useLocalStorage("ui:theme", "system"); // "light" | "dark" | "system"
  useEffect(() => {
    const root = document.documentElement;
    const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === "dark" || (theme === "system" && sysDark);
    root.classList.toggle('dark', isDark);
  }, [theme]);
  return [theme, setTheme];
}
function ThemeToggle({ theme, setTheme }) {
  const options = [
    { key: "light", label: "Light", icon: <Sun className="h-4 w-4"/> },
    { key: "dark", label: "Dark", icon: <Moon className="h-4 w-4"/> },
    { key: "system", label: "Auto", icon: <Sun className="h-4 w-4"/> },
  ];
  return (
    <div className="inline-flex rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {options.map(o => (
        <button key={o.key} onClick={()=>setTheme(o.key)}
          className={classNames("px-3 py-1.5 text-sm flex items-center gap-1",
            theme===o.key ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-white/70 dark:bg-neutral-900/70")}
          title={`Theme: ${o.label}`}>{o.icon}{o.label}</button>
      ))}
    </div>
  );
}

// ===== Shared bits =====
function Section({ title, icon, children, right }) {
  return (
    <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">{icon}{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
function Pill({ children, tone="default" }) {
  const tones = {
    default: "bg-neutral-100 dark:bg-neutral-800",
    good: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
    warn: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  };
  return <span className={classNames("px-2.5 py-1 rounded-full text-sm", tones[tone])}>{children}</span>;
}

// ===== Progress Rings =====
function Ring({ size=120, stroke=12, value=0, label, sublabel }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = clamp(value, 0, 100);
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} className="text-neutral-200 dark:text-neutral-800" stroke="currentColor" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${c}`} className="text-indigo-600" stroke="currentColor" fill="none" />
      </svg>
      <div className="-mt-20 text-3xl font-bold">{Math.round(pct)}%</div>
      <div className="text-sm text-neutral-600 dark:text-neutral-400">{label}</div>
      {sublabel && <div className="text-xs text-neutral-500">{sublabel}</div>}
    </div>
  );
}
function ProgressDashboard({ addictions, weightRows, bmi, weightGoal }) {
  const latestWeight = weightRows[weightRows.length-1]?.weight ?? null;
  const startWeight = weightRows[0]?.weight ?? latestWeight;
  let weightPercent = 0, weightSub = "Set a goal";
  if (latestWeight != null && weightGoal) {
    const targetDelta = Math.abs((startWeight ?? latestWeight) - weightGoal);
    const progress = Math.abs(latestWeight - (startWeight ?? latestWeight));
    weightPercent = targetDelta > 0 ? clamp((progress / targetDelta) * 100) : 0;
    weightSub = `${latestWeight} → ${weightGoal} lb`;
  }
  const bestStreak = addictions.reduce((m,a)=>Math.max(m, daysBetween(a.resetAt)), 0);
  const streakGoal = 30;
  const streakPercent = clamp((bestStreak / streakGoal) * 100);
  let bmiPercent = 100, bmiSub = "In range";
  if (!bmi) { bmiPercent = 0; bmiSub = "Enter stats"; }
  else if (bmi < 18.5) { bmiPercent = clamp((bmi/18.5)*100); bmiSub = `${bmi.toFixed(1)} → 18.5`; }
  else if (bmi > 24.9) { bmiPercent = clamp((24.9/ bmi)*100); bmiSub = `${bmi.toFixed(1)} → 24.9`; }
  return (
    <Section title="Goals & Progress" icon={<Target className="h-5 w-5"/>} right={<div className="text-sm text-neutral-500">Editable goals below</div>}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Ring value={streakPercent} label={`Best streak (${bestStreak}d)`} sublabel={`Goal ${streakGoal}d`} />
        <Ring value={weightPercent} label="Weight goal" sublabel={weightSub} />
        <Ring value={bmiPercent} label="BMI progress" sublabel={bmiSub} />
      </div>
    </Section>
  );
}

// ===== Addiction Tracker + Calendar =====
function MiniCalendar({ resetAt }) {
  const span = 84; // 12 weeks grid (7x12)
  const cells = buildCalendarCells(resetAt, span);
  return (
    <div>
      <div className="grid grid-cols-12 gap-1">
        {cells.map((c, i) => (
          <div key={i} className={classNames("h-3 rounded", c.clean?"bg-emerald-500/80":"bg-neutral-300 dark:bg-neutral-700")} title={`${c.date} • ${c.clean?"clean":"pre-reset"}`}></div>
        ))}
      </div>
      <div className="mt-1 text-[11px] text-neutral-500">Last 12 weeks</div>
    </div>
  );
}
function AddictionTracker() {
  const [items, setItems] = useLocalStorage("addictions:v1", []);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(fmtDate(new Date()));

  const add = () => {
    if (!name.trim()) return;
    setItems([ ...items, { id: uid(), name: name.trim(), resetAt: startDate } ]);
    setName(""); setStartDate(fmtDate(new Date()));
  };
  const resetToday = (id) => setItems(items.map(it => it.id===id ? { ...it, resetAt: fmtDate(new Date()) } : it));
  const setCustomDate = (id, date) => setItems(items.map(it => it.id===id ? { ...it, resetAt: date } : it));
  const remove = (id) => setItems(items.filter(it => it.id!==id));
  const rename = (id, newName) => setItems(items.map(it => it.id===id ? { ...it, name: newName } : it));
  const submitFromEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } };

  return (
    <Section title="Addiction-Free Streaks" icon={<TimerReset className="h-5 w-5" />} right={
      <div className="flex flex-wrap gap-2" onKeyDown={submitFromEnter}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Nicotine" className="input" aria-label="Addiction name" />
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="input" aria-label="Last use date" />
        <button type="button" onClick={add} className="btn" aria-label="Add tracker"><Plus className="h-4 w-4" /> Add</button>
      </div>
    }>
      {items.length===0 ? (
        <p className="text-neutral-500">Create a tracker and set the last-use date. Your streak = days since last use.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(it => (
            <motion.div key={it.id} layout className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/80 dark:bg-neutral-900/80">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input className="bg-transparent font-semibold text-lg outline-none min-w-0" value={it.name} onChange={(e)=>rename(it.id, e.target.value)} aria-label={`Rename ${it.name}`} />
                    <Pill tone={daysBetween(it.resetAt)>=7?"good":"warn"}>{daysBetween(it.resetAt)} day{daysBetween(it.resetAt)!==1?"s":""} clean</Pill>
                  </div>
                  <div className="text-sm text-neutral-500 mt-1 flex items-center gap-1"><Calendar className="h-4 w-4"/> Last use: {it.resetAt}</div>
                  <div className="mt-3"><MiniCalendar resetAt={it.resetAt} /></div>
                </div>
                <button type="button" className="icon-btn" onClick={()=>remove(it.id)} title="Delete"><Trash2 className="h-4 w-4"/></button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className="btn-subtle" onClick={()=>resetToday(it.id)}>I slipped today (reset)</button>
                <label className="btn-subtle cursor-pointer">Set date<input type="date" className="sr-only" value={it.resetAt} onChange={(e)=>setCustomDate(it.id, e.target.value)} /></label>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ===== Weight Tracker =====
function WeightTracker() {
  const [rows, setRows] = useLocalStorage("weights:v1", []);
  const [date, setDate] = useState(fmtDate(new Date()));
  const [wt, setWt] = useState("");

  const add = () => {
    const val = parseFloat(wt);
    if (!val || val<=0) return;
    const exist = rows.find(r=>r.date===date);
    const next = exist ? rows.map(r=>r.date===date?{...r, weight: val}:r) : [ ...rows, { date, weight: val } ];
    next.sort((a,b)=>a.date.localeCompare(b.date));
    setRows(next); setWt("");
  };
  const onKey = (e) => { if (e.key==='Enter') { e.preventDefault(); add(); } };
  const remove = (d) => setRows(rows.filter(r=>r.date!==d));
  const startWeight = rows[0]?.weight ?? null;
  const latestWeight = rows[rows.length-1]?.weight ?? null;
  const delta = (latestWeight && startWeight) ? latestWeight - startWeight : null;

  return (
    <Section title="Weight Tracker" icon={<LineChart className="h-5 w-5" />} right={
      <div className="flex flex-wrap gap-2" onKeyDown={onKey}>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="input" aria-label="Entry date" />
        <input type="number" step="0.1" placeholder="Weight (lb)" value={wt} onChange={e=>setWt(e.target.value)} className="input w-36" aria-label="Weight in pounds" />
        <button type="button" onClick={add} className="btn" aria-label="Add weight entry"><Plus className="h-4 w-4"/> Add</button>
      </div>
    }>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64">
          {rows.length>0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="currentColor" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "#111827", color: "white", border: 0 }} labelFormatter={(v)=>`Date: ${v}`} formatter={(v)=>[`${v} lb`, "Weight"]} />
                <Area type="monotone" dataKey="weight" stroke="currentColor" fill="url(#w)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-500">Add your first weight entry to see the chart.</div>
          )}
        </div>
        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {rows.slice().reverse().map(r => (
            <div key={r.date} className="flex items-center justify-between p-2 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="text-sm">
                <div className="font-medium">{r.weight} lb</div>
                <div className="text-neutral-500">{r.date}</div>
              </div>
              <button className="icon-btn" onClick={()=>remove(r.date)} title="Delete"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-3 text-sm">
        <Pill>{rows.length} entr{rows.length===1?"y":"ies"}</Pill>
        {delta!==null && <Pill tone={delta<=0?"good":"warn"}>Δ since start: {delta>0?"+"+delta.toFixed(1):delta.toFixed(1)} lb</Pill>}
      </div>
    </Section>
  );
}

// ===== BMI helpers =====
function getBMICategory(bmi) { if (!bmi) return ""; if (bmi < 18.5) return "Underweight"; if (bmi < 25) return "Normal"; if (bmi < 30) return "Overweight"; return "Obesity"; }
function BMICalc({ heightFt, setHeightFt, heightIn, setHeightIn, weight, setWeight, bmi, category }) {
  return (
    <Section title="BMI Calculator" icon={<Scale className="h-5 w-5" />}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div><label className="label">Height (ft)</label><input className="input" type="number" value={heightFt} onChange={e=>setHeightFt(e.target.value)} /></div>
          <div><label className="label">Height (in)</label><input className="input" type="number" value={heightIn} onChange={e=>setHeightIn(e.target.value)} /></div>
          <div><label className="label">Weight (lb)</label><input className="input" type="number" value={weight} onChange={e=>setWeight(e.target.value)} /></div>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-sm text-neutral-500">Your BMI</div>
          <div className="text-4xl font-semibold mt-1">{bmi?bmi.toFixed(1):"–"}</div>
          <div className={classNames("mt-1 text-sm", category==="Normal"?"text-emerald-600":category?"text-amber-600":"text-neutral-500")}>{category||"Enter your stats"}</div>
          <div className="mt-3 text-xs text-neutral-500">Normal: 18.5-24.9 • Overweight: 25-29.9 • Obesity: 30+</div>
        </div>
      </div>
    </Section>
  );
}

// ===== Food Guidance & Recipes =====
const BASE_FOODS = {
  Protein: ["Chicken breast", "Salmon", "Greek yogurt", "Eggs", "Tofu", "Lentils"],
  Carbs: ["Quinoa", "Brown rice", "Sweet potato", "Oats", "Whole-wheat pasta"],
  Fats: ["Avocado", "Olive oil", "Almonds", "Peanut butter", "Chia seeds"],
  Veggies: ["Spinach", "Broccoli", "Bell pepper", "Kale", "Green beans"],
  Fruits: ["Blueberries", "Apples", "Bananas", "Oranges", "Strawberries"],
};
function planByBMI(category) {
  switch (category) {
    case "Underweight": return { emphasis: { carbs: 45, protein: 25, fats: 30 }, notes: "Small surplus with nutrient-dense carbs and fats.", tips: ["Add a caloric shake", "3 meals + 2 snacks", "Strength train 3-4x/week"] };
    case "Normal": return { emphasis: { carbs: 40, protein: 30, fats: 30 }, notes: "Maintain with balanced plates.", tips: ["Prioritize whole foods", "7-9k steps/day", "25-35g protein/meal"] };
    case "Overweight": return { emphasis: { carbs: 30, protein: 35, fats: 35 }, notes: "Modest deficit; higher protein and fiber.", tips: ["Swap refined carbs", "Zero-cal beverages", "Batch-cook proteins"] };
    case "Obesity": return { emphasis: { carbs: 25, protein: 40, fats: 35 }, notes: "Satiety focus: high protein & fiber.", tips: ["Half-plate veggies", "30-40g protein/meal", "Limit ultra-processed snacks"] };
    default: return { emphasis: { carbs: 40, protein: 30, fats: 30 }, notes: "Enter stats to tailor guidance.", tips: [] };
  }
}
const RECIPES = [
  // --- Salads & Bowls ---
  { id: "salad-hpcobb", title: "High-Protein Cobb Salad", tags: ["salad","meal-prep"], suits: ["Normal","Overweight","Obesity"], calories: 520, protein: 44, carbs: 24, fats: 28,
    ingredients: ["4 cups chopped romaine","8 oz grilled chicken breast","2 hard-boiled eggs","1 avocado","6 cherry tomatoes","2 tbsp light vinaigrette","1 tbsp crumbled feta"],
    steps: ["Toss romaine with vinaigrette.","Top with chicken, eggs, avocado, tomatoes, and feta."] },
  { id: "salmon-bowl", title: "Teriyaki Salmon Rice Bowl", tags: ["fish","bowl"], suits: ["Underweight","Normal","Overweight"], calories: 610, protein: 38, carbs: 63, fats: 20,
    ingredients: ["1 salmon fillet (6 oz)","1 cup cooked brown rice","1 cup steamed broccoli","2 tbsp reduced-sodium teriyaki","1 tsp sesame seeds"],
    steps: ["Bake salmon at 400F for 8-10 min.","Warm rice and steam broccoli.","Assemble and drizzle teriyaki; sprinkle sesame."] },
  { id: "quinoa-chicken-bowl", title: "Lemon Herb Chicken & Quinoa Bowl", tags: ["bowl","high-protein"], suits: ["Normal","Overweight","Obesity"], calories: 540, protein: 42, carbs: 50, fats: 18,
    ingredients: ["1 cup cooked quinoa","6 oz grilled chicken","1 cup arugula","1/2 cup cucumber","2 tbsp lemon herb dressing","1 tbsp pumpkin seeds"],
    steps: ["Toss quinoa with dressing.","Top with chicken, arugula, cucumber, and seeds."] },
  { id: "thai-chicken-salad", title: "Thai Peanut Chicken Salad", tags: ["salad","meal-prep"], suits: ["Normal","Overweight","Obesity"], calories: 520, protein: 40, carbs: 35, fats: 22,
    ingredients: ["6 oz shredded chicken","4 cups shredded cabbage","1/2 cup shredded carrots","1/4 cup cilantro","2 tbsp light peanut sauce","1 tbsp crushed peanuts"],
    steps: ["Toss cabbage, carrots, cilantro with sauce.","Top with chicken and peanuts."] },

  // --- Poultry ---
  { id: "chicken-juicy", title: "Garlic Herb Chicken Breast", tags: ["chicken","protein"], suits: ["Underweight","Normal","Overweight","Obesity"], calories: 320, protein: 46, carbs: 2, fats: 13,
    ingredients: ["2 chicken breasts","1 tsp kosher salt","1/2 tsp black pepper","1 tsp garlic powder","1 tsp paprika","1 tbsp olive oil","1 tbsp butter","1 tsp dried herbs"],
    steps: ["Pound chicken to even thickness and season.","Sear in oil 4-5 min/side to ~160F.","Add butter, baste, and rest to 165F."] },
  { id: "sheetpan-chicken-veggies", title: "Sheet Pan Chicken & Veggies", tags: ["meal-prep","high-protein"], suits: ["Overweight","Obesity","Normal"], calories: 480, protein: 42, carbs: 32, fats: 18,
    ingredients: ["1 lb chicken breast, cubed","3 cups veggies (broccoli, carrots, onions)","1 tbsp olive oil","1 tsp garlic powder","1 tsp paprika","Salt/pepper"],
    steps: ["Toss on sheet pan with oil & spices.","Roast at 425F for 18-22 min.","Divide into meal boxes."] },

  // --- Seafood ---
  { id: "shrimp-tacos", title: "Citrus Shrimp Tacos", tags: ["seafood","tacos"], suits: ["Normal","Underweight"], calories: 520, protein: 35, carbs: 58, fats: 16,
    ingredients: ["8 oz shrimp","1 tsp chili-lime seasoning","4 corn tortillas","1 cup slaw mix","2 tbsp salsa","Lime wedges"],
    steps: ["Sear shrimp 2 min/side with seasoning.","Warm tortillas; fill with slaw, shrimp, salsa; squeeze lime."] },
  { id: "miso-cod-bowl", title: "Miso Cod Brown Rice Bowl", tags: ["fish","bowl"], suits: ["Normal","Overweight"], calories: 520, protein: 36, carbs: 58, fats: 12,
    ingredients: ["6 oz cod","1 tbsp miso paste","1 tsp soy sauce","1 cup brown rice","1 cup steamed bok choy","Sesame seeds"],
    steps: ["Brush cod with miso+soy; bake 400F 10-12 min.","Serve over rice with bok choy; sprinkle sesame."] },

  // --- Vegetarian/Vegan ---
  { id: "tofu-stirfry", title: "Tofu Veggie Stir-Fry", tags: ["vegetarian","stir-fry"], suits: ["Normal","Overweight","Obesity"], calories: 450, protein: 28, carbs: 42, fats: 18,
    ingredients: ["14 oz tofu","2 cups mixed veggies","2 tsp soy sauce","1 tsp cornstarch + 2 tsp water","1 tbsp olive oil","2 cloves garlic"],
    steps: ["Crisp tofu in half the oil; remove.","Stir-fry garlic and veggies.","Return tofu; add soy + slurry; toss."] },
  { id: "lentil-soup", title: "Tomato Lentil Soup", tags: ["vegan","soup"], suits: ["Normal","Overweight","Obesity"], calories: 380, protein: 23, carbs: 60, fats: 6,
    ingredients: ["3/4 cup dry lentils","3 cups vegetable broth","1 cup diced tomatoes","1/2 cup carrots/onions","1 tsp olive oil","1 tsp Italian herbs"],
    steps: ["Saute veg in oil.","Add lentils, broth, tomatoes, herbs; simmer until tender."] },
  { id: "veggie-omelette", title: "Spinach & Mushroom Omelette", tags: ["breakfast","high-protein"], suits: ["Underweight","Normal","Overweight"], calories: 280, protein: 24, carbs: 5, fats: 18,
    ingredients: ["3 eggs","1 cup spinach","1/2 cup mushrooms","1 tbsp olive oil","Salt/pepper"],
    steps: ["Saute spinach and mushrooms in oil.","Add beaten eggs, cook until set.","Fold and serve."] },
  { id: "cottage-cheese-bowl", title: "Cottage Cheese Berry Bowl", tags: ["breakfast","no-cook"], suits: ["Overweight","Obesity","Normal"], calories: 320, protein: 28, carbs: 28, fats: 10,
    ingredients: ["1 cup low-fat cottage cheese","1/2 cup berries","1 tbsp chia","1 tsp honey (optional)"],
    steps: ["Bowl it and eat."] }
];

function RecipeCard({ r, onSelect, selectedQty }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={classNames("rounded-2xl border p-4", selectedQty>0?"border-indigo-400 dark:border-indigo-500":"border-neutral-200 dark:border-neutral-800") }>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{r.title}</div>
          <div className="mt-1 text-xs text-neutral-500">~{r.calories} kcal • P{r.protein} C{r.carbs} F{r.fats}</div>
          <div className="mt-1 flex flex-wrap gap-1">{r.tags.map(t=> <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">{t}</span>)}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button className="btn-subtle" onClick={()=>onSelect(r.id, Math.max(0, (selectedQty||0)-1))}>-</button>
            <span className="w-6 text-center text-sm">{selectedQty||0}</span>
            <button className="btn-subtle" onClick={()=>onSelect(r.id, (selectedQty||0)+1)}>+</button>
          </div>
          <button className="btn-subtle" onClick={()=>setOpen(o=>!o)}>{open?"Hide":"Recipe"}</button>
        </div>
      </div>
      {open && (
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="font-medium mb-1">Ingredients</div>
            <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">{r.ingredients.map((it,i)=>(<li key={i}>{it}</li>))}</ul>
          </div>
          <div>
            <div className="font-medium mb-1">Steps</div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-700 dark:text-neutral-300">{r.steps.map((s,i)=>(<li key={i}>{s}</li>))}</ol>
          </div>
        </div>
      )}
    </div>
  );
}
function FoodIdeas({ category }) {
  const [tab, setTab] = useState("guidance");
  const plan = planByBMI(category);
  const groups = Object.entries(BASE_FOODS);
  const recipes = RECIPES.filter(r => !category || r.suits.includes(category));

  // Grocery selection
  const [basket, setBasket] = useLocalStorage("recipes:basket", {}); // { [id]: qty }
  const setQty = (id, qty) => setBasket(prev => { const n={...prev}; if (qty<=0) delete n[id]; else n[id]=qty; return n; });
  const chosen = Object.entries(basket).filter(([id,qty])=>qty>0).map(([id,qty])=>({ ...RECIPES.find(r=>r.id===id), qty }));
  const aggregated = chosen.flatMap(x => x.ingredients.map(ing=>({ ing, qty:x.qty })))
    .reduce((acc, {ing, qty})=>{ acc[ing]=(acc[ing]||0)+qty; return acc; }, {});

  const copyList = async () => {
    const lines = Object.entries(aggregated).map(([ing, q])=> (q>1?`${ing} x${q}`:ing));
    const text = lines.join('\n');
    try { await navigator.clipboard.writeText(text); alert('Grocery list copied!'); } catch { alert(text); }
  };

  return (
    <Section title="Food Guidance & Recipes" icon={<Salad className="h-5 w-5" /> } right={<Pill>{category||"No BMI yet"}</Pill>}>
      <div className="flex items-center gap-2 mb-4">
        <button className={classNames("btn-subtle", tab==="guidance" && "ring-2 ring-indigo-500")} onClick={()=>setTab("guidance")}>Guidance</button>
        <button className={classNames("btn-subtle", tab==="recipes" && "ring-2 ring-indigo-500")} onClick={()=>setTab("recipes")}>Recipes</button>
        <button className={classNames("btn-subtle", tab==="grocery" && "ring-2 ring-indigo-500")} onClick={()=>setTab("grocery")}>Grocery List</button>
        <button className={classNames("btn-subtle", tab==="planner" && "ring-2 ring-indigo-500")} onClick={()=>setTab("planner")}>Meal Plan</button>
      </div>

      {tab==="guidance" && (
        <>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 mb-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Recommended macro emphasis</div>
            <div className="mt-1 font-medium">Carbs {plan.emphasis.carbs}% • Protein {plan.emphasis.protein}% • Fats {plan.emphasis.fats}%</div>
            <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{plan.notes}</div>
            {plan.tips.length>0 && (<ul className="mt-2 text-sm list-disc list-inside text-neutral-700 dark:text-neutral-300">{plan.tips.map(t => <li key={t}>{t}</li>)}</ul>)}
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {groups.map(([group, items], idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
                <div className="font-medium flex items-center gap-2"><HeartPulse className="h-4 w-4"/> {group}</div>
                <ul className="mt-2 text-sm space-y-1 list-disc list-inside text-neutral-700 dark:text-neutral-300">{items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-neutral-500">This is general guidance, not medical advice.</div>
        </>
      )}

      {tab==="recipes" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {recipes.map(r => <RecipeCard key={r.id} r={r} onSelect={setQty} selectedQty={basket[r.id]||0} />)}
          {recipes.length===0 && <div className="text-neutral-500">Enter your stats to see tailored recipes.</div>}
        </div>
      )}

      {tab==="grocery" && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium flex items-center gap-2"><ListChecks className="h-4 w-4"/> Grocery List</div>
            <div className="flex items-center gap-2"><button className="btn" onClick={copyList}>Copy</button><button className="btn-subtle" onClick={()=>setBasket({})}>Clear</button></div>
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Selected recipes</div>
              {chosen.length===0 ? <div className="text-neutral-500">Pick recipes in the Recipes tab.</div> : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {chosen.map(c => <li key={c.id}>{c.title} x{c.qty}</li>)}
                </ul>
              )}
            </div>
            <div>
              <div className="text-sm text-neutral-500 mb-1">Combined ingredients</div>
              {Object.keys(aggregated).length===0 ? <div className="text-neutral-500">Nothing yet.</div> : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {Object.entries(aggregated).map(([ing,q]) => <li key={ing}>{ing}{q>1?` x${q}`:""}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {tab==="planner" && <MealPlanner recipes={RECIPES} />}
    </Section>
  );
}

// ===== Meal Planner =====
function MealPlanner({ recipes }) {
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const MEALS = ["Breakfast","Lunch","Dinner"];

  const [plan, setPlan] = useLocalStorage("mealplan:v1", createBlankPlan(DAYS, MEALS));
  const recipeMap = Object.fromEntries(recipes.map(r=>[r.id,r]));

  const setCell = (d, m, id) => setPlan(pr => ({ ...pr, [d]: { ...pr[d], [m]: id||null } }));
  const clear = () => setPlan(createBlankPlan(DAYS, MEALS));

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Weekly Meal Plan</div>
        <div className="flex items-center gap-2"><button className="btn-subtle" onClick={clear}>Clear</button></div>
      </div>
      <div className="mt-3 overflow-auto">
        <div className="min-w-[720px] grid grid-cols-8 gap-2">
          <div></div>
          {DAYS.map(d=> <div key={d} className="text-sm font-medium text-center py-2">{d}</div>)}
          {MEALS.map(m => (
            <React.Fragment key={m}>
              <div className="text-sm font-medium py-2">{m}</div>
              {DAYS.map(d => (
                <div key={d+ m} className="border rounded-xl p-2">
                  <select className="w-full bg-transparent outline-none" value={plan[d][m]||""} onChange={e=>setCell(d,m,e.target.value||null)}>
                    <option value="">—</option>
                    {recipes.map(r=> <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                  {plan[d][m] && (
                    <div className="mt-1 text-xs text-neutral-500 line-clamp-2">{recipeMap[plan[d][m]]?.ingredients?.slice(0,2).join(", ")}</div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Data Backup (Export/Import) =====
function DataBackup() {
  const exportAll = () => {
    const data = {
      addictions: JSON.parse(localStorage.getItem("addictions:v1")||"[]"),
      weights: JSON.parse(localStorage.getItem("weights:v1")||"[]"),
      bmi: { ft: JSON.parse(localStorage.getItem("bmi:ft")||"0"), inch: JSON.parse(localStorage.getItem("bmi:in")||"0"), w: JSON.parse(localStorage.getItem("bmi:w")||"0") },
      recipesBasket: JSON.parse(localStorage.getItem("recipes:basket")||"{}"),
      mealplan: JSON.parse(localStorage.getItem("mealplan:v1")||"{}"),
      weightGoal: JSON.parse(localStorage.getItem("goal:weight")||"null"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `sober-health-backup-${fmtDate(new Date())}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const importAll = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result||"{}"));
        if (data.addictions) localStorage.setItem("addictions:v1", JSON.stringify(data.addictions));
        if (data.weights) localStorage.setItem("weights:v1", JSON.stringify(data.weights));
        if (data.bmi) {
          if (typeof data.bmi.ft!=="undefined") localStorage.setItem("bmi:ft", JSON.stringify(data.bmi.ft));
          if (typeof data.bmi.inch!=="undefined") localStorage.setItem("bmi:in", JSON.stringify(data.bmi.inch));
          if (typeof data.bmi.w!=="undefined") localStorage.setItem("bmi:w", JSON.stringify(data.bmi.w));
        }
        if (data.recipesBasket) localStorage.setItem("recipes:basket", JSON.stringify(data.recipesBasket));
        if (data.mealplan) localStorage.setItem("mealplan:v1", JSON.stringify(data.mealplan));
        if (typeof data.weightGoal!=="undefined") localStorage.setItem("goal:weight", JSON.stringify(data.weightGoal));
        window.location.reload();
      } catch { alert("Could not import file. Make sure it's a valid backup JSON."); }
    };
    reader.readAsText(file);
  };
  return (
    <Section title="Backup & Restore" icon={<Save className="h-5 w-5"/>}>
      <div className="flex flex-wrap gap-2 items-center">
        <button className="btn" onClick={exportAll}><Download className="h-4 w-4"/> Export JSON</button>
        <label className="btn"><Upload className="h-4 w-4"/> Import JSON<input type="file" accept="application/json" className="sr-only" onChange={(e)=>e.target.files?.[0] && importAll(e.target.files[0])} /></label>
        <div className="text-sm text-neutral-500">Your data is saved in your browser (localStorage).</div>
      </div>
    </Section>
  );
}

// ===== Layout =====
function Topbar({ theme, setTheme }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="font-extrabold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600">Sober+Health</div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-neutral-500">React • Tailwind • Local-only</div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const [heightFt, setHeightFt] = useLocalStorage("bmi:ft", 5);
  const [heightIn, setHeightIn] = useLocalStorage("bmi:in", 10);
  const [weight, setWeight] = useLocalStorage("bmi:w", 180);
  const [weightGoal, setWeightGoal] = useLocalStorage("goal:weight", 0);
  const inches = (Number(heightFt)||0) * 12 + (Number(heightIn)||0);
  const bmi = inches>0 ? (Number(weight) * 703) / (inches*inches) : 0;
  const category = getBMICategory(bmi);

  // Read addiction/weight data for progress
  const [rows] = useLocalStorage("weights:v1", []);
  const [addictions] = useLocalStorage("addictions:v1", []);

  // Self-tests in console
  useEffect(() => {
    console.group("Sober+Health self-tests");
    // daysBetween
    console.assert(daysBetween("2025-01-01", "2025-01-02") === 1, "daysBetween 1d");
    console.assert(daysBetween("2025-01-01", "2025-01-01") === 0, "daysBetween 0d");
    // BMI category
    console.assert(getBMICategory(0) === "", "BMI 0");
    console.assert(getBMICategory(17.9) === "Underweight", "BMI Under");
    console.assert(getBMICategory(22.0) === "Normal", "BMI Normal");
    console.assert(getBMICategory(27.5) === "Overweight", "BMI Over");
    console.assert(getBMICategory(31.0) === "Obesity", "BMI Obese");
    // buildCalendarCells
    const cc = buildCalendarCells("2025-01-10", 10);
    console.assert(Array.isArray(cc) && cc.length === 10, "Calendar cells length");
    console.assert(typeof cc[0].date === 'string' && typeof cc[0].clean === 'boolean', "Calendar cell shape");
    // createBlankPlan
    const plan = createBlankPlan(["Mon","Tue"],["Breakfast","Lunch"]);
    console.assert(plan.Mon && plan.Tue && plan.Mon.Breakfast === null && plan.Tue.Lunch === null, "Plan structure");
    console.groupEnd();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,0.12),transparent),radial-gradient(1000px_500px_at_100%_20%,rgba(16,185,129,0.10),transparent)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,0.12),transparent),radial-gradient(1000px_500px_at_100%_20%,rgba(16,185,129,0.06),transparent)] text-neutral-900 dark:text-neutral-100">
      <Topbar theme={theme} setTheme={setTheme} />
      <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white/70 dark:bg-neutral-900/70">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Your Wellness Dashboard</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Track addiction-free streaks, weight, BMI, and get food guidance with real recipes tailored to your BMI. Everything stays on your device.</p>
        </motion.div>

        <ProgressDashboard addictions={addictions} weightRows={rows} bmi={bmi} weightGoal={weightGoal} />

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 -mt-4">
          <div className="text-sm">Set weight goal (lb)</div>
          <div className="mt-2 flex items-center gap-2">
            <input type="number" className="input w-36" value={weightGoal||""} onChange={e=>setWeightGoal(parseFloat(e.target.value)||0)} placeholder="e.g. 180" />
            <div className="text-xs text-neutral-500">This drives the weight progress ring above.</div>
          </div>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <AddictionTracker/>
          <div className="space-y-6">
            <WeightTracker/>
            <BMICalc heightFt={heightFt} setHeightFt={setHeightFt} heightIn={heightIn} setHeightIn={setHeightIn} weight={weight} setWeight={setWeight} bmi={bmi} category={category} />
          </div>
        </div>

        <FoodIdeas category={category} />
        <DataBackup/>
      </main>

      <style>{`
        .input { @apply px-3 py-2 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600; }
        .btn { @apply inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.99] transition; }
        .btn-subtle { @apply inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800; }
        .icon-btn { @apply p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800; }
        .label { @apply text-sm text-neutral-600 dark:text-neutral-400; }
      `}</style>
    </div>
  );
}
