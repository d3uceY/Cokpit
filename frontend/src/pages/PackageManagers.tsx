export default function PackageManagers() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight">Package Managers</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure and manage package provider integrations</p>
        </div>
      </header>

      <div className="p-8 space-y-6 max-w-3xl">
        {/* Winget Card */}
        <div className="border border-[#0048ad] bg-white dark:bg-slate-900/40 rounded overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0048ad]/10 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0048ad]">package_2</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">Windows Package Manager (Winget)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Microsoft official package manager for Windows</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-500 uppercase">Active</span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Version', value: 'v1.7.11261' },
                { label: 'Source', value: 'winget + msstore' },
                { label: 'Last Updated', value: 'Mar 8, 2026' },
                { label: 'Response Time', value: '24ms' },
              ].map((info) => (
                <div key={info.label} className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{info.label}</p>
                  <p className="text-sm font-semibold font-mono">{info.value}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Sources</p>
              <div className="space-y-2">
                {[
                  { name: 'winget', url: 'https://cdn.winget.microsoft.com/cache', enabled: true },
                  { name: 'msstore', url: 'https://storeedgefd.dsx.mp.microsoft.com/v9.0', enabled: true },
                ].map((src) => (
                  <div key={src.name} className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded">
                    <div>
                      <span className="font-bold font-mono text-[#0048ad]">{src.name}</span>
                      <span className="text-slate-400 text-xs ml-3 font-mono">{src.url}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${src.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {src.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="px-4 py-2 bg-[#0048ad] text-white text-xs font-bold rounded hover:brightness-110 transition-all">
                Update Sources
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Add Provider Placeholder */}
        <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-[#0048ad] transition-colors cursor-pointer group">
          <span className="material-symbols-outlined text-3xl mb-2 group-hover:text-[#0048ad] transition-colors">add_circle</span>
          <p className="text-xs font-bold uppercase tracking-widest group-hover:text-[#0048ad] transition-colors">Add Provider</p>
          <p className="text-[10px] mt-1">Chocolatey, Scoop, and more</p>
        </div>
      </div>
    </div>
  )
}
