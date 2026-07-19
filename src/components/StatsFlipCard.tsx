import { useState } from 'react'
import { Activity, ArrowUpRight, BarChart3, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPercent } from '../utils/helpers'

interface StatsFlipCardProps {
  totalFaults: number
  totalHits: number
  hitRatio: string
  faultRatio: string
  hasRun: boolean
}

export default function StatsFlipCard({ totalFaults, totalHits, hitRatio, faultRatio, hasRun }: StatsFlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  function handleClick() {
    if (hasRun) setFlipped(f => !f)
  }

  const statCards = [
    { label: 'Total Faults', value: totalFaults, accent: 'from-rose-500/25 to-rose-500/10', text: 'text-rose-200', icon: Cpu },
    { label: 'Total Hits', value: totalHits, accent: 'from-emerald-500/25 to-emerald-500/10', text: 'text-emerald-200', icon: BarChart3 },
    { label: 'Hit Ratio', value: formatPercent(Number(hitRatio)), accent: 'from-violet-500/25 to-violet-500/10', text: 'text-violet-200', icon: ArrowUpRight },
    { label: 'Fault Ratio', value: formatPercent(Number(faultRatio)), accent: 'from-amber-500/25 to-amber-500/10', text: 'text-amber-200', icon: Activity },
  ]

  return (
    <div className="w-full min-w-0 max-w-[360px]" style={{ perspective: '1000px' }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative w-full ${hasRun ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="glass-panel flex min-h-[320px] flex-col items-center justify-center border-dashed border-violet-400/20 px-6 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/25 bg-violet-500/10 text-violet-200">
            <BarChart3 size={24} />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            {hasRun ? 'Results Ready' : 'Ready for a new simulation'}
          </h2>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            {hasRun ? (
              <>Click to view the <span className="font-medium text-white">Performance Snapshot</span></>
            ) : (
              <>Configure the inputs above and click <span className="font-medium text-white">Start Simulation</span> to begin the animated walkthrough.</>
            )}
          </p>
        </div>

        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
          className="glass-panel w-full p-5"
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Performance Snapshot</h2>
            <p className="text-sm text-slate-400">Click card to flip back</p>
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
      </motion.div>
    </div>
  )
}
