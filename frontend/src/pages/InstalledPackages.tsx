import { useState } from 'react'

type PackageStatus = 'up-to-date' | 'update-available'

interface Package {
  id: string
  name: string
  category: string
  icon: string
  version: string
  latest: string
  status: PackageStatus
}

const mockPackages: Package[] = [
  { id: '1', name: 'Node.js (LTS)', category: 'Runtime Environment', icon: 'javascript', version: 'v20.10.0', latest: 'v21.5.0', status: 'update-available' },
  { id: '2', name: 'Docker Desktop', category: 'Virtualization', icon: 'deployed_code', version: 'v4.26.0', latest: 'v4.26.0', status: 'up-to-date' },
  { id: '3', name: 'VS Code', category: 'Code Editor', icon: 'code', version: 'v1.85.1', latest: 'v1.86.0', status: 'update-available' },
  { id: '4', name: 'Python 3', category: 'Scripting Language', icon: 'data_object', version: 'v3.12.1', latest: 'v3.12.1', status: 'up-to-date' },
  { id: '5', name: 'Git', category: 'Version Control', icon: 'merge', version: 'v2.43.0', latest: 'v2.44.0', status: 'update-available' },
  { id: '6', name: 'PowerShell 7', category: 'Shell', icon: 'terminal', version: 'v7.4.0', latest: 'v7.4.1', status: 'update-available' },
  { id: '7', name: '7-Zip', category: 'Archiver', icon: 'folder_zip', version: 'v23.01', latest: 'v23.01', status: 'up-to-date' },
  { id: '8', name: 'Windows Terminal', category: 'Terminal', icon: 'wysiwyg', version: 'v1.18.3', latest: 'v1.19.0', status: 'update-available' },
]

export default function InstalledPackages() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filtered = mockPackages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="p-8 pb-4 flex-shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Installed Packages</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage Winget packages installed on this system</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 h-10 bg-[#0048ad] hover:brightness-110 text-white rounded font-bold text-sm transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Install New
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-[#0048ad] focus:border-[#0048ad] text-sm transition-all"
              placeholder="Search packages..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{filtered.length} packages found</span>
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/50 overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80">
                {['Package Name', 'Version', 'Latest', 'Source', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800${i === 5 ? ' text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    No packages match your search.
                  </td>
                </tr>
              )}
              {paginated.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#0048ad]">{pkg.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{pkg.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{pkg.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium font-mono text-slate-600 dark:text-slate-300">{pkg.version}</td>
                  <td className="px-6 py-4">
                    {pkg.status === 'update-available' ? (
                      <span className="text-sm font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {pkg.latest}
                      </span>
                    ) : (
                      <span className="text-sm font-mono text-slate-400">{pkg.latest}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Winget
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {pkg.status === 'update-available' ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-medium text-amber-500">Update Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-medium text-emerald-500">Up to date</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {pkg.status === 'update-available' ? (
                        <button className="px-3 py-1.5 bg-[#0048ad] text-white text-xs font-bold rounded hover:brightness-110 transition-all">
                          Upgrade
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold rounded cursor-not-allowed"
                          disabled
                        >
                          Upgrade
                        </button>
                      )}
                      <button className="px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-bold transition-colors">
                        Uninstall
                      </button>
                      <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[20px] leading-none">
                        more_vert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
          <div className="flex gap-4">
            <span>Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} packages</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="hover:text-[#0048ad] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`px-1 transition-colors ${n === page ? 'text-[#0048ad] font-bold' : 'hover:text-[#0048ad]'}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              className="hover:text-[#0048ad] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
