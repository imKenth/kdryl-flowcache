import { motion } from 'framer-motion'
import type { SimulationStep } from '../types'
import { cardBase } from '../utils/helpers'

interface ReferenceStringProps {
  steps: SimulationStep<string>[]
  currentStep: number
}

/** Visual display of the page reference string with fault/hit color coding */
export default function ReferenceString({ steps, currentStep }: ReferenceStringProps) {
  return (
    <div className={cardBase}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Reference String</h2>
          <p className="text-sm text-slate-400">Current, hit, fault, and upcoming references.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1">Current</span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1">Hit</span>
          <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1">Fault</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStep - 1
          const isPast = idx < currentStep
          let stateClass = 'border border-white/10 bg-white/8 text-slate-400'

          if (isCurrent) {
            stateClass = step.isFault
              ? 'border-violet-400/40 bg-violet-500/20 text-violet-50 shadow-[0_0_30px_rgba(124,58,237,0.25)]'
              : 'border-emerald-400/40 bg-emerald-500/20 text-emerald-50 shadow-[0_0_30px_rgba(34,197,94,0.2)]'
          } else if (isPast) {
            stateClass = step.isFault ? 'border-rose-400/25 bg-rose-500/10 text-rose-200' : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
          }

          return (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl px-2 text-sm font-semibold font-mono transition-all duration-300 ${stateClass}`}
            >
              {step.page}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}
