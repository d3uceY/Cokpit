import { useState } from 'react'

interface SearchResult {
  id: string
  name: string
  id_str: string
  version: string
  source: string
  description: string
  icon: string
}

const mockResults: SearchResult[] = [
  { id: '1', name: 'Node.js', id_str: 'OpenJS.NodeJS.LTS', version: 'v20.11.0', source: 'winget', description: 'Asynchronous event-driven JavaScript runtime', icon: 'javascript' },
  { id: '2', name: 'Python 3.12', id_str: 'Python.Python.3.12', version: '3.12.1', source: 'winget', description: 'An interpreted high-level programming language', icon: 'data_object' },
  { id: '3', name: 'Visual Studio Code', id_str: 'Microsoft.VisualStudioCode', version: '1.86.0', source: 'winget', description: 'Code editor redefined and optimized for modern development', icon: 'code' },
  { id: '4', name: 'Git', id_str: 'Git.Git', version: '2.44.0', source: 'winget', description: 'Distributed version control system', icon: 'merge' },
  { id: '5', name: 'Neovim', id_str: 'Neovim.Neovim', version: '0.9.5', source: 'winget', description: 'Hyperextensible Vim-based text editor', icon: 'terminal' },
  { id: '6', name: 'WinSCP', id_str: 'WinSCP.WinSCP', version: '6.3.2', source: 'winget', description: 'SFTP, FTP, SCP, S3, and WebDAV client', icon: 'cloud_upload' },
]

export default function Search() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [installing, setInstalling] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    const q = query.toLowerCase()
    setResults(mockResults.filter((r) => r.name.toLowerCase().includes(q) || r.id_str.toLowerCase().includes(q)))
    setSearched(true)
  }

  const handleInstall = (id: string) => {
    setInstalling(id)
    setTimeout(() => setInstalling(null), 2000)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="p-8 pb-4 flex-shrink-0 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1 mb-6">
          <h2 className="text-3xl font-black tracking-tight">Search Packages</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Find and install packages from the Winget repository</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-[#0048ad] focus:border-[#0048ad] text-sm transition-all"
              placeholder="Search by name or package ID (e.g. node, Git.Git)..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-6 h-11 bg-[#0048ad] text-white text-sm font-bold rounded hover:brightness-110 transition-all"
          >
            Search
          </button>
        </form>
      </header>

      <div className="flex-1 overflow-auto p-8">
        {!searched && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">manage_search</span>
            <p className="text-sm font-bold uppercase tracking-widest">Enter a query to search packages</p>
            <p className="text-xs mt-1">Search by name, ID, or description</p>
          </div>
        )}

        {searched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">search_off</span>
            <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/50 overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80">
                    {['Package', 'Package ID', 'Version', 'Source', 'Actions'].map((h, i) => (
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
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#0048ad]">{r.icon}</span>
                          <div>
                            <p className="text-sm font-semibold">{r.name}</p>
                            <p className="text-[10px] text-slate-400 max-w-[200px] truncate">{r.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">{r.id_str}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">{r.version}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Winget
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="px-3 py-1.5 bg-[#0048ad] text-white text-xs font-bold rounded hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 ml-auto"
                          disabled={installing === r.id}
                          onClick={() => handleInstall(r.id)}
                        >
                          {installing === r.id ? (
                            <>
                              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                              Installing…
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">download</span>
                              Install
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
