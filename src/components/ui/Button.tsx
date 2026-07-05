import type { ButtonHTMLAttributes, ReactNode } from 'react'

/** Props for the Button component, extending native button attributes */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Size preset */
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

/** Tailwind classes for each button variant */
const variants = {
  primary:
    'bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] hover:shadow-[0_16px_45px_rgba(124,58,237,0.5)] active:scale-[0.98] disabled:opacity-50',
  secondary:
    'border border-white/15 bg-white/8 text-slate-200 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white',
  ghost:
    'text-slate-300 hover:text-white hover:bg-white/8',
}

/** Tailwind classes for each button size */
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

/** Reusable button component with variant and size presets */
export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
