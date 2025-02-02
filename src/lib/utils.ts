import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colorMap = {
  high: "bg-red-400/20 text-red-500",
  medium: "bg-orange-400/20 text-orange-500",
  low: "bg-yellow-400/20 text-yellow-500",
}