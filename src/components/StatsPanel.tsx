import { Activity, ArrowUpRight, BarChart3, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPercent } from '../utils/helpers'

interface StatsPanelProps {
  totalFaults: number
  totalHits: number
  hitRatio: string
  faultRatio: string
  hasRun: boolean
  onExportCSV: () => void
}

/** Summary statistics panel showing fault/hit counts and ratios, plus CSV export */
export default function StatsPanel({ totalFaults, totalHits, hitRatio, faultRatio, hasRun, }: StatsPanelProps) {
  if (!hasRun) return null

  const statCards = [
    { label: 'Total Faults', value: totalFaults, accent: 'from-rose-500/25 to-rose-500/10', text: 'text-rose-200', icon: Cpu },
    { label: 'Total Hits', value: totalHits, accent: 'from-emerald-500/25 to-emerald-500/10', text: 'text-emerald-200', icon: BarChart3 },
    { label: 'Hit Ratio', value: formatPercent(Number(hitRatio)), accent: 'from-violet-500/25 to-violet-500/10', text: 'text-violet-200', icon: ArrowUpRight },
    { label: 'Fault Ratio', value: formatPercent(Number(faultRatio)), accent: 'from-amber-500/25 to-amber-500/10', text: 'text-amber-200', icon: Activity },
  ]

  return (
    <div className="glass-panel w-full min-w-0 max-w-[360px] p-5 lg:sticky lg:top-24 lg:self-start xl:ml-auto">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Performance Snapshot</h2>
          <p className="text-sm text-slate-400">A quick view of runtime outcomes.</p>
        </div>
        {/* <button onClick={onExportCSV} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white sm:self-start">
          <Download size={14} />
          Export CSV
        </button> */}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`h-full rounded-[20px] border border-white/10 bg-gradient-to-r ${card.accent} p-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className={`mt-1 text-2xl font-semibold ${card.text}`}>{card.value}</p>
                </div>
                <div className={`rounded-2xl border border-white/10 bg-white/8 p-2 ${card.text}`}>
                  <Icon size={16} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
