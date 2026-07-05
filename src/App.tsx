import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ArrowRight, BrainCircuit, Layers3, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from './components/landing/Navbar'
import Hero from './components/HeroSection'
import Button from './components/ui/Button'
import Visualizer from './pages/visualizer'

/** Feature cards displayed on the landing page */
const features = [
  {
    title: 'FIFO Algorithm',
    desc: 'Observe how the oldest page is evicted first under the pressure of each new fault.',
    icon: Layers3,
  },
  {
    title: 'LRU Algorithm',
    desc: 'See how the least recently used page gets replaced with clean, animated clarity.',
    icon: BrainCircuit,
  },
  {
    title: 'Step Control',
    desc: 'Play, pause, and step through every reference while the timeline highlights what changed.',
    icon: Sparkles,
  },
  {
    title: 'Live Statistics',
    desc: 'Follow faults, hits, and ratios in real time as the simulation advances.',
    icon: ArrowRight,
  },
]

/** Steps guide displayed in the "How It Works" section */
const steps = [
  { num: '01', title: 'Configure', desc: 'Set the frame size, choose FIFO or LRU, and enter a page reference string.' },
  { num: '02', title: 'Simulate', desc: 'Watch pages fill the memory frames one step at a time with fault and hit cues.' },
  { num: '03', title: 'Analyze', desc: 'Inspect the trace, stats, and comparison cards to understand the decision path.' },
]

/** Landing page with hero, features, how-it-works, and footer sections */
function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  return (
    <main className="overflow-x-hidden pb-16">
      <Hero />

      <section id="features" className="scroll-mt-24 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
              Features
            </span>
            <h2 className="heading-font text-3xl font-semibold text-white sm:text-4xl">
              Built to make page replacement feel clear and premium.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="glass-panel group border-violet-400/20 p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-violet-200">
                    <Icon size={18} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-7 text-slate-400">{feature.desc}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
              How It Works
            </span>
            <h2 className="heading-font text-3xl font-semibold text-white sm:text-4xl">
              Three elegant steps to understanding the algorithm.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="glass-panel p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-sm font-semibold text-violet-200">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button size="lg" onClick={() => navigate('/visualizer')}>
              Start Learning Now
            </Button>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 py-10 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
        <span className="font-semibold text-slate-300">Flow<span className="text-violet-300">Cache</span></span>
        <p>Built with React, Tailwind CSS, Framer Motion, and a premium visual language.</p>
      </footer>
    </main>
  )
}

/** Root application component with navigation and routing */
function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </div>
  )
}

export default App
