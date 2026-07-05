import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'
import Button from '../ui/Button'

/** Navigation links for the landing page sections */
const links = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
]

/** Responsive navbar with smooth-scroll navigation and mobile hamburger menu */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isVisualizer = location.pathname === '/visualizer'

  function scrollTo(id: string) {
    if (location.pathname !== '/') {
      navigate('/' + '#' + id)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/70 backdrop-blur-2xl">
      <div className={`mx-auto flex max-w-7xl items-center px-6 py-4 lg:px-8 ${isVisualizer ? 'justify-center' : 'justify-between'}`}>
        <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-violet-400/40 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 shadow-[0_0_24px_rgba(124,58,237,0.25)]">
            <Sparkles size={16} className="text-violet-200" />
          </span>
          <span className="heading-font">Flow<span className="text-violet-300">Cache</span></span>
        </a>

        {!isVisualizer && (
          <>
            <nav className="hidden items-center gap-7 md:flex">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:block">
              <Button size="sm" variant="secondary" onClick={() => navigate('/visualizer')}>
                Launch Visualizer
              </Button>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-2xl border border-white/10 bg-white/8 p-2 text-slate-200 transition-colors hover:bg-white/12 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-6 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => { setOpen(false); scrollTo(link.id) }}
                className="text-left text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2">
              <Button size="sm" className="w-full" onClick={() => { setOpen(false); navigate('/visualizer') }}>
                Launch Visualizer
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
