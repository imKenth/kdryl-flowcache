import { PlayCircle, RotateCcw } from 'lucide-react'
import type { Algorithm } from '../types'
import { inputBase, labelBase, cardBase } from '../utils/helpers'

interface InputPanelProps {
  frameSize: number
  algorithm: Algorithm
  inputString: string
  hasRun: boolean
  error: string
  onFrameSizeChange: (size: number) => void
  onAlgorithmChange: (algo: Algorithm) => void
  onInputStringChange: (str: string) => void
  onStart: () => void
  onReset: () => void
}

/** Configuration panel for simulation inputs: frame size, algorithm, reference string */
export default function InputPanel({
  frameSize, algorithm, inputString, hasRun, error,
  onFrameSizeChange, onAlgorithmChange, onInputStringChange, onStart, onReset,
}: InputPanelProps) {
  return (
    <>
      <div className={cardBase}>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto] xl:items-end">
          <div>
            <label className={labelBase}>Frame Size</label>
            <input
              type="number"
              min={1}
              max={10}
              value={frameSize}
              onChange={e => onFrameSizeChange(Math.min(10, Math.max(1, Number(e.target.value))))}
              className={inputBase}
              disabled={hasRun}
            />
          </div>

          <div>
            <label className={labelBase}>Algorithm</label>
            <div className="flex flex-wrap gap-2">
              {(['FIFO', 'LRU'] as const).map(algo => (
                <button
                  key={algo}
                  onClick={() => onAlgorithmChange(algo)}
                  disabled={hasRun}
                  className={`h-12 min-w-[88px] flex-1 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    algorithm === algo
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_30px_rgba(124,58,237,0.3)]'
                      : 'border border-white/10 bg-white/8 text-slate-300 hover:border-violet-400/35 hover:text-white'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelBase}>Reference String</label>
            <input
              type="text"
              value={inputString}
              onChange={e => onInputStringChange(e.target.value)}
              placeholder="e.g. 1,2,3,4,1,2,5"
              className={inputBase}
              disabled={hasRun}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <button
              onClick={onStart}
              disabled={hasRun}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)] transition-all duration-300 hover:brightness-110 disabled:opacity-50 sm:flex-1"
            >
              <PlayCircle size={16} />
              Start
            </button>
            <button
              onClick={onReset}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-slate-300 transition-all duration-300 hover:border-violet-400/35 hover:text-white"
              aria-label="Reset simulation"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
    </>
  )
}
