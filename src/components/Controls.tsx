import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'

interface ControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  hasRun: boolean
  onBack: () => void
  onForward: () => void
  onTogglePlay: () => void
  onSpeedChange: (speed: number) => void
}

/** Playback controls: step back/forward, play/pause, speed slider, step counter */
export default function Controls({
  currentStep, totalSteps, isPlaying, speed, hasRun,
  onBack, onForward, onTogglePlay, onSpeedChange,
}: ControlsProps) {
  if (!hasRun || totalSteps === 0) return null

  const progress = totalSteps > 0 ? Math.min(100, (currentStep / totalSteps) * 100) : 0

  return (
    <div className="glass-panel p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">
            Simulation Progress
          </span>
          <span className="text-slate-400">Step {currentStep} / {totalSteps}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {isPlaying ? 'Playing' : 'Paused'}
        </div>
      </div>

      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-400 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onBack} disabled={currentStep === 0} className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-400/25 bg-white/8 text-slate-200 transition-all duration-300 hover:border-violet-400/50 hover:text-white disabled:opacity-35">
            <SkipBack size={18} />
          </button>
          <button onClick={onTogglePlay} className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_14px_36px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-105">
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
          </button>
          <button onClick={onForward} disabled={currentStep >= totalSteps} className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-400/25 bg-white/8 text-slate-200 transition-all duration-300 hover:border-violet-400/50 hover:text-white disabled:opacity-35">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-400">Speed</label>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={1500 - speed + 100}
            onChange={e => onSpeedChange(1500 - Number(e.target.value) + 100)}
            className="h-1.5 w-full max-w-[180px] cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-500"
          />
          <span className="w-10 text-sm text-slate-400 tabular-nums">{speed}ms</span>
        </div>
      </div>
    </div>
  )
}
