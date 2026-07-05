import type { SimulationStep } from '../types'

/** Shared Tailwind CSS class strings for consistent styling */
export const inputBase = 'w-full min-h-[48px] rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30'
export const labelBase = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400'
export const cardBase = 'glass-panel overflow-hidden p-5 sm:p-6'
export const pillBase = 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-slate-300'

/** Compute aggregate statistics from simulation steps */
export function computeStats<T>(steps: SimulationStep<T>[]) {
  const totalFaults = steps.filter(s => s.isFault).length
  const totalHits = steps.length - totalFaults
  const hitRatio = steps.length > 0 ? (totalHits / steps.length).toFixed(2) : '0.00'
  const faultRatio = steps.length > 0 ? (totalFaults / steps.length).toFixed(2) : '0.00'
  return { totalFaults, totalHits, hitRatio, faultRatio }
}

/** Generate and download a CSV file of the simulation results */
export function exportCSV<T>(steps: SimulationStep<T>[], frameSize: number, algorithm: string) {
  const headers = ['Step', 'Page', ...Array.from({ length: frameSize }, (_, i) => `F${i + 1}`), 'Fault', 'Replaced']
  const rows = steps.map((s, i) => [
    i + 1,
    s.page,
    ...s.frames.map(v => v !== null ? v : ''),
    s.isFault ? 'Fault' : 'Hit',
    s.replacedPage !== null ? s.replacedPage : '',
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flowcache-${algorithm.toLowerCase()}-${frameSize}f.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}
