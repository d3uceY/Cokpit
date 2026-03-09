import { useState } from 'react'

interface HistoryEntry {
  id: string
  action: 'install' | 'upgrade' | 'uninstall'
  package: string
  version: string
  status: 'success' | 'failed'
  timestamp: string
  command: string
}

const mockHistory: HistoryEntry[] = [
  { id: '1', action: 'upgrade', package: 'Node.js (LTS)', version: 'v20.11.0', status: 'success', timestamp: '2026-03-09 14:32', command: 'winget upgrade OpenJS.NodeJS.LTS' },
  { id: '2', action: 'install', package: 'Docker Desktop', version: 'v4.27.1', status: 'success', timestamp: '2026-03-09 12:15', command: 'winget install Docker.DockerDesktop' },
  { id: '3', action: 'upgrade', package: 'Git', version: 'v2.44.0', status: 'success', timestamp: '2026-03-08 18:04', command: 'winget upgrade Git.Git' },
  { id: '4', action: 'uninstall', package: 'Notepad++', version: 'v8.6.2', status: 'success', timestamp: '2026-03-08 10:22', command: 'winget uninstall Notepad++.Notepad++' },
  { id: '5', action: 'install', package: 'Neovim', version: 'v0.9.5', status: 'failed', timestamp: '2026-03-07 20:11', command: 'winget install Neovim.Neovim' },
  { id: '6', action: 'upgrade', package: 'VS Code', version: 'v1.86.0', status: 'success', timestamp: '2026-03-07 09:30', command: 'winget upgrade Microsoft.VisualStudioCode' },
  { id: '7', action: 'install', package: 'Python 3.12', version: 'v3.12.1', status: 'success', timestamp: '2026-03-06 16:48', command: 'winget install Python.Python.3.12' },
  { id: '8', action: 'upgrade', package: 'PowerShell 7', version: 'v7.4.1', status: 'success', timestamp: '2026-03-06 11:05', command: 'winget upgrade Microsoft.PowerShell' },
]

const actionStyles = {
  install: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  upgrade: 'bg-[#0048ad]/10 text-[#0048ad]',
  uninstall: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export default function History() {
  const [filter, setFilter] = useState<'all' | 'install' | 'upgrade' | 'uninstall'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = mockHistory.filter((h) => filter === 'all' || h.action === filter)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-8 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">History</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Audit trail of all package management operations</p>
          </div>
          <button className="flex items-center gap-2 px-4 h-9 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-widest rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-1 border-b border-slate-200 dark:border-slate-800">
          {(['all', 'install', 'upgrade', 'uninstall'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors -mb-px ${
                filter === f
                  ? 'border-[#0048ad] text-[#0048ad]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/50 overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80">
                {['Action', 'Package', 'Version', 'Status', 'Time', ''].map((h, i) => (
                  <th
                    key={`${h}${i}`}
                    className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((entry) => (
                <>
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  >
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded ${actionStyles[entry.action]}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{entry.package}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">{entry.version}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${entry.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className={`text-xs font-medium ${entry.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {entry.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{entry.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className={`material-symbols-outlined text-slate-400 text-[18px] transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </td>
                  </tr>
                  {expandedId === entry.id && (
                    <tr key={`${entry.id}-expand`} className="bg-slate-50 dark:bg-slate-800/40">
                      <td colSpan={6} className="px-6 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Command</p>
                        <code className="text-xs font-mono text-[#0048ad] dark:text-blue-400">{entry.command}</code>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    No history entries matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
