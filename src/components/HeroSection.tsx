import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, Cpu, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from './ui/Button'

/** Landing page hero section with title, description, and call-to-action buttons */
export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.16),transparent_24%)]" />
      <div className="absolute left-10 top-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel w-full max-w-6xl overflow-hidden border-violet-400/30 p-6 sm:p-8 lg:p-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
                <Sparkles size={14} />
                Interactive Learning Tool
              </div>

              <h1 className="heading-font text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Visualize cache
                <span className="block bg-gradient-to-r from-violet-300 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                  cache replacement
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 lg:mx-0">
                Step through FIFO and LRU page replacement with cinematic animations, real-time metrics, and a dashboard that feels built for modern education and engineering teams.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button size="lg" onClick={() => navigate('/visualizer')}>
                  Launch Visualizer <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Features
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400 lg:justify-start">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> FIFO & LRU
                </span>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Step-by-step playback
                </span>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" /> Live stats
                </span>
              </div>
            </div>

            <div className="rounded-[28px] border border-violet-400/25 bg-[#0f172a]/70 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
              <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-500/20 via-slate-900/70 to-fuchsia-500/10 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Live preview</span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">Live</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Faults', value: '6', icon: Cpu },
                    { label: 'Hits', value: '9', icon: BarChart3 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-2 text-violet-200">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">{label}</p>
                          <p className="text-lg font-semibold text-white">{value}</p>
                        </div>
                      </div>
                      <div className="h-2.5 w-16 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
