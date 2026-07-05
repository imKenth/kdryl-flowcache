import { useState } from 'react'
import { Copy, Download, Search, PanelRightClose, PanelRightOpen } from 'lucide-react'
import type { Algorithm, SimulationStep } from '../types'
import { buildTrace, buildTraceLRU } from '../logic/fifo-lru'
import { cardBase } from '../utils/helpers'

interface SolutionTraceProps {
  steps: SimulationStep<string>[]
  currentStep: number
  frameSize: number
  algorithm: Algorithm
}

/** Algorithm-specific solution trace table showing how pages propagate through frames */
export default function SolutionTrace({ steps, currentStep, frameSize, algorithm }: SolutionTraceProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  if (steps.length === 0) return null

  const visibleSteps = steps.slice(0, currentStep)
  if (visibleSteps.length === 0) return null

  const pages = steps.map(s => s.page)
  const filteredPages = pages.filter(page => String(page).toLowerCase().includes(search.toLowerCase()))

  if (algorithm === 'FIFO') {
    const isFault = steps.map(s => s.isFault)
    const trace = buildTrace<string>(pages, frameSize, isFault)
    const colCount = Math.min(currentStep, pages.length)

    return (
      <div className={`${cardBase} min-w-0 lg:sticky lg:top-24 lg:z-20 lg:self-start`}>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Solution Trace — FIFO</h2>
            <p className="text-sm text-slate-400">Inspect the full frame evolution for each reference.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-400">
              <Search size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none placeholder:text-slate-500" placeholder="Search" />
            </label>
            <button className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-300 hover:text-white"><Copy size={14} /></button>
            <button className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-300 hover:text-white"><Download size={14} /></button>
            <button onClick={() => setCollapsed(!collapsed)} className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-300 hover:text-white">
              {collapsed ? <PanelRightOpen size={14} /> : <PanelRightClose size={14} />}
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="max-w-full overflow-x-auto">
            <div className="flex min-w-max">
              <div className="sticky left-0 z-10 shrink-0">
                <div className="timeline-header-row" />
                {Array.from({ length: frameSize }, (_, i) => (
                  <div key={i} className="timeline-label timeline-row pr-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Frame {i + 1}
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <div className="flex">
                  {Array.from({ length: colCount }, (_, i) => (
                    <div
                      key={i}
                      className={`timeline-label timeline-header-row w-14 items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                        i === currentStep - 1 ? 'scale-110 text-violet-200' : 'text-slate-400'
                      }`}
                    >
                      {pages[i]}
                    </div>
                  ))}
                </div>

                {Array.from({ length: frameSize }, (_, rowIdx) => (
                  <div key={rowIdx} className="flex">
                    {Array.from({ length: colCount }, (_, colIdx) => {
                      const val = trace[rowIdx][colIdx]
                      const hasValue = val !== null
                      const isLast = colIdx === currentStep - 1
                      const step = steps[colIdx]
                      const isChanged = step.changedIndex === rowIdx && isLast && step.isFault
                      const highlighted = filteredPages.includes(val as string)
                      return (
                        <div
                          key={colIdx}
                          className={`timeline-label timeline-row w-14 items-center justify-center border border-white/10 text-sm font-mono transition-all duration-300 ${
                            isChanged
                              ? 'scale-110 border-rose-400/50 bg-rose-500/20 text-rose-100 z-10'
                              : hasValue && isLast
                              ? 'border-violet-400/20 bg-violet-500/10 text-violet-50'
                              : hasValue
                              ? 'bg-white/6 text-slate-300'
                              : 'bg-transparent text-slate-600'
                          } ${highlighted ? 'ring-1 ring-violet-400/30' : ''}`}
                        >
                          {val ?? ''}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const trace = buildTraceLRU<string>(pages, frameSize, steps)
  const colCount = Math.min(currentStep, pages.length)

  return (
    <div className={`${cardBase} min-w-0 lg:sticky lg:top-24 lg:z-20 lg:self-start`}>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Solution Trace — LRU</h2>
          <p className="text-sm text-slate-400">Inspect the recency ordering and frame replacements.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-400">
            <Search size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none placeholder:text-slate-500" placeholder="Search" />
          </label>
          <button className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-300 hover:text-white"><Copy size={14} /></button>
          <button className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-300 hover:text-white"><Download size={14} /></button>
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-300 hover:text-white">
            {collapsed ? <PanelRightOpen size={14} /> : <PanelRightClose size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="max-w-full overflow-x-auto">
          <div className="flex min-w-max">
<div className="sticky left-0 z-10 shrink-0">
                <div className="timeline-header-row" />
                {Array.from({ length: frameSize }, (_, i) => (
                  <div key={i} className="timeline-label timeline-row pr-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Frame {i + 1}
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <div className="flex">
                  {Array.from({ length: colCount }, (_, i) => (
                    <div
                      key={i}
                      className={`timeline-label timeline-header-row w-14 items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                        i === currentStep - 1 ? 'scale-110 text-violet-200' : 'text-slate-400'
                      }`}
                    >
                      {pages[i]}
                    </div>
                  ))}
                </div>

                {Array.from({ length: frameSize }, (_, rowIdx) => (
                  <div key={rowIdx} className="flex">
                    {Array.from({ length: colCount }, (_, colIdx) => {
                      const val = trace[rowIdx][colIdx]
                    const hasValue = val !== null
                    const isLast = colIdx === currentStep - 1
                    const step = steps[colIdx]
                    const isLruRow = rowIdx === frameSize - 1
                    const isAccessed = isLast && hasValue && val === step.page
                    const isFaulted = isAccessed && step.isFault
                    const isHit = isAccessed && !step.isFault
                    const highlighted = filteredPages.includes(val as string)
                    return (
                      <div
                        key={colIdx}
                        className={`timeline-label timeline-row w-14 items-center justify-center border border-white/10 text-sm font-mono transition-all duration-300 ${
                          isFaulted
                            ? 'scale-110 border-rose-400/50 bg-rose-500/20 text-rose-100 z-10'
                            : isHit
                            ? 'scale-110 border-emerald-400/50 bg-emerald-500/20 text-emerald-100 z-10'
                            : isLast && isLruRow
                            ? 'border-amber-400/30 bg-amber-500/10 text-amber-100'
                            : hasValue && isLast
                            ? 'border-violet-400/20 bg-violet-500/10 text-violet-50'
                            : hasValue
                            ? 'bg-white/6 text-slate-300'
                            : 'bg-transparent text-slate-600'
                        } ${highlighted ? 'ring-1 ring-violet-400/30' : ''}`}
                      >
                        {val ?? ''}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
