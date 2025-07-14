import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...component: any) {
  return twMerge(clsx(component))
}