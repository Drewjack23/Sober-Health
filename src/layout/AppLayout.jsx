import { Activity, Award, CheckCircle2, HeartPulse, Home, Moon, Settings, Shield, Sun, Waves } from "lucide-react";
import { navItems } from "../data/defaults";
import { dateLabel, today } from "../utils/date";
import { cx } from "../components/ui";

const icons = {
  today: Home,
  sobriety: Shield,
  mind: Waves,
  body: HeartPulse,
  habits: CheckCircle2,
  profile: Award,
  settings: Settings,
};

export function AppLayout({ active, setActive, settings, setSettings, children }) {
  const ActiveIcon = icons[active] || Activity;

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-white">
      <div className="app-frame">
        <aside className="sidebar">
          <button className="brand-lockup" onClick={() => setActive("today")} aria-label="Open today">
            <span className="brand-mark">S+</span>
            <span>
              <span className="block text-base font-semibold tracking-tight">Sober+ Health</span>
              <span className="block text-xs text-ink-subtle dark:text-slate-400">Personal wellness OS</span>
            </span>
          </button>

          <nav className="mt-8 grid gap-1" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = icons[item.id];
              return (
                <button key={item.id} className={cx("rail-link", active === item.id && "rail-link-active")} onClick={() => setActive(item.id)} aria-current={active === item.id ? "page" : undefined}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="topbar">
            <div className="flex min-w-0 items-center gap-3">
              <span className="page-icon"><ActiveIcon className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-sm text-ink-subtle dark:text-slate-400">{dateLabel(today(), { weekday: "long", month: "long", day: "numeric" })}</p>
                <h1 className="truncate text-2xl font-semibold tracking-tight md:text-3xl">{navItems.find((item) => item.id === active)?.label}</h1>
              </div>
            </div>

            <button
              className="icon-button"
              onClick={() => setSettings((next) => ({ ...next, theme: next.theme === "dark" ? "light" : "dark" }))}
              aria-label="Toggle theme"
            >
              {settings.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </header>

          <main className="content-shell">{children}</main>
        </div>
      </div>
    </div>
  );
}
