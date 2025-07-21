import { cva } from 'class-variance-authority'
import { cn } from '../../../helpers/cn'

interface LabelBadgeProps {
  labelText: string
  variant?: 'default' | 'success' | 'warning' | 'error' | "info"
  className?: string
}

// Variantes 
const badgeVariants = cva('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset', {
  variants: {
    variant: {
      default: 'bg-purple-50 text-purple-700 ring-purple-700/20',
      success: 'bg-emerald-50 text-emerald-700 ring-emerald-700/10',
      warning: 'bg-yellow-50 text-yellow-800 ring-yellow-500/20',
      error: 'bg-red-50 text-red-800 ring-red-500/20',
      info: 'bg-sky-50 text-sky-800 ring-sky-500/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  }
})

// Label
export const LabelBadge = ({
  labelText,
  variant = 'default',
  className = "",
  ...props
}: LabelBadgeProps) => {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)} {...props}>
      {labelText}
    </span>
  )
}