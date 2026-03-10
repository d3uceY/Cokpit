import { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { GetOutdatedPackages, UpgradePackage } from '../../wailsjs/go/main/App'
import type { pip } from '../../wailsjs/go/models'
import type { AppOutletContext } from '../components/layout/AppLayout'


const bumpStyles: Record<string, { badge: string; label: string }> = {
  major: { badge: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', label: 'Major' },
  minor: { badge: 'bg-[#0048ad]/10 text-[#0048ad]', label: 'Minor' },
  patch: { badge: 'bg-black/5 dark:bg-white/5 text-[#0f1723]/50 dark:text-white/50', label: 'Patch' },
}

export default function Updates() {
  const { setUpdateCount } = useOutletContext<AppOutletContext>()

  const [updates, setUpdates] = useState<pip.OutdatedPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [upgrading, setUpgrading] = useState<Set<string>>(new Set())

  const loadUpdates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const pkgs = await GetOutdatedPackages()
      const list = pkgs ?? []
      setUpdates(list)
      setUpdateCount(list.length)
      setSelected(new Set())
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }, [setUpdateCount])

  useEffect(() => { loadUpdates() }, [loadUpdates])

  const toggleSelect = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  const runUpgrade = async (name: string) => {
    setUpgrading((prev) => new Set(prev).add(name))
    try {
      await UpgradePackage(name)
      setUpdates((prev) => {
        const next = prev.filter((p) => p.name !== name)
        setUpdateCount(next.length)
        return next
      })
      setSelected((prev) => { const n = new Set(prev); n.delete(name); return n })
    } catch (e: any) {
      alert(`Failed to upgrade ${name}: ${e?.message ?? e}`)
    } finally {
      setUpgrading((prev) => { const n = new Set(prev); n.delete(name); return n })
    }
  }

  const handleUpgradeAll = () => {
    const names = selected.size > 0 ? Array.from(selected) : updates.map((u) => u.name)
    names.forEach(runUpgrade)
  }

  const allSelected = updates.length > 0 && selected.size === updates.length
  const majorCount = updates.filter((u) => u.bumpType === 'major').length

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="p-8 pb-4 flex-shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Updates</h2>
            <p className="text-[#0f1723]/50 dark:text-white/50 text-sm">
              {loading ? '…' : `${updates.length} outdated package${updates.length !== 1 ? 's' : ''}`}
              {' — '}<span className="font-mono">pip list --outdated</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <span className="text-xs text-[#0f1723]/40 dark:text-white/40 font-medium">
                {selected.size} selected
              </span>
            )}
            <button
              className="flex items-center gap-2 px-4 h-10 bg-[#0048ad] hover:brightness-110 text-white font-bold text-sm transition-all disabled:opacity-50"
              disabled={loading || updates.length === 0 || upgrading.size > 0}
              onClick={handleUpgradeAll}
            >
              <span className="material-symbols-outlined text-[18px]">system_update</span>
              {selected.size > 0 ? `Upgrade Selected (${selected.size})` : `Upgrade All (${updates.length})`}
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 bg-[#f5f7f8] dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              disabled={loading}
              onClick={loadUpdates}
            >
              <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </div>
        </div>

        {!loading && majorCount > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <p className="text-xs font-bold text-red-600 dark:text-red-400">
              {majorCount} major version bump{majorCount > 1 ? 's' : ''} — review changelogs before upgrading.
            </p>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-auto px-8 pb-8">
        {error && (
          <div className="mb-4 flex items-center gap-3 p-4 border border-red-500/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="border border-black/15 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 border-b border-black/10 dark:border-white/10 w-10">
                  <input
                    type="checkbox"
                    className="border-black/20 dark:border-white/20"
                    checked={allSelected}
                    disabled={loading || updates.length === 0}
                    onChange={() => setSelected(allSelected ? new Set() : new Set(updates.map((u) => u.name)))}
                  />
                </th>
                {['Package', 'Current', 'Latest', 'Bump', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#0f1723]/40 dark:text-white/40 border-b border-black/10 dark:border-white/10${i === 4 ? ' text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="w-4 h-4 bg-black/8 dark:bg-white/8 rounded-sm" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black/8 dark:bg-white/8 rounded-sm" />
                      <div className="h-3 w-24 bg-black/8 dark:bg-white/8 rounded-sm" />
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-3 w-14 bg-black/8 dark:bg-white/8 rounded-sm" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-14 bg-black/8 dark:bg-white/8 rounded-sm" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-12 bg-black/5 dark:bg-white/5 rounded-sm" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-6 w-16 bg-black/8 dark:bg-white/8 rounded-sm ml-auto" /></td>
                </tr>
              ))}
              {!loading && updates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#0f1723]/30 dark:text-white/30">
                      <span className="material-symbols-outlined text-[36px]">check_circle</span>
                      <p className="text-sm font-bold">All packages are up to date</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && updates.map((item) => {
                const isUpgrading = upgrading.has(item.name)
                const bump = bumpStyles[item.bumpType] ?? bumpStyles.patch
                return (
                  <tr
                    key={item.name}
                    className={`hover:bg-black/2 dark:hover:bg-white/3 transition-colors${selected.has(item.name) ? ' bg-[#0048ad]/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="border-black/20 dark:border-white/20"
                        checked={selected.has(item.name)}
                        onChange={() => toggleSelect(item.name)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0048ad]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#0048ad] text-sm">data_object</span>
                        </div>
                        <p className="text-sm font-bold font-mono">{item.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-[#0f1723]/50 dark:text-white/50">{item.version}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5">
                        {item.latestVersion}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${bump.badge}`}>
                        {bump.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0048ad] text-white text-xs font-bold hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                        disabled={isUpgrading}
                        onClick={() => runUpgrade(item.name)}
                      >
                        {isUpgrading ? (
                          <>
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            Upgrading…
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

