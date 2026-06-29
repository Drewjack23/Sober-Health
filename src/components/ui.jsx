import { ArrowRight, Check, Trash2 } from "lucide-react";
import { clamp } from "../utils/health";

export function cx(...items) {
  return items.filter(Boolean).join(" ");
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={cx("button", `button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

export function IconButton({ label, destructive = false, children, className = "", ...props }) {
  return (
    <button className={cx("icon-button", destructive && "icon-button-danger", className)} aria-label={label} title={label} {...props}>
      {children || <Trash2 className="h-4 w-4" />}
    </button>
  );
}

export function Surface({ title, eyebrow, action, children, className = "" }) {
  return (
    <section className={cx("surface", className)}>
      {(title || action || eyebrow) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Metric({ label, value, detail, tone = "neutral" }) {
  return (
    <div className={cx("metric", `metric-${tone}`)}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {detail && <p className="metric-detail">{detail}</p>}
    </div>
  );
}

export function ProgressLine({ label, value, detail }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink-muted dark:text-slate-300">{label}</span>
        <span className="font-semibold text-ink dark:text-white">{Math.round(clamp(value))}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full bg-brand-green transition-all duration-500" style={{ width: `${clamp(value)}%` }} />
      </div>
      {detail && <p className="mt-2 text-sm text-ink-subtle dark:text-slate-400">{detail}</p>}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="empty-state">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-blue/10 text-brand-blue">
        <ArrowRight className="h-4 w-4" />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-ink dark:text-white">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-ink-muted dark:text-slate-300">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export function NumberInput({ label, value, onChange, step = "1" }) {
  return (
    <Field label={label}>
      <input className="input mt-1" type="number" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </Field>
  );
}

export function CheckPill({ checked, children, onClick }) {
  return (
    <button className={cx("check-pill", checked && "check-pill-on")} onClick={onClick}>
      <span className="grid h-6 w-6 place-items-center rounded-full border border-current">
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span>{children}</span>
    </button>
  );
}

export function Sparkline({ data, dataKey = "value", color = "#3B82F6", height = 120 }) {
  if (!data.length) {
    return <div className="grid h-32 place-items-center rounded-2xl bg-slate-50 text-sm text-ink-subtle dark:bg-slate-900/50">No entries yet</div>;
  }

  const values = data.map((item) => Number(item[dataKey]) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 82 - 9;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }} className="w-full overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function BarSeries({ data, max, color = "#22C55E" }) {
  const safeMax = max || Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="w-full rounded-full transition-all duration-500" style={{ height: `${clamp((item.value / safeMax) * 100)}%`, backgroundColor: color }} />
          </div>
          <span className="text-xs text-ink-subtle dark:text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
