import { useState } from 'react'

interface UpdateItem {
  id: string
  name: string
  icon: string
  category: string
  currentVersion: string
  latestVersion: string
  priority: 'critical' | 'functional' | 'minor'
}

const mockUpdates: UpdateItem[] = [
  { id: '1', name: 'Node.js (LTS)', icon: 'javascript', category: 'Runtime Environment', currentVersion: 'v20.10.0', latestVersion: 'v21.5.0', priority: 'functional' },
  { id: '2', name: 'VS Code', icon: 'code', category: 'Code Editor', currentVersion: 'v1.85.1', latestVersion: 'v1.86.0', priority: 'functional' },
  { id: '3', name: 'Git', icon: 'merge', category: 'Version Control', currentVersion: 'v2.43.0', latestVersion: 'v2.44.0', priority: 'minor' },
  { id: '4', name: 'PowerShell 7', icon: 'terminal', category: 'Shell', currentVersion: 'v7.4.0', latestVersion: 'v7.4.1', priority: 'critical' },
  { id: '5', name: 'Windows Terminal', icon: 'wysiwyg', category: 'Terminal', currentVersion: 'v1.18.3', latestVersion: 'v1.19.0', priority: 'minor' },
]

const priorityStyles = {
  critical: { badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', label: 'Critical' },
  functional: { badge: 'bg-[#0048ad]/10 text-[#0048ad]', label: 'Functional' },
  minor: { badge: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400', label: 'Minor' },
}

export default function Updates() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleUpdate = (id: string) => {
    setUpdating((prev) => new Set(prev).add(id))
    setTimeout(() => setUpdating((prev) => { const n = new Set(prev); n.delete(id); return n }), 2500)
  }

  const handleUpdateAll = () => {
    const ids = selected.size > 0 ? Array.from(selected) : mockUpdates.map((u) => u.id)
    ids.forEach((id) => handleUpdate(id))
  }

  const criticalCount = mockUpdates.filter((u) => u.priority === 'critical').length

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="p-8 pb-4 flex-shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Available Updates</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {mockUpdates.length} updates available via Winget
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {selected.size} selected
              </span>
            )}
            <button
              onClick={handleUpdateAll}
              className="flex items-center gap-2 px-4 h-10 bg-[#0048ad] hover:brightness-110 text-white rounded font-bold text-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">system_update</span>
              {selected.size > 0 ? `Update Selected (${selected.size})` : `Update All (${mockUpdates.length})`}
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        {criticalCount > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <p className="text-xs font-bold text-red-600 dark:text-red-400">
              {criticalCount} critical security update{criticalCount > 1 ? 's' : ''} require immediate attention.
            </p>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/50 overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80">
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-600"
                    checked={selected.size === mockUpdates.length}
                    onChange={() =>
                      setSelected(selected.size === mockUpdates.length ? new Set() : new Set(mockUpdates.map((u) => u.id)))
                    }
                  />
                </th>
                {['Package', 'Current', 'Latest', 'Priority', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800${i === 4 ? ' text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockUpdates.map((item) => (
                <tr key={item.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors${selected.has(item.id) ? ' bg-[#0048ad]/5 dark:bg-[#0048ad]/10' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 dark:border-slate-600"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#0048ad]">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">{item.currentVersion}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.latestVersion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded ${priorityStyles[item.priority].badge}`}>
                      {priorityStyles[item.priority].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0048ad] text-white text-xs font-bold rounded hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                      disabled={updating.has(item.id)}
                      onClick={() => handleUpdate(item.id)}
                    >
                      {updating.has(item.id) ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          Updating…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">upgrade</span>
                          Upgrade
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
