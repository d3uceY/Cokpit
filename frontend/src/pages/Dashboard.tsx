const recentActivity = [
  {
    id: 1,
    name: 'Node.js (LTS)',
    icon: 'javascript',
    version: 'v20.11.0',
    status: 'success' as const,
    time: '2M AGO',
  },
  {
    id: 2,
    name: 'Git for Windows',
    icon: 'terminal',
    version: 'v2.43.0',
    status: 'success' as const,
    time: '45M AGO',
  },
  {
    id: 3,
    name: 'Docker Desktop',
    icon: 'inventory_2',
    version: 'v4.27.1',
    status: 'processing' as const,
    time: 'JUST NOW',
  },
]

const statusBadge = {
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  processing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-[#f5f7f8] dark:bg-[#0f1723] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black tracking-tight uppercase">Dashboard</h1>
          <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">System Health: Optimal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-sm">
            Refresh Sync
          </button>
          <button className="px-4 py-2 bg-[#0048ad] text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-colors rounded-sm">
            Update All (12)
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8 max-w-7xl w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between bg-white dark:bg-slate-900/40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Installed Packages</span>
              <span className="material-symbols-outlined text-slate-400">inventory_2</span>
            </div>
            <div className="mt-4">
              <span className="text-5xl font-black tracking-tighter">245</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm text-emerald-500">trending_up</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">+5% This Month</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between bg-white dark:bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 bg-[#0048ad] h-full"></div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Updates</span>
              <span className="material-symbols-outlined text-[#0048ad]">download</span>
            </div>
            <div className="mt-4">
              <span className="text-5xl font-black tracking-tighter text-[#0048ad]">12</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm text-slate-500">schedule</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">3 Critical Patches</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between bg-white dark:bg-slate-900/40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Managers</span>
              <span className="material-symbols-outlined text-slate-400">hub</span>
            </div>
            <div className="mt-4">
              <span className="text-5xl font-black tracking-tighter">01</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#0048ad]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Winget</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="xl:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest">Recent Activity</h2>
              <button className="text-[10px] font-bold uppercase text-[#0048ad] hover:underline">View All History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    {['Package', 'Version', 'Manager', 'Status', 'Time'].map((h, i) => (
                      <th
                        key={h}
                        className={`p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800${i === 4 ? ' text-right' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {recentActivity.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-[#0048ad]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#0048ad] text-sm">{item.icon}</span>
                          </div>
                          <span className="text-sm font-bold">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono">{item.version}</td>
                      <td className="p-4 text-[10px] font-bold uppercase tracking-tighter">Winget</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${statusBadge[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] font-bold text-slate-400 text-right">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Widgets */}
          <div className="space-y-6">
            {/* Provider Status */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-black uppercase tracking-widest">Provider Status</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0048ad]">lan</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">Winget</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase">Connected</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">24ms</div>
                </div>
              </div>
            </div>

            {/* Update Priority */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4">Update Priority</h2>
              <div className="space-y-3">
                {[
                  { label: 'Critical Security', pct: 25, color: 'bg-red-500' },
                  { label: 'Functional Improvements', pct: 60, color: 'bg-[#0048ad]' },
                  { label: 'Cosmetic / Minor', pct: 15, color: 'bg-slate-400' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest">{bar.label}</span>
                      <span className="text-xs font-black">{bar.pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
                      <div className={`${bar.color} h-full`} style={{ width: `${bar.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-[#0048ad]/10 border-l-2 border-[#0048ad]">
                <p className="text-[10px] font-bold leading-relaxed">
                  System scan complete. 4 packages have pending security vulnerabilities reported via CVE database.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <footer className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <span>Database: 1.0.422-rev</span>
            <span>Worker: Online</span>
            <span>Last Sync: 12.04.24 14:32</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Secure Connection Active</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
