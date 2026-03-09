import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/packages', label: 'Installed Packages', icon: 'inventory_2' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/updates', label: 'Updates', icon: 'update', badge: 12 },
  { to: '/cleanup', label: 'Cleanup', icon: 'delete_sweep' },
  { to: '/package-managers', label: 'Package Managers', icon: 'settings_input_component' },
]

const systemItems = [
  { to: '/history', label: 'History', icon: 'history' },
  { to: '/logs', label: 'Logs', icon: 'terminal' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-[#f5f7f8] dark:bg-[#0f1723] flex flex-col fixed h-full z-10">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 bg-[#0048ad] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
          {/* Logo placeholder — replace src with actual logo */}
          <span className="text-white text-xs font-black">C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter uppercase leading-none">Cokpit</span>
          <span className="text-[10px] text-[#0048ad] font-bold uppercase tracking-widest">Sys-Mgmt</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors text-sm',
                isActive
                  ? 'bg-[#0048ad] text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800',
              )
            }
          >
            <span className="material-symbols-outlined text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge != null && (
              <span className="ml-auto bg-[#0048ad]/20 text-[#0048ad] text-[10px] px-1.5 py-0.5 rounded font-bold leading-none group-[.active]:bg-white/20 group-[.active]:text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-t border-slate-200 dark:border-slate-800 mt-4">
          System
        </div>

        {systemItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors text-sm',
                isActive
                  ? 'bg-[#0048ad] text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800',
              )
            }
          >
            <span className="material-symbols-outlined text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Cokpit v0.1.0</span>
        </div>
      </div>
    </aside>
  )
}
