import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#f5f7f8] dark:bg-[#0f1723] font-sans text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col min-w-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
