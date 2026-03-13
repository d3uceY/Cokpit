import { useQuery, useQueryClient } from '@tanstack/react-query'
import { RunDoctor } from '../../wailsjs/go/main/App'
import { pip } from '../../wailsjs/go/models'

type CheckStatus = 'ok' | 'warn' | 'fail'

const statusConfig = {
  ok: {
    icon: 'check_circle',
    iconClass: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    label: 'Passed',
    labelClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  warn: {
    icon: 'warning',
    iconClass: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/40',
    label: 'Warning',
    labelClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  },
  fail: {
    icon: 'cancel',
    iconClass: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800/40',
    label: 'Failed',
    labelClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  },
}

function CheckCard({ check }: { check: pip.DoctorCheck }) {
  const cfg = statusConfig[check.status as CheckStatus] ?? statusConfig.warn
  return (
    <div className={`border ${cfg.border} ${cfg.bg} p-5`}>
      <div className="flex items-start gap-4">
        <span className={`material-symbols-outlined text-2xl leading-none mt-0.5 flex-shrink-0 ${cfg.iconClass}`}>
          {cfg.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-[#0f1723] dark:text-white">{check.name}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 leading-none ${cfg.labelClass}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-[#0f1723]/70 dark:text-white/60">{check.detail}</p>

          {(check.status === 'fail' || check.status === 'warn') && check.fixHint && (
            <div className="mt-3 bg-[#0048ad]/8 dark:bg-[#0048ad]/15 border border-[#0048ad]/20 p-3">
              <p className="text-xs text-[#0048ad] dark:text-blue-300 font-medium mb-1">How to fix</p>
              <p className="text-xs text-[#0f1723]/70 dark:text-white/60">{check.fixHint}</p>
              {check.fixUrl && (
                <a
                  href={check.fixUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#0048ad] dark:text-blue-400 hover:underline"
                >
                  <span className="material-symbols-outlined text-sm leading-none">open_in_new</span>
                  {check.fixUrl}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Doctor() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, isFetching } = useQuery<pip.DoctorReport>({
    queryKey: ['doctor'],
    queryFn: RunDoctor,
    staleTime: Infinity,
    retry: false,
  })

  function rerun() {
    queryClient.invalidateQueries({ queryKey: ['doctor'] })
  }

  const allOk = data?.ok ?? false
  const hasAnyFail = data?.checks.some((c) => c.status === 'fail') ?? false

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0f1723] dark:text-white">Doctor</h1>
          <p className="text-sm text-[#0f1723]/50 dark:text-white/40 mt-0.5">
            Checks your Python, pip, and PyPI connectivity
          </p>
        </div>
        <button
          onClick={rerun}
          disabled={isLoading || isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-[#0048ad] text-white text-sm font-bold hover:bg-[#0048ad]/90 disabled:opacity-50 transition-colors"
        >
          <span className={`material-symbols-outlined text-base leading-none ${isFetching ? 'animate-spin' : ''}`}>
            {isFetching ? 'progress_activity' : 'refresh'}
          </span>
          Re-run checks
        </button>
      </div>

      {/* Overall banner */}
      {data && !isFetching && (
        <div
          className={`flex items-center gap-3 p-4 mb-6 border ${
            allOk
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40'
          }`}
        >
          <span
            className={`material-symbols-outlined text-2xl leading-none ${allOk ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {allOk ? 'check_circle' : 'error'}
          </span>
          <div>
            <p className={`font-bold text-sm ${allOk ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              {allOk ? 'All systems go' : hasAnyFail ? 'Action required' : 'Warnings detected'}
            </p>
            <p className="text-xs text-[#0f1723]/60 dark:text-white/50">
              {data.checks.length} check{data.checks.length !== 1 ? 's' : ''} completed
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {(isLoading || (isFetching && !data)) && (
        <div className="flex items-center gap-3 p-8 justify-center text-[#0f1723]/40 dark:text-white/30">
          <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
          <span className="text-sm font-medium">Running checks…</span>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/30 p-5 text-sm text-red-700 dark:text-red-400">
          Failed to run diagnostics. Check the application logs.
        </div>
      )}

      {/* Checks */}
      {data && (
        <div className="space-y-3">
          {data.checks.map((check) => (
            <CheckCard key={check.name} check={check} />
          ))}
        </div>
      )}
    </div>
  )
}
