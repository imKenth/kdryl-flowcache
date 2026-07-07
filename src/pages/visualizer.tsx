import { useCallback } from 'react'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { useSimulator } from '../hooks/useSimulator'
import InputPanel from '../components/InputPanel'
import Controls from '../components/Controls'
import ReferenceString from '../components/ReferenceString'
import FrameGrid from '../components/FrameGrid'
import SolutionTrace from '../components/SolutionTrace'
import StatsPanel from '../components/StatsPanel'
import { computeStats } from '../utils/helpers'

/** Main visualizer page that orchestrates all simulation UI components */
export default function Visualizer() {
  const sim = useSimulator()
  const stats = computeStats(sim.steps)

  /** Start simulation and immediately begin auto-play */
  const handleStart = useCallback(() => {
    sim.runSimulation()
    setTimeout(() => sim.togglePlay(), )
  }, [sim.runSimulation, sim.togglePlay])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <a href="/" className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white">
        <ArrowLeft size={16} />
        Back to Home
      </a>

      {/* <section className="glass-panel overflow-hidden border-violet-400/25 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
              <Sparkles size={14} />
              FlowCache • FIFO • LRU • Visual Learning
            </div>
            <h1 className="heading-font text-3xl font-semibold text-white sm:text-4xl">
              Page replacement, redesigned as a modern learning cockpit.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Launch simulations, inspect each page decision, and compare the algorithm outcome in a polished dashboard built for clarity.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-300">
            <Cpu size={16} className="text-violet-300" />
            <span>{sim.algorithm} • {sim.frameSize} frames</span>
          </div>
        </div>
      </section> */}

      <InputPanel
        frameSize={sim.frameSize}
        algorithm={sim.algorithm}
        inputString={sim.inputString}
        hasRun={sim.hasRun}
        error={sim.error}
        onFrameSizeChange={sim.setFrameSize}
        onAlgorithmChange={sim.setAlgorithm}
        onInputStringChange={sim.setInputString}
        onStart={handleStart}
        onReset={sim.reset}
        onSpeedChange={sim.setSpeed}
      />

      <Controls
        currentStep={sim.currentStep}
        totalSteps={sim.steps.length}
        isPlaying={sim.isPlaying}
        speed={sim.speed}
        hasRun={sim.hasRun}
        onBack={sim.stepBackward}
        onForward={sim.stepForward}
        onTogglePlay={sim.togglePlay}
      />

      {sim.hasRun && sim.steps.length > 0 && (
        <ReferenceString steps={sim.steps} currentStep={sim.currentStep} />
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.45fr)]">
        <div className="min-w-0 space-y-6">
          <FrameGrid
            steps={sim.steps}
            currentStep={sim.currentStep}
            frameSize={sim.frameSize}
            highlightedFault={sim.highlightedFault}
          />
          <SolutionTrace
            steps={sim.steps}
            currentStep={sim.currentStep}
            frameSize={sim.frameSize}
            algorithm={sim.algorithm}
          />
        </div>
        <div className="space-y-6">
          <StatsPanel
            totalFaults={stats.totalFaults}
            totalHits={stats.totalHits}
            hitRatio={stats.hitRatio}
            faultRatio={stats.faultRatio}
            hasRun={sim.hasRun}
            onExportCSV={sim.exportCSV}
          />
          {!sim.hasRun && (
            <div className="glass-panel flex min-h-[320px] flex-col items-center justify-center border-dashed border-violet-400/20 px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/25 bg-violet-500/10 text-violet-200">
                <BarChart3 size={24} />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Ready for a new simulation</h2>
              <p className="max-w-sm text-sm leading-7 text-slate-400">
                Configure the inputs above and click <span className="font-medium text-white">Start Simulation</span> to begin the animated walkthrough.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-slate-500">
        FlowCache — FIFO &amp; LRU Page Replacement Visualizer
      </div>
    </div>
  )
}
