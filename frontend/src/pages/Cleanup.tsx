import { useState } from 'react'

interface CleanupItem {
  id: string
  label: string
  description: string
  icon: string
  size: string
  type: 'cache' | 'orphan' | 'temp'
}

const cleanupItems: CleanupItem[] = [
  { id: '1', label: 'Download Cache', description: 'Cached installer files from previous Winget operations', icon: 'folder_delete', size: '1.2 GB', type: 'cache' },
  { id: '2', label: 'Orphaned Packages', description: 'Packages with no dependents that may be safely removed', icon: 'delete_sweep', size: '340 MB', type: 'orphan' },
  { id: '3', label: 'Temp Extraction Files', description: 'Temporary files left behind after package extraction', icon: 'folder_zip', size: '88 MB', type: 'temp' },
]

export default function Cleanup() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [cleaned, setCleaned] = useState<Set<string>>(new Set())
  const [running, setRunning] = useState(false)

  const toggle = (id: string) =>
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  const handleClean = () => {
    if (selected.size === 0) return
    setRunning(true)
    setTimeout(() => {
      setCleaned((p) => new Set([...p, ...selected]))
      setSelected(new Set())
      setRunning(false)
    }, 2000)
  }

  const remaining = cleanupItems.filter((i) => !cleaned.has(i.id))
  const totalSavings = remaining
    .filter((i) => selected.has(i.id))
    .reduce((acc, i) => acc + parseFloat(i.size), 0)
    .toFixed(1)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-8 pb-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Cleanup</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Remove unused files, caches, and orphaned packages</p>
          </div>
          <button
            onClick={handleClean}
            disabled={selected.size === 0 || running}
            className="flex items-center gap-2 px-4 h-10 bg-[#0048ad] hover:brightness-110 text-white rounded font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Cleaning…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
                Clean Selected{selected.size > 0 && ` (${totalSavings} GB)`}
              </>
            )}
          </button>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {remaining.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">check_circle</span>
            <p className="text-sm font-bold uppercase tracking-widest">System is clean</p>
            <p className="text-xs mt-1">No cleanup required at this time</p>
          </div>
        )}

        {remaining.map((item) => (
          <div
            key={item.id}
            className={`border rounded p-5 flex items-center gap-4 cursor-pointer transition-colors ${
              selected.has(item.id)
                ? 'border-[#0048ad] bg-[#0048ad]/5 dark:bg-[#0048ad]/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            onClick={() => toggle(item.id)}
          >
            <input
              type="checkbox"
              className="rounded border-slate-300 dark:border-slate-600 flex-shrink-0"
              checked={selected.has(item.id)}
              onChange={() => toggle(item.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="w-10 h-10 bg-[#0048ad]/10 rounded flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#0048ad]">{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{item.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-black tracking-tight">{item.size}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">reclaimable</p>
            </div>
          </div>
        ))}

        {cleaned.size > 0 && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {cleaned.size} item{cleaned.size > 1 ? 's' : ''} successfully cleaned.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
