import { Bell, Download, Lock, Shield, Upload } from "lucide-react";
import { Button, Surface } from "../components/ui";
import { storageKeys } from "../data/defaults";
import { today } from "../utils/date";

export function Settings({ settings, setSettings }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Surface title="Appearance" eyebrow="Preferences">
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Theme">
          {["light", "dark", "system"].map((theme) => (
            <button key={theme} className={settings.theme === theme ? "choice choice-active" : "choice"} onClick={() => setSettings((next) => ({ ...next, theme }))}>
              {theme}
            </button>
          ))}
        </div>
      </Surface>

      <Surface title="Notifications and privacy" eyebrow="Control">
        <Toggle label="Daily reminders" icon={Bell} checked={settings.reminders} onChange={(reminders) => setSettings((next) => ({ ...next, reminders }))} />
        <Toggle label="Milestone celebrations" icon={Shield} checked={settings.milestoneAlerts} onChange={(milestoneAlerts) => setSettings((next) => ({ ...next, milestoneAlerts }))} />
        <Toggle label="Private mode" icon={Lock} checked={settings.privateMode} onChange={(privateMode) => setSettings((next) => ({ ...next, privateMode }))} />
      </Surface>

      <Surface title="Backup" eyebrow="Local data" className="lg:col-span-2">
        <DataBackup />
      </Surface>
    </div>
  );
}

function Toggle({ label, icon: Icon, checked, onChange }) {
  return (
    <label className="mb-3 flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900/40">
      <span className="flex items-center gap-3 font-medium"><Icon className="h-5 w-5 text-brand-blue" /> {label}</span>
      <input className="h-5 w-5 accent-brand-green" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function DataBackup() {
  const exportAll = () => {
    const data = Object.fromEntries(storageKeys.map((key) => [key, JSON.parse(localStorage.getItem(key) || "null")]));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sober-health-backup-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importAll = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(String(event.target?.result || "{}"));
        storageKeys.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });
        window.location.reload();
      } catch {
        alert("Could not import that backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={exportAll}><Download className="h-4 w-4" /> Export data</Button>
      <label className="button button-secondary cursor-pointer">
        <Upload className="h-4 w-4" /> Import backup
        <input className="sr-only" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importAll(event.target.files[0])} />
      </label>
      <p className="text-sm leading-6 text-ink-muted dark:text-slate-300">Sober+ Health stores data in this browser unless you export it.</p>
    </div>
  );
}
