import { useState } from 'react'

interface SettingToggle {
  id: string
  label: string
  description: string
  value: boolean
}

export default function Settings() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  const [toggles, setToggles] = useState<SettingToggle[]>([
    { id: 'auto-update-check', label: 'Automatic Update Checks', description: 'Check for package updates on startup', value: true },
    { id: 'silent-install', label: 'Silent Installs', description: 'Run installations without interactive prompts', value: true },
    { id: 'notify-critical', label: 'Critical Update Notifications', description: 'Alert when critical security patches are available', value: true },
    { id: 'startup', label: 'Start with Windows', description: 'Launch Cokpit automatically at login', value: false },
    { id: 'telemetry', label: 'Anonymous Usage Data', description: 'Help improve Cokpit by sharing anonymous usage metrics', value: false },
  ])

  const toggle = (id: string) =>
    setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, value: !t.value } : t)))

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure Cokpit preferences and behavior</p>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-2xl">
        {/* Appearance */}
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Appearance</h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/40 p-5">
            <p className="text-sm font-bold mb-3">Theme</p>
            <div className="flex gap-3">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors border ${
                    theme === t
                      ? 'bg-[#0048ad] text-white border-[#0048ad]'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Behavior */}
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Behavior</h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800">
            {toggles.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-bold">{t.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.description}</p>
                </div>
                <button
                  onClick={() => toggle(t.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                    t.value ? 'bg-[#0048ad]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={t.value}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      t.value ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Winget Config */}
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Winget Configuration</h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/40 p-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                Default Install Scope
              </label>
              <select className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0048ad]">
                <option>Machine (requires admin)</option>
                <option>User</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                Max Concurrent Downloads
              </label>
              <input
                type="number"
                defaultValue={2}
                min={1}
                max={8}
                className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0048ad]"
              />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-4">Danger Zone</h3>
          <div className="border border-red-200 dark:border-red-900 rounded bg-white dark:bg-slate-900/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Reset All Settings</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Restore all preferences to factory defaults</p>
              </div>
              <button className="px-4 py-1.5 border border-red-300 dark:border-red-800 text-red-500 text-xs font-bold rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </section>

        <div className="pt-2">
          <button className="px-6 py-2 bg-[#0048ad] text-white text-xs font-bold uppercase tracking-widest rounded hover:brightness-110 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
