import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export type AppOutletContext = {
  setUpdateCount: (n: number) => void
}

export function AppLayout() {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('cokpit-theme') === 'dark' } catch { return false }
  })
  const [updateCount, setUpdateCount] = useState(0)

  const toggleTheme = () =>
    setIsDark((d) => {
      const next = !d
      try { localStorage.setItem('cokpit-theme', next ? 'dark' : 'light') } catch {}
      return next
    })

  return (
    <div className={`${isDark ? 'dark' : ''} flex min-h-screen bg-[#f5f7f8] dark:bg-[#0f1723] text-[#0f1723] dark:text-white font-sans antialiased overflow-hidden`}>
      <Sidebar isDark={isDark} onToggleTheme={toggleTheme} updateCount={updateCount} />
      <main className="ml-64 flex-1 flex flex-col min-w-0 min-h-screen">
        <Outlet context={{ setUpdateCount } satisfies AppOutletContext} />
      </main>
    </div>
  )
}
