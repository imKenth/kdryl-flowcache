import { motion } from 'framer-motion'
import type { SimulationStep } from '../types'
import { cardBase } from '../utils/helpers'

interface FrameGridProps {
  steps: SimulationStep<string>[]
  currentStep: number
  frameSize: number
  highlightedFault: number | null
}

/** Displays a timeline grid of frame contents, status, and evicted pages */
export default function FrameGrid({ steps, currentStep, frameSize, highlightedFault }: FrameGridProps) {
  const visibleSteps = steps.slice(0, currentStep)

  if (visibleSteps.length === 0) return null

  return (
    <div className={`${cardBase} min-w-0 lg:sticky lg:top-24 lg:z-20 lg:self-start`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Frame Timeline</h2>
          <p className="text-sm text-slate-400">Each column is a reference step with live frame states.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-slate-400">
          {visibleSteps.length} steps
        </div>
      </div>

      <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
        <div className="flex min-w-max">
          <div className="sticky left-0 z-10 shrink-0 border-r border-white/10 pr-3">
            <div className="timeline-header-row" />
            {Array.from({ length: frameSize }, (_, i) => (
              <div key={i} className="timeline-label timeline-row pr-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Frame {i + 1}
              </div>
            ))}
            <div className="timeline-label timeline-meta-row pr-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Status
            </div>
            <div className="timeline-label timeline-meta-row pr-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Evict
            </div>
          </div>

          <div className="flex">
            {visibleSteps.map((step, colIdx) => {
              const isLastCol = colIdx === currentStep - 1
              const isFaultCol = isLastCol && step.isFault
              const isHitCol = isLastCol && !step.isFault

              return (
                <div key={colIdx} className="flex flex-col">
                  <div className={`timeline-label timeline-header-row items-center justify-center rounded-t-2xl px-2 text-[11px] font-bold ${
                    isFaultCol ? 'bg-rose-500/20 text-rose-200' : isHitCol ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/8 text-slate-400'
                  }`}>
                    {step.page}
                  </div>

                  {step.frames.map((val, frameIdx) => {
                    const isChanged = step.changedIndex === frameIdx && isLastCol
                    const isHighlighted = highlightedFault !== null && highlightedFault === colIdx && step.changedIndex === frameIdx
                    const hasValue = val !== null
                    const rowClass = frameIdx % 2 === 0 ? 'bg-white/5' : 'bg-white/3'

                    return (
                      <motion.div
                        key={frameIdx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`timeline-label timeline-row w-14 items-center justify-center border border-white/10 text-sm font-semibold font-mono transition-all duration-300 ${rowClass} ${
                          isHighlighted
                            ? 'scale-110 border-rose-400/50 bg-rose-500/20 text-rose-100 shadow-[0_0_25px_rgba(239,68,68,0.18)] z-10'
                            : isChanged && isFaultCol
                            ? 'border-violet-400/30 bg-violet-500/10 text-violet-50'
                            : isChanged && isHitCol
                            ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                            : colIdx === currentStep - 1 && hasValue
                            ? 'border-violet-400/20 bg-violet-500/10 text-violet-50'
                            : 'text-slate-300'
                        } ${step.isFault && isChanged ? 'animate-shake' : ''}`}
                      >
                        {val !== null ? val : ''}
                      </motion.div>
                    )
                  })}

                  <div className={`timeline-label timeline-meta-row w-14 items-center justify-center border border-white/10 text-[10px] font-bold ${
                    step.isFault ? 'bg-rose-500/10 text-rose-200' : 'bg-emerald-500/10 text-emerald-200'
                  }`}>
                    {step.isFault ? 'FAULT' : 'HIT'}
                  </div>

                  <div className={`timeline-label timeline-meta-row w-14 items-center justify-center border border-white/10 text-[10px] font-mono font-semibold ${
                    step.replacedPage !== null ? 'bg-amber-500/10 text-amber-200' : 'text-slate-500'
                  }`}>
                    {step.replacedPage !== null ? step.replacedPage : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
